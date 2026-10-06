import type { CodexCompilation, CodexRenderResult, CompilationDiagnostic, InstructionCandidate } from "./model.ts";

const GENERATED_NOTICE = [
  "<!-- NexoHarness generated artifact. Do not edit manually. -->",
  "<!-- Canonical source is authoritative; regenerate this copy from canonical sources. -->",
  "<!-- Prompt-level guidance only; this artifact does not enforce policy or permissions. -->",
].join("\n");

function compareOrdinal(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function directivePriority(candidate: InstructionCandidate): number {
  if (candidate.source.id === "core-directive") return 0;
  if (candidate.source.id === "execution-protocol") return 1;
  return 2;
}

function orderCandidates(candidates: readonly InstructionCandidate[]): InstructionCandidate[] {
  return [...candidates].sort((left, right) =>
    directivePriority(left) - directivePriority(right) ||
    compareOrdinal(left.source.ref, right.source.ref) ||
    compareOrdinal(left.source.path, right.source.path) ||
    compareOrdinal(left.requirement, right.requirement) ||
    compareOrdinal(left.content, right.content),
  );
}

function diagnostic(
  code: CompilationDiagnostic["code"],
  message: string,
): CompilationDiagnostic {
  return { code, severity: "BLOCKING", message };
}

export function renderCodexAgents(
  compilation: CodexCompilation,
  options: { instructionBudgetBytes?: number } = {},
): CodexRenderResult {
  if (!compilation.usable) {
    return {
      diagnostics: [diagnostic("COMPILATION_UNUSABLE", "Cannot render AGENTS.md from an unusable Codex compilation.")],
      usable: false,
    };
  }

  if (options.instructionBudgetBytes === undefined ||
    !Number.isSafeInteger(options.instructionBudgetBytes) || options.instructionBudgetBytes <= 0) {
    return {
      diagnostics: [diagnostic("INSTRUCTION_BUDGET_UNKNOWN", "A positive, explicit instruction budget in bytes is required to render AGENTS.md.")],
      usable: false,
    };
  }

  if (compilation.instructionCandidates.length === 0) {
    return {
      diagnostics: [diagnostic("NO_RENDERABLE_INSTRUCTIONS", "The Codex compilation contains no renderable instruction candidates.")],
      usable: false,
    };
  }

  const candidates = orderCandidates(compilation.instructionCandidates);
  const sections = candidates.map((candidate) =>
    `<!-- Source: ${candidate.source.ref} -->\n${candidate.content.replace(/\r\n?/g, "\n")}`,
  );
  const content = `${GENERATED_NOTICE}\n\n${sections.join("\n\n")}\n`;
  const byteLength = new TextEncoder().encode(content).byteLength;
  if (byteLength > options.instructionBudgetBytes) {
    return {
      diagnostics: [diagnostic(
        "INSTRUCTION_BUDGET_EXCEEDED",
        `Rendered AGENTS.md is ${byteLength} UTF-8 bytes, exceeding the configured ${options.instructionBudgetBytes}-byte budget.`,
      )],
      usable: false,
      byteLength,
    };
  }

  const sourceRefs = new Set<string>();
  for (const candidate of candidates) sourceRefs.add(candidate.source.ref);

  return {
    artifact: {
      path: "AGENTS.md",
      content,
      encoding: "UTF-8",
      sourceRefs: [...sourceRefs],
    },
    diagnostics: [],
    usable: true,
    byteLength,
  };
}
