import { test } from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { discoverCanonicalFiles } from "../tools/validate/canonical-discovery.ts";
import { validateCanonicalIntegrity } from "../tools/validate/canonical-integrity.ts";
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
});

test("valid graph resolves unversioned and versioned references without rejecting a legitimate cycle", async () => {
  const result = await validateCanonicalIntegrity(await loadSchemaBundle(), fixtureRoot("valid"));
  assert.equal(result.entityCount, 11);
  assert.deepEqual(result.diagnostics, []);
  assert.equal(result.index.byKey.has("Capability:repository-search"), true);
  assert.equal(result.index.byKey.has("Rule:scope-rule"), true);
});

test("invalid graph reports deterministic integrity diagnostics", async () => {
  const result = await validateCanonicalIntegrity(await loadSchemaBundle(), fixtureRoot("invalid"));
  const found = codes(result);
  for (const expected of [
    "DUPLICATE_IDENTITY",
    "UNRESOLVED_REFERENCE",
    "VERSION_MISMATCH",
    "REFERENCE_KIND_MISMATCH",
    "FORMAT_MISMATCH",
    "MALFORMED_MANIFEST",
  ]) assert.equal(found.has(expected), true, expected);
  assert.equal(result.diagnostics.every((diagnostic, index, diagnostics) => index === 0 || `${diagnostics[index - 1].file}:${diagnostics[index - 1].path}:${diagnostics[index - 1].code}` <= `${diagnostic.file}:${diagnostic.path}:${diagnostic.code}`), true);
  assert.match(result.diagnostics.find((diagnostic) => diagnostic.code === "UNRESOLVED_REFERENCE")?.message ?? "", /does not exist/);
});

test("canonical index does not use filenames as identity", async () => {
  const result = await validateCanonicalIntegrity(await loadSchemaBundle(), fixtureRoot("valid"));
  const scopeRecords = result.index.records.filter((record) => record.id === "scope-rule");
  assert.deepEqual(scopeRecords.map((record) => record.kind).sort(), ["Rule", "Skill"]);
});
