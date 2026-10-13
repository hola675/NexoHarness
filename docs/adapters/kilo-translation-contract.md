# Kilo Code Adapter Translation Contract — K1

**Status:** K1 design contract; no adapter implementation is included in this document.<br>
**Decision authority:** [ADR 0007](../decisions/0007-windows-vscode-target-scope.md).<br>
**Canonical authority:** Nexo schemas, policies, and technical concepts cited below.<br>
**Target:** Kilo Code VS Code extension on Windows.<br>
**Target baseline:** Kilo Code `v7.8.8`, official tag commit `e2887f08e5a6394299c810ba508f358aaf4c5bc3`.<br>
**Research basis:** [K0 capability matrix](../../research/kilo/capability-matrix.md) and [K0 source ledger](../../research/kilo/source-ledger.md), inspected 2026-10-13.

## 1. Purpose and claim boundary

This contract defines a future Kilo adapter's translation rules from explicitly selected, validated Nexo canonical inputs to Kilo VS Code configuration surfaces. It does not define a renderer, implementation, installer, distribution bundle, or runtime resolver.

The adapter translates canonical semantics. It does not make Kilo a source for Nexo semantics, create Authority, grant Permission, enable Providers, or certify target behavior.

```text
NEXO CANONICAL INPUT
→ validated explicit selection
→ Kilo translation and diagnostics
→ deterministic target candidates
→ separate eligibility / distribution / installation / verification gates
```

The target claim is initially limited to Windows + Kilo Code VS Code extension `v7.8.8`. CLI behavior, other operating systems, later releases, organization-managed configuration, and other Codex/Claude clients are outside this contract.

## 2. Invariants

1. **Canonical semantics remain harness-neutral.** Kilo-specific filenames, properties, modes, tool names, and config fields stay in the adapter layer.
2. **Explicit validated selection only.** The adapter consumes caller-selected canonical entities validated against their schemas and cross-references. It does not discover or select all canonical entities, infer task context, or modify source.
3. **No semantic widening.** A translation may preserve, narrow, or block. It must not weaken a required constraint, broaden authority, substitute a different capability, or silently omit a required meaning.
4. **Authority and permission remain separate.** Agent authority (`sourceModification`, `delegation`, `commandExecution`, `externalMutation`) is a Nexo ceiling. Kilo permission configuration is target runtime state. `allowed` authority does not create Kilo `allow`; target `allow` does not create Nexo Authority.
5. **Capability and provider remain separate.** Kilo native tools and MCP tools are candidate providers/mechanisms, not canonical Capabilities. Availability or configuration does not authorize use.
6. **Instruction text is advisory.** Markdown instructions, rules, skills, and prompts cannot satisfy a required L2/L3 control by themselves.
7. **Unknown required semantics block.** When an evidence gap or target limitation affects required behavior, compilation returns a blocking diagnostic and cannot be represented as a deployable result. Optional degradation must be explicit, reported, and accepted by the caller's canonical criteria.
8. **Preview is not deployment.** Candidate bytes do not prove target loading, eligibility, installation, runtime behavior, or certification.
9. **No ambient configuration.** Translation must not depend on the developer's current Kilo settings, credentials, account, model availability, network, or machine paths.
10. **Determinism and provenance.** Same validated selection, adapter version, target baseline, and explicit options produce byte-identical candidates. Every candidate records canonical source references and the target baseline in its in-memory provenance.

## 3. Selected target surface

K0 documents these target surfaces for Kilo VS Code at the pinned release:

| Semantic surface | Documented VS Code target surface | Contract boundary |
|---|---|---|
| Project instructions | Root/parent and directory `AGENTS.md`; `CONTEXT.md`; project config `kilo.jsonc` `instructions` entries | Text is prompt context. Existing project instructions are user-owned input and must not be overwritten or silently merged. An instruction candidate needs an explicit path/config binding before it is active. |
| Custom rules | Markdown files referenced by `instructions` in `kilo.jsonc`; `.kilo/rules/` is a documented project convention | Rules are advisory. Exact path ownership and safe composition with an existing `kilo.jsonc` are unresolved for distribution/installation. |
| Custom agents | `.kilo/agents/<name>.md`, `.kilo/agent/<name>.md`, or agent entries in `kilo.jsonc` | Markdown frontmatter supports prompt, mode, and permission fields. Organization/environment overrides can change the effective result. |
| Skills | `.kilo/skills/<name>/SKILL.md` | Native Agent Skills procedure surface. No authority or permission is conferred. |
| Slash commands | `.kilo/commands/<name>.md` | Reusable prompt procedure; not a Nexo workflow state machine. |
| Permission rules | `permission` settings and per-agent permission frontmatter/config | Target runtime gate for specific target tools. Its effective configuration and Windows behavior must be verified; no OS sandbox claim follows. |
| Providers/MCP | Project/global MCP configuration and target tools | Provider configuration is outside canonical translation and is not generated by the adapter. |

