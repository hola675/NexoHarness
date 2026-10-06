# Codex Adapter

Codex is the first target in the adapter and certification order. Phase 1.0 research is certified; Phase 1.1-A defines the translation contract for a later implementation.

Design references:

- [Capability matrix](codex-capability-matrix.md)
- [Translation contract](codex-translation-contract.md)
- [ADR 0003: Codex target surface](../decisions/0003-codex-target-surface.md)
- [ADR 0004: Translation contract](../decisions/0004-codex-adapter-translation-contract.md)

Implementation status:

- Phase 1.1-B adapter core implementation: **EXISTS**
- AgentCandidate compiler projection: **EXISTS**
- Custom Agent role renderer: **NOT YET**
- Implemented: **IR, pure compilation core, validated canonical Directive content projection, deterministic in-memory AGENTS.md renderer, diagnostics, manifest/provenance helpers**
- Pure AGENTS.md renderer: **EXISTS — in-memory artifact only**
- Filesystem distribution: **NOT YET**
- Generated Codex artifacts: **NOT YET**
- Installer and user-file reconciliation: **NOT YET — Phase 1.2**
- Runtime loading probe: **OBSERVED LOCALLY — Codex CLI 0.160.0 (bounded evidence; see report)**
- Repository Skill discovery, explicit invocation, and SKILL.md body visibility: **OBSERVED LOCALLY — Codex CLI 0.160.0 (bounded evidence: research/codex/probes/skills-0.160.0.md)**
- Nexo-generated repository Skill artifact, explicit invocation, and generated purpose/procedure visibility: **OBSERVED LOCALLY — Codex CLI 0.160.0 (bounded evidence: [generated Skill probe](../../research/codex/probes/generated-skill-0.160.0.md))**
- Configured custom agent role and role-specific developer instructions on a spawned child: **OBSERVED LOCALLY + RELEASE-PINNED SOURCE — Codex CLI 0.160.0 (bounded evidence: [custom agent role evidence](../../research/codex/probes/custom-agent-roles-0.160.0.md))**
- Pure Nexo Skill renderer: **EXISTS — in-memory artifact only**
- Skill file distribution and installer integration: **NOT YET**

The adapter consumes explicitly selected, validated, harness-neutral canonical records and produces an internal compilation representation, including instruction candidates projected from validated Directive Markdown bodies. The pure AGENTS.md renderer consumes only that compilation and returns an in-memory UTF-8 artifact with source provenance and an explicit byte budget. Root generated `AGENTS.md` loading has been observed locally on Codex CLI 0.160.0; the bounded probe and its controls are recorded in [the runtime evidence](../../research/codex/probes/agents-md-0.160.0.md). This observation does not establish complete AGENTS.md semantics. The file is prompt-level advisory guidance; the adapter does not reopen canonical files, write or install files, own runtime authority, or redefine canonical behavior.

The pure Skill renderer consumes explicitly selected Skill candidates projected from validated structured fields and returns deterministic `.agents/skills/<id>/SKILL.md` artifacts in memory. It does not read canonical files, include `markdownBody`, materialize referenced resources, write files, or grant authority; references are presented as canonical text only. Distribution and installation remain out of scope.
