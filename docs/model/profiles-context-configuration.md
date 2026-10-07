# NexoHarness Profiles, Context & Configuration

Status: ACTIVE. This document provides the organizational/system model for Profile, Context, Context Assembly, progressive disclosure, Configuration, configuration layering and ownership, constraints, defaults, overrides, secrets, and portability.

**Load the minimum context necessary to perform the Assignment correctly, and configure the system only within authority already granted.**

It depends on, and does not modify:

```text
core/schemas/profile.schema.json
core/schemas/capability.schema.json
core/policies/precedence.md
core/policies/scope-control.md
core/directives/core-directive.md
docs/concepts/profiles.md
docs/concepts/capabilities.md
docs/execution-model.md
docs/shared-runtime.md
docs/model/capability-runtime.md
adapters/codex/model.ts
```

**Nothing here is implemented.** No Profile entity, Context Manifest schema, Effective Configuration schema, provider or MCP configuration, secret management, runtime context assembler, configuration resolver, or installer reconciliation is introduced. `profiles/` contains no Profile entities.

```text
PROFILE CONSTRAINS; ADAPTER TRANSLATES; RUNTIME RESOLVES
```

## Profile

A canonical bundle of Capability references and constraints suitable for a recurring execution context. The current semantics are preserved exactly: `core/schemas/profile.schema.json` requires `spec.capabilities` (Capability references) and `spec.constraints` (strings) and nothing else. **The schema is not modified.**

A Profile helps answer *"which capability bundle and constraints apply to this class of work?"* — never *who performs the work*, *who has authority*, or *which concrete tool must be used*.

```text
PROFILE != ROLE         — a Backend Engineer may work under several Profiles; one Profile may serve several Roles
PROFILE != COMPETENCY   — a Profile states execution requirements; a Competency is demonstrated organizational ability
PROFILE != AUTHORITY    — selecting a Profile never widens Agent authority
PROFILE != PERMISSION   — a Profile may require a Capability; that grants no runtime permission
PROFILE != PROVIDER     — a Profile refers to Capabilities, not concrete implementations, wherever the need can be expressed portably
```

A Profile is also not provider configuration: an API key, MCP server, CLI executable, provider account, or provider-specific endpoint is never part of a Profile's fundamental semantics.

### Selection timing and minimality

```text
Assignment
→ Responsibilities
→ Competencies / procedures
→ Capability Requirements
→ Profile selection/composition where useful
→ Runtime Resolution
```

A Profile is never the first step (consistent with `docs/model/operations-orchestration.md` and `docs/model/capability-runtime.md`). **Select the smallest Profile or Profile composition that satisfies the Assignment** — never all capabilities, all providers, or all project integrations by default.

### Composition (conceptual, no Kind, no schema)

`Profile A + Profile B → Effective Profile Composition`, when needed. Composition combines Capability requirements and constraints and never silently drops a constraint. By default, when constraints are compatible, **the more restrictive applicable constraint wins** — a composition rule that does not replace `core/policies/precedence.md`.

When Profiles or configuration produce materially incompatible constraints, the conceptual result is `CONFIGURATION_CONFLICT` — never an arbitrary choice; resolve by precedence/evidence or `BLOCK / ESCALATE`. A composition may be *more* restrictive than its parts; it can never produce more authority than Governance permits.

### Activation and degradation

**Activation conditions** (from `docs/concepts/profiles.md`) are preserved conceptually as *conditions under which a Profile is relevant*; they are not added to the schema. **Activation != Authority** — a condition activating a Profile authorizes no effect. Degradation follows `docs/model/capability-runtime.md` exactly: a required missing Capability `BLOCK`s; an optional Capability degrades only explicitly.

### Adapter mapping

A Profile may have documented target compatibility/mapping, but a target mapping that is merely an implementation detail does not belong in canonical Profile semantics. The adapter keeps the translation: the Codex adapter's `KIND_DISPOSITIONS` maps `Profile → COMPOSED_TRANSLATION` (`adapters/codex/model.ts`), unchanged here. `CodexCompilation.target` remains adapter/runtime target metadata, never Profile identity. An adapter may map a Profile selection to target settings; it never turns target configuration into a canonical Profile definition.

### Profile creation gate

A future Profile requires at least: a stable recurring purpose, a reusable Capability bundle, reusable constraints, a clear activation/use case, and portable semantic value. **No profile proliferation** — first ask whether existing Profiles compose, whether Capabilities plus constraints already represent it, and whether it is really Project Knowledge or Configuration. **Technology-scoped Profile gate** — before creating one, establish that the technology is itself a durable reusable execution domain, that its requirements cannot be represented sufficiently by Capabilities + Project Knowledge + Configuration, that it justifies independent canonical identity, and that multiple targets would consume it meaningfully. If not, do not create the Profile.

