# Changelog

## Unreleased

- Implement the pure Codex adapter compilation core, internal IR, fail-closed diagnostics, and deterministic manifest/provenance helpers for Phase 1.1-B.
- Define the Codex adapter translation contract and its canonical, authority, provenance, determinism and installation boundaries for Phase 1.1-A.
- Research the local Codex CLI capability surface, pin the stable and upstream baselines, and document capability gaps for Phase 1.0.
- Define the harness-neutral orchestration, shared runtime and continuous improvement architecture for Phase 0.3.
- Fix Windows certification subprocess portability by invoking npm through Node and its npm CLI path without a shell.
- Realign target priority to Codex, Claude Code, then Kilo Code while preserving independent adapters from the canonical source.
- Add local validation performance budgets and a five-minute CI timeout.

### Added

- Repository-wide canonical discovery, indexing and reference integrity validation.
- Versioning and certification tag governance.
- GitHub CI and release automation.
- Exact-SHA phase-close promotion tooling.
- Initial NexoHarness repository foundation.
- Canonical architecture documentation.
- Harness-neutral adapter strategy.
- Task Observer continuous improvement model.
