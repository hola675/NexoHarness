import { test } from "node:test";
import assert from "node:assert/strict";
import { cp, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { CANONICAL_ROOTS, compareDeterministic, discoverCanonicalFiles, isCanonicalRootSymlink } from "../tools/validate/canonical-discovery.ts";
import { validateCanonicalIntegrity } from "../tools/validate/canonical-integrity.ts";
import { parseFrontmatter } from "../tools/validate/frontmatter.ts";
import { hasProhibitedCanonicalCoupling } from "../tools/validate/harness-neutrality.ts";
import { collectEntityReferences, parseEntityReference } from "../tools/validate/references.ts";
import { loadSchemaBundle } from "../tools/validate/schemas.ts";

const root = resolve(import.meta.dirname, "..");
const fixtureRoot = (name: "valid" | "invalid") => resolve(root, "tests/fixtures/canonical-graph", name);

function codes(result: Awaited<ReturnType<typeof validateCanonicalIntegrity>>): Set<string> {
  return new Set(result.diagnostics.map((diagnostic) => diagnostic.code));
}

test("current canonical roots validate as the Phase 0.2 baseline", async () => {
  const result = await validateCanonicalIntegrity();
  assert.equal(result.entityCount, 8);
  assert.deepEqual(result.diagnostics, []);
});

test("canonical discovery is recursive, typed and deterministic", async () => {
  const first = await discoverCanonicalFiles(fixtureRoot("valid"));
  const second = await discoverCanonicalFiles(fixtureRoot("valid"));
  assert.deepEqual(first.issues, []);
  assert.deepEqual(first.files.map((file) => file.relativeFile), second.files.map((file) => file.relativeFile));
  assert.deepEqual(first.files.map((file) => file.relativeFile), [...first.files.map((file) => file.relativeFile)].sort());
  assert.equal(first.files.find((file) => file.relativeFile.endsWith("core/directives/directive.md"))?.root.kind, "Directive");
  assert.equal(first.files.find((file) => file.relativeFile.endsWith("capabilities/repository-search.yaml"))?.root.kind, "Capability");
  assert.equal(first.files.some((file) => file.relativeFile.includes("observer")), false);
  assert.equal(first.files.some((file) => file.relativeFile === "observer/runtime.yaml"), false);
});

test("canonical index retains normalized Markdown bodies and leaves YAML without one", async () => {
  const result = await validateCanonicalIntegrity();
  for (const id of ["core-directive", "execution-protocol"]) {
    const record = result.index.byKey.get(`Directive:${id}`);
    assert.ok(record);
    assert.equal(record.format, "markdown");
    const source = await readFile(resolve(root, record.file), "utf8");
    const parsed = parseFrontmatter(source, resolve(root, record.file));
    assert.equal(record.markdownBody, parsed.body.replace(/\r\n?/g, "\n"));
  }
  const fixtureResult = await validateCanonicalIntegrity(await loadSchemaBundle(), fixtureRoot("valid"));
  const yamlRecord = fixtureResult.index.records.find((record) => record.format === "yaml");
  assert.ok(yamlRecord);
  assert.equal(yamlRecord.format, "yaml");
  assert.equal("markdownBody" in yamlRecord, false);
});

test("an actual observer runtime fixture is excluded from canonical discovery", async () => {
  const result = await discoverCanonicalFiles(fixtureRoot("valid"));
  assert.equal(result.files.some((file) => file.relativeFile.includes("observer/runtime.yaml")), false);
  assert.deepEqual(result.issues, []);
});

test("valid graph resolves unversioned and versioned references without rejecting a legitimate cycle", async () => {
  const result = await validateCanonicalIntegrity(await loadSchemaBundle(), fixtureRoot("valid"));
  assert.equal(result.entityCount, 11);
  assert.equal(result.index.byKey.has("Capability:repository-search"), true);
  assert.equal(result.index.byKey.has("Rule:scope-rule"), true);
  assert.equal(result.diagnostics.some((diagnostic) => diagnostic.code === "UNRESOLVED_REFERENCE"), false);
  assert.equal(result.diagnostics.some((diagnostic) => diagnostic.code === "VERSION_MISMATCH"), false);
  assert.deepEqual(result.diagnostics, []);
});

test("existing canonical roots containing only .gitkeep are accepted as empty", async () => {
  const temporaryRoot = await mkdtemp(join(tmpdir(), "nexoharness-empty-roots-"));
  try {
    for (const root of CANONICAL_ROOTS) {
      const directory = join(temporaryRoot, root.path);
      await mkdir(directory, { recursive: true });
      await writeFile(join(directory, ".gitkeep"), "");
    }
    const result = await validateCanonicalIntegrity(await loadSchemaBundle(), temporaryRoot);
    assert.equal(result.entityCount, 0);
    assert.deepEqual(result.diagnostics, []);
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});

test("invalid graph reports deterministic integrity diagnostics", async () => {
  const result = await validateCanonicalIntegrity(await loadSchemaBundle(), fixtureRoot("invalid"));
  const found = codes(result);
  for (const expected of [
    "DUPLICATE_IDENTITY",
    "UNRESOLVED_REFERENCE",
    "VERSION_MISMATCH",
    "REFERENCE_KIND_MISMATCH",
    "MALFORMED_REFERENCE",
    "PLACEMENT_MISMATCH",
    "FORMAT_MISMATCH",
    "MALFORMED_MANIFEST",
  ]) assert.equal(found.has(expected), true, expected);
  assert.equal(result.diagnostics.every((diagnostic, index, diagnostics) => index === 0 || `${diagnostics[index - 1].file}:${diagnostics[index - 1].path}:${diagnostics[index - 1].code}` <= `${diagnostic.file}:${diagnostic.path}:${diagnostic.code}`), true);
  assert.match(result.diagnostics.find((diagnostic) => diagnostic.code === "UNRESOLVED_REFERENCE")?.message ?? "", /does not exist/);
  assert.equal(result.diagnostics.some((diagnostic) => diagnostic.file.endsWith("profiles/missing.yaml") && diagnostic.code === "UNRESOLVED_REFERENCE"), true);
  assert.equal(result.diagnostics.some((diagnostic) => diagnostic.file.endsWith("rules/policy.yaml") && diagnostic.code === "PLACEMENT_MISMATCH"), true);
  assert.equal(result.diagnostics.some((diagnostic) => diagnostic.file.endsWith("profiles/malformed.yaml") && diagnostic.code === "MALFORMED_REFERENCE"), true);
  assert.equal(result.diagnostics.some((diagnostic) => diagnostic.file.endsWith("capabilities/bad-capability.yaml") && diagnostic.code === "SCHEMA_VALIDATION_FAILED"), true);
  assert.equal(result.index.byKey.has("Capability:bad-capability"), false);
  assert.equal(result.diagnostics.some((diagnostic) => diagnostic.file.endsWith("profiles/missing.yaml") && diagnostic.reference === "Capability:bad-capability" && diagnostic.code === "UNRESOLVED_REFERENCE"), true);
});

test("canonical index does not use filenames as identity", async () => {
  const result = await validateCanonicalIntegrity(await loadSchemaBundle(), fixtureRoot("valid"));
  const scopeRecords = result.index.records.filter((record) => record.id === "scope-rule");
  assert.deepEqual(scopeRecords.map((record) => record.kind).sort(), ["Rule", "Skill"]);
});

test("reference parsing is strict only when a semantic field declares a reference", () => {
  const malformed = parseEntityReference("Agent:bad id", "/spec/agent");
  assert.equal(malformed && "message" in malformed ? malformed.message : "", "reference id must be kebab-case");
  const provenance = collectEntityReferences({ metadata: { provenanceRefs: ["source:upstream-research"] } }, "Directive");
  assert.deepEqual(provenance, { references: [], issues: [] });
  const prose = collectEntityReferences({ spec: { purpose: "Agent: this procedure explains responsibility." } }, "Skill");
  assert.deepEqual(prose, { references: [], issues: [] });
});

test("canonical behavior rejects Codex coupling", async () => {
  assert.equal(hasProhibitedCanonicalCoupling("Codex"), true);
  const temporaryRoot = await mkdtemp(join(tmpdir(), "nexoharness-neutrality-"));
  try {
    await cp(fixtureRoot("valid"), temporaryRoot, { recursive: true });
    const skillPath = join(temporaryRoot, "skills", "search.md");
    const skill = await readFile(skillPath, "utf8");
    await writeFile(skillPath, skill.replace("Agent: this procedure explains responsibility.", "Codex explains responsibility."));
    const result = await validateCanonicalIntegrity(await loadSchemaBundle(), temporaryRoot);
    assert.equal(result.diagnostics.some((diagnostic) => diagnostic.file.endsWith("skills/search.md") && diagnostic.code === "SCHEMA_VALIDATION_FAILED"), true);
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});

test("canonical ordering is locale-independent and root symlinks are unsafe", () => {
  assert.equal(compareDeterministic("Z", "a"), -1);
  assert.equal(compareDeterministic("a", "Z"), 1);
  assert.equal(compareDeterministic("same", "same"), 0);
  assert.equal(isCanonicalRootSymlink({ isSymbolicLink: () => true }), true);
  assert.equal(isCanonicalRootSymlink({ isSymbolicLink: () => false }), false);
});
