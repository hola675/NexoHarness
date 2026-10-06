import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (path: string) => readFile(resolve(root, path), "utf8");

test("Phase 1.0 records a sourced, surface-specific Codex capability study without implementation", async () => {
  const [roadmap, matrix, detailed, sources, gaps, adr] = await Promise.all([
    read("ROADMAP.md"),
    read("docs/adapters/codex-capability-matrix.md"),
    read("research/codex/capability-matrix.md"),
    read("research/codex/sources.md"),
    read("research/codex/gaps.md"),
    read("docs/decisions/0003-codex-target-surface.md"),
  ]);

  assert.match(roadmap, /0\.3 Orchestration, Shared Runtime & Continuous Improvement Architecture — CERTIFIED/);
  assert.match(roadmap, /1\.0 Codex capability matrix — CERTIFIED/);
  assert.match(sources, /Apache License 2\.0/);
  assert.match(sources, /2026-10-05/);
  assert.match(sources, /rust-v0\.160\.0/);
  assert.match(sources, /3f1ccb7ceb814e54314826f68d61c892e2f5a48e/);
  assert.match(adr, /^- \*\*Status:\*\* Accepted$/m);
  assert.match(adr, /^## Decision$/m);
  assert.doesNotMatch(adr, /^## Proposed decision$/m);
  assert.match(adr, /Codex Local — CLI/);
  for (const surface of ["Codex IDE", "desktop app", "Codex Cloud", "Agents API"]) {
    assert.match(detailed, new RegExp(surface, "i"));
  }

  for (const classification of ["NATIVE", "NATIVE_WITH_CONSTRAINTS", "ADAPTER_TRANSLATABLE", "NEXO_RUNTIME_REQUIRED", "UNSUPPORTED", "UNKNOWN"]) {
    assert.ok(detailed.includes(classification), `missing classification ${classification}`);
  }
  assert.doesNotMatch(detailed, /ADR 0003 remains \*\*Proposed\*\*/);
  assert.doesNotMatch(detailed, /proposed target decision/i);
  assert.doesNotMatch(detailed, /proposed 0\.160 baseline/i);
  assert.doesNotMatch(gaps, /selected research target is proposed/i);
  assert.match(detailed, /proposed signal/);
  assert.match(matrix, /MCP is \*\*DEFERRED PROVIDER MECHANISM\*\*/);
  assert.match(matrix, /PROMPT \/ ADVISORY ONLY/);
  assert.match(matrix, /GOOD FIT|PARTIAL FIT|POOR FIT/);
  assert.match(gaps, /NO GAP[\s\S]*TRANSLATION GAP[\s\S]*ENFORCEMENT GAP[\s\S]*RUNTIME GAP[\s\S]*TELEMETRY GAP[\s\S]*VERSION \/ MATURITY GAP[\s\S]*UNKNOWN/);

  assert.equal(existsSync(resolve(root, "adapters/codex")), true);
  assert.equal(existsSync(resolve(root, "dist/codex")), false);
  assert.equal(existsSync(resolve(root, "agents/codex")), false);
});
