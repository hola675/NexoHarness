# Architecture

This document is the authoritative high-level architecture for NexoHarness.

## Layered model

### Canonical Definition Layer

The harness-neutral source defines `core/` (including schemas, Contract definitions, the Nexo Core Directive, execution protocol and policies), `agents/`, `skills/`, `rules/`, `workflows/`, `capabilities/` and `profiles/`. These directories describe behavior, responsibilities and abstract requirements without depending on a target harness. Phase 0.2 validates these roots as one canonical repository index.

### Behavior Assurance Layer

`core/contracts/`, `enforcement/`, `evals/` and `tests/` make behavior inspectable, enforceable and testable. A documented rule is not certified until evidence demonstrates its behavior.

### Observation Layer

The Task Observer will consume structured telemetry and execution signals, identify patterns and produce bounded improvement proposals. It is not a source of canonical behavior and cannot promote its own changes. Its promotion boundary is defined by `core/policies/self-improvement.md`.

### Translation Layer

`adapters/` translate canonical definitions into harness-native configurations. Codex is the first certification target, Claude Code is second, and Kilo Code is third.

```text
                 ┌→ Codex
Canonical Source ├→ Claude Code
                 └→ Kilo Code
```

All targets compile independently from canonical definitions. No target adapter may become the source for another target adapter.

### Distribution Layer

The planned installer packages generated output. `dist/` contains generated harness artifacts only and is never a source dependency.

### Research Layer

`research/` and provenance metadata document external investigation. Research informs decisions but is never a runtime dependency or an unreviewed source of copied content.

## Dependency direction

```text
Research
   ↓
Canonical Source
   ↓
Validation
   ↓
Adapters
   ↓
Generated Distribution
   ↓
Harness Runtime
   ↓
Task Observer
   ↓
Evaluation / Improvement Proposal
   └────────────→ Canonical review
```

Dependencies flow toward outputs and evidence. Generated output does not flow back into canonical source.

## Canonical translation boundary

```text
                 ┌→ Codex Adapter → Codex output
Canonical Source ├→ Claude Adapter → Claude Code output
                 └→ Kilo Adapter → Kilo output
```

The canonical model requests capabilities, contracts and behaviors. An adapter selects native representations, providers and enforcement mechanisms for a target. The canonical model must remain usable if a provider or harness changes.

## Forbidden dependencies

- Canonical agents must not depend on Kilo-specific MCP names.
- Canonical rules must not depend on Claude-specific hooks.
- The observer must not mutate canonical source automatically.
- `dist/` must never become a source dependency.
- Research sources must never become runtime dependencies.
- Adapters may depend on canonical definitions, but canonical definitions may not depend on adapters.

The root `AGENTS.md` guides agents developing NexoHarness; `core/directives/core-directive.md` is the canonical product directive intended for future installed agents. They are deliberately distinct.

Phase 0.2 adds repository-wide canonical discovery and reference integrity validation only; it does not implement runtime agents, schemas, adapters or an installer.
