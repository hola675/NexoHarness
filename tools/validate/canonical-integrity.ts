import { readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseAllDocuments } from "yaml";
import { compareDeterministic, discoverCanonicalFiles, type CanonicalFormat, type DiscoveryIssue } from "./canonical-discovery.ts";
import { parseFrontmatter } from "./frontmatter.ts";
import { collectEntityReferences, declaredReferenceValues, parseEntityReference } from "./references.ts";
import { loadSchemaBundle, validateDocument, type CanonicalDocument, type SchemaBundle } from "./schemas.ts";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const prohibitedCanonicalCoupling = /Kilo|Claude|Context7|Serena|DBHub|Playwright|GitMCP|Cloudflare MCP|modelId|providerId/i;

export type DiagnosticCode =
  | "DUPLICATE_IDENTITY"
  | "UNRESOLVED_REFERENCE"
  | "VERSION_MISMATCH"
  | "REFERENCE_KIND_MISMATCH"
  | "MALFORMED_REFERENCE"
  | "PLACEMENT_MISMATCH"
  | "FORMAT_MISMATCH"
  | "MALFORMED_MANIFEST"
  | "SCHEMA_VALIDATION_FAILED";

export interface ValidationDiagnostic {
  code: DiagnosticCode;
  severity: "error" | "warning";
  file: string;
  path: string;
  message: string;
  reference?: string;
}

export interface CanonicalEntityRecord {
  key: string;
  kind: string;
  id: string;
  version: string;
  status: string;
  file: string;
  format: CanonicalFormat;
  document: CanonicalDocument;
}

export interface CanonicalIndex {
  records: CanonicalEntityRecord[];
  byKey: Map<string, CanonicalEntityRecord>;
}

export interface IntegrityResult {
  entityCount: number;
  index: CanonicalIndex;
  diagnostics: ValidationDiagnostic[];
}

function diagnostic(code: DiagnosticCode, file: string, path: string, message: string, reference?: string): ValidationDiagnostic {
  return { code, severity: "error", file, path, message, ...(reference ? { reference } : {}) };
}

function displayFile(file: string): string {
  return file.replaceAll("\\", "/");
}

function discoveryDiagnostic(issue: DiscoveryIssue): ValidationDiagnostic {
  return diagnostic(issue.code, displayFile(issue.file), issue.path, issue.message);
}

async function parseYamlManifest(content: string): Promise<CanonicalDocument> {
  const documents = parseAllDocuments(content, { prettyErrors: true });
  if (documents.length !== 1) throw new Error("canonical YAML file must contain exactly one document");
  if (documents[0].errors.length > 0) throw new Error(documents[0].errors.map(String).join("; "));
  const value = documents[0].toJS();
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("canonical YAML document must be an object");
  return value as CanonicalDocument;
}

function metadataOf(document: CanonicalDocument): Record<string, unknown> | undefined {
  return document.metadata && typeof document.metadata === "object" && !Array.isArray(document.metadata)
    ? document.metadata as Record<string, unknown>
    : undefined;
}

function schemaDiagnostics(file: string, document: CanonicalDocument, bundle: SchemaBundle): ValidationDiagnostic[] {
  return validateDocument(bundle, document).map((issue) => diagnostic("SCHEMA_VALIDATION_FAILED", file, issue.path, issue.message));
}

function typedReferenceDiagnostics(record: CanonicalEntityRecord): ValidationDiagnostic[] {
  const diagnostics: ValidationDiagnostic[] = [];
  for (const item of declaredReferenceValues(record.document, record.kind as Parameters<typeof declaredReferenceValues>[1])) {
    if (typeof item.value !== "string" || item.rule.allowedTargetKinds === "ANY") continue;
    const parsed = parseEntityReference(item.value, item.path);
    if (!parsed || "message" in parsed) continue;
    if (!item.rule.allowedTargetKinds.includes(parsed.kind)) {
      diagnostics.push(diagnostic("REFERENCE_KIND_MISMATCH", record.file, item.path, `expected ${item.rule.allowedTargetKinds.join(" or ")} reference`, item.value));
    }
  }
  return diagnostics;
}

