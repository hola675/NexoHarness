# NEXOHARNESS K2-F01-D0-R INDEPENDENT REVIEW

**Review outcome:** `BLOCKED` — insufficient independently recovered upstream evidence to conclude that the complete target route and proposed B experiment are technically ready for Governance approval.

**Scope:** Static/documentary review only. No Kilo, VS Code, tests, models, provider, server, probe, or credential was used.

## 1. Identity and scope

This review assesses whether K2-F01-D0 is a sufficient basis to present a minimal, safe feasibility experiment for real tool invocation in Kilo Code `v7.8.8` on Windows + VS Code. It is not a behavioral test, certification, permission finding, implementation authorization, or approval to execute.

The review examined D0's route diagram, alternatives A–E, emphasis on alternative B, threat model, evidence chain, proposed controls, Governance decisions, and readiness conditions. It did not repeat K0/K1/K2-S0 research except where needed to check boundaries. D0 itself remains unmodified.

## 2. Independence

The technical review was performed by a newly started internal agent distinct from D0's author (`ses_eb9ff2b66ffeSUogyzs2s04Ns7`), followed by a focused, separately started source-retrieval pass (`ses_eb9ecbb76ffezBwjTPnEuf2UlZ`). Neither agent authored D0. The review is independent at the **internal technical reviewer** level, but not organizationally or humanly independent; both agents belong to the same internal process. Governance has not ratified this review or D0.

The first reviewer could not recover upstream blobs. The second reviewer retrieved some pinned raw files but could not recover or extract all essential files/line ranges. This was treated as an evidence limitation, not as proof that D0's unverified claims are false.

## 3. Baseline verified

| Item | Verified identity / state |
|---|---|
| D0 candidate | `930e8a925f9d7f495f0f5d2fe2ed85d5601aa3c6` |
| D0 branch | `research/k2-f01-invocation-design` |
| D0 parent | `e703f26ebfa354c978d388f62c2d22e0fa128e18` |
| Review branch base | `930e8a925f9d7f495f0f5d2fe2ed85d5601aa3c6` |
| Kilo source target | `Kilo-Org/kilocode`, `v7.8.8`, `e2887f08e5a6394299c810ba508f358aaf4c5bc3` |

The D0 commit is the local `HEAD` at the start of this review, descends from `e703f26`, and is present on its named origin branch. `git ls-remote` returned `e2887f08e5a6394299c810ba508f358aaf4c5bc3` for `refs/tags/v7.8.8`. The Kilo commit was not available as an object in the NexoHarness clone; the source audit therefore required direct retrieval from the immutable upstream raw/blob URLs.

Relevant state read from the specified records: K2-S0 has a technical static PASS; organizational ratification remains pending; F01 is open; F02 is partially addressed; K2-P0 is not approved; K2-P1 is not authorized; no Kilo adapter is certified. ADR 0007 preserves Windows + VS Code as the target, while the K1 permission contract remains open. No PR or historical report was changed.

## 4. Sources consulted and evidence boundary

Internal sources read: [K1](../adapters/kilo-translation-contract.md), [K2-P0](../../research/kilo/k2-p0-probe-protocol.md), [K2-S0](../../research/kilo/k2-s0-static-inventory.md), [K2-S0-R2](k2-s0-r2-independent-remediation-review.md), [Governance](../model/governance-authority.md), [Assurance](../model/assurance-certification.md), [ADR 0006](../decisions/0006-product-v1-and-adapter-priority.md), and [ADR 0007](../decisions/0007-windows-vscode-target-scope.md).

The second reviewer independently retrieved pinned upstream files for portions of backend start/connection, tool/permission handling, LLM/processor events, provider test helper, `KILO_E2E_LLM_URL`/tool selection, and the Playwright Storybook configuration. This confirms only those retrieved source observations. The reviewer did **not** independently recover/extract the requested `KiloProvider.ts` request lines, `session/prompt.ts` path, the custom provider schema/resolution ranges, or several cited tests. Accordingly, D0's relevant links below are listed as candidate references to finish checking, not as wholly reverified evidence:

