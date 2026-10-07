# NexoHarness Learning & Evolution

Status: ACTIVE. This document defines how NexoHarness turns Experience into hypotheses and improvement proposals, how it tests Candidates, and how continuous improvement is prevented from becoming self-modification without Governance. It reconciles, but does not replace, [`docs/continuous-improvement.md`](../continuous-improvement.md) and [`docs/concepts/task-observer.md`](../concepts/task-observer.md), both preserved in full.

**No Observer runtime, learning engine, autonomous patch generator, storage system, or promotion engine is implemented here.** This document makes no schema, Policy, or directive change.

## Fundamental separation

```text
Experience  → what happened
Learning    → what the evidence may mean
Evolution   → what change may be worth trying
Evaluation  → whether the proposed change performs as intended
Governance  → whether the change may become authoritative
```

Therefore: **Learning != Evolution**, **Evolution != Promotion**, **Evaluation != Approval**, **ImprovementProposal != Canonical change**, **Candidate != Canonical**.

## Master improvement lifecycle

```text
REAL WORK
→ OBSERVATION
→ AGGREGATION
→ PATTERN / DIRECT FINDING
→ DIAGNOSIS
→ HYPOTHESIS
→ IMPROVEMENT PROPOSAL
→ ISOLATED CANDIDATE
→ EVALUATION
→ BASELINE / REGRESSION COMPARISON
→ INDEPENDENT REVIEW
→ EXPLICIT APPROVAL
→ PROMOTION
→ NEW CANONICAL STATE
→ REAL WORK
```

This is never simplified to "observe → edit." Every stage between Observation and Promotion is a distinct, necessary gate — removing one does not make the lifecycle more efficient, it makes it unsafe.

## Experience-to-Learning boundary

Learning receives Observation, Experience, validated/scoped Knowledge (`docs/model/knowledge-experience.md`), Assessment results, and runtime evidence — but **never modifies those sources retrospectively**. The append-oriented and historical-truth principles from `knowledge-experience.md` apply unchanged here.

## Learning

Learning may: classify evidence, aggregate comparable observations, detect patterns, identify contradictions, diagnose failure classes, estimate confidence, generate hypotheses, and identify gaps.

Learning may **never**: grant authority, alter a Policy, modify canonical source, publish releases, enable Providers, or change permissions.

### Diagnosis

Diagnosis is a reasoned classification of where an observed problem or opportunity most likely originates. **No `Diagnosis` Kind is created.** Conceptual diagnosis layers:

```text
CONTEXT
KNOWLEDGE
RETRIEVAL
ASSIGNMENT
ROUTING
PROCEDURE
HANDOFF
ROLE
COMPETENCY
CAPABILITY
PROVIDER
ASSURANCE
GOVERNANCE
ORGANIZATION
```

**Diagnose before adding entities.** Given a wrong output, diagnose first — do not jump straight to "needs a new Agent," "needs a new Skill," or "needs a new Workflow."

