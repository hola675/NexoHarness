import assert from "node:assert/strict";
import { test } from "node:test";
import { validateCanonicalIntegrity } from "../tools/validate/canonical-integrity.ts";
import type { CanonicalEntityRecord } from "../tools/validate/canonical-integrity.ts";
import type { CanonicalKind } from "../tools/validate/schemas.ts";
import type { AgentCandidate } from "../adapters/codex/index.ts";
import { buildCodexManifest, compileCodex, evaluateAuthorityCrosswalk, evaluateUntranslatedDisposition, KIND_DISPOSITIONS, serializeCodexManifest, sha256Content, CODEX_ADAPTER, CODEX_TARGET } from "../adapters/codex/index.ts";

const kinds = [
  "Directive", "Policy", "Agent", "Skill", "Rule", "Workflow", "Contract", "Capability",
  "Profile", "Enforcement", "Evaluation", "Observation", "ImprovementProposal",
] as const satisfies readonly CanonicalKind[];

function record(kind: CanonicalKind, id: string, file = `core/test/${id}.yaml`, spec: Record<string, unknown> = {}): CanonicalEntityRecord {
  return {
    key: `${kind}:${id}`,
    kind,
    id,
    version: "0.1.0",
    status: "draft",
    file,
    format: file.endsWith(".md") ? "markdown" : "yaml",
    ...(file.endsWith(".md") ? { markdownBody: `# ${id}\n` } : {}),
    document: {
      apiVersion: "nexoharness.dev/v1alpha1",
      kind,
      metadata: { id, title: id, version: "0.1.0", status: "draft" },
      spec,
    },
  };
}

const selected = (entity: CanonicalEntityRecord, requirement: "REQUIRED" | "OPTIONAL" = "REQUIRED", allowDegradation = false) => ({
  entity,
  requirement,
  allowDegradation,
});

test("target metadata is pinned to the accepted Codex baseline", () => {
  assert.deepEqual(CODEX_TARGET, { surface: "codex-local-cli", version: "0.160.0", tag: "rust-v0.160.0" });
  assert.equal(CODEX_ADAPTER.id, "nexoharness-codex-adapter");
  assert.match(CODEX_ADAPTER.version, /^\d+\.\d+\.\d+$/);
});

test("all 13 canonical kinds have the accepted deterministic disposition", () => {
  assert.deepEqual(Object.keys(KIND_DISPOSITIONS).sort(), [...kinds].sort());
  assert.deepEqual(KIND_DISPOSITIONS, {
    Directive: "COMPOSED_TRANSLATION", Policy: "CONDITIONAL_TRANSLATION", Agent: "COMPOSED_TRANSLATION",
    Skill: "CONDITIONAL_TRANSLATION", Rule: "CONDITIONAL_TRANSLATION", Workflow: "NEXO_RUNTIME_ONLY",
    Contract: "NEXO_RUNTIME_ONLY", Capability: "CONDITIONAL_TRANSLATION", Profile: "COMPOSED_TRANSLATION",
    Enforcement: "CONDITIONAL_TRANSLATION", Evaluation: "CONDITIONAL_TRANSLATION", Observation: "NO_TARGET_ARTIFACT",
    ImprovementProposal: "NO_TARGET_ARTIFACT",
  });
});

test("all four authority dimensions retain the accepted crosswalk values", () => {
  const compilation = compileCodex({
    selection: [],
    authorityRequirements: [
      { dimension: "sourceModification", requirement: "OPTIONAL", allowDegradation: true },
      { dimension: "delegation", requirement: "OPTIONAL", allowDegradation: true },
      { dimension: "commandExecution", requirement: "OPTIONAL", allowDegradation: true },
      { dimension: "externalMutation", requirement: "OPTIONAL", allowDegradation: true },
    ],
  });
  assert.deepEqual(compilation.authorityMappings.map(({ dimension, crosswalk }) => [dimension, crosswalk]), [
    ["commandExecution", "PARTIAL"],
    ["delegation", "UNKNOWN"],
    ["externalMutation", "PARTIAL"],
    ["sourceModification", "PARTIAL"],
  ]);
});

