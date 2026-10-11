# R1 Final Documentation Reconciliation Report

**Status:** R1-N reconciliation package; not an independent architecture review or R1 certification.

## Baseline and scope

- Baseline: `f45c58b509debe3b5fb8f2e6e5d81c121770fdcc` (`R1_N_BASELINE_SHA`). Before editing, `main`, `HEAD`, and fetched `origin/main` matched and the worktree was clean.
- Scope: reconcile the 14 ACTIVE documents under [`docs/model/`](../model/), their documented authority boundaries, and the legacy documentation inventory in the [authority audit](r1-documentation-authority-audit.md).
- The final R1-N commit contains this report. Its exact SHA is supplied with the final execution result; Git history identifies the commit that contains this file.
- No architecture, schema, Policy, ADR, runtime, adapter implementation, or roadmap decision was changed.

## Authority hierarchy retained

| Documentation layer | Authority and scope |
|---|---|
| `core/policies/`, `core/directives/`, `core/schemas/` | Applicable technical behavior, constraints, precedence, and validated structures. This report does not replace [`core/policies/precedence.md`](../../core/policies/precedence.md). |
| Accepted ADRs | Historical architectural decisions and rationale; retained append-only. A model document does not amend an ADR. |
| [`docs/concepts/`](../concepts/) | Technical semantics of registered Kinds and components. |
| [`docs/model/`](../model/) | Organizational and system framing, subordinate to technical authorities where they govern the same behavior. |
| [`docs/adapters/`](../adapters/) | Target-specific design and current implementation status. |
| [`docs/reviews/`](./) | Evidence and outcomes of reviews. This reconciliation report is not itself a review. |
| [`research/`](../../research/) | Empirical and external investigation evidence, with target and attempt scope preserved. |

## Inventory and authority matrix: 14 ACTIVE model documents

All 14 entries are listed as ACTIVE in [`docs/model/README.md`](../model/README.md), and each document's own status line was checked. “Contradiction” below means an unresolved incompatible authority claim; open clarifications are listed separately.

