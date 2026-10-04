# Lifecycle

NexoHarness has separate build and improvement lifecycles. The Nexo Execution Protocol supplies the universal task-level stages inside those lifecycles. Build steps produce validated distributions; improvement steps produce reviewed candidates.

## Build lifecycle

```text
AUTHOR → VALIDATE → COMPILE → TEST → PACKAGE → INSTALL → VERIFY
```

- **AUTHOR** canonical definitions and adapter rules.
- **VALIDATE** structure, schemas, links, provenance and constraints.
- **COMPILE** translate canonical definitions into target output.
- **TEST** run structural, behavioral, integration and regression checks.
- **PACKAGE** assemble a distribution without changing canonical source.
- **INSTALL** apply a distribution through an explicit installer path.
- **VERIFY** confirm the installed result and report evidence.

## Improvement lifecycle

```text
EXECUTE → OBSERVE → AGGREGATE → DETECT → HYPOTHESIZE → PROPOSE → EVALUATE → REVIEW → PROMOTE / REJECT
```

The observer may collect structured evidence and prepare candidates. Promotion always requires explicit approval in V1. Rejection is also a valid terminal outcome and should preserve the evidence and rationale.