test("selection ordering does not affect compilation or manifest serialization", () => {
  const a = selected(record("Directive", "alpha", "core/directives/alpha.md"));
  const b = selected(record("Capability", "beta", "capabilities/beta.yaml"));
  const left = compileCodex({
    selection: [a, b],
    authorityRequirements: [
      { dimension: "sourceModification", requirement: "REQUIRED" },
      { dimension: "delegation", requirement: "OPTIONAL", allowDegradation: true },
    ],
  });
  const right = compileCodex({
    selection: [b, a],
    authorityRequirements: [
      { dimension: "delegation", requirement: "OPTIONAL", allowDegradation: true },
      { dimension: "sourceModification", requirement: "REQUIRED" },
    ],
  });
  assert.deepEqual(left, right);
  assert.equal(serializeCodexManifest(buildCodexManifest(left)), serializeCodexManifest(buildCodexManifest(right)));
});

test("duplicate canonical identity is deterministically blocked", () => {
  const compilation = compileCodex({ selection: [
    selected(record("Directive", "same", "core/directives/first.md")),
    selected(record("Directive", "same", "core/directives/second.md")),
  ] });
  assert.equal(compilation.usable, false);
  assert.equal(compilation.diagnostics.some((item) => item.code === "DUPLICATE_SOURCE_IDENTITY" && item.severity === "BLOCKING"), true);
});

test("source references retain Kind:id@version and repository-relative paths", () => {
  const compilation = compileCodex({ selection: [selected(record("Directive", "core-directive", "core\\directives\\core-directive.md"))] });
  assert.deepEqual(compilation.sourceRefs.map(({ ref, path }) => [ref, path]), [["Directive:core-directive@0.1.0", "core/directives/core-directive.md"]]);
});

test("absolute machine paths are rejected and never enter provenance", () => {
  const compilation = compileCodex({ selection: [selected(record("Directive", "private", "C:\\Users\\Admin\\private.md"))] });
  assert.equal(compilation.usable, false);
  assert.equal(compilation.sourceRefs.length, 0);
  assert.equal(compilation.diagnostics.some((item) => item.code === "SOURCE_REFERENCE_INVALID"), true);
});

test("an unverified target version produces a blocking diagnostic", () => {
  const compilation = compileCodex({ selection: [], target: { version: "0.161.0" } });
  assert.equal(compilation.usable, false);
  assert.equal(compilation.diagnostics.some((item) => item.code === "TARGET_VERSION_UNVERIFIED" && item.severity === "BLOCKING"), true);
});

test("required PARTIAL authority makes the compilation unusable", () => {
  const compilation = compileCodex({ selection: [], authorityRequirements: [{ dimension: "sourceModification", requirement: "REQUIRED" }] });
  assert.equal(compilation.authorityMappings[0].crosswalk, "PARTIAL");
  assert.equal(compilation.usable, false);
  assert.equal(compilation.diagnostics.some((item) => item.code === "AUTHORITY_MAPPING_PARTIAL" && item.severity === "BLOCKING"), true);
});

test("required UNKNOWN authority makes the compilation unusable", () => {
  const compilation = compileCodex({ selection: [], authorityRequirements: [{ dimension: "delegation", requirement: "REQUIRED" }] });
  assert.equal(compilation.authorityMappings[0].crosswalk, "UNKNOWN");
  assert.equal(compilation.usable, false);
  assert.equal(compilation.diagnostics.some((item) => item.code === "AUTHORITY_UNREPRESENTABLE" && item.severity === "BLOCKING"), true);
});

