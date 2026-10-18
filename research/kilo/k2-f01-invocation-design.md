# K2-F01-D0 — Kilo Code reproducible tool-invocation design

**Status:** Technical design for independent review and Governance decision; no execution is authorized.
**Target:** Kilo Code `v7.8.8`, Windows + VS Code.
**F01:** `OPEN`.  **F02:** partially addressed.  **K2-P0:** not approved.  **K2-P1:** not authorized.
**Decision:** `BLOCKED` — no invocation mechanism is yet verified for the target client with the required isolation and evidence.

## 1. Objective, scope, and baseline

This document designs, but does not implement or execute, a safe and repeatable way to produce a real provider-originated tool call through the Kilo Code VS Code client and the backend's normal session, permission, and tool-execution path. Its purpose is to identify what would have to be authorized and proven before a future K2-P0 experiment, not to authorize that experiment or an adapter.

The NexoHarness baseline is commit `e703f26ebfa354c978d388f62c2d22e0fa128e18`. It contains the corrected static candidate `0993be9cc78dc7717d0d849cc0370247b9c4fc6e` and its internal technical PASS review. `0993be9` descends from original candidate `952a8e3e7be6139bb7eccd377a80e7440b343f93`; the historical FAIL report `a86cb60a4fe3603be142171549bd26d353c9582b` is preserved on its original history. The Kilo upstream repository is `Kilo-Org/kilocode`, pinned to commit `e2887f08e5a6394299c810ba508f358aaf4c5bc3`; `refs/tags/v7.8.8` resolves to that commit.

The design is constrained by [K1](../../docs/adapters/kilo-translation-contract.md), [K2-P0 protocol](k2-p0-probe-protocol.md), [K2-S0 inventory](k2-s0-static-inventory.md), its [independent remediation review](../../docs/reviews/k2-s0-r2-independent-remediation-review.md), [capability matrix](capability-matrix.md), [source ledger](source-ledger.md), [Governance authority model](../../docs/model/governance-authority.md), and [ADR 0007](../../docs/decisions/0007-windows-vscode-target-scope.md). Those documents remain unchanged.

## 2. State of F01

R2-F01 remains open: no deterministic, authorized mechanism has been demonstrated to cause a real tool call through the same Kilo Code Windows + VS Code route that an eventual product claim would cover. F02 remains partially addressed; this design does not infer its closure from source code.

The source confirms a normal code path from the VS Code webview request into Kilo's session backend, a provider/model stream, tool dispatch, permission handling, and tool results. That establishes an architecture to investigate, not that a provider fixture, model, event, permission decision, or side effect has been exercised in the installed extension. K2-S0 has a technical static-evidence PASS, but organizational Governance ratification is not established; it is not a target-runtime certification. No Kilo execution, VS Code launch, probe, provider, model, or local listener was used for this work, and no adapter is certified.

## 3. Sources and method

The upstream source was read at the fixed commit above, using immutable GitHub commit/blob URLs. No source was copied into this repository. Internal records were read at the pinned NexoHarness baseline. Findings are classified as:

- `VERIFIED_SOURCE`: directly demonstrated by code or a checked-in test fixture at the fixed SHA; it says nothing by itself about the installed target.
- `INFERRED`: a design implication of source, not a proven target behavior.
- `UNKNOWN`: the pinned-source inspection did not establish the claim.
- `NEEDS_PROBE`: it can only be established by a separately authorized target experiment.

Source-level tests are discussed as evidence of test infrastructure only; no Kilo test suite was executed. `KILO_E2E_LLM_URL` was examined as a candidate, not treated as a documented extension setting.

## 4. Reconstructed invocation path

The conceptual path is substantially supported by the pinned implementation, with two separate transport legs (VS Code to its local backend, and backend to the selected model provider):

```text
Human action in Kilo VS Code webview
  → KiloProvider handles `sendMessage`
  → SDK `session.promptAsync` request to extension-managed local backend
  → session prompt resolves session/agent/model and prepares context/tools
  → selected LLM runtime sends request to selected provider/model
  → provider response is normalized to Kilo LLM events
  → processor receives `tool-call` (tool name, call ID, arguments)
  → registered tool wrapper/handler; tool-specific permission checks
       → ALLOW / ASK (human response via permission API) / DENY/error
  → handler executes only when its runtime path permits it
  → `tool-result` or `tool-error`, message/part state and events
  → VS Code receives backend events; fixture state and hashes provide effect evidence
```