| ACTIVE document | Responsibility and authority | Technical owners and references | Overlap and current contradiction finding |
|---|---|---|---|
| [`charter.md`](../model/charter.md) | Organizational/system identity, mission, target strategy, and growth principles. | Subordinate to [`core/directives/core-directive.md`](../../core/directives/core-directive.md), applicable Policies, and [`docs/source-of-truth.md`](../source-of-truth.md). | Reconciles organizational framing from [`docs/principles.md`](../principles.md); Core Directive remains the enforceable behavioral constitution. No unresolved authority conflict. |
| [`vocabulary.md`](../model/vocabulary.md) | Organizational and cross-layer vocabulary. | Technical terms defer to [`docs/concepts/`](../concepts/) and technical entries in [`docs/terminology.md`](../terminology.md). | Organizational terms overlap `terminology.md`; its technical entries remain there or with their technical owner. The READY entry now reflects R1-G's resolved scope distinction. |
| [`work-lifecycle.md`](../model/work-lifecycle.md) | Organizational lifecycle from Request and Intake through execution, reporting, and observation; elaborates NEP-1. | [`core/directives/execution-protocol.md`](../../core/directives/execution-protocol.md), [`core/policies/completion.md`](../../core/policies/completion.md), and [`core/schemas/common.schema.json`](../../core/schemas/common.schema.json). | Reconciles [`docs/lifecycle.md`](../lifecycle.md). Its Intake `READY`, Contract Instance handoff `READY`, and terminal Assignment outcomes are distinct scoped meanings. No unresolved conflict. |
| [`knowledge-experience.md`](../model/knowledge-experience.md) | How scoped operational evidence may inform reusable Knowledge without granting authority or becoming canonical automatically. | [`core/schemas/observation.schema.json`](../../core/schemas/observation.schema.json), [`docs/concepts/task-observer.md`](../concepts/task-observer.md), and [`core/policies/evidence.md`](../../core/policies/evidence.md). | Reconciles scopes and Adaptation Envelope from [`docs/shared-runtime.md`](../shared-runtime.md); hands off conceptually to `learning-evolution.md`. Runtime storage and learning systems are not claimed. |
| [`learning-evolution.md`](../model/learning-evolution.md) | Organizational path from evidence through diagnosis, hypothesis, candidate, evaluation, review, approval, and promotion. | [`core/policies/self-improvement.md`](../../core/policies/self-improvement.md), [`core/schemas/improvement-proposal.schema.json`](../../core/schemas/improvement-proposal.schema.json), and [`docs/concepts/task-observer.md`](../concepts/task-observer.md). | Reconciles [`docs/continuous-improvement.md`](../continuous-improvement.md); it cannot grant promotion authority. Approval taxonomy remains open; no learning engine is implemented. |
| [`workforce.md`](../model/workforce.md) | Organizational Divisions, Roles, Competencies, staffing, and the boundary with technical Agents. | [`core/schemas/agent.schema.json`](../../core/schemas/agent.schema.json), [`core/policies/delegation.md`](../../core/policies/delegation.md), [`docs/concepts/agents.md`](../concepts/agents.md), and [`ROADMAP.md`](../../ROADMAP.md). | Clarifies Agent execution archetypes versus organizational Roles and records the Phase 3 interpretation. No Role or Agent entity is created; schema wording remains an open clarification. |
| [`governance-authority.md`](../model/governance-authority.md) | Organizational framing for decision rights, scope, delegation, approval, exceptions, and authority boundaries. | [`core/policies/precedence.md`](../../core/policies/precedence.md), delegation, scope-control, self-improvement, evidence, and completion Policies; relevant Agent, Policy, Enforcement, and ImprovementProposal schemas. | Explains governance without redefining Policies or granting permissions. Approval-level taxonomy remains open. |
| [`assurance-certification.md`](../model/assurance-certification.md) | Claim-relative verification, review, evaluation, evidence, certification, and their limits. | Evidence and completion Policies; Evaluation, Enforcement, Contract, and common schemas; [`docs/validation.md`](../validation.md) and [`docs/versioning.md`](../versioning.md). | Shares quality language with `evaluation-quality.md` and release boundaries with `distribution-release.md`; ownership is cross-linked. R1-G READY finding is resolved. R1 has not had its final independent architecture review. |
| [`capability-runtime.md`](../model/capability-runtime.md) | Capability requirements, Provider/Binding concepts, runtime resolution, degradation, and adapter/resolver boundaries. | Capability, Profile, and Agent schemas; [`docs/concepts/capabilities.md`](../concepts/capabilities.md), [`docs/adapters/codex-translation-contract.md`](../adapters/codex-translation-contract.md), and target research. | Coordinates with Operations and Profiles/Context. Runtime Resolver and Provider Registry are future concepts, not implemented features. `deploymentEligible` remains a pre-Installer blocker. |
| [`operations-orchestration.md`](../model/operations-orchestration.md) | Control-plane work coordination, responsibilities, workflow, delegation, context use, capability timing, and reporting. | NEP-1, delegation/scope Policies, [`docs/orchestration.md`](../orchestration.md), and [`docs/execution-model.md`](../execution-model.md). | Reconciles the organizational overlap with orchestration and execution context; legacy files remain preserved. No Assignment or Work Unit schema/runtime is introduced. |
| [`canonical-information.md`](../model/canonical-information.md) | Information classes, definition/instance boundaries, provenance, allowed flows, canonical roots, and validation layers. | [`docs/source-of-truth.md`](../source-of-truth.md), [`docs/canonical-format.md`](../canonical-format.md), [`docs/schema-system.md`](../schema-system.md), [`docs/validation.md`](../validation.md), and validator sources. | Distinguishes canonical schemas from runtime Observation/ImprovementProposal instances. The 13 registered Kinds and 11 authoring roots were checked in validator source. Status and runtime-reference questions remain open. |
| [`profiles-context-configuration.md`](../model/profiles-context-configuration.md) | Profile selection/composition framing, Context, progressive disclosure, configuration ownership, secrets, and portability. | Profile and Capability schemas, precedence/scope Policies, [`docs/concepts/profiles.md`](../concepts/profiles.md), and [`docs/execution-model.md`](../execution-model.md). | Reconciles the context model and Profile/provider-configuration boundary. Profile and configuration runtime managers are not implemented. |
| [`evaluation-quality.md`](../model/evaluation-quality.md) | Quality claims, requirement traceability, evaluation coverage, metrics, gates, and quality debt. | Evaluation schema, [`docs/concepts/evaluations.md`](../concepts/evaluations.md), evidence/completion Policies, Assurance, and Learning/Evolution models. | Defines system framing while the Evaluation Kind and methods remain technical ownership in concepts/schemas. No universal score or evaluation service is introduced. |
| [`distribution-release.md`](../model/distribution-release.md) | System boundary from target rendering through installation, verification, scoped certification, and product release. | [`docs/versioning.md`](../versioning.md), Codex status and translation contract, ADR 0005, and the Canonical Information, Profiles/Context, Capability/Runtime, Governance, and Assurance models. | Reconciles adapter output versus install/release responsibilities. Manifest eligibility blocks a Phase 1.2 Installer consumer; no Installer, Uninstaller, Doctor, or filesystem distribution exists. |

