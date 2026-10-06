import type { CanonicalEntityRecord } from "../../tools/validate/canonical-integrity.ts";
import { AUTHORITY_DIMENSIONS, CODEX_ADAPTER, CODEX_TARGET, KIND_DISPOSITIONS, type AuthorityCrosswalk, type AuthorityDimension, type AuthorityMapping, type AuthorityRequirement, type CanonicalSelection, type CanonicalSourceRef, type CompilationDiagnostic, type CodexCompilation, type PolicyEnforcementRequirement, type TranslationEntry } from "./model.ts";

const idPattern = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const versionPattern = /^[0-9]+\.[0-9]+\.[0-9]+$/;

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

  const translations: TranslationEntry[] = ordered.map(({ item, source }) => {
    const disposition = KIND_DISPOSITIONS[source.kind];
    const degradationAllowed = item.requirement === "OPTIONAL" && item.allowDegradation === true;
    if (disposition === "UNSUPPORTED" || disposition === "UNKNOWN") {
      diagnostics.push({
        code: disposition === "UNKNOWN" ? "TARGET_FEATURE_UNKNOWN" : "TARGET_FEATURE_UNSUPPORTED",
        severity: "BLOCKING",
        sourceRef: source.ref,
        message: `Selected ${source.kind} has no verified target translation.`,
      });
    } else if ((disposition === "NEXO_RUNTIME_ONLY" || disposition === "NO_TARGET_ARTIFACT") && !degradationAllowed) {
      diagnostics.push({
        code: "TARGET_FEATURE_UNSUPPORTED",
        severity: "BLOCKING",
        sourceRef: source.ref,
        message: `${source.kind} is ${disposition}; compilation cannot claim target support without explicit optional degradation.`,
      });
    } else if (disposition === "NEXO_RUNTIME_ONLY" || disposition === "NO_TARGET_ARTIFACT") {
      diagnostics.push({
        code: "TARGET_FEATURE_UNSUPPORTED",
        severity: "WARNING",
        sourceRef: source.ref,
        message: `${source.kind} is omitted from target artifacts under explicitly permitted optional degradation.`,
      });
    }
    return { source, disposition, requirement: item.requirement, degradationAllowed };
  });

  const authorityMappings: AuthorityMapping[] = [...(request.authorityRequirements ?? [])]
    .filter((requirement) => {
      const valid = AUTHORITY_DIMENSIONS.includes(requirement.dimension) &&
        (requirement.requirement === "REQUIRED" || requirement.requirement === "OPTIONAL");
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
      const selectionAllowsDegradation = !requirement.sourceRef ||
        (selectedSource?.item.requirement === "OPTIONAL" && selectedSource.item.allowDegradation === true);
      return {
        dimension: requirement.dimension,
        crosswalk: crosswalkFor(requirement.dimension),
        requirement: requirement.requirement,
        degradationAllowed: requirement.requirement === "OPTIONAL" && requirement.allowDegradation === true && selectionAllowsDegradation,
        ...(requirement.sourceRef && sourceRefIsSelected ? { sourceRef: requirement.sourceRef } : {}),
      };
    })
    .sort((left, right) => compareOrdinal(
      `${left.sourceRef ?? ""}|${left.dimension}|${left.requirement}`,
      `${right.sourceRef ?? ""}|${right.dimension}|${right.requirement}`,
    ));

  for (const mapping of authorityMappings) {
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
    authorityMappings,
    diagnostics: sortedDiagnostics,
    usable,
  };
}
