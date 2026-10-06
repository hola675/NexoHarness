# Codex CLI 0.160.0 Repository Skill Runtime Probe

Date: 2026-10-06
NexoHarness commit: 86ba7216402947705063e38d422c7c9659cc5e97
Platform: Windows
Codex CLI: codex-cli 0.160.0
Pinned upstream tag: rust-v0.160.0
Pinned upstream commit: a956835d020762cb2b570053af06f643a11c0ecc

This report separates release-pinned source behavior from observations made by running the local CLI. Temporary Git fixtures were created outside NexoHarness and removed after the probe. The report contains no credentials, tokens, unrelated logs, or personal absolute paths.

## RELEASE_PINNED_SOURCE

The following facts were checked in the exact pinned upstream commit:

- Repository skill roots include .agents/skills directories between the detected project root and the current working directory.
- The repository skill entrypoint is <skill-directory>/SKILL.md.
- Its metadata is YAML frontmatter delimited by ---.
- description must be present and non-empty.
- name may be set explicitly; an omitted name falls back to the skill directory name. The parser enforces a maximum of 64 characters.
- Model-visible guidance says naming a skill with $SkillName or plain text triggers that skill for the turn.
- Once a filesystem-backed skill is selected, the guidance requires reading its complete SKILL.md before taking task actions.

Pinned source files:

- [Repository skill roots](https://github.com/openai/codex/blob/a956835d020762cb2b570053af06f643a11c0ecc/codex-rs/ext/skills/src/host_roots.rs)
- [Skill entrypoint discovery](https://github.com/openai/codex/blob/a956835d020762cb2b570053af06f643a11c0ecc/codex-rs/ext/skills/src/loader/discovery.rs)
- [Frontmatter parser](https://github.com/openai/codex/blob/a956835d020762cb2b570053af06f643a11c0ecc/codex-rs/skills/src/parser.rs)
- [Model-visible skill guidance](https://github.com/openai/codex/blob/a956835d020762cb2b570053af06f643a11c0ecc/codex-rs/ext/skills/src/catalog_prompt.rs)

These are release-source claims only; they do not establish behavior in versions other than the pinned release.

## OBSERVED_LOCAL

Each probe used a new Codex process with the following profile:

- --ignore-user-config
- --ignore-rules
- --ephemeral
- --sandbox read-only
- -c 'approval_policy="never"'
- -c 'features.apps=false'
- -c 'features.plugins=false'
- -c 'features.remote_plugin=false'
- -c 'skills.include_instructions=true'
- -C <temporary Git fixture>

Configuration overrides applied only to each process. Persisted Codex configuration and credentials were not changed. No commands or external tools were needed to carry out the skill's requested instruction.

### Routing sanity

Fixture: a new Git repository with no AGENTS.md and no probe Skill.
Prompt: Reply only with OK.
Result: OK; exit code 0.

No Codex Apps, GitHub MCP, Serena MCP, or remote plugin catalog activity was observed. The stderr contained a benign warning that PowerShell shell snapshots are unsupported; the model response succeeded.

### Positive Skill fixture

Relative path: .agents/skills/nexo-skill-probe-0160/SKILL.md
Skill name: nexo-skill-probe-0160
Description: A controlled NexoHarness runtime probe skill used only when explicitly requested.

The file used YAML frontmatter with explicit name and description fields. The body contained the canary NEXO_SKILL_BODY_0160; the canary did not appear in the Skill name, description, or user prompt.

Prompt: Use $nexo-skill-probe-0160 and follow its instructions. Return the result required by that skill.

Final message: NEXO_SKILL_BODY_0160
Exit code: 0

### Negative control

A second fresh Git repository contained no probe Skill. It ran the identical prompt and execution profile.

Result: Codex said the named Skill was not in the available skills list and that policy blocked attempts to locate SKILL.md.
Exit code: 0
Canary returned: NO

The positive and negative controls support the finding that, in this controlled run, the repository Skill was discovered, its explicit name activated it, and its body instruction was available to the model. The probe did not record a separate catalog listing or Skill-use announcement; body-only canary reproduction is the activation evidence.

## Established by this probe

For the tested Windows environment and exact Codex CLI 0.160.0 invocation:

- Repository .agents/skills/.../SKILL.md discovery was observed.
- Explicit invocation by Skill name was observed.
- Visibility of the SKILL.md body instruction was observed.

This demonstrates instruction discovery and use only. A Skill does not grant authority.

## Not established

- Reliable automatic semantic activation based on descriptions
- .codex/skills, $CODEX_HOME/skills, or user skill scope
- Nested root or duplicate-name precedence
- System, admin, plugin, cloud, or executor skills
- Script, reference, asset, or MCP dependency behavior
- Any Skill authority or permission behavior
- All-byte loading or behavior on platforms and CLI versions other than those tested
