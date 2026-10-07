# Execution Model

> **Authority note:** this document's operational use inside the control loop is reconciled under [`docs/model/operations-orchestration.md`](model/operations-orchestration.md). The full progressive-disclosure context model remains this document's responsibility and is preserved in full here; it is not yet superseded.

NexoHarness uses progressive disclosure across the full runtime architecture. Future agents should not load the entire canonical pack into every task.

## ALWAYS-ON

The small universal context includes:

- Nexo Core Directive
- critical safety and integrity policies
- execution protocol summary
- project-level instructions required by the host harness

The always-on layer establishes authority, scope, evidence and lifecycle expectations. It does not define a specialist responsibility.

## CONDITIONAL CANONICAL CONTEXT

Load according to the task and active workflow:

- workflow definition
- agent contract
- applicable rules
- relevant skills
- profile
- capability requirements
- task-specific project context

Conditional context should be selected from the objective, classification, risk and current state. It should be the minimum useful set, not the entire repository or all available procedures.

## LEARNED CONTEXT

Load only relevant advisory workstyle patterns, project patterns and prior operational evidence from Shared Runtime State. Learned context is non-canonical, subordinate to explicit instructions and policy, and must not be treated as authority. Do not load all learned history into every task. Prefer minimum useful context: **CONTEXT VALUE != CONTEXT VOLUME**.

## TASK CONTEXT

Keep the current objective, active constraints, selected workflow, findings, unresolved items and current evidence available for this execution. Task state is normally ephemeral and expires with the task unless explicitly and safely promoted to another runtime scope.

## TARGET RUNTIME

Resolve only when needed:

- concrete tools
- MCP servers
- plugins
- CLI integrations
- model or provider implementation details

Provider and runtime details fulfill abstract capabilities. They do not redefine canonical behavior or grant authority.

Concrete target execution mechanisms are selected by adapters and must not be guessed before target capability research.

## Loading principle

Progressive disclosure applies to the full runtime architecture, not just skills:

```text
ALWAYS-ON → CONDITIONAL CANONICAL → LEARNED / TASK → TARGET RUNTIME
```

A missing conditional or provider capability must be reported and handled through graceful degradation, an allowed fallback or a blocked state. Context reduction must never hide required constraints or verification evidence.

## Context efficiency

Future observation may identify irrelevant or repeated loading, excessive context size when measurable, missing critical context, stale context and duplicated instructions. Context reduction must preserve all required policy, scope and verification evidence. Token or context optimization is not implemented here.
