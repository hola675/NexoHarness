/** K1 metadata-only entrypoint. No renderer or deployable output is provided. */
export {
  KILO_TARGET,
  KILO_TRANSLATION_CLASSES,
  KILO_KIND_DISPOSITIONS,
  KILO_AUTHORITY_DIMENSIONS,
  KILO_PERMISSION_BOUNDARY,
} from "./model.ts";
export type { KiloAuthorityDimension, KiloTranslationClass } from "./model.ts";

export { compileKilo } from "./compile.ts";
export type { KiloSelection, KiloCompilation, KiloDiagnostic, KiloTranslation } from "./compile.ts";
export { validateKiloSkillMarkdown } from "./skill-format.ts";
export type { SkillFormatIssue } from "./skill-format.ts";

export { previewKiloSkill } from "./skill-preview.ts";
export type { KiloSkillPreview, KiloSkillCandidate } from "./skill-preview.ts";

export { planKiloPreview } from "./preview-plan.ts";
export type { KiloPreviewPlan } from "./preview-plan.ts";

export { resolveKiloTarget } from "./target.ts";
export type { KiloTargetSelection, KiloTargetResolution } from "./target.ts";

export { buildKiloCandidateBundle } from "./candidate-bundle.ts";
export type { KiloCandidateBundle } from "./candidate-bundle.ts";

export { preflightKiloInstall } from "./install-preflight.ts";
export type { KiloInstallPreflight } from "./install-preflight.ts";
