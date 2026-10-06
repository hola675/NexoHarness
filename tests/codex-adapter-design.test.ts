import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
const contract = read("../docs/adapters/codex-translation-contract.md");
const adapterDoc = read("../docs/adapters/codex.md");
const adr = read("../docs/decisions/0004-codex-adapter-translation-contract.md");
const roadmap = read("../ROADMAP.md");
const roleEvidence = read("../research/codex/probes/custom-agent-roles-0.160.0.md");

test("Phase 1.1-A design boundaries remain in force during core implementation", () => {
  assert.match(roadmap, /1\.0 Codex capability matrix — CERTIFIED/);
  assert.match(roadmap, /1\.1 Codex adapter — IN PROGRESS/);
  assert.match(adr, /Status: Accepted/);
  assert.match(adr, /^## Decision$/m);
  assert.doesNotMatch(adr, /^## Proposed decision$/m);
  assert.match(contract, /Design authority:\*\* ADR 0004, Accepted\./);
  assert.doesNotMatch(adr, /ADR 0004 remains Proposed|currently Proposed|^## Proposed decision$/im);
  assert.doesNotMatch(contract, /ADR 0004 remains Proposed|currently Proposed|^## Proposed decision$/im);
  assert.match(adapterDoc, /Phase 1\.1-B adapter core implementation: \*\*EXISTS\*\*/);
  assert.match(adapterDoc, /Pure AGENTS\.md renderer: \*\*EXISTS/);
  assert.match(adapterDoc, /Filesystem distribution: \*\*NOT YET\*\*/);
  assert.match(adapterDoc, /Runtime loading probe: \*\*OBSERVED LOCALLY — Codex CLI 0\.160\.0/);
  assert.match(adapterDoc, /Repository Skill discovery, explicit invocation, and SKILL\.md body visibility: \*\*OBSERVED LOCALLY — Codex CLI 0\.160\.0/);
  assert.match(adapterDoc, /Pure Nexo Skill renderer: \*\*EXISTS — in-memory artifact only\*\*/);
  assert.match(contract, /Phase 1\.1-A defines design only/);
  assert.match(contract, /CLI 0\.160\.0/);
  assert.match(contract, /rust-v0\.160\.0/);
  assert.match(contract, /Phase 1\.0 recorded `OBSERVED_LOCAL` as none/);
  assert.match(contract, /Subsequent Phase 1\.1 probes establish only their explicitly bounded local observations/);
  assert.match(adapterDoc, /Configured custom agent role and role-specific developer instructions/);
  assert.match(contract, /role-specific `developer_instructions`/);
  assert.match(contract, /custom agent role evidence/);
});

test("custom agent role evidence preserves source, observation, and inference boundaries", () => {
  for (const statement of [
    "## RELEASE_PINNED_SOURCE",
    "## OBSERVED_LOCAL",
    "## INFERENCE",
    "agent/control/api.rs",
    "thread_manager.rs",
    "session/mod.rs",
    "Negative child model request directly observed: **NO**",
    "Historical pre-run/post-run role-file hash continuity: **NOT ESTABLISHED**",
    "ROLE != AUTHORITY",
    "Total actual children: 2",
  ]) assert.ok(roleEvidence.includes(statement), `Missing custom-role evidence boundary: ${statement}`);
  assert.match(roleEvidence, /the configured role was applied to that child's effective `SessionConfiguration` before startup/);
  assert.doesNotMatch(roleEvidence, /negative child model request (?:was )?directly observed[^\n]*(?:YES|true)/i);
});

test("translation contract preserves canonical and runtime ownership", () => {
  for (const statement of [
    "Adapter is not installer.",
    "Target capability is not authorization.",
    "Nexo Skill is not a Codex skill file.",
    "Agent role is not authority.",
    "Codex session state is not Nexo Shared Runtime.",
    "Codex AGENTS discovery/loading order is a target mechanism",
    "ADAPTER GENERATES; INSTALLER RECONCILES.",
    "USER_FILE_COLLISION",
    "CodexCompilation is a small adapter-internal model",
    "MCP: deferred provider mechanism.",
    "no target artifact",
    "byte-identical output",
    "INSTRUCTION_BUDGET_EXCEEDED",
  ]) assert.ok(contract.includes(statement), `Missing contract invariant: ${statement}`);
});

test("authority dimensions cannot be silently upgraded or downgraded", () => {
  assert.match(contract, /\| sourceModification \|[^\n]*\| PARTIAL \|/);
  assert.match(contract, /\| delegation \|[^\n]*\| UNKNOWN \|/);
  assert.match(contract, /\| commandExecution \|[^\n]*\| PARTIAL \|/);
  assert.match(contract, /\| externalMutation \|[^\n]*\| PARTIAL \|/);
  assert.match(contract, /No mapping is STRONG by default/);
  assert.match(contract, /required authority boundary classified PARTIAL, ADVISORY, UNREPRESENTABLE or unresolved UNKNOWN cannot produce a usable artifact; compilation fails or emits a BLOCKING incompatibility/);
  assert.match(contract, /PARTIAL mapping for optional, non-required behavior may be represented only as explicit degradation with diagnostics when the canonical selection permits the loss/);
});

test("advisory policy prose cannot satisfy required enforcement", () => {
  const policyRow = contract.split("\n").find((line) => line.startsWith("| Policy —"));
  assert.ok(policyRow, "Policy mapping row must exist");
  assert.match(policyRow, /may be translated into generated instructions/);
  assert.match(policyRow, /Instruction text is advisory/);
  assert.match(policyRow, /Prose alone cannot satisfy a required policy that needs runtime or hard enforcement/);
  assert.match(policyRow, /compilation blocks rather than claiming preservation/);
});

test("Codex adapter contains only pure compiler and renderers without distribution or installer behavior", () => {
  assert.equal(existsSync(new URL("../adapters/codex/index.ts", import.meta.url)), true);
  assert.equal(existsSync(new URL("../adapters/codex/model.ts", import.meta.url)), true);
  assert.equal(existsSync(new URL("../adapters/codex/compile.ts", import.meta.url)), true);
  assert.equal(existsSync(new URL("../adapters/codex/manifest.ts", import.meta.url)), true);
  assert.equal(existsSync(new URL("../adapters/codex/render-agents.ts", import.meta.url)), true);
  assert.equal(existsSync(new URL("../adapters/codex/render-skills.ts", import.meta.url)), true);
  assert.equal(existsSync(new URL("../dist/codex", import.meta.url)), false);
  assert.equal(existsSync(new URL("../installer/codex", import.meta.url)), false);
  assert.deepEqual(readdirSync(new URL("../adapters/codex", import.meta.url)).sort(), ["compile.ts", "index.ts", "manifest.ts", "model.ts", "render-agent-roles.ts", "render-agents.ts", "render-skills.ts"]);
});

test("Codex compiler consumes validated records without parsing or discovering canonical files", () => {
  const compiler = read("../adapters/codex/compile.ts");
  assert.doesNotMatch(compiler, /parseFrontmatter|parseAllDocuments|discoverCanonicalFiles|readFile/);
});

