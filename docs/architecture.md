# Architecture

This document is the authoritative high-level architecture for NexoHarness. The architecture defines harness-neutral behavior before target capability research or adapter implementation.

## Three coordinated responsibilities

```text
                       NEXOHARNESS
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
       DEFINE            EXECUTE            LEARN
          │                 │                 │
      Canonical         Orchestration       Observer
      Behavior          Workflows           Evals
      Contracts         Agents              Patterns
      Authority         Skills              Candidates
      Rules             Capabilities        Metrics
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                         ADAPTERS
                            │
                  ┌─────────┼─────────┐
                  ▼         ▼         ▼
                Codex     Claude     Kilo
```

**DEFINE** owns intended canonical behavior, contracts, authority and rules. **EXECUTE** coordinates a task through the Nexo Execution Protocol, proportionate workflows, bounded responsibilities and abstract capability requests. **LEARN** turns admissible execution evidence into operational patterns or governed canonical improvement candidates. Learning does not control canonical promotion.

These are coordinated responsibilities, not required processes, agents or services. The Orchestrator is a logical control-plane responsibility, not automatically an Agent. The Task Observer analyzes evidence but does not own execution, authority or promotion.

## Canonical Definition Layer

The harness-neutral source defines `core/` (schemas, Contract definitions, the Nexo Core Directive, execution protocol and policies), `agents/`, `skills/`, `rules/`, `workflows/`, `capabilities/` and `profiles/`. It describes intended behavior and abstract requirements independently of target harnesses.

## Execution and Assurance Layers

The Nexo control plane selects a minimum sufficient path, coordinates workflow state and relevant responsibilities, and requests required capabilities. `core/contracts/`, `enforcement/`, `evals/` and tests make behavior inspectable and verifiable. Evidence and review requirements remain governed by canonical policy; runtime adaptation cannot weaken them.

## Shared Runtime and Learning Layer

Shared Runtime State holds scoped operational evidence and learned recommendations. It is non-canonical and advisory. Task Observer performs evidence observation and improvement analysis. Admissible learned recommendations may affect ranking or selection among already-authorized choices inside the Adaptation Envelope. Canonical changes follow `core/policies/self-improvement.md` and require explicit approval.

## Translation and Distribution Layers

Target adapters attach below the NexoHarness architecture. Codex is first, Claude Code second, and Kilo Code third. Each adapter consumes the same canonical source independently and may normalize target-specific telemetry into shared concepts when future target capabilities permit it. No adapter is the source for another adapter or for canonical behavior.

```text
                 ┌→ Codex adapter → Codex
Nexo architecture├→ Claude adapter → Claude Code
                 └→ Kilo adapter → Kilo Code
```

The planned installer packages generated output. `dist/` contains generated harness artifacts only and is never a source dependency.

## Research Layer

`research/` and provenance metadata document external investigation. Research informs decisions but is never a runtime dependency or an unreviewed source of copied content.

## Future compositions

NexoHarness may later offer compositions such as Nexo Coding Core, Web Development, Debugging, Security Review or Backend. A composition should refer to existing workflows, agents, skills, rules, profiles and capabilities rather than duplicate them. Whether real compositions need a first-class canonical entity is deferred until such compositions exist; Phase 0.3 adds no new Kind or production composition.

## Dependency and promotion boundaries

```text
Research → Canonical Definitions → Nexo Control Plane → Target Adapters → Generated Output
                                     ↑                         │
                                     │                         ▼
                         Governed Promotion ← Evals ← Shared Runtime Evidence
```

Runtime evidence may inform a recommendation or candidate, but cannot flow directly into canonical definitions. Generated output does not flow back into canonical source. Cross-project learning uses structured non-sensitive signals; project content remains project-scoped.

## Forbidden dependencies

- Canonical behavior must not depend on target-specific implementation details.
- Learned runtime state must not become canonical authoring input without the governed improvement lifecycle.
- Learned state cannot change authority, permissions, safety rules or required verification.
- The Observer cannot own execution or promote its own changes.
- `dist/` must never become a source dependency.
- Research sources must never become runtime dependencies.
- Adapters may depend on canonical definitions, but canonical definitions may not depend on adapters.

The root `AGENTS.md` guides agents developing NexoHarness; `core/directives/core-directive.md` is the canonical product directive intended for future installed agents. They are deliberately distinct.

Phase 0.3 defines architecture only. It does not implement the Orchestrator, runtime persistence, Observer runtime, provider resolution, MCP integration or target adapters.
