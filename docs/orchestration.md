# Nexo Orchestration

> **Authority note:** this document is reconciled under [`docs/model/operations-orchestration.md`](model/operations-orchestration.md), the organizational control-plane model. It is preserved in full here; it is not yet superseded.

## Responsibility

Orchestration is a logical NexoHarness control-plane responsibility. It interprets the task, coordinates the Nexo Execution Protocol (NEP-1), selects a proportionate workflow and tracks completion. It does not require a dedicated process, service, or harness-native Orchestrator Agent.

**ORCHESTRATOR != AGENT.** A host may realize this responsibility through a primary agent, workflow instructions, delegation facilities, runtime coordination, or another target-native mechanism. Those mappings remain target-specific decisions. The canonical architecture defines the responsibility, not its implementation.

## Control loop

```text
UNDERSTAND
→ INSPECT
→ CLASSIFY
→ SELECT PATH
→ SELECT WORKFLOW
→ ASSIGN RESPONSIBILITY
→ SELECT RELEVANT SKILLS
→ DETERMINE REQUIRED CAPABILITIES
→ EXECUTE
→ VERIFY
→ REVIEW WHEN REQUIRED
→ REPORT
→ OBSERVE
```

This elaborates NEP-1's logical stages. It does not require a separate agent or user-visible transition for each step. Observation runs when enabled and does not change the task outcome.

The Orchestrator may coordinate within the authority already established by the host, canonical policy, explicit user objective, project instructions, active workflow and assigned responsibility. **ORCHESTRATION AUTHORITY != UNLIMITED EXECUTION AUTHORITY.** Orchestration cannot exceed user scope, override safety or integrity rules, grant permissions to itself, delegate authority through a skill, use a capability merely because it exists, bypass verification, or bypass required independent review.

## Minimum sufficient orchestration

Use the smallest workflow, context set, delegation structure and verification plan that safely satisfies the task.

For a small, bounded task, the fast path is:

```text
UNDERSTAND → INSPECT → CLASSIFY → EXECUTE → VERIFY → REPORT → OBSERVE
```

For complex work, use additional preparation, bounded assignments, review or remediation when warranted:

```text
UNDERSTAND → INSPECT → CLASSIFY → PREPARE → DELEGATE / EXECUTE
→ VERIFY → REVIEW → BOUNDED REMEDIATION → VERIFY → REPORT → OBSERVE
```

The complex path does not require every listed activity on every task. More agents, tests or context do not automatically improve orchestration. Use only activities required by task scope, risk and evidence.

## Escalation

Start with the minimum safe path and add work when evidence warrants it. Escalation signals include task complexity, elevated risk, uncertainty, failed verification, unresolved findings, missing context, conflicting architecture, degraded capability, review findings or repeated remediation. Escalation may add preparation, a specialist responsibility, a skill, a capability request, stronger verification, independent review, or a blocked/escalated outcome.

Escalation is bounded and evidence-driven. It must not silently expand user scope or turn every task into the full complex path. Resolve conflicts according to `core/policies/precedence.md`; if a material conflict remains unresolved, block or escalate rather than guessing.

## Canonical intent and target mechanism

Canonical orchestration intent describes the required outcome. An adapter later maps it to target execution mechanisms.

| Canonical intent | Target mechanism |
|---|---|
| Independent review is required | TBD — verify during target capability research |
| `repository.search` capability is required | TBD — verify during target capability research |
| Delegate bounded specialist work | TBD — verify during target capability research |

All target adapters consume canonical definitions independently. No target implementation becomes the source for another target's orchestration.

## Scope

This document defines architecture only. It creates no production Orchestrator Agent, workflow, agent, skill, runtime coordinator or target-specific mapping.
