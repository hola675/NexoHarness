# NexoHarness Work Lifecycle

Status: ACTIVE. This is the organizational/operational lifecycle model: the conceptual states a unit of work passes through from entering NexoHarness to completion. It reconciles, but does not replace, [`docs/lifecycle.md`](../lifecycle.md)'s build lifecycle; that document is preserved and cross-referenced, not deleted.

**This is not a second runtime directive.** [`core/directives/execution-protocol.md`](../../core/directives/execution-protocol.md) (`NEP-1`) remains the canonical technical directive for task execution. This document is the organizational/system lifecycle model built around NEP-1; it elaborates the same territory at the organizational level and explicitly reconciles its stage names with NEP-1's, it does not supersede or duplicate NEP-1's authority.

## Master lifecycle

```text
Request
→ Intake
→ Understand
→ Inspect
→ Classify
→ Assignment
→ Select Path
→ Select Workflow
→ Assign Responsibility
→ Select Skills
→ Determine Capabilities
→ Execute
→ Verify
→ Review
→ Remediate
→ Complete / Report
→ Observe
```

## Relationship to the Nexo Execution Protocol (NEP-1)

NEP-1 defines nine canonical logical stages: `UNDERSTAND → INSPECT → CLASSIFY → PREPARE → EXECUTE → VERIFY → REVIEW → REPORT → OBSERVE`. The master lifecycle above does not silently replace them. It is NEP-1 read at the organizational level, with two additions that precede NEP-1's scope and some stages named more specifically:

| Master lifecycle stage | NEP-1 stage | Relationship |
|---|---|---|
| Request | (precedes NEP-1) | The desired work that will become NEP-1's input once Intake confirms it is actionable. |
| Intake | (precedes NEP-1) | Organizational triage before NEP-1 begins; not one of NEP-1's nine stages. |
| Understand | UNDERSTAND | Same stage. |
| Inspect | INSPECT | Same stage. |
| Classify | CLASSIFY | Same stage, elaborated here into four explicit dimensions (see below). |
| Assignment | (control-plane artifact, not a stage) | The bounded work representation created once Classify has enough information; see "Assignment" below. |
| Select Path, Select Workflow, Assign Responsibility, Select Skills, Determine Capabilities | PREPARE | These are the organizational elaboration of what PREPARE actually decides; NEP-1 names one stage, the lifecycle model names its five constituent decisions. |
| Execute | EXECUTE | Same stage. |
| Verify | VERIFY | Same stage. |
| Review | REVIEW | Same stage. |
| Remediate | (conditional activity inside the complex path) | Matches NEP-1's own "REMEDIATE is a conditional activity inside the complex path, not an additional universal stage." |
| Complete / Report | REPORT | Same stage; "Complete" names the condition REPORT communicates. |
| Observe | OBSERVE | Same stage. |

No stage here authorizes skipping a NEP-1 safety gate, and NEP-1's fast path (`UNDERSTAND → INSPECT → CLASSIFY → EXECUTE → VERIFY → REPORT → OBSERVE`) and complex path remain the canonical shape for small vs. higher-risk work.

## Request

A Request is an authorized unit of desired work entering NexoHarness. It may originate from a user, authorized automation, a project event, or an approved external trigger. **Not every external signal is automatically an authorized Request** — authorization is what Intake checks for, not assumed on arrival.

## Intake

Intake determines whether there is enough information to begin, by resolving: objective, desired outcome, explicit constraints, available context, missing information, and initial risk signals. Intake produces one conceptual outcome — distinct from, and never substituted for, `core/policies/completion.md`'s completion-status vocabulary or `core/schemas/common.schema.json`'s `completionStatus` enum:

```text
READY
NEEDS_INSPECTION
NEEDS_INPUT
BLOCKED
REJECTED
DEFERRED
```