This diagram is not a claim that every tool has an identical permission check, that every tool call prompts a human, or that Kilo permissions sandbox the operating system. Provider-executed tools are a distinct case: a future experiment must show that its chosen call was locally dispatched through the intended guarded tool handler, not merely marked `providerExecuted` in a test event.

## 5. Components and observable points

| Stage | Source-confirmed behavior | Useful correlation / limitation |
|---|---|---|
| VS Code start | `ServerManager` starts the extension's bundled CLI with `serve --port 0`, sets `KILO_CLIENT=vscode`, and supplies a random backend password. | Backend PID, process identity, selected workspace, port/bind address and launch mode must be recorded. The VS Code extension's launch is not itself evidence of a tool call. |
| Webview request | `KiloProvider` handles `sendMessage` and calls SDK `session.promptAsync`, passing session/directory/message IDs and an optional selected provider/model. | Preserve the client, session ID and message ID; establish they belong to the same test run. |
| Backend connection/events | `ConnectionService` creates the SDK client for `http://127.0.0.1:<port>` with Basic Auth and subscribes to backend SSE. Permission events are associated with directory/session state. | A loopback client URL does not prove the server only binds loopback. The effective listener must be inspected in an authorized future experiment. |
| Prompt/provider | The session prepares messages and `SessionTools.resolve` output, then `LLM.stream` calls the chosen runtime. The default path shown uses AI SDK `streamText`; an experimental native runtime may be selected and may fall back. | Record provider ID, model ID, runtime branch, request/response correlation, and any selected custom provider config. Do not infer the final wire payload from model metadata. |
| Tool dispatch | In the default SDK path the `tools` map and `toolChoice` are passed to `streamText`. The processor records tool-call ID/name/input and observes result/error events. | An assistant text message or provider response alone does not prove dispatch or execution. Require matching call ID and execution evidence. |
| Permission | `SessionTools` constructs a permission-aware context carrying session, message and call IDs; tool handlers can call `ctx.ask`. Permission evaluation may auto-allow, ask, deny, or fail. Human replies use the permission request ID. | A missing permission prompt is not proof of `deny`; it may reflect no tool call, a provider error, a visible-tools filter, an automatic rule, or another path. Capture the direct decision where available. |
| Result/effect | Processor stores tool part state and success/error under the call ID; backend events flow to the extension. | Prove result and effect independently with a synthetic fixture's exact before/after state and content hash. |

## 6. Alternative A — existing Kilo testing mechanisms

**Evidence:** `VERIFIED_SOURCE` for backend test helpers, VS Code UI test infrastructure and an extension-host sample test; `UNKNOWN` for a VS Code E2E tool-invocation mechanism using `KILO_E2E_LLM_URL`.

At the pinned SHA, `packages/opencode/test/lib/llm-server.ts` contains a deterministic `TestLLMServer`/`Reply` helper that queues responses and emits scripted streaming responses, including OpenAI Chat-style tool-call chunks and Responses-style function-call events. Its helper can construct tool-call IDs/arguments and explicit finish/error/hang/reset cases. `packages/opencode/test/session/prompt.test.ts` configures a test provider's `baseURL` to that helper and directly calls `SessionPrompt.prompt`/`loop`. Its example tool-loop session explicitly gives the session `permission: "*"`, `action: "allow"`; it demonstrates a backend test route, not VS Code permission prompting, rejection, or installed extension compatibility. Other session tests replace the `LLM.Service` directly with synthetic events. The recorded-native LLM tests replay recorded provider traffic in an LLM-specific harness; their test-side tool execution is not the VS Code permission handler.

The extension package also has VS Code tests, but the located tests do not close F01: `tests/unit` contains isolated unit cases; `tests/*.spec.ts` is Playwright against a Storybook build served on localhost (the permission-diff spec navigates to a component story); and `src/test/extension.test.ts`, run by the VS Code test host, is only the starter sample assertion. No provider request, Kilo session, permission decision or tool side effect is exercised by those cited tests. This is a bounded finding about the inspected suites, not proof that no other harness exists anywhere in the upstream repository.

`KILO_E2E_LLM_URL` is read in `KiloToolRegistry.usePatch` to force selection of the patch tool. That code does not itself configure a provider endpoint or document a URL protocol. The inspection did not establish a declaration/caller that injects it into the VS Code bundled process, a supported test build, or a complete VS Code E2E test. These remain `UNKNOWN`; the variable name is not evidence that this mechanism exists.

