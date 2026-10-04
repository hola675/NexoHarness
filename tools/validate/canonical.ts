import { readFile, readdir } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import {
  type CanonicalDocument,
  loadSchemaBundle,
  validateDocument,
  type SchemaBundle,
} from "./schemas.ts";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const canonicalRoots = [join(repositoryRoot, "core", "directives"), join(repositoryRoot, "core", "policies")];
const expectedCanonicalFiles = new Set([
  "core/directives/core-directive.md",
  "core/directives/execution-protocol.md",
  "core/policies/precedence.md",
  "core/policies/delegation.md",
  "core/policies/evidence.md",
  "core/policies/scope-control.md",
  "core/policies/completion.md",
  "core/policies/self-improvement.md",
]);
const prohibitedCanonicalCoupling = /Kilo|Claude|Context7|Serena|DBHub|Playwright|GitMCP|Cloudflare MCP|modelId|providerId/i;

export interface ParsedFrontmatter {
  data: CanonicalDocument;
  body: string;
}

export function parseFrontmatter(content: string, filePath: string): ParsedFrontmatter {
  const lines = content.split(/\r?\n/);
  if (lines[0] !== "---") {
    throw new Error(`${relative(repositoryRoot, filePath)} must start with YAML frontmatter (---).`);
  }
  const closingIndex = lines.findIndex((line, index) => index > 0 && line === "---");
  if (closingIndex === -1) {
    throw new Error(`${relative(repositoryRoot, filePath)} has unterminated YAML frontmatter.`);
  }
  let data: unknown;
  try {
    data = parseYaml(lines.slice(1, closingIndex).join("\n"), { prettyErrors: true });
  } catch (error) {
    throw new Error(`Invalid YAML frontmatter in ${relative(repositoryRoot, filePath)}: ${String(error)}`);
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error(`Frontmatter in ${relative(repositoryRoot, filePath)} must be a YAML object.`);
  }
  return { data: data as CanonicalDocument, body: lines.slice(closingIndex + 1).join("\n") };
}

async function canonicalFiles(): Promise<string[]> {
  const files: string[] = [];
  for (const root of canonicalRoots) {
    const entries = await readdir(root, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && extname(entry.name).toLowerCase() === ".md") files.push(join(root, entry.name));
    }
  }
  return files;
}

function bodyCouplingIssues(file: string, content: string): string[] {
  return prohibitedCanonicalCoupling.test(content) ? [relative(repositoryRoot, file)] : [];
}

function documentId(document: CanonicalDocument): string {
  const metadata = document.metadata;
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return "";
  return `${String(document.kind)}:${String((metadata as Record<string, unknown>).id)}`;
}

export async function validateCanonical(bundle?: SchemaBundle): Promise<number> {
  bundle ??= await loadSchemaBundle();
  const files = await canonicalFiles();
  const actualFiles = new Set(files.map((file) => relative(repositoryRoot, file).replaceAll("\\", "/")));
  const missing = [...expectedCanonicalFiles].filter((file) => !actualFiles.has(file));
  if (missing.length > 0) throw new Error(`Missing expected canonical entities:\n${missing.join("\n")}`);
  if (files.length !== expectedCanonicalFiles.size) throw new Error("Unexpected canonical entity file under core/directives or core/policies.");

  const documents: Array<{ file: string; content: string; document: CanonicalDocument }> = [];
  for (const file of files) {
    const content = await readFile(file, "utf8");
    const frontmatter = parseFrontmatter(content, file);
    documents.push({ file, content, document: frontmatter.data });
  }

  const knownIds = new Set(documents.map(({ document }) => documentId(document)));
  const seenIds = new Set<string>();
  for (const { file, content, document } of documents) {
    const issues = validateDocument(bundle, document, knownIds);
    const id = documentId(document);
    if (seenIds.has(id)) issues.push({ path: "/metadata/id", message: `duplicate canonical entity id ${id}` });
    seenIds.add(id);
    if (bodyCouplingIssues(file, content).length > 0) {
      issues.push({ path: "/", message: "canonical entity contains prohibited harness or provider coupling" });
    }
    if (issues.length > 0) {
      throw new Error(`Canonical entity ${relative(repositoryRoot, file)} failed:\n${issues.map((issue) => `${issue.path} ${issue.message}`).join("\n")}`);
    }
  }
  return documents.length;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const bundle = await loadSchemaBundle();
  const count = await validateCanonical(bundle);
  console.log(`Canonical validation passed for ${count} directives and policies.`);
}