Directly retrieved file references include [`server-manager.ts`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/kilo-vscode/src/services/cli-backend/server-manager.ts), [`connection-service.ts`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/kilo-vscode/src/services/cli-backend/connection-service.ts), [`session/tools.ts`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/session/tools.ts), [`permission/index.ts`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/permission/index.ts), [`session/llm.ts`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/session/llm.ts), [`session/processor.ts`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/session/processor.ts), [`tool/registry.ts`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/tool/registry.ts), [`TestLLMServer`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/test/lib/llm-server.ts), and [`playwright.config.ts`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/kilo-vscode/playwright.config.ts). The source-retrieval result did not preserve exact line excerpts for all these files; the behavior attributed below is limited to the directly reported retrieved portions.

- [`KiloProvider.ts` send-to-prompt ranges](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/kilo-vscode/src/KiloProvider.ts#L1336-L1354) and [`session.promptAsync`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/kilo-vscode/src/KiloProvider.ts#L4745-L4771) — **not independently recovered in this review**.
- [`session/prompt.ts`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/session/prompt.ts#L1733-L1864) — **not independently recovered in the requested ranges**.
- [`provider schema`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/core/src/v1/config/provider.ts#L68-L108) and [`provider resolution`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/provider/provider.ts#L1537-L1580) — **not independently recovered**.
- The extension's [`permission handler`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/kilo-vscode/src/kilo-provider/handlers/permission-handler.ts#L90-L150), `prompt.test.ts`, `processor-effect.test.ts`, `llm-native-recorded.test.ts`, `permission-diff.spec.ts`, and `.vscode-test.mjs` were not independently verified in all cited ranges.

All URLs above are fixed to the specified commit. Their presence or the tag lookup does not substitute for the missing direct source check.

## 5. Review of the invocation route

### Partially corroborated source observations

The second reviewer directly retrieved source portions indicating that the VS Code extension starts a bundled CLI backend with a random Basic Auth password and port zero; `ConnectionService` creates an SDK client and carries backend SSE events; session tool contexts connect to Kilo's permission prompt path; permission rules can allow automatically or await a response; the LLM has an AI SDK path and an experimental native path; processor events carry tool-call/result/error parts; and a `providerExecuted` marker is distinct from ordinary local execution. These findings are source-level observations at the pinned SHA, not proof of a Windows installation's effective behavior.

The retrieved code also shows that pending permission prompts can be drained/rejected as part of a separate configuration-operation path. A future ask/reject test must therefore correlate the actual request, actor/reply, session and call IDs; an error/rejection alone cannot be attributed to a human's explicit rejection.

### Essential gaps

Because the client-side `sendMessage` → `session.promptAsync` and session prompt/processor entry were not independently recovered in the required ranges, the full **VS Code webview → backend → provider request → normalized tool-call** chain is not independently established by this review. Likewise, the target-visible custom provider/model selection path and source-level schema for `baseURL`/authentication remain unverified here.

The route must distinguish at least: tool visibility/filtering; a provider response carrying a function/tool call; SDK callback dispatch; local `SessionTools` wrapper; tool-specific `ctx.ask`/permission evaluation; human reply or automatic decision; handler execution; result/error; and fixture effect. Neither a `tool-call` event nor the presence of a handler proves all downstream stages. Provider-executed or synthetic events must not be treated as local guarded tool execution unless the actual handler/permission route is demonstrated.

**Assessment of R-F01-01:** partially corroborated, not fully verified. It is not safe to state that every tool shares one permission path or that every tool prompts. A missing prompt/call is not a deny; it may reflect visibility filtering, no provider call, provider/stream failure, tool resolution failure, an automatic rule, or another path.

## 6. Alternatives A–E

| Alternative | Independently established | Limitation / review disposition |
|---|---|---|
| **A — Kilo tests** | The retrieved `TestLLMServer` source is test infrastructure for scripted responses/tool-call protocol fixtures. The retrieved Playwright config is Storybook/UI testing. | It does not demonstrate the installed extension's complete provider → permission → execution route. Source ranges for the cited extension-host and other tests were not fully retrieved. Do not claim an exhaustive absence of another harness. |
| **B — local simulated provider** | `@ai-sdk/openai-compatible`/`provider.baseURL` are cited by D0 and are plausible mechanisms, but the independent reviewer could not retrieve the configuration schema/resolution source. | Provider selection in the target VS Code UI, exact auth/headers, protocol and streaming compatibility, normal local dispatch, effective permissions, and isolation remain unproven. **Candidate only; not ready.** |
| **C — local model** | No exact pinned model/provider was demonstrated in the independently retrieved subset. | Tool-call fidelity, determinism, hardware, versioning, and effective extension support remain unknown. Not the first deterministic candidate. |
| **D — injection/replay** | Retrieved test source indicates synthetic test paths and/or recorded LLM fixtures. | Test-level injection/replay can bypass the provider, UI, permission response or handler. It is not equivalent to the target route. |
| **E — external provider** | A generic provider/model route is described in D0 but was not fully independently checked here. | Network egress, credentials, privacy/retention, cost and output variation make it unsuitable as the default deterministic feasibility mechanism. No external provider was used. |

The retrieved `KILO_E2E_LLM_URL` path affects `apply_patch` selection/visibility; it is not evidence that the value configures a provider endpoint or a usable VS Code E2E invocation harness. D0 correctly treats that distinction as unresolved.

## 7. Alternative B evaluation

**B does not currently merit authorization as an experiment.** It remains the strongest *hypothesis to investigate* because a scripted provider could, in principle, send a protocol-level tool-call response to a normal Kilo session. The checked-in test helper establishes only its own test-server behavior; generic SDK support or `baseURL` alone would not establish that the installed extension can select the provider or that a response is accepted and dispatched through the normal permission path.

Before proposing a behavioral B probe to Governance, the source review must verify the exact provider schema and resolution, client-visible selection route, selected model/runtime branch, tool definitions sent, response/chunk/finish/error mapping, authentication behavior, local-vs-provider-executed tool distinction, and correlation IDs. After that, Governance must separately decide whether to authorize a tightly bounded runtime feasibility experiment. No endpoint or mock was implemented or started.

## 8. Security review

D0's proposed controls are appropriate **requirements**, not controls already tested. The independent source subset confirms a local backend client/auth path and proxy/environment handling; it does not establish a safe effective listener or egress boundary. `127.0.0.1` on the client does not prove the server binds only to loopback. A local provider listener is a separate trust surface, reachable by other local processes unless constrained. Kilo permission gates are not an operating-system sandbox.

Any later execution requires a disposable Windows VM/snapshot, dedicated unprivileged user, no host folders or production profile/data, synthetic workspace, no production credentials, outbound network deny by default, verified server/provider bind and process identity, explicit proxy/TLS settings, no persistent `always` approvals or automatic mode, minimum redacted evidence, stop-on-deviation, and rollback by VM revert/destruction. If egress, listener exposure, process identity or credential separation cannot be demonstrated without weakening containment, stop and retain `BLOCKED`.

## 9. Evidence contract

The proposed chain is an appropriate **evidence objective**, not instrumentation already guaranteed by Kilo:

`run ID → session ID → user/message IDs → provider request/response → tool-call ID/name/args → permission decision/request/reply → local handler result/error → fixture before/after state`.

D0 notes that provider-request-to-Kilo-call correlation is not established by a built-in ID. A mock-assigned request nonce echoed into a unique tool-call ID/argument could correlate a **scripted provider response** with a backend call, but must be labeled mock correlation, not model-generated behavior or a Kilo-generated request ID. Prove uniqueness and the join for each case; if a link is absent, the run is invalid for the full-path claim.

Keep separate outcomes for provider/network error, no emitted tool call, unavailable/filtered tool, malformed/unknown tool, permission deny, human reject, auto-allow, handler failure, successful handler result, and fixture effect. Missing UI, missing logs, or no change in the fixture alone is never evidence of denial.

## 10. Conditional minimum experiment proposal

Because source verification is incomplete, the following is a **conditional proposal for a later Governance decision**, not an execution-ready plan:

### Phase 0 — static readiness (no runtime)

Finish pinned-source verification of provider configuration/selection, tool IDs/arguments, the chosen LLM stream branch, local handler/permission route, effective decision observability, and config syntax/precedence needed by the selected case. Define the network and snapshot controls, evidence redaction and correlation method. Any missing item blocks the behavioral phase.

### Phase 1 — one positive read sentinel

If separately authorized, use B to return a genuine protocol-level scripted tool-call response for exactly one verified `read` tool and a unique synthetic sentinel file. Require matching provider request/response, Kilo session/message/call IDs, direct allow provenance, local handler result containing the sentinel, and unchanged fixture hashes. Do not add writes, shell, task, MCP, web, credentials or other tool IDs.

### Phase 2 — permission negatives, separately approved cases

Only after Phase 1 is valid and exact rule syntax/visibility is known, run (a) an explicit `deny` case and (b) `ask` followed by a human `reject` as distinct fresh-snapshot cases. Prefer the same read-only operation if Kilo exposes a direct decision; if visibility filtering prevents an actual provider-originated call from reaching the permission evaluator, the case is `BLOCKED`, not a deny. Require the specific decision/request/reply, correlated rejected/error outcome, and unchanged fixture. Do not infer permission behavior from an unsupported tool error or absent call.

This staged sequence is safer and more discriminating than treating read, deny and ask/reject as one compound run. The denial and human rejection cases must not be combined: they prove different decision paths. No write vector is needed for the first viability experiment.

### Stop conditions

Stop immediately and revert the snapshot for an unexpected tool/name/argument/path, non-synthetic content, unexpected permission action, automatic/persistent approval, provider/runtime error that breaks correlation, non-loopback/public listener, outbound network attempt, proxy/TLS deviation, credential exposure, fixture mutation outside the oracle, process mismatch, or missing evidence link. Do not reinterpret a stop as pass/fail for permission semantics; mark the affected case `BLOCKED` or `INVALID` according to its cause.

## 11. Governance decision table

These are proposals for Governance; none is an approved decision.

| Decision | Option proposed | Evidence | Risk | Approval required |
|---|---|---|---|---|
| Mechanism of invocation | B, local scripted protocol provider, as a feasibility candidate only; no D0 execution until source gap is resolved | Test helper source partially retrieved; custom-provider schema/UI/runtime path not independently verified | SDK support may not be exposed or compatible in the VS Code target; mock event may not traverse normal permissions | Yes — first approve completion of the static source gate; behavioral experiment requires a separate explicit authorization |
| Isolated environment | Disposable Windows VM, snapshot, dedicated unprivileged account, synthetic workspace, no host shares | D0 requirements; no runtime isolation evidence | Host access or contaminated user/global config invalidates claims | Yes |
| Network exposure | Deny egress; verify backend and provider listener binds and process identity; allow no local endpoint until its exposure is proven | Backend client/auth source partially retrieved; actual bind/effect untested | Loopback is reachable locally; proxies or misbinding can expose data | Yes |
| Authorized tools | Phase 1 one `read` only; later separate deny and ask/reject read-only cases; no write/bash/task/MCP/web | K1/K2-P0 require tool-specific proof; exact effective syntax and IDs unresolved | Visibility filters/auto-allow may mask the decision path | Yes, including exact IDs, args, rules, and case order |
| Evidence treatment | Synthetic inputs only; capture IDs, decision, result and fixture hashes; redact prompt/header/token; retain minimal artifacts | D0 correlation contract; provider-request join not a built-in guarantee in evidence reviewed | Secrets, personal paths, or false joins can invalidate evidence | Yes |
| Stop criteria | Immediate stop + VM revert for unexpected tool/path, network, credentials, permission mode, process, side effect or lost correlation | D0 security/rollback design and K2-P0 blocked criteria | Continuing after a deviation contaminates results and expands scope | Yes |

## 12. Findings and severity

| ID | Severity / disposition | Finding |
|---|---|---|
| **H-01** | **High — Blocking** | Independent recovery of pinned upstream blobs was incomplete. The cited client prompt bridge, session-prompt entry and custom provider schema/resolution are essential to R-F01-01/02/03; the source facts were not fully independently verified. This review cannot accept the route or B on citation presence alone. |
| **H-02** | **High — Blocking for execution** | B's extension selection, complete protocol/auth/runtime behavior, local permission traversal and safe listener/egress are not demonstrated. B remains a feasibility hypothesis, not a ready mechanism. |
| **M-01** | **Medium — Required condition** | The evidence chain is a target contract, but correlation of a provider request to Kilo session/call is not built-in evidence established by this review. A mock-supplied nonce is mock-scoped and must be validated; it cannot be called model-generated evidence. |
| **M-02** | **Medium — Required condition** | Pending prompts may be rejected/drained on a separate VS Code configuration-operation path. Distinguish that from a human ask/reject response by event/request/reply identity and prohibit concurrent config writes in a future case. |
| **M-03** | **Medium — Required sequencing** | Read, explicit deny, and ask/reject test different paths. The latter two require verified rule syntax, visibility behavior and direct decision evidence; stage them separately after one valid positive read, not as a compound initial case. |

No finding states that D0's route is false; the principal block is the reviewer’s insufficient upstream coverage. No runtime regression or target behavior is claimed.

## 13. Verdict

**`BLOCKED`.** Under the specified rubric, an essential condition of the design—the complete fixed-source route and custom provider path—could not be directly checked by the independent reviewer. This verdict is not an upstream FAIL, not proof that B is impossible, and not evidence of Kilo permission behavior. It means this review cannot yet certify that D0 is a sufficient, independently verified experiment proposal.

**Alternative recommendation:** retain B as the only candidate to finish assessing; do not recommend it as selected, compatible, safe, ready, or approved. The immediate next action is a completed independent static-source verification, followed by a Governance decision on whether to authorize the staged experiment. No execution is authorized by this report.

## 14. F01 / F02 state

- **F01:** `OPEN / BLOCKED`. No runtime evidence; no mechanism closure.
- **F02:** partially addressed; exact tool IDs, schemas, effective permission rules, provider selection, correlation and observable target outcomes still need evidence.
- **K2-S0:** technical static PASS only; organizational ratification remains pending.
- **K2-P0:** not approved for execution.
- **K2-P1:** not authorized.
- **Kilo adapter:** not implemented/certified.
- **PR #1:** unchanged and not merged.

## 15. Validations

Validation results for this review artifact:

- `npm run verify:core`: **passed** — typecheck, repository validation, schema compilation (13 kinds; 13 valid/13 invalid fixtures), canonical integrity (8 entities), and 162 tests passed (0 failed/cancelled/skipped/todo).
- `git diff --check` / staged `git diff --cached --check`: **passed**; no whitespace errors in the report diff.
- Pre-commit scope check: the only changed path is this newly added report, on a branch based exactly on D0 commit `930e8a925f9d7f495f0f5d2fe2ed85d5601aa3c6`; no candidate, K1, K2-P0, canonical, adapter, installer, or `dist/` changes.
- GitHub Actions for candidate branch `research/k2-f01-invocation-design`: **0 workflow run results** at review time, per the repository's public branch-filtered Actions page. No CI pass is inferred. The review branch is not yet published at report creation.
- No Kilo/VS Code/probe/model/provider/server execution occurred.

## 16. Next gate

1. An independent reviewer must complete direct recovery and line-by-line comparison of the missing upstream blobs at `e2887f08e5a6394299c810ba508f358aaf4c5bc3`; amend or qualify D0 claims if the source differs.
2. Re-review whether D0's source-grounded design is sufficient to **submit a conditional feasibility proposal** to Governance. This is still separate from authorization.
3. Governance may then decide whether to authorize Phase 0 static readiness, or separately approve the staged runtime experiment with exact artifacts, rules, observer, network boundary, cases, stop criteria and rollback.
4. Only a later authorized, fully evidenced target run can change F01's state. Keep K2-P0 unapproved and K2-P1 blocked unless Governance makes a distinct decision.
