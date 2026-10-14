# NEXOHARNESS K2-P0-R Independent Review Report

**Verdict:** `FAIL` — documented design review only; this is not authorization to execute probes.
**Reviewed commit:** `2cd9254570f4e92725c9697ee8e4dddc319210d1`
**Branch / PR:** `docs/k2-p0-probe-protocol` / PR #1 (`https://github.com/hola675/NexoHarness/pull/1`)
**Target:** Kilo Code VS Code extension `v7.8.8`, official tag commit `e2887f08e5a6394299c810ba508f358aaf4c5bc3`, Windows.
**Review type:** Independent documentary review; reviewer did not author K2-P0. No K2 probes were executed.
**Review date:** 2026-10-14

## 1. Baseline reviewed

The local repository was on `docs/k2-p0-probe-protocol`, clean, with `HEAD` exactly `2cd9254570f4e92725c9697ee8e4dddc319210d1`. The named commit is also the remote branch and PR #1 head according to `git ls-remote` (`refs/heads/docs/k2-p0-probe-protocol` and `refs/pull/1/head`). The candidate adds only `research/kilo/k2-p0-probe-protocol.md` relative to its stated parent baseline `1623e055ec043404d49a1a50463bfd2a06a9cdcf`.

CI could not be checked: GitHub CLI `gh` is not installed in this environment. No CI status is asserted. The PR state (open/closed/merged) could not be independently retrieved; the remote PR head ref exists at the reviewed SHA. This limitation is material and explicitly unresolved.

## 2. Reviewer independence and scope

This review was conducted against the candidate and its normative references, not as an author self-review. It is documentation, architecture, evidence, and safety analysis only. The K2-P0 document states no probes have run, and none were run for this review. No Kilo configuration, global settings, credentials, tools, MCP servers, adapter implementation, schemas, canonical Kinds, generated output, merge, release, or certification were changed or exercised.

## 3. Sources checked

- `research/kilo/k2-p0-probe-protocol.md` (reviewed candidate)
- `docs/adapters/kilo-translation-contract.md` (K1)
- `docs/reviews/k1-independent-translation-contract-review.md`
- `research/kilo/capability-matrix.md`
- `research/kilo/source-ledger.md`
- `research/kilo/README.md`
- `docs/decisions/0007-windows-vscode-target-scope.md`
- `docs/decisions/0006-product-v1-and-adapter-priority.md`
- `docs/model/governance-authority.md`
- Repository `AGENTS.md`

The K0 sources state that no local Kilo probes were performed; they are not local runtime evidence. ADR 0007 supplies current Windows + VS Code priority. Any older K0 statement that client selection remained open is historical context, not current scope. Governance sources keep Capability, Permission, Provider, and Authority distinct.

## 4. Coverage matrix P01–P06

