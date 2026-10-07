# NexoHarness Vocabulary

Status: ACTIVE. This is the authority for **organizational and cross-layer terminology** — terms that describe NexoHarness as a system/organization, and how organizational concepts relate to technical canonical Kinds. It does **not** replace the detailed technical semantics already owned by [`docs/concepts/`](../concepts/) or [`docs/terminology.md`](../terminology.md)'s technical entries; where this document and a technical document both mention a term, the technical document remains authoritative for that term's enforced/schema-validated behavior, and this document is authoritative for how the term fits the organizational model.

This document reconciles, but does not delete, [`docs/terminology.md`](../terminology.md); see that file's authority note.

## Terms

| Term | Definition |
|---|---|
| Organization | NexoHarness considered as a whole system of functions, Roles and governed change, as framed by [the Charter](charter.md). |
| Division | A conceptual grouping of related Roles and Competencies (e.g. Engineering, Product & Design, Editorial). Not a canonical Kind, schema, or directory. |
| Role | A stable organizational responsibility. Not a model, a prompt, a tool, a provider, or a permission bundle. |
| Competency | A demonstrated organizational ability to perform a class of work, supported by Skills, Knowledge, Capabilities and Assessment evidence. Not a canonical Kind. |
| Capability | An abstract operation an agent may request, identified separately from its semantic request name (`docs/concepts/capabilities.md`). |
| Provider | A harness-native implementation that supplies a Capability. |
| Request | An explicit ask for an outcome, objective or Capability — the starting input to NEP-1's UNDERSTAND stage. |
| Intake | The organizational act of receiving and classifying a Request before work begins. |
| Assignment | The runtime/control-plane representation of bounded work given to a Role or Agent. Not a canonical Kind today. |
| Work Unit | A temporary collaboration structure created for one Assignment. Not a permanent team; not a canonical Kind today. |
| Operating Procedure | A specialized method for performing work. May be represented in whole or in part by a Skill; not necessarily its own canonical entity. |
| Workflow | Coordination of states, transitions, responsibilities and gates (`docs/concepts/workflows.md`) — not merely "how to perform a technical procedure." |
| Skill | Reusable procedural knowledge (`docs/concepts/skills.md`). Its technical sense is unchanged here. |
| Handoff | The runtime occurrence of transferring work or an artifact between responsibilities. |
| Contract Definition | The canonical description of a handoff artifact's shape and constraints (`docs/concepts/contracts.md`). |
| Contract Instance | A runtime artifact populated according to a Contract Definition, carrying an actual completion status (`docs/concepts/contracts.md`). |
| Charter | The organizational/system constitution ([`charter.md`](charter.md)). |
| Policy | A canonical, cross-cutting operational decision or authority model (`core/policies/*`). |
| Standard | An organizational expectation of quality or behavior. Depending on how formalized it is, it may be represented as a Policy or a Rule — it is not automatically equivalent to either. |
| Rule | A concrete, testable behavioral constraint (`docs/concepts/rules.md`). |
| Control | A mechanism that detects, prevents or limits a specific risk. When formalized technically, a Control maps toward Enforcement. |
| Enforcement | The mechanism and strength (L1/L2/L3) by which an invariant is communicated, detected or blocked (`docs/concepts/enforcement.md`). |
| Knowledge | Validated, contextual information usable for future work. Confers no Authority by itself. |
| Experience Record | A record of what actually happened during execution — the organizational framing of an Observation. |
| Observation | A recorded fact about an execution or outcome (`docs/concepts/task-observer.md`). Not canonical behavior. |
| Pattern | A recurring regularity detected across multiple Experience Records/Observations. |
| Knowledge Candidate | Information derived from Patterns that has not yet been validated as reusable Knowledge. |
| Gap | A recognized difference between desired and actual Competency, Knowledge, or system behavior. |
| Improvement Proposal | A candidate change derived from observations and prepared for evaluation (`docs/concepts/task-observer.md`; schema Kind `ImprovementProposal`). It is not an approved canonical change. |
| Candidate | Any not-yet-promoted unit of proposed change (a patch, a proposal, a hypothesis). Never equivalent to Canonical. |
| Evaluation | A check of structure, behavior, integration or regression (`docs/concepts/evaluations.md`). |
| Assessment | A broader organizational judgment of Competency, quality or readiness, which may draw on one or more Evaluations. Not itself a canonical Kind. |
| Review | An independent check of work against requirements and evidence. Not automatically Verification. |
| Certification | An explicit, evidence-based declaration that a phase, release or component meets its required bar (e.g. a `phase-*-certified` tag, `docs/versioning.md`). Not automatically Promotion. |
| Promotion | Explicit approval and movement of a Candidate into canonical behavior (`core/policies/self-improvement.md`). |
| Profile | A named bundle of Capabilities and constraints for a context (`docs/concepts/profiles.md`). Not a Role and not Authority. |
| Context | The relevant task, project, or repository state gathered before acting (NEP-1 INSPECT). |
| Configuration | Concrete settings that parameterize a Profile, Capability Provider or target adapter. |
| Adapter | A translator from canonical definitions to a harness-native representation. Not an Installer. |
| Generated Artifact | An output produced from canonical source and not edited manually. Not Canonical. |
| Installer | The future component that detects, reconciles and applies Generated Artifacts to a target environment. Not the Adapter. |
| Runtime | Current execution and observed operational state, as opposed to intended (Canonical) definitions. |