test("every non-STRONG required authority crosswalk is blocking", () => {
  for (const crosswalk of ["PARTIAL", "ADVISORY", "UNREPRESENTABLE", "UNKNOWN"] as const) {
    const diagnostic = evaluateAuthorityCrosswalk(crosswalk, "REQUIRED");
    assert.equal(diagnostic?.severity, "BLOCKING", crosswalk);
  }
});

test("required UNSUPPORTED and UNKNOWN dispositions block with distinct diagnostics", () => {
  const unsupported = evaluateUntranslatedDisposition("UNSUPPORTED", "REQUIRED", "Agent:unsupported@0.1.0");
  const unknown = evaluateUntranslatedDisposition("UNKNOWN", "REQUIRED", "Agent:unknown@0.1.0");
  assert.equal(unsupported.severity, "BLOCKING");
  assert.equal(unsupported.code, "TARGET_FEATURE_UNSUPPORTED");
  assert.equal(unknown.severity, "BLOCKING");
  assert.equal(unknown.code, "TARGET_FEATURE_UNKNOWN");
});

test("optional UNSUPPORTED and UNKNOWN require explicit degradation and retain distinct codes", () => {
  const cases = [
    ["UNSUPPORTED", false, "TARGET_FEATURE_UNSUPPORTED", "BLOCKING"],
    ["UNKNOWN", false, "TARGET_FEATURE_UNKNOWN", "BLOCKING"],
    ["UNSUPPORTED", true, "TARGET_FEATURE_UNSUPPORTED", "WARNING"],
    ["UNKNOWN", true, "TARGET_FEATURE_UNKNOWN", "WARNING"],
  ] as const;
  for (const [disposition, allowDegradation, code, severity] of cases) {
    const diagnostic = evaluateUntranslatedDisposition(disposition, "OPTIONAL", "Agent:optional@0.1.0", allowDegradation);
    assert.equal(diagnostic.code, code);
    assert.equal(diagnostic.severity, severity);
  }
});

test("duplicate identical caller authority requests are rejected", () => {
  const duplicate = { dimension: "sourceModification" as const, requirement: "REQUIRED" as const };
  const compilation = compileCodex({ selection: [], authorityRequirements: [duplicate, { ...duplicate }] });
  assert.equal(compilation.usable, false);
  assert.equal(compilation.diagnostics.some(({ code, severity }) => code === "DUPLICATE_AUTHORITY_REQUIREMENT" && severity === "BLOCKING"), true);
});

test("conflicting caller authority requests are blocked and input order does not affect output", () => {
  const agent = record("Agent", "deterministic", "agents/deterministic.md", {
    authority: { sourceModification: "allowed", delegation: "allowed", commandExecution: "allowed", externalMutation: "allowed" },
  });
  const selection = [selected(agent, "OPTIONAL", true)];
  const leftRequest = [
    { dimension: "sourceModification" as const, requirement: "OPTIONAL" as const, allowDegradation: true, sourceRef: "Agent:deterministic@0.1.0", requestedMode: "scoped" as const },
    { dimension: "sourceModification" as const, requirement: "OPTIONAL" as const, allowDegradation: false, sourceRef: "Agent:deterministic@0.1.0", requestedMode: "allowed" as const },
  ];
  const left = compileCodex({ selection, authorityRequirements: leftRequest });
  const right = compileCodex({ selection, authorityRequirements: [...leftRequest].reverse() });
  assert.deepEqual(left, right);
  assert.equal(left.usable, false);
  assert.equal(left.diagnostics.some(({ code, severity }) => code === "DUPLICATE_AUTHORITY_REQUIREMENT" && severity === "BLOCKING"), true);
});

test("optional PARTIAL authority requires explicit degradation and a warning", () => {
  const denied = compileCodex({ selection: [], authorityRequirements: [{ dimension: "commandExecution", requirement: "OPTIONAL" }] });
  assert.equal(denied.usable, false);
  const allowed = compileCodex({ selection: [], authorityRequirements: [{ dimension: "commandExecution", requirement: "OPTIONAL", allowDegradation: true }] });
  assert.equal(allowed.usable, true);
  assert.equal(allowed.diagnostics.some((item) => item.code === "AUTHORITY_MAPPING_PARTIAL" && item.severity === "WARNING"), true);
});