**Assessment:** the checked-in test machinery is useful for backend/component coverage and for understanding scripted provider response formats. It does not by itself preserve the extension-originated request, client/provider selection, UI permission decision, and target tool execution required by F01. Direct event injection into the processor is specifically insufficient evidence of execution.

## 7. Alternative B — deterministic local simulated provider

**Evidence:** `VERIFIED_SOURCE` for configurable provider/model fields and an OpenAI-compatible SDK adapter; `INFERRED` that a local endpoint could use that route; `NEEDS_PROBE` for actual VS Code compatibility and permission/effect behavior.

At this SHA the provider configuration schema includes provider/model `npm` and `api` fields, arbitrary provider options, and `apiKey`/`baseURL` options. The provider registry includes `@ai-sdk/openai-compatible`, and provider resolution passes a configured `baseURL` and options into the selected SDK. Internal tests demonstrate one test-server protocol, but not every provider protocol or an arbitrary mock's compatibility.

A future B candidate would have to return a genuine provider-protocol response containing a controlled tool-call ID, name and arguments to a Kilo session started in the actual VS Code extension. Kilo—not the test server—would then have to normalize the response, dispatch the tool, invoke its normal permission path and execute/reject it. The checked-in test helper demonstrates scripted SSE chunks, tool-call arguments and selectable finish/error/hang/reset outcomes; this bounds what the internal fixture models, not what an arbitrary OpenAI-compatible endpoint or installed SDK accepts. The configuration schema allows `apiKey` and `baseURL`, but does not establish whether a chosen custom model is exposed by the VS Code selection UI, which authentication headers a target route emits, or what auth (including an empty/dummy key) the SDK requires. No listener, server, model, config, or request was created here. The source does not prove that every custom provider config is exposed/usable in the installed extension, that a chosen model API works with its UI, or that tool calls stream and terminate correctly on Windows.

**Assessment:** this is the strongest source-grounded feasibility candidate, not a selected or ready mechanism. Compatibility, auth behavior, protocol completeness, process/network isolation, and full permission/effect traversal remain unverified.

## 8. Alternative C — local model without production credentials

**Evidence:** `INFERRED` for possible use of a configured local/custom endpoint; `UNKNOWN` for a specific local model's tool-call capability, determinism, Windows+VS Code support, or repeatability.

The generic provider/model schema and SDK paths are not proof that a particular local-model provider is bundled, selectable by the extension, or implements Kilo's expected tool-call protocol. A model could vary its decision to call a tool, choose invalid names/arguments, or omit calls; a resulting absence cannot distinguish model behavior from a Kilo permission denial. Hardware, local service lifecycle, model/version pinning, model license, and offline networking are also unresolved. No model was installed or invoked.

**Assessment:** local inference may avoid production provider credentials and external request disclosure, but its behavior is not deterministic merely because it is local. It is not a F01 mechanism until the exact provider/model, tool-calling protocol, repeatability envelope and extension route are evidenced.

## 9. Alternative D — internal injection or replay

**Evidence:** `VERIFIED_SOURCE` for test-level LLM event injection and recorded/replayed LLM tests; `UNKNOWN` for any mechanism that preserves the complete installed VS Code → provider → permission → tool path.

`processor-effect.test.ts` supplies a replacement `LLM.Service` that emits preconstructed events, including a `tool-call`/`tool-result` pair marked `providerExecuted: true`. This can exercise processor state/error handling, but the test event is not a provider-originated VS Code tool call. `llm-native-recorded.test.ts` runs recorded LLM responses through a lower-level test driver and inline test tool callback; it does not use the extension webview and Kilo permission reply flow. Directly invoking a registered tool handler would bypass both provider-originated call evidence and the permission route.

**Assessment:** useful for isolated regression tests; insufficient for K2-P0's target claim. A future in-process injection may only qualify if it is shown to retain the actual VS Code session, provider request/response, permission decision and tool handler. No such seam is verified here.

## 10. Alternative E — external provider (comparison only)

**Evidence:** `VERIFIED_SOURCE` that v7.8.8 supports multiple provider SDK paths and obtains provider/model/auth from session state; `NEEDS_PROBE` for the selected external provider's target behavior.

