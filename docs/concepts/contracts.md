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

When a definition constrains completion outcomes, `allowedStatuses` uses only the canonical runtime artifact status values:

```text
READY
PASS
FAIL
BLOCKED
INCOMPLETE
ESCALATION_REQUIRED
```

`READY` denotes that a Contract Instance (a handoff artifact) is prepared and ready for the next step — it is a pre-terminal handoff state, not a terminal Assignment outcome. This is why `core/policies/completion.md`'s completion-reporting vocabulary, which governs how an agent reports its own Assignment's outcome, is a strict 5-value subset that excludes `READY` (see [Assurance & Certification](../model/assurance-certification.md)).

A **Contract Instance** is a runtime handoff that fills that shape and carries an actual completion status. The canonical Contract entity is a definition and must not claim a runtime status, a concrete `nextAgentRef` or routing decision.

`CONTRACT` defines data and handoff shape. `WORKFLOW` owns routing and state transitions. `AGENT` owns responsibility.

Phase 0.1 defines the distinction and validates definitions only. It does not build runtime serialization or instance validation logic.
