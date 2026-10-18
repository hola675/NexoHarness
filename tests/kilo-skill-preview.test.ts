import assert from "node:assert/strict";
import { test } from "node:test";
import type { CanonicalEntityRecord } from "../tools/validate/canonical-integrity.ts";
import { previewKiloSkill } from "../adapters/kilo/skill-preview.ts";

function skill(): CanonicalEntityRecord {
  return { key: "Skill:review-code", kind: "Skill", id: "review-code", version: "1.0.0", status: "draft",
    file: "skills/review-code.md", format: "markdown", markdownBody: "# Review\nInspect the diff and report defects.",
    document: { kind: "Skill", metadata: { id: "review-code", title: "Review Code", version: "1.0.0", status: "draft" },
      spec: { purpose: "Review a change for defects" } } };
}
test("K1 skill candidate is deterministic and not deployable", () => {
  const a = previewKiloSkill(skill());
  const b = previewKiloSkill(skill());
  assert.deepEqual(a, b);
  assert.equal(a.ok, true);
  if (!a.ok) return;
  assert.equal(a.candidate.path, ".kilo/skills/review-code/SKILL.md");
  assert.equal(a.candidate.deployable, false);
  assert.equal(a.candidate.advisoryOnly, true);
  assert.match(a.candidate.content, /description: "Review a change for defects"/);
  assert.match(a.candidate.sha256, /^[a-f0-9]{64}$/);
});
test("K1 skill candidate refuses to drop canonical procedure or relationships", () => {
  const r = skill();
  (r.document.spec as Record<string, unknown>).procedure = ["Inspect", "Review"];
  const result = previewKiloSkill(r);
  assert.equal(result.ok, false);
  if (!result.ok) assert.ok(result.diagnostics.includes("UNMAPPED_SKILL_SEMANTICS"));
});
test("K1 skill candidate rejects traversal and malformed identity", () => {
  const r = skill();
  r.file = "../outside.md";
  const result = previewKiloSkill(r);
  assert.equal(result.ok, false);
  if (!result.ok) assert.ok(result.diagnostics.includes("INVALID_CANONICAL_IDENTITY"));
});
test("K1 skill candidate refuses missing procedural body", () => {
  const r = skill();
  delete r.markdownBody;
  const result = previewKiloSkill(r);
  assert.equal(result.ok, false);
  if (!result.ok) assert.ok(result.diagnostics.includes("MISSING_PROCEDURAL_BODY"));
});
