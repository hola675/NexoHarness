/**
 * Bounded Agent Skills format preflight for Kilo SKILL.md candidates.
 * Synthetic-format checks only. Does not parse canonical entities, render,
 * install, read referenced resources, or authorize any tool.
 */
export interface SkillFormatIssue { code: string; message: string }
const safeName = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export function validateKiloSkillMarkdown(path: string, markdown: string): SkillFormatIssue[] {
  const issues: SkillFormatIssue[] = [];
  const normalized = path.replaceAll("\\", "/");
  const parts = normalized.split("/");
  if (normalized.startsWith("/") || /^[a-z]:/i.test(normalized) ||
      parts.some(p => !p || p === "." || p === "..") ||
      parts.length !== 4 || parts[0] !== ".kilo" || parts[1] !== "skills" ||
      parts[3] !== "SKILL.md" || !safeName.test(parts[2])) {
    issues.push({ code: "UNSAFE_SKILL_PATH", message: "Expected .kilo/skills/<safe-name>/SKILL.md" });
  }
  if (markdown.includes("\0") || markdown.includes("\r")) {
    issues.push({ code: "INVALID_TEXT", message: "NUL or CR is not allowed in a normalized candidate." });
  }
  const match = /^---\n([\s\S]*?)\n---\n/.exec(markdown);
  if (!match) {
    issues.push({ code: "MISSING_FRONTMATTER", message: "Skill must start with YAML-style frontmatter." });
    return issues;
  }
  const fields = new Map<string, string>();
  for (const line of match[1].split("\n")) {
    if (!line.trim() || line.startsWith("#")) continue;
    const m = /^([a-z][a-z-]*):\s*(.*)$/.exec(line);
    if (!m) { issues.push({ code: "UNSUPPORTED_FRONTMATTER", message: "Only scalar key/value frontmatter is checked." }); continue; }
    if (fields.has(m[1])) issues.push({ code: "DUPLICATE_FIELD", message: `Duplicate ${m[1]}` });
    fields.set(m[1], m[2].trim().replace(/^["']|["']$/g, ""));
  }
  const name = fields.get("name");
  const description = fields.get("description");
  if (!name || !safeName.test(name) || name !== parts[2]) issues.push({ code: "INVALID_NAME", message: "Name must match the safe skill directory." });
  if (!description || description.length > 1024) issues.push({ code: "INVALID_DESCRIPTION", message: "Description must be present and bounded." });
  if (!markdown.slice(match[0].length).trim()) issues.push({ code: "EMPTY_BODY", message: "Skill body cannot be empty." });
  // Reject target permission directives in metadata; this validator is not a permission translator.
  if (fields.has("permission") || fields.has("tools") || fields.has("allowed-tools")) {
    issues.push({ code: "UNSUPPORTED_AUTHORITY", message: "Skill metadata cannot grant tool authority." });
  }
  return issues;
}
