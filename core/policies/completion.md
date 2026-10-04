# Completion Policy

Completion states are explicit:

- `PASS`
- `FAIL`
- `BLOCKED`
- `INCOMPLETE`
- `ESCALATION_REQUIRED`

Completion requires:

- the objective was evaluated
- acceptance criteria were addressed
- applicable verification was performed
- known failures and risks were reported
- no evidence was fabricated

`PASS` cannot be returned solely because implementation was written. If verification is unavailable or the objective is only partially satisfied, report the corresponding non-pass state.
