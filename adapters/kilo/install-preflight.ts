import { createHash } from "node:crypto";
import type { KiloCandidateBundle } from "./candidate-bundle.ts";

/** Strict, pure install preflight. Never grants installation authority. */
export interface KiloInstallPreflight {
  mode: "DRY_RUN";
  installEligible: false;
  target: KiloCandidateBundle["target"] | null;
  proposedFiles: { path: string; sha256: string; action: "BLOCKED" }[];
  diagnostics: string[];
}
const sha = (s: string) => createHash("sha256").update(s, "utf8").digest("hex");
const safePath = /^\.kilo\/skills\/[a-z0-9]+(?:-[a-z0-9]+)*\/SKILL\.md$/;
export function preflightKiloInstall(bundle: unknown): KiloInstallPreflight {
  const diagnostics: string[] = ["RUNTIME_EVIDENCE_REQUIRED", "INSTALLER_NOT_AUTHORIZED"];
  const proposedFiles: KiloInstallPreflight["proposedFiles"] = [];
  if (!bundle || typeof bundle !== "object" || Array.isArray(bundle)) {
    return { mode: "DRY_RUN", installEligible: false, target: null, proposedFiles, diagnostics: [...diagnostics, "INVALID_BUNDLE"] };
  }
  const b = bundle as Partial<KiloCandidateBundle>;
  const target = b.target && typeof b.target === "object" && !Array.isArray(b.target) ? b.target : null;
  if (b.schemaVersion !== 1 || b.purpose !== "OFFLINE_REVIEW_ONLY" || b.deployable !== false ||
    !target || !["desktop", "vscode-extension"].includes(target.client) ||
    target.platform !== "windows" || typeof target.version !== "string" ||
    !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(target.version) ||
    !Array.isArray(b.files) || !Array.isArray(b.diagnostics) ||
    typeof b.manifestSha256 !== "string") {
    return { mode: "DRY_RUN", installEligible: false, target: null, proposedFiles, diagnostics: [...diagnostics, "INVALID_BUNDLE"] };
  }
  const seen = new Set<string>();
  const sorted = [...b.files].sort((a, z) => String(a?.path).localeCompare(String(z?.path), "en"));
  for (const file of sorted) {
    if (!file || typeof file.path !== "string" || !safePath.test(file.path) ||
      typeof file.content !== "string" || typeof file.sha256 !== "string" ||
      typeof file.sourceRef !== "string" || sha(file.content) !== file.sha256 ||
      seen.has(file.path)) {
      diagnostics.push("INVALID_FILE_ENTRY");
      continue;
    }
    seen.add(file.path);
    proposedFiles.push({ path: file.path, sha256: file.sha256, action: "BLOCKED" });
  }
  const entries = b.diagnostics.map(d => ({ sourceRef: d?.sourceRef, code: d?.code }));
  if (entries.some(d => typeof d.code !== "string" || (d.sourceRef !== undefined && typeof d.sourceRef !== "string"))) {
    diagnostics.push("INVALID_DIAGNOSTICS");
  }
  const manifest = { schemaVersion: 1, purpose: "OFFLINE_REVIEW_ONLY", target,
    files: b.files.map(f => ({ path: f?.path, sha256: f?.sha256, sourceRef: f?.sourceRef })), diagnostics: entries };
  if (sha(JSON.stringify(manifest)) !== b.manifestSha256) diagnostics.push("MANIFEST_MISMATCH");
  if (entries.some(d => d.code === "TARGET_UNVERIFIED" || d.code === "INVALID_SELECTION")) {
    diagnostics.push("UNVERIFIED_TARGET_OR_SELECTION");
  }
  return { mode: "DRY_RUN", installEligible: false, target, proposedFiles,
    diagnostics: [...new Set(diagnostics)].sort() };
}
