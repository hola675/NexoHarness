import { readFile, readdir } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Ajv2020 } from "ajv/dist/2020.js";
import type { ErrorObject, ValidateFunction } from "ajv";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const schemaRoot = join(repositoryRoot, "core", "schemas");
const fixtureRoot = join(repositoryRoot, "tests", "fixtures", "schemas");
const prohibitedCanonicalCoupling = /Kilo|Claude|Context7|Serena|DBHub|Playwright|GitMCP|Cloudflare MCP|modelId|providerId/i;

export const SUPPORTED_KINDS = [
  "Directive",
  "Policy",
  "Agent",
  "Skill",
  "Rule",
  "Workflow",
  "Contract",
  "Capability",
  "Profile",
  "Enforcement",
  "Evaluation",
  "Observation",
  "ImprovementProposal",
] as const;

export type CanonicalKind = (typeof SUPPORTED_KINDS)[number];
export type CanonicalDocument = Record<string, unknown>;

export const ENTITY_REFERENCE_PATTERN = /^(Directive|Policy|Agent|Skill|Rule|Workflow|Contract|Capability|Profile|Enforcement|Evaluation|Observation|ImprovementProposal):[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:@[0-9]+\.[0-9]+\.[0-9]+)?$/;

export interface SchemaRegistry {
  apiVersion: string;
  version: string;
  schemas: Record<string, string>;
}

export interface SchemaBundle {
  ajv: Ajv2020;
  registry: SchemaRegistry;
  validators: Map<string, ValidateFunction>;
}

export interface ValidationIssue {
  path: string;
  message: string;
}

async function readJson(path: string): Promise<unknown> {
  let content: string;
  try {
    content = await readFile(path, "utf8");
  } catch (error) {
    throw new Error(`Unable to read JSON file ${relative(repositoryRoot, path)}: ${String(error)}`);
  }
  try {
    return JSON.parse(content) as unknown;
  } catch (error) {
    throw new Error(`Invalid JSON in ${relative(repositoryRoot, path)}: ${String(error)}`);
  }
}

function assertRegistry(value: unknown): SchemaRegistry {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Schema registry must be an object.");
  }
  const registry = value as Partial<SchemaRegistry>;
  if (registry.apiVersion !== "nexo/v1alpha1" || typeof registry.version !== "string" || !registry.schemas) {
    throw new Error("Schema registry must define apiVersion, version and schemas.");
  }
  const entries = Object.entries(registry.schemas);
  const kinds = entries.map(([kind]) => kind);
  const schemaPaths = entries.map(([, schemaPath]) => schemaPath);
  if (kinds.length !== new Set(kinds).size || schemaPaths.length !== new Set(schemaPaths).size) {
    throw new Error("Schema registry contains duplicate kind or schema mappings.");
  }
  const expectedKinds = [...SUPPORTED_KINDS].sort();
  const actualKinds = kinds.sort();
  if (JSON.stringify(expectedKinds) !== JSON.stringify(actualKinds)) {
    throw new Error(`Schema registry kinds must be exactly: ${SUPPORTED_KINDS.join(", ")}`);
  }
  return registry as SchemaRegistry;
}

