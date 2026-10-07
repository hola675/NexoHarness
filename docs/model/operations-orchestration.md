# NexoHarness Operations & Orchestration

Status: ACTIVE. This is the organizational/control-plane model answering: **what operational decisions does Nexo need to make to get work done, and how does it coordinate responsibilities, workflow, context, delegation, capabilities and assurance to do it?** It reconciles, but does not replace, [`docs/orchestration.md`](../orchestration.md) and [`docs/execution-model.md`](../execution-model.md), which remain preserved and cross-referenced.

None of this introduces `Assignment`, `WorkUnit`, or `Orchestrator` as schema-validated Kinds, and none of it implements a new runtime.

## Core orchestration invariant

**ORCHESTRATOR != AGENT.** Orchestration is a logical control-plane responsibility, not a required process, service, or harness-native Orchestrator Agent (`docs/orchestration.md`). No `Orchestrator Agent` and no `orchestrator/` directory are created by this document.

## Operations control loop

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

This is `docs/orchestration.md`'s existing control loop, read as the Operations elaboration of [`work-lifecycle.md`](work-lifecycle.md)'s PREPARE stage (Select Path / Select Workflow / Assign Responsibility / Select Skills / Determine Capabilities).

## Minimum Sufficient Orchestration

Use the smallest amount of workflow, context, responsibility, delegation and verification sufficient to safely satisfy the Assignment. Avoid coordination for coordination's sake — more agents, tests, or context do not automatically improve orchestration (`docs/orchestration.md`).

## Responsibility before tooling

Decisions flow in this order:

```text
Assignment
→ responsibility
→ Competency need
→ Skill
→ Capability requirement
→ runtime mechanism
```

Never the reverse — an available tool must not invent a responsibility that did not already exist.

## Lead Role

The Lead Role is the Role primarily responsible for keeping one Assignment coherent: scope coherence, coordination, blocker visibility, acceptance awareness, integration, and completion gates. It does not grant unlimited authority and is not a new Kind — it is an organizational designation within an Assignment.

A **Lead Division** may exist as organizational metadata on an Assignment (which founding Division is primarily accountable). It is not a Kind and has no schema.

## Work Unit

A Work Unit is a temporary collaboration grouping created for one Assignment:

```text
Assignment
→ required responsibilities
→ required competencies
→ available Roles
→ smallest sufficient Work Unit
```

**Work Units are temporary.** When the Assignment closes, the Work Unit dissolves — it never becomes a permanent organizational team.

When a Work Unit has multiple participants, operational roles may be distinguished conceptually as `OWNER`, `CONTRIBUTOR`, `REVIEWER`. These are not a new technical enum introduced without need; they describe collaboration responsibility only.

## Delegation

Delegation is a bounded transfer of work responsibility. It is **not** a transfer of all accountability, not a transfer of all authority, and not an automatic right to mark work complete (`core/policies/delegation.md`).

A delegation should conceptually provide: objective, scope, context, constraints, expected output, and completion condition; optionally verification requirement, handoff requirement, and failure behavior.

**Authority bound:** `child authority <= delegated authority <= parent/Assignment authority`. Delegation can never widen authority beyond what the delegating party already holds.

### Native spawn boundary

A target harness may provide a native `spawn`/`wait`/subagent mechanism. **Target spawn mechanism != Nexo delegation policy.** A harness-native spawn capability is a Capability Provider implementation detail; it does not by itself satisfy, replace, or redefine Nexo's bounded delegation requirements.

### Concurrency

Independent work may execute concurrently. When it does, declare ownership, shared dependencies, mutation boundaries, and the integration point. When B depends on a validated result from A, do not parallelize artificially: `A → validate → B`.

### F2 concurrency lesson (bounded)

The frozen local C4-C attempt [R5-F2](../../research/codex/probes/c4c-runtime-r5-f2-0.160.0.md) observed that parent and child request traffic can overlap in ways a simple fixture failed to classify (its concurrent-child-request-routing defect). The bounded organizational lesson drawn from this — and only this — is: **orchestration/event correlation must not assume simple temporal sequencing between a parent and a delegated child.** This is cited as a bounded runtime lesson about concurrency; it is not, and must never be read as, C4-C certification. F2's overall verdict remains **INVALID**, and C4-C remains **FROZEN**.

## Workflow

Workflow keeps its existing technical meaning in full: state, transition, coordination, gates, retry/remediation, and terminal behavior (`docs/concepts/workflows.md`). Operations *selects* a Workflow; it does not redefine what a Workflow is.

## Skill

Skill contributes bounded procedural knowledge (`docs/concepts/skills.md`). Workflow coordinates; Skill does not coordinate state, and Workflow is not a container for procedure. The two are not duplicated into each other here.

## Handoff

A Handoff occurs when responsibility or information passes significantly between participants. Not every message is formalized as a Handoff. A Contract Definition remains the canonical description of a handoff artifact's shape; a Contract Instance is the runtime artifact that fills it (`docs/concepts/contracts.md`). A Handoff may use a Contract Instance to carry its content; **no separate `Handoff` Kind is created**.

