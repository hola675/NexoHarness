# ADR 0004: Codex Adapter Translation Contract

- Status: Accepted
- Date: 2026-10-05
- Deciders: NexoHarness maintainers
- Related: ADR 0003, Codex target surface; Phase 1.1-A design

## Context

Phase 1.0 accepted the Codex Local CLI / local Codex harness as the first adapter target and certified its capability research. It did not authorize implementation. Phase 1.1-A needs a reviewable boundary for translating canonical NexoHarness concepts into Codex output while retaining canonical semantics, authority ownership, evidence limits and installation safety.

NexoHarness owns canonical behavior and runtime authority. Target artifacts are generated translations. Codex features documented upstream, present only on main, experimental, or version-unclear do not become stable-release guarantees. Phase 1.0 recorded Codex CLI 0.160.0, rust-v0.160.0, research snapshot 2026-10-05 and OBSERVED_LOCAL as none.

## Decision

Following independent design review, ADR 0004 accepts the contract in [Codex Adapter Translation Contract](../adapters/codex-translation-contract.md) as the required design boundary for a future Codex adapter.

The accepted boundary is:

1. The Nexo control plane or caller explicitly selects validated canonical source, version, task context, profile and target. The adapter does not classify tasks or infer authority.
2. The adapter is a pure, deterministic, offline translation and rendering stage. It consumes canonical source, never generated output as source, and does not write canonical files or target user files.
3. Translation disposition, enforcement strength, authority crosswalk strength and evidence confidence are separate data. Unknown or insufficient mappings remain unknown; a required safety or authority condition that becomes advisory, lossy or unverifiable blocks usable output.
4. Skills express bounded procedure, agents express role and responsibility, and neither creates authority. Workflow state, handoffs, retries, gates, Shared Runtime state, Observer promotion and MCP routing remain Nexo-owned or deferred; they are not implied by Codex instructions.
5. Future output is deterministic and carries canonical provenance, pinned target baseline, stable source references and defined content hashes. It contains no timestamps, machine paths, usernames, random IDs or secrets.
6. Adapter generation and installation are separate. The future installer detects collisions and preserves existing user files; neither compilation nor installation silently overwrites or claims user-authored content.
7. No new canonical Kind or persisted runtime state is introduced. The CodexCompilation representation is adapter-internal.
8. The Codex target baseline remains CLI 0.160.0 / rust-v0.160.0. Main-only, experimental, version-unclear and unobserved behavior remains conditional or unknown until separately verified.

## Consequences

Implementation review must demonstrate the contract's fail-closed, determinism, provenance, authority-separation, target-version and no-user-file-write requirements. Installer collision behavior belongs to Phase 1.2. This ADR does not authorize adapter, compiler, renderer, installer, runtime, observer, resolver or MCP implementation.

## Alternatives considered

- Treat target instructions as canonical: rejected because this duplicates and can drift from harness-neutral source.
- Let Codex configuration define Nexo authority: rejected because target availability and policy enforcement are not the same.
- Merge target files during compilation: rejected because compilation must be pure and preserve user ownership.
- Add a Codex-specific canonical Kind: rejected because target representation belongs inside the adapter.
- Assume upstream main or documentation equals CLI 0.160.0 behavior: rejected because Phase 1.0 deliberately preserves evidence distinctions and unknowns.

## Review gate

ADR 0004 was accepted following independent design review. Acceptance defines the design boundary only and does not authorize Phase 1.1-B implementation.

