# ADR 0005: Codex Agent Role Rendering and Non-Deployable Artifact Semantics

- Status: Accepted
- Date: 2026-10-06
- Deciders: NexoHarness maintainers
- Related: ADR 0003, Codex target surface; ADR 0004, Codex adapter translation contract; Phase 1.1-C3 custom-role evidence; Phase 1.1-C4 AgentCandidate IR

## Context

The Codex adapter now projects validated canonical Agents into `AgentCandidate` records independently of `authorityMappings`. Under the current Codex 0.160.0 authority crosswalk, a normally REQUIRED Agent still produces blocking authority diagnostics: `sourceModification`, `commandExecution` and `externalMutation` are `PARTIAL`, while `delegation` is `UNKNOWN`. Therefore the candidate can exist while `CodexCompilation.usable` is false.

A renderer that rejects every unusable compilation before producing bytes would make generated Agent-role serialization and isolated target verification unreachable. A renderer that ignores compilation usability would hide unresolved authority and weaken the fail-closed boundary. This decision separates deterministic representation from eligibility for normal use or deployment.

## Decision

Select **Option B: render a representation while preserving unusable status**. A pure renderer may produce deterministic in-memory target representations from `CodexCompilation`, including when `CodexCompilation.usable` is false. It must not change `CodexCompilation.usable`, authority mappings, authority diagnostics, or canonical authority.

The renderer result distinguishes `artifacts`, `diagnostics`, `usable`, and `deploymentEligible`. Its governing relationship is:

```text
deploymentEligible = compilation.usable
             AND renderer succeeded
             AND no renderer-level blocking diagnostics
```

`usable` cannot exceed `compilation.usable`; `deploymentEligible` cannot be true when `usable` is false. If the parent compilation is unusable, any emitted bytes are explicitly non-deployable regardless of whether the target representation is valid. The renderer does not promote the compilation or make authority representable.

## Terminology

- **Renderable:** target-native bytes can be represented deterministically. This makes no authority, usability, or deployment claim.
- **Usable compilation:** canonical requirements and adapter diagnostics permit use under the existing translation contract.
- **Deployable artifact:** a rendered artifact whose parent compilation is usable and whose renderer has no blocking condition.

Therefore `RENDERABLE != USABLE` and `RENDERABLE != DEPLOYABLE`.

## Preview artifacts

Artifacts rendered from an unusable compilation are **NON-DEPLOYABLE**. They may be used only for bounded determinism, serialization, target-schema, and isolated runtime verification tests. They must not be presented as installable, approved, authorized, certified, or production-ready. A runtime test consuming preview bytes does not change their deployment status: `TESTABLE != DEPLOYABLE`.

## Authority and capability invariants

**ROLE != AUTHORITY.** Agent-role rendering must not alter `authorityMappings`, `CodexCompilation.usable`, authority diagnostics, or canonical authority. Generated `description` and `developer_instructions` are prompt guidance; they cannot upgrade `PARTIAL`, `UNKNOWN`, `ADVISORY`, or `UNREPRESENTABLE` authority crosswalks or satisfy an unresolved required authority condition.

**CAPABILITY != TOOL.** `AgentCandidate.capabilityRefs` remain references and provenance only. The renderer cannot infer capability availability or translate references into Codex tools, MCP servers, providers, permissions, models, or commands.

## Pinned Codex target surface

