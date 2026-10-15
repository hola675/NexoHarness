# K2-P0 — Windows + VS Code Probe Protocol

**Status:** Remediated probe design candidate; no probe executed. P03 is inspection-only ready; runtime-dependent cases remain blocked until separately authorized invocation prerequisites exist.
**Prepared against:** NexoHarness baseline `1623e055ec043404d49a1a50463bfd2a06a9cdcf` (`main`, 2026-10-14).
**Target under study:** Kilo Code VS Code extension `v7.8.8`, official tag commit `e2887f08e5a6394299c810ba508f358aaf4c5bc3`, on Windows.
**Authority:** [ADR 0007](../../docs/decisions/0007-windows-vscode-target-scope.md), with only still-applicable provisions of [ADR 0006](../../docs/decisions/0006-product-v1-and-adapter-priority.md); [K1 translation contract](../../docs/adapters/kilo-translation-contract.md).
**Prior gate:** K1 independent review `PASS WITH NON-BLOCKING FINDINGS`; open finding `K1R-01` is addressed by preserving finding state and evidence confidence as separate fields here.
**Non-goal:** This document does not authorize or execute a Kilo probe, implement an adapter/renderer/installer/manifest, or claim product readiness or certification.

## 1. Purpose and boundaries

This protocol turns K1 Section 8's six open verification conditions into bounded, reproducible experiments. It is a **test plan**, not results. Every result must be collected on the exact target client/version/platform and must distinguish what was directly observed from what is inferred. A CLI observation, rolling documentation page, source-level path, or result on another Kilo release cannot substitute for a Windows + VS Code probe.

K2-P0 tests target behavior and effective controls in disposable fixtures only. It does not test Nexo canonical behavior, generate target configuration for distribution, or modify any real user or production project. A finding applies only to the explicitly tested path, version, configuration, and fixture; it cannot be generalized to untested tools, aliases, paths, clients, or operating systems.

## 2. Required result vocabulary and evidence record

Every claim/result row MUST record these independent fields; neither may be derived automatically from the other:

- **`findingState`** — K0 vocabulary: `SUPPORTED`, `PARTIAL`, `UNSUPPORTED`, `UNKNOWN`, `NEEDS_PROBE`. This describes the current claim about target capability/behavior. `NEEDS_PROBE` is the pre-experiment state, not a failed test. On completion, state the disposition supported by the result; a blocked/unrun row remains `NEEDS_PROBE` or `UNKNOWN` as applicable.
- **`evidenceConfidence`** — K0 vocabulary: `VERIFIED_SOURCE`, `OFFICIAL_DOCUMENTED`, `OBSERVED_LOCAL`, `INFERRED`, `UNKNOWN`. This describes the evidence source/strength, not whether the claim is true. A controlled experiment with preserved artifacts can support `OBSERVED_LOCAL` even when the result is negative. An interpretation derived from logs remains separately identified as an inference.

Do not collapse these into a generic confidence, do not use PASS as a finding state, and do not upgrade a finding without new evidence. Retain provenance IDs from the K0 source ledger when used; cite the probe ID and artifact IDs for observations. Example record:

| claim | findingState | evidenceConfidence | direct observation | inference | scope / artifact |
|---|---|---|---|---|---|
| Exact `deny` rule blocked the tested VS Code tool call | `SUPPORTED` (only for tested path) | `OBSERVED_LOCAL` | UI showed denial; fixture sentinel remained unchanged; timestamped logs captured | This tested path is gated; untested aliases remain unknown | `K2-P0-P02`, run ID, artifact hashes |

`VERIFIED_SOURCE` supports source-level facts at the pinned commit, not proof of effective client behavior. `OFFICIAL_DOCUMENTED` supports documented claims, not proof of the installed release's exact Windows behavior. `INFERRED` must never be presented as an observation. An absent log entry alone is not evidence that an action was blocked.

## 3. Reproducible disposable environment

### 3.1 Required isolation

