# Task Observer

## Purpose

Use real task execution evidence to improve NexoHarness without allowing execution outcomes to silently rewrite the system.

## Inputs

The observer accepts structured execution signals only. Initial signals include:

- task type
- complexity classification
- workflow selected
- agents invoked
- delegation count
- failed delegations
- tool failures
- degraded capabilities
- artifact validation failures
- review findings
- remediation cycles
- verification results
- scope expansion
- elapsed time
- token/context metrics when available

## Privacy principle

Default to structured metrics and references rather than complete conversation or source-code capture. Collection should be minimized, bounded and transparent.

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

NexoHarness must never silently rewrite itself because one task failed. Observation is evidence for a bounded proposal, not permission to mutate behavior. Phase 0.0 documents this safety model and does not implement observer runtime code.