## Legacy preservation, reconciliation, and retirement candidates

The [R1-N current disposition matrix](r1-documentation-authority-audit.md#current-legacy-disposition-matrix-r1-n) assigns exactly one current label to every inventoried legacy document. Technical concept docs, accepted ADRs, independent review records, adapter status/design records, research evidence, and applicable Policies are preserved under their existing owners. The cross-layer overlaps with `principles`, `terminology`, `lifecycle`, `execution-model`, `orchestration`, `shared-runtime`, `continuous-improvement`, `canonical-format`, and `versioning` are documented in the matrix with a current owner and rationale.

Three documents are only **SUPERSEDE_CANDIDATE**: `docs/execution-model.md`, `docs/orchestration.md`, and `docs/canonical-format.md`. No removal is approved here. The execution-model tests and all inbound links must be addressed, and each candidate must pass a line-by-line exclusive-content and reference check before a later retirement decision. No ADR, probe record, or review record is a retirement candidate in this reconciliation.

Semantic overlaps reconciled without physical file merges include:

- organizational charter framing versus the technical Core Directive and stable principles;
- organizational vocabulary versus technical Kind terminology;
- organization-level lifecycle/orchestration versus NEP-1 and the preserved technical lifecycle/context references;
- Experience and Learning/Evolution versus Observation, Task Observer, and the self-improvement Policy;
- organizational Workforce Roles versus the Agent Kind and execution-responsibility archetypes;
- governance/assurance framing versus Policies, schemas, Evaluation methods, and release mechanics;
- canonical information classes versus technical source ownership, schema registration, validation, and runtime instances;
- Profile/Context/Configuration versus Profile schema and target adapter behavior;
- system-level Distribution/Release versus existing Codex rendering, version tags, workflow mechanics, and accepted ADRs.

No unresolved incompatible authority claim was found after the corrections below. Open semantic clarifications and implementation work are not reclassified as conflicts.

## Corrected temporal and status statements

- The audit preserves the historical sequence: R1-A recorded a READY conflict; R1-G resolved it as a scope distinction; current status is **RESOLVED**. No historical R1-A entry was rewritten.
- Current ACTIVE model documents that described `learning-evolution`, `profiles-context-configuration`, Assurance, or Distribution/Release as **PLANNED** were corrected to point to the documents now present and ACTIVE. The relevant runtime features remain unimplemented.
- The Codex adapter status now distinguishes the defined R1.1-A translation contract from the existing R1.1-B adapter core. The architecture overview explicitly says the Installer is planned but not implemented. Workflow-family notes now distinguish schema support from the absence of authored production Workflow entities.
- [`docs/adapters/codex.md`](../adapters/codex.md) records in-memory generation and previews, no filesystem distribution, no Installer integration, and the manifest eligibility blocker. `CodexAgentRolesRenderResult` exposes `deploymentEligible`; `CodexCompilation`, generic `CodexRenderResult`, and `CodexManifest` do not.
- [`research/codex/probes/c4c-runtime-r5-f2-0.160.0.md`](../../research/codex/probes/c4c-runtime-r5-f2-0.160.0.md) remains `INVALID / FROZEN`; this is neither PASS, FAIL, nor certification.

## Canonical, runtime, generated, and implementation state

| Class | Current verified state |
|---|---|
| DOCUMENTED | All 14 organizational/system models are ACTIVE. Technical concepts and target status remain in their designated docs. |
| IMPLEMENTED | The repository contains 13 technical Kind schemas, validation tooling, and Codex Phase 1.1-B compilation and in-memory rendering code. `CodexAgentRolesRenderResult` can express `deploymentEligible`; `CodexCompilation`, generic `CodexRenderResult`, and the manifest type and builder do not carry that field. |
| STRUCTURALLY VALIDATED | The fresh `npm run validate` and `npm run verify:core` results are recorded below after execution. The source definitions are `SUPPORTED_KINDS` in `tools/validate/schemas.ts` and `CANONICAL_ROOTS` in `tools/validate/canonical-discovery.ts`. |
| RUNTIME OBSERVED | Codex CLI 0.160.0 observations exist with bounded scope. C4-C R5-F2 is the latest known C4-C attempt and is INVALID/FROZEN. |
| CERTIFIED | Codex Phase 1.0 research is documented as certified; C4-B1 has a separate independent review record. These do not establish C4-C runtime certification or R1's final architecture review. |
| NOT IMPLEMENTED | `installer/` and `observer/` contain only `.gitkeep`; `dist/` is absent; no Installer, Uninstaller, Doctor, filesystem bundle, runtime resolver, or Provider Registry was found. `core/contracts/`, `agents/`, `skills/`, `rules/`, `workflows/`, `capabilities/`, `profiles/`, `enforcement/`, and `evals/` contain no authored production entities. |

The R1-M source supplied earlier ended at “Installation scope Puede”. The report retains only the received requirement for explicit installation scope; it does not infer a taxonomy or target-path selection rules. Those details remain deferred.

## Open clarifications and blockers retained

| Classification | Finding | R1-N treatment |
|---|---|---|
| R2/R3 semantic clarification | Observation complexity vocabulary: schema/NEP-1 `BOUNDED / COMPLEX` versus organizational `TRIVIAL / BOUNDED / COMPLEX`. | Preserved; no schema or model enum change. |
| R2/R3 semantic clarification | Approval taxonomy versus change-size taxonomy. | Preserved; no approval-level enum invented. |
| R2/R3 semantic clarification | Core Directive capability wording about how a capability is fulfilled. | Preserved for later decision; Core Directive untouched. |
| R2/R3 semantic clarification | Agent input and output Contract representation in schema/concept. | Preserved; no Agent schema change. |
| R2/R3 semantic clarification | Roadmap Phase 3 interpretation. | Preserved; no roadmap change. |
| R2/R3 semantic clarification | `Observation.metadata.status` meaning for runtime instances. | Preserved; no schema or Policy change. |
| R2/R3 semantic clarification | `ImprovementProposal.metadata.status` meaning for runtime instances. | Preserved; no schema or Policy change. |
| R2/R3 semantic clarification | ImprovementProposal decision-state representation. | Preserved; no schema or Policy change. |
| R2/R3 semantic clarification | `Rule.trigger` future intent. | Remains absent from the current Rule schema. |
| R2/R3 naming clarification | `requiredCanonicalDirectories` naming debt. | Preserved; no validator change. |
| Future implementation | Runtime reference validation for Observation and ImprovementProposal. | Deferred; no validator change. |
| Future implementation | Physical storage/location for ImprovementProposal instances. | Deferred; no directory or storage design. |
| Pre-Phase 1.2 technical blocker | CodexManifest does not represent `deploymentEligible`. | Must be resolved before an Installer consumer can trust the manifest; `manifest.ts` remains unchanged. |

## Current disposition and resolved findings

- READY: **RESOLVED** in R1-G as a scope distinction among Intake triage, Contract Instance handoff readiness, and terminal Assignment outcomes. No Policy/schema change.
- Legacy disposition counts across 51 individual rows: **37 PRESERVE, 5 REFINE, 3 MERGE_RECONCILED, 3 SUPERSEDE_CANDIDATE, 3 STATUS_ONLY, 0 RELOCATE_CANDIDATE, 0 NO_CHANGE, 0 CONFLICT**.
- No legacy file was deleted, moved, or physically merged. The initial and current disposition vocabularies are distinguished in the authority audit.
- No new source-of-truth conflict was found. All pending items above remain clarifications or future implementation work.

## Validation results

Fresh results are inserted after all reconciliation edits and validations complete:

| Check | Result |
|---|---|
| `npm run typecheck` | PASS |
| `npm run validate` | PASS — 13 schemas; 13 valid and 13 invalid fixtures; integrity passed for 8 entities. |
| `npm test` | PASS — 162/162. |
| `git diff --check` | PASS. |
| `npm run verify:core` | PASS — its typecheck, validate, 162-test suite, and diff check all passed. |
| Local Markdown link/reference check | PASS — 140 Markdown files scanned and 324 local link targets resolved. |
| 14 model docs ACTIVE / 13 Kinds / 11 canonical roots | PASS — checked model status lines and validator source arrays. |
| Technical paths unchanged; only authorized documentation paths changed | PASS — changed paths are documentation only. |
| No removed/renamed references or new authority conflicts | PASS — no files were removed or renamed; link checks passed; no unresolved incompatible authority claim was found. |
| Independent architecture review | PASS WITH FINDINGS on `4aa78b0b09d0522a67323ac8a95a091b999fc364`; one non-blocking type-description error in this report was corrected in the follow-up documentation change below. |

## Independent architecture review

The independent reviewer examined commit `4aa78b0b09d0522a67323ac8a95a091b999fc364` against baseline `f45c58b509debe3b5fb8f2e6e5d81c121770fdcc` and returned **PASS WITH FINDINGS**. It confirmed the 14 ACTIVE model documents, the 51 legacy dispositions and their totals, the READY evidence and historical R1-A record, the 13-Kind/11-root counts, the documented implementation boundaries, and the retained R2/R3 clarifications and deployment blocker. It found one non-blocking wording error: `CodexCompilation` and generic `CodexRenderResult` were described as exposing `deploymentEligible`. This follow-up narrows the claim to `CodexAgentRolesRenderResult`, consistent with the source types. The review did not constitute R1 certification or authorize R2.

The independent review also confirmed the C4-C R5-F2 status remains `INVALID / FROZEN`, the Installer and distribution are absent, and the R2/R3 clarifications remain open.

## Changes made and limits

- Updated the current disposition framing and temporal status in [`r1-documentation-authority-audit.md`](r1-documentation-authority-audit.md), including the R1-A/R1-G/current READY sequence and one current disposition for each inventoried legacy document.
- Made the following minimal documentary corrections; each points to current ACTIVE docs while continuing to mark unimplemented features as unimplemented.

| File | Correction | Reason |
|---|---|---|
| [`docs/model/vocabulary.md`](../model/vocabulary.md) | Recast READY as a resolved scope distinction and link to R1-G evidence. | Remove stale current-state claim that the finding remains deferred. |
| [`docs/model/work-lifecycle.md`](../model/work-lifecycle.md) | Separate Intake READY from Contract handoff and terminal Assignment meanings. | Reflect R1-G resolution without changing Policy/schema. |
| [`docs/model/operations-orchestration.md`](../model/operations-orchestration.md) | Point to active Knowledge/Learning models and state runtime remains deferred. | Remove stale PLANNED status and obsolete READY conflict. |
| [`docs/model/knowledge-experience.md`](../model/knowledge-experience.md) | Point to active Learning/Evolution framing; clarify runtime mechanisms remain absent; record READY resolution. | Correct outdated phase status without implying an engine exists. |
| [`docs/model/learning-evolution.md`](../model/learning-evolution.md) | Record READY resolution and link to active Assurance and Distribution/Release models. | Remove stale conflict and PLANNED statements while preserving implementation boundaries. |
| [`docs/model/governance-authority.md`](../model/governance-authority.md) | Record READY resolution and distinguish active Assurance framing from future services/schema. | Correct status without adding authority or implementation. |
| [`docs/model/capability-runtime.md`](../model/capability-runtime.md) | Link Profile composition/context framing to the active Profiles/Context model; keep runtime management unimplemented. | Remove stale PLANNED statement. |
| [`docs/shared-runtime.md`](../shared-runtime.md) | Link the hand-off to active Learning/Evolution framing and keep mechanisms marked unimplemented. | Correct stale legacy authority note. |
| [`docs/adapters/codex.md`](../adapters/codex.md) | Distinguish the defined Phase 1.1-A contract, implemented Phase 1.1-B core, absent distribution/install, and invalid/frozen C4-C. | Prevent a stale reading that Phase 1.1 has not started or that runtime verification passed. |
| [`docs/architecture.md`](../architecture.md) | State explicitly that the planned Installer is not implemented. | Prevent planned work from reading as a shipped feature. |
| [`docs/concepts/workflows.md`](../concepts/workflows.md) | Mark listed workflow families as candidates with no production Workflow entities. | Separate Kind/schema support from authored production definitions. |
| This report | Added the inventory, authority matrix, implementation evidence, findings, validations, and independent-review claims. | Prepare the requested review package without implying approval. |

- Created this review package. No `docs/model/README.md` change was needed: it already lists all 14 ACTIVE documents and the authority boundary.
- No source, schema, Policy, ADR, test, tool, adapter implementation, research evidence, generated output, roadmap, or canonical entity was changed. No file was deleted or moved.
- This reconciliation is limited to repository documentation and static implementation-state inspection at the stated commit. It is not an external runtime attempt, independent review, certification, release, or authorization to start R2.

## Independent-review gate

**R1-N PASS — FINAL DOCUMENTATION RECONCILIATION COMPLETE** and the requested independent architecture review have been completed. The review returned **PASS WITH FINDINGS**; its single non-blocking report wording finding is corrected in this follow-up. This result does **not** mean R1 certification, and R2 has not been started.
