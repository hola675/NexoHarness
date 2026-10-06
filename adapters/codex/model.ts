import type { CanonicalEntityRecord } from "../../tools/validate/canonical-integrity.ts";
import type { CanonicalKind } from "../../tools/validate/schemas.ts";

export const CODEX_TARGET = Object.freeze({
  surface: "codex-local-cli",
  version: "0.160.0",
  tag: "rust-v0.160.0",
} as const);

export const CODEX_ADAPTER = Object.freeze({
  id: "nexoharness-codex-adapter",
  version: "0.1.0",
} as const);

export const TRANSLATION_CLASSES = [
  "DIRECT_TRANSLATION",
  "COMPOSED_TRANSLATION",
  "CONDITIONAL_TRANSLATION",
  "NEXO_RUNTIME_ONLY",
  "NO_TARGET_ARTIFACT",
  "UNSUPPORTED",
  "UNKNOWN",
] as const;
export type TranslationClass = (typeof TRANSLATION_CLASSES)[number];

export const ENFORCEMENT_STRENGTHS = [
  "HARD_ENFORCEMENT",
  "RUNTIME_GATE",
  "PROMPT_ADVISORY_ONLY",
  "NONE_UNKNOWN",
] as const;
export type EnforcementStrength = (typeof ENFORCEMENT_STRENGTHS)[number];

export const AUTHORITY_DIMENSIONS = [
  "sourceModification",
  "delegation",
  "commandExecution",
  "externalMutation",
] as const;
export type AuthorityDimension = (typeof AUTHORITY_DIMENSIONS)[number];
export type AuthorityCrosswalk = "STRONG" | "PARTIAL" | "ADVISORY" | "UNREPRESENTABLE" | "UNKNOWN";
export type RequirementLevel = "REQUIRED" | "OPTIONAL";

export const KIND_DISPOSITIONS: Readonly<Record<CanonicalKind, TranslationClass>> = Object.freeze({
  Directive: "COMPOSED_TRANSLATION",
  Policy: "CONDITIONAL_TRANSLATION",
  Agent: "COMPOSED_TRANSLATION",
  Skill: "CONDITIONAL_TRANSLATION",
  Rule: "CONDITIONAL_TRANSLATION",
  Workflow: "NEXO_RUNTIME_ONLY",
  Contract: "NEXO_RUNTIME_ONLY",
  Capability: "CONDITIONAL_TRANSLATION",
  Profile: "COMPOSED_TRANSLATION",
  Enforcement: "CONDITIONAL_TRANSLATION",
  Evaluation: "CONDITIONAL_TRANSLATION",
  Observation: "NO_TARGET_ARTIFACT",
  ImprovementProposal: "NO_TARGET_ARTIFACT",
});

export interface CanonicalSourceRef {
  kind: CanonicalKind;
  id: string;
  version: string;
  ref: string;
  path: string;
}

export interface CanonicalSelection {
  entity: CanonicalEntityRecord;
  requirement: RequirementLevel;
  allowDegradation?: boolean;
}

export interface AuthorityRequirement {
  dimension: AuthorityDimension;
  requirement: RequirementLevel;
  allowDegradation?: boolean;
  sourceRef?: string;
}

export interface PolicyEnforcementRequirement {
  sourceRef: string;
  requirement: RequirementLevel;
  requiredStrength: "HARD_ENFORCEMENT" | "RUNTIME_GATE";
  verifiedTargetStrength?: EnforcementStrength;
  nexoRuntimeEnforcement: boolean;
  allowDegradation?: boolean;
}

export type CompilationDiagnosticCode =
  | "TARGET_VERSION_UNVERIFIED"
  | "TARGET_FEATURE_UNKNOWN"
  | "TARGET_FEATURE_UNSUPPORTED"
  | "AUTHORITY_MAPPING_PARTIAL"
  | "AUTHORITY_UNREPRESENTABLE"
  | "SOURCE_REFERENCE_INVALID"
  | "DUPLICATE_SOURCE_IDENTITY"
  | "POLICY_ENFORCEMENT_UNSATISFIED";

export type DiagnosticSeverity = "INFO" | "WARNING" | "ERROR" | "BLOCKING";

export interface CompilationDiagnostic {
  code: CompilationDiagnosticCode;
  severity: DiagnosticSeverity;
  message: string;
  sourceRef?: string;
}

export interface TranslationEntry {
  source: CanonicalSourceRef;
  disposition: TranslationClass;
  requirement: RequirementLevel;
  degradationAllowed: boolean;
}

export interface AuthorityMapping {
  dimension: AuthorityDimension;
  crosswalk: AuthorityCrosswalk;
  requirement: RequirementLevel;
  degradationAllowed: boolean;
  sourceRef?: string;
}

export interface CodexCompilation {
  target: {
    surface: string;
    version: string;
    tag: string;
  };
  adapter: {
    id: string;
    version: string;
  };
  sourceRefs: CanonicalSourceRef[];
  translations: TranslationEntry[];
  authorityMappings: AuthorityMapping[];
  diagnostics: CompilationDiagnostic[];
  usable: boolean;
}
