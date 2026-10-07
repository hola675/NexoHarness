# NexoHarness Workforce

Status: ACTIVE. This document defines the organizational Workforce: Divisions, Roles, Competencies, Assignment responsibilities, and temporary Work Units, and their boundary with the technical `Agent` Kind.

**Organize around stable responsibility, not around prompts, tools, phases, or convenient agent names.**

It depends on, and does not modify:

```text
core/schemas/agent.schema.json
core/policies/delegation.md
core/directives/execution-protocol.md
docs/concepts/agents.md
adapters/codex/model.ts
adapters/codex/render-agent-roles.ts
```

**R1-J defines Workforce semantics; it does not migrate an existing Agent template.** `agents/` holds only `.gitkeep`: no production Agent exists in canonical source. The only Agent instances in the repository are schema and integrity test fixtures (all named `context-agent`) and bounded Codex probe material. No Agent, Role, Competency, Division, or Work Unit entity or schema is created here, and the technical Kind `Agent` is not renamed.

## Workforce

The organizational system of Roles, Competencies, and temporary Work Units used to perform NexoHarness work. Workforce owns organizational responsibility. It does not own runtime orchestration, Governance, Assurance, or provider resolution, although it interacts with all of them.

**WORKFORCE != LIST OF AGENT FILES.** A Role can exist organizationally without immediately needing a technical Agent.

```text
NEXOHARNESS WORKFORCE
│
├── Engineering
│   ├── Backend Engineer
│   └── Frontend Engineer
│
├── Product & Design
│   ├── Product Planner
│   ├── UX/UI Designer
│   └── Design Reviewer
│
└── Editorial
    ├── Content Planner
    ├── Writer / Editor
    └── Editorial Reviewer

System functions outside Workforce divisions:
Governance / Operations / Assurance /
Experience / Learning / Evolution
```

## Division

A conceptual grouping of related Roles and Competencies (`docs/model/vocabulary.md`). **No Kind, no schema, no `divisions/` directory.** The three founding Divisions from [the Charter](charter.md) are preserved: **Engineering**, **Product & Design**, **Editorial**.

**DIVISION != ROLE.** System functions — Operations, Governance, Assurance, Experience, Learning, Evolution — are **not** Divisions and are not departments with automatic Agents. No Governance Division and no QA Division are created: Assurance can be a dynamic, independent responsibility rather than an org-chart unit.

A Division boundary never blocks collaboration: Engineering may work with Product & Design or Editorial without any transfer of structural authority. A Lead Division may exist as conceptual Assignment metadata (`docs/model/operations-orchestration.md`); it does not automatically determine the Lead Role.

## Role

A stable organizational responsibility representing a durable class of work or accountability. A Role is not a model, prompt, Agent configuration, provider, tool bundle, Profile, permission bundle, or workflow stage.

```text
ROLE != AGENT ABSOLUTELY
ROLE != AUTHORITY
ROLE != COMPETENCY
```

- **Role → Agent:** a Role *may* be represented by an Agent, only when an executable identity adds value.
- **Role → Authority:** a title grants no action (`docs/model/governance-authority.md`).
- **Role → Competency:** a Role owns responsibility; a Competency describes ability. One Role needs several Competencies; one Competency can support several Roles.

**Role before Agent.** The correct order is `persistent responsibility → Role → need for executable identity? → Agent candidate` — never `target supports subagents → invent Agent → invent Role around it`.

A Role's responsibility must be stable enough to survive an individual Assignment, a specific model, a specific target harness, and a specific provider. Every Role must be able to answer: what does it own, what does it not own, when is it needed, which Competencies support it, what does it hand off, and how is its output reviewed.

### Role lifecycle

