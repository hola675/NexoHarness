# R2-A — Capability, Agent, Adapter & Runtime Resolver Diagnostic

- Date: 2026-10-12.
- Baseline: `4c9c556cfa85b252df2511e6afc4b57059899a60` (`main`, synchronized with `origin/main`, clean before this diagnostic).
- Authorization: [R1 internal closure decision](r1-internal-closure-decision.md). R2 is authorized as diagnosis only; implementation/R3 and roadmap changes are not authorized.
- Scope: Capability, Agent, Profile, Adapter, Runtime Resolver, Provider/Binding, and Governance boundaries, including the Core Directive phrase “Adapters and profiles decide how a capability is fulfilled” and the Agent phrase “adapter-resolved provider.”
- Method: direct source inspection of all mandatory sources listed in the R2-A request, including schemas, canonical sources, model/concept documents, accepted ADRs, adapter types/compiler, and prior review records. The code graph was used for `compileCodex` discovery/trace; its coverage signal marked the inspected paths `metadata_changed`, so all material conclusions below rely on direct source, not graph completeness.

## Diagnostic matrix

Status terms describe current reality: **IMPLEMENTED** = present in machine-validated schema or executable source; **CONCEPTUAL** = defined by documentation but no implementation/schema; **DEFERRED** = explicitly postponed; **UNKNOWN** = evidence is insufficient. A concept can have both implemented and conceptual aspects.

| Concept | Responsibility expected | Authoritative source | Current implementation | Discrepancy |
|---|---|---|---|---|
| Agent | Declare bounded responsibility, canonical Capability references, constraints, and dimensional canonical authority. Capability references are needs/relationships, not grants; Agents do not select Providers. | `core/schemas/agent.schema.json:15-34`; `docs/concepts/agents.md:7-21,33-44`; `docs/model/capability-runtime.md:222-224` | **IMPLEMENTED** in schema; `compileCodex` validates and copies Agent capability references into `AgentCandidate.capabilityRefs` (`adapters/codex/compile.ts:250-287`). No production Agent definitions are claimed (`docs/concepts/agents.md:5`). | The wording “adapter-resolved provider” (`docs/concepts/agents.md:40`) attributes provider resolution to the Adapter and is ambiguous against the separate Resolver responsibility. The implemented compiler does not resolve providers. No evidence that Agent references grant authority or access. |
| Capability | Express an abstract operation, expected semantics, and effect without naming a concrete Provider, tool, or permission. | `core/schemas/capability.schema.json:15-21`; `docs/concepts/capabilities.md:5-5,29-49`; `docs/model/capability-runtime.md:38-55` | **IMPLEMENTED** as a registered canonical Kind/schema with name, purpose, effect, and optional input/output contract. Adapter compilation has a target disposition for Capability but no provider mapping (`adapters/codex/model.ts:45-59`). | No material semantic contradiction found. The richer requirement/availability/Provider resolution path is **CONCEPTUAL**, not a present Capability schema contract. |
| Profile | Bundle canonical Capabilities and constraints for an execution context; keep provider configuration, credentials, permission, and authority separate. | `core/schemas/profile.schema.json:15-19`; `docs/concepts/profiles.md:3-16`; `docs/model/profiles-context-configuration.md:224-237,241` | **IMPLEMENTED** as a schema shape and target translation disposition (`adapters/codex/model.ts:45-59`); **DEFERRED** as an executable selection/resolution mechanism. The concept document says no Profile entity currently exists (`docs/concepts/profiles.md:7-16`). | The Core Directive's broad “decide how fulfilled” phrasing can imply a Profile chooses the concrete implementation. Model sources instead say it constrains/bundles requirements and the runtime Resolver selects a Binding. Existing model explicitly classifies this as clarification debt, not a material contradiction. |
| Adapter | Translate canonical semantics into target-specific representations without redefining canonical meaning, inferring authority, selecting runtime providers, or installing artifacts. | Accepted ADR 0004, `docs/decisions/0004-codex-adapter-translation-contract.md:18-31`; `docs/adapters/codex-translation-contract.md` | **IMPLEMENTED** for the Codex compiler: validates selected canonical input, assigns target translation dispositions, records diagnostics, and produces in-memory candidates (`adapters/codex/compile.ts:132-287,454-466`). The general adapter contract is a design boundary. | The phrase “adapter-resolved provider” conflicts with the distinction in the model; compiler source does not select a Provider or Binding. No evidence of authority expansion. |
| Runtime Resolver | Conceptually select a valid, evidence-backed Binding for a Capability Requirement using runtime facts, Profile constraints, compatibility, Governance authority, and runtime Permission. | `docs/model/capability-runtime.md:109-141`; `docs/model/profiles-context-configuration.md:226-237` | **CONCEPTUAL / DEFERRED**. No general Resolver, Provider discovery/registry, Binding schema, Runtime Snapshot schema, permission manager, or runtime selection implementation is claimed (`docs/model/capability-runtime.md:21,84-86,101-122`). | No implementation gap is misrepresented as delivered. The unresolved wording in the Core Directive and Agent concept should not be read as proof an Adapter performs runtime resolution. |
| Provider / Binding | Provider is a concrete runtime mechanism; Binding is an evidence-backed, target/runtime-scoped relationship between it and a Capability. Availability is a runtime fact, not permission or certification. | `docs/model/capability-runtime.md:76-107,135-141,220`; `docs/model/profiles-context-configuration.md:224-237` | **CONCEPTUAL / DEFERRED**. No Provider registry, Provider Kind, Binding Kind/schema, discovery, health monitoring, or configured provider integration is present or claimed (`docs/model/capability-runtime.md:21,84-103`). | No material contradiction found. “Available Provider” does not establish permission, authority, or capability certification. |
| Governance | Authority determines whether Nexo permits an actor's action; runtime Permission determines what the environment allows. Both and an Assignment need are distinct from Capability availability. | `core/policies/precedence.md:23-40`; `docs/model/governance-authority.md:45-53,94-101,124-126`; `core/directives/core-directive.md:88-93` | Canonical Agent authority is **IMPLEMENTED** as four schema dimensions and Codex authority crosswalk diagnostics (`core/schemas/agent.schema.json:18-28`; `adapters/codex/compile.ts:290-401`). Runtime Permission manager/check is **CONCEPTUAL / DEFERRED**; compile input has no runtime permission or Provider-resolution request (`adapters/codex/compile.ts:132-137`). | The inspected sources preserve the distinction. Compiler authority mapping is not proof that runtime Permission is checked, granted, or enforced. |