Run only after separately authorized to execute K2 probes. Use a dedicated disposable Windows VM (preferred) or equivalently isolated machine image with a revertible snapshot. Do not use the operator's normal Windows profile or a production project workspace.

1. Record Windows edition/build/architecture, VS Code version, Kilo extension version and extension identifier, installation provenance/hash, date/time/time zone, and snapshot ID. Verify the installed extension is `v7.8.8`; if exact identity cannot be established, stop and mark affected probes `BLOCKED`.
2. Create a fresh local test account and VS Code user-data/extensions directories inside the disposable VM. Start with no imported profile, sync, settings, saved Kilo permissions, secrets, or production data. Keep all global-looking configuration within this disposable account/VM; do not alter host/global Kilo settings.
3. Use a new fixture root and separate sentinel directories inside the VM. Include only synthetic text files with unique non-secret sentinel strings. Never clone or open a production repository. Do not provide real API keys, provider logins, GitHub credentials, or other credentials.
4. Keep semantic indexing and other optional source-upload/indexing features disabled. Do not configure MCP servers or install additional MCPs. Network egress is denied by default; permit only documented package/version acquisition needed for preparation, before fixtures are opened, then disable egress for behavioral probes. If an invocation method requires external service, mark the affected case `BLOCKED`; do not introduce real credentials or services to force a pass.
5. Use only local/mock operations. For an MCP behavior row, use no live server: either test only the permission presentation/configuration path that can be safely observed offline, or leave server execution `BLOCKED`. Do not imply this validates external side effects or server authorization.
6. Keep OS, VM, and fixture permissions limited to the disposable account. Do not expose production paths through mapped drives, shared folders, symlinks, junctions, or VS Code workspace history. Disable clipboard/drive sharing where feasible.
7. Take a clean snapshot before the first probe. Use one fresh snapshot/workspace per probe or reset all Kilo state and fixture contents between runs. Record any deviation. A contaminated state invalidates conclusions about defaults and precedence.

### 3.2 Fixed synthetic fixture set

The following names, contents, and relative paths are fixed test inputs (UTF-8, no BOM, LF, final newline). Create them only under the disposable VM. `<VM>` denotes the VM's recorded test volume, not an operator-selected host path. `W` is the new workspace root; `X` is a sibling directory outside `W` on the same disposable volume. Record their actual absolute paths and SHA-256 values in the run manifest. No fixture contains secrets.

```text
W\
  README.txt                 "K2P0_READ_SENTINEL\n"
  scratch.txt                "K2P0_SCRATCH_INITIAL\n"
  .env                       "K2P0_FAKE_ENV_NOT_SECRET\n"
  .env.example               "K2P0_EXAMPLE_NOT_SECRET\n"
  src\case.txt               "K2P0_CASE_SENTINEL\n"
  src\nested\deep.txt       "K2P0_DEEP_SENTINEL\n"
  .kilo\k2-p0-marker.md      "K2P0_MARKDOWN_MARKER\n"
X\
  external.txt                "K2P0_EXTERNAL_SENTINEL\n"
  link-target.txt             "K2P0_LINK_TARGET_SENTINEL\n"
```

If Windows forbids a synthetic filename/path or safe in-VM link creation, do not substitute another case silently: mark only that vector `BLOCKED` and record the reason. Do not create links until the target is confirmed within the VM and the link type, resolved target, and cleanup are recorded. Baseline hashes are captured before each case; restore by reverting the per-case snapshot (preferred), or by verifying byte-identical fixture recreation and clean Kilo session state before a repeat.

`kilo.jsonc` and permission-rule bytes are deliberately **not** fabricated here. The exact Kilo v7.8.8 schema/path/rule syntax and the winning effective layer must first be identified from pinned source and the installed client; until then every case that needs such a setting is `BLOCKED`. Preserve an unmodified seed copy of any pre-existing fixture config, named `kilo.jsonc.seed`, with its hash. Never overwrite it as a setup shortcut.

### 3.3 Tool-call invocation gate and evidence

The pinned implementation separates these stages:

