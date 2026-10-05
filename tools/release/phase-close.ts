import { spawnSync } from "node:child_process";
import { relative, resolve } from "node:path";
import { assertFullCommitSha, assertPhase } from "./verify-release.ts";

export interface PhaseClosePlan {
  phase: string;
  title: string;
  approvedSha: string;
  currentSha: string;
  originMainSha: string;
  branch: string;
  worktreeClean: boolean;
  originExists: boolean;
  localTagExists: boolean;
  remoteTagExists: boolean;
}

function certificationTag(phase: string): string {
  return `phase-${phase}-certified`;
}

export function validatePhaseClosePlan(plan: PhaseClosePlan): void {
  assertPhase(plan.phase);
  if (!plan.title.trim() || plan.title.length > 200) throw new Error("title must be non-empty and at most 200 characters.");
  assertFullCommitSha(plan.approvedSha);
  if (plan.branch !== "main") throw new Error("phase:close requires the main branch.");
  if (!plan.worktreeClean) throw new Error("phase:close requires a clean worktree.");
  if (!plan.originExists) throw new Error("phase:close requires an origin remote.");
  if (plan.currentSha !== plan.originMainSha) throw new Error("local HEAD must equal origin/main.");
  if (plan.currentSha !== plan.approvedSha) throw new Error("local HEAD must equal --approved-sha exactly.");
  if (plan.localTagExists) throw new Error(`Certification tag already exists locally: ${certificationTag(plan.phase)}`);
  if (plan.remoteTagExists) throw new Error(`Certification tag already exists remotely: ${certificationTag(plan.phase)}`);
}

interface CommandResult {
  status: number | null;
  stdout: string;
  stderr: string;
}

export interface NpmInvocation {
  command: string;
  args: string[];
}

export function resolveNpmInvocation(npmExecPath: string | undefined, args: string[]): NpmInvocation {
  if (!npmExecPath) throw new Error("phase:close requires an npm-provided npm_execpath");
  return { command: process.execPath, args: [npmExecPath, ...args] };
}

function normalizeCommandResult(command: string, args: string[], result: ReturnType<typeof spawnSync>, allowFailure: boolean): CommandResult {
  const normalized: CommandResult = {
    status: result.status,
    stdout: result.stdout?.toString() ?? "",
    stderr: result.stderr?.toString() ?? "",
  };
  if (!allowFailure && (normalized.status !== 0 || result.error)) {
    throw new Error(`${command} ${args.join(" ")} failed: ${normalized.stderr || result.error?.message || "unknown error"}`);
  }
  return normalized;
}

function runGit(args: string[], cwd: string, allowFailure = false): CommandResult {
  const result = spawnSync("git", args, {
    cwd,
    encoding: "utf8",
    shell: false,
    windowsHide: true,
  });
  return normalizeCommandResult("git", args, result, allowFailure);
}

function runNpm(args: string[], cwd: string): CommandResult {
  const invocation = resolveNpmInvocation(process.env.npm_execpath, args);
  const result = spawnSync(invocation.command, invocation.args, {
    cwd,
    encoding: "utf8",
    shell: false,
    windowsHide: true,
  });
  return normalizeCommandResult("npm", args, result, false);
}

function output(result: CommandResult): string {
  return result.stdout.trim();
}

function repositoryRoot(): string {
  const cwd = process.cwd();
  const result = runGit(["rev-parse", "--show-toplevel"], cwd);
  const root = resolve(output(result));
  const outside = relative(root, resolve(cwd));
  if (outside.startsWith("..") || outside.includes(":") || resolve(root, outside) !== resolve(cwd)) {
    throw new Error("Current working directory is not inside the repository.");
  }
  return root;
}

function tagExists(root: string, tag: string, remote = false): boolean {
  if (remote) {
    return runGit(["ls-remote", "--exit-code", "--refs", "origin", `refs/tags/${tag}`], root, true).status === 0;
  }
  return runGit(["rev-parse", "--verify", "--quiet", `refs/tags/${tag}`], root, true).status === 0;
}

function parseArguments(argv: string[]): { phase: string; title: string; approvedSha: string } {
  const values = new Map<string, string>();
  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (!["--phase", "--title", "--approved-sha"].includes(flag) || !value || values.has(flag)) {
      throw new Error("Usage: phase-close.ts --phase <phase> --title <title> --approved-sha <full-sha>");
    }
    values.set(flag, value);
  }
  if (values.size !== 3) throw new Error("Usage: phase-close.ts --phase <phase> --title <title> --approved-sha <full-sha>");
  return {
    phase: values.get("--phase") as string,
    title: values.get("--title") as string,
    approvedSha: values.get("--approved-sha") as string,
  };
}

function runFreshValidation(root: string): void {
  for (const script of ["typecheck", "validate", "test"]) runNpm(["run", script], root);
  runGit(["diff", "--check"], root);
}

export function closePhase(input: { phase: string; title: string; approvedSha: string }): void {
  const root = repositoryRoot();
  const tag = certificationTag(input.phase);
  const branch = output(runGit(["branch", "--show-current"], root));
  const worktreeClean = output(runGit(["status", "--porcelain"], root)) === "";
  const originExists = runGit(["remote", "get-url", "origin"], root, true).status === 0;
  if (!originExists) throw new Error("origin remote is required.");
  runGit(["fetch", "origin"], root);
  const currentSha = output(runGit(["rev-parse", "HEAD"], root));
  const originMainSha = output(runGit(["rev-parse", "refs/remotes/origin/main"], root));
  runGit(["cat-file", "-e", `${input.approvedSha}^{commit}`], root);
  const plan: PhaseClosePlan = {
    ...input,
    currentSha,
    originMainSha,
    branch,
    worktreeClean,
    originExists,
    localTagExists: tagExists(root, tag),
    remoteTagExists: tagExists(root, tag, true),
  };
  validatePhaseClosePlan(plan);
  runFreshValidation(root);
  runGit(["tag", "-a", tag, input.approvedSha, "-m", `NexoHarness Phase ${input.phase} — ${input.title}`], root);
  runGit(["push", "origin", tag], root);
  console.log(`Certified ${tag} at ${input.approvedSha}.`);
}

if (process.argv[1]?.endsWith("phase-close.ts")) {
  closePhase(parseArguments(process.argv.slice(2)));
}