## Findings

### R2A-01 — Core Directive capability-fulfillment wording

- **Source and location:** `core/directives/core-directive.md:59-74`, especially line 70; `docs/model/profiles-context-configuration.md:224-241`; `docs/concepts/capabilities.md:38-49`; `docs/model/capability-runtime.md:109-122`.
- **Fact checked:** The Core Directive says Adapters and Profiles “decide how a capability is fulfilled.” The model assigns Profiles a capability bundle/constraints, Adapters target translation, and Runtime Resolution concrete Binding selection. The profile model explicitly records this as carried clarification debt and says it is not a material contradiction because the surrounding Core Directive forbids naming providers in canonical behavior.
- **Ambiguity:** “Decide how ... fulfilled” does not say whether a Profile chooses requirements/context or a concrete provider/binding. Read alone, it can collapse translation and runtime selection into Profile/Adapter responsibilities.
- **Architectural impact:** Readers could misunderstand where target mapping ends and runtime resolution begins. No inspected normative rule directly grants provider selection or authority to the Profile or Adapter.
- **Risk:** Low; bounded terminology ambiguity. The explicit runtime model and existing recorded clarification constrain interpretation.
- **Proposed disposition:** `REFINE` (proposal only).
- **Minimum descriptive candidate:** Clarify that Profiles constrain or bundle required capabilities, Adapters translate their semantics to a target, and runtime resolution selects an available compatible Binding.
- **Additional decision needed:** Yes, an approved wording change in an authorized remediation phase. No edit is approved by R2-A.

### R2A-02 — “adapter-resolved provider” wording

