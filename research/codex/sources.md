# Codex Research Sources

Research snapshot: **2026-10-05**. Access date applies to every source below. Official online documentation is mutable and generally does not pin an implementation version; where it does not explicitly name a CLI release, its claims are recorded as `DOCUMENTED / VERSION UNCLEAR`, not as proof that the feature shipped in 0.160.0. No Codex installation was used as an observed-local source for this snapshot.

`openai/codex` is a **research source only**, not a NexoHarness dependency. Its root `LICENSE` identifies Apache License 2.0, copyright 2025 OpenAI. No upstream files or substantial source text were copied into NexoHarness. Upstream licenses, NOTICE files, and third-party component terms must be rechecked before any future source adaptation or redistribution.

| ID | Source and URL | Type / version | Claim supported |
|---|---|---|---|
| S01 | [Codex CLI 0.160.0 release](https://github.com/openai/codex/releases/tag/rust-v0.160.0) | RELEASE; published 2026-10-01; tag `rust-v0.160.0`; release commit `a956835d020762cb2b570053af06f643a11c0ecc` | Latest non-prerelease CLI release observed; release date; release notes, including Windows sandbox/process fixes. |
| S02 | [Codex CLI release entry in official changelog](https://learn.chatgpt.com/docs/changelog) | DOC / RELEASE; entry dated 2026-10-01 | Stable 0.160.0 availability/install version and high-level release features. |
| S03 | [openai/codex current main commit](https://github.com/openai/codex/commit/3f1ccb7ceb814e54314826f68d61c892e2f5a48e) | SOURCE; main SHA `3f1ccb7ceb814e54314826f68d61c892e2f5a48e`, observed 2026-10-05 | Separately pinned moving-main snapshot. Main evidence is not stable-release evidence. |
| S04 | [openai/codex LICENSE](https://github.com/openai/codex/blob/main/LICENSE) | SOURCE; main at S03; Apache-2.0 | Upstream repository license and provenance. |
| S05 | [Codex CLI](https://learn.chatgpt.com/docs/cli) | DOC; accessed 2026-10-05; version not specified | Local CLI purpose, local repository loop, supported installation families and `codex exec` workflow. |
| S06 | [Developer commands and CLI reference](https://learn.chatgpt.com/docs/developer-commands) | DOC; accessed 2026-10-05; command maturity labels current-doc, version not specified | Command/flag availability and maturity, including stable `codex`, `exec`, `review`, `resume`, plus experimental app-server. |
| S07 | [Custom instructions with AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) | DOC; accessed 2026-10-05; version not specified | Global/project/nested instruction discovery, override order, fallback names, byte cap, trusted project behavior and verification. |
| S08 | [Configuration Reference](https://learn.chatgpt.com/docs/config-file/config-reference) | DOC; accessed 2026-10-05; current reference, not release pinned | Config keys, profiles, agents, windows sandbox modes, multi-agent feature maturity, hooks, memory and managed requirements. |
| S09 | [Build skills](https://learn.chatgpt.com/docs/build-skills) | DOC; accessed 2026-10-05; version not specified | Skill format, local/project/user/admin/system discovery, metadata-first progressive disclosure, references/scripts/assets and invocation. |
| S10 | [Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents) | DOC; accessed 2026-10-05; current releases referenced, exact version not specified | Built-in and custom agents, project/personal TOML locations, triggering, parallel orchestration, parent permission inheritance, steering/wait/closing. |
| S11 | [Codex hooks](https://learn.chatgpt.com/docs/hooks) | DOC; accessed 2026-10-05; version/maturity varies by hook and is not pinned | Lifecycle events, handler types, trust, input fields, continuation semantics, execution limitations and unsupported parsed behavior. |
| S12 | [Agent approvals and security](https://learn.chatgpt.com/docs/agent-approvals-security) | DOC; accessed 2026-10-05; version not specified | Sandbox modes, approval policies/review, permission profiles, network limitations and noninteractive security combinations. |
| S13 | [Permissions](https://learn.chatgpt.com/docs/permissions) | DOC; accessed 2026-10-05; version not specified | Platform-specific enforcement, native Windows sandbox distinctions and permission-profile caveats. |
| S14 | [Windows sandbox](https://learn.chatgpt.com/docs/windows/windows-sandbox) | DOC; accessed 2026-10-05; version not specified | Elevated/unelevated native Windows implementations, OS requirements, setup/trust, read-dir workflow and WSL distinction. |
| S15 | [Rules](https://learn.chatgpt.com/docs/agent-configuration/rules) | DOC; accessed 2026-10-05; explicitly experimental | `.rules` command-prefix allow/prompt/forbidden behavior, precedence, limitations for shell wrappers and command check. |
| S16 | [Non-interactive mode](https://learn.chatgpt.com/docs/non-interactive-mode) | DOC; accessed 2026-10-05; stable command, version not pinned on page | `codex exec`, read-only default, JSONL events, usage, output handling, ephemeral mode and session resume. |
| S17 | [Memories](https://learn.chatgpt.com/docs/customization/memories) | DOC; accessed 2026-10-05; version/availability varies | Local memories, opt-in controls, filesystem location, separation between local Codex memory and ChatGPT Work memory. |
| S18 | [Developer settings](https://learn.chatgpt.com/docs/developer-settings) | DOC; accessed 2026-10-05; version not specified | IDE extension settings versus shared Codex config, desktop/IDE chat sharing and Windows WSL setting. |
| S19 | [Quickstart](https://learn.chatgpt.com/docs/quickstart) | DOC; accessed 2026-10-05; version not specified | Surface distinctions among desktop, web/Work, local CLI/IDE, and remote Codex Cloud. |
| S20 | [Agents API overview](https://developers.openai.com/api/docs/guides/agents-api/overview) and [Agents runtime comparison](https://developers.openai.com/api/docs/guides/agents) | DOC; accessed 2026-10-05; API docs, not local CLI | Managed Codex harness, cloud sandbox/session state and distinct Agents API/SDK/Responses surfaces. Used only to distinguish related non-target surfaces. |
| S21 | [Codex IDE extension](https://learn.chatgpt.com/docs/codex/ide) | DOC; accessed 2026-10-05; version not specified | IDE context/editor behavior and integration differences from terminal CLI. |
| S22 | [Codex app / CLI changelog](https://learn.chatgpt.com/docs/changelog) | DOC / RELEASE; accessed 2026-10-05 | Client-specific rollout and app release notes; supports treating app/IDE as distinct products even where they share local config/runtime. |
| S23 | [Code review](https://learn.chatgpt.com/docs/code-review) | DOC; accessed 2026-10-05; version not specified | Built-in `/review` behavior, dedicated reviewer flow and review scope. |
| S24 | [Sample Codex configuration](https://learn.chatgpt.com/docs/config-file/config-sample) | DOC; accessed 2026-10-05; version not specified | `review_model` configuration option. |
| S25 | [Upstream config source: model instructions](https://github.com/openai/codex/blob/main/codex-rs/config/src/config_toml.rs) | SOURCE; main as observed 2026-10-05; not release-pinned | Current-main `model_instructions_file` field; does not establish inclusion in CLI 0.160.0. |

## Evidence notation

- `DOC`: official OpenAI documentation; feature behavior may be current-doc but not version-pinned.
- `SOURCE`: official `openai/codex` repository at an exact tag or commit.
- `TEST`: upstream test at an exact tag/commit. No test-only claims are required for this snapshot; add pinned tests if a future adapter decision depends on undocumented behavior.
- `RELEASE`: official release artifact or release note.
- `OBSERVED_LOCAL`: direct behavior from a recorded local installation and environment. None was collected for this snapshot.

## Reverification

Re-fetch the stable release, documentation, and upstream commit before Phase 1.1 adapter implementation, before Codex certification, after changing the supported Codex release, and whenever a relied-on feature changes maturity. Compare release-tagged evidence with main separately. Record client platform, install channel, account/managed policy and relevant config when testing local behavior. Do not infer CLI behavior from the Agents API or from main alone.

The `model_instructions_file` observation is main-only and version-uncertain. Do not rely on it for the 0.160.0 target without release-pinned source/config evidence and direct execution. The documented review flow is a separate review operation; it does not itself prove Nexo E4 independence.