export async function loadSchemaBundle(): Promise<SchemaBundle> {
  const registryValue = await readJson(join(schemaRoot, "registry.json")) as Record<string, unknown>;
  if (registryValue.$schema !== "https://json-schema.org/draft/2020-12/schema") {
    throw new Error("registry.json must use JSON Schema Draft 2020-12.");
  }
  const registry = assertRegistry(registryValue);
  const common = await readJson(join(schemaRoot, "common.schema.json")) as Record<string, unknown>;
  if (common.$id !== "https://nexoharness.dev/schemas/common.schema.json" || common.$schema !== "https://json-schema.org/draft/2020-12/schema") {
    throw new Error("common.schema.json must use Draft 2020-12 and its canonical $id.");
  }

  if (prohibitedCanonicalCoupling.test(JSON.stringify(common))) {
    throw new Error("common.schema.json contains prohibited harness or provider coupling.");
  }
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  ajv.addSchema(common);
  const commonValidator = ajv.getSchema(String(common.$id));
  if (!commonValidator) throw new Error("Unable to compile common.schema.json.");
  const validators = new Map<string, ValidateFunction>();

  for (const [kind, schemaPath] of Object.entries(registry.schemas)) {
    const schemaFile = join(schemaRoot, schemaPath);
    const schema = await readJson(schemaFile) as Record<string, unknown>;
    if (schema.$schema !== "https://json-schema.org/draft/2020-12/schema") {
      throw new Error(`${relative(repositoryRoot, schemaFile)} must use JSON Schema Draft 2020-12.`);
    }
    if (typeof schema.$id !== "string") {
      throw new Error(`${relative(repositoryRoot, schemaFile)} must define an $id.`);
    }
    const schemaKind = (schema.properties as Record<string, unknown> | undefined)?.kind;
    if (!schemaKind || typeof schemaKind !== "object" || (schemaKind as Record<string, unknown>).const !== kind) {
      throw new Error(`${relative(repositoryRoot, schemaFile)} does not declare kind ${kind}.`);
    }
    if (prohibitedCanonicalCoupling.test(JSON.stringify(schema))) {
      throw new Error(`${relative(repositoryRoot, schemaFile)} contains prohibited harness or provider coupling.`);
    }
    ajv.addSchema(schema);
    const validator = ajv.getSchema(schema.$id);
    if (!validator) {
      throw new Error(`Unable to compile schema for ${kind}: ${relative(repositoryRoot, schemaFile)}`);
    }
    validators.set(kind, validator);
  }

  return { ajv, registry, validators };
}

function formatAjvPath(error: ErrorObject): string {
  if (error.keyword === "required" && typeof error.params === "object" && error.params && "missingProperty" in error.params) {
    return `${error.instancePath || "/"}/${String(error.params.missingProperty)}`;
  }
  return error.instancePath || "/";
}

export function formatValidationIssues(errors: ErrorObject[] | null | undefined): ValidationIssue[] {
  return (errors ?? []).map((error) => ({
    path: formatAjvPath(error),
    message: error.message ?? error.keyword,
  }));
}

function customDocumentIssues(document: CanonicalDocument): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const spec = document.spec;
  if (!spec || typeof spec !== "object" || Array.isArray(spec)) return issues;
  const steps = (spec as Record<string, unknown>).steps;
  if (Array.isArray(steps)) {
    const ids = steps.map((step) => step && typeof step === "object" && !Array.isArray(step) ? (step as Record<string, unknown>).id : undefined);
    const duplicates = ids.filter((id, index) => typeof id === "string" && ids.indexOf(id) !== index);
    if (duplicates.length > 0) issues.push({ path: "/spec/steps", message: "step ids must be unique" });
    const entryStep = (spec as Record<string, unknown>).entryStep;
    if (typeof entryStep === "string" && !ids.includes(entryStep)) {
      issues.push({ path: "/spec/entryStep", message: "entryStep must reference a declared step id" });
    }
  }
  return issues;
}

export function collectReferenceIssues(value: unknown, knownIds: Set<string>, path = ""): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (Array.isArray(value)) {
    value.forEach((item, index) => issues.push(...collectReferenceIssues(item, knownIds, `${path}/${index}`)));
    return issues;
  }
  if (value && typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      issues.push(...collectReferenceIssues(nested, knownIds, `${path}/${key}`));
    }
    return issues;
  }
  if (typeof value !== "string" || !/^[A-Za-z][A-Za-z0-9]*:/.test(value)) return issues;
  if (/^https?:/i.test(value)) return issues;
  if (!ENTITY_REFERENCE_PATTERN.test(value)) {
    issues.push({ path: path || "/", message: "malformed entity reference" });
  } else {
    const [kind, idWithVersion] = value.split(":");
    const id = idWithVersion.split("@")[0];
    if (!knownIds.has(`${kind}:${id}`)) {
      issues.push({ path: path || "/", message: `unknown entity reference ${value}` });
    }
  }
  return issues;
}