These are target surfaces, not an approved output file list. In particular, K1 does not decide how to merge a pre-existing `kilo.jsonc`, own `AGENTS.md`, choose installation scope, or resolve file collisions. Those decisions belong to later distribution/installation design.

## 4. Permission and authority contract

### 4.1 Non-granting rule

The adapter MUST NOT emit Kilo `allow` rules from canonical Agent, Policy, Profile, Capability, or Enforcement data. It MUST NOT enable `--auto`, global auto-approval, MCP servers, credentials, or Providers. A canonical `authorityMode: allowed` means Nexo does not prohibit an action within its declared ceiling; it is not an instruction to grant target permission.

Kilo `ask` is not a substitute for canonical authority `none`: human confirmation cannot authorize an action Nexo has not authorized. Kilo `deny` is the only target permission action that can express a prohibition for a specific, proven tool boundary. Even then, generated configuration alone does not prove the effective rule is active.

### 4.2 Mapping requirements

| Nexo authority / constraint | Candidate Kilo control | Translation rule |
|---|---|---|
| `sourceModification: none` | `edit` and any target write/patch tools | Candidate deny rules only when the selected VS Code release and all relevant write tools are explicitly inventoried. If coverage is incomplete or effective precedence is unknown, block the required restriction. |
| `commandExecution: none` | `bash` | Candidate deny only for the verified Kilo command tool. Do not infer that this also prevents writes, network access, MCP, or other effects. |
| `delegation: none` | `task` permission / agent mode | Candidate deny only when the VS Code path and all invocation paths are verified. A prompt saying “do not delegate” is advisory and insufficient. |
| `externalMutation: none` | Network-capable tools, shell, MCP, browser/extension surfaces | No complete mapping is established by K0. A mandatory requirement blocks translation until the target effect surface is bounded and verified. |
| Any `*: scoped` authority | Path/command patterns and other target restrictions | No scope object exists in the current Agent schema beyond the enum value and free-text constraints. Do not infer machine patterns from prose. Block required scoped behavior unless a later canonical/contract input provides a validated exact scope and a probe proves equivalent enforcement. |
| `*: allowed` | No generated permission grant | Leave target permission to the effective client configuration. Record availability/permission as unknown unless independently inspected. |

### 4.3 Effective permission gate

Kilo configuration may be layered across built-in, global, project, `.kilo/`, agent files, environment overrides, and session state. K0 did not execute a Windows + VS Code probe. Therefore:

- A generated `deny` candidate is not proof that the effective client denies the action.
- The adapter MUST NOT claim `HARD_ENFORCEMENT` based only on a config file or prompt.
- A required Policy or Enforcement that depends on effective Kilo permissions remains `UNKNOWN` and blocks deployment eligibility until a bounded probe establishes the target/version/platform/configuration path.
- The adapter MUST preserve diagnostics for every omitted or uncertain restriction.
- No runtime permission snapshot or verification service is defined here.

Kilo's permission engine is classified as a **target `RUNTIME_GATE`** for the matching in-process tool call, not as an immutable operating-system boundary. Prompt/rule Markdown remains `PROMPT_ADVISORY_ONLY`.

## 5. Kind-by-Kind translation dispositions

These are the contract dispositions for this target baseline. They do not state that an adapter exists.