test("authority requirement cannot override a selection that forbids degradation", () => {
  const agent = record("Agent", "limited-agent", "agents/limited-agent.md");
  const compilation = compileCodex({
    selection: [selected(agent, "OPTIONAL", false)],
    authorityRequirements: [{
      dimension: "sourceModification",
      requirement: "OPTIONAL",
      allowDegradation: true,
      sourceRef: "Agent:limited-agent@0.1.0",
    }],
  });
  assert.equal(compilation.usable, false);
});

test("advisory policy prose cannot satisfy required enforcement", () => {
  const policy = record("Policy", "safe-policy", "core/policies/safe-policy.md");
  const compilation = compileCodex({
    selection: [selected(policy)],
    policyRequirements: [{
      sourceRef: "Policy:safe-policy@0.1.0",
      requirement: "REQUIRED",
      requiredStrength: "HARD_ENFORCEMENT",
      verifiedTargetStrength: "PROMPT_ADVISORY_ONLY",
      nexoRuntimeEnforcement: false,
    }],
  });
  assert.equal(compilation.usable, false);
  assert.equal(compilation.diagnostics.some((item) => item.code === "POLICY_ENFORCEMENT_UNSATISFIED" && item.severity === "BLOCKING"), true);
  const enforced = compileCodex({
    selection: [selected(policy)],
    policyRequirements: [{
      sourceRef: "Policy:safe-policy@0.1.0",
      requirement: "REQUIRED",
      requiredStrength: "RUNTIME_GATE",
      verifiedTargetStrength: "RUNTIME_GATE",
      nexoRuntimeEnforcement: false,
    }],
  });
  assert.equal(enforced.usable, true);
});

test("a required Policy without an explicit enforcement assessment is blocked", () => {
  const compilation = compileCodex({ selection: [selected(record("Policy", "unassessed-policy"))] });
  assert.equal(compilation.usable, false);
  assert.equal(compilation.diagnostics.some((item) => item.code === "POLICY_ENFORCEMENT_UNSATISFIED" && item.severity === "BLOCKING"), true);
});

test("a policy enforcement assessment cannot weaken a required selection", () => {
  const compilation = compileCodex({
    selection: [selected(record("Policy", "required-policy"))],
    policyRequirements: [{
      sourceRef: "Policy:required-policy@0.1.0",
      requirement: "OPTIONAL",
      requiredStrength: "RUNTIME_GATE",
      nexoRuntimeEnforcement: true,
    }],
  });
  assert.equal(compilation.usable, false);
});

test("policy assessment cannot override a selection that forbids degradation", () => {
  const policy = record("Policy", "optional-policy", "core/policies/optional-policy.md");
  const compilation = compileCodex({
    selection: [selected(policy, "OPTIONAL", false)],
    policyRequirements: [{
      sourceRef: "Policy:optional-policy@0.1.0",
      requirement: "OPTIONAL",
      requiredStrength: "HARD_ENFORCEMENT",
      verifiedTargetStrength: "PROMPT_ADVISORY_ONLY",
      nexoRuntimeEnforcement: false,
      allowDegradation: true,
    }],
  });
  assert.equal(compilation.usable, false);
});

test("Observation has NO_TARGET_ARTIFACT without unsupported diagnostics or degradation", () => {
  const compilation = compileCodex({ selection: [selected(record("Observation", "signal"))] });
  assert.equal(compilation.translations[0].disposition, "NO_TARGET_ARTIFACT");
  assert.equal(compilation.translations[0].targetArtifact, "NONE");
  assert.equal(compilation.diagnostics.some((item) => item.code === "TARGET_FEATURE_UNSUPPORTED"), false);
  assert.equal(compilation.usable, true);
});

