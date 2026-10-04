---
apiVersion: nexo/v1alpha1
kind: Policy
metadata:
  id: completion
  title: Completion Policy
  version: 0.1.0
spec:
  summary: Explicit completion states and evidence requirements.
  appliesTo:
    - reporting
  decisions:
    - PASS requires applicable verification and no fabricated evidence
---

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
