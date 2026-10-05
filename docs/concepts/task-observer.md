# Task Observer

## Purpose and responsibilities

Use real task execution evidence to improve NexoHarness without allowing execution outcomes to silently rewrite the system.

Task Observer has two logical responsibilities: **Evidence Observation** and **Improvement Analysis**. It does not own execution, grant authority, select permissions or promote canonical behavior. The Orchestrator may consume admissible learned runtime state; the Observer provides evidence and proposals for that separate control plane.

## Inputs

The observer accepts structured execution signals only. An Observation may record optional concepts such as:

- cycle and task identifiers
- workflow reference
- task class and complexity
- bounded execution counts and agent references
- declared boolean signals
- findings
- bounded metrics
- result status
- privacy metadata

Execution supports only declared fields such as agent references, delegation count, review cycles, failed tool calls and fallback count. Signals are named booleans. Metrics are limited to duration and optional token counts. Unknown telemetry fields fail validation; future fields require schema evolution.

Unavailable telemetry remains absent; it is never fabricated.

Future observations may also evaluate validation efficiency: validation duration, test-suite duration, test count, failure count, retry count when available, remediation count, repeated validation and unnecessary duplicate work. This is future input only and does not expand the current Observation schema.

Future signal families may include task class, complexity and risk; workflow and responsibility identities; delegation, remediation and fallbacks; completion, verification and review outcomes; duration, repeated validation and duplicate work; missing, excessive when measurable or stale context; and missing or degraded capabilities. Unavailable telemetry remains absent.

## Privacy contract

Every Observation declares:

```yaml
privacy:
  sourceContentStored: false
```

`sourceContentStored` is explicit and may be `true` only under a later, separately approved collection policy. Structured telemetry does not itself authorize source or chat capture. Raw conversations, source dumps, generic payloads and arbitrary extension maps are not Observation fields.

## Observer output

The conceptual output sequence is:

```text
OBSERVATION
PATTERN
HYPOTHESIS
IMPROVEMENT_PROPOSAL
EVAL_CANDIDATE
```

Observer output must not directly modify canonical files.

The Observer analyzes evidence, not execution instructions. Learned runtime patterns are non-canonical recommendations and may only affect already-authorized choices within the Adaptation Envelope.

## Promotion gate

```text
Candidate improvement
→ isolated patch
→ eval
→ regression suite
→ comparison
→ review
→ human approval
→ canonical promotion
```

## Anti-pattern: SELF-EDITING SYSTEM

NexoHarness must never silently rewrite itself because one task failed. Observation is evidence for a bounded proposal, not permission to mutate behavior.