test("ImprovementProposal has intentional NO_TARGET_ARTIFACT disposition", () => {
  const compilation = compileCodex({ selection: [selected(record("ImprovementProposal", "proposal"))] });
  assert.equal(compilation.translations[0].disposition, "NO_TARGET_ARTIFACT");
  assert.equal(compilation.translations[0].targetArtifact, "NONE");
  assert.equal(compilation.diagnostics.some((item) => item.code === "TARGET_FEATURE_UNSUPPORTED"), false);
  assert.equal(compilation.usable, true);
});

test("required Workflow records an unsatisfied Nexo runtime dependency", () => {
  const compilation = compileCodex({ selection: [selected(record("Workflow", "workflow"))] });
  assert.equal(compilation.translations[0].disposition, "NEXO_RUNTIME_ONLY");
  assert.equal(compilation.translations[0].targetArtifact, "NONE");
  assert.deepEqual(compilation.runtimeDependencies, [{ sourceRef: "Workflow:workflow@0.1.0", kind: "Workflow", requirement: "REQUIRED", satisfied: false }]);
  assert.equal(compilation.diagnostics.some((item) => item.code === "NEXO_RUNTIME_REQUIRED" && item.severity === "BLOCKING"), true);
  assert.equal(compilation.diagnostics.some((item) => item.code === "TARGET_FEATURE_UNSUPPORTED"), false);
});

test("optional Workflow can be omitted only with explicit degradation", () => {
  const denied = compileCodex({ selection: [selected(record("Workflow", "workflow"), "OPTIONAL", false)] });
  const allowed = compileCodex({ selection: [selected(record("Workflow", "workflow"), "OPTIONAL", true)] });
  assert.equal(denied.diagnostics.some((item) => item.code === "NEXO_RUNTIME_REQUIRED" && item.severity === "BLOCKING"), true);
  assert.equal(allowed.diagnostics.some((item) => item.code === "NEXO_RUNTIME_REQUIRED" && item.severity === "WARNING"), true);
  assert.equal(allowed.usable, true);
});

test("Skill selection does not derive authority mappings", () => {
  const compilation = compileCodex({ selection: [selected(record("Skill", "bounded-skill"))] });
  assert.deepEqual(compilation.authorityMappings, []);
});

function validAgent(id: string, authority: Record<string, unknown> = { sourceModification: "none", delegation: "none", commandExecution: "none", externalMutation: "none" }): CanonicalEntityRecord {
  return record("Agent", id, `agents/${id}.yaml`, {
    responsibility: "Review changes for correctness.",
    authority,
    triggers: ["review request", "pull request"],
    capabilities: ["Capability:code-review@1.0.0", "Capability:test-runner@2.0.0"],
    constraints: ["Do not modify source without approval."],
    handoff: "Escalate unresolved findings.",
    failureBehavior: "Report unavailable evidence.",
    verification: ["Check affected tests."],
  });
}

test("valid Agent projects exactly the authority-free AgentCandidate semantics", () => {
  const compilation = compileCodex({ selection: [selected(validAgent("reviewer"))] });
  assert.equal(compilation.agentCandidates.length, 1);
  assert.deepEqual(compilation.agentCandidates[0], {
    source: { kind: "Agent", id: "reviewer", version: "0.1.0", ref: "Agent:reviewer@0.1.0", path: "agents/reviewer.yaml" },
    requirement: "REQUIRED",
    roleName: "reviewer",
    responsibility: "Review changes for correctness.",
    triggers: ["review request", "pull request"],
    capabilityRefs: ["Capability:code-review@1.0.0", "Capability:test-runner@2.0.0"],
    constraints: ["Do not modify source without approval."],
    handoff: "Escalate unresolved findings.",
    failureBehavior: "Report unavailable evidence.",
    verification: ["Check affected tests."],
  } satisfies AgentCandidate);
});