- **New Role gate.** Before creating a Role, ask: does an existing Role already own this responsibility? Is this a routing problem, a Knowledge gap, a Skill/procedure gap, a Competency gap, a Workflow problem, or a temporary Assignment responsibility? Is the need durable and distinct? Only then does a new-Role proposal follow.
- **Durable need.** No Role is created for one unusual task, one failed execution, one target-specific mechanism, one tool integration, or one reviewer finding.
- **Value test.** An additional Role must deliver more value than its cost in coordination, handoffs, context, maintenance, evaluation, and adapter support.
- **Role gap.** A persistent responsibility the organization needs that no existing Role owns sufficiently — distinct from a routing failure, temporary workload, or a missing Capability.
- **Split** when a Role accumulates two stable distinct responsibilities, conflicting independence needs, unmanageable Competency breadth, or persistent routing ambiguity. **Merge** when responsibilities substantially overlap, handoff overhead exceeds value, or distinct identity has no evidence-backed benefit. **Retire** when the responsibility disappears, moves durably elsewhere, or becomes fully procedural/automated — always under Governance.

Evolution may propose merge, specialize, retire, or simplify; growth does not mean only adding (`docs/model/learning-evolution.md`).

## Competency

A demonstrated organizational ability to perform a class of work, supported by Skills, Knowledge, Capabilities, and Assessment evidence. **No Kind.**

```text
COMPETENCY != SKILL
COMPETENCY != CAPABILITY
```

The conceptual maturity scale from `docs/model/knowledge-experience.md` (`CANDIDATE`, `EXPERIMENTAL`, `PROVISIONAL`, `PROVEN`, `MATURE`, `DEPRECATED`) remains a future conceptual model only — no schema, and never a source of Authority.

A **Competency gap** (a Role failing repeatedly for lack of ability) may justify training, a new Skill, new Knowledge, or specialization *before* a new Role.

## Train before hiring

Preserved from [the Charter](charter.md):

```text
understand → reuse Knowledge → improve routing → train existing Role
→ improve Competency → add Competency → add Role if justified
→ add Division exceptionally
```

**TRAIN BEFORE HIRING.** "Training" here means improving Knowledge, Skills, routing, Evaluation, and context — not fine-tuning model weights. The development verbs from `docs/model/learning-evolution.md` apply:

```text
TRAIN       — improve an existing Role through Knowledge, Skill, procedure, routing, or context
DEVELOP     — increase the maturity or breadth of an existing Competency
SPECIALIZE  — create a narrower specialization within a stable responsibility when evidence warrants (may eventually become a Role, never automatically)
HIRE        — create a new organizational Role, only after the new Role gate
```

## Founding Workforce candidates

These eight names are **organizational Role candidates and the initial Workforce model**. They are not eight approved Agent entities.

**8 ROLE CANDIDATES != 8 AGENT ENTITIES.**

| Division | Role | Stable responsibility | Dedicated Agent required now? |
|---|---|---|---|
| Engineering | Backend Engineer | Backend application/service implementation and integration; no provider or framework implied | NOT YET ESTABLISHED |
| Engineering | Frontend Engineer | Frontend implementation and client-side integration; no framework implied | NOT YET ESTABLISHED |
| Product & Design | Product Planner | Translate product intent into bounded requirements and acceptance criteria; not a project-manager super-role | NOT YET ESTABLISHED |
| Product & Design | UX/UI Designer | Interaction and interface design satisfying product and usability requirements | NOT YET ESTABLISHED |
| Product & Design | Design Reviewer | Review design quality and coherence against requirements; no general system approval authority | NOT YET ESTABLISHED |
| Editorial | Content Planner | Plan content purpose, structure, and audience alignment | NOT YET ESTABLISHED |
| Editorial | Writer / Editor | Produce and refine content within an approved brief | NOT YET ESTABLISHED |
| Editorial | Editorial Reviewer | Independent or domain review of editorial quality and requirement compliance; no canonical approval authority by title | NOT YET ESTABLISHED |

"NOT YET ESTABLISHED" is deliberate: this phase does not decide implementation. No `agents/<role>.*` file is created.

**Design Reviewer** and **Editorial Reviewer** are the only founding Roles whose stable responsibility is review. That does not create a generic Reviewer Role. No **Backend Reviewer** or **Frontend Reviewer** is created for symmetry; Assurance may select review responsibility dynamically, and a specific reviewer Role needs future evidence.

### Concerns that are not founding Roles

