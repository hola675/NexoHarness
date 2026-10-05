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

export function parseEntityReference(value: string, path = "/"): EntityReference | ReferenceIssue | null {
  if (!/^[A-Za-z][A-Za-z0-9]*:/.test(value) || /^https?:/i.test(value)) return null;
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

export function collectEntityReferences(value: unknown, path = ""): { references: EntityReference[]; issues: ReferenceIssue[] } {
  const references: EntityReference[] = [];
  const issues: ReferenceIssue[] = [];
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const nested = collectEntityReferences(item, `${path}/${index}`);
      references.push(...nested.references);
      issues.push(...nested.issues);
    });
    return { references, issues };
  }
  if (value && typeof value === "object") {
    for (const [key, nestedValue] of Object.entries(value)) {
      const nested = collectEntityReferences(nestedValue, `${path}/${key}`);
      references.push(...nested.references);
      issues.push(...nested.issues);
    }
    return { references, issues };
  }
  if (typeof value === "string") {
    const parsed = parseEntityReference(value, path || "/");
    if (!parsed) return { references, issues };
    if ("message" in parsed) issues.push(parsed);
    else references.push(parsed);
  }
  return { references, issues };
}
