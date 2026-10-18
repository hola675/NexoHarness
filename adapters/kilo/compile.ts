import type { CanonicalEntityRecord } from "../../tools/validate/canonical-integrity.ts";
import { KILO_KIND_DISPOSITIONS, type KiloTranslationClass } from "./model.ts";
import { resolveKiloTarget, type KiloTargetSelection } from "./target.ts";
import type { CanonicalKind } from "../../tools/validate/schemas.ts";

/**
 * K1 in-memory analysis only. It intentionally cannot emit Kilo files,
 * grant permissions, or report deployment eligibility.
 */
export type KiloRequirement = "REQUIRED" | "OPTIONAL";
export type KiloSeverity = "BLOCKING" | "WARNING";
export type KiloDiagnosticCode =
  | "TARGET_UNVERIFIED" | "INVALID_SELECTION" | "DUPLICATE_IDENTITY"
  | "TARGET_SEMANTICS_UNVERIFIED" | "NEXO_RUNTIME_REQUIRED"
  | "NO_TARGET_ARTIFACT" | "OPTIONAL_DEGRADATION";
export interface KiloSelection {
  entity: CanonicalEntityRecord;
  requirement: KiloRequirement;
  allowDegradation?: boolean;
}
export interface KiloDiagnostic {
  code: KiloDiagnosticCode;
  severity: KiloSeverity;
  sourceRef?: string;
  surface: string;
  translationClass?: KiloTranslationClass;
  semanticLoss: string;
  enforcement: "PROMPT_ADVISORY_ONLY" | "NONE_UNKNOWN";
  evidence: "K0_DESK_RESEARCH_ONLY" | "UNVERIFIED_VERSION";
}
export interface KiloTranslation {
  sourceRef: string;
  path: string;
  kind: CanonicalKind;
  disposition: KiloTranslationClass;
  requirement: KiloRequirement;
  degraded: boolean;
  targetArtifact: "NONE";
}
export interface KiloCompilation {
  target: KiloTargetSelection;
  translations: KiloTranslation[];
  diagnostics: KiloDiagnostic[];
  usable: false;
  deploymentEligible: false;
  artifacts: [];
}
const idPattern = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const versionPattern = /^\d+\.\d+\.\d+$/;
const compare = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;
const normalizedPath = (path: string): string | undefined => {
  const p = path.replaceAll("\\", "/");
  if (!p || p.startsWith("/") || /^[a-z]:/i.test(p) || p.split("/").some(s => !s || s === "." || s === "..")) return undefined;
  return p;
};
function sourceFor(record: CanonicalEntityRecord): { ref: string; path: string; kind: CanonicalKind } | undefined {
  if (!Object.hasOwn(KILO_KIND_DISPOSITIONS, record.kind) || !idPattern.test(record.id) || !versionPattern.test(record.version)) return undefined;
  const metadata = record.document.metadata;
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return undefined;
  const m = metadata as Record<string, unknown>;
  const path = normalizedPath(record.file);
  if (!path || record.key !== `${record.kind}:${record.id}` || record.document.kind !== record.kind ||
      m.id !== record.id || m.version !== record.version || record.status !== m.status) return undefined;
  return { ref: `${record.kind}:${record.id}@${record.version}`, path, kind: record.kind as CanonicalKind };
}
function diagnostic(code: KiloDiagnosticCode, severity: KiloSeverity, semanticLoss: string,
  target: KiloTargetSelection, evidence: KiloDiagnostic["evidence"],
  sourceRef?: string, translationClass?: KiloTranslationClass): KiloDiagnostic {
  return {
    code, severity, ...(sourceRef ? { sourceRef } : {}),
    surface: `Kilo Code ${target.version} / Windows / VS Code`,
    ...(translationClass ? { translationClass } : {}),
    semanticLoss,
    enforcement: "NONE_UNKNOWN",
    evidence,
  };
}
export function compileKilo(request: {
  selection: readonly KiloSelection[];
  target?: Partial<KiloTargetSelection>;
}): KiloCompilation {
  const diagnostics: KiloDiagnostic[] = [];
  const translations: KiloTranslation[] = [];
  const resolution = resolveKiloTarget(request.target);
  const target = resolution.target;
  for (const code of resolution.diagnostics) {
    diagnostics.push(diagnostic("TARGET_UNVERIFIED", "BLOCKING", code, target, resolution.evidence));
  }
  if (request.selection.length === 0) {
    diagnostics.push(diagnostic("INVALID_SELECTION", "BLOCKING", "An explicit nonempty canonical selection is required.", target, resolution.evidence));
  }
  const seen = new Set<string>();
  for (const item of request.selection) {
    const source = sourceFor(item.entity);
    if (!source || (item.requirement !== "REQUIRED" && item.requirement !== "OPTIONAL") ||
      (item.allowDegradation !== undefined && typeof item.allowDegradation !== "boolean")) {
      diagnostics.push(diagnostic("INVALID_SELECTION", "BLOCKING", "Selection identity, envelope, requirement or source path is invalid.", target, resolution.evidence));
      continue;
    }
    const disposition = KILO_KIND_DISPOSITIONS[source.kind];
    if (seen.has(`${source.kind}:${item.entity.id}`)) {
      diagnostics.push(diagnostic("DUPLICATE_IDENTITY", "BLOCKING", "Canonical identity selected more than once.", target, resolution.evidence, source.ref, disposition));
    }
    seen.add(`${source.kind}:${item.entity.id}`);
    const degraded = item.requirement === "OPTIONAL" && item.allowDegradation === true;
    translations.push({ sourceRef: source.ref, path: source.path, kind: source.kind, disposition,
      requirement: item.requirement, degraded, targetArtifact: "NONE" });
    const code = disposition === "NEXO_RUNTIME_ONLY" ? "NEXO_RUNTIME_REQUIRED" :
      disposition === "NO_TARGET_ARTIFACT" ? "NO_TARGET_ARTIFACT" : "TARGET_SEMANTICS_UNVERIFIED";
    diagnostics.push(diagnostic(degraded ? "OPTIONAL_DEGRADATION" : code, degraded ? "WARNING" : "BLOCKING",
      degraded ? "Optional semantics omitted by explicit degradation; no target artifact emitted." :
      "K0 desk research does not establish effective Windows + VS Code semantic preservation or permissions.",
      target, resolution.evidence, source.ref, disposition));
  }
  translations.sort((a, b) => compare(a.sourceRef, b.sourceRef));
  diagnostics.sort((a, b) => compare(JSON.stringify([a.sourceRef ?? "", a.code, a.severity]),
    JSON.stringify([b.sourceRef ?? "", b.code, b.severity])));
  // No K1 runtime probes, installer or eligibility authority exists. Never promote a preview.
  return { target, translations, diagnostics, usable: false, deploymentEligible: false, artifacts: [] };
}
