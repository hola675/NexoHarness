import assert from "node:assert/strict";
import { test } from "node:test";
import { validateKiloSkillMarkdown } from "../adapters/kilo/skill-format.ts";

const path = ".kilo/skills/review-code/SKILL.md";
const valid = "---\nname: review-code\ndescription: Review a change for defects\n---\n\n# Procedure\nInspect tests before reporting.\n";

test("Kilo skill format preflight accepts bounded synthetic markdown", () => {
  assert.deepEqual(validateKiloSkillMarkdown(path, valid), []);
});
test("Kilo skill format preflight rejects path traversal and identity mismatch", () => {
  const issues = validateKiloSkillMarkdown(".kilo/skills/../SKILL.md", valid);
  assert.ok(issues.some(i => i.code === "UNSAFE_SKILL_PATH"));
  assert.ok(issues.some(i => i.code === "INVALID_NAME"));
});
test("Kilo skill format preflight rejects implicit authority grants", () => {
  const issues = validateKiloSkillMarkdown(path, valid.replace("description:", "allowed-tools: bash\ndescription:"));
  assert.ok(issues.some(i => i.code === "UNSUPPORTED_AUTHORITY"));
});
test("Kilo skill format preflight rejects missing frontmatter and empty body", () => {
  assert.ok(validateKiloSkillMarkdown(path, "# Plain text").some(i => i.code === "MISSING_FRONTMATTER"));
  assert.ok(validateKiloSkillMarkdown(path, "---\nname: review-code\ndescription: A review\n---\n").some(i => i.code === "EMPTY_BODY"));
});
