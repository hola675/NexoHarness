---
apiVersion: nexoharness.dev/v1alpha1
kind: Policy
metadata:
  id: graph-policy
  title: Graph Policy
  version: 0.1.0
  status: draft
spec:
  summary: Valid graph policy fixture.
  appliesTo:
    - validation
  decisions:
    - references resolve
  relatedRules:
    - Rule:scope-rule
---

# Graph Policy