test("AgentCandidate excludes authority dimensions and target-specific execution fields", () => {
  const candidate = compileCodex({ selection: [selected(validAgent("reviewer"))] }).agentCandidates[0];
  for (const forbidden of ["authority", "sourceModification", "delegation", "commandExecution", "externalMutation", "permissions", "sandbox", "tools", "provider", "model", "config_file", "developer_instructions"]) {
    assert.equal(Object.hasOwn(candidate, forbidden), false, forbidden);
  }
});

test("changing Agent authority changes mappings but not AgentCandidate", () => {
  const content = validAgent("authority-check");
  const alternate = structuredClone(content);
  (alternate.document.spec as Record<string, unknown>).authority = { sourceModification: "allowed", delegation: "scoped", commandExecution: "allowed", externalMutation: "allowed" };
  const left = compileCodex({ selection: [selected(content)] });
  const right = compileCodex({ selection: [selected(alternate)] });
  assert.deepEqual(left.agentCandidates, right.agentCandidates);
  assert.notDeepEqual(left.authorityMappings, right.authorityMappings);
});

test("Agent capabilities remain verbatim abstract capability references", () => {
  const candidate = compileCodex({ selection: [selected(validAgent("capability-boundary"))] }).agentCandidates[0];
  assert.deepEqual(candidate.capabilityRefs, ["Capability:code-review@1.0.0", "Capability:test-runner@2.0.0"]);
  assert.equal(JSON.stringify(candidate).includes("tool"), false);
  assert.equal(Object.hasOwn(candidate, "provider"), false);
});

test("AgentCandidate ordering is deterministic under reversed selection", () => {
  const agents = [selected(validAgent("zeta")), selected(validAgent("alpha"))];
  const forward = compileCodex({ selection: agents }).agentCandidates;
  const reverse = compileCodex({ selection: [...agents].reverse() }).agentCandidates;
  assert.deepEqual(forward, reverse);
  assert.deepEqual(forward.map(({ roleName }) => roleName), ["alpha", "zeta"]);
});

test("optional Agent semantics remain absent when unspecified", () => {
  const agent = record("Agent", "minimal", "agents/minimal.yaml", {
    responsibility: "Review changes.", triggers: [], capabilities: [], constraints: [],
    authority: { sourceModification: "none", delegation: "none", commandExecution: "none", externalMutation: "none" },
  });
  const candidate = compileCodex({ selection: [selected(agent)] }).agentCandidates[0];
  assert.equal(Object.hasOwn(candidate, "handoff"), false);
  assert.equal(Object.hasOwn(candidate, "failureBehavior"), false);
  assert.equal(Object.hasOwn(candidate, "verification"), false);
});

test("malformed Agent semantic content is blocking and creates no candidate", () => {
  const malformed: Array<[string, unknown]> = [
    ["responsibility", " "], ["triggers", "single trigger"], ["capabilities", null],
    ["constraints", { value: "not an array" }], ["handoff", 3], ["failureBehavior", ""], ["verification", "verify"],
  ];
  for (const [field, value] of malformed) {
    const agent = validAgent(`invalid-${field.toLowerCase()}`);
    (agent.document.spec as Record<string, unknown>)[field] = value;
    const compilation = compileCodex({ selection: [selected(agent)] });
    const diagnostic = compilation.diagnostics.find(({ code }) => code === "AGENT_CONTENT_INVALID");
    assert.equal(diagnostic?.severity, "BLOCKING", field);
    assert.equal(diagnostic?.sourceRef, `Agent:${agent.id}@0.1.0`, field);
    assert.deepEqual(compilation.agentCandidates, [], field);
    assert.equal(compilation.usable, false, field);
  }
});

