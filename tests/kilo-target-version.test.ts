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
test("historical K0 release remains baseline, not a required version", () => {
  const baseline = resolveKiloTarget();
  assert.equal(baseline.target.version, "7.8.8");
  assert.equal(baseline.versionVerified, false);
  const next = resolveKiloTarget({ version: "8.2.0" });
  assert.equal(next.target.version, "8.2.0");
  assert.equal(next.target.sourceCommit, undefined);
  assert.ok(next.diagnostics.includes("VERSION_EVIDENCE_REQUIRED"));
});
test("arbitrary explicit version produces preview but blocks deployment", () => {
  const selection = [{ entity: record, requirement: "REQUIRED" as const }];
  const p = planKiloPreview(selection, { version: "8.2.0" });
  assert.equal(p.candidates.length, 1);
  assert.equal(p.candidates[0].target.version, "8.2.0");
  assert.equal(p.deploymentEligible, false);
  assert.ok(p.analysis.diagnostics.some(d => d.code === "TARGET_UNVERIFIED" && d.severity === "BLOCKING"));
  assert.deepEqual(p, planKiloPreview(selection, { version: "8.2.0" }));
});
test("unsupported platform and malformed version fail closed", () => {
  const selection = [{ entity: record, requirement: "REQUIRED" as const }];
  const p = compileKilo({ selection, target: { version: "latest", platform: "linux" as "windows" } });
  assert.ok(p.diagnostics.some(d => d.code === "TARGET_UNVERIFIED"));
  assert.equal(p.deploymentEligible, false);
  assert.ok(resolveKiloTarget({ version: "latest" }).diagnostics.includes("INVALID_TARGET_VERSION"));
});
