# Shared Runtime State

## Purpose

Shared Runtime State is the conceptual NexoHarness-owned place for operational evidence and learned recommendations. It can make useful evidence available across compatible coding harnesses while remaining outside canonical source. This phase defines no storage, persistence format or runtime implementation.

Canonical source describes intended behavior. Learned Runtime State describes observed operations. It is non-canonical and advisory, and subordinate to host constraints, critical Nexo safety and integrity, explicit user intent, project instructions, active workflow, agent responsibility and applicable rules. It cannot grant authority or override higher-priority instructions.

This subordination follows the existing [Precedence Policy](../core/policies/precedence.md); Shared Runtime State does not establish a competing precedence system.

## Contextual scopes

### GLOBAL OPERATIONAL

Aggregated, non-authoritative patterns that may help across projects, such as workflow success rates, skill effectiveness, recurring failure classes and orchestration efficiency. Prefer structured, non-sensitive signals. Global state is not canonical behavior and carries no execution authority.

### WORKSTYLE

Observed preferences relevant to a user or workspace, such as preference for bounded changes, validation intensity or recurring workflow preferences. Workstyle state is advisory and yields to explicit user instructions and project requirements.

### PROJECT

Operational context scoped to one project, such as architecture conventions, effective commands, validation expectations, recurring failures, effective workflows and project patterns. **PROJECT STATE STAYS PROJECT-SCOPED BY DEFAULT.** Do not transfer another project's source code, raw files, secrets, credentials, customer data, raw conversations or proprietary content into this scope. Cross-project patterns should be derived from structured, non-sensitive signals.

### TASK

Ephemeral state for the current execution, such as objective, active constraints, selected workflow, current findings, unresolved items and current evidence. Task state normally expires with the task unless it is explicitly and safely promoted to another runtime scope. Promotion changes its scope, not canonical authority.

## Permitted influence: Adaptation Envelope

Automatic adaptation is permitted only among choices already authorized by canonical behavior and applicable higher-priority instructions.

```text
CANONICAL ENVELOPE
        ↓
already-allowed choices
        ↓
relevant runtime evidence
        ↓
ranking / recommendation / selection
        ↓
execution under existing authority
```

For example, if workflows A and B are both allowed and project-scoped evidence supports B, the runtime may recommend or prefer B. Runtime evidence cannot authorize a forbidden action, expand user scope, grant permissions, weaken verification, alter credentials, enable integrations, publish releases or change adapter definitions.

The allowed feedback path is Observer evidence → learned runtime pattern → Orchestrator recommendation or ranking → an already-authorized choice. This is operational adaptation, not canonical promotion.

## Evidence quality and staleness

Learned evidence is not truth. A future learned pattern needs enough metadata to reason about its scope and quality, including scope, evidence count, confidence, first observed, last observed and a status or staleness indicator. A pattern must be able to become insufficient, active, stale or contradicted. These concepts do not define a storage schema or freeze enum names.

Old evidence must not silently remain permanently authoritative. Recommendations should be limited or withheld when evidence is insufficient, stale, contradicted or out of scope.

## Cross-harness sharing

NexoHarness learns once; compatible target harnesses may benefit from the same project or workstyle operational knowledge. A task executed through one harness may contribute normalized structured evidence that another harness can later use. Target-specific details must be normalized before they affect shared runtime decisions. Concrete normalization and telemetry mappings are deferred to target and runtime phases.

Shared learning does not make a target harness canonical source. No harness-specific implementation detail becomes global canonical knowledge merely because it was observed.

## Boundary

Learned Runtime State may inform ranking, recommendation, context prioritization, verification planning inside allowed policy, and escalation. It may not autonomously modify canonical source, alter authority, weaken rules or verification, change permissions or credentials, enable external integrations, publish releases, change adapters or promote itself to canonical behavior.

Canonical improvement follows the separate governed lifecycle in [Continuous Improvement](continuous-improvement.md) and `core/policies/self-improvement.md`. No database, memory store, vector database, event bus, persistence directory or runtime storage code is introduced in Phase 0.3.