No Profile maturity taxonomy is introduced beyond the existing `metadata.status` (`draft`/`experimental`/`stable`/`deprecated`).

### Where technology-specific material belongs

Concrete project technologies normally belong to Project Knowledge (`docs/model/knowledge-experience.md`), Project Configuration, Capability Bindings, or provider/runtime configuration (`docs/model/capability-runtime.md`) — not necessarily to a Profile. A genuinely framework-specific procedure may be a specialized Skill; a Profile must never be used to hide procedural knowledge. Provider-specific configuration stays in target/runtime/provider configuration — never in a Capability or a portable Profile. A canonical Profile maximizes semantic portability, even when adapters produce different target representations.

## Profile candidate audit

`docs/concepts/profiles.md` listed five conceptual names from Phase 0.0. **None exists as a canonical entity** (`profiles/` holds only `.gitkeep`); the only Profile instance in the repository is the schema test fixture `tests/fixtures/schemas/valid/profile.json` (`core-profile`), which is validation evidence, not a published Profile. The classification below is documentary only, not a schema:

| Candidate | Classification | Disposition | Reason |
|---|---|---|---|
| `core` | PORTABLE | RETAIN AS FUTURE CANDIDATE (not promoted) | A baseline capability bundle for generic repository work (e.g. search, edit, command execution, version-control inspection) is distinct from ALWAYS-ON context, which carries directives and policies rather than capabilities. However, its constraints risk duplicating ALWAYS-ON policy; it must pass the creation gate and must not restate always-on directives as Profile constraints. Not every task needs a `core` Profile. |
| `web` | DOMAIN_SCOPED | RETAIN AS FUTURE CANDIDATE | Can express portable web-work needs (e.g. `browser.test`, frontend-related capabilities, web constraints) without naming a framework or provider. |
| `database` | DOMAIN_SCOPED | RETAIN AS FUTURE CANDIDATE | Can express `database.query`, migration-related capabilities, and database constraints without fixing a vendor. |
| `assets` | UNKNOWN | RETAIN AS FUTURE CANDIDATE, PENDING DOMAIN DEFINITION | Potentially a domain Profile for reusable operations over assets, but the repository does not define what "assets" covers; it cannot be classified further without that definition. |
| `cloudflare` | PROVIDER_SCOPED | REMOVE FROM FOUNDATIONAL CANDIDATES | A specific vendor platform, not a portable execution domain. See the decision below. |

### `cloudflare` decision: `REMOVE_FROM_FOUNDATIONAL_CANDIDATES`

Evidence:

- **No dependency exists.** `git grep -i cloudflare` finds the name only in `docs/concepts/profiles.md`'s candidate list. No canonical entity, schema, test fixture, or adapter code depends on it, so removal has no migration impact.
- **It names a vendor, not a need.** The architectural primitive for a portable Profile is abstract Capabilities plus constraints (`core/schemas/profile.schema.json`). A vendor platform belongs to Project Knowledge, configuration, or Capability Bindings.
- **The repository already treats the vendor as non-neutral in canonical source.** `tools/validate/repository.ts` and `tools/validate/harness-neutrality.ts` reject `Cloudflare MCP` in canonical core files as provider-specific behavior.
- **It fails the technology-scoped gate today.** No evidence shows a durable, reusable execution domain that Capabilities, Project Knowledge, and Configuration cannot express.

A future technology-scoped Profile remains possible only with separate evidence, explicit justification, and passing that gate. No other vendor name replaces it — the goal is neutrality, not a different brand.

## Context

Information made available to an actor for the current execution. It may come from canonical source, the Assignment, the project, Knowledge, runtime facts, or the target environment.

```text
Knowledge → information available for reuse
Context   → information selected and loaded for this execution
```

**CONTEXT != KNOWLEDGE** — a Knowledge item can exist without being loaded. This preserves the `CONTEXT_GAP` (relevant information exists but was not loaded) versus `KNOWLEDGE_GAP` (information genuinely unavailable or insufficient) distinction from `docs/model/knowledge-experience.md`.

**CONTEXT != AUTHORITY** — text present in context does not automatically gain authority. It keeps its source, scope, trust, and precedence.

### Context layers (preserved exactly)

```text
ALWAYS-ON → CONDITIONAL CANONICAL → LEARNED / TASK → TARGET RUNTIME
```

