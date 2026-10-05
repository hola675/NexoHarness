import { test } from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { validateMarkdownLinks } from "../tools/validate/repository.ts";
import { CANONICAL_API_VERSION, SUPPORTED_KINDS, loadSchemaBundle, validateDocument, validateFixtures } from "../tools/validate/schemas.ts";
import { parseFrontmatter, validateCanonical } from "../tools/validate/canonical.ts";

const root = resolve(import.meta.dirname, "..");
async function readFixture(folder: "valid" | "invalid", name: string): Promise<Record<string, unknown>> {
  return JSON.parse(await readFile(resolve(root, `tests/fixtures/schemas/${folder}/${name}`), "utf8")) as Record<string, unknown>;
}

const foundationFiles = [
  "README.md",
  "AGENTS.md",
  "docs/architecture.md",
  "docs/source-of-truth.md",
  "package.json",
  "tools/validate/repository.ts",
];

test("foundation structure contains required baseline files", async () => {
  for (const file of foundationFiles) {
    await assert.doesNotReject(access(resolve(root, file)), file);
  }
});

test("foundation does not create production agent or skill definitions", async () => {
  await assert.rejects(access(resolve(root, "agents/production")));
  await assert.rejects(access(resolve(root, "skills/production")));
});

const coreFiles = [
  "core/directives/core-directive.md",
  "core/directives/execution-protocol.md",
  "core/policies/precedence.md",
  "core/policies/delegation.md",
  "core/policies/evidence.md",
  "core/policies/scope-control.md",
  "core/policies/completion.md",
  "core/policies/self-improvement.md",
];

test("core directive and policy files exist", async () => {
  for (const file of coreFiles) {
    await assert.doesNotReject(access(resolve(root, file)), file);
  }
});

test("documentation links resolve", async () => {
  assert.deepEqual(await validateMarkdownLinks(), []);
});

test("generated distribution is not a canonical input", async () => {
  await assert.rejects(access(resolve(root, "dist")));
  await assert.rejects(access(resolve(root, "core/directives/dist")));
  await assert.rejects(access(resolve(root, "core/policies/dist")));
});

test("observer promotion boundary and component separation remain documented", async () => {
  const observer = await readFile(resolve(root, "docs/concepts/task-observer.md"), "utf8");
  const separation = await readFile(resolve(root, "docs/concepts/directives.md"), "utf8");
  assert.match(observer, /human approval/);
  assert.match(observer, /must not directly modify canonical files/);
  assert.match(separation, /AGENT != SKILL/);
  assert.match(separation, /MCP != CAPABILITY/);
  assert.match(separation, /OBSERVER != AUTONOMOUS AUTHORITY/);
});

test("root development guidance points to the product directive", async () => {
  const agents = await readFile(resolve(root, "AGENTS.md"), "utf8");
  assert.match(agents, /core\/directives\/core-directive\.md/);
  assert.match(agents, /not the canonical runtime directive/);
});

test("roadmap places phase 0.0.5 before phase 0.1", async () => {
  const roadmap = await readFile(resolve(root, "ROADMAP.md"), "utf8");
  assert.ok(roadmap.indexOf("0.0.5 Core Directive & Execution Model") < roadmap.indexOf("0.1 Canonical schemas"));
});

test("all registered schemas compile and all fixtures validate", async () => {
  const bundle = await loadSchemaBundle();
  assert.equal(bundle.validators.size, SUPPORTED_KINDS.length);
  const result = await validateFixtures(bundle);
  assert.deepEqual(result, { valid: SUPPORTED_KINDS.length, invalid: SUPPORTED_KINDS.length });
});

test("existing canonical directives and policies validate", async () => {
  assert.equal(await validateCanonical(), 8);
});

test("malformed frontmatter is rejected", () => {
  assert.throws(() => parseFrontmatter("# Missing frontmatter", "fixture.md"), /must start with YAML frontmatter/);
  assert.throws(() => parseFrontmatter("---\nkind: Directive\n", "fixture.md"), /unterminated YAML frontmatter/);
});

test("approval and reference boundaries reject invalid metadata", async () => {
  const bundle = await loadSchemaBundle();
  const approval = await readFixture("invalid", "improvement-proposal-no-approval.json");
  const malformedReference = await readFixture("invalid", "profile-malformed-reference.json");
  assert.ok(validateDocument(bundle, approval).some((issue) => issue.path === "/spec/requiresExplicitApproval"));
  assert.ok(validateDocument(bundle, malformedReference).some((issue) => issue.path === "/spec/capabilities/0"));
});

test("canonical API identifier accepts only nexoharness.dev/v1alpha1", async () => {
  const bundle = await loadSchemaBundle();
  const valid = await readFixture("valid", "directive.json");
  const invalid = await readFixture("invalid", "directive-invalid-api-version.json");
  assert.equal(valid.apiVersion, CANONICAL_API_VERSION);
  assert.notEqual(invalid.apiVersion, CANONICAL_API_VERSION);
  assert.deepEqual(validateDocument(bundle, valid), []);
  assert.ok(validateDocument(bundle, invalid).some((issue) => issue.path === "/apiVersion"));
});