1. Config/instructions and registered tools can be loaded without a model call; that establishes discovery/availability only.
2. The extension session sends a prompt into the OpenCode session pipeline. `packages/opencode/src/session/prompt.ts` resolves the session model and hands work to the processor.
3. `packages/opencode/src/session/llm.ts` obtains a provider language model and streams a request with the enabled tool definitions. A model/provider response must contain a tool-call event; a user prompt, visible tool, or loaded instructions do not themselves emit one.
4. `packages/opencode/src/session/processor.ts` receives tool-call events and routes the named tool through the session/tool execution path. Permission evaluation is separate; pinned `packages/opencode/src/permission/index.ts` evaluates rules and may allow, reject, or await a decision.
5. Tool execution/result/error events and a fixture side effect are separate evidence. A model's prose alone does not establish any of them.

Pinned-source references (all at `e2887f08e5a6394299c810ba508f358aaf4c5bc3`): [`session/prompt.ts`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/session/prompt.ts), [`session/llm.ts`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/session/llm.ts), [`session/processor.ts`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/session/processor.ts), and [`permission/index.ts`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/permission/index.ts). The source proves those code paths exist; it does not prove effective Windows VS Code behavior.

No deterministic, provider-free VS Code UI mechanism is established by the cited pinned source or K0 ledger to make the model emit a real tool call. Kilo's rolling official provider documentation describes supported local-model families and OpenAI-compatible endpoints, but it is not a v7.8.8 historical guarantee, does not establish a particular local model's tool-call fidelity, and does not make a mock equivalent to the real runtime. A local model is therefore only a future candidate, not an available precondition for this protocol. A local simulated endpoint would add a loopback trust surface (local processes able to reach the listener, endpoint authentication/configuration, model-response control, and possible unintended egress); no endpoint/server is specified or authorized here. The v7.8.8 repository tests that inject mocked services or call tool implementations directly are unit/integration test evidence for those test harnesses, not proof they traverse the extension's real model-emission, permission, and execution path. No client test runner is documented here as an authorized substitute.

**Execution gate:** A real-runtime case may start only under a later, separately authorized plan that names a specific model/provider and verifies (a) it is available without production credentials, (b) its requests remain inside the approved isolation boundary, (c) it can be prompted to emit the exact requested tool call, and (d) the same extension permission and tool execution path is evidenced. If any condition is absent, mark that case `BLOCKED` before action. No network or credential exception is implied. Any loopback provider/model proposal requires separate approval and a threat/surface review before setup. P03's static/UI inventory may proceed without a model because it makes no execution claim.

### 3.4 Evidence capture

Capture read-only screenshots of relevant VS Code UI/dialogs; exact fixture/config bytes; before/after hashes and directory listings; target permission decision/request IDs and tool-call state where normally exposed; logs/output available through the UI; timestamps; and a manifest with target identity, provider/model precondition (or `BLOCKED`), snapshot, vector IDs, exact actions, deviations, and SHA-256 hashes. Redact usernames, machine IDs, host paths, and accidental sensitive data before sharing. Never capture credentials or unrelated workspace content. A deny/reject requires both direct target decision evidence (for example an identifiable permission event/request and rejected/denied outcome) and independent evidence that the intended effect did not occur. No call, tool error, denial, or no-op are distinct outcomes; absent log entries and model prose are insufficient.

## 4. Procedure common to each probe

For every vector below, first verify target `v7.8.8`, Windows + VS Code, fixture hashes, provider/model execution gate (unless static-only), effective input config and clean session state. If tool ID/alias, config syntax, or result event cannot be established from pinned source/client inventory, record it as `PENDING_DISCOVERY`, do not guess, and mark the runtime vector `BLOCKED`. Reset to its case snapshot between variants and repetitions. Repeat at least three clean runs before claiming stable effective enforcement. Never silently substitute CLI, tool alias, provider, or version.

### Disposition criteria

