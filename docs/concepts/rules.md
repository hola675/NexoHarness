# Rules, Policies and Gates

> **Boundary note:** this document remains TECHNICAL_NORMATIVE for Rule, Policy, and Gate concepts. The current Rule schema is defined by [`core/schemas/rule.schema.json`](../../core/schemas/rule.schema.json). [Evaluation & Quality](../model/evaluation-quality.md) explains evaluation coverage and quality claims; [Evaluations](evaluations.md) and [Enforcement](enforcement.md) retain their respective technical meanings.

- A **principle** is a stable design commitment explaining why the system behaves a certain way.
- A **Rule** is a behavioral invariant represented by the canonical `Rule` Kind.
- A **Policy** is a related set of rules governing a domain such as permissions or provenance.
- A **Gate** is a pass/fail transition condition; it is not itself a Rule, Evaluation, or new Kind.

## Current Rule representation

The Rule schema requires `spec.intent`, `spec.scope`, `spec.severity`, and `spec.requirements`. It optionally permits `spec.exceptions`, `spec.enforcement`, and `spec.evals`. It rejects undeclared fields, and currently has **no `trigger` field**.

- `Rule.spec.enforcement` contains optional references to Enforcement definitions.
- `Rule.spec.evals` contains optional references to Evaluation Definitions.
- **RULE != ENFORCEMENT** and **RULE != EVALUATION**.

A Rule without `evals` remains schema-valid. If an important behavioral Rule lacks suitable Evaluation evidence, record the resulting coverage or assurance gap; do not misclassify it as a schema failure.

## Historical `trigger` proposal

The initial Rule concept listed `trigger` as a possible future field. The Rule schema introduced in commit `e953831` omitted it and disallows undeclared fields. The reviewed ADRs and Rule fixtures do not establish whether an explicit Rule trigger remains a future architectural requirement. **Current field status: absent. Future intent: CLARIFICATION (R2/R3).** Do not treat `trigger` as a current Rule property or add it to the schema in this phase.
