# Rules, Policies and Gates

- A **principle** is a stable design commitment explaining why the system behaves a certain way.
- A **rule** is a behavioral invariant that can eventually be represented and checked as structured data.
- A **policy** is a related set of rules governing a domain such as permissions or provenance.
- A **gate** is a pass/fail condition that controls a transition or action.

A future rule representation should support:

```text
id
version
intent
scope
severity
trigger
requirements
exceptions
enforcement
evals
```

Rules should identify how violations are detected and what evidence is expected. Phase 0.0 does not implement the schema.
