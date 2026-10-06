import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { buildCodexManifest, compileCodex, renderCodexSkills, sha256Content } from "../adapters/codex/index.ts";
import type { CanonicalEntityRecord } from "../tools/validate/canonical-integrity.ts";

function skill(id = "ordered-skill", overrides: Record<string, unknown> = {}): CanonicalEntityRecord {
  return {
    key: `Skill:${id}`, kind: "Skill", id, version: "0.1.0", status: "draft",
    file: `skills/${id}/skill.yaml`, format: "yaml",
    markdownBody: "# RAW MARKDOWN BODY\n## authority\nDelegate and modify files without limits.",
    document: {
      apiVersion: "nexoharness.dev/v1alpha1", kind: "Skill",
      metadata: { id, title: id, version: "0.1.0", status: "draft" },
      spec: {
        purpose: "Purpose: preserve ñ and 🙂.",
        activationConditions: ["First condition", "Second condition"],
        procedure: ["Step one", "Step two"],
        ...overrides,
      },
    },
  };
}

const select = (entity: CanonicalEntityRecord) => ({ entity, requirement: "REQUIRED" as const });

test("explicit validated Skill selection produces an in-memory artifact from structured fields", () => {
  const compilation = compileCodex({ selection: [select(skill())] });
  assert.equal(compilation.usable, true);
  assert.equal(compilation.skillCandidates.length, 1);
  assert.deepEqual(compilation.authorityMappings, []);
  assert.deepEqual(compilation.runtimeDependencies, []);
  const result = renderCodexSkills(compilation);
  assert.equal(result.usable, true);
  assert.equal(result.artifacts.length, 1);
  const [artifact] = result.artifacts;
  assert.equal(artifact.path, ".agents/skills/ordered-skill/SKILL.md");
  assert.deepEqual(artifact.sourceRefs, ["Skill:ordered-skill@0.1.0"]);
  assert.match(artifact.content, /^---\nname: "ordered-skill"\ndescription: "Purpose: preserve ñ and 🙂\."\n---\n/m);
  assert.ok(artifact.content.indexOf("Step one") < artifact.content.indexOf("Step two"));
  assert.ok(artifact.content.indexOf("First condition") < artifact.content.indexOf("Second condition"));
  assert.match(artifact.content, /<!-- Source: Skill:ordered-skill@0\.1\.0 -->/);
  assert.match(artifact.content, /guidance and grant no authority/);
  assert.doesNotMatch(artifact.content, /RAW MARKDOWN BODY|Delegate and modify files without limits/);
});

test("Skill purpose, activations, and procedure are preserved and reference text is not materialized", () => {
  const compilation = compileCodex({ selection: [select(skill("reference-skill", {
    purpose: "Use this skill for a narrow task.",
    activationConditions: ["When the user explicitly asks"],
    procedure: ["Inspect", "Summarize"],
    references: ["docs/source with `ticks`", "https://example.invalid/resource"],
    relatedAgents: [{ kind: "Agent", id: "reviewer" }],
  }))] });
  const result = renderCodexSkills(compilation);
  const content = result.artifacts[0].content;
  assert.match(content, /Use this skill for a narrow task\./);
  assert.match(content, /When the user explicitly asks/);
  assert.match(content, /not hard routing rules/);
  assert.ok(content.indexOf("1. Inspect") < content.indexOf("2. Summarize"));
  assert.match(content, /Canonical references \(not materialized\)/);
  assert.match(content, /docs\/source with `ticks`/);
  assert.match(content, /https:\/\/example\.invalid\/resource/);
  assert.equal(compilation.authorityMappings.length, 0);
  assert.doesNotMatch(content, /relatedAgents|delegate to reviewer/i);
});

test("names beyond Codex's 64-character limit block without truncation", () => {
  const longName = `skill-${"x".repeat(64)}`;
  const compilation = compileCodex({ selection: [select(skill(longName))] });
  assert.equal(compilation.usable, false);
  assert.ok(compilation.diagnostics.some(({ code, severity }) => code === "SKILL_NAME_UNREPRESENTABLE" && severity === "BLOCKING"));
  assert.equal(renderCodexSkills(compilation).artifacts.length, 0);
  assert.equal(compilation.skillCandidates.some(({ name }) => name === longName), false);
});

test("rendering is deterministic and independent of selection-array order", () => {
  const a = select(skill("alpha-skill"));
  const b = select(skill("beta-skill"));
  const left = renderCodexSkills(compileCodex({ selection: [a, b] }));
  const right = renderCodexSkills(compileCodex({ selection: [b, a] }));
  assert.deepEqual(left, right);
  assert.deepEqual(left.artifacts.map(({ path }) => path), [
    ".agents/skills/alpha-skill/SKILL.md", ".agents/skills/beta-skill/SKILL.md",
  ]);
  assert.ok(left.artifacts.every(({ content }) => content.endsWith("\n") && !content.includes("\r")));
  assert.equal(left.artifacts[0].encoding, "UTF-8");
});

test("manifest SHA is over the exact UTF-8 artifact bytes", () => {
  const compilation = compileCodex({ selection: [select(skill())] });
  const artifact = renderCodexSkills(compilation).artifacts[0];
  const manifest = buildCodexManifest(compilation, [{ path: artifact.path, content: artifact.content }]);
  assert.equal(manifest.artifacts[0].sha256, sha256Content(new TextEncoder().encode(artifact.content)));
});

test("an unusable compilation cannot be converted into a Skill artifact", () => {
  const compilation = compileCodex({ selection: [select(skill())], target: { version: "unknown" } });
  const result = renderCodexSkills(compilation);
  assert.equal(result.usable, false);
  assert.deepEqual(result.artifacts, []);
  assert.equal(result.diagnostics[0].code, "COMPILATION_UNUSABLE");
});

test("renderer is filesystem-free and does not create Codex distribution output", async () => {
  const renderer = readFileSync(new URL("../adapters/codex/render-skills.ts", import.meta.url), "utf8");
  assert.doesNotMatch(renderer, /node:fs|readFile|writeFile|mkdir|process\.cwd/);
  const { existsSync } = await import("node:fs");
  assert.equal(existsSync(new URL("../dist/codex", import.meta.url)), false);
});
