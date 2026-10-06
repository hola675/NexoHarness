import assert from "node:assert/strict";
import { test } from "node:test";
import { compileCodex, renderCodexAgentRoles, buildCodexManifest, renderCodexAgents, renderCodexSkills } from "../adapters/codex/index.ts";
import type { CanonicalEntityRecord } from "../tools/validate/canonical-integrity.ts";

function compile(ids = ["reviewer"]) {
  return compileCodex({ selection: ids.map(id => ({ requirement: "REQUIRED" as const, entity: {
    key: `Agent:${id}`, kind: "Agent", id, version: "0.1.0", status: "draft", file: `agents/${id}.yaml`, format: "yaml",
    document: { apiVersion: "nexoharness.dev/v1alpha1", kind: "Agent", metadata: { id, title: id, version: "0.1.0", status: "draft" },
      spec: { responsibility: "Review correctness.", triggers: ["review request"], capabilities: ["Capability:review@1.0.0"], constraints: ["Report findings."], handoff: "Escalate uncertainty.", failureBehavior: "Report missing evidence.", verification: ["Check tests."], authority: { sourceModification: "none", delegation: "none", commandExecution: "none", externalMutation: "none" } } }
  } satisfies CanonicalEntityRecord })) });
}
const decode = (content: string, key: string): string => JSON.parse(content.split("\n").find(line => line.startsWith(`${key} = `))!.slice(key.length + 3));

test("real required Agent emits preview while preserving every compilation diagnostic and authority gate", () => {
  const compilation = compile();
  const before = structuredClone(compilation);
  const result = renderCodexAgentRoles(compilation);
  assert.equal(compilation.usable, false);
  assert.equal(compilation.agentCandidates.length, 1);
  assert.equal(result.artifacts.length, 2);
  assert.equal(result.usable, false);
  assert.equal(result.deploymentEligible, false);
  assert.deepEqual(result.diagnostics, compilation.diagnostics);
  assert.equal(result.diagnostics.some(d => d.severity === "BLOCKING"), true);
  assert.deepEqual(compilation, before);
  assert.equal(renderCodexAgents(compilation).artifact, undefined);
  assert.equal(renderCodexSkills(compilation).artifacts.length, 0);
});

