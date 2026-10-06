import type { CanonicalEntityRecord } from "../../tools/validate/canonical-integrity.ts";
import { AUTHORITY_DIMENSIONS, CODEX_ADAPTER, CODEX_TARGET, KIND_DISPOSITIONS, type AgentAuthorityMode, type AuthorityCrosswalk, type AuthorityDimension, type AuthorityMapping, type AuthorityRequirement, type CanonicalSelection, type CanonicalSourceRef, type CompilationDiagnostic, type CodexCompilation, type PolicyEnforcementRequirement, type RuntimeDependency, type TranslationEntry } from "./model.ts";

const idPattern = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const versionPattern = /^[0-9]+\.[0-9]+\.[0-9]+$/;
const AUTHORITY_MODE_RANK: Readonly<Record<AgentAuthorityMode, number>> = { none: 0, scoped: 1, allowed: 2 };

const AUTHORITY_CROSSWALK: Readonly<Record<AuthorityDimension, AuthorityCrosswalk>> = {
  sourceModification: "PARTIAL",
  delegation: "UNKNOWN",
  commandExecution: "PARTIAL",
  externalMutation: "PARTIAL",
};

function normalizedCanonicalPath(path: string): string | undefined {
  const normalized = path.replaceAll("\\", "/");
  if (!normalized || normalized.startsWith("/") || /^[A-Za-z]:/.test(normalized)) return undefined;
  const segments = normalized.split("/");
  if (segments.some((segment) => segment === "" || segment === "." || segment === "..")) return undefined;
  return segments.join("/");
}

function metadataMatches(record: CanonicalEntityRecord): boolean {
  const metadata = record.document.metadata;
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return false;
  const value = metadata as Record<string, unknown>;
  return record.document.kind === record.kind &&
    value.id === record.id &&
    value.version === record.version &&
    record.key === `${record.kind}:${record.id}`;
}

function sourceRefFor(record: CanonicalEntityRecord): CanonicalSourceRef | undefined {
  if (!Object.hasOwn(KIND_DISPOSITIONS, record.kind) || !idPattern.test(record.id) || !versionPattern.test(record.version)) return undefined;
  if (!metadataMatches(record)) return undefined;
  const path = normalizedCanonicalPath(record.file);
  if (!path) return undefined;
  return {
    kind: record.kind as CanonicalSourceRef["kind"],
    id: record.id,
    version: record.version,
    ref: `${record.kind}:${record.id}@${record.version}`,
    path,
  };
}

