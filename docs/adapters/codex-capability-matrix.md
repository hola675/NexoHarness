# Codex Capability Matrix

**Research snapshot:** 2026-10-05. **Stable baseline:** Codex CLI `0.160.0` (`rust-v0.160.0`, 2026-10-01). **Upstream main observed:** `3f1ccb7ceb814e54314826f68d61c892e2f5a48e` (2026-10-05). See detailed evidence and provenance in [`research/codex/capability-matrix.md`](../../research/codex/capability-matrix.md) and [`research/codex/sources.md`](../../research/codex/sources.md).

This is Phase 1.0 research and design input, not an adapter specification. The recommended first certification target is **Codex Local CLI / local Codex harness at 0.160.0**. The IDE extension and desktop app are related secondary local surfaces; Cloud/managed and Agents API/SDK are distinct and excluded from the first target. ADR 0003 records the accepted target decision following independent review.

## Summary matrix

| Nexo requirement | Codex mechanism | Surface | Support class | Enforcement strength | Stable version status | Key limitation | Future phase |
|---|---|---|---|---|---|---|---|
| Core Directive / Always-on | Generated `AGENTS.md` + global/project context | CLI local | ADAPTER_TRANSLATABLE | PROMPT / ADVISORY ONLY | Docs current; exact release behavior not pinned | Context can be truncated; prose does not enforce effects | 1.1 |
| Project precedence / scoped overrides | Global and nested `AGENTS.md`, `AGENTS.override.md`, fallback names | CLI local | NATIVE_WITH_CONSTRAINTS | PROMPT / ADVISORY ONLY | DOCUMENTED / VERSION UNCLEAR | Directory chain and 32 KiB default cap are not Nexo's full authority model | 1.1 |
| Nexo Skills | `SKILL.md` folders; metadata-first discovery and progressive loading | CLI local | NATIVE_WITH_CONSTRAINTS | PROMPT / ADVISORY ONLY; script approvals vary | CLI/IDE documented; verify exact 0.160 behavior | Codex file is not Nexo Skill semantics or authority | 1.1 |
| Nexo Agents / roles | Built-in and custom TOML agents | CLI local | ADAPTER_TRANSLATABLE | Role guidance advisory; parent sandbox inherited | Multi-agent marked stable in current docs; exact 0.160 verification needed | Role/config does not encode Nexo dimensional authority | 1.1 |
| Bounded delegation | Spawn/steer/wait/close subagents | CLI local | NATIVE_WITH_CONSTRAINTS | RUNTIME GATE via inherited permissions | Multi-agent documented stable/on by default; release pin to verify | No typed Nexo delegation contract; spawning is instruction-driven | 1.1 / 3.x |
| Minimum sufficient Orchestration | Model planning plus optional subagents | CLI local | NATIVE_WITH_CONSTRAINTS | Mostly PROMPT / ADVISORY ONLY | Current behavior documented; classifier not established | No guaranteed bounded/complex path selector | 1.1 / 3.x |
| Nexo Workflows / state machines | Instructions, skills, agents and selected hooks | CLI local | NEXO_RUNTIME_REQUIRED | Combination; mostly advisory | No first-class workflow construct established | No typed transitions, contracts, durable gates or retry bounds | 2.x / 3.x |
| Abstract capabilities | Built-in file/edit/patch/shell/Git operations; optional web/image surfaces | CLI local | NATIVE_WITH_CONSTRAINTS | Varies by operation and config | CLI stable; individual surfaces vary | Not Nexo registry/resolver; capability availability is not authority | 1.1 |
| Dimensional authority | Sandbox, approval policy, profiles, command rules | CLI local | NEXO_RUNTIME_REQUIRED | HARD ENFORCEMENT + RUNTIME GATE + advisory layers | `.rules` explicitly experimental; other behavior needs platform tests | Controls do not map one-to-one to four Nexo dimensions | 1.1 / 1.2 |
| Filesystem/network boundary | OS sandbox plus approval on escalation | CLI local | NATIVE_WITH_CONSTRAINTS | HARD ENFORCEMENT for covered local commands | 0.160 includes Windows fixes; OS/config variance | Windows unelevated has weaker network/split-path controls | 1.1 / 1.3 |
| Command policy | Approval modes, granular gates, experimental prefix rules | CLI local | NATIVE_WITH_CONSTRAINTS | RUNTIME GATE; rules can block covered commands | Rules maturity is Experimental | Wrappers and non-shell tools may not follow same rule path | 1.1 |
| Lifecycle hooks / Observer triggers | Hook events and command handlers | CLI local | NATIVE_WITH_CONSTRAINTS | Runtime callbacks; event-specific | Current docs unpinned; some handler types parsed but skipped | Trust required; some callbacks cannot block; transcript unstable | 1.1 research, 5.x |
| VERIFY | `codex exec`, shell tests, JSONL/structured final output | CLI local | NATIVE_WITH_CONSTRAINTS | Command/tool boundary only | `exec` documented Stable; pin test to 0.160 | Running checks does not fulfill Nexo evidence contract by itself | 1.3 / 6.x |
| Independent review | `codex review` / `/review`; optional `review_model` | CLI local | NATIVE_WITH_CONSTRAINTS | Separate review operation, not security gate | Command documented Stable; reviewer details/config are current docs, release pin needed | Dedicated reviewer flow helps separation, but does not prove Nexo E4 identity, context or evidence | 3.x / 6.x |
| Alternate model-instruction file | `model_instructions_file` in current main/config docs | CLI local | UNKNOWN | Replaces instruction source per current docs | Not established for 0.160.0 | Could replace foundational instructions; precedence and compatibility must be verified before use | 1.1 research |
| Progressive context | AGENTS chain, Skills disclosure, compaction/resume | CLI local | NATIVE_WITH_CONSTRAINTS | Context behavior, not authority | Documented; budgets/availability vary | Compaction is not lossless; loaded context may be capped | 1.1 |
| Codex session state | Local history, resume, optional local memories | CLI local | NATIVE_WITH_CONSTRAINTS | Local product state | Resume Stable; memories optional/off by default per current docs | Not Nexo Shared Runtime or cross-harness state | 1.1 |
| Shared Runtime / cross-harness learning | No Nexo-equivalent established | Nexo-owned | NEXO_RUNTIME_REQUIRED | Nexo policy/storage required | Not a Codex feature claim | Scopes, isolation, evidence quality and promotion remain Nexo responsibilities | 5.x |
| Task Observer signals | Hooks + `codex exec --json` events/usage | CLI local | NATIVE_WITH_CONSTRAINTS | Observation only; coverage incomplete | JSONL documented; hook maturity/version unclear | Transcript unstable; signal completeness/privacy not guaranteed | 5.x |
| Automation / isolated fixture | `codex exec`, read-only default, JSONL and resume | CLI local | NATIVE_WITH_CONSTRAINTS | Sandbox plus explicit CI config | `exec` documented Stable | External fixture, auth, network and result checks still needed | 1.3 |
| IDE extension | Shared CLI config/runtime + editor context/settings | Codex IDE | NATIVE_WITH_CONSTRAINTS | Inherits local mechanisms | Client version differs from CLI | Editor context and extension releases need separate validation | Later parity |
| Desktop app local | Local Codex with app projects/worktrees/UI | Codex app | NATIVE_WITH_CONSTRAINTS | Shared local mechanisms plus app controls | App versions roll separately | App lifecycle and extra UI features are not CLI parity | Later parity |
| Cloud / managed | Remote environment/session and managed controls | Cloud | UNKNOWN for local target | Separate cloud policy boundary | Separate version/config | Remote behavior is not evidence for local CLI | Out of V1 |
| Agents API / SDK | Managed harness or app-controlled agent runtime | API/SDK | UNKNOWN for local target | Different runtime-specific gates | Separate product/version | API capability does not establish CLI capability | Out of V1 |

