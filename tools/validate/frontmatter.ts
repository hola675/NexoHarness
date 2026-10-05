import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import type { CanonicalDocument } from "./schemas.ts";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

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