- **ALWAYS-ON** — small, stable, high-value: the Core Directive, critical safety/integrity policy, an execution-protocol summary, and required project instructions, depending on the target. Not everything important belongs here; an important but task-specific rule belongs in conditional context. ALWAYS-ON is not filled indefinitely.
- **CONDITIONAL CANONICAL** — selected by objective, task class, risk, Role, Workflow, Profile, and Capability Requirements. **The canonical repository existing is not a reason to load it into every task.**
- **LEARNED** — project Knowledge, workstyle Knowledge, validated patterns; always advisory, scoped, and fresh enough.
- **TASK** — objective, scope, acceptance criteria, active constraints, current findings and evidence, unresolved items, workflow state; normally ephemeral.
- **TARGET RUNTIME** — actual mechanisms, provider state, target configuration, runtime permissions, platform details, loaded only when needed and never placed into canonical context ahead of time.

**CONTEXT VALUE != CONTEXT VOLUME.** The goal is the minimum useful context, not maximum tokens.

### Context Assembly (conceptual, no Kind)

The logical responsibility that selects and assembles the relevant context layers for one Assignment and actor. **Context Assembly != Agent**: no Context Agent is created as a Workforce Role. The Codex technical role named `context-agent` used in earlier probes (e.g. the frozen [C4-C R5-F2 record](../../research/codex/probes/c4c-runtime-r5-f2-0.160.0.md)) is a bounded target/runtime representation derived from a test fixture; it does not establish a permanent Nexo Workforce Role.

- **Inputs (conceptual):** Assignment, Role/Agent responsibility, Workflow state, Profile, applicable canonical source, relevant Knowledge, Runtime Snapshot, context budget.
- **Outputs (conceptual):** an ordered context set with source, scope, and trust metadata, plus diagnostics for omissions or degradation. No schema.

Each relevant item should conceptually keep its source, scope, provenance, freshness, and trust class.

### Trust classes (conceptual, no schema)

`NORMATIVE`, `FACTUAL`, `ADVISORY`, `INFERRED`, `UNVERIFIED`. **Trust != precedence**: a `FACTUAL` item does not outrank a Policy. Trust describes the nature and quality of the information; precedence remains governed by `core/policies/precedence.md`. Derived or inferred context stays marked — `DERIVED/INFERRED != EXPLICIT` (consistent with `docs/model/work-lifecycle.md`).

### Freshness, contradiction, and deduplication

Old learned context is never loaded as a current fact once the repository, target, or configuration has changed. Contradictions are never hidden by deduplication: when two material items conflict, preserve the conflict and resolve by scope, evidence, and precedence, or `BLOCK / ESCALATE`. Safe semantic duplication may be removed, but never at the cost of Governance, scope, provenance, required constraints, or verification requirements.

### Context Budget

A bounded resource allowance for context assembly. **No universal token or byte count is fixed** — targets differ in limits, truncation behavior, and loading semantics, and none of those becomes a canonical constant (the Codex adapter already treats instruction budget as verified target configuration, per `docs/adapters/codex-translation-contract.md`).

Under budget pressure, preserve first: Governance and critical policy, the Assignment objective and scope, Role responsibility, workflow-critical state, required evidence and verification, and required procedural context. Reduce advisory and redundant material first.

**REQUIRED CONTEXT MUST NOT BE SILENTLY TRUNCATED.** If required context does not fit: `BLOCK`, or explicitly choose a supported decomposition — never lose constraints without a diagnostic.

### Reviewer and collaboration context

When independent review requires it, a Reviewer should by default not receive the implementer's private reasoning; it should receive the requirements, the diff or result, relevant evidence, review criteria, and necessary project context (`docs/model/assurance-certification.md`).

Shared Assignment context is distinct from role-local working context; not every local detail is replicated to every participant. Material decisions affecting coordination leave local context and are recorded in Assignment state, a Handoff, a Finding, or evidence, as appropriate.

### Context telemetry

Experience may record observable signals such as missing critical context, irrelevant context, repeated loading, or stale context — not necessarily raw payloads (`docs/model/knowledge-experience.md`). A future **Context Manifest** could help observability and replay, but no Kind or schema is created now.

## Configuration

Parameters and selected values that specialize how NexoHarness or a target operates **within already-authorized semantics**. Configuration never redefines canonical meaning. **CONFIGURATION != GOVERNANCE.**

### Configuration layers (conceptual)

```text
CANONICAL    — defaults and constraints defined by Nexo; never a provider secret
PROJECT      — specializes permitted behavior for one project; may be more restrictive; never weakens superior Governance
RUNTIME      — ephemeral data and selections for one execution; not canonical
TARGET       — harness-specific (Codex, Claude Code, Kilo Code); mapped by adapter/installer/runtime; never contaminates canonical semantics
ENVIRONMENT  — OS, installed version, filesystem paths, environment capabilities; not canonical
SECRET       — credentials and secret values; always separated from every other layer
```

### Effective configuration ordering

```text
Governance boundary
→ canonical configuration
→ project specialization
→ Assignment/runtime selection
→ target representation
→ environment availability
```

