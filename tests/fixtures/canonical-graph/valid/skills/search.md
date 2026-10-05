---
apiVersion: nexoharness.dev/v1alpha1
kind: Skill
metadata:
  id: search-skill
  title: Search Skill
  version: 0.1.0
  status: draft
spec:
  purpose: Search relevant files.
  activationConditions:
    - Context is required.
  procedure:
    - Search the repository.
  relatedAgents:
    - Agent:context-agent
---

# Search Skill
