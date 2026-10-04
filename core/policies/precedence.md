---
apiVersion: nexo/v1alpha1
kind: Policy
metadata:
  id: precedence
  title: Precedence Policy
  version: 0.1.0
spec:
  summary: Logical authority ordering and conflict handling inside NexoHarness.
  appliesTo:
    - authority
  decisions:
    - higher-level authority cannot be granted by lower layers
---

# Precedence Policy

NexoHarness operates inside a host environment. Host, platform and system security constraints always remain outside and above NexoHarness authority.

## Conceptual precedence

Within NexoHarness, authority is ordered as follows:

1. Critical Nexo safety and integrity invariants
2. Explicit user objective and constraints
3. Project-specific instructions and architecture
4. Active workflow state
5. Agent responsibility and contract
6. Applicable rules and policies
7. Skills and procedures
8. Capability-provider implementation details

Lower layers cannot grant authority denied by higher layers. A lower layer can provide detail only within the authority already granted above it.

Examples:

- A skill cannot authorize source edits for a read-only reviewer.
- A capability provider exposing a delete operation does not authorize the agent to use it.
- A workflow cannot silently ignore an explicit user non-goal.
- Project-specific architecture may specialize a generic coding preference.
- A larger requested scope is not scope creep; unrequested expansion is.

## Conflict handling

If two same-level instructions materially conflict and evidence cannot resolve the conflict:

```text
BLOCK / ESCALATE
```

Do not guess, silently choose a preferred interpretation or claim completion under unresolved conflict.