test("all eight fields have distinct structural, advisory or provenance-only dispositions", () => {
  const result = renderCodexAgentRoles(compile());
  const [root, child] = result.artifacts;
  assert.deepEqual(result.artifacts.map(a => a.path), [".codex/config.toml", ".codex/agents/reviewer.toml"]);
  assert.deepEqual(root.sourceRefs, ["Agent:reviewer@0.1.0"]);
  assert.deepEqual(child.sourceRefs, root.sourceRefs);
  assert.match(root.content, /\[agents.reviewer\]/);
  assert.equal(decode(root.content, "config_file"), "./agents/reviewer.toml");
  assert.match(decode(root.content, "description"), /review request/);
  assert.doesNotMatch(root.content, /Review correctness/);
  const prose = decode(child.content, "developer_instructions");
  for (const text of ["Review correctness.", "Report findings.", "Escalate uncertainty.", "Report missing evidence.", "Check tests."]) assert.ok(prose.includes(text));
  assert.doesNotMatch(prose, /review request|Capability:review|reviewer/);
  assert.match(child.content, /# Capability ref: "Capability:review@1.0.0"/);
  assert.match(child.content, /provenance only; do not grant tools or permissions/);
  assert.deepEqual(child.content.split("\n").filter(l => /^[a-z_]+ =/.test(l)).map(l => l.split(" =")[0]), ["developer_instructions"]);
  assert.deepEqual(root.content.split("\n").filter(l => /^[a-z_]+ =/.test(l)).map(l => l.split(" =")[0]), ["description", "config_file"]);
});

test("empty triggers and optional guidance do not invent role semantics", () => {
  const c = compile(); const a = c.agentCandidates[0];
  a.triggers = []; a.constraints = []; delete a.handoff; delete a.failureBehavior; delete a.verification;
  const [root, child] = renderCodexAgentRoles(c).artifacts;
  assert.match(decode(root.content, "description"), /no canonical trigger conditions/);
  assert.doesNotMatch(decode(root.content, "description"), /reviewer/);
  assert.match(decode(child.content, "developer_instructions"), /No canonical guidance supplied/);
});

test("selection reversal and repetition preserve ordinal ordering, UTF-8 LF and final newline", () => {
  const first = renderCodexAgentRoles(compile(["zeta", "alpha"]));
  assert.deepEqual(first, renderCodexAgentRoles(compile(["alpha", "zeta"])));
  assert.deepEqual(first, renderCodexAgentRoles(compile(["zeta", "alpha"])));
  assert.deepEqual(first.artifacts.map(a => a.path), [".codex/config.toml", ".codex/agents/alpha.toml", ".codex/agents/zeta.toml"]);
  for (const a of first.artifacts) { assert.equal(a.encoding, "UTF-8"); assert.ok(a.content.endsWith("\n")); assert.ok(!a.content.includes("\r")); }
});

test("TOML shared basic-string escape subset round trips Unicode and controls", () => {
  const c = compile();
  const text = 'Quotes " backslash \\ slash /\r\nTab\t\b\f\u0000\u001f\u007f ñ 😀';
  c.agentCandidates[0].responsibility = text;
  c.agentCandidates[0].triggers = [text];
  c.agentCandidates[0].capabilityRefs = [text];
  const result = renderCodexAgentRoles(c);
  assert.equal(result.artifacts.length, 2);
  assert.ok(decode(result.artifacts[1].content, "developer_instructions").includes(text.replace(/\r\n/g, "\n")));
  assert.ok(decode(result.artifacts[0].content, "description").includes(text.replace(/\r\n/g, "\n")));
  assert.ok(!result.artifacts[1].content.includes('\\/'));
});

for (const scalar of ["\ud800", "\udfff"]) {
  for (const field of ["responsibility", "triggers", "constraints", "handoff", "failureBehavior", "verification", "capabilityRefs"] as const) {
    test(`reject invalid scalar ${scalar.charCodeAt(0).toString(16)} in ${field}, atomically`, () => {
      const c = compile(["alpha", "zeta"]); const a = c.agentCandidates[1];
      if (field === "responsibility" || field === "handoff" || field === "failureBehavior") a[field] = scalar;
      else a[field] = [scalar];
      const result = renderCodexAgentRoles(c);
      assert.deepEqual(result.artifacts, []); assert.equal(result.usable, false); assert.equal(result.deploymentEligible, false);
      assert.ok(result.diagnostics.some(d => d.code === "AGENT_ROLE_UNREPRESENTABLE" && d.severity === "BLOCKING"));
    });
  }
}

test("reserved stems and unsafe role paths fail closed without normalization", () => {
  for (const name of ["con", "prn", "aux", "nul", ...Array.from({ length: 9 }, (_, i) => `com${i + 1}`), ...Array.from({ length: 9 }, (_, i) => `lpt${i + 1}`), "CON", "", "..", "../reviewer", "a/b", "a\\b", "/absolute", "C:role", "a.b", "\ud800"]) {
    const c = compile(); c.agentCandidates[0].roleName = name;
    const result = renderCodexAgentRoles(c);
    assert.deepEqual(result.artifacts, [], name); assert.equal(result.deploymentEligible, false);
  }
});

test("internal path collisions reject the whole bundle", () => {
  const c = compile(); c.agentCandidates.push(structuredClone(c.agentCandidates[0]));
  const result = renderCodexAgentRoles(c);
  assert.deepEqual(result.artifacts, []);
  assert.ok(result.diagnostics.some(d => /collision/.test(d.message)));
});

test("no invented role-name length restriction or machine-path provenance", () => {
  const id = "a".repeat(100); const c = compile([id]);
  c.agentCandidates[0].source.path = "C:/Users/private/temp/fixture.yaml";
  const result = renderCodexAgentRoles(c);
  assert.equal(result.artifacts.length, 2);
  for (const a of result.artifacts) assert.doesNotMatch(a.content, /C:|Users|private|fixture.yaml|nickname_candidates/);
});

test("compiler diagnostic payloads survive preview rendering without replacement", () => {
  const c = compile();
  const additional = { code: "AGENT_AUTHORITY_CONFLICT" as const, severity: "BLOCKING" as const, sourceRef: "Agent:reviewer@0.1.0", message: "Preserve policy/conflict details verbatim." };
  c.diagnostics.push(additional);
  const result = renderCodexAgentRoles(c);
  for (const d of c.diagnostics) assert.ok(result.diagnostics.includes(d));
  assert.equal(result.artifacts.length, 2); assert.equal(result.deploymentEligible, false);
});

test("manifest hashes previews deterministically without authorizing deployment", () => {
  const c = compile(); const result = renderCodexAgentRoles(c);
  const manifest = buildCodexManifest(c, result.artifacts);
  assert.deepEqual(manifest, buildCodexManifest(c, renderCodexAgentRoles(c).artifacts));
  assert.deepEqual(manifest.diagnostics, c.diagnostics);
  assert.equal(manifest.artifacts.length, 2); assert.equal(result.deploymentEligible, false);
});

test("empty usable compilation is an honest no-op, not a deployable Agent integration", () => {
  const c = compileCodex({ selection: [] }); const result = renderCodexAgentRoles(c);
  assert.equal(c.usable, true); assert.equal(result.usable, true); assert.equal(result.deploymentEligible, true);
  assert.deepEqual(result.artifacts, []);
});

test("real policy and authority-conflict compilations keep diagnostics alongside Agent previews", () => {
  const agent: CanonicalEntityRecord = { key: "Agent:bounded", kind: "Agent", id: "bounded", version: "0.1.0", status: "draft", file: "agents/bounded.yaml", format: "yaml", document: { kind: "Agent", metadata: { id: "bounded", version: "0.1.0" }, spec: { responsibility: "Review.", triggers: [], capabilities: [], constraints: [], authority: { sourceModification: "none", delegation: "none", commandExecution: "none", externalMutation: "none" } } } };
  const policy: CanonicalEntityRecord = { key: "Policy:required-policy", kind: "Policy", id: "required-policy", version: "0.1.0", status: "draft", file: "policies/required-policy.yaml", format: "yaml", document: { kind: "Policy", metadata: { id: "required-policy", version: "0.1.0" }, spec: {} } };
  const c = compileCodex({ selection: [{ entity: agent, requirement: "REQUIRED" }, { entity: policy, requirement: "REQUIRED" }], authorityRequirements: [{ dimension: "delegation", sourceRef: "Agent:bounded@0.1.0", requirement: "REQUIRED", requestedMode: "allowed" }] });
  const result = renderCodexAgentRoles(c);
  for (const code of ["AGENT_AUTHORITY_CONFLICT", "POLICY_ENFORCEMENT_UNSATISFIED"]) assert.ok(result.diagnostics.some(d => d.code === code && d.severity === "BLOCKING"));
  assert.deepEqual(result.diagnostics, c.diagnostics);
  assert.equal(result.artifacts.length, 2); assert.equal(result.deploymentEligible, false);
});