| Canonical Kind | Kilo candidate surface | Translation class | Enforcement disposition | Required loss / blocking rule |
|---|---|---|---|---|
| Directive | Project instruction file/config entry and/or Agent prompt | `COMPOSED_TRANSLATION` | `PROMPT_ADVISORY_ONLY` | Preserve provenance and Nexo precedence intent as text only. Missing/ignored URLs, target precedence, or instruction-size/context limits are loss; a required non-text constraint cannot be satisfied here. |
| Policy | Advisory instruction/rule text; conditional target `permission` deny for an exact tool restriction | `CONDITIONAL_TRANSLATION` | Text is advisory; target permission is `RUNTIME_GATE` | Do not translate Policy into grants. Block if mandatory authority/effect cannot be enforced by a verified target rule. |
| Agent | `.kilo/agents/<id>.md` or config `agent` entry | `CONDITIONAL_TRANSLATION` | Prompt advisory; permission fields are `RUNTIME_GATE` | Map responsibility and procedural prompt only when role semantics survive. Do not infer Nexo authority, model choice, or delegation permission from Kilo `mode`. |
| Skill | `.kilo/skills/<id>/SKILL.md` | `DIRECT_TRANSLATION` | `PROMPT_ADVISORY_ONLY` | Translate procedural body and supported metadata only. Preserve skill identity/provenance; do not grant authority or inline unverified referenced resources. |
| Rule | Markdown rule file referenced through project instructions | `COMPOSED_TRANSLATION` | `PROMPT_ADVISORY_ONLY` | Preserve intent/scope as readable text; no claim of file/shell enforcement. Exact `kilo.jsonc` composition is deferred. |
| Workflow | `.kilo/commands/<id>.md` slash command | `CONDITIONAL_TRANSLATION` | `PROMPT_ADVISORY_ONLY` | Translate a manual procedural entry only. Do not claim Nexo state transitions, gates, routing, retries, resume, or completion verification. Do not set `subtask: true` unless separately justified by the selected workflow and authority contract. |
| Contract | No Kilo-native Nexo Contract definition | `NEXO_RUNTIME_ONLY` | `NONE_UNKNOWN` | Keep typed handoff/result validation Nexo-owned. Prompt text or tool input schema is not a Nexo Contract. |
| Capability | Candidate binding to an individually evidenced Kilo tool | `CONDITIONAL_TRANSLATION` | Depends on target permission; initially `UNKNOWN` for required controls | Bind only after the tool's observable semantics, effect, failure behavior, Windows + VS Code availability, and permission path are verified. Never create a target Capability by matching names. |
| Profile | No direct Profile Kind; may select compatible Agent/procedure candidates | `CONDITIONAL_TRANSLATION` | Permission subset remains a target `RUNTIME_GATE`; other content advisory | Do not emit provider/model/MCP configuration. If Profile constraints cannot be represented without loss, block required selections or report explicit optional degradation. |
| Enforcement | Candidate target permission deny for an exact supported control; otherwise Nexo-owned validation/gate | `CONDITIONAL_TRANSLATION` | Kilo `RUNTIME_GATE` only for proven tool checks; otherwise `NONE_UNKNOWN` | L1 prose cannot meet required L2/L3. No hard enforcement or target-wide sandbox claim. Required unproven controls block. |
| Evaluation | Nexo evaluation definitions and results remain Nexo-owned | `NEXO_RUNTIME_ONLY` | `NONE_UNKNOWN` | Kilo success, exit state, or model response does not establish Nexo conformance or certification. |
| Observation | Nexo Observation schema/evidence governance remains Nexo-owned | `NEXO_RUNTIME_ONLY` | `NONE_UNKNOWN` | Do not emit or ingest target sessions/transcripts as Nexo Observation without a separately designed privacy/provenance integration. |
| ImprovementProposal | Nexo governance artifact only; no Kilo target artifact | `NO_TARGET_ARTIFACT` | `NONE_UNKNOWN` | Kilo output cannot approve, promote, or self-authorize canonical changes. |

## 6. Capabilities, providers, models, and context

Kilo built-in tools and MCP tools may be considered as candidate implementations for a canonical Capability, but only after target-specific evidence proves the operation's semantics, effect, inputs/outputs, failure behavior, and permission boundary.

Illustrative review candidates (not canonical additions):