function compareOrdinal(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sortDiagnostics(items: CompilationDiagnostic[]): CompilationDiagnostic[] {
  return items.sort((left, right) =>
    compareOrdinal(
      `${left.sourceRef ?? ""}| ${left.code}|${left.severity}|${left.message}`,
      `${right.sourceRef ?? ""}| ${right.code}|${right.severity}|${right.message}`,
    ),
  );
}

function crosswalkFor(dimension: AuthorityDimension): AuthorityCrosswalk {
  return AUTHORITY_CROSSWALK[dimension];
}

export function evaluateUntranslatedDisposition(
  disposition: "UNSUPPORTED" | "UNKNOWN",
  requirement: "REQUIRED" | "OPTIONAL",
  sourceRef?: string,
  allowDegradation = false,
): CompilationDiagnostic {
  return {
    code: disposition === "UNKNOWN" ? "TARGET_FEATURE_UNKNOWN" : "TARGET_FEATURE_UNSUPPORTED",
    severity: requirement === "OPTIONAL" && allowDegradation ? "WARNING" : "BLOCKING",
    ...(sourceRef ? { sourceRef } : {}),
    message: requirement === "OPTIONAL" && allowDegradation
      ? `Optional ${disposition === "UNKNOWN" ? "unresolved" : "unsupported"} semantics are omitted under explicit degradation.`
      : `${requirement} semantics are ${disposition === "UNKNOWN" ? "unresolved" : "unsupported"} for the target.`,
  };
}

function satisfiesPolicyEnforcement(requirement: PolicyEnforcementRequirement): boolean {
  if (requirement.nexoRuntimeEnforcement && requirement.requiredStrength === "RUNTIME_GATE") return true;
  if (requirement.verifiedTargetStrength === "HARD_ENFORCEMENT") return true;
  return requirement.requiredStrength === "RUNTIME_GATE" &&
    requirement.verifiedTargetStrength === "RUNTIME_GATE";
}

export function evaluateAuthorityCrosswalk(
  crosswalk: AuthorityCrosswalk,
  requirement: "REQUIRED" | "OPTIONAL",
  allowDegradation = false,
): CompilationDiagnostic | undefined {
  if (crosswalk === "STRONG") return undefined;
  if (crosswalk === "PARTIAL" && requirement === "OPTIONAL" && allowDegradation) {
    return {
      code: "AUTHORITY_MAPPING_PARTIAL",
      severity: "WARNING",
      message: "Optional authority is explicitly degraded because its target crosswalk is PARTIAL.",
    };
  }
  return {
    code: crosswalk === "UNKNOWN" || crosswalk === "UNREPRESENTABLE"
      ? "AUTHORITY_UNREPRESENTABLE"
      : "AUTHORITY_MAPPING_PARTIAL",
    severity: "BLOCKING",
    message: `${requirement} authority cannot be preserved by a ${crosswalk} target crosswalk.`,
  };
}

function evaluatePolicyEnforcement(
  requirement: PolicyEnforcementRequirement,
): CompilationDiagnostic | undefined {
  if (satisfiesPolicyEnforcement(requirement)) return undefined;
  const severity = requirement.requirement === "OPTIONAL" && requirement.allowDegradation === true
    ? "WARNING"
    : "BLOCKING";
  return {
    code: "POLICY_ENFORCEMENT_UNSATISFIED",
    severity,
    sourceRef: requirement.sourceRef,
    message: "Advisory instruction prose cannot satisfy the requested policy enforcement; no adequate verified target or Nexo runtime path was supplied.",
  };
}

export function compileCodex(request: {
  selection: readonly CanonicalSelection[];
  target?: { surface?: string; version?: string; tag?: string };
  authorityRequirements?: readonly AuthorityRequirement[];
  policyRequirements?: readonly PolicyEnforcementRequirement[];
}): CodexCompilation {
  const diagnostics: CompilationDiagnostic[] = [];
  const target = {
    surface: request.target?.surface ?? CODEX_TARGET.surface,
    version: request.target?.version ?? CODEX_TARGET.version,
    tag: request.target?.tag ?? CODEX_TARGET.tag,
  };

  if (target.surface !== CODEX_TARGET.surface || target.version !== CODEX_TARGET.version || target.tag !== CODEX_TARGET.tag) {
    diagnostics.push({
      code: "TARGET_VERSION_UNVERIFIED",
      severity: "BLOCKING",
      message: `Only ${CODEX_TARGET.surface} ${CODEX_TARGET.version} (${CODEX_TARGET.tag}) is supported by this adapter version.`,
    });
  }

  const selection = [...request.selection];
  const refsBySelection = selection.map(({ entity }) => sourceRefFor(entity));
  const validRequirements = selection.map(({ requirement }) => requirement === "REQUIRED" || requirement === "OPTIONAL");
  selection.forEach((item, index) => {
    if (!refsBySelection[index] || !validRequirements[index]) {
      diagnostics.push({
        code: "SOURCE_REFERENCE_INVALID",
        severity: "BLOCKING",
        message: "Selection has an invalid requirement or canonical record identity, envelope, version, or repository-relative source path.",
      });
    }
  });

  const seenIdentities = new Set<string>();
  for (const source of refsBySelection) {
    if (!source) continue;
    const identity = `${source.kind}:${source.id}`;
    if (seenIdentities.has(identity)) {
      diagnostics.push({
        code: "DUPLICATE_SOURCE_IDENTITY",
        severity: "BLOCKING",
        sourceRef: source.ref,
        message: `Canonical identity ${identity} was selected more than once.`,
      });
    }
    seenIdentities.add(identity);
  }

  const ordered = selection
    .map((item, index) => ({ item, source: refsBySelection[index] }))
    .filter((entry, index): entry is { item: CanonicalSelection; source: CanonicalSourceRef } => Boolean(entry.source) && validRequirements[index])
    .sort((left, right) => compareOrdinal(left.source.ref, right.source.ref));

  const runtimeDependencies: RuntimeDependency[] = [];
  const translations: TranslationEntry[] = ordered.map(({ item, source }) => {
    const disposition = KIND_DISPOSITIONS[source.kind];
    const degradationAllowed = item.requirement === "OPTIONAL" && item.allowDegradation === true;
    const targetArtifact = disposition === "NO_TARGET_ARTIFACT" || disposition === "NEXO_RUNTIME_ONLY" ||
      disposition === "UNSUPPORTED" || disposition === "UNKNOWN" ? "NONE" : "CANDIDATE";
    if (disposition === "UNSUPPORTED" || disposition === "UNKNOWN") {
      diagnostics.push(evaluateUntranslatedDisposition(disposition, item.requirement, source.ref, degradationAllowed));
    } else if (disposition === "NEXO_RUNTIME_ONLY") {
      runtimeDependencies.push({ sourceRef: source.ref, kind: source.kind as "Workflow" | "Contract", requirement: item.requirement, satisfied: false });
      diagnostics.push({
        code: "NEXO_RUNTIME_REQUIRED",
        severity: degradationAllowed ? "WARNING" : "BLOCKING",
        sourceRef: source.ref,
        message: degradationAllowed
          ? `${source.kind} requires Nexo runtime and is omitted under explicit optional degradation.`
          : `${source.kind} requires Nexo runtime, which is not available in this adapter compilation.`,
      });
    }
    return { source, disposition, requirement: item.requirement, degradationAllowed, targetArtifact };
  });

  const authorityMappings: AuthorityMapping[] = [];
  for (const { item, source } of ordered) {
    if (source.kind !== "Agent") continue;
    const spec = item.entity.document.spec as Record<string, unknown> | undefined;
    const authority = spec?.authority as Record<string, unknown> | undefined;
    for (const dimension of AUTHORITY_DIMENSIONS) {
      const mode = authority?.[dimension];
      if (mode !== "none" && mode !== "scoped" && mode !== "allowed") {
        diagnostics.push({ code: "SOURCE_REFERENCE_INVALID", severity: "BLOCKING", sourceRef: source.ref, message: `Agent spec.authority.${dimension} must be none, scoped, or allowed.` });
        continue;
      }
      authorityMappings.push({
        dimension,
        canonicalMode: mode,
        crosswalk: crosswalkFor(dimension),
        requirement: item.requirement,
        degradationAllowed: item.requirement === "OPTIONAL" && item.allowDegradation === true,
        sourceRef: source.ref,
      });
    }
  }

  const callerAuthorityRequirements = request.authorityRequirements ?? [];
  const callerAuthoritySlots = new Set<string>();
  const duplicateAuthoritySlots = new Set<string>();
  for (const requirement of callerAuthorityRequirements) {
    if (!AUTHORITY_DIMENSIONS.includes(requirement.dimension)) continue;
    const slot = JSON.stringify([requirement.sourceRef ?? null, requirement.dimension]);
    if (callerAuthoritySlots.has(slot)) duplicateAuthoritySlots.add(slot);
    callerAuthoritySlots.add(slot);
  }
  for (const slot of [...duplicateAuthoritySlots].sort(compareOrdinal)) {
    const [sourceRef, dimension] = JSON.parse(slot) as [string | null, AuthorityDimension];
    diagnostics.push({
      code: "DUPLICATE_AUTHORITY_REQUIREMENT",
      severity: "BLOCKING",
      ...(sourceRef ? { sourceRef } : {}),
      message: `Caller authority requirement is duplicated for ${dimension}${sourceRef ? ` at ${sourceRef}` : " in global scope"}. Duplicate semantic slots are rejected, including identical requests.`,
    });
  }

  const requestedAuthorityMappings: AuthorityMapping[] = [...callerAuthorityRequirements]
    .filter((requirement) => {
      const valid = AUTHORITY_DIMENSIONS.includes(requirement.dimension) &&
        (requirement.requirement === "REQUIRED" || requirement.requirement === "OPTIONAL") &&
        (requirement.requestedMode === undefined || requirement.requestedMode === "none" || requirement.requestedMode === "scoped" || requirement.requestedMode === "allowed");
      if (!valid) {
        diagnostics.push({
          code: "SOURCE_REFERENCE_INVALID",
          severity: "BLOCKING",
          message: "Authority requirement has an invalid dimension or requirement level.",
        });
      }
      return valid;
    })
    .map((requirement) => {
      const sourceRefIsSelected = !requirement.sourceRef || ordered.some(({ source }) => source.ref === requirement.sourceRef);
      const selectedSource = requirement.sourceRef
        ? ordered.find(({ source }) => source.ref === requirement.sourceRef)
        : undefined;
      if (!sourceRefIsSelected) {
        diagnostics.push({
          code: "SOURCE_REFERENCE_INVALID",
          severity: "BLOCKING",
          message: "Authority requirement sourceRef must identify an explicitly selected canonical entity.",
        });
      } else if (selectedSource?.item.requirement === "REQUIRED" && requirement.requirement !== "REQUIRED") {
        diagnostics.push({
          code: "AUTHORITY_MAPPING_PARTIAL",
          severity: "BLOCKING",
          sourceRef: requirement.sourceRef,
          message: "An OPTIONAL authority mapping cannot weaken an explicitly REQUIRED canonical selection.",
        });
      }
      const canonicalAgentMapping = selectedSource?.source.kind === "Agent"
        ? authorityMappings.find((mapping) => mapping.sourceRef === requirement.sourceRef && mapping.dimension === requirement.dimension && mapping.canonicalMode !== undefined)
        : undefined;
      if (canonicalAgentMapping && requirement.requestedMode !== undefined &&
        AUTHORITY_MODE_RANK[requirement.requestedMode] > AUTHORITY_MODE_RANK[canonicalAgentMapping.canonicalMode!]) {
        diagnostics.push({
          code: "AGENT_AUTHORITY_CONFLICT",
          severity: "BLOCKING",
          sourceRef: requirement.sourceRef,
          message: `Requested ${requirement.dimension} mode ${requirement.requestedMode} exceeds canonical Agent ceiling ${canonicalAgentMapping.canonicalMode}.`,
        });
      }
      const selectionAllowsDegradation = !requirement.sourceRef ||
        (selectedSource?.item.requirement === "OPTIONAL" && selectedSource.item.allowDegradation === true);
      return {
        dimension: requirement.dimension,
        crosswalk: crosswalkFor(requirement.dimension),
        requirement: requirement.requirement,
        degradationAllowed: requirement.requirement === "OPTIONAL" && requirement.allowDegradation === true && selectionAllowsDegradation,
        ...(requirement.requestedMode ? { requestedMode: requirement.requestedMode } : {}),
        ...(requirement.sourceRef && sourceRefIsSelected ? { sourceRef: requirement.sourceRef } : {}),
      };
    });

  const allAuthorityMappings = [...authorityMappings, ...requestedAuthorityMappings].sort((left, right) => compareOrdinal(
    JSON.stringify([left.sourceRef ?? null, left.dimension, left.canonicalMode ?? null, left.requestedMode ?? null, left.requirement, left.degradationAllowed, left.crosswalk]),
    JSON.stringify([right.sourceRef ?? null, right.dimension, right.canonicalMode ?? null, right.requestedMode ?? null, right.requirement, right.degradationAllowed, right.crosswalk]),
  ));

  for (const mapping of allAuthorityMappings) {
    const diagnostic = evaluateAuthorityCrosswalk(mapping.crosswalk, mapping.requirement, mapping.degradationAllowed);
    if (diagnostic) diagnostics.push({
      ...diagnostic,
      ...(mapping.sourceRef ? { sourceRef: mapping.sourceRef } : {}),
      message: `${mapping.dimension}: ${diagnostic.message}`,
    });
  }

  const assessedPolicyRefs = new Set<string>();
  for (const policy of request.policyRequirements ?? []) {
    const source = ordered.find(({ source }) => source.ref === policy.sourceRef)?.source;
    if (!source || source.kind !== "Policy" ||
      (policy.requirement !== "REQUIRED" && policy.requirement !== "OPTIONAL") ||
      (policy.requiredStrength !== "HARD_ENFORCEMENT" && policy.requiredStrength !== "RUNTIME_GATE") ||
      typeof policy.nexoRuntimeEnforcement !== "boolean" ||
      (policy.allowDegradation !== undefined && typeof policy.allowDegradation !== "boolean")) {
      diagnostics.push({
        code: "SOURCE_REFERENCE_INVALID",
        severity: "BLOCKING",
        message: "Policy enforcement requirement must reference an explicitly selected Policy entity.",
      });
      continue;
    }
    const selectedPolicy = ordered.find(({ source }) => source.ref === policy.sourceRef);
    if (selectedPolicy?.item.requirement === "REQUIRED" && policy.requirement !== "REQUIRED") {
      diagnostics.push({
        code: "POLICY_ENFORCEMENT_UNSATISFIED",
        severity: "BLOCKING",
        sourceRef: policy.sourceRef,
        message: "A policy enforcement assessment cannot weaken an explicitly REQUIRED canonical selection.",
      });
      continue;
    }
    assessedPolicyRefs.add(policy.sourceRef);
    const diagnostic = evaluatePolicyEnforcement({
      ...policy,
      allowDegradation: policy.requirement === "OPTIONAL" &&
        selectedPolicy?.item.requirement === "OPTIONAL" &&
        selectedPolicy.item.allowDegradation === true &&
        policy.allowDegradation === true,
    });
    if (diagnostic) diagnostics.push(diagnostic);
  }

  for (const { item, source } of ordered) {
    if (source.kind !== "Policy" || assessedPolicyRefs.has(source.ref)) continue;
    const mayOmit = item.requirement === "OPTIONAL" && item.allowDegradation === true;
    diagnostics.push({
      code: "POLICY_ENFORCEMENT_UNSATISFIED",
      severity: mayOmit ? "WARNING" : "BLOCKING",
      sourceRef: source.ref,
      message: mayOmit
        ? "Optional Policy is omitted under explicit degradation; no policy enforcement assessment was supplied."
        : "Selected Policy has no explicit enforcement assessment; advisory prose cannot establish required enforcement.",
    });
  }

  const sortedDiagnostics = sortDiagnostics(diagnostics);
  const usable = !sortedDiagnostics.some((item) => item.severity === "BLOCKING" || item.severity === "ERROR");
  return {
    target,
    adapter: { ...CODEX_ADAPTER },
    sourceRefs: ordered.map(({ source }) => source),
    translations,
    authorityMappings: allAuthorityMappings,
    runtimeDependencies: runtimeDependencies.sort((left, right) => compareOrdinal(left.sourceRef, right.sourceRef)),
    diagnostics: sortedDiagnostics,
    usable,
  };
}
