# NexoHarness Capability & Runtime

Status: ACTIVE. This document provides the organizational/system model for Capability, Capability Requirement, Runtime, Provider, Capability Binding, Runtime Resolution, availability, degradation, fallback, and observability.

**Nexo defines the need. The adapter translates target semantics. The runtime resolves what is actually available. Governance authorizes the action. Assurance proves what happened.**

It depends on, and does not modify:

```text
core/schemas/capability.schema.json
core/schemas/profile.schema.json
core/schemas/agent.schema.json
core/directives/core-directive.md
docs/concepts/capabilities.md
docs/adapters/codex-translation-contract.md
adapters/codex/model.ts
research/codex/capability-matrix.md
research/codex/gaps.md
```

**This document describes a future runtime responsibility; it does not claim one exists.** No provider registry, runtime resolver, MCP integration, provider discovery, permission manager, `RuntimeSnapshot` schema, `CapabilityBinding` schema, new Capability definition, or Profile change is introduced. The current Phase 1.1 Codex adapter performs translation, authority mapping, enforcement-requirement checks, runtime-dependency recording, diagnostics, and candidate rendering — it does **not** perform general capability resolution, provider registration or discovery, MCP routing, or provider health tracking.

## Decision flow

```text
Role / Assignment
→ Competency need
→ Skill / Procedure
→ Capability Requirement
→ Runtime Resolution
→ Capability Binding
→ Provider / native mechanism
→ Effect
```

Governance applies Authority, Permission, and constraints before any effect is allowed. This preserves `docs/model/operations-orchestration.md`'s "responsibility before tooling": a tool is never selected before the work is understood.

## Capability

A harness-neutral abstract operation NexoHarness may require to perform work. A Capability describes what operation is needed, its abstract effect, and its expected inputs/outputs — never which executable, MCP server, CLI, API, provider, or credential fulfills it. Illustrative semantic names (`repository.search`, `repository.patch`, `command.execute`, `browser.test`, `database.query`, `agent.spawn`, `agent.wait`, `lifecycle.observe`) are examples only; **none is added as a canonical entity here.**

**Identity versus semantic request (preserved).** `Capability:repository-search` is the canonical entity identity; `repository.search` is the abstract operation it names (`docs/concepts/capabilities.md`). They are related, not identical.

**Effect (preserved exactly).** `core/schemas/capability.schema.json` defines exactly four effects: `read`, `local-write`, `external-write`, `destructive`. None is added. **Effect != Enforcement** (effect is the kind of consequence; enforcement is how a boundary is communicated, detected, or blocked). **Effect != Permission** — a `read` effect may still be forbidden, and a `destructive` effect may be authorized inside an explicit Assignment; effect informs Governance, it never replaces it.

**Capability contract (conceptual).** A Capability may be described by identity, semantic name, purpose, effect, input expectations, output expectations, failure semantics, and observability expectations. Only `name`, `purpose`, `effect`, and the optional `inputContract`/`outputContract` are machine-represented today; the schema is not extended here.

```text
CAPABILITY != TOOL
CAPABILITY != PROVIDER
CAPABILITY != PERMISSION
CAPABILITY != AUTHORITY
```

One Provider may offer several Capabilities; one Capability may have several possible Providers. A runtime implementation being able to execute an operation does not mean the operation is permitted, and an available Capability never means the actor is authorized (`docs/model/governance-authority.md`).

## Capability Requirement

A contextual statement that an Assignment or procedure needs a Capability at a given importance level. **No new Kind.** The requirement levels already used by the Codex adapter (`RequirementLevel = "REQUIRED" | "OPTIONAL"` in `adapters/codex/model.ts`) are reused conceptually; they are **not** moved into the Capability schema.

- **REQUIRED** — if it cannot be resolved while preserving its semantics, the result is `BLOCK`, or the Assignment cannot use that execution path. No silent downgrade.
- **OPTIONAL** — may degrade only when degradation is explicitly allowed, and the loss is observable, reported, does not expand authority, and does not violate acceptance criteria.

**No semantic downgrade:** a different operation is never a valid fallback. A fallback must sufficiently preserve the required semantic purpose.