This decision is limited to Codex CLI 0.160.0, tag `rust-v0.160.0`, commit [`a956835d020762cb2b570053af06f643a11c0ecc`](https://github.com/openai/codex/tree/a956835d020762cb2b570053af06f643a11c0ecc). The pinned source supports `[agents.<role>]` declarations with `description`, `config_file`, and `nickname_candidates`; role-specific config supports `developer_instructions`. Relative `config_file` paths resolve relative to the `config.toml` that declares the role. This decision does not generalize those claims to later Codex versions without reverification.

`AgentRole.description` is parent-side, model-visible guidance for choosing an `agent_type`. It is not automatic routing, a hard trigger, authorization, permission, or enforcement. Canonical triggers placed in the description are advisory selection cues only: **TRIGGER GUIDANCE != AUTOMATIC ROUTING**.

Promoted Phase 1.1-C3 evidence supports role `developer_instructions` reaching a spawned child's effective session configuration. They remain **PROMPT / ADVISORY ONLY**, not hard enforcement or authority. [Custom role evidence](../../research/codex/probes/custom-agent-roles-0.160.0.md).

## AgentCandidate field dispositions

| Field | Disposition | Boundary |
|---|---|---|
| `roleName` | Structural role key/path + provenance | Used as the configured role identity and deterministic filename component; preserve `Agent:<id>@<version>` provenance. |
| `responsibility` | `CHILD_DEVELOPER_INSTRUCTIONS` | Gives the child its role responsibility. |
| `triggers` | `ROOT_DESCRIPTION` | Advisory role-selection cues only; never a routing state machine. |
| `capabilityRefs` | `PROVENANCE_ONLY` | Not rendered as available operations or access. |
| `constraints` | `CHILD_DEVELOPER_INSTRUCTIONS` | Advisory only. A constraint rendered as `developer_instructions` does not satisfy a required hard safety, permission, or authority constraint. Existing compilation/enforcement diagnostics remain responsible for blocking deployment when stronger enforcement is required. Renderer prose must not mask that gap. |
| `handoff` | `CHILD_DEVELOPER_INSTRUCTIONS` | May tell the child what to report or escalate; does not implement workflow state, routing, typed handoff, retry logic, or terminal transition. Those remain Nexo-owned. |
| `failureBehavior` | `CHILD_DEVELOPER_INSTRUCTIONS` | Behavioral guidance only; no structurally enforced failure transition. |
| `verification` | `CHILD_DEVELOPER_INSTRUCTIONS` | Advisory expectations only. It does not establish successful evaluation, certified completion, proof, or promotion eligibility; Nexo evaluation and review remain authoritative. |

## Artifact shape

The renderer returns these paths in memory:

```text
.codex/config.toml
.codex/agents/<roleName>.toml
```

The root declaration is:

```toml
[agents.<roleName>]
description = "..."
config_file = "./agents/<roleName>.toml"
```

The role file contains:

```toml
developer_instructions = "..."
```

`nickname_candidates` is omitted because canonical Agent has no equivalent field. Do not derive nicknames from `roleName`, `metadata.title`, or `responsibility`.

Canonical role IDs follow the existing identifier grammar, but **canonical ID validity != filesystem filename validity**. The renderer must separately validate path/file representability and fail closed for cross-platform reserved file stems. Do not change the canonical ID grammar or invent a Codex role-name length limit.

## Excluded target settings

The renderer must not generate `model`, `model_reasoning_effort`, `sandbox_mode`, approval policy, permissions, tools, MCP, provider, network access, feature flags, or multi-agent enablement from `AgentCandidate`. These settings are not implied by the candidate.

## Serialization and provenance

Generated role files must use UTF-8, LF line endings, a final newline, stable field order and stable role order. Order roles by `AgentCandidate.source.ref`, using `roleName` as a secondary key only when necessary. Include no timestamp, random ID, username, machine-specific path, or temp path.

String values must be serialized as valid TOML basic strings. A JSON-style quoted-string encoder may be used only for the escape subset valid in TOML and valid Unicode scalar input; reject invalid scalar sequences instead of emitting invalid TOML. Renderer tests pin the narrow configuration grammar, round-trip its shared basic-string escape subset and assert stable bytes without a new TOML parser dependency.

Each artifact preserves canonical identity at minimum as `Agent:<id>@<version>`. Provenance does not grant authority.

## Generation and installation boundary

**ADAPTER GENERATES; INSTALLER RECONCILES.** The renderer returns in-memory artifacts only. It does not create directories, write `.codex` files, read an existing user `.codex/config.toml`, merge configurations, overwrite target files, or install agents. Phase 1.2 owns installation and collision handling.

A later isolated C4-C verification may consume **NON-DEPLOYABLE** preview artifacts as a test fixture solely to validate target semantics. This exception does not make those artifacts deployable.

## Alternatives considered

### A — Strict gate before rendering

Rejected. A required Agent currently makes its compilation unusable because required authority crosswalks are not strong enough. A strict gate would make Agent-role rendering and runtime verification unreachable.

### B — Render representation, preserve non-deployable status

Selected. It permits deterministic serialization and isolated verification while keeping the compile-time authority gate intact and making deployment eligibility explicit.

### C — Candidate-only renderer

Rejected. It removes compilation status and authority diagnostics from the renderer boundary, making accidental treatment of output as deployable easier and weakening provenance of the gate decision.

## Consequences

Positive:

- Authority remains fail-closed.
- The renderer can be tested independently.
- Target representation can be verified before deployment eligibility exists.
- Runtime probes need not weaken canonical authority.

Costs:

- Callers must distinguish renderable bytes from deployable artifacts.
- The renderer result needs explicit status semantics.
- Any installer must reject non-deployable artifacts.
- Tests must prevent accidental status promotion.

## Deferred items

This decision does not define installer reconciliation implementation, capability resolution, authority-model redesign, Codex permission mapping, MCP, provider resolution, other harnesses, or future Codex version support.

## Review gate

ADR 0005 is **Accepted** for C4-B1. It complements ADR 0004; the existing AGENTS.md and Skill renderers retain their strict usability gates. C4-C runtime verification has not been run. TARGET CAPABILITY != AUTHORIZATION. Internal generated-bundle collisions fail atomically; filesystem reconciliation remains Phase 1.2.
