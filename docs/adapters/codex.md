# Codex Adapter

Codex is the first target in the adapter and certification order. Phase 1.0 research is certified; Phase 1.1-A defines the translation contract for a later implementation.

Design references:

- [Capability matrix](codex-capability-matrix.md)
- [Translation contract](codex-translation-contract.md)
- [ADR 0003: Codex target surface](../decisions/0003-codex-target-surface.md)
- [ADR 0004: Translation contract](../decisions/0004-codex-adapter-translation-contract.md)

Implementation status:

- Phase 1.1-B adapter core implementation: **EXISTS**
- Implemented: **IR, pure compilation core, validated canonical Directive content projection, diagnostics, deterministic manifest/provenance helpers**
- Codex native renderers: **NOT YET**
- Generated Codex artifacts: **NOT YET**
- Installer and user-file reconciliation: **NOT YET — Phase 1.2**

The adapter core consumes explicitly selected, validated, harness-neutral canonical records and produces an internal compilation representation, including renderable instruction candidates projected from validated Directive Markdown bodies. It does not reopen canonical files, render native files, install files, own runtime authority, or redefine canonical behavior.
