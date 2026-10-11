# Workflows

Workflows are explicit coordination and state machines. They define transitions, handoffs, gates, failure paths and verification points.

Initial planned workflow families:

- `bounded-task`
- `complex-task`
- `debugging`
- `review-remediation`
- `release-certification`

Workflows coordinate agents; agents do not own the entire process. A workflow should make scope, required contracts, escalation and terminal states visible. The families above remain design candidates, not production Workflow definitions; `workflows/` currently contains no authored Workflow entities. The Phase 0.0 statement records their original planning status, not a claim that they were later implemented.
