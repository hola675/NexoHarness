import { test } from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { validateMarkdownLinks } from "../tools/validate/repository.ts";

const root = resolve(import.meta.dirname, "..");

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