- **Accessibility** — initially Competencies, Rules, Skills, and Evaluation criteria across relevant Roles; future evidence may justify a specialization.
- **Security** — handled through Rules, Policies, Skills, Assurance, and specialist Assignment responsibility until evidence justifies a Role. No Security Agent or Division.
- **Database** — a possible future database Profile does not create a database Role. `PROFILE != ROLE` (`docs/model/profiles-context-configuration.md`).
- **Cloud/vendor** — no vendor-based Role (e.g. a "Cloudflare Engineer" or "AWS Agent") without persistent-responsibility evidence.

### System responsibilities that are not Workforce Roles

```text
ORCHESTRATOR != AGENT                       (docs/model/operations-orchestration.md)
CONTEXT ASSEMBLY != AGENT                   (docs/model/profiles-context-configuration.md)
TASK OBSERVER != WORKFORCE AGENT BY DEFAULT (docs/model/learning-evolution.md)
```

No Orchestrator, Context, Governance, Assurance, Learning, Memory, or Evolution Agent is created. The `context-agent` name in test fixtures and in the frozen [C4-C R5-F2 probe](../../research/codex/probes/c4c-runtime-r5-f2-0.160.0.md) is fixture and target-runtime material; it does not establish a Context Agent Workforce Role.

## Agent

A canonical executable actor contract (`docs/concepts/agents.md`, `core/schemas/agent.schema.json`, both unchanged). An Agent provides a stable technical identity, responsibility, triggers, authority, Capability references, constraints, and optional handoff, failure-behavior, and verification expectations.

- **Agent != model.** No `GPT-x Agent`, `Claude Agent`, or `Codex Agent` identity derived only from a model or target.
- **Agent != target role file.** Codex `[agents.<role>]` is a target representation, not a source of truth. The Codex renderer's separation (role prose advisory, capability refs provenance-only, no authority grants; `ROLE != AUTHORITY`, `CAPABILITY != TOOL`, ADR 0005) is preserved; `adapters/codex/render-agent-roles.ts` is unchanged.
- **Capability references** in an Agent describe needs and relationships, never grants (`docs/model/capability-runtime.md`).
- **Authority** keeps exactly four dimensions — `sourceModification`, `delegation`, `commandExecution`, `externalMutation`, each `none`/`scoped`/`allowed`. No dimension is added.
- **`Agent.spec.responsibility`** describes the actor's responsibility; an organizational Role can span more context than one Agent implementation, so they are not automatically the same identity.

```text
Organizational Role
      ↓ optional technical representation
Canonical Agent
      ↓ adapter
Target Agent / actor mechanism
```

**The target mechanism does not define the organization:** Codex custom roles do not determine Workforce structure.

### Agent creation gate

Before a future Agent is created for a Role, demonstrate that:

1. an independent executable identity is useful;
2. the responsibility is stable;
3. target delegation or routing benefits from the identity;
4. the behavior cannot be represented sufficiently by Workflow, Skill, or context alone;
5. distinct contracts or handoffs exist where needed;
6. the behavior can be evaluated;
7. its authority can be expressed safely in the existing four dimensions.

A Role can exist without an Agent: a Product Planner responsibility can be used in planning with no `Agent:product-planner`.

### Agent and Role lifecycles are separate

A Role may remain while its Agent implementation changes, or remain with no dedicated Agent at all. One Role could be a dedicated Agent on Codex and a shared actor plus Skill/Workflow on Claude Code, as long as semantics are preserved. **Cross-harness Role parity** compares responsibility, authority, handoffs, and expected behavior — never the number or names of agent files or the target mechanism.

## Execution Responsibility Archetypes

`docs/concepts/agents.md` historically listed five "planned roles". Checked against its own content, they describe how an actor participates in execution, not organizational Roles. They are reclassified as **Execution Responsibility Archetypes**: conceptual, no Kind, no directory, no enum.

**EXECUTION RESPONSIBILITY != ORGANIZATIONAL ROLE.**