| Probe | Design coverage | Design-ready | Execution-ready | Evidence-ready | Review |
|---|---|---:|---:|---:|---|
| P01 Permission precedence | Covers user/global, project, agent, environment, session/UI, conflicts, reload, and persistence by inventory and controlled scratch action (K2-P0 §§3.1, 3.2, 5 P01). | Partial | No | Partial | The per-case action and artifacts are specified, but it does not provide an actual fixture/config recipe, exact layer identifiers, or a concrete observable oracle mapping winning layers to results. Model/provider invocation is also unresolved (F-01). Unaddressable layers correctly remain unknown. |
| P02 Tool permissions | Enumerates read, edit/write/patch, bash, task, web, MCP and aliases individually; allow/ask/deny; side-effect checks and blocked external calls (§5 P02). | Partial | No | Partial | Good separation of exact tools and outcomes. A real tool invocation requires a model/provider-backed VS Code session; no safe reproducible offline driver is specified. `allow` itself is not actually exercised under the ask-reject-only instruction (F-01). Error/no-execution distinction is required but the protocol does not define positive execution evidence for every read/error case (F-02). |
| P03 Autonomous behavior | Separates visible UI presence from execution semantics; prohibits activation and leaves semantic effect unresolved (§5 P03, §5.1). | Yes, inspection-only | Yes, inspection-only | Yes, inspection-only | Correctly does not treat UI inspection as proof of changed approval semantics. Execution behavior remains intentionally pending and cannot support a claim that depends on it. |
| P04 Filesystem boundaries | Synthetic sensitive names, workspace and VM-local external paths, reads/writes, case/separators/globs, optional in-VM links, and narrowly bounded conclusions (§3.2 F-PATHS, §5 P04). | Partial | No | Partial | Safe scope is well bounded, but the protocol has no exact matrix of path fixtures/operations/rules, link type/creation and resolution procedure, or defined Windows normalization oracle. Required untested paths correctly block broad claims. Model/provider prerequisite remains (F-01). |
| P05 Configuration discovery | `kilo.jsonc`, Markdown markers, reload/fresh session, hashes and preservation; disclaims install/merge (§3.2 F-CONFIG, §5 P05). | Partial | No | Partial | Correctly separates discovery from composition and does not claim merge. “Observe marker loading through a safe, non-mutating response” is not reproducible without an invocation source; it depends on model/provider or another concrete UI surface not specified. The marker observation's attribution is therefore indeterminate (F-01/F-02). |
| P06 Windows paths/globs | Case, separators, relative/absolute, glob specificity, external/workspace, exact tools, resolution, and no CLI parity shortcut (§5 P06). | Partial | No | Partial | Sound boundary and claim limits, but no enumerated test vectors/rule precedence oracle or deterministic invocation procedure. “Parity” is restricted to independently-tested extension pathways, but the planned operation does not define which pathways are to be compared. Provider prerequisite remains (F-01). |

**Overall:** P03 inspection is design-, execution-, and evidence-ready only for the narrow question whether a UI surface is visibly offered, not for activation or its enforcement effect. The other probes are useful safety plans but are not fully reproducible test protocols: exact vectors and an invocation mechanism are deferred to a later run log, and the run log cannot cure the absent prerequisite that there is no model/provider access or documented fixture driver. No probe is currently evidence-ready for a claim of effective tool enforcement.

## 5. Security and isolation

**Positive evidence:** K2-P0 §§3, 6–8 requires a disposable Windows VM or equivalent, fresh account and VS Code data directories, snapshots, synthetic-only fixtures, no real credentials or production repositories, indexing/MCP disabled, egress denied during behavior probes, in-VM paths, redacted evidence, stop-on-incident, and snapshot destruction/rollback. It expressly refuses to loosen isolation to force a pass. Its assurance boundary excludes OS sandbox and machine-owner protection.

**Assessment:** The safety model is strong at design level. It does not demonstrate that a VM exists or that execution preconditions are met. Most importantly, the protocol's own §§3.1.4, 5 P02, and 8 say web/MCP/model-dependent tests may be blocked and no model/provider dependence is resolved. A VS Code tool call cannot be induced merely by inspecting a permission setting; the document supplies no deterministic non-network mock or local harness that exercises the actual extension tool execution path. The existing fixtures describe actions, not an invocation driver. Therefore the safe, correct outcome for any call-dependent case without an approved provider/model is `BLOCKED`, not a request to enable network or use real credentials. This remains a blocking evidence gap for required enforcement claims, not proof of unsupported behavior.

No immediate unsafe instruction to access production data or weaken isolation was found. However, P01/P02/P04/P06 execution authorization should remain withheld until F-01 is addressed in a separately reviewed protocol revision or the execution plan explicitly marks those cases blocked.

## 6. Reproducibility and evidence

K2-P0 §2 correctly separates `findingState` (`SUPPORTED`, `PARTIAL`, `UNSUPPORTED`, `UNKNOWN`, `NEEDS_PROBE`) from `evidenceConfidence` (`VERIFIED_SOURCE`, `OFFICIAL_DOCUMENTED`, `OBSERVED_LOCAL`, `INFERRED`, `UNKNOWN`); it separately defines probe dispositions PASS/FAIL/BLOCKED (§4), prohibits using PASS as finding state, rejects absence-of-log as denial proof, and bounds claims to the tested surface. This addresses the K1R-01 concern **for the protocol only**. It does not amend or claim to correct K1 itself.

