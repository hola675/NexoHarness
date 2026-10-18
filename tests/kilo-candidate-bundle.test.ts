import assert from "node:assert/strict";
import { test } from "node:test";
import { buildKiloCandidateBundle } from "../adapters/kilo/candidate-bundle.ts";
import { planKiloPreview } from "../adapters/kilo/preview-plan.ts";
import type { CanonicalEntityRecord } from "../tools/validate/canonical-integrity.ts";
const record: CanonicalEntityRecord = {
  key: "Skill:review-code", kind: "Skill", id: "review-code", version: "1.0.0", status: "draft",
  file: "skills/review-code.md", format: "markdown", markdownBody: "# Review\nCheck changes.",
  document: { kind: "Skill", metadata: { id: "review-code", version: "1.0.0", status: "draft" },
    spec: { purpose: "Review changes" } },
};
test("Desktop candidate bundle is deterministic, version-scoped and offline-only", () => {
  const plan = planKiloPreview([{ entity: record, requirement: "REQUIRED" }],
    { client: "desktop", version: "1.2.3" });
  const bundle = buildKiloCandidateBundle(plan);
  assert.deepEqual(bundle, buildKiloCandidateBundle(plan));
  assert.equal(bundle.deployable, false);
  assert.equal(bundle.target.client, "desktop");
  assert.equal(bundle.files.length, 1);
  assert.ok(bundle.diagnostics.some(d => d.code === "TARGET_UNVERIFIED"));
});
test("bundle rejects content whose hash does not match", () => {
  const plan = planKiloPreview([{ entity: record, requirement: "REQUIRED" }],
    { client: "desktop", version: "1.2.3" });
  plan.candidates[0].content += "changed";
  const bundle = buildKiloCandidateBundle(plan);
  assert.equal(bundle.files.length, 0);
  assert.ok(bundle.diagnostics.some(d => d.code === "INVALID_CANDIDATE"));
});
test("empty selection cannot produce bundle files", () => {
  const bundle = buildKiloCandidateBundle(planKiloPreview([], { client: "desktop", version: "1.2.3" }));
  assert.deepEqual(bundle.files, []);
  assert.equal(bundle.deployable, false);
});
