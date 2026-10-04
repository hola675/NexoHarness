# Task Observer

## Purpose

Use real task execution evidence to improve NexoHarness without allowing execution outcomes to silently rewrite the system.

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