test("entity lifecycle status is required and separate from completion status", async () => {
  const bundle = await loadSchemaBundle();
  const missing = await readFixture("valid", "directive.json");
  const missingMetadata = missing.metadata as Record<string, unknown>;
  delete missingMetadata.status;
  const completion = await readFixture("valid", "directive.json");
  (completion.metadata as Record<string, unknown>).status = "PASS";
  assert.ok(validateDocument(bundle, missing).some((issue) => issue.path === "/metadata/status"));
  assert.ok(validateDocument(bundle, completion).some((issue) => issue.path === "/metadata/status"));
});

test("agent authority is dimensional rather than scalar", async () => {
  const bundle = await loadSchemaBundle();
  const dimensional = await readFixture("valid", "agent.json");
  const scalar = await readFixture("invalid", "agent-invalid-authority.json");
  assert.deepEqual(validateDocument(bundle, dimensional), []);
  assert.ok(validateDocument(bundle, scalar).some((issue) => issue.path === "/spec/authority"));
});

test("capability identity and semantic name remain separate", async () => {
  const bundle = await loadSchemaBundle();
  const valid = await readFixture("valid", "capability.json");
  const malformed = await readFixture("invalid", "capability-missing-semantic.json");
  assert.deepEqual(validateDocument(bundle, valid), []);
  assert.ok(validateDocument(bundle, malformed).some((issue) => issue.path === "/spec/name"));
});

test("observation telemetry is structured and privacy is explicit", async () => {
  const bundle = await loadSchemaBundle();
  const valid = await readFixture("valid", "observation.json");
  const sourceAllowed = await readFixture("valid", "observation.json");
  const missingPrivacy = await readFixture("valid", "observation.json");
  const unknownExecution = await readFixture("valid", "observation.json");
  const unknownSignals = await readFixture("valid", "observation.json");
  const unknownMetrics = await readFixture("valid", "observation.json");
  (sourceAllowed.spec as Record<string, unknown>).privacy = { sourceContentStored: true };
  delete (missingPrivacy.spec as Record<string, unknown>).privacy;
  ((unknownExecution.spec as Record<string, unknown>).execution as Record<string, unknown>).unknown = 1;
  ((unknownSignals.spec as Record<string, unknown>).signals as Record<string, unknown>).unknown = true;
  ((unknownMetrics.spec as Record<string, unknown>).metrics as Record<string, unknown>).unknown = 1;
  assert.deepEqual(validateDocument(bundle, valid), []);
  assert.deepEqual(validateDocument(bundle, sourceAllowed), []);
  assert.ok(validateDocument(bundle, missingPrivacy).some((issue) => issue.path === "/spec/privacy"));
  assert.ok(validateDocument(bundle, unknownExecution).some((issue) => issue.path === "/spec/execution/unknown"));
  assert.ok(validateDocument(bundle, unknownSignals).some((issue) => issue.path === "/spec/signals/unknown"));
  assert.ok(validateDocument(bundle, unknownMetrics).some((issue) => issue.path === "/spec/metrics/unknown"));
});

test("contract definitions constrain completion status and do not route agents", async () => {
  const bundle = await loadSchemaBundle();
  const definition = await readFixture("valid", "contract.json");
  const runtimeInstance = await readFixture("valid", "contract.json");
  const routedDefinition = await readFixture("valid", "contract.json");
  (runtimeInstance.spec as Record<string, unknown>).status = "READY";
  ((routedDefinition.spec as Record<string, unknown>).payload as Record<string, unknown>).nextAgentRef = "Agent:context-agent";
  assert.deepEqual(validateDocument(bundle, definition), []);
  assert.equal("status" in (definition.spec as Record<string, unknown>), false);
  assert.ok(validateDocument(bundle, runtimeInstance).some((issue) => issue.path === "/spec/status"));
  assert.ok(validateDocument(bundle, routedDefinition).some((issue) => issue.path === "/spec/payload/nextAgentRef"));
  const invalidStatus = await readFixture("invalid", "contract-invalid-status.json");
  assert.ok(validateDocument(bundle, invalidStatus).some((issue) => issue.path === "/spec/payload/allowedStatuses/0"));
});

test("rule info severity and negative workflow limits are rejected", async () => {
  const bundle = await loadSchemaBundle();
  const rule = await readFixture("valid", "rule.json");
  (rule.spec as Record<string, unknown>).severity = "info";
  const workflow = await readFixture("invalid", "workflow-duplicate-step-ids.json");
  assert.ok(validateDocument(bundle, rule).some((issue) => issue.path === "/spec/severity"));
  assert.ok(validateDocument(bundle, workflow).some((issue) => issue.path === "/spec/limits/maxDelegationDepth"));
});

test("Phase 0.1 authoring documents exist", async () => {
  await assert.doesNotReject(access(resolve(root, "docs/canonical-format.md")));
  await assert.doesNotReject(access(resolve(root, "docs/decisions/0001-canonical-manifest-model.md")));
});