## Context progressive disclosure (operational use)

The existing layering is preserved in full:

```text
ALWAYS-ON → CONDITIONAL CANONICAL → LEARNED / TASK → TARGET RUNTIME
```

(`docs/execution-model.md`). This document defines only its operational use inside the control loop: Operations selects which conditional canonical context (workflow, agent contract, rules, skills, profile, capability requirements) a given Assignment actually needs, following the minimum-sufficient principle above. The full context model remains `docs/execution-model.md`'s responsibility and is not completed here.

## Capability timing

Capabilities are determined *after* understanding the Assignment, its responsibility, and its procedure/Skill — never as the architectural starting point. An available Capability must not drive what responsibility gets invented.

## Execution

During Execute, every actor operates within the bounds already established by: Assignment, Workflow, Role responsibility, Authority, applicable Rules/Policies, Skills, and Capabilities. None of these bounds are expanded by Execution itself.

### Discovery during execution

A discovery made during execution is classified as:

```text
IN_SCOPE
RELATED_OUT_OF_SCOPE
BLOCKING_EXTERNAL
RISK_ESCALATION
```

`RELATED_OUT_OF_SCOPE` work is recorded and reported, and may become a future candidate — it never silently expands the current Assignment (`core/policies/scope-control.md`). `RISK_ESCALATION` may require Path escalation, additional assurance, review, or approval.

### Blocked state

When work cannot continue, report the blocker, the affected scope, the work already completed, and the condition required to proceed. A blocked dependency is not reported as a complete Failure of unrelated completed work.

## Verification, Review, Remediation

Execution does not by itself determine Completion — `Execute → Verify` according to the assurance the Assignment requires (`core/policies/evidence.md`, `core/policies/completion.md`).

Review happens when risk, complexity, workflow, policy, or findings require it; not every trivial task requires independent review. Review produces a **Finding**, not a silent repair — remediation is a separate, later step:

```text
VERIFY → REVIEW → FINDING → REMEDIATE → REVERIFY
```

**Fix the finding, not everything nearby.**

### Retry != Remediation

```text
Retry       — repeat an attempt after a transient/operational failure
Remediation — modify the work to address a diagnosed finding
```

These are never equivalent. A Workflow may conceptually define a retry limit, a fallback, and a terminal condition (no runtime implementation is introduced here). When retries are exhausted: `STOP → DIAGNOSE`, never an infinite loop.

## Reporting

A final report states what changed, what was verified, what remains, limitations, and the actual status — never an overstated evidence claim (`core/policies/completion.md`, NEP-1 REPORT).

## Operations versus Assurance

```text
Operations — coordinates what needs to happen
Assurance  — determines what has been proven
```

Operations does not self-certify its own work as proven.

## Operations versus Adapter

```text
Operations — makes semantic decisions
Adapter    — performs target translation
```

Codex-specific (or any target-specific) commands do not leak into the canonical Workflow model; see `docs/adapters/codex-translation-contract.md`'s own `NEXO_RUNTIME_ONLY` boundary for Workflow.

## Operations versus Runtime

```text
Operations — asks for a required semantic Capability
Runtime    — resolves the actual mechanism that fulfills it
```

## Learned routing boundary

Shared Runtime evidence may, in a future phase, rank, recommend, or prefer among choices *already permitted*. It must never grant authority, invent a Role, or skip required verification (`docs/shared-runtime.md`'s Adaptation Envelope). This document does not elaborate the Knowledge/Learning model further; that reconciliation is deferred to a later phase (see "Deferred" below).

If Role or Workflow effectiveness is ever mentioned, it is **task-class operational evidence**, never a human-like global performance leaderboard.

## No agent proliferation

Before proposing a new Agent to solve a coordination problem, first investigate whether Workflow, routing, Contract, Skill, or additional context can solve it.

## Orchestrator Agent gate

No Orchestrator Agent is created unless a later phase produces evidence of a distinct, stable, executable responsibility that existing control-plane logic cannot sufficiently represent. No such evidence exists today.

## Persistent state (recognized, not designed)

A future recovery capability may need to know what completed, what remains, what evidence is still valid, and what must rerun. **This document makes no persistence design, no database choice, and no storage schema decision.** That remains fully deferred.

## Idempotency

Prefer idempotent or safely replayable operations where practical, especially for local-write, external-write, and destructive effects — as a principle only; no implementation is designed here.

## Deferred

[`docs/shared-runtime.md`](../shared-runtime.md) and [`docs/continuous-improvement.md`](../continuous-improvement.md) are referenced above only where necessary and are not fully reconciled by this document; their reconciliation is planned for a later phase (`docs/model/knowledge-experience.md`, `docs/model/learning-evolution.md`, both currently PLANNED). The completion `READY` conflict recorded in [`docs/reviews/r1-documentation-authority-audit.md`](../reviews/r1-documentation-authority-audit.md) remains **DEFERRED** and is not touched here.