The evidence plan asks for version identity, fixture/config bytes, hashes, screenshots, logs, timestamps, action names, run manifests, and redaction. But the per-probe rows do not each provide all 12 protocol fields demanded by this review request as an executable recipe: exact expected values/oracles and failure evidence are often generic; fixtures are logical rather than materialized; preconditions omit the required provider/model state; and “exact effective config”/“marker loading” are not tied to a defined observation procedure. A future operator may produce a run log, but the present document does not make the experiment itself reproducible under the specified offline conditions.

## 7. Findings and confidence validation

The status/confidence vocabularies and the distinction from PASS are coherent with K0 and K1. The protocol does not convert inference into observation and explicitly states it contains no `OBSERVED_LOCAL` result (§8). P03's inspection-only PASS is appropriately narrow, while approval semantics remain `NEEDS_PROBE`.

One tension is that the protocol calls each row a “probe” with PASS/FAIL/BLOCKED while P03 is deliberately an inspection with no execution probe. This is not itself a blocking flaw because the row narrowly limits its pass criterion and keeps the runtime effect pending; label it as inspection in any future result record to avoid representing UI inventory as behavioral evidence.

## 8. Classified findings

### F-01 — No model/provider-backed invocation precondition or safe substitute

**Severity:** MAJOR — blocking.
**Location:** `research/kilo/k2-p0-probe-protocol.md`, §§3.1.4–5, 5 P01/P02/P04/P05/P06, and §8.
**Evidence:** §3.1.4 denies egress and says external-service-dependent probes must be `BLOCKED`; §5 P02 says web/MCP are blocked if they need network/provider; §8 identifies marker observation's model/network dependence as unresolved. F-TOOLS describes actions but no driver that causes real VS Code extension tool calls. K1 §8.2 requires allow/ask/deny behavior for tool calls; K1 §8.4–8.6 require effective path/config behavior. K0 capability matrix §1 also treats provider availability/credentials as distinct and unresolved.
**Description:** The protocol does not answer how actual extension tool calls are produced when no model/provider access exists. It provides neither a safe reproducible local/mock route known to exercise the real VS Code runtime gate nor an explicit per-case prerequisite requiring a separately provisioned, authorized provider/model in an isolated environment. Because it also forbids credentials/network to force a result, execution readiness is undefined for the central runtime probes.
**Consequence:** An operator cannot determine before starting whether P01/P02/P04/P06—and P05 marker discovery—can run safely and reproducibly. An attempted direct configuration/UI inspection cannot establish runtime enforcement. Those rows may collapse into blocked outcomes with no evidence answering K1's mandatory conditions.
**Minimum correction:** State up front, per tool-dependent row, that absent an approved, disposable provider/model session (or a specifically validated local driver exercising the actual extension path), the row is `BLOCKED` before any execution attempt; enumerate which claims remain pending. Do not enable network or use real credentials. Define the exact safe invocation source/steps for any execution-ready path. Keep the existing block rather than claiming success where no such route is available.
**Blocking impact:** Blocks authorization/readiness for execution of the effective runtime probes and any future security/adapter eligibility claim based on them. Does not invalidate the document's safe-design intent or inspection-only P03.

### F-02 — Probe fixtures and result oracles are not sufficiently concrete for independent reproduction

