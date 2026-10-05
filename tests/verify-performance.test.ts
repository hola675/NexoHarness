import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { classifyBudget } from "../tools/validate/verify-performance.ts";

const root = resolve(import.meta.dirname, "..");

test("verification budget classification distinguishes pass, warning and failure", () => {
  assert.equal(classifyBudget(10_000, 60_000, 90_000), "PASS");
  assert.equal(classifyBudget(70_000, 60_000, 90_000), "WARNING");
  assert.equal(classifyBudget(100_000, 60_000, 90_000), "FAIL");
});

test("CI validation job has the five-minute hard timeout", async () => {
  const workflow = await readFile(resolve(root, ".github/workflows/ci.yml"), "utf8");
  assert.match(workflow, /jobs:\s*\n\s+validate:\s*\n\s+.+\n\s+timeout-minutes:\s*5/m);
});

test("roadmap orders Codex before Claude Code before Kilo Code", async () => {
  const roadmap = await readFile(resolve(root, "ROADMAP.md"), "utf8");
  const codex = roadmap.indexOf("## Codex Target");
  const claude = roadmap.indexOf("## Claude Code");
  const kilo = roadmap.indexOf("## Kilo Code");
  assert.ok(codex >= 0 && codex < claude && claude < kilo);
});