This ordering explains how configuration specializes; **it does not replace `core/policies/precedence.md`**, which still governs authority and instruction conflicts.

**LOWER CONFIGURATION CANNOT EXPAND AUTHORITY** — lower configuration can never grant what higher Governance denies. **Target option availability != authorization**: a Codex setting existing does not authorize Nexo to enable it (`docs/model/governance-authority.md`).

### Secrets

**SECRETS NEVER BECOME CANONICAL PROFILE DATA.** API keys, tokens, passwords, and private keys are never stored in a Profile, Agent, Skill, Knowledge, Experience, generated public artifact, or research record. Configuration may refer to a *credential requirement* without containing the secret. No secret provider is designed here.

### Ownership (conceptual, prepares the installer phase)

`NEXO_OWNED`, `USER_OWNED`, `SHARED`, `TARGET_MANAGED`, `UNKNOWN`. Ownership means who is responsible for managing configuration semantics and content — **not** operating-system file permissions. **Unknown ownership: do not overwrite.**

### Effective Configuration (conceptual, no Kind, no schema)

The derived result after applying relevant configuration layers within Governance boundaries. It should be explainable: source layer, selected value, overridden value, reason, constraint, and target mapping. A future Effective Configuration artifact may help a doctor, debugging, or reproducibility, but none is created now.

### Defaults, sensitive gaps, drift, and overrides

- **Defaults** are documented, safe, deterministic, and never authority-expanding.
- **Sensitive missing configuration** — if required configuration is missing for an authority-sensitive, security-sensitive, or external-mutation operation, prefer failing closed.
- **Configuration drift** — the difference between expected managed configuration and actual current configuration. **Drift does not authorize automatic overwrite.** Future installer principle (not implemented): `detect drift → classify ownership → plan reconciliation → mutate only when authorized`, consistent with `docs/adapters/codex-translation-contract.md`'s collision-preserving installer boundary.
- **Target overrides** may exist when truly necessary; they are declared non-portable and target-scoped, and never weaken protected Governance.

**Portability classes (conceptual):** `PORTABLE`, `TARGET_SPECIFIC`, `ENVIRONMENT_SPECIFIC`.

## Schema gate

A new schema for Context, Context Manifest, or Effective Configuration is created only if a future implementation demonstrates independent identity, a persistence need, a validation need, and replay or diagnostic value — never merely because vocabulary exists. **No configuration god-object:** no single entity mixes Profile, Context, Provider, Permissions, Secrets, target settings, and Runtime Snapshot.

## Boundary table

| Concept | Owns |
|---|---|
| Profile | reusable capability bundle + constraints |
| Context | information loaded for execution |
| Knowledge | reusable supported information |
| Runtime Snapshot | current runtime facts |
| Configuration | parameter specialization within authorized semantics |
| Provider Binding | concrete capability implementation |
| Authority | what action is permitted |
| Permission | what the runtime allows |
| Adapter | target translation |
| Installer | environment reconciliation |

Context consumes Knowledge but does not redefine its lifecycle (`docs/model/knowledge-experience.md`). A Profile contributes a capability bundle and constraints that a Runtime Resolver consumes; the resolver model is not reopened (`docs/model/capability-runtime.md`).

## Deferred and known notes

- **Core Directive wording debt (CLARIFICATION, carried from R1-H):** `core/directives/core-directive.md` still says "Adapters and profiles decide how a capability is fulfilled." The precise semantics established here are: a Profile constrains and bundles semantic requirements, the adapter translates target semantics, and runtime resolution selects the concrete binding. The Core Directive is not modified; the wording is deferred to R2/R3. It is wording debt, not a material contradiction, because the directive's surrounding text already forbids naming providers in canonical behavior.
- **Observation complexity** (R1-D/E) remains **DEFERRED CLARIFICATION**.
- **Approval-level taxonomy versus change-size taxonomy** (R1-F) remains open.
- **Completion `READY`** remains **RESOLVED** (R1-G); no contradictory evidence was found.

## Critical invariants

```text
PROFILE != ROLE
PROFILE != COMPETENCY
PROFILE != AUTHORITY
PROFILE != PERMISSION
PROFILE != PROVIDER
CONTEXT != KNOWLEDGE
CONTEXT != AUTHORITY
CONFIGURATION != GOVERNANCE
LOWER CONFIGURATION CANNOT EXPAND AUTHORITY
SECRETS NEVER BECOME CANONICAL PROFILE DATA
CONTEXT VALUE != CONTEXT VOLUME
REQUIRED CONTEXT MUST NOT BE SILENTLY TRUNCATED
PROFILE CONSTRAINS; ADAPTER TRANSLATES; RUNTIME RESOLVES
```