This path requires internet egress and normally provider authentication; provider-side retention/processing, cost/quota and model updates are service-dependent risks. Less control over responses than a scripted reply is `INFERRED`, not a measured result. It is not the default recommendation and no external account, personal/production credential, or provider request was used. A later investigation would require an explicitly authorized non-production account/key, a fixed provider/model/API, privacy/retention approval, strict egress allowlisting and a reproducible provider response. Those dependencies make it weaker than an isolated scripted endpoint for the intended deterministic permission study.

## 11. Comparative matrix

Each cell is about the alternative as a future K2-F01 invocation mechanism, not just whether related source code exists. `VERIFIED_SOURCE` is limited to the parenthesized code/test fact; target claims remain separate.

| Criterion | A — Kilo tests | B — local mock provider | C — local model | D — internal injection/replay | E — external provider |
|---|---|---|---|---|---|
| Evidence in v7.8.8 | `VERIFIED_SOURCE` — scripted test server/tests | `VERIFIED_SOURCE` — provider config/SDK route | `INFERRED` — generic endpoint only | `VERIFIED_SOURCE` — LLM test seam/recordings | `VERIFIED_SOURCE` — provider SDK registry |
| Compatible with VS Code | `UNKNOWN` | `NEEDS_PROBE` | `NEEDS_PROBE` | `UNKNOWN` | `NEEDS_PROBE` |
| Traverses real permissions | `INFERRED` — backend tests, example uses `allow *`; no target UI | `NEEDS_PROBE` | `NEEDS_PROBE` | `UNKNOWN` — direct seams can bypass it | `INFERRED` — same backend path only if normal tool dispatch occurs |
| Controlled tool calls | `VERIFIED_SOURCE` — test helper can script protocol replies | `INFERRED` — endpoint could script reply; runtime not tested | `UNKNOWN` | `VERIFIED_SOURCE` — test events only, not target call | `UNKNOWN` — output varies by external model |
| Repeatability | `VERIFIED_SOURCE` — test fixture queue | `INFERRED` — deterministic stub feasible, not proven in client | `UNKNOWN` | `VERIFIED_SOURCE` — replay/unit cases only | `UNKNOWN` / weak `INFERRED` |
| No production credentials | `INFERRED` — internal test path | `INFERRED` — local endpoint could avoid provider keys; SDK/auth still to verify | `INFERRED` — local service could avoid external key | `INFERRED` — replay may avoid live key | `UNKNOWN` — needs authorized non-production auth |
| Network isolation | `UNKNOWN` for VS Code target | `NEEDS_PROBE` — loopback is not inherently isolated | `NEEDS_PROBE` — local model service boundary | `INFERRED` — test replay may avoid live provider; not target | `NEEDS_PROBE` — external egress required |
| Surface of trust | `UNKNOWN` for installed client | `NEEDS_PROBE` — listener, credentials, config, processes | `NEEDS_PROBE` — model/service/host access | `UNKNOWN` for full target route | `NEEDS_PROBE` — provider and credentials |
| Instrumentation | `VERIFIED_SOURCE` — test hits/fixture streams | `VERIFIED_SOURCE` for Kilo event IDs; provider/runtime correlation `NEEDS_PROBE` | `VERIFIED_SOURCE` for Kilo events; model trace `NEEDS_PROBE` | `VERIFIED_SOURCE` inside tests only | `VERIFIED_SOURCE` for Kilo event IDs; provider trace `NEEDS_PROBE` |
| Complexity | `INFERRED` — low for backend tests, high for client bridge | `INFERRED` — medium/high (protocol, process, network, auth) | `INFERRED` — high (model, hardware, versioning, network) | `INFERRED` — low for tests, high to preserve target semantics | `INFERRED` — medium/high (auth, privacy, network, repeatability) |
| Limitation blocking F01 | `UNKNOWN` extension/client equivalence | `NEEDS_PROBE` target/config/permission chain | `UNKNOWN` model behavior and exact endpoint | `UNKNOWN` full-path preservation | `NEEDS_PROBE` privacy/auth and target proof |

## 12. Threat model and trust boundaries

This section specifies future requirements; it does not claim the controls exist or have been tested.

