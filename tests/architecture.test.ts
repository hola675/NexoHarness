import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (path: string) => readFile(resolve(root, path), "utf8");

test("roadmap certifies Phase 0.2 and places Phase 0.3 before Codex Phase 1.0", async () => {
  const roadmap = await read("ROADMAP.md");
  assert.match(roadmap, /0\.2 Validation Framework & Reference Integrity — CERTIFIED/);
  const phase03 = roadmap.indexOf("0.3 Orchestration, Shared Runtime & Continuous Improvement Architecture — IN PROGRESS");
  const codex10 = roadmap.indexOf("1.0 Codex capability matrix");
  assert.ok(phase03 >= 0 && phase03 < codex10);
});

test("orchestration is a logical control-plane responsibility and is not automatically an Agent", async () => {
  const orchestration = await read("docs/orchestration.md");
  assert.match(orchestration, /logical NexoHarness control-plane responsibility/i);
  assert.match(orchestration, /ORCHESTRATOR != AGENT/);
  assert.match(orchestration, /Minimum sufficient orchestration/);
  assert.match(orchestration, /Escalation/);
  assert.match(orchestration, /ORCHESTRATION AUTHORITY != UNLIMITED EXECUTION AUTHORITY/);
});

test("shared runtime defines four advisory scopes and the authorization envelope", async () => {
  const runtime = await read("docs/shared-runtime.md");
  for (const scope of ["GLOBAL OPERATIONAL", "WORKSTYLE", "PROJECT", "TASK"]) assert.match(runtime, new RegExp(scope));
  assert.match(runtime, /non-canonical and advisory/i);
  assert.match(runtime, /cannot authorize a forbidden action/i);
  assert.match(runtime, /expand user scope/i);
  assert.match(runtime, /PROJECT STATE STAYS PROJECT-SCOPED BY DEFAULT/);
  assert.match(runtime, /secrets, credentials, customer data, raw conversations/);
  assert.match(runtime, /No database.*introduced in Phase 0\.3/s);
});

test("canonical improvement requires eval, review and explicit approval", async () => {
  const improvement = await read("docs/continuous-improvement.md");
  assert.match(improvement, /EVAL[\s\S]*REGRESSION COMPARISON[\s\S]*INDEPENDENT REVIEW[\s\S]*EXPLICIT APPROVAL[\s\S]*PROMOTION/);
  assert.match(improvement, /FASTEST != BEST/);
  assert.match(improvement, /FEWEST TESTS != BEST/);
  assert.match(improvement, /must preserve acceptance, safety and assurance requirements/i);
});

test("target order remains Codex, Claude Code, then Kilo as adapter siblings", async () => {
  const architecture = await read("docs/architecture.md");
  const changelog = await read("CHANGELOG.md");
  const codex = architecture.indexOf("Codex is first");
  const claude = architecture.indexOf("Claude Code second");
  const kilo = architecture.indexOf("Kilo Code third");
  assert.ok(codex >= 0 && codex < claude && claude < kilo);
  assert.doesNotMatch(changelog, /Kilo-first/i);
  assert.match(architecture, /consumes the same canonical source independently/i);
});

test("Phase 0.3 architecture decision is accepted", async () => {
  const decision = await read("docs/decisions/0002-orchestration-shared-runtime.md");
  assert.match(decision, /^- \*\*Status:\*\* Accepted$/m);
});

test("Phase 0.3 adds no Pack or Composition kind or runtime implementation", async () => {
  const registry = await read("core/schemas/registry.json");
  assert.doesNotMatch(registry, /"(?:Pack|Composition)"\s*:/);
  assert.equal(existsSync(resolve(root, "agents/orchestrator.md")), false);
  assert.equal(existsSync(resolve(root, "runtime")), false);
  assert.equal(existsSync(resolve(root, "mcp")), false);
  assert.equal(existsSync(resolve(root, "tools/mcp")), false);
  assert.equal(existsSync(resolve(root, "dist/codex")), false);
  assert.equal(existsSync(resolve(root, "dist/claude")), false);
  assert.equal(existsSync(resolve(root, "dist/kilo")), false);
});

test("Task Observer observes evidence and analyzes improvements without execution or promotion authority", async () => {
  const observer = await read("docs/concepts/task-observer.md");
  const improvement = await read("docs/continuous-improvement.md");
  assert.match(observer, /Evidence Observation/);
  assert.match(observer, /Improvement Analysis/);
  assert.match(observer, /does not own execution/i);
  assert.match(observer, /does not .* promote canonical behavior/i);
  assert.match(observer, /Future signal families/);
  for (const family of ["Task", "Execution", "Outcome", "Efficiency", "Context", "Capability"]) {
    assert.match(improvement, new RegExp(`\\*\\*${family}:\\*\\*`));
  }
});

test("progressive context separates canonical, learned, task and target-specific material", async () => {
  const executionModel = await read("docs/execution-model.md");
  for (const layer of ["ALWAYS-ON", "CONDITIONAL CANONICAL", "LEARNED CONTEXT", "TASK CONTEXT", "TARGET RUNTIME"]) {
    assert.match(executionModel, new RegExp(layer));
  }
  assert.match(executionModel, /CONTEXT VALUE != CONTEXT VOLUME/);
});
