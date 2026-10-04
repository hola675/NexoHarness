# Execution Model

NexoHarness uses progressive disclosure across the full runtime architecture. Future agents should not load the entire canonical pack into every task.

## ALWAYS-ON

The small universal context includes:

- Nexo Core Directive
- critical safety and integrity policies
- execution protocol summary
- project-level instructions required by the host harness

The always-on layer establishes authority, scope, evidence and lifecycle expectations. It does not define a specialist responsibility.

## CONDITIONAL

Load according to the task and active workflow:

- workflow definition
- agent contract
- applicable rules
- relevant skills
- profile
- capability requirements
- task-specific project context

Conditional context should be selected from the objective, classification, risk and current state. It should be the minimum useful set, not the entire repository or all available procedures.

## PROVIDER / RUNTIME

Resolve only when needed:

- concrete tools
- MCP servers
- plugins
- CLI integrations
- model or provider implementation details

Provider and runtime details fulfill abstract capabilities. They do not redefine canonical behavior or grant authority.

## Loading principle

Progressive disclosure applies to the full runtime architecture, not just skills:

```text
ALWAYS-ON → CONDITIONAL → PROVIDER / RUNTIME
```

A missing conditional or provider capability must be reported and handled through graceful degradation, an allowed fallback or a blocked state. Context reduction must never hide required constraints or verification evidence.
