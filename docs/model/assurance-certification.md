# NexoHarness Assurance & Certification

Status: ACTIVE. This document answers: **what has actually been demonstrated, for which claim, against which revision, under which scope and evidence strength?** It provides the organizational/system framing for Assurance; it does not implement work, grant authority, or approve its own protected change, and it does not replace:

```text
core/policies/evidence.md
core/policies/completion.md
core/schemas/common.schema.json
core/schemas/evaluation.schema.json
core/schemas/enforcement.schema.json
core/schemas/contract.schema.json
docs/concepts/evaluations.md
docs/concepts/enforcement.md
docs/concepts/contracts.md
docs/validation.md
docs/schema-system.md
docs/versioning.md
tools/release/phase-close.ts
```

None of these is modified by this document except where explicitly noted below as a minimal, evidence-based clarification.

## Assurance

Assurance is the system function responsible for establishing, reviewing, and communicating evidence-backed confidence in claims about NexoHarness work, behavior, and releases. Depending on scope, Assurance may **VERIFY, REVIEW, EVALUATE, ASSESS, CERTIFY**. It may never implement findings silently, grant authority, approve its own protected change, or promote canonical source.

**ASSURANCE != AGENT.** No `QA Agent`, `Assurance Agent`, `assurance/`, or `certification/` directory is created merely because the function exists.

## Execution, Verification, Review, Evaluation, Certification

```text
Execution      → performs work
Verification   → checks a specific claim/result
Review         → independently examines work/evidence/risks
Evaluation     → tests a defined target against pass criteria
Certification  → scoped assurance statement based on sufficient evidence
```

Each is a distinct responsibility; none substitutes for another.

## Evidence (preserved, not redefined)

`core/policies/evidence.md`'s classes are preserved exactly:

```text
E0 — Assertion only
E1 — Static inspection
E2 — Automated check
E3 — Runtime or behavioral verification
E4 — Independent verification
```

**Evidence class is not outcome.** `E4 != PASS`, `E2 != certification`, `E0 != failure` — classes describe the *strength/nature of support*, never the result. Evidence strength is proportional to the claim, risk, and workflow (preserved); E4 is not always required, and E0 is never acceptable for a claim that requires runtime proof.

**Freshness.** Evidence must be fresh relative to the state it claims to demonstrate: tests run *before* a change are not proof *after* it.

**Evidence identity (conceptual, no schema).** Useful evidence should relate to: claim, target, scope, revision/state, method, timestamp/recency, provenance, and result.

**Evidence validity (conceptual, no enum yet):** `VALID`, `STALE`, `INVALID`, `UNKNOWN`.

**`INVALID` evidence.** A run/probe may be globally `INVALID` when its procedure did not allow the claim to be correctly evaluated. This does not necessarily make every internal observation useless — preserving the F2 lesson exactly: the frozen [C4-C R5-F2 record](../../research/codex/probes/c4c-runtime-r5-f2-0.160.0.md) is `INVALID` overall, while several of its individual, independently supported observations remain valid and are documented as such. **Bounded observations from an invalid probe may be kept, but must never be used to assert the global verdict the probe did not establish.**

**`UNKNOWN != PASS`.** Insufficient evidence is never treated as a passing result.

## Verification

A direct check of a claim against current evidence. It must answer: what claim, what method, what evidence, what result. A conceptual (non-schema) outcome vocabulary may be used — `PASS`, `FAIL`, `BLOCKED`, `INCONCLUSIVE`, `NOT_APPLICABLE` — kept distinct from existing technical completion states.

**Verification != Completion.** A verification may pass while the Assignment it belongs to is still incomplete. **Verification != Review.** Verification may be performed by the implementation path itself, an automated check, or an independent path, depending on the claim; Review adds judgment about scope, quality, risk, and evidence sufficiency that mere verification does not provide.

## Review

Deliberate examination of work, evidence, or a proposed change against applicable criteria. Review independence may be described conceptually as `SELF`, `DOMAIN`, `INDEPENDENT` — descriptive categories only, no schema. **Independent Review**, when required, keeps the implementer distinct from the independent reviewer (Core Directive, preserved).