**`NEEDS_INSPECTION` is a deliberate, distinct outcome**, not a subset of `NEEDS_INPUT`: it marks that the missing information may already be discoverable from the repository or environment, and should be inspected before asking the user — "inspect before unnecessary clarification," consistent with the Core Directive's "Context before action."

## Understand

When recording facts or requirements during Understand, it is useful to separate:

```text
EXPLICIT   — stated directly by the Request
DERIVED    — inferred from context or repository state
UNKNOWN    — not yet established
```

A `DERIVED` fact must never be silently treated as an `EXPLICIT` instruction.

## Inspect

Guiding principle: **current state before proposed state.** Inspection may examine the repository, architecture, relevant source, tests, runtime state, documentation, ADRs, and existing evidence. Its result is observed facts, constraints, relevant architecture, open questions, risks, and possible scope — **not** an automatic solution.

## Classify

Classification uses four explicit, separate dimensions. They are not interchangeable and must not be collapsed into one score:

- **Complexity** — `TRIVIAL`, `BOUNDED`, `COMPLEX`. `CRITICAL` is never used here; it is reserved for Risk.
- **Risk** — `LOW`, `MODERATE`, `HIGH`, `CRITICAL` (conceptual; no schema change is introduced in this phase).
- **Novelty** — `KNOWN`, `PARTIALLY_KNOWN`, `NOVEL`.
- **Uncertainty** — `LOW`, `MEDIUM`, `HIGH`.

### Execution Path

Path is an operational concept, not a canonical Kind:

```text
FAST       — trivial/bounded, low risk, well understood
STANDARD   — normal bounded work
FULL       — complex work; decomposition/delegation/integration likely
CONTROLLED — higher assurance/approval/control required due to risk or governance
```

`CONTROLLED` is used instead of reusing "CRITICAL" as a path name, to avoid conflating a Risk level with a Path name.

Path is dynamic: it may escalate or de-escalate when new evidence changes risk, complexity, uncertainty, or scope. A path change must be observable (reported), not silent.

## Assignment

An Assignment is the runtime/control-plane representation of one bounded unit of work, created once Classify has enough information. It conceptually carries: identity, objective, scope, constraints, acceptance criteria, classification, risk, selected path, workflow, responsibilities, current state, and evidence. **No schema is introduced for Assignment in this phase.**

An Assignment needs a conceptually stable identity for the duration of its execution, to correlate delegations, handoffs, findings, evidence, and events with its eventual completion. This phase does not decide a technical identity format.

**Request != Assignment.** A Request is desired work entering the system; an Assignment is the bounded operational representation that exists only after Intake and Classification. Not every Request becomes exactly one Assignment, and an Assignment does not exist before that point.

## Completion

Completion is never established merely because an implementer states "done." It requires, where applicable: the objective was satisfied, acceptance criteria were satisfied, required verification was completed, required review was completed, blocking findings were resolved, and limitations were disclosed. This elaborates, and does not relax, `core/policies/completion.md`.

**Partial completion is preferable to false completion.** No new machine-readable enum is introduced in this phase for partial outcomes; see the deferred `READY` conflict below for why no enum unification is attempted here.

## Observe

Observation happens at or after defined lifecycle points, but **observation does not change the task result**. Task Observer records structured signals; it does not promote them to canonical behavior (`docs/concepts/task-observer.md`, `core/policies/self-improvement.md`).

## Deferred conflict: completion `READY`

As recorded in [`docs/reviews/r1-documentation-authority-audit.md`](../reviews/r1-documentation-authority-audit.md) and reaffirmed in [`docs/model/vocabulary.md`](vocabulary.md), `core/policies/completion.md` (5 states) and `core/schemas/common.schema.json`'s `completionStatus` enum (6 states, including `READY`) do not match. This document's Intake outcome vocabulary reuses the word `READY` only as a conceptual Intake triage result — **it is a different concept from the schema's `completionStatus` enum value of the same name**, and this document does not resolve, normalize, or merge the two. The conflict remains **DEFERRED**.
