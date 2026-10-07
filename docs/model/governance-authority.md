# NexoHarness Governance & Authority

Status: ACTIVE. This document provides the organizational/system framing for **who may decide and act, within what boundary**, without allowing capability, confidence, tooling, or successful execution to manufacture authority.

**This document explains Governance; it does not replace it.** It depends on, and does not override, modify, or duplicate with incompatible semantics:

```text
core/policies/precedence.md
core/policies/delegation.md
core/policies/scope-control.md
core/policies/self-improvement.md
core/policies/evidence.md
core/policies/completion.md
core/directives/core-directive.md
core/schemas/agent.schema.json
core/schemas/policy.schema.json
core/schemas/enforcement.schema.json
core/schemas/improvement-proposal.schema.json
```

It grants no runtime permissions, modifies no Policy, and changes no schema.

## Governance

Governance determines who may make which decisions, under which scope, with which constraints, evidence, and approval requirements. Governance defines boundaries, resolves authority, requires approvals, and controls exceptions and promotion. **Governance does not execute work itself.**

**GOVERNANCE != AGENT.** No `Governance Agent`, `governance/` directory, or `governance.schema.json` is created here.

## Governance hierarchy

```text
Charter
→ Policy
→ Standard
→ Control
```

This organizational hierarchy is **not a 1:1 technical Kind mapping**:

- **Charter** — identity, mission, and constitutional principles ([`charter.md`](charter.md)). Does not substitute for the Core Directive, a Policy, or a schema.
- **Policy** — the existing technical Kind for reusable normative decisions (`core/schemas/policy.schema.json`: `summary`, `appliesTo`, `decisions`, optional `relatedRules`). Not modified here.
- **Standard** — a normalized expectation describing how a policy or quality objective should be satisfied. **No `Standard` Kind is created.** A Standard may be materialized technically as a Policy, a Rule, documentation, or an Evaluation, depending on its nature.
- **Control** — a mechanism that advises, detects, gates, or prevents violation of a governed expectation. When formalized technically, a Control may relate to `Enforcement` (`core/schemas/enforcement.schema.json`: levels `L1`/`L2`/`L3`). **Control != Enforcement absolutely** — some Controls remain procedural, review-based, or approval-based without ever becoming a technical `Enforcement` entity.

## Authority

Authority is the right to make a decision or perform an action within an explicit scope. **Authority is never deduced from** Capability, Skill, Competency, confidence, experience, provider availability, or tool availability.

**Stable authority formula (preserved from `docs/model/vocabulary.md`):** Capability enables an operation. Competency supports effective performance. Authority permits a decision or action. Governance defines the boundary.

### Authority sources (conceptual, no schema)

A valid Authority may conceptually originate in: the Charter, a Policy, an approved Role/Agent definition, an approved Assignment delegation, or an explicit authorized human/user decision.

### Authority scope (conceptual, no enum frozen)

```text
ORGANIZATION
PROJECT
DIVISION
ROLE
ASSIGNMENT
OPERATION
```

### Authority duration (conceptual, no schema)

```text
STANDING
CONTEXTUAL
TEMPORARY
ONE_TIME
```

## Core non-equivalences

```text
RESPONSIBILITY != AUTHORITY
CAPABILITY != AUTHORITY
PERMISSION != AUTHORITY
PROVIDER != AUTHORITY
REVIEW != APPROVAL
EVALUATION != APPROVAL
APPROVAL != PROMOTION
DELEGATION CANNOT CREATE AUTHORITY
LOWER LAYERS CANNOT GRANT AUTHORITY DENIED ABOVE
PROMOTION REQUIRES GOVERNANCE
```

### Responsibility versus Authority

A Role may be responsible for an outcome without unlimited permission for every related operation. **Responsibility != Authority.**

### Permission versus Authority

```text
Permission → the environment/runtime permits an operation
Authority   → Nexo Governance permits the actor to use it
```

A single operation conceptually requires all four: **Capability + Permission + Authority + Assignment need.** That a tool exists does not imply Permission; that Permission exists does not imply Authority.

### Agent authority (preserved exactly)

`core/schemas/agent.schema.json`'s dimensional authority model — `sourceModification`, `delegation`, `commandExecution`, `externalMutation`, each an `authorityMode` (`none`/`scoped`/`allowed`) — is preserved exactly. **Role != Agent authority.** A Role's name never implies authority; only an Agent's explicitly declared dimensions do.

## Decision rights

For a significant decision, distinguish conceptually: `DECIDES`, `CONTRIBUTES`, `REVIEWS`. **No full RACI model and no new schema is introduced.**

**Review != decision authority.** A Reviewer may find a problem without having authority to approve promotion, change a Policy, or expand scope. **Verification PASS != approval.** **Evaluation != Approval** (preserved from `docs/model/learning-evolution.md`).

## Delegation

`core/policies/delegation.md` remains the normative authority; this section only explains its authority relationship, without restating its full text.

```text
delegated authority <= delegator authority
child authority      <= delegated authority
```

Delegation cannot create authority that did not already exist above it. A delegation remains bounded (objective, scope, context, expected output, completion condition — per the Policy). Delegation transfers bounded work; it never removes the parent's accountability for integration and reporting.

## Explicit authorization

Sensitive actions require explicit authorization when Governance determines it is required. Authorization is never inferred from: silence, a passing test, high confidence, an available credential, or a previous similar task.

### Approval

Explicit, scoped, and traceable authorization for a governed transition or action.

```text
Proposal  → asks for a change
Approval  → permits the governed next transition
Promotion → the actual governed transition
```

**Approval != Proposal. Approval != Promotion.** A proposal is not a request already granted; an approval is not the promotion itself.

### Protected changes (conceptual, not yet machine-enforced)

