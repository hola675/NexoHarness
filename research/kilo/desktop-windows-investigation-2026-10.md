# Kilo Desktop K0-D — research and implementation gates

Date: 2026-10-18. Scope: Kilo Desktop Windows x64/ARM64. Status: desk research; **no Windows runtime probes**. This is a research input, not a runtime dependency or certification.

## Evidence matrix

| Concern | Official evidence | Supported inference | Open question / probe |
| --- | --- | --- | --- |
| Runtime | Desktop Overview says it starts local Kilo CLI | Shared agent engine with CLI/VS Code | Bundled runtime version, daemon lifecycle and extension parity |
| Distribution | Desktop Installation lists Windows x64/ARM64 | Windows installer exists | Signature, update channel, version discovery, rollback |
| Autonomy | Desktop Quickstart documents manual/automatic approval | User can change approval posture | Effective permission precedence under both modes |
| Agents/skills/MCP | Desktop AI Settings has installed-items UI and marketplace | Surface for managing installed items | Exact filesystem paths, trusted sources, project vs global scope |
| Skills | Skills docs describe .kilo/skills and trusted global shell execution | Risk differs by installation scope | Whether Desktop loads identical paths and executes embedded commands |
| Config | CLI Runtime Architecture documents layered config | Shared CLI config is plausible | Desktop-specific overrides, managed config and session precedence |
| Workspace | Desktop Overview describes one or more local folders | Workspace may differ from editor directory context | Multiple roots, path traversal, symlinks, git worktrees |
| Models | Desktop Overview lists local and hosted providers | Model-independent agent use | Authentication, local model permissions, offline capability |
| Terminal | Desktop Terminal docs distinguish user terminal from agent shell | Two command paths exist | Permission coverage and observable effects for each |

## Security risks

1. **Approval bypass:** Desktop offers automatic approval. A canonical 'none' authority must not be replaced by a user-level ask/allow. Required controls remain unverified.
2. **Skill trust escalation:** Trusted global skills may execute embedded commands with a separate approval prompt. Never install project content globally or add trusted skill locations by default.
3. **Runtime/config drift:** CLI runtime is shared but UI configuration and loaded state can diverge; do not infer compatibility from a shared engine.
4. **Uncontrolled installation:** Installer/marketplace/update behavior must be outside the renderer; no silent dependency or plugin provisioning.
5. **Multi-folder scope:** Desktop workspace may span folders; Nexo canonical authority is not automatically scoped to the filesystem.
6. **Data governance:** Avoid collecting credentials, prompts, code or sessions into Task Observer without separate provenance/privacy design.

## Proposed bounded Windows probe

Use a disposable Windows user and repository, no real credentials. Record OS architecture, Desktop version, bundled CLI version/hash, exact install path, config files and relevant logs with secrets redacted.

1. Open isolated workspace, inventory effective configuration and discovered agents/skills.
2. Load a synthetic project-level SKILL.md and verify discoverability without executing commands.
3. Compare global vs project skill scope and verify trust/embedded-command prompts with harmless fixture.
4. Exercise manual and automatic approval modes against safe read, denied edit and denied command fixtures. Capture both actual tool outcome and UI/permission trace.
5. Verify agent/skill frontmatter parsing, duplicate names, reload and precedence.
6. Exercise multiple roots, outside-workspace paths and symlink boundaries using disposable files.
7. Restart, update or change settings only in isolated environment; record version and configuration drift.
8. Repeat comparable probes on VS Code extension, but record independent outcomes, not presumed parity.

## Acceptance

- Machine-readable evidence links to exact Desktop version, Windows architecture, tool/config behavior and captured result.
- Each control classified supported, unsupported or unknown with independently reviewed evidence.
- No claim of HARD_ENFORCEMENT from prompt text, config presence or manual UI screenshots alone.
- No generated files written into the user's Desktop profile; no permissions or providers enabled.
- Proposed future renderer/installer must check version + client-specific evidence and refuse unknown mandatory semantics.

## Sources and provenance

Official Kilo documentation, accessed 2026-10-18:
- https://kilo.ai/docs/desktop/overview
- https://kilo.ai/docs/desktop/quickstart
- https://kilo.ai/docs/desktop/installation
- https://kilo.ai/docs/desktop/settings/ai
- https://kilo.ai/docs/desktop/features/terminal
- https://kilo.ai/docs/customize/skills
- https://kilo.ai/docs/contributing/architecture/cli-runtime
- https://kilo.ai/docs/getting-started/settings/auto-approving-actions

No third-party source code was copied. Claims are limited to official documentation; no desktop executable or repository source was dynamically inspected in this phase.