| Boundary / threat | Required future control | Evidence needed before reliance |
|---|---|---|
| Host and VS Code extension host share the user's access; a tool or extension failure could affect the host. | Disposable Windows VM/snapshot, dedicated unprivileged test identity, no host folders, credentials, clipboard secrets or production accounts. | VM isolation and account privileges reviewed; no shared-folder path reachable from the test workspace. |
| Kilo backend is a local HTTP service; its VS Code client uses `127.0.0.1`, but the server listener takes a separately resolved hostname. | Start from a clean test user/config; confirm actual listener address/port and process identity. Fail closed if it listens on a non-loopback interface. | Runtime listener inspection in an authorized probe. Never infer bind scope from the client URL. |
| A mock/local provider listener can be reached by other local processes and can emit arbitrary tool calls. | Bind only to a loopback interface and exact port if authorized; restrict network/process access; validate requests and reject unexpected methods/models/tool names/arguments. If OS policy cannot constrain the listener, do not use this design. | Independent network review and evidence no LAN/public exposure or unexpected local clients. `localhost` is not itself a security boundary. |
| Provider SDK, model selection, proxy environment, or extension configuration can send prompts/credentials outside the VM. | Deny outbound egress by default; allow only the exact documented path. Clear proxy variables/configuration and external provider credentials. The source forwards VS Code proxy/no-proxy settings to the child; it can also set `NODE_TLS_REJECT_UNAUTHORIZED=0` when VS Code `proxyStrictSSL` is disabled. Keep TLS verification enabled and proxies disabled in the test profile. | Effective firewall/VM egress policy and process environment captured; no external DNS/HTTP path succeeds. |
| Kilo tool permissions may be overridden, auto-approved, or narrower than the OS boundary. | Use a disposable config, minimal tool surface, human-only `once`/`reject` responses; never persist `always`. Treat Kilo permission as an application runtime gate only. | Direct permission evaluation/reply and actual effect evidence; VM filesystem/process/network isolation remains the containment layer. |
| Tool call may target an unexpected path or invoke a higher-effect tool. | Synthetic workspace only; explicit file allowlist and scratch directory; no shell, MCP, network or external-directory tools in initial vector set. | Tool name, exact args, working directory and file effect tied to one call ID. |
| Logs/events may contain prompt contents, paths, API keys, backend password, provider token or personal data. | Use synthetic prompts/fixtures. Capture only required IDs, decision metadata, event type, time and hashes; redact request headers/tokens and content. Kilo's generated backend password is an ephemeral secret; do not record its value. | Pre/post capture review; secret scan and retention/deletion record. |
| Failed or interrupted runs may leave state or processes. | Restore VM snapshot or destroy VM and test profile after each run; stop child/provider processes; retain a manifest/hashes only. | Successful rollback and no residual files/processes in the disposable environment. |

The VS Code extension source generates a random password for its bundled CLI backend and starts it with `serve --port 0`; the server manager forwards `HTTP_PROXY`/`HTTPS_PROXY`/`NO_PROXY` derived from VS Code settings. Those facts increase the need for a clean process/network profile; they are not proof of network isolation. Kilo's permission mechanism is not an operating-system sandbox, consistent with K1 §4 and ADR 0007.

## 13. Future environment requirements

Before a separately authorized probe, require:

1. A disposable, snapshotted Windows VM; exact Windows build, VS Code build, extension version/package hash and Kilo backend binary hash recorded.
2. A fresh local user profile with no personal/global Kilo settings, tokens, VS Code sync, extensions, provider credentials or production workspace. Import only an explicitly reviewed fixture config.
3. A synthetic repository containing only the test fixture and scratch path; no host share, user home mapping, secrets, symlink to host, or writable project outside the VM.
4. Network deny-by-default. If B or C is selected, permit only its reviewed process/endpoint path and exact loopback port; demonstrate the listener is loopback-only and not proxy-routed. If those constraints cannot be made effective, remain blocked.
5. Separate process inventory for VS Code, extension host, Kilo CLI backend, provider/mock/model and observer. Use least privilege and record executable hashes and parent/child PIDs.
6. Provider configuration isolated to the synthetic profile. Use no production credentials. Any dummy/synthetic API key or Kilo-generated session password must be specifically documented, protected in transit, excluded from logs and destroyed at rollback.
7. Telemetry/auto-approval/autonomous mode/MCP disabled unless a separately approved case requires them. Ensure permissions do not persist `always` rules between runs.
8. Independent observer for required evidence, fixture hashes, permission event/request IDs and cleanup; no new canonical behavior or adapter artifacts.

## 14. Evidence contract for an actual invocation

A future run is valid only if one correlatable chain establishes each item:

