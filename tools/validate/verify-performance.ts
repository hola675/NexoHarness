import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

export type BudgetStatus = "PASS" | "WARNING" | "FAIL";

export function classifyBudget(durationMs: number, targetMs: number, hardBudgetMs: number): BudgetStatus {
  if (durationMs > hardBudgetMs) return "FAIL";
  if (durationMs > targetMs) return "WARNING";
  return "PASS";
}

export function formatDuration(durationMs: number): string {
  return `${(durationMs / 1000).toFixed(1)}s`;
}

const TARGET_MS = 120_000;
const HARD_BUDGET_MS = 180_000;

async function run(): Promise<void> {
  const npmExecPath = process.env.npm_execpath;
  if (!npmExecPath) throw new Error("verify-performance must be launched by npm");
  const started = performance.now();
  const exitCode = await new Promise<number>((resolve, reject) => {
    const child = spawn(process.execPath, [npmExecPath, "run", "verify:core"], { stdio: "inherit", shell: false });
    child.once("error", reject);
    child.once("close", (code) => resolve(code ?? 1));
  });
  const durationMs = performance.now() - started;
  const status = exitCode === 0 ? classifyBudget(durationMs, TARGET_MS, HARD_BUDGET_MS) : "FAIL";
  console.log(`VERIFY ${status}`);
  console.log(`duration: ${formatDuration(durationMs)}`);
  console.log(`target: ${formatDuration(TARGET_MS)}`);
  console.log(`hard budget: ${formatDuration(HARD_BUDGET_MS)}`);
  console.log(`budget status: ${status}`);
  if (status === "WARNING") console.warn("PERFORMANCE WARNING");
  if (status === "FAIL") {
    if (exitCode === 0) console.error("VALIDATION_BUDGET_EXCEEDED");
    process.exitCode = exitCode || 1;
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) await run();
