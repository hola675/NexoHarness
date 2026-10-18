import { createHash } from "node:crypto";
import type { CanonicalEntityRecord } from "../../tools/validate/canonical-integrity.ts";
import { validateKiloSkillMarkdown } from "./skill-format.ts";
import { KILO_TARGET } from "./model.ts";

/**
 * Deterministic, in-memory Skill candidate preview.
 * This is NOT a deployment compiler, installer or permission grant.
 * The caller must supply an already schema/integrity-validated canonical record.
 */
export interface KiloSkillCandidate {
  path: string;
  content: string;
  sha256: string;
  sourceRef: string;
  target: typeof KILO_TARGET;
  advisoryOnly: true;
  deployable: false;
}
export type KiloSkillPreview =
  | { ok: true; candidate: KiloSkillCandidate; diagnostics: [] }
  | { ok: false; candidate: null; diagnostics: string[] };

const safeName = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function quoted(value: string): string { return JSON.stringify(value); }
export function previewKiloSkill(record: CanonicalEntityRecord): KiloSkillPreview {
  const diagnostics: string[] = [];
  const meta = record.document.metadata;
  const spec = record.document.spec;
  const metadata = meta && typeof meta === "object" && !Array.isArray(meta) ? meta as Record<string, unknown> : null;
  const specification = spec && typeof spec === "object" && !Array.isArray(spec) ? spec as Record<string, unknown> : null;
  const id = record.id;
  if (record.kind !== "Skill" || record.document.kind !== "Skill" ||
      record.key !== `Skill:${id}` || !safeName.test(id) ||
      !metadata || metadata.id !== id || metadata.version !== record.version ||
      metadata.status !== record.status || !/^\d+\.\d+\.\d+$/.test(record.version) ||
      !record.file || record.file.startsWith("/") || /^[a-z]:/i.test(record.file) ||
      record.file.replaceAll("\\", "/").split("/").some(s => !s || s === "." || s === "..")) {
    diagnostics.push("INVALID_CANONICAL_IDENTITY");
  }
  const purpose = specification?.purpose;
  if (typeof purpose !== "string" || !purpose.trim() || purpose.length > 1024 || /[\r\n\0]/.test(purpose)) {
    diagnostics.push("UNSUPPORTED_SKILL_PURPOSE");
  }
  const body = record.markdownBody;
  if (typeof body !== "string" || !body.trim() || body.includes("\0")) {
    diagnostics.push("MISSING_PROCEDURAL_BODY");
  }
  // Fail closed: schema fields beyond the supported preview subset must be
  // inspected separately, not silently dropped.
  if (!specification || Object.keys(specification).some(key => key !== "purpose")) {
    diagnostics.push("UNMAPPED_SKILL_SEMANTICS");
  }
  if (!metadata || Object.keys(metadata).some(key => !["id", "title", "version", "status"].includes(key))) {
    diagnostics.push("UNMAPPED_SKILL_METADATA");
  }
  if (diagnostics.length > 0) return { ok: false, candidate: null, diagnostics: diagnostics.sort() };
  const path = `.kilo/skills/${id}/SKILL.md`;
  const content = `---\nname: ${id}\ndescription: ${quoted((purpose as string).trim())}\n---\n\n${(body as string).replace(/\r\n?/g, "\n").trim()}\n`;
  const issues = validateKiloSkillMarkdown(path, content);
  if (issues.length) return { ok: false, candidate: null, diagnostics: issues.map(i => i.code).sort() };
  return {
    ok: true, diagnostics: [],
    candidate: { path, content, sha256: createHash("sha256").update(content, "utf8").digest("hex"),
      sourceRef: `Skill:${id}@${record.version}`, target: KILO_TARGET,
      advisoryOnly: true, deployable: false },
  };
}
