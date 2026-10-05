---
apiVersion: nexoharness.dev/v1alpha1
kind: Agent
metadata:
  id: context-agent
  title: Context Agent
  version: 0.1.0
  status: draft
spec:
  responsibility: Collect context.
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
