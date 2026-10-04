# Enforcement

Enforcement describes how an invariant is communicated, detected or blocked.

- **L1 — Instructional:** prompt or rule guidance tells an actor what to do.
- **L2 — Validation:** static or behavioral checks detect a violation.
- **L3 — Runtime Gate:** the harness prevents or blocks an action.

Prefer enforcement over repeated prompt wording for critical invariants when the target harness supports it. L1 is not equivalent to L3: an instruction does not prove prevention. Adapters must record the strongest level actually available rather than claiming parity.