**Review does not silently repair.** It produces a **Finding** — never a silent patch. **No `Finding` Kind is created** in this phase.

A Finding's severity conceptually reuses `core/schemas/common.schema.json`'s existing `severity` enum (`low`/`medium`/`high`/`critical`) — **no parallel severity scale is introduced.** A Finding's disposition may conceptually be `ADVISORY`, `REQUIRED`, `BLOCKING`, `FALSE_POSITIVE`, or `ACCEPTED_RISK`. **Severity != disposition** — a `critical` severity finding could still carry an explicitly `ACCEPTED_RISK` disposition, and the two are tracked separately. No schema is introduced for either.

### Remediation

Bounded work performed specifically to address a diagnosed Finding. **"Fix the finding, not everything nearby"** (preserved from `docs/model/operations-orchestration.md`). Remediation always requires reverification: `Finding → Remediation → Reverification`, never `Finding → edit → assume solved`. The full review loop is preserved: `VERIFY → REVIEW → FINDING → REMEDIATE → REVERIFY`. Repeated failure does not license an autonomous infinite loop: `STOP → DIAGNOSE → BLOCK / ESCALATE`.

## Evaluation (preserved Kind, unmodified schema)

`core/schemas/evaluation.schema.json` requires `target`, `method`, `passCriteria`, with optional `evidenceClass` (E0–E4) — **not modified**. Its five `method` values are preserved exactly:

- **structural** — shape, metadata, static invariants, repository structure; does not by itself prove runtime behavior.
- **behavioral** — observed behavior; requires actual execution or an adequate equivalent for the claim. Prose inspection is never behavioral proof.
- **adapter** — canonical semantics → target representation; does not automatically prove the target actually loads/executes that artifact.
- **integration** — multiple boundaries working together (e.g. canonical → adapter → generated artifact → installer/fixture → target runtime, per scope).
- **regression** — protects previously established important behavior; must not degrade into "every historical test forever" with no current value.

**Evaluation Definition != Evaluation Run.** The canonical specification is distinct from its runtime/validation evidence. **No `Run` Kind is created** in this phase.

**Pass criteria before outcome** — criteria are fixed before result interpretation, never defined after seeing the result. `passCriteria` can conceptually express both "must happen" and "must not happen," even though the schema field remains a generic string list (no schema change). **Expected blocking can be `PASS`**: if the requirement is "an unsafe action must be blocked" and it is actually blocked, the Evaluation is `PASS` even though the underlying operation never executed. Where it matters, use positive, negative, and boundary cases to avoid false confidence.

## Enforcement evidence (preserved, unmodified)

`docs/concepts/enforcement.md`'s levels are preserved exactly: **L1 — Instructional, L2 — Validation, L3 — Runtime Gate.**

**Enforcement level != Evidence class.** `L3 != E3` — these are different axes: L-level describes *how an invariant is enforced*; E-level describes *how a claim is evidenced*. **Instruction is not prevention** (`L1 != L3`) — prompt wording alone is never hard enforcement. A claim that "the target prevents an action" normally needs appropriate runtime evidence, never a prose-only claim.

A **claim matrix** (claim, required evidence, observed evidence, result, limitations) is a useful conceptual tool, especially for certification — **no new schema is introduced for it.**

## Certification

A scoped assurance statement that a specific revision/configuration/target has satisfied a defined certification claim set with sufficient evidence. **Certification is never universal by default.**

Certification scope conceptually includes, as applicable: canonical revision, adapter revision, target, surface, target version/range, platform assumptions, Profile, features, and explicit exclusions.

```text
certified revision A      != automatic certification of revision B   (revision-bound)
Codex CLI certification   != Claude certification != Kilo certification  (target-bound)
Codex Local CLI           != Codex IDE != Codex Cloud (absent specific evidence)  (surface-bound)
```

A material target change can invalidate assumptions and requires **affected-scope reverification**, not necessarily a full recertification of everything.

A **certification package** (conceptual, no schema) carries: scope, claims, evaluations, evidence, review findings, approved exceptions, limitations, revision identifiers, and result.

