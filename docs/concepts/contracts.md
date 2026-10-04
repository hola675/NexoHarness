# Contracts

Contracts are structured handoff artifacts. They make work traceable across agents and workflow states.

Planned contracts:

- Requirement Brief
- Context Brief
- Design Brief
- Implementation Report
- Integration Report
- Review Report
- Remediation Report
- Delivery Report

Every future runtime artifact should be traceable with:

```text
cycle_id
task_id
created_by
status
next_agent
```

Planned statuses:

`READY` · `PASS` · `FAIL` · `BLOCKED` · `INCOMPLETE` · `ESCALATION_REQUIRED`

Phase 0.0 defines the vocabulary only; it does not build runtime serialization or validation logic.