- **Source and location:** `docs/concepts/agents.md:33-44`, especially line 40; `docs/model/capability-runtime.md:109-141`; `docs/adapters/codex-translation-contract.md`; `docs/decisions/0004-codex-adapter-translation-contract.md:18-31`.
- **Fact checked:** The Agent concept says Agents use capabilities through an “adapter-resolved provider.” The model explicitly distinguishes `RESOLVER != ADAPTER`; ADR 0004 assigns the Adapter pure, deterministic target translation. `compileCodex` consumes caller-selected canonical input and compiles translation dispositions/candidates; it has no Provider/Binding selection or runtime availability/permission inputs (`adapters/codex/compile.ts:132-137,181-205,250-287,454-466`).
- **Ambiguity:** The phrase can be read as making the Adapter select a concrete Provider. That conflicts with the named conceptual Runtime Resolver responsibility and exceeds the current compiler behavior if interpreted literally.
- **Architectural impact:** It blurs the boundary between target translation and current-runtime provider selection.
- **Risk:** Low; documentation wording only. The model and accepted adapter contract state the separation elsewhere.
- **Proposed disposition:** `REFINE` (proposal only).
- **Minimum descriptive candidate:** Replace the provider-selection implication with wording that the Adapter translates a Capability request and a Runtime Resolver, when implemented, selects a valid Binding.
- **Additional decision needed:** Yes, an approved wording change in an authorized remediation phase. Do not implement during this audit.

### R2A-03 — Agent Capability references and authority

- **Source and location:** `core/schemas/agent.schema.json:15-30`; `docs/concepts/agents.md:14-21,33-44`; `docs/model/capability-runtime.md:222-224`; ADR 0005 `docs/decisions/0005-codex-agent-role-rendering.md:40-45`; `adapters/codex/compile.ts:250-287`.
- **Fact checked:** Agent schema stores Capability references alongside separate authority fields. The Codex compiler copies references to `AgentCandidate.capabilityRefs`; ADR 0005 states these are provenance only and cannot be rendered as tools/providers/permissions.
- **Ambiguity/contradiction:** None found in the inspected sources. The line 40 phrase is tracked separately as R2A-02; it does not establish that a reference itself provisions a provider.
- **Architectural impact:** Preserving this boundary prevents capability need from being mistaken for access or authority.
- **Risk:** No current discrepancy identified; future implementations must preserve the stated boundary.
- **Proposed disposition:** `NO CHANGE` (proposal only).
- **Minimum descriptive candidate:** None indicated by this finding.
- **Additional decision needed:** No additional decision indicated unless a later implementation changes this behavior.

### R2A-04 — Provider availability, Binding, Governance, and runtime Permission

- **Source and location:** `core/policies/precedence.md:23-40`; `docs/model/governance-authority.md:45-53,94-101`; `docs/model/capability-runtime.md:76-107,109-141,200-220`.
- **Fact checked:** The model distinguishes provider availability from Permission, Authority, and certification; resolution cannot expand Authority or grant Permission. Governance says operation use conceptually requires Capability + Permission + Authority + Assignment need. Precedence says a provider exposing an operation does not authorize its use.
- **Ambiguity/contradiction:** No material policy contradiction found. The live implementation does not have Provider or Binding resolution, runtime Permission checks, or an authorization service; this is explicitly deferred, not implemented.
- **Architectural impact:** The distinction is preserved in normative text. Calling the conceptual Resolver or runtime permission check “implemented” would overstate current capability.
- **Risk:** Medium if future callers treat compiler usability or provider availability as runtime authorization; current source does not support that interpretation.
- **Proposed disposition:** `KEEP` (proposal only); preserve the boundary and the deferred status.
- **Minimum descriptive candidate:** None indicated; no implementation candidate is approved.
- **Additional decision needed:** A separate design and implementation authorization is required before creating runtime resolution or permission behavior.

### R2A-05 — Profile scope versus concrete provider selection

