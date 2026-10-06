import type { CodexCompilation, CodexSkillsRenderResult, CompilationDiagnostic, SkillCandidate } from "./model.ts";

function compareOrdinal(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function lf(value: string): string {
  return value.replaceAll("\r\n", "\n").replaceAll("\r", "\n");
}

function listItem(value: string, index: number, ordered: boolean): string {
  const lines = lf(value).split("\n");
  const prefix = ordered ? `${index + 1}. ` : "- ";
  return `${prefix}${lines[0]}${lines.slice(1).map((line) => `\n   ${line}`).join("")}`;
}

function referenceFence(value: string): string {
  const runs = value.match(/`+/g) ?? [];
  const fence = "`".repeat(Math.max(3, ...runs.map((run) => run.length + 1)));
  return `${fence}\n${lf(value)}\n${fence}`;
}

function renderOne(candidate: SkillCandidate): string {
  const sections = [
    "<!-- NexoHarness generated Skill. Do not edit manually. -->",
    "<!-- Canonical source is authoritative; regenerate this copy from canonical sources. -->",
    "<!-- Skill instructions provide guidance and grant no authority. -->",
    `<!-- Source: ${candidate.source.ref} -->`,
    `# ${candidate.name}`,
    "## Purpose",
    lf(candidate.purpose),
    "## Activation conditions",
    "Use these conditions as guidance; they are not hard routing rules.",
    candidate.activationConditions.map((item, index) => listItem(item, index, false)).join("\n") || "No activation conditions specified.",
    "## Procedure",
    candidate.procedure.map((item, index) => listItem(item, index, true)).join("\n") || "No procedure steps specified.",
  ];
  if (candidate.references && candidate.references.length > 0) {
    sections.push("## Canonical references (not materialized)");
    sections.push(...candidate.references.map(referenceFence));
  }
  return `---\nname: ${JSON.stringify(candidate.name)}\ndescription: ${JSON.stringify(candidate.description)}\n---\n\n${sections.join("\n\n").replaceAll("\r\n", "\n").replaceAll("\r", "\n")}\n`;
}

function sortedDiagnostics(items: CompilationDiagnostic[]): CompilationDiagnostic[] {
  return items.sort((left, right) => compareOrdinal(
    `${left.sourceRef ?? ""}|${left.code}|${left.severity}|${left.message}`,
    `${right.sourceRef ?? ""}|${right.code}|${right.severity}|${right.message}`,
  ));
}

export function renderCodexSkills(compilation: CodexCompilation): CodexSkillsRenderResult {
  if (!compilation.usable) {
    return {
      artifacts: [],
      usable: false,
      diagnostics: [{ code: "COMPILATION_UNUSABLE", severity: "BLOCKING", message: "An unusable compilation cannot produce Codex Skill artifacts." }],
    };
  }
  const candidates = [...compilation.skillCandidates].sort((left, right) =>
    compareOrdinal(left.source.ref, right.source.ref) || compareOrdinal(left.name, right.name));
  const artifacts = [] as CodexSkillsRenderResult["artifacts"];
  const diagnostics: CompilationDiagnostic[] = [];
  for (const candidate of candidates) {
    if (candidate.name.length > 64) {
      diagnostics.push({ code: "SKILL_NAME_UNREPRESENTABLE", severity: "BLOCKING", sourceRef: candidate.source.ref, message: "Codex Skill names are limited to 64 characters; no artifact was emitted and the name was not truncated." });
      continue;
    }
    if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(candidate.name)) {
      diagnostics.push({ code: "SKILL_CONTENT_INVALID", severity: "BLOCKING", sourceRef: candidate.source.ref, message: "Codex Skill name is not a valid canonical identifier." });
      continue;
    }
    artifacts.push({
      path: `.agents/skills/${candidate.name}/SKILL.md`,
      content: renderOne(candidate),
      encoding: "UTF-8",
      sourceRefs: [candidate.source.ref],
    });
  }
  const sorted = sortedDiagnostics(diagnostics);
  return { artifacts, diagnostics: sorted, usable: sorted.length === 0 };
}
