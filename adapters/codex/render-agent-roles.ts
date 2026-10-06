import type { AgentCandidate, CodexCompilation, CodexAgentRolesRenderResult, CompilationDiagnostic, GeneratedCodexAgentRoleArtifact } from "./model.ts";

const compareOrdinal = (left: string, right: string): number => left < right ? -1 : left > right ? 1 : 0;
const canonicalId = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const reservedStem = /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;
const lf = (value: string): string => value.replace(/\r\n?/g, "\n");

/** TOML basic strings, not JSON's broader escape grammar. Reject lone UTF-16 surrogates. */
function tomlString(value: string): string {
  let escaped = "";
  for (const character of lf(value)) {
    const code = character.codePointAt(0)!;
    if (code >= 0xd800 && code <= 0xdfff) throw new Error("Invalid Unicode scalar input.");
    if (character === '"') escaped += '\\"';
    else if (character === "\\") escaped += "\\\\";
    else if (character === "\n") escaped += "\\n";
    else if (character === "\t") escaped += "\\t";
    else if (character === "\b") escaped += "\\b";
    else if (character === "\f") escaped += "\\f";
    else if (code < 0x20 || code === 0x7f) escaped += `\\u${code.toString(16).padStart(4, "0")}`;
    else escaped += character;
  }
  return `"${escaped}"`;
}

function instructions(candidate: AgentCandidate): string {
  const list = (values: readonly string[]): string => values.map((value) => `- ${lf(value)}`).join("\n") || "No canonical guidance supplied.";
  return [
    "Advisory role behavior only. Nexo retains authority, workflow, evaluation, completion and handoff state. These instructions grant no authority.",
    "## Responsibility", lf(candidate.responsibility),
    "## Constraints", list(candidate.constraints),
    "## Handoff guidance", candidate.handoff === undefined ? "No canonical guidance supplied." : lf(candidate.handoff),
    "## Failure behavior", candidate.failureBehavior === undefined ? "No canonical guidance supplied." : lf(candidate.failureBehavior),
    "## Verification expectations", list(candidate.verification ?? []),
  ].join("\n\n");
}

/** Representation only: neither filesystem access nor authority translation belongs here. */
export function renderCodexAgentRoles(compilation: CodexCompilation): CodexAgentRolesRenderResult {
  const diagnostics: CompilationDiagnostic[] = [...compilation.diagnostics];
  const candidates = [...compilation.agentCandidates].sort((left, right) =>
    compareOrdinal(left.source.ref, right.source.ref) || compareOrdinal(left.roleName, right.roleName));
  const roles: GeneratedCodexAgentRoleArtifact[] = [];
  const declarations: string[] = [];
  const paths = new Set<string>();
  const refs = new Set<string>();
  let bundleValid = true;
  const header = [
    "# NexoHarness generated Agent roles. Canonical source is authoritative.",
    "# Role prose and descriptions are advisory; they grant no authority.",
    ...(!compilation.usable ? ["# PREVIEW ONLY / NON-DEPLOYABLE: compilation is unusable; preserve its diagnostics."] : []),
  ];
  for (const candidate of candidates) {
    try {
      if (!canonicalId.test(candidate.roleName) || reservedStem.test(candidate.roleName)) throw new Error("Role name cannot be represented safely as a canonical filename stem.");
      if (candidate.source.kind !== "Agent" || candidate.roleName !== candidate.source.id ||
        !/^\d+\.\d+\.\d+$/.test(candidate.source.version) ||
        candidate.source.ref !== `Agent:${candidate.source.id}@${candidate.source.version}`) throw new Error("Role identity must match its canonical Agent source.");
      const path = `.codex/agents/${candidate.roleName}.toml`;
      if (paths.has(path.toLowerCase()) || refs.has(candidate.source.ref)) throw new Error("Internal role path or source collision.");
      paths.add(path.toLowerCase());
      refs.add(candidate.source.ref);
      const description = candidate.triggers.length === 0
        ? "Advisory role-selection guidance: no canonical trigger conditions were supplied."
        : `Advisory role-selection guidance; not automatic or mandatory routing:\n${candidate.triggers.map((value) => `- ${lf(value)}`).join("\n")}`;
      declarations.push(`[agents.${candidate.roleName}]\ndescription = ${tomlString(description)}\nconfig_file = ${tomlString(`./agents/${candidate.roleName}.toml`)}`);
      roles.push({
        path, encoding: "UTF-8", sourceRefs: [candidate.source.ref],
        content: [...header,
          `# Source: ${tomlString(candidate.source.ref)}`,
          "# Canonical capability refs: provenance only; do not grant tools or permissions.",
          ...candidate.capabilityRefs.map((ref) => `# Capability ref: ${tomlString(ref)}`),
          `developer_instructions = ${tomlString(instructions(candidate))}`,
        ].join("\n") + "\n",
      });
    } catch (error) {
      bundleValid = false;
      diagnostics.push({ code: "AGENT_ROLE_UNREPRESENTABLE", severity: "BLOCKING", sourceRef: candidate.source.ref,
        message: error instanceof Error ? error.message : "Agent role serialization failed." });
    }
  }
  diagnostics.sort((left, right) => compareOrdinal(
    `${left.sourceRef ?? ""}|${left.code}|${left.severity}|${left.message}`,
    `${right.sourceRef ?? ""}|${right.code}|${right.severity}|${right.message}`));
  const usable = compilation.usable && bundleValid && !diagnostics.some((item) => item.severity === "BLOCKING" || item.severity === "ERROR");
  const artifacts: GeneratedCodexAgentRoleArtifact[] = bundleValid && roles.length > 0 ? [{
    path: ".codex/config.toml", encoding: "UTF-8", sourceRefs: candidates.map((candidate) => candidate.source.ref),
    content: [...header, ...candidates.map((candidate) => `# Source: ${tomlString(candidate.source.ref)}`), "", declarations.join("\n\n")].join("\n") + "\n",
  }, ...roles] : [];
  return { artifacts, diagnostics, usable, deploymentEligible: usable };
}