- **Routing failure** — the wrong *existing* Role was selected. This is a routing failure, not automatically evidence that a new Role is needed (consistent with `docs/model/operations-orchestration.md` and `docs/model/knowledge-experience.md`'s Routing Gap).
- **Procedure failure** — the correct Role failed due to an incomplete method. Investigate Skill, procedure, Knowledge, and context *before* considering splitting the Role.
- **Capability failure** — a necessary operation is missing (`CAPABILITY_GAP`). Do not assume the Agent is incompetent.
- **Provider failure** — the Capability exists but one concrete implementation failed (`PROVIDER_GAP`). Do not rewrite the canonical Capability.

### Hypothesis

A Hypothesis is a falsifiable explanation or improvement claim derived from evidence. **No `Hypothesis` Kind is created.** It conceptually carries: problem/opportunity, scope, supporting evidence, contradictory evidence if known, expected effect, and conditions.

**A hypothesis is not truth.** A high-confidence hypothesis is never automatically Knowledge, never a Policy, and never canonical behavior.

## Evolution

### ImprovementProposal (existing Kind, preserved)

Organizationally: a governed proposal to change NexoHarness behavior, structure, or implementation based on evidence. It must remain fully consistent with `core/schemas/improvement-proposal.schema.json`, which is **not modified** by this document:

| Schema field | Organizational meaning |
|---|---|
| `observationRefs` (required) | Traceability: every proposal must point to its supporting evidence. No orphan proposals. |
| `changeSummary` (required) | Describes what is proposed. **Not an approved implementation.** |
| `requiresExplicitApproval: true` (required, constant) | Every ImprovementProposal requires an explicit approval boundary before canonical promotion. The literal value `true` is never reinterpreted as approval already granted — it states that approval is *required*, not that it has occurred. |
| `evaluationPlan` (required) | How the change will be tested: conceptually, baseline, scenario(s), expected improvement, regression guardrails, and required evidence — without any schema change. |
| `target` (optional) | The schema deliberately leaves this optional; this document introduces no new technical requirement here. When no specific target exists, `changeSummary` plus the evidence/evaluation plan must still make the scope understandable. |

A proposal may target a canonical entity, an adapter, a runtime mechanism, validation, documentation, or workflow/routing — the kind of change must remain explicit regardless.

### Candidate

A Candidate is an isolated implementation of a proposed change, used for evaluation. **No `Candidate` Kind is created.** It may represent a proposed Agent, Skill, Workflow, Policy, adapter, or documentation change — it remains a *candidate version/change*, never a new ontology entity.

**Candidate isolation.** A Candidate is evaluated without silently replacing the canonical baseline. It may conceptually exist as a temporary workspace, an isolated branch/worktree, a fixture, an in-memory representation, or a generated patch — the concrete technique is a future implementation decision, not fixed here.

**Autonomous candidate generation.** `core/policies/self-improvement.md`'s allowed autonomous steps already include `GENERATE CANDIDATE`. This means *may prepare an isolated proposed change* — it never means *may commit, push, or promote it to canonical source*. A future implementation must keep a clear boundary between controlled, isolated candidate generation and any unexpected modification of the active canonical worktree; **no mechanism for that boundary is designed here.**

Conceptual Candidate lifecycle vocabulary (not a schema or enum): `PROPOSED`, `EXPERIMENTAL`, `UNDER_ASSESSMENT`, `PROVISIONAL`, `APPROVED`, `REJECTED`, `RETIRED`.

**`REJECTED` is useful evidence, not deletion.** A rejected Candidate's evidence and reason for rejection are preserved, so the same experiment is not repeated without context.

### Evaluation (existing Kind, preserved)

`Evaluation` (`core/schemas/evaluation.schema.json`) keeps its existing technical meaning (`method`: structural/behavioral/adapter/integration/regression; optional `evidenceClass`: E0–E4, reusing `core/policies/evidence.md` without redefinition). Learning/Evolution may select an existing Evaluation, propose Evaluation candidates, or run isolated evaluations when authorized — but **an Evaluation result is never equal to an Approval.**

**Baseline and comparison.** Any proposal claiming improvement must compare against the current baseline when reasonably comparable. Per dimension, use conceptually: `BETTER`, `EQUIVALENT`, `WORSE`, `INCONCLUSIVE` (no schema change). Compare across whatever applies: correctness, quality, evidence strength, safety, portability, latency, context cost, delegation cost, remediation cost, verification cost, and complexity.

**FASTEST != BEST. FEWEST TESTS != BEST** (preserved verbatim from `docs/continuous-improvement.md`). A metric is never improved by weakening Assurance.

**Anti-gaming.** Never accept as improvement: deleting slow tests, skipping required verification, suppressing failure reporting, avoiding required independent review, downgrading risk classification, hiding remediation, or disabling telemetry — solely to improve a metric.

**Complexity cost.** A change must justify its new complexity: conceptually, `value of change > coordination cost + maintenance cost + ontology cost + runtime cost`, when applicable. An `EQUIVALENT` Candidate that adds significant complexity is normally rejected unless another explicit justification exists.

**New behavior.** If no direct baseline exists, record conceptually `baseline: NONE / NOT_APPLICABLE` — never fake an impossible comparison.

**Invalid evaluation evidence.** An `INVALID` probe cannot certify a Candidate overall, even if it produced bounded, individually valid observations. This preserves the F2 lesson exactly: the frozen [C4-C R5-F2 record](../../research/codex/probes/c4c-runtime-r5-f2-0.160.0.md) is cited here only as an example of "invalid experiment + valid bounded observations + fixture diagnosis" — never as evidence of an improvement `PASS`.

### Independent Review, Explicit Approval, Promotion

Before canonical promotion of a protected change, the implementer is never the independent reviewer, when Governance requires review — the full set of approval levels belongs to a future Governance model and is not defined here.

**Explicit Approval** must be explicit, scoped, and traceable. It is never inferred from a good evaluation, high confidence, many observations, or a passing review by itself.

**Promotion** is the governed transition by which an approved Candidate becomes part of an authoritative source. **Promotion is not a Kind.** Before promotion, a Candidate is non-canonical; after a valid promotion, the approved change occupies a canonical/authoritative location — promotion is precisely that boundary, nothing before it and nothing after it does the work alone.

**No silent promotion.** None of Task Observer, Learning, Evolution, Evaluation, or Candidate can self-promote.

## Task Observer

Preserved purpose (`docs/concepts/task-observer.md`): use real task execution evidence to improve NexoHarness without allowing execution outcomes to silently rewrite the system.

Exactly two logical responsibilities are preserved — **no automatic split into two Agents**:

- **Evidence Observation** — may receive structured execution signals, validate representable telemetry, record an `Observation`, and associate evidence/provenance. It does not execute the task.
- **Improvement Analysis** — may aggregate, detect patterns, diagnose, hypothesize, generate an `ImprovementProposal`, generate an isolated Candidate, propose/run an isolated Evaluation where authorized, and compare. It does not promote.

Task Observer does **not** own: task execution, execution authority, permissions, canonical source, release authority, credential management, or provider activation.

### Structured signals only

Preserved technical rule: the Observer accepts only fields declared by the `Observation` schema. Unknown telemetry fails validation; arbitrary extension maps are never stored. Unavailable telemetry is recorded as **ABSENT** — never a fabricated zero, a guessed false, or an inferred observation.

### Current Observation limits (not expanded here)

The schema can represent only its currently declared fields. Future signal families — task/risk classification, validation efficiency, remediation counts, additional context metrics, additional capability telemetry — remain **FUTURE SCHEMA EVOLUTION**. This document does not pretend they are supported today.

**Complexity clarification (preserved, DEFERRED).** `core/schemas/observation.schema.json`'s `spec.complexity` enum remains `BOUNDED | COMPLEX`, distinct from `docs/model/work-lifecycle.md`'s organizational Complexity dimension (`TRIVIAL | BOUNDED | COMPLEX`), as first recorded in R1-D. This document does not resolve it and does not send `TRIVIAL` into the current schema. Classification: **DEFERRED CLARIFICATION**.

### Privacy contract (preserved)

```yaml
privacy:
  sourceContentStored: false
```

remains the expected default. Structured telemetry is never reinterpreted as authorization to capture source or chat content. `sourceContentStored: true` can only be enabled under a later, separately approved policy — **this document does not create that policy.**

**Raw data boundary.** Task Observer must never automatically convert chat transcripts, source dumps, generic payloads, or credentials into an `Observation`.

### Observer output sequence (Kind status clarified)

```text
OBSERVATION       — existing Kind
→ PATTERN         — not a Kind
→ HYPOTHESIS      — not a Kind
→ IMPROVEMENT_PROPOSAL — existing Kind (ImprovementProposal)
→ EVAL_CANDIDATE  — Evaluation is an existing Kind; "candidate" status here is conceptual only
```

**Direct finding path.** A Pattern is not artificially required for every proposal. A sufficiently significant direct Observation may go straight to Diagnosis → Hypothesis → ImprovementProposal when the nature of the event justifies it (consistent with `docs/model/knowledge-experience.md`'s "single event is not a recurring pattern, except where justified").

## Three learning classes (preserved distinction)

```text
Operational learning     — runtime evidence ranks/recommends/selects among already-authorized choices, inside the Adaptation Envelope; no canonical promotion required when permitted behavior does not change.
Project/workstyle learning — remains scoped, advisory, and subordinate to explicit instruction and Governance.
Canonical improvement    — always requires proposal, evaluation, comparison, review, approval, and promotion.
```

These have different authority and are never all collectively labeled "self-modification."

## Change size (conceptual, not an approval level)

```text
LOCAL
BOUNDED
STRUCTURAL
CONSTITUTIONAL
```

No technical enum is created. **Change size != approval authority** — the concrete relationship between a change's size and the approval level it requires belongs to a future Governance model, not to this document.

## Workforce evolution: Train / Develop / Specialize / Hire

```text
TRAIN       → improve Knowledge/Skills of an existing Role
DEVELOP     → broaden or mature an existing Competency
SPECIALIZE  → create a justified specialization inside a stable responsibility
HIRE        → create a new Role only when a persistent, distinct responsibility exists
```

**Hire gate.** Before proposing a new Role, ask: does a current Role already own this responsibility? Is the problem Knowledge? Is it Skill? Is it routing? Is it Workflow? Is the need persistent and distinct? Only after all of those are exhausted does a new-Role proposal follow — consistent with the Charter's "train before hiring."

## Simplification is improvement

Evolution may propose merging, removing, consolidating, deprecating, or simplifying — not only adding. Conceptually, a **Complexity Budget** and **Complexity Debt** may be used to reason about system growth; **neither is persisted or schematized in this phase.**

## Deferred and known notes

- **Completion `READY`** (Policy vs. `completionStatus` schema, from R1-A/B/C/D) remains **DEFERRED**; untouched here.
- **Observation complexity vocabulary** (`BOUNDED | COMPLEX` vs. organizational `TRIVIAL | BOUNDED | COMPLEX`, from R1-D) remains **DEFERRED CLARIFICATION**; untouched here.
- No background autonomous mutation: even a future continuous Observer performs continuous *observation*, never continuous autonomous *editing*.
- **Human approval remains the current direction** for protected canonical changes before promotion, for V1; no approval UI, actor, or workflow implementation is designed here.
- **Provider/Credential boundary.** Evolution can never auto-activate an external Provider, credential, integration, or permission expansion merely because an evaluation suggests it would help — it must be proposed, like any other change.
- **Release boundary.** Promotion to canonical source is never equal to a release; release has its own additional gates (`docs/versioning.md`).
- **Certification boundary.** A Candidate evaluation `PASS` is never equal to a certified release; certification belongs to Assurance and Distribution/Release, both currently PLANNED model documents.

## Explicit critical invariants

```text
OBSERVATION != AUTHORITY
EVIDENCE != APPROVAL
PROPOSAL != PERMISSION
CANDIDATE != CANONICAL
EVALUATION != PROMOTION
REVIEW != APPROVAL
PROMOTION REQUIRES GOVERNANCE
```
