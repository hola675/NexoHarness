# NexoHarness Evaluation & Quality

Status: ACTIVE. This document explains how NexoHarness frames quality claims and uses evaluations to support them across the system. It is an organizational/system model; it does not implement an evaluation service, define a quality score, or replace:

```text
docs/concepts/evaluations.md
docs/model/assurance-certification.md
docs/model/learning-evolution.md
docs/model/canonical-information.md
core/schemas/evaluation.schema.json
core/policies/evidence.md
core/policies/completion.md
```

Those sources retain their existing technical, evidence, and governance authority. This document introduces no Kind, schema, Policy, registry, directory, or runtime behavior.

## Quality is claim-relative

Quality describes how well a defined target serves its intended purpose within stated requirements, constraints, scope, and context. A quality claim must identify what is being judged and under what conditions; it is never universal by default.

Quality is multidimensional. Relevant dimensions depend on the target and claim and may include correctness, safety and authority preservation, reliability, scope coverage, portability, compatibility, usability, maintainability, performance, and operational cost. This is a reasoning aid, not a frozen taxonomy or a requirement to measure every dimension.

```text
target fitness       != evidence strength
quality              != assurance
quality              != evaluation
quality              != certification
metric               != quality
dimension result     != overall approval
quality measurement  != authority
```

There is no universal NexoHarness quality score. A weighted aggregate must not conceal a failed critical requirement, safety constraint, or known limitation. Evidence strength and outcome remain distinct as defined by [Assurance & Certification](assurance-certification.md).

## How evaluation supports a quality claim

```text
Requirement / Rule / Acceptance Criterion
        ↓
Quality Claim
        ↓
Evaluation Definition
        ↓
Evaluation Run
        ↓
Evidence
        ↓
Assessment
        ↓
Gate / Certification decision when applicable
```

This is a conceptual relationship, not a required workflow or new runtime state machine. An Acceptance Criterion belongs to the task or desired outcome; `Evaluation.spec.passCriteria` belongs to an Evaluation Definition. **Acceptance Criterion != `Evaluation.spec.passCriteria`**, even when an evaluation uses task criteria as evidence targets.

Quality describes desired properties. Assurance establishes confidence in claims about those properties. Evaluation is one way to gather evidence against criteria; Certification is a scoped assurance statement. A Gate is a transition condition that may use evidence from one or more Evaluations. None substitutes for the others.

The existing Evaluation Kind remains the technical definition: `target`, `method`, and `passCriteria`, with optional `evidenceClass`. The five existing methods and their limits remain owned by [`docs/concepts/evaluations.md`](../concepts/evaluations.md) and [Assurance & Certification](assurance-certification.md).

An Evaluation Definition states what will be checked. A run produces runtime or validation evidence; it is not a new Kind. Assessment interprets evidence for a decision and does not replace Evaluation, Review, Approval, Promotion, or Certification. See [Canonical Information](canonical-information.md) for the definition-versus-instance boundary and [Learning & Evolution](learning-evolution.md) for candidate comparison.

## Evaluation design and coverage

Evaluation quality depends on fit between the claim, target, method, criteria, and evidence. Before interpreting results:

- make the target, revision or state, and scope explicit;
- set pass criteria before the run, including prohibited outcomes where relevant;
- choose a method capable of supporting the claim;
- include positive, negative, or boundary cases when those cases matter to the claim;
- preserve limitations, unsupported conditions, and relevant provenance.

A structural result cannot by itself establish runtime behavior; adapter translation does not establish that a target loaded the artifact; a mock establishes only the mock's scope. Claims about runtime behavior require evidence from the relevant runtime or a justified equivalent. These boundaries are detailed in Assurance & Certification.

Coverage is the degree to which important requirements and claims have appropriate Evaluations and current evidence. **COVERAGE != NUMBER OF TESTS.** There is no universal coverage percentage, and `100% tests != 100% quality`. Every important behavioral Rule should eventually have at least one suitable Evaluation, as stated in [`docs/concepts/evaluations.md`](../concepts/evaluations.md). One claim may need multiple Evaluations when its target, risk, or deployment boundary demands different evidence. A critical claim with no adequate evidence remains an assurance gap; unrelated passing results do not close it.

A test is an executable check that may implement an Evaluation Run or support its evidence; it is not the canonical Evaluation Definition. **TEST != EVALUATION DEFINITION.**

For a scoped assessment, useful questions include:

| Question | Quality purpose |
|---|---|
| What requirement or constraint is the claim about? | Prevents unbounded conclusions. |
| Which target, revision, configuration, and conditions were covered? | Makes evidence scope visible. |
| Does the method support this kind of claim? | Prevents method mismatch. |
| Which criteria passed, failed, or remain unknown? | Keeps critical gaps visible. |
| What limitations or exclusions remain? | Prevents evidence from implying broader support. |

This is a reasoning aid; it does not add a claim-matrix schema or replace the conceptual claim matrix in Assurance & Certification.

## Results, aggregation, and decisions

An Evaluation result answers whether its defined criteria were met for its declared scope. It does not state that the target is universally high quality. If a required critical criterion fails, is invalidly evaluated, or remains unsupported, passing results elsewhere cannot produce an unqualified `PASS` for the whole claim set. Insufficient evidence remains `UNKNOWN` or otherwise inconclusive under the applicable assurance process; it is never silently treated as success.