| Abstract request family | Candidate Kilo mechanism | K1 rule |
|---|---|---|
| Repository read/search | `read`, `glob`, `grep`, optional `semantic_search` | Verify that the exact Windows + VS Code release provides the operation and the intended file scope. |
| Repository modification | `edit`, `write`, `apply_patch` | Treat as separate effect-bearing tools. Permission and all write pathways require probe. |
| Command execution | `bash` | Requires explicit authority and effective permission evidence. Never infer from a command prompt or task instruction. |
| Web/MCP operation | `webfetch`, configured MCP tool | Provider availability, credentials, network effects, permission, and authorization are distinct. K1 does not configure them. |

These names describe Kilo mechanisms, not Nexo canonical names. No tool binding is certified by this contract. Model/provider choice, MCP server definitions, semantic indexing, memory, credentials, and persistent target state remain outside generated canonical artifacts.

## 7. Output, diagnostics, and eligibility boundary

The future adapter may produce deterministic in-memory candidates for the target surfaces in Section 3. This contract does not authorize writing target files or define distribution paths, manifest schemas, bundle aggregation, installer behavior, or an eligibility API.

Required diagnostics must identify at least: canonical source reference, target `v7.8.8` / VS Code / Windows scope, target surface, translation class, semantic loss, enforcement level, evidence source/confidence, and whether the condition blocks or is an explicitly accepted optional degradation.

A required semantic or enforcement gap is blocking. A passing renderer, valid markdown, target-parseable configuration, or deterministic bytes cannot independently establish deployability or certification. Installation collisions and target ownership remain unresolved for a later installation contract; do not write or overwrite target files in this phase.

## 8. Required K1 evidence probes before product implementation claims

K1 design acceptance does not replace target probes. Before a future adapter can claim that required restrictions are preserved, perform separately scoped, disposable Windows + VS Code probes at Kilo `v7.8.8` for:

1. Effective permission precedence across global, project, `.kilo/agent`/agent definition, environment, session, and UI settings.
2. `allow`, `ask`, and `deny` behavior for read, edit/write/patch, bash, task, web and MCP calls, including tool aliases and errors.
3. Whether the VS Code extension can enter autonomous/auto behavior and how it changes approval semantics.
4. Sensitive file and external-directory behavior; symlink and path boundary cases if used as an enforcement claim.
5. Project `kilo.jsonc` and Markdown config discovery/reload behavior without overwriting pre-existing user files.
6. Windows-specific path/glob matching and extension/runtime parity for each claimed tool.

These probes require isolated fixtures and no production credentials or personal configuration. This contract records them as prerequisites; it does not execute them or generate artifacts.

## 9. Explicit exclusions and unresolved items

- Kilo CLI as a certification client.
- Non-Windows hosts and non-VS Code clients.
- Kilo releases other than `v7.8.8`.
- Codex VS Code investigation or implementation.
- Claude Code as an active project target.
- Target file writes, config mutation, installation scope, collision ownership, rollback, or distribution package format.
- Runtime permission resolver, Observer, evaluation service, promotion, Installer, R3, signing, release, and certification.
- Automatic model/provider/MCP selection or credential handling.

Open K1 design constraints are exact project instruction/config composition; how the later distribution can avoid conflicting with user-owned `AGENTS.md`/`kilo.jsonc`; and which required Nexo restrictions can be proven against Kilo's effective Windows + VS Code permission state. Until resolved with evidence, the relevant translation remains conditional or blocking.

## 10. Canonical source references

- [Agent concept](../concepts/agents.md) and [Agent schema](../../core/schemas/agent.schema.json)
- [Capability concept](../concepts/capabilities.md) and [Capability schema](../../core/schemas/capability.schema.json)
- [Profiles concept](../concepts/profiles.md) and [Profile schema](../../core/schemas/profile.schema.json)
- [Rules and Policies concept](../concepts/rules.md) and [Policy schema](../../core/schemas/policy.schema.json)
- [Skills](../concepts/skills.md), [Workflows](../concepts/workflows.md), and [Contracts](../concepts/contracts.md)
- [Enforcement levels](../concepts/enforcement.md) and [Enforcement schema](../../core/schemas/enforcement.schema.json)
- [Governance and authority model](../model/governance-authority.md)
- [ADR 0007: Windows + VS Code target scope](../decisions/0007-windows-vscode-target-scope.md)
- [K0 evidence](../../research/kilo/README.md)
