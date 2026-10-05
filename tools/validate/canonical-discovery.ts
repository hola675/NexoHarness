import { lstat, readdir } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

export type CanonicalFormat = "markdown" | "yaml";

export interface CanonicalRoot {
  path: string;
  kind: string;
  format: CanonicalFormat;
}

export const CANONICAL_ROOTS: CanonicalRoot[] = [
  { path: "core/directives", kind: "Directive", format: "markdown" },
  { path: "core/policies", kind: "Policy", format: "markdown" },
  { path: "core/contracts", kind: "Contract", format: "yaml" },
  { path: "agents", kind: "Agent", format: "markdown" },
  { path: "skills", kind: "Skill", format: "markdown" },
  { path: "rules", kind: "Rule", format: "yaml" },
  { path: "workflows", kind: "Workflow", format: "yaml" },
  { path: "capabilities", kind: "Capability", format: "yaml" },
  { path: "profiles", kind: "Profile", format: "yaml" },
  { path: "enforcement", kind: "Enforcement", format: "yaml" },
  { path: "evals", kind: "Evaluation", format: "yaml" },
];

export interface DiscoveredCanonicalFile {
  file: string;
  relativeFile: string;
  root: CanonicalRoot;
}

export interface DiscoveryIssue {
  code: "FORMAT_MISMATCH" | "MALFORMED_MANIFEST";
  file: string;
  path: string;
  message: string;
}

export function compareDeterministic(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

export function isCanonicalRootSymlink(details: { isSymbolicLink(): boolean }): boolean {
  return details.isSymbolicLink();
}

function expectedExtension(format: CanonicalFormat): string[] {
  return format === "markdown" ? [".md"] : [".yaml", ".yml"];
}

async function walkRoot(root: CanonicalRoot, rootPath: string, files: DiscoveredCanonicalFile[], issues: DiscoveryIssue[]): Promise<void> {
  let entries;
  try {
    entries = await readdir(rootPath, { withFileTypes: true });
  } catch (error) {
    issues.push({ code: "MALFORMED_MANIFEST", file: relative(repositoryRoot, rootPath), path: "/", message: `canonical root cannot be read: ${String(error)}` });
    return;
  }
  for (const entry of entries.sort((left, right) => compareDeterministic(left.name, right.name))) {
    const path = join(rootPath, entry.name);
    const relativeFile = relative(repositoryRoot, path).replaceAll("\\", "/");
    if (entry.name === ".gitkeep") continue;
    if (entry.isSymbolicLink()) {
      issues.push({ code: "FORMAT_MISMATCH", file: relativeFile, path: "/", message: "symbolic links are not supported in canonical roots" });
      continue;
    }
    if (entry.isDirectory()) {
      await walkRoot(root, path, files, issues);
      continue;
    }
    if (!entry.isFile()) {
      issues.push({ code: "FORMAT_MISMATCH", file: relativeFile, path: "/", message: "canonical source entry is not a regular file" });
      continue;
    }
    if (!expectedExtension(root.format).includes(extname(entry.name).toLowerCase())) {
      issues.push({ code: "FORMAT_MISMATCH", file: relativeFile, path: "/", message: `expected ${root.format} canonical format under ${root.path}` });
      continue;
    }
    files.push({ file: path, relativeFile, root });
  }
}

export async function discoverCanonicalFiles(rootDirectory = repositoryRoot): Promise<{ files: DiscoveredCanonicalFile[]; issues: DiscoveryIssue[] }> {
  const files: DiscoveredCanonicalFile[] = [];
  const issues: DiscoveryIssue[] = [];
  for (const root of CANONICAL_ROOTS) {
    const rootPath = join(rootDirectory, root.path);
    try {
      const details = await lstat(rootPath);
      if (isCanonicalRootSymlink(details)) {
        issues.push({ code: "FORMAT_MISMATCH", file: root.path, path: "/", message: "canonical root must not be a symbolic link" });
        continue;
      }
      if (!details.isDirectory()) {
        issues.push({ code: "MALFORMED_MANIFEST", file: root.path, path: "/", message: "canonical root is not a directory" });
        continue;
      }
    } catch {
      issues.push({ code: "MALFORMED_MANIFEST", file: root.path, path: "/", message: "canonical root does not exist" });
      continue;
    }
    await walkRoot(root, rootPath, files, issues);
  }
  files.sort((left, right) => compareDeterministic(left.relativeFile, right.relativeFile));
  issues.sort((left, right) => compareDeterministic(`${left.file}:${left.path}`, `${right.file}:${right.path}`));
  return { files, issues };
}
