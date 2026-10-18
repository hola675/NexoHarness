import assert from "node:assert/strict";
import { test } from "node:test";
import { planKiloPreview } from "../adapters/kilo/preview-plan.ts";
import type { CanonicalEntityRecord } from "../tools/validate/canonical-integrity.ts";
function skill(id: string): CanonicalEntityRecord {
  return { key: `Skill:${id}`, kind: "Skill", id, version: "1.0.0", status: "draft",
    file: `skills/${id}.md`, format: "markdown", markdownBody: "# Instructions\nReview changes.",
    document: { kind: "Skill", metadata: { id, version: "1.0.0", status: "draft" },
      spec: { purpose: "Review code changes" } } };
}
test("K1 plan deterministically composes preview without deployment eligibility", () => {
  const input = [{ entity: skill("zeta"), requirement: "REQUIRED" as const },
    { entity: skill("alpha"), requirement: "REQUIRED" as const }];
  const a = planKiloPreview(input);
  assert.deepEqual(a, planKiloPreview(input));
  assert.deepEqual(a.candidates.map(c => c.path), [".kilo/skills/alpha/SKILL.md", ".kilo/skills/zeta/SKILL.md"]);
  assert.equal(a.deploymentEligible, false);
  assert.equal(a.analysis.deploymentEligible, false);
  assert.ok(a.analysis.diagnostics.some(d => d.severity === "BLOCKING"));
});
test("K1 plan detects duplicates without emitting a second candidate", () => {
  const item = { entity: skill("alpha"), requirement: "REQUIRED" as const };
  const p = planKiloPreview([item, item]);
  assert.equal(p.candidates.length, 1);
  assert.ok(p.diagnostics.some(d => d.code === "DUPLICATE_SKILL_IDENTITY"));
});
test("K1 plan omits explicitly degraded optional skills", () => {
  const p = planKiloPreview([{ entity: skill("alpha"), requirement: "OPTIONAL", allowDegradation: true }]);
  assert.deepEqual(p.candidates, []);
  assert.ok(p.diagnostics.some(d => d.code === "OPTIONAL_SKILL_OMITTED"));
});
test("K1 plan refuses silently dropping unsupported canonical semantics", () => {
  const r = skill("alpha");
  (r.document.spec as Record<string, unknown>).procedure = ["Inspect"];
  const p = planKiloPreview([{ entity: r, requirement: "REQUIRED" }]);
  assert.deepEqual(p.candidates, []);
  assert.ok(p.diagnostics.some(d => d.code === "UNMAPPED_SKILL_SEMANTICS"));
});
