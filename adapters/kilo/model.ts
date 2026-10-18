/**
 * K1 static target metadata and translation dispositions.
 * Design baseline only: no rendering, permission grants, installation or certification.
 * Source: docs/adapters/kilo-translation-contract.md and ADR 0007.
 */
import type { CanonicalKind } from "../../tools/validate/schemas.ts";

export const KILO_TARGET = Object.freeze({
  client: "vscode-extension",
  platform: "windows",
  version: "7.8.8",
  sourceCommit: "e2887f08e5a6394299c810ba508f358aaf4c5bc3",
} as const);

export const KILO_TRANSLATION_CLASSES = [
  "DIRECT_TRANSLATION",
  "COMPOSED_TRANSLATION",
  "CONDITIONAL_TRANSLATION",
  "NEXO_RUNTIME_ONLY",
  "NO_TARGET_ARTIFACT",
] as const;

export type KiloTranslationClass = (typeof KILO_TRANSLATION_CLASSES)[number];

export const KILO_KIND_DISPOSITIONS = Object.freeze({
  Directive: "COMPOSED_TRANSLATION",
  Policy: "CONDITIONAL_TRANSLATION",
  Agent: "CONDITIONAL_TRANSLATION",
  Skill: "DIRECT_TRANSLATION",
  Rule: "COMPOSED_TRANSLATION",
  Workflow: "CONDITIONAL_TRANSLATION",
  Contract: "NEXO_RUNTIME_ONLY",
  Capability: "CONDITIONAL_TRANSLATION",
  Profile: "CONDITIONAL_TRANSLATION",
  Enforcement: "CONDITIONAL_TRANSLATION",
  Evaluation: "NEXO_RUNTIME_ONLY",
  Observation: "NEXO_RUNTIME_ONLY",
  ImprovementProposal: "NO_TARGET_ARTIFACT",
} as const satisfies Record<CanonicalKind, KiloTranslationClass>);

/** Nexo authority is a ceiling, never a grant of Kilo permissions. */
export const KILO_AUTHORITY_DIMENSIONS = [
  "sourceModification",
  "delegation",
  "commandExecution",
  "externalMutation",
] as const;

export type KiloAuthorityDimension = (typeof KILO_AUTHORITY_DIMENSIONS)[number];

export const KILO_PERMISSION_BOUNDARY = Object.freeze({
  emitsAllowRules: false,
  enablesAutonomousMode: false,
  configuresProviders: false,
  permissionSensitiveClaimsRequireRuntimeProbe: true,
} as const);
