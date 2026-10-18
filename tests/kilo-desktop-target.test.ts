import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveKiloTarget } from "../adapters/kilo/target.ts";
import { compileKilo } from "../adapters/kilo/compile.ts";
import { planKiloPreview } from "../adapters/kilo/preview-plan.ts";
import type { CanonicalEntityRecord } from "../tools/validate/canonical-integrity.ts";
const record: CanonicalEntityRecord = {
  key: "Skill:review-code", kind: "Skill", id: "review-code", version: "1.0.0", status: "draft",
  file: "skills/review-code.md", format: "markdown", markdownBody: "# Review\nCheck changes.",
  document: { kind: "Skill", metadata: { id: "review-code", version: "1.0.0", status: "draft" },
    spec: { purpose: "Review changes" } },
};
test("Desktop requires explicit version and does not inherit VS Code source commit", () => {
  const missing = resolveKiloTarget({ client: "desktop" });
  assert.ok(missing.diagnostics.includes("TARGET_VERSION_REQUIRED"));
  const desktop = resolveKiloTarget({ client: "desktop", version: "1.2.3" });
  assert.equal(desktop.target.client, "desktop");
  assert.equal(desktop.target.version, "1.2.3");
  assert.equal(desktop.target.sourceCommit, undefined);
  assert.equal(desktop.evidence, "UNVERIFIED_VERSION");
  assert.ok(desktop.diagnostics.includes("VERSION_EVIDENCE_REQUIRED"));
});
test("Desktop analysis and candidate preserve client provenance and never deploy", () => {
  const selection = [{ entity: record, requirement: "REQUIRED" as const }];
  const target = { client: "desktop" as const, version: "1.2.3" };
  const plan = planKiloPreview(selection, target);
  assert.deepEqual(plan, planKiloPreview(selection, target));
  assert.equal(plan.analysis.target.client, "desktop");
  assert.equal(plan.candidates[0].target.client, "desktop");
  assert.equal(plan.deploymentEligible, false);
  assert.ok(plan.analysis.diagnostics.some(d => d.code === "TARGET_UNVERIFIED"));
  assert.ok(plan.analysis.diagnostics.some(d => d.surface.includes("desktop")));
});
test("existing VS Code preview baseline remains available", () => {
  const result = compileKilo({ selection: [{ entity: record, requirement: "REQUIRED" }] });
  assert.equal(result.target.client, "vscode-extension");
  assert.equal(result.target.version, "7.8.8");
  assert.equal(result.deploymentEligible, false);
});
