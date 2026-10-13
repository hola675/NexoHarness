# K1 Independent Translation Contract Review

**Verdict:** `PASS WITH NON-BLOCKING FINDINGS`  
**Reviewed baseline:** `99f024f66c7ebd3695ec59af8a3b17d2d4fa4503`  
**Target:** Kilo Code VS Code extension `v7.8.8` on Windows  
**Review type:** Independent, document-only review; reviewer was not the K1 contract author.  
**Review date:** 2026-10-13

## Scope and evidence

The review assessed [`docs/adapters/kilo-translation-contract.md`](../adapters/kilo-translation-contract.md) against ADR 0007 and ADR 0006, the K0 capability matrix and source ledger, the registered canonical Kinds and schemas, the governance/authority and capability-runtime models, the concept documents, and the Codex translation contract as a methodological reference only.

The reviewed target claim is bounded to the pinned Kilo `v7.8.8` release (`e2887f08e5a6394299c810ba508f358aaf4c5bc3`) and Windows + VS Code. The K0 ledger distinguishes version-pinned source from rolling official documentation. No local Kilo probe or installation was performed for this review. The contract is therefore assessed as a translation design boundary, not evidence that a Kilo runtime control is effective.

## Gate results

| Review area | Result | Evidence and assessment |
|---|---|---|
| Canonical integrity | PASS | Section 5 accounts for all 13 registered Kinds and introduces no canonical Kind or target-specific canonical semantics. |
| Policy, Agent, Profile, Workflow, Capability, and Enforcement mappings | PASS | Section 5 keeps mappings conditional where semantics or target behavior are not established; it retains Nexo-owned state-machine, authority, and evaluation responsibilities. |
| Authority and Permission | PASS | Section 4 keeps them separate, prohibits generating `allow`, states that `ask` cannot authorize Nexo `none`, and limits `deny` claims to an exact, proven tool boundary. |
| Scope and effects | PASS | The contract does not infer machine scope from prose. Required `externalMutation: none` remains blocked until the relevant target effects are bounded and verified. Unknown required controls block eligibility. |
| Enforcement strength | PASS | Prompt content remains advisory. Kilo permission checks are described as a target runtime gate only for matching in-process tool calls; no OS isolation or hard-enforcement guarantee is claimed. |
| Target and version | PASS | The contract states Windows + VS Code and pins Kilo `v7.8.8`; CLI behavior and other clients/platforms are excluded. It does not present an unexecuted VS Code probe as observed behavior. |
| Provenance and determinism | PASS | Section 2 requires target baseline, canonical source references, explicit options, and byte-identical candidates for identical validated inputs. Section 7 keeps rendering separate from eligibility, distribution, installation, and certification. |
| Scope boundaries | PASS | No adapter, renderer, manifest, installer, resolver, Observer, promotion path, credentials, target configuration mutation, or Codex/Claude implementation is authorized or specified. |

## Non-blocking finding

### K1R-01 — Preserve K0 evidence labels and finding states separately

**Severity:** Minor; non-blocking for acceptance of the K1 design contract.  
**Location:** `docs/adapters/kilo-translation-contract.md`, Section 7; compare `research/kilo/capability-matrix.md` and `research/kilo/source-ledger.md`.

Section 7 requires diagnostics to report an evidence source and confidence, but it does not explicitly require the future adapter to preserve K0's two separate vocabularies:

- Evidence confidence: `VERIFIED_SOURCE`, `OFFICIAL_DOCUMENTED`, `OBSERVED_LOCAL`, `INFERRED`, `UNKNOWN`.
- Finding state: `SUPPORTED`, `PARTIAL`, `UNSUPPORTED`, `UNKNOWN`, `NEEDS_PROBE`.

Without that explicit requirement, an implementation could collapse claim state and evidence confidence into a generic confidence field. This does not invalidate the contract's fail-closed requirements or authorize a target behavior claim. Before adapter implementation, amend the contract or its implementation specification to preserve the two fields independently and prevent a translation from upgrading a finding state without new evidence. No amendment was made in this review.

## Verdict boundary and deferred work

This verdict accepts the **documented translation contract only**. It does not verify Kilo's effective Windows + VS Code permissions, certify a tool binding, or establish installation or product readiness. K2 probes remain a separate gate and were not run. No K1 corrections, implementation, R3 work, tag, release, or certification were performed.

## Validation evidence

- K1 baseline `99f024f66c7ebd3695ec59af8a3b17d2d4fa4503` is `main` and matched `origin/main` before this review artifact was created; the worktree was clean at baseline.
- GitHub Actions check `validate` for the K1 baseline completed successfully: [run 38396966912](https://github.com/hola675/NexoHarness/actions/runs/38396966912).
- This report's local repository validation is recorded by the follow-up review commit and its CI check.