- **PASS:** All stated observations for this exact probe were collected; the outcome matched the expected result; no unexplained side effect or scope deviation occurred; required evidence is preserved. A pass establishes only the tested case, not universal capability or security.
- **FAIL:** An observable outcome contradicts the expected result, a prohibited side effect occurred, or a claimed control did not prevent the exact tested action. Preserve the evidence and do not repair or retry in the same contaminated state. Report narrowly; do not generalize beyond the case.
- **BLOCKED:** Preconditions or safe execution are absent (wrong/unverifiable version, missing UI path, contaminated environment, uncertain isolation, unavailable offline fixture, no safe way to exercise the operation, ambiguous action outcome, or required evidence cannot be captured). State the missing prerequisite and the affected claim. BLOCKED is not PASS, FAIL, or evidence of absence.

For a mandatory restriction, lack of a safe, controlled, attributable test is itself a **blocking evidence gap** for any future adapter eligibility/security claim. Keep `findingState: NEEDS_PROBE` (or `UNKNOWN` where the target surface itself cannot be identified) and `evidenceConfidence: UNKNOWN` for the unresolved behavior; the translation contract says a required unproven control blocks. Never convert BLOCKED into UNSUPPORTED without evidence, or into SUPPORTED from documentation alone.

## 5. Probe matrix

Every probe's claim is bounded to the exact configuration/action set listed. “Expected” describes the test oracle, not a statement that Kilo already behaves that way.

### 5.1 Fixed vector catalogue and run eligibility

The table in §5.2 is the reproducibility contract: fixture names/content are §3.2; source-backed oracles are identified there; fields marked `PENDING_DISCOVERY` are an execution blocker rather than operator discretion. Each vector must produce its own record containing objective, preconditions/target, fixture/config hash, tool ID and alias (or static-only), exact action, direct expected observation, positive and negative control where applicable, artifact IDs, PASS/FAIL/BLOCKED reason, limitations, and reset evidence. A vector cannot PASS if any required field is unresolved. For all runtime rows P01/P02/P04/P06 (and P05 marker behavior), model-emitted real tool calls are currently **BLOCKED** by §3.3. Static inventory is not a substitute.

