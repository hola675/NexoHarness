# Continuous Improvement Architecture

## Governed lifecycle

This document elaborates the existing improvement boundary in `docs/lifecycle.md` and `core/policies/self-improvement.md`; it does not establish a competing promotion process.

```text
EXECUTION
→ STRUCTURED OBSERVATION
→ AGGREGATION
→ PATTERN
→ HYPOTHESIS
→ IMPROVEMENT PROPOSAL
→ CANDIDATE
→ EVAL
→ REGRESSION COMPARISON
→ INDEPENDENT REVIEW
→ EXPLICIT APPROVAL
→ PROMOTION
```

The autonomous evidence path may observe, measure, aggregate, detect, hypothesize, propose, generate isolated candidates, evaluate and compare. The candidate-to-canonical transition requires independent review and explicit approval. Rejection is a valid outcome; preserve its evidence and rationale for future evaluation.

## Three kinds of learning

### Operational learning

Structured evidence may affect runtime ranking, recommendations or selection among choices that are already allowed by canonical policy and explicit instructions. For example, after 14 comparable tasks, Workflow A may show 85% success and 2.4 average remediation cycles while Workflow B shows 96% success and 0.7 cycles. The Orchestrator may prefer B for an equivalent future task only if B is already allowed, project instructions do not conflict and required evidence remains satisfied. This adaptation stays inside the [Adaptation Envelope](shared-runtime.md#permitted-influence-adaptation-envelope) and cannot expand authority.

### Project and workstyle learning

Relevant project or workstyle patterns may shape selected context and preferences. They remain advisory, scoped and subordinate to explicit user instructions, project architecture and canonical constraints. Project content is not copied across project boundaries.

### Canonical improvement

Changing NexoHarness's intended behavior requires a proposal, evaluation, regression comparison, independent review, explicit approval and governed promotion. Operational success does not itself authorize a canonical change.

These categories have different authority. They should not all be described as self-modification.

## Task Observer boundary

Task Observer has two logical responsibilities: **Evidence Observation** and **Improvement Analysis**. It does not own task execution, assign execution authority, grant permissions or perform canonical promotion. The Orchestrator may consume admissible learned runtime state; the Observer produces evidence and proposals for that separate control plane.

## Future observation signal families

These are future concepts, not additions to the current Observation schema.

- **Task:** class, complexity and risk when available.
- **Execution:** workflow, agents used, delegation, remediation and fallbacks.
- **Outcome:** completion state, verification result and review findings.
- **Efficiency:** duration, validation and test duration, repeated validation, unnecessary delegation, duplicate work and retries.
- **Context:** missing, excessive when measurable, stale or repeatedly retrieved context.
- **Capability:** missing capability, degradation and fallback.

Unavailable telemetry remains absent. Do not fabricate observations or measurement.

## Multi-objective efficiency and assurance

Evaluate correctness, quality, evidence strength, latency, context cost when available, delegation cost, remediation cost and verification cost. **FASTEST != BEST** and **FEWEST TESTS != BEST**. The goal is to meet required correctness and evidence while minimizing unnecessary work.

Never improve a metric by deleting slow tests, skipping required checks, suppressing failures, avoiding required independent review, falsely classifying a task as bounded, reducing evidence requirements, hiding remediation or disabling telemetry to make performance appear better. Optimization candidates must preserve acceptance, safety and assurance requirements.

## Cross-harness evidence and telemetry needs

Future adapters conceptually expose task start/end, workflow identity when available, responsibility or agent identity when available, capability request and outcome, verification result, delegation/fallback/remediation counts when available, duration, failures and target identity. This is an abstract contract only. Target-specific signals must be normalized before they influence shared runtime decisions.

No event transport, database, telemetry collector, target-specific telemetry implementation or runtime Observer is introduced in Phase 0.3.
