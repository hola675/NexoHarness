import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { buildCodexManifest, compileCodex, renderCodexAgents, sha256Content } from "../adapters/codex/index.ts";
import type { CodexCompilation, InstructionCandidate } from "../adapters/codex/index.ts";
import type { CanonicalEntityRecord } from "../tools/validate/canonical-integrity.ts";
import type { CanonicalKind } from "../tools/validate/schemas.ts";
import { validateCanonicalIntegrity } from "../tools/validate/canonical-integrity.ts";

const budget = 256 * 1024;
const selected = (entity: CanonicalEntityRecord) => ({
  entity,
  requirement: "REQUIRED" as const,
});

function record(kind: CanonicalKind, id: string): CanonicalEntityRecord {
  return {
    key: `${kind}:${id}`,
    kind,
    id,
    version: "0.1.0",
    status: "draft",
    file: `workflows/${id}.yaml`,
    format: "yaml",
    document: {
      apiVersion: "nexoharness.dev/v1alpha1",
      kind,
      metadata: { id, title: id, version: "0.1.0", status: "draft" },
      spec: {},
    },
  };
}

async function realDirectiveCompilation(reverse = false): Promise<CodexCompilation> {
  const validated = await validateCanonicalIntegrity();
  const core = validated.index.byKey.get("Directive:core-directive");
  const protocol = validated.index.byKey.get("Directive:execution-protocol");
  assert.ok(core);
  assert.ok(protocol);
  const entities = reverse ? [protocol, core] : [core, protocol];
  return compileCodex({ selection: entities.map(selected) });
}

function render(compilation: CodexCompilation, instructionBudgetBytes = budget) {
  return renderCodexAgents(compilation, { instructionBudgetBytes });
}

