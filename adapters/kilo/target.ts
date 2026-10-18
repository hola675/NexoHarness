import { KILO_TARGET } from "./model.ts";

/** Historical research baseline, not a required installed release. */
export interface KiloTargetSelection {
  client: "vscode-extension" | "desktop";
  platform: "windows";
  version: string;
  sourceCommit?: string;
}
export interface KiloTargetResolution {
  target: KiloTargetSelection;
  evidence: "K0_DESK_RESEARCH_ONLY" | "UNVERIFIED_VERSION";
  versionVerified: false;
  diagnostics: string[];
}
const versionPattern = /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?$/;
const shaPattern = /^[a-f0-9]{40}$/i;

/**
 * Explicit version selection. No automatic latest-version inference, no
 * semver compatibility assertion, and no authority to install or deploy.
 */
export function resolveKiloTarget(input?: Partial<KiloTargetSelection>): KiloTargetResolution {
  const client = input?.client ?? KILO_TARGET.client;
  const version = input?.version ?? (client === "desktop" ? "" : KILO_TARGET.version);
  const diagnostics: string[] = [];
  if (client !== "desktop" && client !== "vscode-extension") diagnostics.push("UNSUPPORTED_CLIENT");
  if (client === "desktop" && input?.version === undefined) diagnostics.push("TARGET_VERSION_REQUIRED");
  if (input?.platform !== undefined && input.platform !== KILO_TARGET.platform) diagnostics.push("UNSUPPORTED_PLATFORM");
  if (!versionPattern.test(version)) diagnostics.push("INVALID_TARGET_VERSION");
  if (input?.sourceCommit !== undefined && !shaPattern.test(input.sourceCommit)) diagnostics.push("INVALID_SOURCE_COMMIT");
  const baseline = client === "vscode-extension" && version === KILO_TARGET.version &&
    (input?.sourceCommit === undefined || input.sourceCommit === KILO_TARGET.sourceCommit);
  const target: KiloTargetSelection = {
    client, platform: KILO_TARGET.platform, version,
    ...(input?.sourceCommit ? { sourceCommit: input.sourceCommit } :
      baseline ? { sourceCommit: KILO_TARGET.sourceCommit } : {}),
  };
  if (!baseline && diagnostics.length === 0) diagnostics.push("VERSION_EVIDENCE_REQUIRED");
  return { target, evidence: baseline ? "K0_DESK_RESEARCH_ONLY" : "UNVERIFIED_VERSION",
    versionVerified: false, diagnostics: diagnostics.sort() };
}
