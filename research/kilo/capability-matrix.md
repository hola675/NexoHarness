# Kilo Code capability matrix — K0

**Research baseline:** official Kilo Code release `v7.8.8`, tag commit [`e2887f08e5a6394299c810ba508f358aaf4c5bc3`](https://github.com/Kilo-Org/kilocode/tree/e2887f08e5a6394299c810ba508f358aaf4c5bc3), released 2026-10-07. Inspected 2026-10-13. The official release includes CLI and VS Code components. The current VS Code extension is built on the Kilo CLI. This report treats both as distinct researched surfaces; no complete parity claim is made, and choosing one as the future certification client is an open K1 scope decision.

Evidence labels: `VERIFIED_SOURCE` = source code at pinned tag; `OFFICIAL_DOCUMENTED` = official Kilo documentation; `INFERRED` = architectural consequence derived from those facts; `UNKNOWN` = insufficient evidence. Translation classes are the existing Nexo vocabulary. Enforcement labels are deliberately conservative: `HARD_ENFORCEMENT` only for controls shown to block/route execution in target code; it does not mean immutable against a machine owner or process administrator. `RUNTIME_GATE` means a target runtime permission/approval check; `PROMPT_ADVISORY_ONLY` means text without execution enforcement; `NONE_UNKNOWN` means none evidenced or behavior not established.

## Surface inventory

| Area | Kilo surface evidenced at baseline | K0 finding and limit | Evidence |
|---|---|---|---|
| Instructions and rules | `AGENTS.md`, `CLAUDE.md`, `CONTEXT.md`; global/project `instructions`; path/glob/URL entries; legacy rule compatibility | Project/global instructions and agent prompts have precedence rules; per-directory AGENTS discovery is documented. Text instructions guide generation; no runtime constraint follows from prose. URL instruction retrieval can time out and be skipped. | S01-S04 |
| Agents, modes, roles | Built-in and custom agents via `.kilo/agents/*.md`, `.kilo/agent/*.md`, config and global paths; `primary`, `subagent`, `all` | Can select prompt/model/tool permissions, step limit and delegation role. Nexo Agent responsibility/authority does not map one-to-one. Org-managed settings and environment/config precedence affect effective definition. | S05-S06 |
| Skills and reusable procedures | Agent Skills `SKILL.md`; global/project discovery; metadata on demand; reload | Reusable procedural text with optional metadata; not an authority object. Name collisions/project-over-global behavior and compatibility paths exist. | S07 |
| Commands and workflows | Markdown slash commands under `.kilo/commands/`; optional agent/model/subtask | Step-by-step prompt procedure invoked in a session. Not evidence of deterministic state machine, Nexo Workflow gates, durable completion semantics, or resumability. | S08 |
| Tools / operations | `read`, `glob`, `grep`, `edit`, `write`, `apply_patch`, `bash`, `webfetch`, `websearch`, `task`, question/todo and optional semantic search | Tool names are target-owned mechanisms. Their availability is not a canonical Capability or permission grant. Tool inventory and behavior may vary by client/config. | S09-S10 |
| MCP / providers | `kilo mcp`; project/global MCP configuration, local stdio and remote transports, enable/disable; tool permission namespace | MCP is a provider mechanism. Configured/connected/available does not imply authorized. Credential flow, server trust, platform parity, and outage fallback need deployment-specific validation. | S11-S12 |
| Permissions / enforcement | ordered `allow`/`ask`/`deny` permission rules, per-agent overrides, matching patterns, CLI approval/autonomous modes | Runtime gate is evidenced, but effective security depends on config, session mode and host. `--auto` intentionally removes interactive decision points and uses configured rules; it can make unresolved operations proceed according to effective permissions. Project config is cached during a session. No Nexo authorization is supplied. | S12-S14 |
| Models / providers | provider/model selection, model per agent/command and settings | Target configuration only. No canonical model/provider concept inferred. Exact availability, limits, fallback and account configuration are outside this matrix. | S05, S15 |
| Context and memory | instruction discovery, project/session context, optional semantic indexing (opt-in; embeddings/vector store) | Context and index state are target-owned. Indexing may send source-derived text to the selected embedding provider; data flow must be decided before any probe/deployment. No equivalence to Nexo Shared Runtime. Persistent memory semantics remain insufficiently established for a binding. | S02, S10, S16 |
| Generated / installed artifacts | Documented config files, `.kilo/` content, agent/skill/command Markdown and MCP settings | These paths are evidence about native surfaces only. K0 wrote none and does not define a package, install scope, ownership, or collision policy. | S02, S05, S07-S08, S11 |
| Version/platform | unified official release `v7.8.8`; CLI and VS Code are listed at this tag | Reproducible release baseline. Does not prove identical behavior across OSes, editors, organization-managed clients, or subsequent versions. | S01, S17 |

## 13 canonical Kind dispositions

| Nexo Kind | Kilo target surface | Translation class | Enforcement | Evidence | Loss / limitation and finding | Confidence |
|---|---|---|---|---|---|---|
| Directive | Global/project instruction text; agent prompt | `COMPOSED_TRANSLATION` | `PROMPT_ADVISORY_ONLY` | S02-S04, S18 | Can render behavioral prose, but precedence, injection point, URL failure and target overrides differ; cannot carry Nexo authority or guarantee execution constraints. `PARTIAL`. | `OFFICIAL_DOCUMENTED` |
| Policy | Permission configuration only for some operational restrictions; prose instructions for policy intent | `CONDITIONAL_TRANSLATION` | `RUNTIME_GATE` for mapped permissions; prose remains advisory | S12-S14, S18 | No general policy/decision authority object or Nexo approval semantics. Only policies reducible to target permission rules may be represented, with loss. `PARTIAL`. | `OFFICIAL_DOCUMENTED` / `VERIFIED_SOURCE` |
| Agent | Custom agents / modes with prompt, model, role mode, tools/permissions, step limit | `CONDITIONAL_TRANSLATION` | `RUNTIME_GATE` for tool restrictions; prompt advisory | S05-S06, S18 | Useful role surface, but no demonstrated one-to-one mapping for Nexo responsibility, authority, competency, assignment, or lifecycle. `PARTIAL`. | `OFFICIAL_DOCUMENTED` |
| Skill | `SKILL.md` Agent Skills | `DIRECT_TRANSLATION` | `PROMPT_ADVISORY_ONLY` | S07 | Procedural content can map; discovery/metadata/compatibility and execution context are Kilo-owned. Skill grants no permission or ownership. `SUPPORTED` for procedure only. | `OFFICIAL_DOCUMENTED` |
| Rule | Custom instructions/rule files and glob-scoped config entries | `COMPOSED_TRANSLATION` | `PROMPT_ADVISORY_ONLY` | S03-S04 | Rule text/path selection maps partially; precedence and glob ordering can differ. A behavioral rule is not an enforced filesystem/shell boundary. `PARTIAL`. | `OFFICIAL_DOCUMENTED` |
| Workflow | Slash command Markdown, optional agent/subtask | `CONDITIONAL_TRANSLATION` | `PROMPT_ADVISORY_ONLY` | S08 | Can prompt a sequence but no verified Nexo gate/state/contract semantics, idempotency, durable state, resumability, or completion proof. `PARTIAL`. | `OFFICIAL_DOCUMENTED` |
| Contract | No general Nexo contract object; task/session prompt and target protocol output are adjacent surfaces | `NEXO_RUNTIME_ONLY` | `NONE_UNKNOWN` | S08-S09, S18 | A prompt or tool schema is not a versioned handoff/result contract. Keep canonical contract and validation outside Kilo unless a later target-specific binding is justified. `UNSUPPORTED` as a native Nexo Contract. | `INFERRED` |
| Capability | Native tools and optional MCP-backed operations | `CONDITIONAL_TRANSLATION` | depends on target permission per tool | S09-S12, S18 | Operations can be candidates for a binding only by tested semantics, version and permission. Tool/provider existence alone does not resolve a Nexo requirement. No neutral binding registry. `PARTIAL`. | `OFFICIAL_DOCUMENTED` |
| Profile | Agent/config composition can select prompts, model and permissions | `CONDITIONAL_TRANSLATION` | `RUNTIME_GATE` only for permission subset; other values advisory | S05-S06, S12 | No evidence of a Nexo Profile aggregate with canonical constraint/effect semantics; config precedence and host state are target-owned. `PARTIAL`. | `INFERRED` |
| Enforcement | permission rules and approval workflow; host/process controls | `CONDITIONAL_TRANSLATION` | `RUNTIME_GATE`; selected permission checks have source evidence | S12-S14, S18 | Nexo L1/L2/L3 assurance boundaries are not represented by one Kilo object. Host owner, auto modes, config layering, and platform vary. No claim of immutable isolation or Nexo certification. `PARTIAL`; needs selected-surface probes. | `VERIFIED_SOURCE` / `OFFICIAL_DOCUMENTED` |
| Evaluation | No Nexo evaluation/certification Kind evidenced; CLI exit/result and tests are adjacent | `NEXO_RUNTIME_ONLY` | `NONE_UNKNOWN` | S09, S17-S18 | Exit status or successful response does not prove Nexo semantic preservation, conformance, or certification. `UNSUPPORTED` as a native Nexo Evaluation. | `INFERRED` |
| Observation | Session/transcript/log-like target information may exist; no Nexo Observation governance established | `NEXO_RUNTIME_ONLY` | `NONE_UNKNOWN` | S17-S18 | No evidence of Nexo evidence schema, privacy rule, provenance contract, authority separation, or observer store. Do not translate as a canonical Observation. `UNKNOWN` for an acceptable evidence integration. | `UNKNOWN` |
| ImprovementProposal | No equivalent approval-governed proposal Kind evidenced | `NO_TARGET_ARTIFACT` | `NONE_UNKNOWN` | S18 | Kilo output cannot self-authorize canonical changes or promotion. Proposal and approval semantics remain Nexo-owned. `UNSUPPORTED`. | `INFERRED` |

## Enforcement matrix

| Control / target behavior | Nexo enforcement classification | What evidence supports | Limit / status |
|---|---|---|---|
| Instruction, AGENTS.md, skill, agent prompt | `PROMPT_ADVISORY_ONLY` | Target inserts/loads text into model context (S02-S07) | No execution block demonstrated by text itself. |
| Tool permission allow/ask/deny | `RUNTIME_GATE` | Official docs describe execution approval/denial; pinned source has default `ask`, last matching rule, and permission handlers (S12-S14) | Effective rules may be widened; checks are target-owned. `HARD_ENFORCEMENT` only for the specific in-process decision path shown in source, not an OS sandbox guarantee. |
| Sensitive file reads / external directory | `RUNTIME_GATE` | Official docs and pinned source identify additional permission handling (S13-S14) | Exact OS/client behavior, symlinks, race conditions and all bypass paths need a bounded probe. `NEEDS_PROBE` for security claims. |
| MCP call | `RUNTIME_GATE` when permission rule configured; otherwise `UNKNOWN` | MCP tools use tool permission model (S11-S12) | Server authorization, credentials and external side effects are provider-specific. |
| Autonomous CLI (`--auto`) | `RUNTIME_GATE` using effective config | CLI docs say auto mode applies configured permission settings without user interaction (S09) | No interactive approval gate; the agent may be prompted to decide autonomously. Must not treat this as equivalent to human approval. |
| Agent/tool instructions about allowed behavior | `PROMPT_ADVISORY_ONLY` | Prompt/frontmatter content | Not an enforcement boundary absent a target permission/tool gate. |
| Nexo certification/evaluation, Observer, proposal approval | `NONE_UNKNOWN` | No native equivalent evidenced | Nexo-owned and out of K0/Kilo runtime scope. |

### Source inconsistency

The Kilo docs describe default permission behavior differently across pages: the generic “How Tools Work” overview states no tools are auto-approved, while the settings page documents tool-specific defaults and an interactive permission model. K0 therefore does not assert a universal default permission profile. Any future deployment must inspect effective configuration at the pinned surface; a selected-surface probe is required before a security claim.

## Findings and probes

| Finding | Status | Fact / evidence | Inference and consequence | Next proof needed |
|---|---|---|---|---|
| Native instructions, skills, agents, commands exist | `SUPPORTED` | Official docs at S02-S08 | These are candidate target surfaces, not canonical equivalents by name. | None for discovery; selected-client behavior probe before adapter. |
| Per-tool allow/ask/deny exists | `PARTIAL` | Docs and pinned source S12-S14 | Runtime gate exists, but does not establish Nexo authority or hardened isolation. | Probe selected client, OS, config precedence, project trust, external path, sensitive files, auto mode. |
| MCP exists | `SUPPORTED` for configuration surface | Official docs S11 | Provider integration can be represented only conditionally; authorization and secrets remain separate. | Probe transport/auth, disabled server, tool denial, failure/fallback without credentials in a disposable environment. |
| Exact CLI/VS Code feature parity | `UNKNOWN` | Shared release and CLI-backed extension docs | K1 must select client; do not claim one artifact behaves identically in both. | Compare selected release’s supported interfaces and narrow target. |
| Semantic indexing privacy/data flow | `NEEDS_PROBE` | Indexing is opt-in and uses embeddings/vector store S10 | Source-derived text may leave the machine depending on embedding provider. | Review provider path and data boundary; no K0 probe performed. |
| Nexo Evaluation/Observation/ImprovementProposal native semantics | `UNSUPPORTED` or `UNKNOWN` as classified above | No equivalent identified in official target surfaces reviewed | Keep assurance, evidence governance and proposal approval Nexo-owned. | Revisit only under separately authorized design/research. |

## Codex method reuse

Reused as method: pinned version/surface, translation class, loss disclosure, separation of authority/permission/capability/provider, fail-closed treatment of unknown evidence, provenance and renderable-versus-deployable distinction. Not reused: Codex filenames, paths, config schema, renderer, CLI behavior, or adapter IR. The source ledger lists the Codex references consulted.

## Open architectural questions (not decisions)

1. Which v7.8.8 client is the first product certification surface: CLI or VS Code extension?
2. Which operating systems and project/global config sources are in scope?
3. Are project-controlled permission files trusted, ignored, or intersected with distribution-owned constraints?
4. What evidence threshold and probes are required to claim a permission or filesystem boundary?
5. How must optional semantic indexing be disabled or disclose external embedding data flow?

No question above authorizes K1, implementation, roadmap changes, or a new canonical concept.
