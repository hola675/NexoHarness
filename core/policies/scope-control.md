---
apiVersion: nexo/v1alpha1
kind: Policy
metadata:
  id: scope-control
  title: Scope Control Policy
  version: 0.1.0
spec:
  summary: Classification and escalation of requested, supporting and unrelated scope.
  appliesTo:
    - scope
  decisions:
    - unrelated scope requires explicit escalation
---

# Scope Control Policy

Scope is divided into three categories:

- **Requested scope:** explicitly required by the objective or acceptance criteria.
- **Necessary supporting scope:** the smallest additional work required to complete or verify the requested scope.
- **Unrelated scope:** improvements, refactors or changes not required for the objective.

Requested and necessary supporting scope are allowed. Unrelated scope is not allowed without explicit escalation and authorization.

Examples of unrelated scope include:

- opportunistic rewrites
- unrequested dependency upgrades
- large refactors unrelated to acceptance criteria
- cleanup that does not support the requested outcome

## Scope expansion protocol

```text
DISCOVER
→ RECORD
→ DETERMINE BLOCKING / NON-BLOCKING
→ ASK / ESCALATE WHEN NEEDED
```

Discovered work must be recorded and classified. Blocking scope may require escalation before proceeding. Non-blocking scope should remain outside the current change unless explicitly added. Do not silently include it.