| ID / K1 condition | Exact scope and preconditions | Fixtures | Action | Expected observations (oracle) | Evidence to preserve | PASS / FAIL / BLOCKED |
|---|---|---|---|---|---|---|
| **K2-P0-P01 — Effective permission precedence** (K1 §8.1) | Windows VS Code `v7.8.8`; isolated local user. Candidate layers are global/user, project, agent, environment, session/UI; supported paths/key names must be inventoried from pinned source and observed client before use. | §3.2 `W\scratch.txt`; isolated copies only | **P01-LAYER-01:** establish one supported layer at a time with an otherwise identical rule and single scratch operation. **P01-CONFLICT-01:** pairwise conflict only after exact syntax and rule order are verified; rotate allow/ask/deny by resetting snapshot. Reload/session boundaries must be recorded and sourced, not guessed. | The oracle is direct permission decision plus operation outcome, not assumed priority. Pinned permission source shows rule matching/decision code, but does not establish the cross-surface layer order; actual layer relation remains `NEEDS_PROBE`. | Full config bytes/hashes at every layer, effective UI/request decision, tool result/error event, scratch hash, reload sequence. | Runtime vectors `BLOCKED` until §3.3 gate and layer schema inventory pass. `PASS` only for a repeated, directly observed pairwise order; `FAIL` for contrary deterministic order; unknown layer remains unknown. |
| **K2-P0-P02 — allow / ask / deny per tool and alias** (K1 §8.2) | One exact discovered target tool ID/alias per vector; tool families remain separate: read; edit/write/patch; command execution; delegation/task; web; MCP. No web/network/live MCP under this protocol. | `README.txt`, `scratch.txt`, `src\case.txt`; MCP/web fixture unavailable | For each verified ID independently, run separate `allow`, `ask`-reject, `deny` cases. Read: request `README.txt`; write: change only scratch to exact `K2P0_SCRATCH_CHANGED\n`; command: bounded local command writing only scratch; delegation: child action limited to reading README; web/MCP: no live invocation, blocked. Exact argument syntax is a per-ID discovery field, not inferred from family name. | `allow`: target call and expected content/effect observed. `ask`: request event/UI observed; rejecting yields explicit rejected/error state and no effect. `deny`: direct deny decision and no effect. Distinguish these from malformed input, unavailable tool, provider error, and no call. Tool IDs and aliases must be evidence-backed separately. | Model tool-call event/name/arguments; permission event/request/reply; tool part status/result; fixture hashes; errors/logs; exact tool registry evidence. | Runtime cases `BLOCKED` until invocation gate, ID/schema, and config are verified. `PASS` requires full positive or negative evidence for that specific action; `FAIL` on mismatch/forbidden side effect; `BLOCKED` on no call, tool error before permission decision, ambiguous event, external service requirement, or unavailable alias. No family roll-up. |
| **K2-P0-P03 — VS Code autonomous/auto behavior** (K1 §8.3) | Inspection-only, pinned extension `v7.8.8`; no model needed. | UI/settings/commands only | Inspect, screenshot and record the visible offered surface and source/docs separately. Do not activate auto-approval or infer execution effects. | Oracle is literal presence/absence of the visible control and its displayed label/help, not runtime semantics. | Version identity, screenshot, settings/command inventory, cited source/doc. | Inspection may PASS narrowly. Whether auto changes approval remains `NEEDS_PROBE` and execution BLOCKED pending separate authorization. Never FAIL merely because no runtime experiment is done. |
| **K2-P0-P04 — Sensitive files and external-directory boundaries** (K1 §8.4) | Runtime path checks only in VM. Exact tool/alias and permission syntax required. | `W\README.txt`, `W\.env`, `W\.env.example`, `X\external.txt`; optional link `X\link-target.txt` | Separate read and write cases for workspace vs external directory; separate synthetic `.env` vs `.env.example`. Optional link case only after in-VM target resolution and link type confirmed; do not target host. | Direct decision/event + tool-call/part result and unchanged/changed fixture hash. Name-based sensitive-file behavior must not be presumed; `.env.example` is a negative comparison input, not assumed permitted. OS containment is not the oracle. | Paths before/after canonicalization if exposed, link metadata, permission decision, tool event/result, fixture hashes. | `BLOCKED` until invocation gate/config syntax/tool ID verified; optional link separately blocked unless resolved safely. PASS/FAIL per exact case only. No OS sandbox inference. |
| **K2-P0-P05 — Project configuration discovery, reload, preservation** (K1 §8.5) | Static fixture inventory may proceed but does not establish target discovery; behavior observation requires invocation gate. Pinned schema/path must be confirmed before config bytes are constructed. | `W\.kilo\k2-p0-marker.md` with exact marker above; `W\kilo.jsonc` and `W\kilo.jsonc.seed` (the latter byte-identical baseline copy) | Three isolated cases: (a) record exact file presence/bytes only; (b) marker-load observation only if a safe authorized real call can report exact marker and source attribution; (c) reload comparison after changing only disposable marker from `K2P0_MARKDOWN_MARKER` to `K2P0_MARKDOWN_MARKER_V2`, with fresh-session/reload action captured. Hash seed and both files before/after. | File presence is not a discovery oracle. Discovery requires attributable target load evidence; reload requires changed marker after recorded transition. Preservation requires seed hash unchanged. Neither case tests merge/install. | Workspace tree, exact file bytes/hashes, reload/session timeline, attributable load marker or explicit no-result/error. | (a) fixture inventory has no target-discovery PASS disposition. (b)/(c) `BLOCKED` without invocation gate and verified config mechanism. Any unexpected seed mutation is FAIL and stop. |
| **K2-P0-P06 — Windows paths/globs and matching** (K1 §8.6) | Path forms are fixed below; rule glob syntax/priority and exact tool IDs are `PENDING_DISCOVERY` from pinned source + target inventory. No CLI parity claim. | `W\src\case.txt`, `W\src\nested\deep.txt`, `X\external.txt` | Candidate path pairs: exact target and same path with case changed; `\` vs `/`; workspace-relative vs absolute; root vs nested path; internal vs VM-local external. Record input pattern bytes and resolved path. Execute separately for each verified tool ID. Never declare matching equivalence before actual oracle. | Expected normalization/matching is `UNKNOWN` until a pinned source-defined rule comparator and installed-target decision are established. Source utilities can explain observed normalization only; they do not establish extension runtime result. | Original and transformed path/pattern bytes, resolver output if exposed, effective rule list/order, permission event, call result/effect hash. | All behavioral vectors `BLOCKED` until exact syntax, source oracle, invocation, and tool ID are established. PASS only supports exact tested pair. Missing comparator remains `UNKNOWN`, not a guessed expected match. |

### 5.2 Cross-probe dependencies and ordering

Run P01 first to identify only the tested effective settings model; P02 then exercises individual decisions. P03 is inspection-only unless a separate authorization defines a safe execution test. P04 depends on trustworthy fixture isolation and path resolution. P05 checks project discovery independently of permission effectiveness. P06 depends on recording normalized paths and exact tool identifiers. A blocked prerequisite blocks only dependent claims, not independent rows. No result from one probe fills another probe's missing evidence automatically.

## 6. Evidence sufficiency and restriction blocking rules

A capability claim is sufficiently supported only when evidence identifies the target/version/client/platform, exact action/tool and alias, inputs, observable result, relevant effective configuration, and bounded failure behavior. To claim a runtime control is effective for a path, require a controlled attempt under the exact deny/reject condition, direct target decision evidence, and independent confirmation that the intended effect did not occur (for example unchanged fixture hashes). Repeat from clean state for stability. A prompt that says “denied”, a generated config, or absence of a visible change without a positive execution trace is insufficient.

A control claim must state its assurance boundary: a Kilo in-process runtime permission gate is not an OS sandbox, protection from the machine owner, or proof that all tools/aliases/effects are covered. To claim coverage, enumerate the complete claimed action surface and test each relevant entry; unknown aliases, network/MCP paths, secondary tools, path variants, or untested configuration layers prevent a universal claim.

The following conditions require a blocking evidence status for any future required restriction/eligibility claim:

- Target release, client, or Windows environment is unverified or differs from the pinned baseline.
- The effective permission rule, precedence, session/UI override, or reload state cannot be determined.
- The attempted action's actual effect cannot be positively observed or attributed to the target tool.
- Required tool aliases, write paths, external mutation paths, project-controlled overrides, or relevant path forms remain untested.
- A safe test requires production data, real credentials, a live external side effect, or loosening isolation.
- Evidence is only prompt text, rolling documentation, source code, config bytes, inferred behavior, or CLI behavior while the claim concerns effective VS Code runtime enforcement.
- A source or log capture is missing, ambiguous, altered, or contains unredacted sensitive data that cannot safely be retained.

Record such a case as `BLOCKED` at the probe level and keep the material claim at `NEEDS_PROBE`/`UNKNOWN`; do not mark capability `UNSUPPORTED` unless a valid observation demonstrates absence or contrary behavior. A required unsupported or unproven restriction blocks the future translation according to K1 §2.7/§4; optional degradation is not decided by this protocol and requires explicit caller acceptance under the contract.

## 7. Data protection, cleanup, and rollback

- Use only synthetic fixture contents and fake identifiers with no credential format that could be mistaken for a real token. Do not copy logs/transcripts from personal or production sessions.
- Keep raw evidence inside the disposable VM until reviewed. Share only the minimal redacted artifacts required to substantiate each row. Hashes and screenshots must not expose unrelated paths or data.
- On unexpected access outside the fixture, unexpected network activity, secret exposure, or fixture contamination: stop immediately, preserve a minimal redacted incident record, do not retry, and revert/discard the VM snapshot. Mark affected probes `BLOCKED` or `FAIL` according to whether the event is a tested contrary outcome or a safety precondition breach.
- After each run, export only the approved evidence manifest/artifacts; remove fixture contents and test account data by reverting the VM snapshot. At the end, destroy the disposable VM and verify no shared-folder, clipboard, workspace, or account artifacts remain on the host. Do not run cleanup scripts against host/global Kilo settings.
- Rollback means discard/revert the VM snapshot. No rollback procedure may write to, restore, or otherwise modify the operator's normal Kilo/VS Code configuration or any production project.

## 8. Preparation status and open uncertainties

At this design stage, all six matrix rows are **not run**. No Windows VM, VS Code, or Kilo extension was installed or configured; no fixtures were opened; no permission, auto, path, config-discovery, web, MCP, or file-effect action was executed. This document provides no `OBSERVED_LOCAL` evidence. P03 is inspection-only ready; runtime-dependent P01/P02/P04/P05-marker/P06 cases are explicitly blocked until the independent execution gate in §3.3 is met and target-specific config/tool inventories are established. No claim is made that K2-P0 is execution-ready as a whole.

Open uncertainties include the exact UI-exposed config layers and reload triggers at `v7.8.8`; exact VS Code tool IDs/aliases and schemas; safe model/provider invocation satisfying §3.3; effective ask/deny and allow behavior; presence/reachability of an extension auto mode without activating it; target handling of sensitive and external paths, symlinks, and glob normalization; and attributable config-marker discovery. Any unresolved item is `BLOCKED` for its dependent runtime vector, not permission to weaken isolation. K0 and pinned source support a provider/model-mediated tool-call architecture, but the current evidence does not establish a credential-free deterministic tool-call source exercising the installed extension's permission and execution path.

### 8.1 Remediation disposition of K2-P0-R

- **F-01 (invocation precondition):** Partially resolved as a protocol gap; the pinned source path and the required stages are now explicit in §3.3. A viable no-credential, deterministic, exact-runtime invocation method is **not established**. This is an explicit execution blocker, not a claim that such a method cannot exist.
- **F-02 (fixtures/oracles):** Partially resolved with fixed synthetic tree/content, case IDs, input/action/evidence and result criteria in §§3.2, 3.4 and 5. Exact permission syntax, tool IDs/aliases, path-glob comparator/priority, and reload semantics remain pending where source/client evidence does not establish them; dependent vectors are explicitly blocked rather than filled by operator choice.
- The historical K2-P0-R report remains unchanged. This remediated candidate does not change K1, declare K2-P0 approved, authorize K2-P1, or claim `OBSERVED_LOCAL` evidence.

## 9. References

- [K1 translation contract, especially §§2, 4, 7, 8](../../docs/adapters/kilo-translation-contract.md)
- [K1 independent review and K1R-01](../../docs/reviews/k1-independent-translation-contract-review.md)
- [K0 capability matrix](capability-matrix.md)
- [K0 source ledger and evidence-confidence definitions](source-ledger.md)
- [ADR 0007](../../docs/decisions/0007-windows-vscode-target-scope.md)
- [ADR 0006](../../docs/decisions/0006-product-v1-and-adapter-priority.md)
- [Pinned Kilo `v7.8.8` source: session prompt](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/session/prompt.ts)
- [Pinned Kilo `v7.8.8` source: LLM/provider stream and tool definitions](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/session/llm.ts)
- [Pinned Kilo `v7.8.8` source: processor tool-call events](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/session/processor.ts)
- [Pinned Kilo `v7.8.8` source: permission decision engine](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/permission/index.ts)
- [Rolling official docs: local models](https://kilo.ai/docs/automate/extending/local-models) and [OpenAI-compatible providers](https://kilo.ai/docs/ai-providers/openai-compatible) — candidate capability only; not pinned v7.8.8 evidence, not proof of tool-call quality, and not authorization to configure/run a local endpoint.
- [Pinned-source test example: direct ReadTool tests](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/test/tool/read.test.ts) — test harness evidence only, not proof of the installed extension's full model-to-permission-to-tool path.
