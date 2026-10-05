---
apiVersion: nexoharness.dev/v1alpha1
kind: Policy
metadata:
  id: wrong-kind-policy
  title: Wrong Kind Reference
  version: 0.1.0
  status: draft
spec:
  summary: Wrong typed reference.
  appliesTo:
    - validation
  decisions:
    - Reject wrong kind.
  relatedRules:
    - Capability:repository-search
---
