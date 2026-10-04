import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

export const requiredRootFiles = [
  "README.md",
  "LICENSE",
  "CHANGELOG.md",
  "CONTRIBUTING.md",
  "CODE_OF_CONDUCT.md",
  "SECURITY.md",
  "THIRD_PARTY_NOTICES.md",
  "AGENTS.md",
  "ROADMAP.md",
  ".gitignore",
  ".editorconfig",
  "package.json",
  "tsconfig.json",
];

export const requiredCoreFiles = [
  "core/directives/core-directive.md",
  "core/directives/execution-protocol.md",
  "core/policies/precedence.md",
  "core/policies/delegation.md",
  "core/policies/evidence.md",
  "core/policies/scope-control.md",
  "core/policies/completion.md",
  "core/policies/self-improvement.md",
];

export const requiredDocumentationFiles = [
  "docs/architecture.md",
  "docs/principles.md",
  "docs/terminology.md",
  "docs/source-of-truth.md",
  "docs/lifecycle.md",
  "docs/concepts/agents.md",
  "docs/concepts/skills.md",
  "docs/concepts/rules.md",
  "docs/concepts/workflows.md",
  "docs/concepts/contracts.md",
  "docs/concepts/capabilities.md",
  "docs/concepts/profiles.md",
  "docs/concepts/enforcement.md",
  "docs/concepts/evaluations.md",
  "docs/concepts/task-observer.md",
  "docs/adapters/kilo.md",
  "docs/research/methodology.md",
  "docs/research/upstream-sources.md",
];

export const requiredCanonicalDirectories = [
  "core",
  "core/directives",
  "core/policies",
  "agents",
  "skills",
  "rules",
  "workflows",
  "capabilities",
  "profiles",
  "observer",
  "evals",
  "enforcement",
  "adapters",
  "installer",
  "tools",
  "research",
  "third-party",
  "tests",
];

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function markdownFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === "dist") continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await markdownFiles(path));
    else if (entry.isFile() && extname(entry.name).toLowerCase() === ".md") files.push(path);
  }
  return files;
}

export async function validateMarkdownLinks(): Promise<string[]> {
  const failures: string[] = [];
  const markdown = await markdownFiles(repositoryRoot);
  const linkPattern = /!?\[[^\]]*\]\(([^)]+)\)/g;
  for (const file of markdown) {
    const content = await readFile(file, "utf8");
    for (const match of content.matchAll(linkPattern)) {
      const target = match[1].trim().split(/\s+/)[0];
      if (!target || target.startsWith("#") || /^[a-z][a-z\d+.-]*:/i.test(target)) continue;
      const pathTarget = target.split("#", 1)[0];
      if (!pathTarget) continue;
      if (!(await exists(resolve(dirname(file), pathTarget)))) {
        failures.push(`${relative(repositoryRoot, file)} -> ${target}`);
      }
    }
  }
  return failures;
}

export async function validateRepository(): Promise<void> {
  const requiredFiles = [...requiredRootFiles, ...requiredDocumentationFiles, ...requiredCoreFiles];
  const filePresence = await Promise.all(requiredFiles.map(async (path) => [
    path,
    await exists(join(repositoryRoot, path)),
  ] as const));
  const missingFiles = filePresence.filter(([, present]) => !present).map(([path]) => path);
  if (missingFiles.length > 0) {
    throw new Error(`Missing required files:\n${missingFiles.join("\n")}`);
  }

  const missingDirectories: string[] = [];
  for (const directory of requiredCanonicalDirectories) {
    if (!(await exists(join(repositoryRoot, directory)))) missingDirectories.push(directory);
  }
  if (missingDirectories.length > 0) {
    throw new Error(`Missing required directories:\n${missingDirectories.join("\n")}`);
  }

  const canonicalGeneratedPaths = requiredCanonicalDirectories
    .map((directory) => join(repositoryRoot, directory, "dist"));
  const generatedInputs = [];
  for (const path of canonicalGeneratedPaths) {
    if (await exists(path)) generatedInputs.push(relative(repositoryRoot, path));
  }
  if (generatedInputs.length > 0) {
    throw new Error(`Generated paths must not be canonical inputs:\n${generatedInputs.join("\n")}`);
  }

  const brokenLinks = await validateMarkdownLinks();
  if (brokenLinks.length > 0) {
    throw new Error(`Broken Markdown links:\n${brokenLinks.join("\n")}`);
  }

  const coreFiles = await markdownFiles(join(repositoryRoot, "core"));
  const forbiddenProviderNames = /Context7|Serena|DBHub|Playwright|GitMCP|Cloudflare MCP/i;
  const nonNeutralCoreFiles: string[] = [];
  for (const file of coreFiles) {
    if (forbiddenProviderNames.test(await readFile(file, "utf8"))) {
      nonNeutralCoreFiles.push(relative(repositoryRoot, file));
    }
  }
  if (nonNeutralCoreFiles.length > 0) {
    throw new Error(`Canonical core files contain provider-specific behavior:\n${nonNeutralCoreFiles.join("\n")}`);
  }

  const requiredText = [
    ["docs/concepts/task-observer.md", "human approval"],
    ["core/policies/self-improvement.md", "explicit approval"],
    ["AGENTS.md", "core/directives/core-directive.md"],
    ["AGENTS.md", "not the canonical runtime directive"],
    ["docs/concepts/directives.md", "AGENT != SKILL"],
    ["docs/concepts/directives.md", "MCP != CAPABILITY"],
  ] as const;
  for (const [path, text] of requiredText) {
    const content = await readFile(join(repositoryRoot, path), "utf8");
    if (!content.includes(text)) {
      throw new Error(`Required architectural statement missing: ${path} -> ${text}`);
    }
  }

  const roadmap = await readFile(join(repositoryRoot, "ROADMAP.md"), "utf8");
  if (roadmap.indexOf("0.0.5 Core Directive & Execution Model") > roadmap.indexOf("0.1 Canonical schemas")) {
    throw new Error("ROADMAP.md must place phase 0.0.5 before phase 0.1.");
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await validateRepository();
  console.log("Repository validation passed.");
}