function resolveReferences(record: CanonicalEntityRecord, index: CanonicalIndex): ValidationDiagnostic[] {
  const diagnostics: ValidationDiagnostic[] = [];
  const collected = collectEntityReferences(record.document, record.kind as Parameters<typeof collectEntityReferences>[1]);
  for (const issue of collected.issues) {
    diagnostics.push(diagnostic("MALFORMED_REFERENCE", record.file, issue.path, issue.message, issue.value));
  }
  for (const reference of collected.references) {
    const key = `${reference.kind}:${reference.id}`;
    const target = index.byKey.get(key);
    if (!target) {
      diagnostics.push(diagnostic("UNRESOLVED_REFERENCE", record.file, reference.path, "target does not exist", reference.value));
      continue;
    }
    if (reference.version && target.version !== reference.version) {
      diagnostics.push(diagnostic("VERSION_MISMATCH", record.file, reference.path, `target version is ${target.version}`, reference.value));
    }
  }
  diagnostics.push(...typedReferenceDiagnostics(record));
  return diagnostics;
}

function sortDiagnostics(diagnostics: ValidationDiagnostic[]): ValidationDiagnostic[] {
  return diagnostics.sort((left, right) => compareDeterministic(`${left.file}:${left.path}:${left.code}:${left.message}`, `${right.file}:${right.path}:${right.code}:${right.message}`));
}

export function formatDiagnostics(diagnostics: ValidationDiagnostic[]): string {
  return diagnostics.map((item) => {
    const reference = item.reference ? ` reference=${item.reference}` : "";
    return `ERROR ${item.code}\nfile: ${item.file}\npath: ${item.path}${reference}\nmessage: ${item.message}`;
  }).join("\n");
}

export async function validateCanonicalIntegrity(bundle?: SchemaBundle, rootDirectory = repositoryRoot): Promise<IntegrityResult> {
  bundle ??= await loadSchemaBundle();
  const discovered = await discoverCanonicalFiles(rootDirectory);
  const diagnostics: ValidationDiagnostic[] = discovered.issues.map(discoveryDiagnostic);
  const parsed: CanonicalEntityRecord[] = [];

  for (const entry of discovered.files) {
    let document: CanonicalDocument;
    try {
      const content = await readFile(entry.file, "utf8");
      if (prohibitedCanonicalCoupling.test(content)) {
        diagnostics.push(diagnostic("SCHEMA_VALIDATION_FAILED", entry.relativeFile, "/", "canonical entity contains prohibited harness or provider coupling"));
      }
      document = entry.root.format === "markdown" ? parseFrontmatter(content, entry.file).data : await parseYamlManifest(content);
    } catch (error) {
      diagnostics.push(diagnostic("MALFORMED_MANIFEST", entry.relativeFile, "/", String(error)));
      continue;
    }

    const schemaIssues = schemaDiagnostics(entry.relativeFile, document, bundle);
    diagnostics.push(...schemaIssues);
    if (schemaIssues.length > 0 && typeof document.kind === "string") {
      const malformedReferences = collectEntityReferences(document, document.kind as Parameters<typeof collectEntityReferences>[1]).issues;
      for (const issue of malformedReferences) {
        diagnostics.push(diagnostic("MALFORMED_REFERENCE", entry.relativeFile, issue.path, issue.message, issue.value));
      }
    }
    if (document.kind !== entry.root.kind) {
      diagnostics.push(diagnostic("PLACEMENT_MISMATCH", entry.relativeFile, "/kind", `root ${entry.root.path} requires kind ${entry.root.kind}`));
    }
    const metadata = metadataOf(document);
    if (schemaIssues.length > 0 || !metadata || typeof document.kind !== "string" || document.kind !== entry.root.kind) continue;
    parsed.push({
      key: `${document.kind}:${String(metadata.id)}`,
      kind: document.kind,
      id: String(metadata.id),
      version: String(metadata.version),
      status: String(metadata.status),
      file: entry.relativeFile,
      format: entry.root.format,
      document,
    });
  }

  const byKey = new Map<string, CanonicalEntityRecord>();
  const records: CanonicalEntityRecord[] = [];
  for (const record of parsed.sort((left, right) => compareDeterministic(left.file, right.file))) {
    const existing = byKey.get(record.key);
    if (existing) {
      diagnostics.push(diagnostic("DUPLICATE_IDENTITY", record.file, "/metadata/id", `logical identity already defined in ${existing.file}`));
      continue;
    }
    byKey.set(record.key, record);
    records.push(record);
  }
  records.sort((left, right) => compareDeterministic(left.key, right.key));
  const index = { records, byKey };
  for (const record of records) diagnostics.push(...resolveReferences(record, index));
  return { entityCount: records.length, index, diagnostics: sortDiagnostics(diagnostics) };
}

if (process.argv[1]?.endsWith("canonical-integrity.ts")) {
  const result = await validateCanonicalIntegrity();
  if (result.diagnostics.length > 0) {
    console.error(formatDiagnostics(result.diagnostics));
    process.exitCode = 1;
  } else {
    console.log(`Canonical integrity validation passed for ${result.entityCount} entities.`);
  }
}