```text
Certification != Release        — Release may require Certification, but Certification does not publish anything.
Certification != Promotion      — a Candidate may be evaluated/certified within a scope without having been promoted.
Promotion != Certification      — an approved/promoted change may still require certification before release.
```

### Phase certification (preserved exactly)

`phase-<phase>-certified` tags point to an exact approved SHA. `tools/release/phase-close.ts` preserves: main branch, clean worktree, origin exists, `HEAD == origin/main`, `HEAD == approved SHA`, no existing local or remote tag, fresh typecheck/validate/test, and `git diff --check` — confirmed directly against the current implementation, unmodified.

**`phase:close` is promotion-only.** It never fixes source, commits source, amends, or force-pushes — confirmed directly against the implementation.

### CI evidence and requirement coverage

CI validates typecheck, repository validation, tests, and `git diff --check` — this is not claimed to certify runtime behavior by itself. **Many passing tests != complete requirement coverage.** Certification must center on *important claims/requirements having appropriate evidence*, not test count. If a critical requirement lacks sufficient evidence, **Certification cannot `PASS`**, even if every existing test passes.

### Certification result vocabulary (conceptual, not frozen)

`NOT_EVALUATED`, `IN_PROGRESS`, `PASS`, `FAIL`, `BLOCKED`, `INVALID`, `EXPIRED` — conceptual only, no enum or schema created.

**No `PASS_WITH_APPROVED_EXCEPTION` state is created.** Prefer keeping the base result (e.g. `PASS`) separate from a distinct, explicit record of approved exceptions, so Governance's exception handling (`docs/model/governance-authority.md`) is never silently folded into the result enum. An approved waiver/exception never erases the limitation it covers — the certification package must still show it.

### Expiration, debt, and flakiness

Certification may stop being valid when relevant source changes, the adapter changes, the target changes materially, required evidence becomes stale, or a critical regression appears. **Certification debt** — an important behavior/support claim existing without sufficient current certification evidence — and **Assurance debt** (stale evidence, an uncovered critical requirement, flaky validation, an unsupported claim, a known regression without a guard) are recognized conceptually; neither is persisted or schematized here. Flaky evidence is never resolved by silently "rerun until green" — flakiness reduces confidence and must be investigated.

### Invalid probe, mock, and preflight boundaries (preserved from R0-F/R1)

An `INVALID` probe is never converted into `FAIL` or `PASS` if it did not correctly evaluate its claim. A controlled probe may declare a runtime budget (max harness calls, max children, max provider requests, max mutations); a budget breach can invalidate the probe — no new schema. **A mock proves mock scope, never real target behavior.** **Preflight `PASS` != runtime certification**, especially for concurrency/lifecycle claims. When a claim depends on target runtime/surface/version, its evidence must come from that scope or an explicitly justified equivalence.

## False assurance

A stronger assurance claim than the available evidence supports. Examples: a prompt instruction described as prevention; a unit test described as integration proof; a render success described as deployment success; a mock result described as real target proof; old evidence described as current proof.

## Assurance Minimality and proportionality

**Use the smallest sufficient assurance plan that proves the actual claim.** Do not run a full certification suite for a typo; do not use simple inspection for a runtime security claim. Assurance depth depends on claim, risk, change scope, novelty, uncertainty, and required Governance. Independent review is not required for every task — it is required when Governance, risk, workflow, or certification scope determine it is.

## Assessment

Interpretation of evaluation/review evidence for a decision context. When comparing a Candidate against a baseline, Assessment may conclude `BETTER`, `EQUIVALENT`, `WORSE`, `INCONCLUSIVE` (preserved from `docs/model/learning-evolution.md`). **No new Kind.**

```text
Evaluation → produces evidence against criteria
Assessment → interprets evidence for a decision
```

**Assessment != Evaluation. Assessment != Approval** — Governance retains the decision (`docs/model/governance-authority.md`).

## READY investigation result (see full record in the Authority Audit)