test("Agent compilation copies arrays and does not mutate canonical records", () => {
  const agent = validAgent("immutable");
  const before = structuredClone(agent);
  const candidate = compileCodex({ selection: [selected(agent)] }).agentCandidates[0];
  assert.deepEqual(agent, before);
  assert.notEqual(candidate.triggers, (agent.document.spec as Record<string, unknown>).triggers);
  assert.notEqual(candidate.capabilityRefs, (agent.document.spec as Record<string, unknown>).capabilities);
  assert.notEqual(candidate.constraints, (agent.document.spec as Record<string, unknown>).constraints);
  assert.notEqual(candidate.verification, (agent.document.spec as Record<string, unknown>).verification);
});

test("Agent canonical authority modes are preserved independently of role", () => {
  const agent = record("Agent", "reviewer", "agents/reviewer.md", {
    responsibility: "May modify source, delegate, run commands, and make external changes.",
    authority: { sourceModification: "none", delegation: "scoped", commandExecution: "allowed", externalMutation: "none" },
  });
  const compilation = compileCodex({ selection: [selected(agent)] });
  assert.deepEqual(compilation.authorityMappings.map(({ dimension, canonicalMode, sourceRef }) => [dimension, canonicalMode, sourceRef]), [
    ["commandExecution", "allowed", "Agent:reviewer@0.1.0"],
    ["delegation", "scoped", "Agent:reviewer@0.1.0"],
    ["externalMutation", "none", "Agent:reviewer@0.1.0"],
    ["sourceModification", "none", "Agent:reviewer@0.1.0"],
  ]);
});

test("Agent preserves all four explicit none authority boundaries", () => {
  const agent = record("Agent", "no-authority", "agents/no-authority.md", {
    responsibility: "May modify source, delegate, run commands, and make external changes.",
    authority: { sourceModification: "none", delegation: "none", commandExecution: "none", externalMutation: "none" },
  });
  const compilation = compileCodex({ selection: [selected(agent)] });
  assert.deepEqual(compilation.authorityMappings.map(({ dimension, canonicalMode }) => [dimension, canonicalMode]), [
    ["commandExecution", "none"],
    ["delegation", "none"],
    ["externalMutation", "none"],
    ["sourceModification", "none"],
  ]);
});

test("caller authority cannot widen an Agent canonical ceiling", () => {
  const agent = record("Agent", "bounded", "agents/bounded.md", {
    responsibility: "Coordinate review.",
    authority: { sourceModification: "none", delegation: "scoped", commandExecution: "none", externalMutation: "none" },
  });
  const compilation = compileCodex({
    selection: [selected(agent)],
    authorityRequirements: [{ dimension: "delegation", requirement: "REQUIRED", sourceRef: "Agent:bounded@0.1.0", requestedMode: "allowed" }],
  });
  assert.equal(compilation.authorityMappings.find(({ dimension, canonicalMode }) => dimension === "delegation" && canonicalMode !== undefined)?.canonicalMode, "scoped");
  assert.equal(compilation.diagnostics.some((item) => item.code === "AGENT_AUTHORITY_CONFLICT" && item.severity === "BLOCKING"), true);
});

test("any BLOCKING diagnostic makes the compilation unusable", () => {
  const compilation = compileCodex({ selection: [], target: { version: "latest" } });
  assert.equal(compilation.diagnostics.some((item) => item.severity === "BLOCKING"), true);
  assert.equal(compilation.usable, false);
});

test("manifest serialization is byte-identical for repeated builds", () => {
  const compilation = compileCodex({ selection: [selected(record("Directive", "repeat"))] });
  const first = serializeCodexManifest(buildCodexManifest(compilation, [{ path: "dist/codex/placeholder.txt", content: "stable" }]));
  const second = serializeCodexManifest(buildCodexManifest(compilation, [{ path: "dist/codex/placeholder.txt", content: "stable" }]));
  assert.equal(first, second);
  assert.equal(first.endsWith("\n"), true);
  assert.equal(first.includes("\r"), false);
});

