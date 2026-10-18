import assert from "node:assert/strict";
import { test } from "node:test";
import { compileKilo } from "../adapters/kilo/compile.ts";
import type { CanonicalEntityRecord } from "../tools/validate/canonical-integrity.ts";

function entity(id = "example", kind = "Skill", file = "skills/example.yaml"): CanonicalEntityRecord {
  return { key: `${kind}:${id}`, kind, id, version: "1.0.0", status: "active", file, format: "yaml",
    document: { kind, metadata: { id, version: "1.0.0", status: "active" } } };
}
test("K1 produces deterministic analysis without deployable files", () => {
  const selection = [{ entity: entity(), requirement: "REQUIRED" as const }];
  const a = compileKilo({ selection });
  assert.deepEqual(a, compileKilo({ selection }));
  assert.equal(a.usable, false);
  assert.equal(a.deploymentEligible, false);
  assert.deepEqual(a.artifacts, []);
  assert.equal(a.translations[0].disposition, "DIRECT_TRANSLATION");
  assert.equal(a.diagnostics[0].severity, "BLOCKING");
});
test("K1 explicitly degraded optional input is still not deployable", () => {
  const r = compileKilo({ selection: [{ entity: entity(), requirement: "OPTIONAL", allowDegradation: true }] });
  assert.equal(r.diagnostics[0].code, "OPTIONAL_DEGRADATION");
  assert.equal(r.diagnostics[0].severity, "WARNING");
  assert.equal(r.deploymentEligible, false);
});
test("K1 blocks target mismatch, duplicate identity and malformed paths", () => {
  const r = compileKilo({ selection: [
    { entity: entity(), requirement: "REQUIRED" },
    { entity: entity(), requirement: "REQUIRED" },
    { entity: entity("other", "Skill", "../outside"), requirement: "REQUIRED" },
  ], target: { version: "9.0.0" } });
  assert.deepEqual(new Set(r.diagnostics.filter(d => d.severity === "BLOCKING").map(d => d.code)),
    new Set(["TARGET_UNVERIFIED", "DUPLICATE_IDENTITY", "INVALID_SELECTION", "TARGET_SEMANTICS_UNVERIFIED"]));
});
test("K1 runtime-only and governance kinds do not become artifacts", () => {
  const r = compileKilo({ selection: [
    { entity: entity("audit", "Observation"), requirement: "REQUIRED" },
    { entity: entity("proposal", "ImprovementProposal"), requirement: "REQUIRED" },
  ] });
  assert.deepEqual(r.translations.map(t => t.targetArtifact), ["NONE", "NONE"]);
  assert.ok(r.diagnostics.some(d => d.code === "NEXO_RUNTIME_REQUIRED"));
  assert.ok(r.diagnostics.some(d => d.code === "NO_TARGET_ARTIFACT"));
});

test("K1 rejects an empty selection rather than producing a successful empty preview", () => {
  const r = compileKilo({ selection: [] });
  assert.equal(r.deploymentEligible, false);
  assert.ok(r.diagnostics.some(d => d.code === "INVALID_SELECTION" && d.severity === "BLOCKING"));
});