This phase investigated the completion `READY` finding, open since R1-A. Based on converging evidence — `core/schemas/common.schema.json`'s `completionStatus` enum was introduced alongside `core/policies/completion.md`'s narrower 5-state prose in the same original commit (`e953831`), the valid Contract fixture (`tests/fixtures/schemas/valid/contract.json`) is an "Implementation Report" handoff artifact whose `requiredEnvelopeFields` include `status` **and** `next_agent`, and `docs/concepts/contracts.md` already separates a Contract Definition (shape) from a Contract Instance (runtime handoff carrying an actual completion status) — this is classified as resolution path **A**: `READY` is a legitimate pre-terminal handoff/readiness state in the **runtime artifact status vocabulary** used by Contract Instances, distinct from the **final Completion-reporting vocabulary** that `core/policies/completion.md` governs for an agent's own task outcome.

```text
Runtime artifact status vocabulary (Contract Instance, core/schemas/common.schema.json):
READY, PASS, FAIL, BLOCKED, INCOMPLETE, ESCALATION_REQUIRED

Final Completion-reporting vocabulary (core/policies/completion.md, an agent's own Assignment outcome):
PASS, FAIL, BLOCKED, INCOMPLETE, ESCALATION_REQUIRED
```

`READY` means a handoff artifact is prepared and ready for the next step — it is not a terminal outcome of the Assignment itself, which is exactly why `core/policies/completion.md` excludes it. **No schema or Policy change was made.** `docs/schema-system.md` and `docs/concepts/contracts.md` each received one minimal clarifying sentence stating this distinction (see Authority Audit for the exact diff). This resolution is scoped to the documentation layer only; `core/schemas/common.schema.json` and `core/policies/completion.md` remain byte-for-byte unchanged.

**Intake `READY`** (`docs/model/work-lifecycle.md`) remains a separate, third concept — an Intake triage outcome — and is not merged with either vocabulary above.

## Observation complexity and approval taxonomy remain out of scope

**Observation complexity** (`BOUNDED | COMPLEX` schema vs. organizational `TRIVIAL | BOUNDED | COMPLEX`, from R1-D/E) is **not** resolved here and remains **DEFERRED CLARIFICATION**. **Approval taxonomy** (R1-F) is **not** frozen here — no `A0`–`A3` scale is created; this document uses Governance as already defined. No `V0`–`V3` verification enum and no `C0`–`C3` certification enum are introduced, to avoid duplicating the existing E0–E4 evidence-class taxonomy ahead of a dedicated future semantic audit.

## Codex certification direction (documented as a future claim set, not implemented)

A future Codex V1 certification claim set should conceptually cover at least: canonical integrity, adapter translation, generated artifact integrity, installation, runtime loading, Agent behavior, Skill behavior, Capability mapping, Authority/enforcement, Workflow/orchestration, Assurance, Observer/evidence, rollback/removal, regression, and documentation/provenance. **None of this is converted into `evals/` in this phase.**

**Manifest deployment-eligibility** (the open gap already flagged in the C4-B1 independent review and R0's audit) must be resolved before certifying any Installer/deployment claim. The manifest itself is not modified here.

## Certification limitations and cross-harness parity (conceptual vocabularies, no schema)

A certification claim/surface should be able to state `CERTIFIED`, `NOT CERTIFIED`, `OUT OF SCOPE`, or `UNKNOWN` — never implying universal coverage. A future cross-harness parity comparison should compare *semantics*, not file parity, with conceptual results `EQUIVALENT`, `EQUIVALENT_WITH_CONSTRAINTS`, `PARTIAL`, `UNSUPPORTED`, `UNKNOWN`.

## Critical invariants

```text
EXECUTION != VERIFICATION
VERIFICATION != REVIEW
REVIEW != EVALUATION
EVALUATION != APPROVAL
CERTIFICATION != RELEASE
CERTIFICATION != PROMOTION
PROMOTION != CERTIFICATION
EVIDENCE CLASS != RESULT
ENFORCEMENT LEVEL != EVIDENCE CLASS
UNKNOWN != PASS
INVALID != FAIL
FRESH EVIDENCE REQUIRED FOR CURRENT CLAIMS
```
