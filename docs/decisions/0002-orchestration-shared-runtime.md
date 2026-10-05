# ADR 0002: Orchestration and Shared Runtime State

- **Status:** Accepted
- **Date:** 2026-10-05

## Context

NexoHarness needs a harness-neutral architecture for coordinating coding tasks and using operational evidence across compatible target harnesses. The architecture must preserve the existing canonical entity model, authority boundaries, NEP-1 task lifecycle and governed self-improvement policy. Target-specific execution details are not yet researched for Codex, Claude Code or Kilo Code.

## Decision

- Orchestration is a logical control-plane responsibility, not automatically an Agent.
- Shared learned runtime state belongs conceptually to NexoHarness, not to any target harness.
- Learned state is non-canonical, scoped and advisory.
- Automatic adaptation may rank or select only within choices already authorized by canonical behavior and higher-priority instructions.
- Learned evidence cannot expand authority, weaken assurance or override explicit instructions.
- Canonical improvement requires a proposal, evaluation, regression comparison, independent review, explicit approval and promotion.
- Target adapters are sibling consumers of the same canonical source.
- MCP and provider implementation remain deferred.
- No Pack or Composition canonical Kind is introduced at this stage.

## Consequences

- Task coordination can be mapped to different target mechanisms without making one target's model canonical.
- Operational evidence can inform already-permitted choices without changing intended behavior.
- Project and workstyle context must remain scoped and subordinate to explicit instructions.
- Cross-harness learning requires normalization of target-specific evidence before it influences shared decisions.
- The architecture can be validated structurally before runtime implementation exists.

## Deferred decisions

- The storage, persistence, retention and access-control mechanisms for Shared Runtime State.
- Learned-pattern schemas, confidence calculations, staleness thresholds and status values.
- Concrete Orchestrator realization and workflow syntax for each target.
- Target telemetry availability and normalization mappings.
- Whether real compositions later justify a first-class canonical entity.
- Provider resolution and MCP implementation.
