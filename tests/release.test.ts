import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import { isFullCommitSha, parseReleaseTag } from "../tools/release/verify-release.ts";
import { validatePhaseClosePlan, type PhaseClosePlan } from "../tools/release/phase-close.ts";

const root = resolve(import.meta.dirname, "..");
const fullSha = "a".repeat(40);

const validPlan = (): PhaseClosePlan => ({
  phase: "0.2",
  title: "Validation & Reference Integrity",
  approvedSha: fullSha,
  currentSha: fullSha,
  originMainSha: fullSha,
  branch: "main",
  worktreeClean: true,
  originExists: true,
  localTagExists: false,
  remoteTagExists: false,
});

test("release tag parsing classifies phase, prerelease and stable tags", () => {
  assert.deepEqual(parseReleaseTag("phase-0.2-certified"), {
    tag: "phase-0.2-certified",
    classification: "phase",
    title: "NexoHarness phase-0.2-certified",
  });
  assert.equal(parseReleaseTag("v0.1.0-alpha.1").classification, "prerelease");
  assert.equal(parseReleaseTag("v1.0.0").classification, "stable");
});

test("release tag and SHA validation rejects malformed values", () => {
  assert.throws(() => parseReleaseTag("phase-foo-certified"));
  assert.throws(() => parseReleaseTag("release-latest"));
  assert.equal(isFullCommitSha(fullSha), true);
  assert.equal(isFullCommitSha("abc123"), false);
});

test("phase close rejects mismatched approved SHA", () => {
  const plan = validPlan();
  plan.approvedSha = "b".repeat(40);
  assert.throws(() => validatePhaseClosePlan(plan), /approved-sha/);
});

test("phase close rejects dirty worktrees and existing tags", () => {
  const dirty = validPlan();
  dirty.worktreeClean = false;
  assert.throws(() => validatePhaseClosePlan(dirty), /clean worktree/);

  const localTag = validPlan();
  localTag.localTagExists = true;
  assert.throws(() => validatePhaseClosePlan(localTag), /already exists locally/);

  const remoteTag = validPlan();
  remoteTag.remoteTagExists = true;
  assert.throws(() => validatePhaseClosePlan(remoteTag), /already exists remotely/);
});

test("CI workflow is read-only and validates main push and pull requests", async () => {
  const source = await readFile(resolve(root, ".github/workflows/ci.yml"), "utf8");
  const workflow = parseYaml(source) as Record<string, any>;
  assert.deepEqual(workflow.on.push.branches, ["main"]);
  assert.deepEqual(workflow.on.pull_request.branches, ["main"]);
  assert.equal(workflow.permissions.contents, "read");
  assert.match(source, /npm ci/);
  assert.match(source, /npm run typecheck/);
  assert.match(source, /npm run validate/);
  assert.match(source, /npm test/);
  assert.match(source, /git diff --check/);
});

test("release workflow validates before publishing and limits write access", async () => {
  const source = await readFile(resolve(root, ".github/workflows/release.yml"), "utf8");
  const workflow = parseYaml(source) as Record<string, any>;
  assert.deepEqual(workflow.on.push.tags, ["phase-*-certified", "v*"]);
  assert.ok(workflow.on.workflow_dispatch);
  assert.equal(workflow.permissions.contents, "read");
  assert.equal(workflow.jobs.release.permissions.contents, "write");
  const validationEnd = Math.max(
    source.indexOf("npm run typecheck"),
    source.indexOf("npm run validate"),
    source.indexOf("npm test"),
    source.indexOf("git diff --check"),
  );
  assert.ok(validationEnd < source.indexOf("gh release create"));
  assert.match(source, /gh release view/);
});

test("phase close is promotion-only and contains no mutation commands", async () => {
  const source = await readFile(resolve(root, "tools/release/phase-close.ts"), "utf8");
  assert.doesNotMatch(source, /run\("git", \["commit"/);
  assert.doesNotMatch(source, /run\("git", \["amend"/);
  assert.doesNotMatch(source, /--force/);
  assert.match(source, /git.*tag/);
  assert.match(source, /approvedSha/);
});