test("renderer consumes CodexCompilation only and does not parse or discover source files", async () => {
  const source = readFileSync(new URL("../adapters/codex/render-agents.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /CanonicalEntityRecord|readFile|parseFrontmatter|discoverCanonicalFiles|node:fs/);
  const result = render(await realDirectiveCompilation());
  assert.equal(result.usable, true);
});

test("renderer returns an in-memory AGENTS.md artifact without writing it", async () => {
  const result = render(await realDirectiveCompilation());
  assert.equal(result.artifact?.path, "AGENTS.md");
  assert.equal(result.artifact?.encoding, "UTF-8");
});

test("rendered content uses UTF-8 bytes, LF line endings, and a final newline", async () => {
  const compilation = await realDirectiveCompilation();
  const unicodeCandidate = {
    ...compilation.instructionCandidates[0],
    content: `${compilation.instructionCandidates[0].content}\nUTF-8 check: ñ 🙂\r\n`,
  };
  const result = render({ ...compilation, instructionCandidates: [unicodeCandidate, ...compilation.instructionCandidates.slice(1)] });
  assert.equal(result.usable, true);
  assert.ok(result.artifact);
  assert.equal(result.artifact.content.includes("\r"), false);
  assert.equal(result.artifact.content.endsWith("\n"), true);
  assert.equal(result.byteLength, new TextEncoder().encode(result.artifact.content).byteLength);
  assert.ok(result.byteLength > result.artifact.content.length, "UTF-8 byte count accounts for multibyte characters");
});

test("generated-file notice identifies the authoritative canonical source", async () => {
  const { artifact } = render(await realDirectiveCompilation());
  assert.ok(artifact);
  assert.match(artifact.content, /NexoHarness generated artifact\. Do not edit manually\./);
  assert.match(artifact.content, /Canonical source is authoritative/);
  assert.match(artifact.content, /regenerate this copy from canonical sources/);
});

test("Core Directive and Execution Protocol provenance comments are present", async () => {
  const { artifact } = render(await realDirectiveCompilation());
  assert.ok(artifact);
  assert.match(artifact.content, /<!-- Source: Directive:core-directive@0\.1\.0 -->/);
  assert.match(artifact.content, /<!-- Source: Directive:execution-protocol@0\.1\.0 -->/);
});

test("Core Directive appears before Execution Protocol", async () => {
  const { artifact } = render(await realDirectiveCompilation(true));
  assert.ok(artifact);
  assert.ok(artifact.content.indexOf("<!-- Source: Directive:core-directive@0.1.0 -->") <
    artifact.content.indexOf("<!-- Source: Directive:execution-protocol@0.1.0 -->"));
});

test("canonical Directive bodies are preserved intact in rendered sections", async () => {
  const compilation = await realDirectiveCompilation();
  const { artifact } = render(compilation);
  assert.ok(artifact);
  for (const candidate of compilation.instructionCandidates) {
    assert.ok(artifact.content.includes(candidate.content), candidate.source.ref);
  }
});

test("repeated rendering is byte-identical", async () => {
  const compilation = await realDirectiveCompilation();
  const first = render(compilation);
  const second = render(compilation);
  assert.equal(first.artifact?.content, second.artifact?.content);
});

test("reversing source selection produces identical AGENTS.md", async () => {
  const left = render(await realDirectiveCompilation());
  const right = render(await realDirectiveCompilation(true));
  assert.equal(left.artifact?.content, right.artifact?.content);
});

test("missing instruction budget blocks rendering", async () => {
  const result = renderCodexAgents(await realDirectiveCompilation());
  assert.equal(result.usable, false);
  assert.equal(result.artifact, undefined);
  assert.equal(result.diagnostics[0].code, "INSTRUCTION_BUDGET_UNKNOWN");
});

test("zero, negative, and non-integer budgets block rendering", async () => {
  const compilation = await realDirectiveCompilation();
  for (const instructionBudgetBytes of [0, -1, 1.5]) {
    const result = render(compilation, instructionBudgetBytes);
    assert.equal(result.usable, false);
    assert.equal(result.diagnostics[0].code, "INSTRUCTION_BUDGET_UNKNOWN");
  }
});

test("exact and adequate UTF-8 byte budgets succeed", async () => {
  const compilation = await realDirectiveCompilation();
  const measured = render(compilation);
  assert.ok(measured.byteLength);
  assert.equal(render(compilation, measured.byteLength).usable, true);
  assert.equal(render(compilation, measured.byteLength + 1).usable, true);
});

test("budget overflow blocks without truncating content", async () => {
  const compilation = await realDirectiveCompilation();
  const measured = render(compilation);
  assert.ok(measured.byteLength);
  const overflow = render(compilation, measured.byteLength - 1);
  assert.equal(overflow.usable, false);
  assert.equal(overflow.artifact, undefined);
  assert.equal(overflow.byteLength, measured.byteLength);
  assert.equal(overflow.diagnostics[0].code, "INSTRUCTION_BUDGET_EXCEEDED");
  assert.equal(overflow.diagnostics[0].severity, "BLOCKING");
});

test("unusable CodexCompilation cannot render a usable artifact", () => {
  const compilation = compileCodex({ selection: [], target: { version: "unverified" } });
  const result = render(compilation);
  assert.equal(compilation.usable, false);
  assert.equal(result.usable, false);
  assert.equal(result.artifact, undefined);
  assert.equal(result.diagnostics[0].code, "COMPILATION_UNUSABLE");
});

test("no instruction candidates cannot produce boilerplate-only success", () => {
  const result = render(compileCodex({ selection: [] }));
  assert.equal(result.usable, false);
  assert.equal(result.artifact, undefined);
  assert.equal(result.diagnostics[0].code, "NO_RENDERABLE_INSTRUCTIONS");
});

test("artifact provenance contains only ordered, deduplicated instruction sources", async () => {
  const validated = await validateCanonicalIntegrity();
  const unrelated = validated.index.byKey.get("Policy:completion");
  const core = validated.index.byKey.get("Directive:core-directive");
  const protocol = validated.index.byKey.get("Directive:execution-protocol");
  assert.ok(unrelated);
  assert.ok(core);
  assert.ok(protocol);
  const withUnrelated = compileCodex({ selection: [
    selected(core),
    selected(protocol),
    { entity: unrelated, requirement: "OPTIONAL", allowDegradation: true },
  ] });
  assert.equal(withUnrelated.usable, true);
  const { artifact } = render(withUnrelated);
  assert.ok(artifact);
  assert.deepEqual(artifact.sourceRefs, [
    "Directive:core-directive@0.1.0",
    "Directive:execution-protocol@0.1.0",
  ]);
  const duplicateCandidate = withUnrelated.instructionCandidates[0];
  const withDuplicate = {
    ...withUnrelated,
    instructionCandidates: [...withUnrelated.instructionCandidates, duplicateCandidate],
  };
  const duplicateRendered = render(withDuplicate);
  assert.ok(duplicateRendered.artifact);
  assert.equal(new Set(duplicateRendered.artifact.sourceRefs).size, duplicateRendered.artifact.sourceRefs.length);
});

test("manifest SHA-256 matches the exact UTF-8 AGENTS.md bytes", async () => {
  const compilation = await realDirectiveCompilation();
  const { artifact } = render(compilation);
  assert.ok(artifact);
  const manifest = buildCodexManifest(compilation, [{ path: artifact.path, content: artifact.content }]);
  const entry = manifest.artifacts.find(({ path }) => path === "AGENTS.md");
  assert.ok(entry);
  assert.equal(entry.sha256, sha256Content(new TextEncoder().encode(artifact.content)));
});

test("renderer notice makes the prompt-only enforcement boundary explicit", async () => {
  const compilation = await realDirectiveCompilation();
  const authorityBefore = structuredClone(compilation.authorityMappings);
  const runtimeBefore = structuredClone(compilation.runtimeDependencies);
  const { artifact } = render(compilation);
  assert.ok(artifact);
  assert.match(artifact.content, /Prompt-level guidance only/);
  assert.match(artifact.content, /does not enforce policy or permissions/);
  assert.deepEqual(compilation.authorityMappings, authorityBefore);
  assert.deepEqual(compilation.runtimeDependencies, runtimeBefore);
});

test("renderer does not emit Workflow runtime semantics", async () => {
  const validated = await validateCanonicalIntegrity();
  const directive = validated.index.byKey.get("Directive:core-directive");
  const workflow = record("Workflow", "task-lifecycle");
  assert.ok(directive);
  assert.ok(workflow);
  const compilation = compileCodex({ selection: [
    { entity: directive, requirement: "REQUIRED" },
    { entity: workflow, requirement: "OPTIONAL", allowDegradation: true },
  ] });
  assert.equal(compilation.usable, true);
  const { artifact } = render(compilation);
  assert.ok(artifact);
  assert.equal(artifact.content.includes("Workflow:"), false);
  assert.deepEqual(artifact.sourceRefs, ["Directive:core-directive@0.1.0"]);
});

test("additional Directive candidates use stable ordinal ordering after universal directives", async () => {
  const compilation = await realDirectiveCompilation();
  const core = compilation.instructionCandidates[0];
  const additional: InstructionCandidate = {
    ...core,
    source: { ...core.source, id: "alpha-extra", ref: "Directive:alpha-extra@0.1.0", path: "core/directives/alpha-extra.md" },
    content: "# Additional Directive\n",
  };
  const withAdditional = { ...compilation, instructionCandidates: [...compilation.instructionCandidates, additional] };
  const { artifact } = render(withAdditional);
  assert.ok(artifact);
  const coreIndex = artifact.content.indexOf("<!-- Source: Directive:core-directive@0.1.0 -->");
  const protocolIndex = artifact.content.indexOf("<!-- Source: Directive:execution-protocol@0.1.0 -->");
  const additionalIndex = artifact.content.indexOf("<!-- Source: Directive:alpha-extra@0.1.0 -->");
  assert.ok(coreIndex < protocolIndex && protocolIndex < additionalIndex);
});