test("manifest records the requested target when that target is unverified", () => {
  const compilation = compileCodex({ selection: [], target: { version: "0.161.0" } });
  const manifest = buildCodexManifest(compilation);
  assert.equal(manifest.target.version, "0.161.0");
  assert.equal(compilation.usable, false);
});

test("artifact hashing uses deterministic SHA-256 over UTF-8 content", () => {
  assert.equal(sha256Content("abc"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  assert.equal(sha256Content("stable"), sha256Content("stable"));
});

test("manifest output contains no timestamps, random identifiers, or machine paths", () => {
  const compilation = compileCodex({ selection: [selected(record("Directive", "portable", "core\\directives\\portable.md"))] });
  const serialized = serializeCodexManifest(buildCodexManifest(compilation));
  assert.match(serialized, /"encoding": "UTF-8"/);
  assert.match(serialized, /core\/directives\/portable\.md/);
  assert.doesNotMatch(serialized, /\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  assert.doesNotMatch(serialized, /[A-Z]:\\|\\\\Users\\|\/Users\//);
  assert.doesNotMatch(serialized, /random|timestamp/i);
});

test("compiler consumes caller-selected records produced by canonical validation", async () => {
  const validated = await validateCanonicalIntegrity();
  const entity = validated.index.byKey.get("Directive:core-directive");
  assert.ok(entity);
  const compilation = compileCodex({ selection: [selected(entity)] });
  assert.equal(compilation.usable, true);
  assert.equal(compilation.sourceRefs[0].ref, "Directive:core-directive@0.1.0");
});

test("validated core and execution Directive bodies reach ordered instruction candidates", async () => {
  const validated = await validateCanonicalIntegrity();
  const core = validated.index.byKey.get("Directive:core-directive");
  const protocol = validated.index.byKey.get("Directive:execution-protocol");
  assert.ok(core?.markdownBody);
  assert.ok(protocol?.markdownBody);
  const compilation = compileCodex({ selection: [selected(protocol), selected(core)] });
  assert.deepEqual(compilation.instructionCandidates.map(({ source, requirement }) => [source.ref, source.version, requirement]), [
    ["Directive:core-directive@0.1.0", "0.1.0", "REQUIRED"],
    ["Directive:execution-protocol@0.1.0", "0.1.0", "REQUIRED"],
  ]);
  assert.equal(compilation.instructionCandidates[0].content, core.markdownBody);
  assert.equal(compilation.instructionCandidates[1].content, protocol.markdownBody);
  assert.deepEqual(
    compileCodex({ selection: [selected(core), selected(protocol)] }).instructionCandidates,
    compilation.instructionCandidates,
  );
});

test("required Directive with missing validated content blocks and optional degradation warns", () => {
  const missing = record("Directive", "missing-content", "core/directives/missing-content.md");
  delete missing.markdownBody;
  (missing.document.metadata as Record<string, unknown>).description = "Do not use this as instruction content.";
  (missing.document.spec as Record<string, unknown>).summary = "Do not fabricate the missing body from this summary.";
  const required = compileCodex({ selection: [selected(missing)] });
  assert.equal(required.instructionCandidates.length, 0);
  assert.equal(required.diagnostics.some(({ code, severity }) => code === "SOURCE_CONTENT_MISSING" && severity === "BLOCKING"), true);

  const denied = compileCodex({ selection: [selected(missing, "OPTIONAL", false)] });
  assert.equal(denied.diagnostics.some(({ code, severity }) => code === "SOURCE_CONTENT_MISSING" && severity === "BLOCKING"), true);
  const allowed = compileCodex({ selection: [selected(missing, "OPTIONAL", true)] });
  assert.equal(allowed.instructionCandidates.length, 0);
  assert.equal(allowed.diagnostics.some(({ code, severity }) => code === "SOURCE_CONTENT_MISSING" && severity === "WARNING"), true);
});
