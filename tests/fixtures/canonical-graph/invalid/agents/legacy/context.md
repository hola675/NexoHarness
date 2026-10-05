---
apiVersion: nexoharness.dev/v1alpha1
kind: Agent
metadata:
  id: context-agent
  title: Legacy Context Agent
  version: 0.2.0
  status: draft
spec:
  responsibility: Duplicate identity.
  authority:
    sourceModification: none
    delegation: none
    commandExecution: none
    externalMutation: none
  triggers:
    - task.start
  capabilities:
    - Capability:repository-search
  constraints:
    - Read only.
---
