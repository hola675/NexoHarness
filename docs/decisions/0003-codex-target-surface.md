# ADR 0003: Codex V1 Target Surface

- **Status:** Proposed
- **Date:** 2026-10-05
- **Research snapshot:** Codex CLI 0.160.0; upstream `openai/codex` main `3f1ccb7ceb814e54314826f68d61c892e2f5a48e` observed 2026-10-05

## Context

Phase 1.0 compares NexoHarness requirements to distinct current Codex surfaces. Codex Local CLI, local IDE extension, local desktop app, Codex Cloud/managed, and Agents API/SDK have related naming or infrastructure but are not interchangeable capability targets. The selected target must match NexoHarness's local, portable repository coding-agent goal and be testable against a pinned release.

## Proposed decision

### Primary target

**Codex Local — CLI / local Codex harness**, with **0.160.0 (`rust-v0.160.0`)** as the research baseline observed 2026-10-05.

The CLI is the most direct local repository interface and exposes a documented local command loop, instruction/configuration, skills, agents/subagents, sandbox and approval controls, test execution, review command and noninteractive operation. The selected target includes the CLI's local engine/configuration needed for those behaviors; it does not claim every client has identical behavior.

### Secondary related surfaces

- **Codex IDE extension:** shares local Codex configuration/runtime but adds editor-specific settings and selected/open-file context.
- **ChatGPT desktop app local Codex:** shares local Codex context and can continue local chats, with separate app/worktree/project/review UI and client lifecycle.

These surfaces may be considered for later parity work only after their versions and differing behaviors are tested.

### Deliberately out of scope

- **Codex Cloud / managed / ChatGPT Work cloud execution:** separate remote environment, session and managed-policy boundary.
- **Agents API, Agents SDK and Responses API:** related OpenAI agent infrastructure with distinct runtime and state ownership; capabilities there do not prove local CLI support.
- **MCP configuration or providers:** deferred provider mechanism for this phase.

## Compatibility assumptions and limitations

- A future V1 would explicitly support a tested CLI version range, not “latest forever”. This Phase 1.0 snapshot only pins 0.160.0 as observed evidence.
- Current OpenAI documentation is mutable and often not release-versioned. Each adapter dependency needs release-pinned or direct target verification before implementation/certification.
- OS, Windows native versus WSL, Windows elevated versus unelevated sandbox, account rollout, project trust and administrator-managed config can change effective behavior.
- Prompt/skill/agent instructions are not hard enforcement. Sandbox and approval mechanisms cover different effect paths and do not directly implement Nexo's dimensional authority model.
- Codex local session history or local memories do not equal Nexo Shared Runtime State.
- `openai/codex` repository is research-only, licensed under Apache-2.0 per its root `LICENSE`; it is not a runtime dependency. No upstream code is copied by this decision.

## Reverification policy

Re-fetch and pin current stable release, main SHA, docs, license/provenance and relevant tests:

1. before Codex adapter implementation;
2. before Codex certification;
3. whenever the supported Codex version is upgraded; and
4. whenever a relied-on feature changes maturity, configuration, surface availability or enforcement behavior.

For each recheck, separate stable release evidence from main-only evidence, document OS/account/managed configuration, and record unknowns rather than assuming parity. Independent review is required before changing this ADR status from Proposed.

## Consequences

- Codex CLI defines Phase 1.1's first target; the canonical Nexo model remains harness-neutral.
- A test result for CLI cannot certify IDE, desktop app, Cloud or API surfaces.
- Features marked experimental or version-unclear are conditional and cannot silently become V1 requirements.
- Nexo-owned workflow, authority, shared runtime and promotion responsibilities remain explicit gaps.
