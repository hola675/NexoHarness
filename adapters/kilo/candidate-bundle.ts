import { createHash } from "node:crypto";
import type { KiloPreviewPlan } from "./preview-plan.ts";

/** Reproducible candidate bundle. No installer, grants or filesystem effects. */
export interface KiloCandidateBundle {
  schemaVersion: 1;
  purpose: "OFFLINE_REVIEW_ONLY";
  deployable: false;
  target: KiloPreviewPlan["analysis"]["target"];
  files: { path: string; content: string; sha256: string; sourceRef: string }[];
  diagnostics: { sourceRef?: string; code: string }[];
  manifestSha256: string;
}
const sha = (text: string): string => createHash("sha256").update(text, "utf8").digest("hex");
const cmp = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;
export function buildKiloCandidateBundle(plan: KiloPreviewPlan): KiloCandidateBundle {
  const diagnostics: KiloCandidateBundle["diagnostics"] = [
    ...plan.analysis.diagnostics.map(d => ({ sourceRef: d.sourceRef, code: d.code })),
    ...plan.diagnostics,
  ];
  const files: KiloCandidateBundle["files"] = [];
  const seen = new Set<string>();
  for (const candidate of plan.candidates) {
    const validPath = /^\.kilo\/skills\/[a-z0-9]+(?:-[a-z0-9]+)*\/SKILL\.md$/.test(candidate.path);
    const validHash = sha(candidate.content) === candidate.sha256;
    const sameTarget = JSON.stringify(candidate.target) === JSON.stringify(plan.analysis.target);
    if (!validPath || !validHash || !sameTarget || candidate.deployable !== false) {
      diagnostics.push({ sourceRef: candidate.sourceRef, code: "INVALID_CANDIDATE" });
      continue;
    }
    if (seen.has(candidate.path)) {
      diagnostics.push({ sourceRef: candidate.sourceRef, code: "DUPLICATE_CANDIDATE_PATH" });
      continue;
    }
    seen.add(candidate.path);
    files.push({ path: candidate.path, content: candidate.content, sha256: candidate.sha256, sourceRef: candidate.sourceRef });
  }
  files.sort((a, b) => cmp(a.path, b.path));
  diagnostics.sort((a, b) => cmp(`${a.sourceRef ?? ""}:${a.code}`, `${b.sourceRef ?? ""}:${b.code}`));
  // Manifest excludes contents to avoid accidental leaking into logs, but binds their digests.
  const manifest = { schemaVersion: 1, purpose: "OFFLINE_REVIEW_ONLY", target: plan.analysis.target,
    files: files.map(({ path, sha256, sourceRef }) => ({ path, sha256, sourceRef })), diagnostics };
  return { schemaVersion: 1, purpose: "OFFLINE_REVIEW_ONLY", deployable: false,
    target: plan.analysis.target, files, diagnostics, manifestSha256: sha(JSON.stringify(manifest)) };
}