Changes conceptually requiring reinforced Governance: Charter, Policies, critical Standards, canonical authority, Role creation/removal, permission expansion, provider/integration enablement, credential-handling policy, structural architecture, and release promotion. No machine-enforced list is created here.

**Human/governance approval (V1 direction, preserved).** Protected canonical changes require explicit human/governance approval before promotion. No approval UI or actor is designed here.

### Approval taxonomy intentionally not frozen

This document does **not** introduce an approval-level enum (e.g. `A0`/`A1`/`A2`/`A3`). `docs/model/learning-evolution.md` already defines a conceptual change-size vocabulary (`LOCAL`/`BOUNDED`/`STRUCTURAL`/`CONSTITUTIONAL`); whether approval levels need an independent taxonomy from change size is left to a later semantic audit. **Change size != approval authority**, even though the two are likely correlated.

## Exception and Waiver

**Exception** — explicit authorization to deviate from a normal governed expectation within a bounded scope. It does not invalidate the underlying Policy.

**Waiver** — may be modeled conceptually as a documented exception with scope, reason, authority, duration, risk, and conditions. **No new Kind.** Waivers must not silently become new permanent rules: prefer bounded, traceable, expiring/reviewable waivers. Accepting a risk does not make the risk disappear — it must remain visible.

**Emergency authority**, if it exists in the future, must be minimal, bounded, time-limited, logged, reversible where possible, and reviewed afterward. **Not implemented here.**

## Project Governance

A project may specialize, narrow, or add project-specific constraints within superior Governance. It may never silently weaken a protected Nexo safety/integrity invariant, or grant authority denied above it (`core/policies/precedence.md`'s "lower layers cannot grant authority denied by higher layers").

## Precedence (authoritative elsewhere, cited here)

`core/policies/precedence.md` retains its exact current order unchanged:

```text
1. Critical Nexo safety and integrity invariants
2. Explicit user objective and constraints
3. Project-specific instructions and architecture
4. Active workflow state
5. Agent responsibility and contract
6. Applicable rules and policies
7. Skills and procedures
8. Capability-provider implementation details
```

This document does not copy an alternative version of that list. The Governance hierarchy above (`Charter → Policy → Standard → Control`) describes Governance *structure*; `core/policies/precedence.md` describes practical instruction/authority resolution *during execution*. **These are not competing taxonomies.** When two same-level instructions materially conflict and evidence cannot resolve it, the Policy's `BLOCK / ESCALATE` rule applies unchanged.

## Adapter, Provider, and Credential boundaries

```text
ADAPTER TRANSLATES AUTHORITY
ADAPTER DOES NOT INVENT AUTHORITY
```

A target offering a function does not mean Nexo authorizes its use. `Provider != Authority source` — a Provider supplies an implementation. Runtime may report a capability as available, denied, or unknown, but this never redefines Governance.

A target-specific constraint can only reduce what is executable, never expand what Nexo Governance permits:

```text
effective executable authority <= Nexo authorized authority
```

A generated target artifact represents approved semantics; it does not create authority by existing. A future Installer may apply authorized configuration, but may never silently expand permissions, enable credentials, or enable Providers without applicable authorization — **no Installer is implemented here.**

**Credentials** are protected runtime/environment state. They must never appear in Agent definitions, Skills, Knowledge, Experience, generated public manifests, or research records — except as non-secret references to a requirement. **Credential availability != authority.**

## Learning/Evolution boundary (preserved from R1-E)

Task Observer, Learning, and Evolution may identify an authority gap, propose an authority change, or evaluate candidate behavior — they may never grant authority themselves. `PROMOTION REQUIRES GOVERNANCE`; approval must precede promotion where required. Modifying canonical source under Governance still requires an authorized Assignment/action, applicable authority, required evaluation/review, and required approval, depending on the change type.

**Canonical promotion != release publication.** Release adds further gates (`docs/versioning.md`); Distribution/Release reconciliation is deferred to a later phase.

## No authority through performance, confidence, or support

```text
good historical performance    != more authority   (no governance leaderboard)
HIGH confidence                 != permission, != authority
MATURE Competency                != automatic expanded authority
NATIVE target capability support != authorization
```

## Authority and permission gaps

When necessary authority is missing: `AUTHORITY_GAP` — never silently widened; instead `BLOCK / ESCALATE / request approval` per applicable Governance. **`AUTHORITY_GAP` != `PERMISSION_GAP`** — authority can exist without runtime permission, and permission can exist without authority.

## Governance evidence

Important governed decisions must be traceable to: the decision, its scope, its authority source, relevant evidence, and approval where required. **No storage design is introduced here.**

## Least Authority Principle

Grant no more authority than is necessary for the bounded responsibility and Assignment. This is stated as a principle; **no Policy is modified to encode it in this phase.**

## Enforcement boundary (unchanged)

`docs/concepts/enforcement.md`'s L1 (Instructional) / L2 (Validation) / L3 (Runtime Gate) levels are unchanged. Governance may require a given level; Enforcement represents how that requirement is materialized or controlled — the two remain distinct responsibilities.

## Deferred and known notes

- **Completion `READY`** (Policy vs. schema, from R1-A/B/C) remains **DEFERRED**; untouched here.
- **Observation complexity vocabulary** (from R1-D/E) remains **DEFERRED CLARIFICATION**; untouched here.
- **Approval-level taxonomy versus change-size taxonomy** is newly identified as a question for a later semantic audit (see "Approval taxonomy intentionally not frozen" above) — not resolved in this phase.
- Assurance depth (verification levels, certification states, review-finding severity, certification packages) is explicitly deferred to a future phase (`docs/model/assurance-certification.md`, currently PLANNED).