1. **Target identity:** VS Code started the pinned Kilo extension/backend on the recorded disposable workspace; process and build hashes match the approved target.
2. **Provider selection:** exact provider/model and runtime branch (AI SDK or native) are recorded; the selection was made in the Kilo VS Code session, not a CLI/unit harness.
3. **Provider request:** the authorized provider endpoint received a request attributable to the test run. Record its local request ID and time, not secrets or the full prompt. Source logs selected provider/model, and Kilo session/message IDs exist on the client/backend event route; pinned source does not prove an end-to-end provider-request-to-call correlation ID for a normal successful request. For B, a stub may assign a per-request nonce and echo it in a synthetic tool-call ID/argument so its request log can be joined to Kilo's call event. Establish and validate this join before relying on it.
4. **Provider protocol call:** preserve the exact authorized provider (or, for a future B case, the authorized stub's) response evidence showing tool-call ID, tool name and arguments, correlated to the request. If a stub supplies it, describe it as a scripted provider-protocol response, not a model-generated decision. Prose saying “I will call a tool” does not count.
5. **Backend receipt:** observe the matching Kilo session/message and processor `tool-call` with the same call ID/name/arguments. Exclude synthetic processor events and provider-executed calls that do not run the intended local handler.
6. **Permission decision:** record the matching allow decision or permission request ID and an interactive human `once`/`reject` response. For automatic `allow`/`deny`, capture direct rule/decision evidence. Do not treat missing UI as denial.
7. **Execution outcome:** observe handler execution start and its success/error associated with the call ID; distinguish a provider error, parsing failure, unavailable tool, permission denial and handler error.
8. **Fixture effect:** compare exact before/after fixture state and cryptographic hashes. A successful read should match a unique synthetic sentinel; a permitted write should change only the approved scratch bytes; rejected/denied operations must leave the fixture unchanged.
9. **Correlation:** retain session ID, user message ID, assistant message ID, tool call ID, permission request ID (when present), provider request/run nonce, timestamps and fixture identifier. Any missing link invalidates that case as evidence of the complete path.
10. **Reproducibility and rollback:** restore clean VM snapshot, repeat the approved case from the same manifest, compare event sequence and effects, and verify rollback after each run. A single run is not enough to establish repeatability.

The full provider request/response can contain sensitive prompts or keys; keep evidence limited to synthetic data and sanitized protocol fields. Hashes establish fixture state, not that Kilo made the call; events establish a call/decision, not a real-world side effect.

## 15. Proposed positive and negative controls

These are design vectors only; they are not permission, a probe plan approval, or an instruction to execute.

| Control | Expected evidence | Invalid interpretation to avoid |
|---|---|---|
| Positive read of a unique synthetic fixture file, under a pre-approved read rule | Provider response with exact `read` tool call; matching backend call ID/input; direct allow provenance; handler result contains the fixture sentinel; sentinel matches fixture hash manifest. | Text claiming it read the file, or only a provider tool-call payload. |
| Positive write to a disposable scratch file under a pre-approved write rule | Matching provider and backend call IDs/args, direct allow, handler completion, expected byte-for-byte scratch content/hash, no other path changed. | Any write outside scratch, or permission `allow` without observed handler effect. |
| Ask then human reject on a separate scratch operation | Matching tool call → `permission.asked` request ID with matching session/call metadata → interactive `reject` → tool error/rejected outcome → unchanged fixture hash. | No ask event/no tool call/provider error as evidence of denial. |
| Explicit deny-rule control | Matching provider and backend tool call, direct deny decision/error associated to that call, no handler effect, unchanged fixture. | Merely configuring `deny`, or absence of a model-generated call. |

The initial approved scope, if later authorized, should use only the smallest read/write fixture vectors in the existing K2-P0 protocol, no bash/MCP/network tools, no provider-generated arbitrary paths, and no persistent `always` approvals. K2-P0 currently remains unapproved; this section does not change it.

## 16. Recommendation / decision

**Decision: `BLOCKED`. No alternative is recommended as ready for K2-P0.**

Alternative B is the most plausible feasibility candidate because v7.8.8 has a configurable provider/model path and a checked-in scripted test provider. That is enough to justify asking Governance whether to authorize a separate feasibility investigation, but not enough to claim it works in the installed Windows + VS Code extension, preserves its actual UI permission route, or is safely isolated. A/C/D/E have at least the same or greater unresolved target gaps. Do not implement or run B based on this design.

Evidence required to revisit the block: exact extension-visible custom provider selection/configuration; a pinned protocol-compatible response that Kilo accepts from that endpoint; proof the selected VS Code session uses the ordinary provider/runtime branch; direct permission decision and handler execution/effect correlation; and a reviewed Windows VM/network isolation plan. If those facts cannot be proven without a special build or bypass seam, document loss of representativeness and keep F01 open.

## 17. Risks and uncertainties

- Whether `KILO_E2E_LLM_URL` has a caller beyond the verified `usePatch` branch, how it is set, and whether it affects an extension E2E harness: `UNKNOWN`.
- Whether a user-configured provider `baseURL` is accepted and selectable in the exact VS Code client, including model IDs, auth and tool-call streaming: `NEEDS_PROBE`.
- Whether a test fixture can be adapted without changing provider/runtime behavior, including custom headers, streaming termination, retries, tool-call repair and error mapping: `NEEDS_PROBE`.
- Whether an actual Windows + VS Code permission `ask`/`reject` and `allow`/`deny` path correlates to the same tool-call ID and has the expected fixture effect: `NEEDS_PROBE`.
- Whether the effective Kilo server binds loopback under the clean profile, honors intended egress denial, and avoids proxy/TLS environment leakage: `NEEDS_PROBE`.
- Whether local models produce stable, valid tool calls and are compatible with a supported SDK/API: `UNKNOWN`.
- Whether event logging captures enough evidence without exposing prompts, arguments, secrets, paths or machine identifiers: `NEEDS_PROBE`.
- Provider/model errors, streaming variation, timeouts, retries, autonomous/auto-approval settings, tool visibility filters and alternate native LLM runtime can confound results unless recorded and controlled.

## 18. Decisions reserved to Governance

The responsible Governance authority must separately decide, before any execution:

1. Whether to authorize a bounded feasibility probe at all; this design is not that authorization.
2. Whether B merits the next feasibility review and which exact server/protocol/process boundary is acceptable.
3. The exact VS Code, Kilo extension/backend and OS build artifacts and their hashes.
4. Whether the test provider may run locally, which loopback/process controls are mandatory, and what evidence proves no external or LAN egress.
5. Which tools/actions, fixture paths, permission rules and human response semantics may be exercised; no `always`, auto-approve or `--auto` behavior by default.
6. Whether any synthetic credentials/session tokens may be generated and how they are kept out of logs.
7. Which raw events/metadata may be retained, their retention period and independent observer.
8. What evidence is sufficient for F01 closure and whether it advances K2-P0. K2-P1 remains a distinct later gate and is not authorized here.

The existing K1/K2 decision authority and Nexo canonical authority are unchanged. Neither a technical design, a source-code review nor an internal agent can self-promote this design into authorization.

## 19. Criteria to enable a future probe

Do not change status from `BLOCKED` until all of the following are approved and evidenced:

- Independent review accepts the source trace and limitations in this document.
- Governance explicitly authorizes a single bounded mechanism, exact vector set, exact client/version, disposable environment and observer.
- Provider protocol/configuration is fixed and deterministic; it delivers an actual provider-originated tool call, not text or injected LLM events.
- The normal Kilo VS Code request route reaches the expected backend session and real guarded local tool handler; no direct handler call, processor event injection, alternate CLI client or permission bypass substitutes.
- The chosen permission decision is observable and can be correlated to the same session/call; rejection/denial is distinguishable from absent call, provider failure and handler failure.
- Before/after fixture effects and no-effect negative cases are unambiguous and repeat from clean snapshots.
- VM/filesystem/process/network isolation is independently reviewed; the Kilo permission mechanism is not treated as the OS boundary.
- No production credentials, external mutation, canonical edits, adapter output or persistent approvals are needed.
- Rollback and evidence retention are specified; the test stops safely on unexpected tool, path, request or network activity.
- K2-P0 protocol changes, if any, are handled in a separately scoped and reviewed change. Passing this design review does not approve those changes or execution.

## 20. Source ledger and provenance

All upstream source links below use the immutable commit `e2887f08e5a6394299c810ba508f358aaf4c5bc3` (official `v7.8.8` tag). They identify evidence for the design only. No upstream code or third-party implementation was copied.

| Component / evidence | Fixed source |
|---|---|
| VS Code extension starts bundled CLI, port selection, environment/password | [`server-manager.ts`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/kilo-vscode/src/services/cli-backend/server-manager.ts#L81-L100), [process environment](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/kilo-vscode/src/services/cli-backend/server-manager.ts#L117-L174), [`serverLayer` takes a hostname](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/server/server.ts#L214-L230) |
| VS Code webview request → session prompt | [`KiloProvider.ts`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/kilo-vscode/src/KiloProvider.ts#L1336-L1354), [`session.promptAsync`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/kilo-vscode/src/KiloProvider.ts#L4745-L4771) |
| SDK client, Basic Auth, SSE events and permission-route tracking | [`connection-service.ts`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/kilo-vscode/src/services/cli-backend/connection-service.ts#L967-L1003), [permission event mapping](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/kilo-vscode/src/services/cli-backend/connection-service.ts#L1096-L1105) |
| Prompt tool resolution, model request and permission guard | [`session/prompt.ts`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/session/prompt.ts#L1733-L1779), [instructions/messages and `handle.process`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/session/prompt.ts#L1807-L1864) |
| Model/provider resolution and selected runtime identity | [`session/llm.ts`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/session/llm.ts#L99-L127), [native-vs-AI SDK selection](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/session/llm.ts#L307-L368), [tools passed to streaming request](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/session/llm.ts#L396-L430), [event normalization](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/session/llm.ts#L458-L482) |
| Tool call, result and error event processing | [`session/processor.ts`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/session/processor.ts#L469-L530), [result/error](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/session/processor.ts#L535-L585) |
| Tool wrapper and permission context/call IDs | [`session/tools.ts`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/session/tools.ts#L104-L171), [tool execute wrapper](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/session/tools.ts#L185-L215), [`ToolRegistry.tools` filtering](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/tool/registry.ts#L389-L408) |
| Ask/allow/deny, human reply, event request IDs | [`kilocode/session/prompt.ts`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/kilocode/session/prompt.ts#L354-L376), [`permission/index.ts`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/permission/index.ts#L220-L284), [reply/resolution](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/permission/index.ts#L286-L355), [VS Code human response handler](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/kilo-vscode/src/kilo-provider/handlers/permission-handler.ts#L90-L150) |
| Provider/model configuration fields | [`core config provider schema`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/core/src/v1/config/provider.ts#L68-L108), [`provider SDK registry`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/provider/provider.ts#L140-L150), [custom model resolution](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/provider/provider.ts#L1537-L1580), [baseURL/auth handling](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/provider/provider.ts#L1828-L1888) |
| Scripted provider test helper and prompt test | [`TestLLMServer`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/test/lib/llm-server.ts#L452-L535), [Responses/SSE encoding](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/test/lib/llm-server.ts#L90-L210), [server queue/transport](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/test/lib/llm-server.ts#L647-L715), [`providerCfg(baseURL)`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/test/session/prompt.test.ts#L344-L358), [test session allows all](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/test/session/prompt.test.ts#L1014-L1038) |
| VS Code test suites located | [Storybook Playwright config](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/kilo-vscode/playwright.config.ts#L1-L31), [permission component story test](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/kilo-vscode/tests/permission-diff.spec.ts#L1-L13), [extension-host sample](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/kilo-vscode/src/test/extension.test.ts#L1-L16), [test host file selection](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/kilo-vscode/.vscode-test.mjs#L1-L7) |
| LLM event injection and recorded replay tests | [`processor-effect.test.ts`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/test/session/processor-effect.test.ts#L202-L223), [`llm-native-recorded.test.ts`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/test/session/llm-native-recorded.test.ts#L346-L430) |
| E2E env candidate | [`KiloToolRegistry.usePatch`](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/kilocode/tool/registry.ts#L74-L83) and [`ToolRegistry.tools` patch/edit selection](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/tool/registry.ts#L389-L404) |

Kilo's upstream source is used only as linked evidence; license and provenance records remain in the existing [Nexo source ledger](source-ledger.md). The primary design references no moving `main`, release alias, copied code, generated `dist/`, or modified K1/K2-P0 artifact.

## 21. Next gate

Submit this document for **independent technical review**, then a separate Governance decision on whether to authorize a bounded feasibility probe and which mechanism/scope is permissible. Until those gates are satisfied, F01 remains open; do not run, install, implement or certify a mechanism. K2-P0 remains unapproved and K2-P1 remains blocked.
