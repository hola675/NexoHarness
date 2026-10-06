# NexoHarness-Generated Repository Skill Runtime Probe

Date: 2026-10-06
NexoHarness SHA: `47750b5ef77f7988452cc0ae807a8857bc858b72`
Codex CLI: `codex-cli 0.160.0`
Platform: Windows
Pinned upstream tag: `rust-v0.160.0`
Pinned upstream commit: `a956835d020762cb2b570053af06f643a11c0ecc`

This probe used the actual NexoHarness validation, compilation, and rendering functions. Runtime fixtures were fresh temporary Git repositories outside NexoHarness and were removed after the probe. No persistent Codex configuration or credentials were changed. No personal absolute paths or credentials are recorded here.

## VALIDATED_NEXO_FIXTURE

- Fixture root: `tests/fixtures/canonical-graph/valid`
- Integrity diagnostics: 0
- Selected Skill: `Skill:search-skill@0.1.0`
- Canonical source: `tests/fixtures/canonical-graph/valid/skills/search.md`
- Structured fields used: `purpose`, `activationConditions`, `procedure`
- Raw Markdown body used as renderer input: NO; the retained body was `# Search Skill` and did not appear in the generated artifact.
- Compilation usable: YES
- Renderer usable: YES

## Generated artifact

- Temporary target path: `.agents/skills/search-skill/SKILL.md`
- UTF-8 byte length: 590
- In-memory artifact SHA-256: `633a2b76cc1e2d7511321d6a5a7107eb991682a4321f8604013efc7f82ecd958`
- Temporary file SHA-256: `633a2b76cc1e2d7511321d6a5a7107eb991682a4321f8604013efc7f82ecd958`
- SHA match: YES
- Source refs: `Skill:search-skill@0.1.0`
- Frontmatter name and purpose-derived description: verified
- Purpose, activation guidance, ordered procedure, and generated no-authority notice: verified
- Raw Markdown body appended: NO

The temporary file contained the exact renderer output; no rendered bytes were edited before materialization.

## RELEASE_PINNED_SOURCE

The release pin is `rust-v0.160.0` at commit `a956835d020762cb2b570053af06f643a11c0ecc`. Repository Skill discovery and explicit invocation mechanics are documented in the preceding [repository Skill runtime probe](skills-0.160.0.md), which distinguishes pinned source facts from local observations. This probe does not expand those source claims.

## OBSERVED_LOCAL

Every invocation used a fresh Codex process with:

- `--ignore-user-config`
- `--ignore-rules`
- `--ephemeral`
- `--sandbox read-only`
- `-c 'approval_policy="never"'`
- `-c 'features.apps=false'`
- `-c 'features.plugins=false'`
- `-c 'features.remote_plugin=false'`
- `-c 'skills.include_instructions=true'`
- `-C <temporary Git fixture>`

These overrides applied to each process only. No user files were read by the probe harness. In the negative-control stderr, Codex reported that its policy rejected attempts to inspect an unavailable user-scope Skill path; no such file contents were read. Stderr also contained the known warning that PowerShell shell snapshots are unsupported.

### Routing sanity

Fresh Git fixture with no `AGENTS.md` and no Skill. Prompt: `Reply only with OK.` Result: `OK`; exit code 0.

### Generated Skill positive fixture

Fresh Git fixture containing the exact materialized renderer output:

| Prompt | Final response | Exit code |
| --- | --- | ---: |
| Use `$search-skill` and ask what repository action its procedure requires. | `Search the repository.` | 0 |
| Use `$search-skill` and ask what exact purpose it states. | `Agent: this procedure explains responsibility.` | 0 |

The prompts did not include the expected procedure or purpose text.

### Negative control

A separate fresh Git fixture had no generated Skill and ran the same two prompts. For the procedure prompt, Codex replied that `$search-skill` could not be read because filesystem access was blocked by policy. For the purpose prompt, it said `search-skill` was not listed and it could not determine the purpose. Neither response reproduced the exact expected purpose or procedure. Both exit codes were 0.

## Established by this probe

For this Windows environment and exact Codex CLI 0.160.0 invocation:

- The NexoHarness-generated repository `SKILL.md` was discovered.
- Explicit `$search-skill` invocation worked.
- Generated procedure and purpose content were visible to the model.

This is prompt-context visibility evidence only. `SKILL != AUTHORITY`; this probe does not test or establish enforcement.

## Not established

- Automatic semantic activation
- Scripts or assets
- References as materialized files
- MCP dependencies
- Other Skill scopes
- Nested precedence
- Any Skill authority or permission behavior
- Behavior on other platforms or Codex versions
