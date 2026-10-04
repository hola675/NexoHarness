---
apiVersion: nexo/v1alpha1
kind: Directive
metadata:
  id: execution-protocol
  title: Nexo Execution Protocol
  version: 0.1.0
spec:
  summary: Universal logical lifecycle for coding tasks.
  appliesTo:
    - coding-task
---

# Nexo Execution Protocol

**Stable identifier:** `NEP-1`

The Nexo Execution Protocol defines the universal logical lifecycle for coding tasks. Stages are conceptual coordination points, not a mandatory number of agents or user-visible messages.

The protocol does not implement workflow logic in Phase 0.0.5.

## Logical stages

1. **UNDERSTAND** — identify the requested objective, constraints, non-goals and acceptance criteria.
2. **INSPECT** — collect the minimum relevant repository, project and implementation context.
3. **CLASSIFY** — determine task class, risk, complexity, workflow, responsibility and required capabilities.
4. **PREPARE** — choose proportional implementation intention, design or plan.
5. **EXECUTE** — perform authorized work within scope and permissions.
6. **VERIFY** — collect fresh evidence appropriate to the task.
7. **REVIEW** — obtain independent, risk-appropriate review when required.
8. **REPORT** — communicate changes, evidence, failures, risks and blocked items.
9. **OBSERVE** — emit structured signals when observation is enabled, without changing the task outcome.

These stages do not imply nine separate agents, nine messages or full architectural planning for every task.

## UNDERSTAND

Determine:

- requested objective
- constraints
- explicit non-goals, when known
- acceptance criteria, when available

Do not begin implementation from a guessed objective.

## INSPECT

Collect the minimum relevant context, such as:

- repository structure
- existing architecture
- affected files
- tests and validation
- project instructions
- current state
- related implementation patterns

Do not indiscriminately ingest the whole repository.

## CLASSIFY

Determine:

- task class
- risk
- complexity
- required workflow
- required agent responsibility
- required capabilities

Initial complexity model:

- `BOUNDED`
- `COMPLEX`

This phase defines the classification vocabulary only; it does not implement full workflow logic.

## PREPARE

For `BOUNDED` work, a concise implementation intention may be sufficient. For `COMPLEX` work, a structured design or plan may be required. Preparation must be proportional to risk and must avoid ceremonial planning for trivial changes.

## EXECUTE

The authorized agent performs bounded work while respecting scope, permissions, active rules, active workflow and project constraints.

## VERIFY

Collect fresh evidence. Depending on task type, evidence may include:

- tests
- typecheck
- build
- lint
- runtime behavior
- rendered output
- schema checks
- targeted inspection

"No errors noticed" is not verification. Evidence must be generated against the current relevant state.

## REVIEW

Review is conditional according to task risk and workflow. When independent review is required, the implementer must not be considered its own independent reviewer. Review must produce actionable evidence or a clear approval decision.

## REPORT

Report:

- what changed
- what was verified
- what failed
- remaining risks
- blocked items

Do not hide partial failures or imply evidence that was not collected.

## OBSERVE

When observation is enabled, emit structured execution signals to Task Observer. Observation must not alter the task outcome or automatically mutate canonical behavior.

## Fast path

Small, low-risk tasks may use:

```text
UNDERSTAND
→ INSPECT
→ CLASSIFY
→ EXECUTE
→ VERIFY
→ REPORT
→ OBSERVE
```

The fast path remains subject to scope, permissions, evidence and escalation rules. It does not bypass required safety gates.

## Complex path

Complex or higher-risk tasks may use:

```text
UNDERSTAND
→ INSPECT
→ CLASSIFY
→ PREPARE
→ EXECUTE
→ VERIFY
→ REVIEW
→ REMEDIATE if required
→ VERIFY
→ REPORT
→ OBSERVE
```

`REMEDIATE` is a conditional activity inside the complex path, not an additional universal stage. It must remain bounded and may escalate when evidence shows the issue cannot be safely resolved within scope.
