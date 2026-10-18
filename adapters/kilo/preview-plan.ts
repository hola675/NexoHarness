import { compileKilo, type KiloSelection, type KiloCompilation } from "./compile.ts";
import { previewKiloSkill, type KiloSkillCandidate } from "./skill-preview.ts";

/**
 * Pure K1 orchestration: never promotes candidates to deployment artifacts.
 * The caller must first validate schemas, references and selection integrity.
 */
export interface KiloPreviewPlan {
  analysis: KiloCompilation;
  candidates: KiloSkillCandidate[];
  diagnostics: { sourceRef: string; code: string }[];
  previewOnly: true;
  deploymentEligible: false;
}
const cmp = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;
export function planKiloPreview(selection: readonly KiloSelection[]): KiloPreviewPlan {
  const analysis = compileKilo({ selection });
  const candidates: KiloSkillCandidate[] = [];
  const diagnostics: KiloPreviewPlan["diagnostics"] = [];
  const identities = new Set<string>();
  for (const item of selection) {
    const record = item.entity;
    if (record.kind !== "Skill") continue;
    const ref = `Skill:${record.id}@${record.version}`;
    const identity = `Skill:${record.id}`;
    if (identities.has(identity)) {
      diagnostics.push({ sourceRef: ref, code: "DUPLICATE_SKILL_IDENTITY" });
      continue;
    }
    identities.add(identity);
    if (item.requirement === "OPTIONAL" && item.allowDegradation === true) {
      diagnostics.push({ sourceRef: ref, code: "OPTIONAL_SKILL_OMITTED" });
      continue;
    }
    const result = previewKiloSkill(record);
    if (!result.ok) {
      for (const code of result.diagnostics) diagnostics.push({ sourceRef: ref, code });
      continue;
    }
    candidates.push(result.candidate);
  }
  candidates.sort((a, b) => cmp(a.path, b.path));
  diagnostics.sort((a, b) => cmp(`${a.sourceRef}:${a.code}`, `${b.sourceRef}:${b.code}`));
  // Even when a candidate renders, required target enforcement is unverified.
  return { analysis, candidates, diagnostics, previewOnly: true, deploymentEligible: false };
}