- **Source and location:** `core/schemas/profile.schema.json:15-19`; `docs/concepts/profiles.md:3-16`; `docs/model/profiles-context-configuration.md:224-241`; `docs/model/capability-runtime.md:109-122`.
- **Fact checked:** Profile schema contains only capability references and constraints. The Profile model treats it as a reusable capability bundle/constraints consumed by Runtime Resolution. No Profile entity or provider configuration is claimed.
- **Ambiguity/contradiction:** No independent contradiction found. The Core Directive phrase in R2A-01 is the only inspected text that can suggest a Profile decides the concrete fulfillment mechanism.
- **Architectural impact:** Without the role distinction, Profile could be mistaken for a Provider configuration or resolver. Current normative concepts explicitly reject both.
- **Risk:** Low; depends on the broad Core Directive wording.
- **Proposed disposition:** `KEEP` Profile's current conceptual boundary; address only through R2A-01 if wording clarification is later approved.
- **Minimum descriptive candidate:** None separate from R2A-01.
- **Additional decision needed:** Only if an authorized remediation is later proposed.

## Confirmed findings versus inferences

**Confirmed:** Capability, Agent, and Profile schema shapes; canonical Agent authority dimensions; Codex compiler inputs and produced Agent candidate references; current conceptual-only status of Resolver, Provider registry, Binding, Runtime Snapshot, and runtime Permission management; accepted adapter translation boundary; exact phrases reported in R2A-01 and R2A-02; current distinction between Authority and Permission.

**Inferences:** Risk ratings and the possibility that readers could interpret the two phrases as concrete provider selection. These are interpretations of wording, not observed changes to current authority or runtime behavior. The view that the Core Directive is clarification debt rather than a material contradiction is supported by the explicit resolution already recorded in `docs/model/profiles-context-configuration.md:241` and by the other inspected role definitions.

## Proposed dispositions summary

| Finding | Proposed disposition | Approval status |
|---|---|---|
| R2A-01 Core Directive wording | `REFINE` | Proposal only; not approved for editing |
| R2A-02 “adapter-resolved provider” | `REFINE` | Proposal only; not approved for editing |
| R2A-03 Agent Capability references | `NO CHANGE` | Proposal only |
| R2A-04 Provider/Binding/Governance/Permission boundary | `KEEP` | Proposal only |
| R2A-05 Profile scope | `KEEP` | Proposal only |

## Verdict and deferred decisions

**R2-A: PASS — diagnostic record complete; no blocking contradiction found in the inspected scope.** Two low-risk documentation ambiguities merit a later review. This verdict authorizes no remediation.

- The existing `TARGET PRIORITY — DECISION REQUIRED` stays open: repository order remains Codex → Claude Code → Kilo Code, while the explicit strategic direction supplied for the gate was Codex → Kilo Code → Claude. Neither this audit nor the R1 closure approval changes that order or the roadmap.
- Runtime Resolver, Provider registry/discovery, Binding schema, runtime Permission management, and runtime resolution remain conceptual/deferred. No design was adopted here.
- Any wording change or implementation requires a separately authorized remediation phase. R3 and implementation remain unauthorized.

## Sources inspected

All mandatory R2-A sources were inspected directly:

- `core/directives/core-directive.md`; `core/policies/precedence.md`; `core/policies/delegation.md`.
- `core/schemas/agent.schema.json`; `core/schemas/capability.schema.json`; `core/schemas/profile.schema.json`.
- `docs/concepts/agents.md`; `docs/concepts/capabilities.md`; `docs/concepts/profiles.md`.
- `docs/model/capability-runtime.md`; `docs/model/profiles-context-configuration.md`; `docs/model/governance-authority.md`; `docs/model/operations-orchestration.md`; `docs/model/workforce.md`.
- `docs/adapters/codex-translation-contract.md`; `docs/decisions/0004-codex-adapter-translation-contract.md`; `docs/decisions/0005-codex-agent-role-rendering.md`.
- `adapters/codex/model.ts`; `adapters/codex/compile.ts`.
- `docs/reviews/r2-canonical-ontology-entry-inventory.md`; `docs/reviews/r1-independent-architecture-review.md`.

No technical sources, schemas, tests, ADRs, or roadmap files were modified for this diagnostic.