Evidence class describes the nature or strength of support, not the result. A high evidence class does not guarantee a passing outcome, and a passing result on a narrow target does not broaden its scope. Certification, when required, remains a separate scoped assurance statement governed by [Assurance & Certification](assurance-certification.md).

An Evaluation may inform a Governance decision but cannot approve, authorize, promote, or release a change. A favorable result is evidence for a decision, not the decision itself.

## Evaluation gaps and quality debt

An **Evaluation Gap** is a missing or inadequate link between an important requirement or claim and suitable, current evaluation evidence. Examples include `NO_EVALUATION`, `INSUFFICIENT_METHOD`, `INSUFFICIENT_EVIDENCE`, `STALE_EVIDENCE`, `REGRESSION_GAP`, `FLAKY_EVIDENCE`, and `UNTRACEABLE_REQUIREMENT`. These labels are conceptual descriptions, not an enum or schema.

**Evaluation Gap != Quality Failure.** Missing or weak evidence does not prove the behavior is incorrect; it means confidence in the claim is insufficient. An Evaluation may reveal a Quality Failure, but the gap and the property being evaluated are separate findings.

**Quality Debt** is a known deficiency in a desired or required property. **Assurance Debt** is insufficient evidence that the property holds. They are distinct and may coexist: a known defect may also be inadequately evidenced, and an unverified property may turn out to be sound. Neither term creates a Kind.

## Evaluation quality and flakiness

An important Evaluation should be, as applicable, relevant to the claim, traceable to its requirement and target, appropriately scoped, deterministic and reproducible where appropriate, sensitive to the failure it claims to detect, maintainable, and diagnostically useful. Its design should consider false positives and false negatives without introducing universal error-rate metrics.

Repeatedly rerunning until a green result is found is not a valid resolution of unexplained instability. A later `PASS` does not erase earlier unexplained flakiness. Keep instability visible as evidence and, depending on scope and impact, as a Finding or Quality/Assurance Debt. Resolve the cause or report the limitation before relying on the result.

## Quality Gates

A **Quality Gate** is a transition condition based on explicit requirements and evidence. An Evaluation produces a result and evidence; a Gate determines whether a transition proceeds. A Gate may consume several Evaluations and other applicable evidence. **GATE != EVALUATION.** A passing Gate is not itself Certification or Governance approval: **GATE PASS != CERTIFICATION** and **GATE PASS != GOVERNANCE APPROVAL**. **EVALUATION PASS != APPROVAL.** No Gate Kind or new authority is introduced.

## Quality signals and comparison

Metrics and observations can reveal patterns or tradeoffs; they are not quality by themselves. A comparison should use a relevant baseline and comparable scope. The existing conceptual comparison outcomes `BETTER`, `EQUIVALENT`, `WORSE`, and `INCONCLUSIVE` remain as recorded in [Learning & Evolution](learning-evolution.md); this document does not add a result scale.

Interpret a metric alongside the claim, constraints, and evidence. Faster execution, fewer evaluations, lower cost, or higher pass counts do not establish improvement if required verification was skipped, the evaluated scope changed, failures were suppressed, or an invariant was weakened. Preserve the existing principle: **FASTEST != BEST; FEWEST TESTS != BEST.**

Only supported observations may be used as signals. Missing or unavailable telemetry is absent, not a zero or a guessed outcome. Metrics cannot grant authority, relax required assurance, or justify automatic promotion.

## Minimality and boundaries

Use the smallest Evaluation set sufficient to demonstrate the actual claims and risk, consistent with Assurance proportionality. Avoid both ceremonial overtesting and critical undertesting. A documentation-only change does not automatically need a runtime Evaluation; a runtime safety claim cannot be established by prose inspection alone. Required evidence and review remain subject to applicable Policy, workflow, and Governance.

This model does not introduce:

- a scalar quality rating, weighted score, or universal dimension catalog;
- a new Evaluation Run, Quality, Metric, Benchmark, or Assessment Kind;
- new evaluation methods, evidence classes, result enums, or coverage thresholds;
- an evaluation platform, quality dashboard, directory, or required Agent;
- automatic approval, promotion, release, or changes to authority.

## Current repository verification boundary

A passing `npm run verify:core` demonstrates only the current repository gate: typecheck, repository/schema/integrity validation, tests, and `git diff --check`. It does not by itself demonstrate complete runtime behavior, Codex integration certification, or Codex V1. Those claims require their own scoped, appropriate evidence.

## Critical invariants

```text
QUALITY CLAIM != UNIVERSAL CLAIM
QUALITY != ASSURANCE
QUALITY != EVALUATION
QUALITY != CERTIFICATION
METRIC != QUALITY
EVALUATION DEFINITION != EVALUATION RUN
TEST != EVALUATION DEFINITION
ACCEPTANCE CRITERION != EVALUATION.passCriteria
EVIDENCE CLASS != EVALUATION RESULT
COVERAGE != NUMBER OF TESTS
EVALUATION GAP != QUALITY FAILURE
QUALITY DEBT != ASSURANCE DEBT
GATE != EVALUATION
GATE PASS != CERTIFICATION
GATE PASS != GOVERNANCE APPROVAL
EVALUATION PASS != APPROVAL
PASSING COUNT != QUALITY
ASSESSMENT != APPROVAL
EVALUATION != CERTIFICATION
METRIC != AUTHORITY
MISSING SIGNAL != ZERO
```
