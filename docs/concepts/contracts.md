# Contracts

Contracts are structured definitions for handoff artifacts. They make work traceable across agents and workflow states.

Planned contract definitions include:

- Requirement Brief
- Context Brief
- Design Brief
- Implementation Report
- Integration Report
- Review Report
- Remediation Report
- Delivery Report

## Contract Definition versus Contract Instance

A **Contract Definition** describes the shape and constraints of a future artifact. It may declare required envelope fields such as:

```text
cycle_id
task_id
created_by
status
next_agent
```

When a definition constrains completion outcomes, `allowedStatuses` uses only the canonical completion values:

```text
READY
PASS
FAIL
BLOCKED
INCOMPLETE
ESCALATION_REQUIRED
```

A **Contract Instance** is a runtime handoff that fills that shape and carries an actual completion status. The canonical Contract entity is a definition and must not claim a runtime status, a concrete `nextAgentRef` or routing decision.

`CONTRACT` defines data and handoff shape. `WORKFLOW` owns routing and state transitions. `AGENT` owns responsibility.

Phase 0.1 defines the distinction and validates definitions only. It does not build runtime serialization or instance validation logic.