| Historical term | New classification | Permanent Workforce Role? | Notes |
|---|---|---|---|
| Primary/core | Archetype: the actor holding the primary responsibility for a bounded Assignment or central execution responsibility | No | Related to Lead Role and `OWNER`, but not identical to either |
| Specialist | Archetype: a participant contributing focused expertise to an Assignment | No | Either a temporary Assignment responsibility or a property of a specialized Role; never a generic permanent "Specialist" Role |
| Reviewer | Review responsibility within Assurance/Workflow | No (by default) | Performed by a domain Role, a dedicated reviewer Role (Design/Editorial Reviewer), or an independent technical Agent, depending on the Assignment |
| Remediator | Temporary bounded responsibility for resolving Findings | No | "Fix the finding, not everything nearby." The original implementer may remediate if independence requirements allow; no separate Agent is always needed |
| Verifier | Verification responsibility | No | Automated, implementer, or independent verification depending on Assurance. `VERIFICATION != REVIEW`, so Verifier responsibility != Reviewer responsibility, though one actor may do both if Governance allows |

**REVIEWER RESPONSIBILITY != APPROVAL AUTHORITY.** A Reviewer may find a problem without having authority to approve promotion, change a Policy, or expand scope (`docs/model/governance-authority.md`).

## Assignment Responsibility

Temporary responsibility an actor holds within one Assignment — conceptually `OWNER`, `CONTRIBUTOR`, `REVIEWER` (from `docs/model/operations-orchestration.md`), possibly combined with remediation, verification, or specialist contribution. These are operational responsibilities, not organizational Roles.

```text
Backend Engineer → OWNER        (Assignment 1)
Backend Engineer → CONTRIBUTOR  (Assignment 2)
Backend Engineer → REVIEWER     (Assignment 3, if Governance and independence allow)
```

A Role does not fix an Assignment position forever: no "Frontend Engineer is always the implementer" or "Design Reviewer is always the reviewer," even though stable responsibility influences routing.

Every non-trivial Assignment should have **one primary responsibility owner** for coherence — which does not imply a permanent Primary Agent. The **Lead Role** (the Role primarily responsible for keeping an Assignment coherent) is a runtime relationship, not a new Role.

**LEAD ROLE != PRIMARY AGENT TYPE.** They may coincide in one execution; they are not the same ontological identity.

## Work Unit and staffing

A Work Unit is a temporary collaboration structure for one Assignment. **WORK UNIT != PERMANENT TEAM.**

```text
Request
→ Assignment
→ required responsibilities
→ required Competencies
→ Role selection
→ Agent representation when necessary
→ smallest sufficient Work Unit
```

**Minimum sufficient Workforce:** use the fewest participants necessary to preserve responsibility, quality, independence, and delivery — no multi-agent work for show. If one Role or Agent can complete the work with the required Assurance, one actor is enough. Form a multi-role Work Unit only for a distinct responsibility, an independence requirement, a specialized Competency need, or parallelizable independent work.

**Dynamic staffing.** A Work Unit may change during an Assignment when a new risk, gap, finding, or scope-approved need justifies it; record the reason. Adding an existing participant is not creating a new Role.

**Competency-based staffing.** Routing considers responsibility fit, required Competencies, scope, evidence, availability, and independence — not the Role name alone.

### Independence

When Assurance requires independence, the creator/implementer is not the reviewer. An organizational reviewer Role does not guarantee independence by itself: independence also depends on the actual actor, session, context, and participation in the Assignment. An independent reviewer receives requirements, the result, relevant evidence, review criteria, and necessary project context — not the implementer's private reasoning by default (`docs/model/profiles-context-configuration.md`).

### Handoffs

Workforce uses a Contract/Handoff only for significant transfers of responsibility or artifacts — not every message or event. Conceptual initial handoff families (no Contract entities are created): **Product Brief**, **Design Brief**, **Editorial Brief**, **Backend Integration**, **Review Finding**, **Delivery Evidence**. For example, a Product Planner may hand a Product Brief to a UX/UI Designer or to Engineering; this is an illustration, not a frozen universal flow — a specific Workflow defines routing.

## Performance, learning, and statelessness