**Severity:** MAJOR — blocking for reproducibility/evidence sufficiency.
**Location:** `research/kilo/k2-p0-probe-protocol.md`, §§3.2, 4 and 5 P01–P06.
**Evidence:** §3.2 calls fixture names “logical names” and defers exact paths/hashes to an eventual run log. P01 leaves actual supported layers and precedence to inventory at run time; P04/P06 defer path vectors to a run manifest; P05 requests a “safe, non-mutating response” to observe a marker but identifies no response mechanism. The common procedure says “as prescribed” for reload without prescribing a reload sequence. Generic expected results do not specify a layer/tool-specific oracle for distinguishing “not executed,” tool error, and explicit denial across all cases.
**Description:** The document specifies the categories of test and evidence, but not a sufficiently fixed test vector/procedure to let an independent operator reproduce the same probe and interpret results consistently. Deferring all concrete paths, effective-layer rules, reload steps, and invocation/observation sources to a future run log leaves material test design choices to the executor.
**Consequence:** Equivalent runs can exercise different tool IDs, path forms, layers, or reload behavior; results may be incomparable or misattributed. Hashes of an executor-selected fixture do not establish that the fixture itself was pre-specified.
**Minimum correction:** Add a versioned per-probe case table (exact synthetic fixture paths/content hashes, input rule/path/tool IDs to enumerate, reload/session steps, direct success/denial/error/no-call observations, expected side effects, fail/blocked oracle, and artifact names). For unknown target IDs/layers, define a bounded discovery substep and require an enumerated inventory artifact before the behavioral cases; do not silently vary the scope.
**Blocking impact:** Blocks a `PASS` for P01/P02/P04/P05/P06 as reproducible experiments until the procedure is fixed. P03's bounded UI inventory can still be performed as specified.

## 9. Risks and deferred work

- All six rows are explicitly unrun; no `OBSERVED_LOCAL` evidence exists. No K2 claim about actual Kilo runtime behavior is established.
- P03's approval-semantic effects remain untested and pending; UI availability is not execution behavior.
- Web/MCP external service behavior, server authorization, credentials, network side effects, and provider fallback remain out of scope or blocked, consistent with K1's provider/authority separation.
- Symlink/junction handling is optional only when confined to VM storage; no general filesystem isolation or race guarantee follows.
- Discovery does not establish safe merge, install ownership, collision handling, distribution, or adapter behavior.
- K1R-01 is reflected in K2-P0; the K1 contract remains unchanged and its future adapter contract still needs that finding handled.
- CI and PR state are not verified in this review due to missing GitHub CLI. No CI pass should be inferred from the remote ref.

## 10. Verdict

**`FAIL`** under the requested documentary-review criteria. The protocol is architecturally coherent with NexoHarness and largely respects K1's authority, permission, provider, enforcement, scope, and evidence boundaries. Its isolation and rollback principles are strong, its six rows map directly to K1 §8, and its vocabulary treatment addresses K1R-01 without changing K1.

The verdict fails because the central runtime probes lack an explicit provider/model invocation precondition or validated safe substitute, and because fixtures/oracles/procedures remain too abstract for independent reproduction. These are material to K1's mandatory evidence requirements, not cosmetic omissions. P03's UI-only inspection may be design-ready and narrowly executable, but cannot establish autonomous execution semantics. The verdict is not a finding that Kilo lacks the controls, and is not a certification judgment.

## 11. Validation evidence

- `git rev-parse HEAD`: `2cd9254570f4e92725c9697ee8e4dddc319210d1`.
- `git branch --show-current`: `docs/k2-p0-probe-protocol`.
- `git status --short --branch` before report creation: clean; branch tracked `origin/docs/k2-p0-probe-protocol`.
- `git ls-remote` confirmed remote branch and PR head refs both resolve to the reviewed SHA.
- `npm run verify:core`: **passed**; TypeScript typecheck, repository validation, schema compilation for 13 Kinds (13 valid / 13 invalid fixtures), canonical integrity for 8 entities, and all 162 tests passed (0 failures, 0 skipped/cancelled).
- `git diff --check`: **passed** for the report; no whitespace errors.
- GitHub Actions / PR state: **not verified**; `gh` executable unavailable. This must be recorded as a limitation, not a passing check.
- Probe count: 0 run by this review. Candidate declares all 6 rows not run.

## 12. Next gate

No K2-P1 execution is authorized by this report. Governance owns authorization of any next step. Before execution is considered, resolve the blocking protocol findings and independently re-review the revised design; then verify disposable environment and provider/model preconditions for each case. No merge, certification, adapter implementation, or release is approved here.
