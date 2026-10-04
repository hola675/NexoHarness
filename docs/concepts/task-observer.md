# Task Observer

## Purpose

Use real task execution evidence to improve NexoHarness without allowing execution outcomes to silently rewrite the system.

## Inputs

The observer accepts structured execution signals only. An Observation may record optional concepts such as:

- cycle and task identifiers
- workflow reference
- task class and complexity
- execution details
- structured signals
- findings
- optional metrics
- result status
- privacy metadata

Unavailable telemetry remains absent; it is never fabricated.

## Privacy contract

Every Observation declares:

```yaml
privacy:
  sourceContentStored: false
```

`sourceContentStored` is explicit and may be `true` only under a later, separately approved collection policy. Structured metrics and references are preferred over complete conversation or source-code capture.

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