## Runtime

The current execution environment in which canonical requirements are resolved into concrete mechanisms: target harness, surface, version, platform, available native mechanisms and Providers, current permissions, effective target configuration, trust state, provider health, runtime constraints, and observable event channels. **No `runtime/` directory is created.**

**Runtime != Canonical.** Current machine state, provider availability, an installed executable, a logged-in account, or network availability are never canonical behavior.

### Runtime Snapshot

A bounded description of the runtime facts relevant to one resolution or verification decision (target, surface, version, platform, available mechanisms, providers, permissions, configuration, trust state, observation channels). It is evidence/context — **not** a Policy, Profile, Authority, or canonical state. **No `RuntimeSnapshot` Kind or schema is created** (consistent with `docs/model/knowledge-experience.md`'s Runtime Snapshot boundary). Snapshots go stale (a provider process stops, a permission changes, the target upgrades, project trust changes, the network becomes unavailable); a current resolution must use sufficiently fresh information.

## Provider

A concrete runtime implementation capable of satisfying one or more abstract Capabilities — a harness-native mechanism, a local executable, a service integration, an MCP-based implementation, or another runtime component. No category is an architectural requirement.

**Provider is not a canonical Kind.** It currently belongs to target/runtime configuration, unless a future implementation demonstrates a need for stable canonical identity. Provider names stay out of canonical Agents, Skills, and Workflows wherever the need can be expressed as a Capability (Core Directive, "Capability abstraction").

**`PROVIDER != AUTHORITY SOURCE`.** A reliable provider is not an authority source.

### Provider Registry (conceptual)

A runtime/target-scoped inventory of provider implementations known to Nexo. It may conceptually describe provider identity, target/surface, supported capabilities, availability, constraints, effects, evidence, and version — but it does not authorize use. **Not implemented, no schema, and no physical location decided** (no `provider-registry.json`, `providers/`, or `runtime/providers/`).

Two registries exist conceptually, and only the first exists today as a canonical domain:

```text
Capability Registry → canonical semantic operations (capabilities/)
Provider Registry   → runtime/target implementations (conceptual only)
```

**Provider state (conceptual, no enum):** `AVAILABLE`, `UNAVAILABLE`, `DEGRADED`, `FAILING`, `UNKNOWN`. Health may inform resolution, but a transient outage is never recorded as canonical provider incompatibility. Provider compatibility must consider version when material — never assume "provider latest."

### MCP and native mechanisms

MCP remains **one possible Provider mechanism** — not a Capability system, not a canonical dependency, and not required Nexo architecture. This document configures no MCP. A harness-native operation is also a Provider mechanism conceptually; if a target offers a direct native operation, `Capability → native binding` can be sufficient — no artificial wrapper is required.

## Capability Binding

A target/runtime relationship stating that a concrete mechanism is believed to satisfy a Capability under known constraints. **No new Kind.** It conceptually carries: Capability, Provider/native mechanism, target, surface, version, platform constraints, semantic loss if any, evidence/provenance, and availability assumptions.

A Binding is **evidence-backed** — never declared because names sound similar or a tool "seems to do the same thing." Every target Binding is scoped at least to target, surface, and version/range, and to platform when it matters. Bindings may be platform-dependent without making the canonical Capability platform-specific.

**Codex example.** A claim such as "`agent.wait` → Codex internal `wait`" is valid only within its observed evidence scope (Codex CLI 0.160.0, the bounded [C4-C R5-F2 record](../../research/codex/probes/c4c-runtime-r5-f2-0.160.0.md), whose overall verdict remains `INVALID`). It is never elevated to universal canonical behavior.

## Runtime Resolver

A logical runtime responsibility that selects a valid concrete Binding for a Capability Requirement from what is actually available and authorized.

```text
RESOLVER != ADAPTER
RESOLVER != AGENT
```

No `Resolver Agent` is created by default.

- **Inputs (conceptual):** Capability Requirement, Runtime Snapshot, candidate Bindings, Profile constraints, Governance authority, runtime permissions, target compatibility, evidence state.
- **Outputs (conceptual):** a selected binding, a degraded binding, a blocked result, an unknown result, diagnostics.
- **Ordering (conceptual):** `Capability Requirement → Runtime Snapshot → candidate Bindings → semantic compatibility → Governance / Authority → Permission → evidence / target compatibility → select`.

### Resolution states (conceptual, no enum)

```text
FULL      — a sufficiently equivalent binding satisfies the Requirement without material loss
DEGRADED  — only when the Requirement is OPTIONAL and degradation is explicitly allowed (or the Assignment contract explicitly admits that loss); must report what changed, why, and impact
BLOCKED   — a required Capability cannot be satisfied sufficiently, or Authority, Permission, a required Provider, or required enforcement is missing
UNKNOWN   — insufficient evidence that a Binding is adequate
```

`UNKNOWN != unsupported`, `UNKNOWN != available`, `UNKNOWN != PASS`.

### What the Resolver can never do

- **Resolution cannot expand Authority.**
- **Resolution cannot grant Permission.** If a Provider exists but runtime permission does not, the result is `PERMISSION_GAP` — never a bypass attempt.
- **Resolution cannot redefine a Capability.** A missing Provider is never "solved" by substituting a semantically different Capability unless the Assignment explicitly permits that alternative.

**Explainability (conceptual, not implemented).** A resolution should be able to explain: the required Capability, the selected Binding, why it was selected, constraints, degradation, authority/permission result, and evidence state. A resolution may be ephemeral; **no persistence, database, or event-store is designed here.**

## Fallback and retry

**Fallback** — an alternative Binding selected when the preferred Binding is unavailable or unsuitable. It must preserve semantics, authority, permission boundary, effect expectations, privacy constraints, and required observability.

- **No hidden fallback.** Any material fallback must be observable, especially if it changes provider, effect, enforcement, latency, or privacy boundary.
- **Equal-or-more-restrictive rule (preserved from `docs/adapters/codex-translation-contract.md`):** any fallback is equal or more restrictive in effect; none may expand authority.
- **Required capability + advisory-only substitute:** if the requirement needs real execution and only prompt text exists, the result is `BLOCK` — that is never called capability resolution.

```text
Retry    → the same Binding again (after transient failure, within Workflow retry rules)
Fallback → a different Binding for the same Capability Requirement
```

Retry is never automatically converted into fallback, and neither is remediation (`docs/model/operations-orchestration.md`).

## Adapter, Resolver, and Installer boundaries

**The adapter** translates canonical semantics into the representation and compatibility model of one target harness. It may map, compile, render, diagnose, and record target compatibility and constraints. It may describe target-scoped candidate mappings (Capability X → target mechanism Y, classification, constraints, evidence) that later feed Resolution — but it does not substitute for a Runtime Snapshot. It does **not**, by default, discover running services, probe credentials, choose arbitrary live Providers, own runtime health, mutate permissions, own Workflow state, or grant Authority.

**Adapter compilation remains deterministic** (preserved from `docs/adapters/codex-translation-contract.md`): offline, no host discovery, no network-dependent selection, no implicit clocks. A dynamic runtime resolver must never make compiled target-artifact bytes depend on live provider state.

```text
ADAPTER GENERATES
INSTALLER RECONCILES
RUNTIME RESOLVES CURRENT AVAILABILITY
ADAPTER MAPS; RUNTIME RESOLVES
```

**A future installer/doctor** may discover the installed target, configuration, filesystem ownership, provider prerequisites, and runtime compatibility — but never changes a semantic Capability Requirement. Provider discovery, when it exists, is a runtime or installer concern, never canonical authoring.

`CodexCompilation` remains an adapter-internal intermediate representation — not a canonical Kind and not persisted runtime state. Its `runtimeDependencies` field currently records only `Workflow` and `Contract` dependencies that require Nexo runtime; it is **not** extended here. Adapter diagnostics remain adapter/runtime output, not a canonical Kind.

## Taxonomy separation

Six distinct axes exist. They must never be mixed or inferred from one another:

| Axis | Purpose | Current values (preserved exactly) | Owner |
|---|---|---|---|
| Capability effect | Abstract consequence of an operation | `read`, `local-write`, `external-write`, `destructive` | `core/schemas/common.schema.json` (`capabilityEffect`) |
| Research classification | Target evidence/research disposition for a Nexo requirement | `NATIVE`, `NATIVE_WITH_CONSTRAINTS`, `ADAPTER_TRANSLATABLE`, `NEXO_RUNTIME_REQUIRED`, `UNSUPPORTED`, `UNKNOWN` | `research/codex/capability-matrix.md` |
| Adapter translation class | How a canonical Kind is handled by the Codex adapter (canonical → target disposition) | `DIRECT_TRANSLATION`, `COMPOSED_TRANSLATION`, `CONDITIONAL_TRANSLATION`, `NEXO_RUNTIME_ONLY`, `NO_TARGET_ARTIFACT`, `UNSUPPORTED`, `UNKNOWN` | `adapters/codex/model.ts` (`TRANSLATION_CLASSES`) |
| Authority crosswalk | Ability of a target control to preserve a Nexo authority dimension | `STRONG`, `PARTIAL`, `ADVISORY`, `UNREPRESENTABLE`, `UNKNOWN` | `adapters/codex/model.ts` (`AuthorityCrosswalk`) |
| Enforcement strength | Strength of the applicable control | `HARD_ENFORCEMENT`, `RUNTIME_GATE`, `PROMPT_ADVISORY_ONLY`, `NONE_UNKNOWN` | `adapters/codex/model.ts` (`ENFORCEMENT_STRENGTHS`) |
| Runtime resolution | Result for one current Capability Requirement | `FULL`, `DEGRADED`, `BLOCKED`, `UNKNOWN` (conceptual only, no enum) | this document (future runtime responsibility) |

Additionally, `docs/adapters/codex-translation-contract.md` uses a target/runtime **availability** vocabulary (`AVAILABLE`, `UNAVAILABLE`, `DEGRADED`, `UNKNOWN`). It is preserved as availability vocabulary and is **not** a resolution result: `Provider AVAILABLE + Permission denied = Resolution BLOCKED`.

```text
RESEARCH CLASSIFICATION != RUNTIME RESOLUTION   (NATIVE_WITH_CONSTRAINTS != FULL automatically)
TRANSLATION CLASS != RUNTIME RESOLUTION
ADAPTER_TRANSLATABLE != CONDITIONAL_TRANSLATION  (related, but different taxonomy levels)
AUTHORITY CROSSWALK != CAPABILITY RESOLUTION     (STRONG/PARTIAL are never reused as runtime results)
ENFORCEMENT STRENGTH != CAPABILITY AVAILABILITY
```

A Capability may be available while its enforcement is insufficient; in that case a functional mapping may exist and required use may still `BLOCK`. The research matrix spells enforcement strengths with spaces (`HARD ENFORCEMENT`, `PROMPT / ADVISORY ONLY`, `NONE/UNKNOWN`) while `adapters/codex/model.ts` uses identifiers (`HARD_ENFORCEMENT`, `PROMPT_ADVISORY_ONLY`, `NONE_UNKNOWN`); these are the same four values in two notations, not two taxonomies.

## Gap classes (conceptual, not normalized)

Capability-runtime diagnosis uses these classes, consistent with `docs/model/knowledge-experience.md`'s broader gap taxonomy:

```text
CAPABILITY_GAP     — no adequate abstract Capability exists to express the need (not "provider missing")
PROVIDER_GAP       — the Capability exists, but no sufficiently valid/available Provider exists for this target runtime
MAPPING_GAP        — Capability and target mechanism may both exist, but their semantic relationship is not established
PERMISSION_GAP     — mechanism exists and authority may exist, but the environment denies the operation
AUTHORITY_GAP      — mechanism and permission may exist, but Governance does not authorize the operation
OBSERVABILITY_GAP  — the operation can execute, but there is insufficient evidence to observe/verify the required behavior
ENFORCEMENT_GAP    — functional semantics may exist, but the required control cannot be guaranteed at the necessary strength
```

**A gap is not an immediate new Provider.** A failed capability execution may be a bad mapping, a permission issue, an authority issue, or provider health — diagnose before adding an integration. When resolution fails, report the real gap rather than a generic "tool failed."

## Observability and certification

Resolution must consider whether a required effect can be observed, evidenced, and correlated when Assurance needs it. **Execution != Observability** — an operation that can execute is not one Nexo can prove executed correctly. Events, hooks, and logs are possible observability mechanisms; they are neither Authority nor always Enforcement.

**Provider available != Capability certified.** Before certifying Capability X for target Y, the applicable claim must be evidenced for mapping, availability, effect, authority compatibility, permission behavior, enforcement, observability, and failure behavior (`docs/model/assurance-certification.md`). A later certification may conclude conceptually `SUPPORTED`, `SUPPORTED_WITH_CONSTRAINTS`, `UNSUPPORTED`, or `UNKNOWN`; no technical enum is frozen here. A target upgrade can invalidate bindings and availability, enforcement, and observability assumptions, and requires reverification.

## Agent capability references and Profiles

`Agent.spec.capabilities` (`core/schemas/agent.schema.json`) is a list of canonical Capability references: a canonical requirement/relationship — **never** automatic provider injection or an automatic permission grant. The F2 observation that a capability reference did not appear as an escalated tool in the captured child request is preserved only as bounded evidence of this non-escalation, never as global certification.

`Profile` (`core/schemas/profile.schema.json`) bundles Capability refs and constraints. Selecting a Capability in a Profile does not authorize a provider and does not grant permission. Profile composition, activation, context, configuration, and target constraints are deliberately deferred to `docs/model/profiles-context-configuration.md` (PLANNED).

## Portability, credentials, and external effects

- **Cross-harness portability.** A canonical Capability name stays stable even when Codex, Claude Code, and Kilo Code use different mechanisms. **No lowest-common-denominator design:** if a target does not support a Capability, classify the target limitation — never weaken the canonical Capability. Target parity compares semantic effect, constraints, authority preservation, and observability — never tool or file names.
- **Credentials.** Provider credentials are protected runtime state; they never appear in a Capability definition, Profile content, Agent definition, generated public manifest, Observation, or Knowledge. Configuration may conceptually reference "credential required" without storing the secret. Not implemented here.
- **External mutation.** A Provider executing `external-write` or `destructive` effects remains subject to the corresponding Authority, Permission, and Assurance. Availability never bypasses them.
- **Determinism boundary.** Canonical compilation is deterministic; runtime resolution may depend on the current environment. The two are never mixed so that target artifact bytes depend on live provider state during compilation.

## Learned provider ranking

Shared Runtime may eventually rank Providers among valid candidates — only within Governance, Profile constraints, and semantic compatibility (`docs/model/knowledge-experience.md`'s Adaptation Envelope). **Best historical provider != authorized provider.** Provider metrics serve resolution; they never become a global prestige ranking.

## Deferred and known notes

- **Observation complexity vocabulary** (R1-D/E) remains **DEFERRED CLARIFICATION**; `core/schemas/observation.schema.json` is untouched.
- **Approval-level taxonomy versus change-size taxonomy** (R1-F) remains open.
- **Completion `READY`** remains **RESOLVED** (R1-G); no new contradictory evidence was found.
- Provider Registry location, Runtime Snapshot storage, and resolution persistence are all deferred.

## Critical invariants

```text
CAPABILITY != TOOL
CAPABILITY != PROVIDER
CAPABILITY != PERMISSION
CAPABILITY != AUTHORITY
PROVIDER != AUTHORITY SOURCE
AVAILABILITY != AUTHORIZATION
RESOLVER != ADAPTER
RESOLVER != AGENT
ADAPTER MAPS; RUNTIME RESOLVES
REQUIRED MISSING SEMANTICS BLOCK
OPTIONAL DEGRADATION MUST BE EXPLICIT
FALLBACK MUST NOT EXPAND AUTHORITY
RESEARCH CLASSIFICATION != RUNTIME RESOLUTION
TRANSLATION CLASS != RUNTIME RESOLUTION
ENFORCEMENT STRENGTH != CAPABILITY AVAILABILITY
```