export function validateDocument(bundle: SchemaBundle, document: CanonicalDocument, knownIds = new Set<string>()): ValidationIssue[] {
  const kind = document.kind;
  if (typeof kind !== "string" || !bundle.validators.has(kind)) {
    return [{ path: "/kind", message: `unsupported canonical kind ${String(kind)}` }];
  }
  const validator = bundle.validators.get(kind) as ValidateFunction;
  const valid = validator(document);
  const issues = formatValidationIssues(validator.errors);
  if (valid) issues.push(...customDocumentIssues(document));
  issues.push(...collectReferenceIssues(document, knownIds));
  return issues;
}

async function fixtureFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && extname(entry.name).toLowerCase() === ".json")
    .map((entry) => join(directory, entry.name));
}

async function readFixture(path: string): Promise<CanonicalDocument> {
  const value = await readJson(path);
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Fixture ${relative(repositoryRoot, path)} must contain a JSON object.`);
  }
  return value as CanonicalDocument;
}

function expectedInvalidPath(file: string): string {
  const expectations: Record<string, string> = {
    "directive-invalid-api-version.json": "/apiVersion",
    "policy-missing-summary.json": "/spec/summary",
    "agent-invalid-authority.json": "/spec/authority",
    "skill-missing-purpose.json": "/spec/purpose",
    "rule-invalid-severity.json": "/spec/severity",
    "workflow-duplicate-step-ids.json": "/spec/steps",
    "contract-invalid-status.json": "/spec/status",
    "capability-missing-semantic.json": "/spec/semantic",
    "profile-malformed-reference.json": "/spec/capabilities/0",
    "enforcement-invalid-level.json": "/spec/level",
    "evaluation-missing-pass-criteria.json": "/spec/passCriteria",
    "observation-invalid-result-status.json": "/spec/resultStatus",
    "improvement-proposal-no-approval.json": "/spec/requiresExplicitApproval",
  };
  return expectations[file] ?? "/";
}

export async function validateFixtures(bundle?: SchemaBundle): Promise<{ valid: number; invalid: number }> {
  bundle ??= await loadSchemaBundle();
  const validPaths = await fixtureFiles(join(fixtureRoot, "valid"));
  const invalidPaths = await fixtureFiles(join(fixtureRoot, "invalid"));
  if (validPaths.length !== SUPPORTED_KINDS.length || invalidPaths.length !== SUPPORTED_KINDS.length) {
    throw new Error(`Expected one valid and one invalid fixture for each of ${SUPPORTED_KINDS.length} kinds.`);
  }

  const validDocuments = await Promise.all(validPaths.map(async (path) => [path, await readFixture(path)] as const));
  const knownIds = new Set(validDocuments.map(([, document]) => `${String(document.kind)}:${String((document.metadata as Record<string, unknown>)?.id)}`));
  const validKinds = new Set<string>();
  for (const [path, document] of validDocuments) {
    validKinds.add(String(document.kind));
    const issues = validateDocument(bundle, document, knownIds);
    if (issues.length > 0) {
      throw new Error(`Valid fixture ${relative(repositoryRoot, path)} failed:\n${issues.map((issue) => `${issue.path} ${issue.message}`).join("\n")}`);
    }
  }
  if (validKinds.size !== SUPPORTED_KINDS.length) throw new Error("Valid fixtures do not cover every supported kind.");

  const invalidKinds = new Set<string>();
  for (const path of invalidPaths) {
    const document = await readFixture(path);
    invalidKinds.add(String(document.kind));
    const issues = validateDocument(bundle, document, knownIds);
    const expectedPath = expectedInvalidPath(relative(join(fixtureRoot, "invalid"), path));
    if (issues.length === 0 || !issues.some((issue) => issue.path === expectedPath)) {
      throw new Error(`Invalid fixture ${relative(repositoryRoot, path)} did not fail at ${expectedPath}. Issues: ${JSON.stringify(issues)}`);
    }
  }
  if (invalidKinds.size !== SUPPORTED_KINDS.length) throw new Error("Invalid fixtures do not cover every supported kind.");
  return { valid: validPaths.length, invalid: invalidPaths.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const bundle = await loadSchemaBundle();
  const fixtures = await validateFixtures(bundle);
  console.log(`Schema compilation passed for ${bundle.validators.size} kinds; fixtures passed (${fixtures.valid} valid, ${fixtures.invalid} invalid).`);
}