## Critical non-equivalences

```text
Division != Role
Role != Agent absolutely
Role != Authority
Competency != Skill
Competency != Capability
Capability != Tool
Capability != Provider
Capability != Permission
Capability != Authority
Provider != Capability
Assignment != Workflow
Operating Procedure != Workflow
Skill != Workflow
Handoff != Contract Definition
Contract Definition != Contract Instance
Policy != Rule
Standard != Rule absolutely
Control != Rule
Control maps technically toward Enforcement when appropriate
Experience != Knowledge
Observation != canonical behavior
Knowledge != Governance
Evaluation != Assessment
Review != Verification
Certification != Promotion
ImprovementProposal != approved canonical change
Candidate != Canonical
Profile != Role
Profile != Authority
Profile != Permission
Adapter != Installer
Generated != Canonical
Installed != Certified
```

None of these are schema changes. They are organizational-language boundaries so that Charter/Vocabulary prose is never read as redefining a canonical Kind, a Policy, or an accepted ADR.

## Organizational concept to current technical representation

Mapping describes the current closest technical representation. **Mapping is not identity** — an organizational concept may be partially, provisionally, or not yet represented technically.

| Organizational concept | Current technical relationship |
|---|---|
| Role | Usually represented through an Agent, when executable representation is required (`docs/concepts/agents.md`). |
| Competency | Supported by Skills + Knowledge + Capabilities + Assessment evidence. No dedicated Kind. |
| Operating Procedure | Often represented through a Skill (`docs/concepts/skills.md`). |
| Workflow | Workflow (`docs/concepts/workflows.md`) — direct correspondence. |
| Handoff (structure) | Contract Definition (`docs/concepts/contracts.md`). |
| Handoff (occurrence) | Runtime Contract Instance. |
| Standard | Often a Policy or Rule, depending on how formalized its semantics are. |
| Control | Enforcement, when formalized technically (`docs/concepts/enforcement.md`). |
| Assessment (expectation) | Evaluation (`docs/concepts/evaluations.md`). |
| Experience (evidence) | Observation (`docs/concepts/task-observer.md`). |
| Evolution (proposal) | ImprovementProposal (schema Kind). |

## Assurance vocabulary

Verification, Review, Evaluation, Assessment and Certification are related but distinct:

- **Verification** — collecting fresh evidence appropriate to a specific claim (NEP-1 VERIFY).
- **Review** — an independent party checks work against requirements and evidence (NEP-1 REVIEW).
- **Evaluation** — a structural, behavioral, adapter, integration or regression check (`docs/concepts/evaluations.md`).
- **Assessment** — a broader judgment that may draw on one or more Evaluations.
- **Certification** — an explicit, evidence-based declaration that a defined bar was met (e.g. a phase certification tag).

No new enum is introduced here. These remain descriptive distinctions, not a replacement for `core/policies/completion.md`'s or `core/schemas/common.schema.json`'s existing status vocabularies.

## Governance vocabulary

```text
Charter
→ Policy
→ Standard
→ Control
```

This is an organizational governance model, not a direct 1:1 replacement for current technical Kinds, and it does not change `core/policies/precedence.md`.

## Authority formulation

**Capability enables an operation. Competency supports effective performance. Authority permits a decision or action. Governance defines the boundary.**

## Canonical versus Runtime

- **Canonical** — the intended, authorized system definition.
- **Runtime** — current execution and observed operational state.

Runtime observation never redefines Canonical intent by itself (`core/policies/self-improvement.md`).

## Research versus Generated

- **Research** — evidence and investigation (`research/`, `docs/research/`).
- **Generated** — derived target representation (`dist/`, adapter output).

Neither is canonical input automatically.

## Known deferred conflict: completion `READY`

`docs/reviews/r1-documentation-authority-audit.md` recorded a CONFLICT between `core/policies/completion.md` (5 completion states) and `core/schemas/common.schema.json`'s `completionStatus` enum (6 states, including `READY`). This document does not resolve that conflict. Where Completion needs to be mentioned here, it is described conceptually (see "Assurance vocabulary" above) without asserting a definitive enum. The conflict remains **DEFERRED**.

## No new canonical nouns

This document does not assert that NexoHarness now has canonical `Division` objects, `Competency` entities, or persisted `Assignment` records. None of these exist as schema-validated Kinds. They are organizational vocabulary only, pending any future, separately reviewed decision to formalize them.
