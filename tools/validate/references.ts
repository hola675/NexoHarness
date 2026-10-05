import { SUPPORTED_KINDS, type CanonicalKind } from "./schemas.ts";

const idPattern = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const versionPattern = /^[0-9]+\.[0-9]+\.[0-9]+$/;
const rawReferencePattern = /^([^:]+):([^@]+)(?:@(.+))?$/;

export interface EntityReference {
  kind: CanonicalKind;
  id: string;
  version?: string;
  value: string;
  path: string;
}

export interface ReferenceIssue {
  path: string;
  value: string;
  message: string;
}

export interface ReferenceFieldRule {
  sourceKind: CanonicalKind;
  path: string;
  allowedTargetKinds: readonly CanonicalKind[] | "ANY";
}

export const REFERENCE_FIELD_RULES: readonly ReferenceFieldRule[] = [
  { sourceKind: "Policy", path: "/spec/relatedRules/*", allowedTargetKinds: ["Rule"] },
  { sourceKind: "Agent", path: "/spec/capabilities/*", allowedTargetKinds: ["Capability"] },
  { sourceKind: "Skill", path: "/spec/relatedAgents/*", allowedTargetKinds: ["Agent"] },
  { sourceKind: "Rule", path: "/spec/enforcement/*", allowedTargetKinds: ["Enforcement"] },
  { sourceKind: "Rule", path: "/spec/evals/*", allowedTargetKinds: ["Evaluation"] },
  { sourceKind: "Workflow", path: "/spec/steps/*/agent", allowedTargetKinds: ["Agent"] },
  { sourceKind: "Profile", path: "/spec/capabilities/*", allowedTargetKinds: ["Capability"] },
  { sourceKind: "Enforcement", path: "/spec/ruleRefs/*", allowedTargetKinds: ["Rule"] },
  { sourceKind: "Evaluation", path: "/spec/target", allowedTargetKinds: "ANY" },
  { sourceKind: "Observation", path: "/spec/workflowRef", allowedTargetKinds: ["Workflow"] },
  { sourceKind: "Observation", path: "/spec/execution/agentRefs/*", allowedTargetKinds: ["Agent"] },
  { sourceKind: "Observation", path: "/spec/subject", allowedTargetKinds: "ANY" },
  { sourceKind: "ImprovementProposal", path: "/spec/observationRefs/*", allowedTargetKinds: ["Observation"] },
  { sourceKind: "ImprovementProposal", path: "/spec/target", allowedTargetKinds: "ANY" },
];

export function parseEntityReference(value: string, path = "/"): EntityReference | ReferenceIssue | null {
  if (!/^[A-Za-z][A-Za-z0-9]*:/.test(value)) return null;
  const match = rawReferencePattern.exec(value);
  if (!match) return { path, value, message: "reference must use Kind:id[@version] syntax" };
  const [, rawKind, id, version] = match;
  if (!SUPPORTED_KINDS.includes(rawKind as CanonicalKind)) {
    return { path, value, message: `unsupported reference kind ${rawKind}` };
  }
  if (!idPattern.test(id)) return { path, value, message: "reference id must be kebab-case" };
  if (version && !versionPattern.test(version)) return { path, value, message: "reference version must use major.minor.patch" };
  return { kind: rawKind as CanonicalKind, id, version, value, path };
}

function valuesAt(document: unknown, segments: string[], path = ""): Array<{ value: unknown; path: string }> {
  if (segments.length === 0) return [{ value: document, path: path || "/" }];
  const [segment, ...rest] = segments;
  if (segment === "*") {
    if (!Array.isArray(document)) return [];
    return document.flatMap((value, index) => valuesAt(value, rest, `${path}/${index}`));
  }
  if (!document || typeof document !== "object" || Array.isArray(document)) return [];
  const object = document as Record<string, unknown>;
  if (!(segment in object)) return [];
  return valuesAt(object[segment], rest, `${path}/${segment}`);
}

export function declaredReferenceValues(document: unknown, sourceKind: CanonicalKind): Array<{ value: unknown; path: string; rule: ReferenceFieldRule }> {
  return REFERENCE_FIELD_RULES
    .filter((rule) => rule.sourceKind === sourceKind)
    .flatMap((rule) => valuesAt(document, rule.path.split("/").filter(Boolean)).map((item) => ({ ...item, rule })));
}

export function collectEntityReferences(document: unknown, sourceKind: CanonicalKind): { references: EntityReference[]; issues: ReferenceIssue[] } {
  const references: EntityReference[] = [];
  const issues: ReferenceIssue[] = [];
  for (const item of declaredReferenceValues(document, sourceKind)) {
    if (typeof item.value !== "string") {
      issues.push({ path: item.path, value: String(item.value), message: "declared reference field must contain a string reference" });
      continue;
    }
    const parsed = parseEntityReference(item.value, item.path);
    if (!parsed) {
      issues.push({ path: item.path, value: item.value, message: "declared reference must use Kind:id[@version] syntax" });
    } else if ("message" in parsed) {
      issues.push(parsed);
    } else {
      references.push(parsed);
    }
  }
  return { references, issues };
}
