import { createHash } from "node:crypto";
import { type CanonicalSourceRef, type CodexCompilation, type CompilationDiagnostic } from "./model.ts";

export interface ManifestArtifact {
  path: string;
  sha256: string;
}

export interface CodexManifest {
  manifestVersion: "1";
  encoding: "UTF-8";
  adapter: { id: string; version: string };
  target: { surface: string; version: string; tag: string };
  sourceRefs: CanonicalSourceRef[];
  artifacts: ManifestArtifact[];
  diagnostics: CompilationDiagnostic[];
}

function compareOrdinal(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function safeArtifactPath(path: string): string {
  const normalized = path.replaceAll("\\", "/");
  if (!normalized || normalized.startsWith("/") || /^[A-Za-z]:/.test(normalized)) {
    throw new Error("Manifest artifact paths must be repository-relative.");
  }
  const parts = normalized.split("/");
  if (parts.some((part) => !part || part === "." || part === "..")) {
    throw new Error("Manifest artifact paths cannot contain empty, current, or parent path segments.");
  }
  return parts.join("/");
}

export function sha256Content(content: string | Uint8Array): string {
  return createHash("sha256").update(content).digest("hex");
}

export function buildCodexManifest(
  compilation: CodexCompilation,
  artifacts: readonly { path: string; content: string | Uint8Array }[] = [],
): CodexManifest {
  const artifactPaths = new Set<string>();
  const manifestArtifacts = artifacts
    .map(({ path, content }) => {
      const normalizedPath = safeArtifactPath(path);
      if (artifactPaths.has(normalizedPath)) throw new Error(`Duplicate manifest artifact path: ${normalizedPath}`);
      artifactPaths.add(normalizedPath);
      return { path: normalizedPath, sha256: sha256Content(content) };
    })
    .sort((left, right) => compareOrdinal(left.path, right.path));
  const sourceRefs = [...compilation.sourceRefs].sort((left, right) => compareOrdinal(left.ref, right.ref));
  const diagnostics = [...compilation.diagnostics].sort((left, right) =>
    compareOrdinal(
      `${left.sourceRef ?? ""}|${left.code}|${left.severity}|${left.message}`,
      `${right.sourceRef ?? ""}|${right.code}|${right.severity}|${right.message}`,
    ),
  );

  return {
    manifestVersion: "1",
    encoding: "UTF-8",
    adapter: { ...compilation.adapter },
    target: { ...compilation.target },
    sourceRefs,
    artifacts: manifestArtifacts,
    diagnostics,
  };
}

export function serializeCodexManifest(manifest: CodexManifest): string {
  return `${JSON.stringify(manifest, null, 2).replaceAll("\r\n", "\n")}\n`;
}
