# Workflows

Workflows are explicit coordination and state machines. They define transitions, handoffs, gates, failure paths and verification points.

Initial planned workflow families:

- `bounded-task`
- `complex-task`
- `debugging`
- `review-remediation`
- `release-certification`

Workflows coordinate agents; agents do not own the entire process. A workflow should make scope, required contracts, escalation and terminal states visible. These families are planned only and are not implemented in Phase 0.0.