## Fit summary

| Nexo subsystem | Fit | Main reason |
|---|---|---|
| Core Directive | PARTIAL FIT | Instruction translation is possible; instructions are not enforcement. |
| Precedence | PARTIAL FIT | Directory layering exists, but it is not Nexo's full authority/conflict model. |
| Skills | PARTIAL FIT | Strong procedural/file-format overlap; semantic identity and authority stay distinct. |
| Agents | PARTIAL FIT | Role/TOML agent configs exist; dimensional authority does not map. |
| Orchestration | PARTIAL FIT | Delegation and aggregation exist; Nexo classification/escalation is not guaranteed. |
| Workflows | POOR FIT | No general first-class state-machine/handoff-contract construct established. |
| Capabilities | PARTIAL FIT | Useful local tools exist; no Nexo resolver semantics. |
| Authority | POOR FIT | Coarse sandbox/approval controls do not equal four dimensions. |
| Enforcement | PARTIAL FIT | Strong OS sandbox and gates exist for covered actions; path/tool variance remains. |
| Verification | PARTIAL FIT | Commands and JSONL exist; Nexo freshness/evidence contract remains external. |
| Independent Review | PARTIAL FIT | Review workflow exists; independence must be established separately. |
| Progressive Context | PARTIAL FIT | AGENTS/Skills/compaction help, with cap and loss constraints. |
| Shared Runtime | POOR FIT | No Nexo-owned cross-harness scoped evidence store. |
| Task Observer | PARTIAL FIT | Some hooks/events/usage signals exist; stable coverage is incomplete. |
| Continuous Improvement | POOR FIT | No native Nexo candidate/eval/review/approval/promotion lifecycle. |

MCP is **DEFERRED PROVIDER MECHANISM** in Phase 1.0. No MCP catalog, configuration, mapping, permission or dependency is part of this research. No adapter or generated Codex artifacts are implemented.

Concrete assumptions must be reverified before adapter implementation, before Codex certification, whenever the supported CLI version changes, and when a relied-on feature changes maturity. See [`ADR 0003`](../decisions/0003-codex-target-surface.md).
