import assert from "node:assert/strict";
import { test } from "node:test";
import { buildKiloCandidateBundle } from "../adapters/kilo/candidate-bundle.ts";
import { planKiloPreview } from "../adapters/kilo/preview-plan.ts";
import { preflightKiloInstall } from "../adapters/kilo/install-preflight.ts";
import type { CanonicalEntityRecord } from "../tools/validate/canonical-integrity.ts";
const record: CanonicalEntityRecord = {
  key: "Skill:review-code", kind: "Skill", id: "review-code", version: "1.0.0", status: "draft",
  file: "skills/review-code.md", format: "markdown", markdownBody: "# Review\nCheck changes.",
  document: { kind: "Skill", metadata: { id: "review-code", version: "1.0.0", status: "draft" },
    spec: { purpose: "Review changes" } },
};
const bundle = () => buildKiloCandidateBundle(planKiloPreview(
  [{ entity: record, requirement: "REQUIRED" }], { client: "desktop", version: "1.2.3" }));
test("preflight lists blocked files and cannot approve deployment", () => {
  const p = preflightKiloInstall(bundle());
  assert.equal(p.mode, "DRY_RUN");
  assert.equal(p.installEligible, false);
  assert.equal(p.proposedFiles.length, 1);
  assert.equal(p.proposedFiles[0].action, "BLOCKED");
  assert.ok(p.diagnostics.includes("RUNTIME_EVIDENCE_REQUIRED"));
  assert.equal(p.diagnostics.includes("MANIFEST_MISMATCH"), false);
  assert.deepEqual(p, preflightKiloInstall(bundle()));
});
test("preflight rejects changed manifest and content", () => {
  const b = bundle();
  b.files[0].content += "modified";
  const p = preflightKiloInstall(b);
  assert.ok(p.diagnostics.includes("INVALID_FILE_ENTRY"));
  assert.equal(p.installEligible, false);
  const other = bundle();
  other.manifestSha256 = "0".repeat(64);
  assert.ok(preflightKiloInstall(other).diagnostics.includes("MANIFEST_MISMATCH"));
});
test("preflight rejects path traversal and invalid payload", () => {
  const b = bundle();
  b.files[0].path = "../outside/SKILL.md";
  const p = preflightKiloInstall(b);
  assert.ok(p.diagnostics.includes("INVALID_FILE_ENTRY"));
  assert.ok(p.diagnostics.includes("MANIFEST_MISMATCH"));
  assert.ok(preflightKiloInstall(null).diagnostics.includes("INVALID_BUNDLE"));
});