Role and Agent definitions remain **stateless definitions**: no historical performance is written into a Role concept or an Agent entity. Historical execution performance belongs to Experience, Knowledge, and Assessment (`docs/model/knowledge-experience.md`).

Shared Runtime may recommend "Role A historically works better for task class X," but that never changes the Role definition, never grants authority, and never becomes a global leaderboard: performance evidence serves routing and gap diagnosis only.

Experience may capture the Role selected, Assignment class, handoffs, delegations, findings, remediation, and outcome, to diagnose Workforce design. Task Observer may *propose* a Role split, merge, new Competency, new Skill, new Role, or retirement — it can never promote any of them (`docs/model/learning-evolution.md`).

## Roadmap Phase 3 interpretation

`ROADMAP.md` lists `3.0 Core agent architecture`, `3.1 Context`, `3.2 Planning`, `3.3 Implementation`, `3.4 Review`, `3.5 Remediation`, `3.6 Verification`, `3.7 Specialists`. These lines use execution responsibility categories that must be reconciled with this Workforce model before Phase 3 implementation. `ROADMAP.md` is not changed here.

Phase 3 should not be executed as one Agent per roadmap line. Each line should instead go through: `evaluate responsibility → choose organizational Role → apply Agent creation gate → implement the minimum sufficient actor model`.

| Roadmap line | Does not automatically mean | May map to |
|---|---|---|
| 3.1 Context | a Context Agent | Context Assembly responsibility |
| 3.2 Planning | a Product Planner Agent | Role responsibility, a Workflow stage, or a Skill |
| 3.3 Implementation | a generic Implementer Agent | the responsibility of the Role that owns the work |
| 3.4 Review | a generic Reviewer Agent | review responsibility (domain Role, dedicated reviewer Role, or independent Agent) |
| 3.5 Remediation | a Remediator Agent | bounded remediation responsibility |
| 3.6 Verification | a Verifier Agent | verification responsibility (automated, implementer, or independent) |
| 3.7 Specialists | uncontrolled Agent proliferation | specialist Assignment responsibility, specialization, or — after the gates — a Role |

## Deferred and known notes

- **Agent concept vs. schema wording (CLARIFICATION, new in R1-J).** `docs/concepts/agents.md` lists "inputs", "output contract", and "permissions" as Agent contract elements. `core/schemas/agent.schema.json` has no `inputs` or output-contract field (only an optional free-text `handoff`), and it has dimensional `authority`, not `permissions`. The documentation was clarified, without any schema change, to mark inputs/output contract as conceptual expectations and to state that authority is canonical while runtime Permission remains separate. Whether inputs or an output Contract reference should become schema fields is deferred to R2/R3.
- **Roadmap Phase 3 interpretation (CLARIFICATION).** See above; `ROADMAP.md` is unchanged.
- **Core Directive capability wording** (R1-H/I) remains a CLARIFICATION.
- **Approval-level taxonomy versus change-size taxonomy** (R1-F) remains open.
- **Observation complexity** (R1-D/E) remains **DEFERRED CLARIFICATION**.
- **Completion `READY`** (R1-G) and the **`cloudflare` profile candidate** (R1-I) remain resolved and are not reopened.

## Critical invariants

```text
DIVISION != ROLE
ROLE != AGENT ABSOLUTELY
ROLE != AUTHORITY
ROLE != COMPETENCY
COMPETENCY != SKILL
COMPETENCY != CAPABILITY
WORKFORCE != LIST OF AGENT FILES
EXECUTION RESPONSIBILITY != ORGANIZATIONAL ROLE
REVIEWER RESPONSIBILITY != APPROVAL AUTHORITY
VERIFICATION != REVIEW
WORK UNIT != PERMANENT TEAM
LEAD ROLE != PRIMARY AGENT TYPE
8 ROLE CANDIDATES != 8 AGENT ENTITIES
ORCHESTRATOR != AGENT
CONTEXT ASSEMBLY != AGENT
TASK OBSERVER != WORKFORCE AGENT BY DEFAULT
TRAIN BEFORE HIRING
```
