# Codex Adapter

Codex is the first target in the adapter and certification order. Phase 1.0 research is certified; Phase 1.1-A defines the translation contract for a later implementation.

Design references:

- [Capability matrix](codex-capability-matrix.md)
- [Translation contract](codex-translation-contract.md)
- [ADR 0003: Codex target surface](../decisions/0003-codex-target-surface.md)
- [ADR 0004: Translation contract](../decisions/0004-codex-adapter-translation-contract.md)

Implementation status:

- Phase 1.1-B adapter core implementation: **EXISTS**
- Implemented: **IR, pure compilation core, validated canonical Directive content projection, deterministic in-memory AGENTS.md renderer, diagnostics, manifest/provenance helpers**
- Pure AGENTS.md renderer: **EXISTS — in-memory artifact only**
- Filesystem distribution: **NOT YET**
- Generated Codex artifacts: **NOT YET**
- Installer and user-file reconciliation: **NOT YET — Phase 1.2**
- Runtime loading probe: **OBSERVED LOCALLY — Codex CLI 0.160.0 (bounded evidence; see report)**
- Repository Skill discovery, explicit invocation, and SKILL.md body visibility: **OBSERVED LOCALLY — Codex CLI 0.160.0 (bounded evidence: research/codex/probes/skills-0.160.0.md)**
- Nexo Skill renderer: **NOT YET**

The adapter consumes explicitly selected, validated, harness-neutral canonical records and produces an internal compilation representation, including instruction candidates projected from validated Directive Markdown bodies. The pure AGENTS.md renderer consumes only that compilation and returns an in-memory UTF-8 artifact with source provenance and an explicit byte budget. Root generated `AGENTS.md` loading has been observed locally on Codex CLI 0.160.0; the bounded probe and its controls are recorded in [the runtime evidence](../../research/codex/probes/agents-md-0.160.0.md). This observation does not establish complete AGENTS.md semantics. The file is prompt-level advisory guidance; the adapter does not reopen canonical files, write or install files, own runtime authority, or redefine canonical behavior.
