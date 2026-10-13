# R2-F — Consolidated Semantic Audit & Decision Matrix

## 1. Baseline and authorization

- **Repository:** `hola675/NexoHarness`.
- **Baseline:** `65098419f14af3b854022e9edc7390e919b435de`.
- **Pre-work state:** `main`; `HEAD == origin/main == 65098419f14af3b854022e9edc7390e919b435de`; clean worktree after `git fetch origin`.
- **Authorization:** R1 has an approved internal architectural closure without tag. R2 diagnosis and documentary synthesis are authorized. No remediation, implementation, R3, roadmap change, tag, or release is authorized.
- **Scope:** reconcile all 14 numbered inventory topics and the actual numbered findings in R2-A through R2-E. Findings retain their original meaning/history; their dispositions below are this synthesis's coverage classifications, not canonical lifecycle states.
- **Inspection method:** all six primary R2 records were read in full, as were the required R1 reports, model/source-of-truth/versioning/roadmap documents. Technical source was consulted only to resolve a synthesis question: current validator roots/reference semantics, Agent/Contract shapes, renderer and manifest gates, and actual placeholder directories. Existing audit evidence is cited rather than repeating the five audits.

The code graph project `D-Proyectos-NexoHarness` was `ready`; its only partial parse is an unrelated invalid fixture. No structural code claim in this report relies on graph completeness. Direct source remains authoritative for implementation claims.

## 2. Executive summary

R2-A through R2-E establish a coherent architecture with several real **future capability gates**, not a current runtime or installer incident. The current tree has canonical schemas and validation, an in-memory Codex compiler/renderers, and documented governance boundaries. It does not have an Observer, runtime reference resolver, proposal store, approval engine, Codex distribution, installer, uninstaller, Doctor, or Codex runtime certification. Current repository validation and CI therefore cannot be read as proof of those absent capabilities.

The source ledger has **54 numbered findings**: 14 inventory entries and 40 findings across A-E. Each appears exactly once in the coverage crosswalk with exactly one treatment. The findings consolidate into **27 decision/architecture entries**. Of the 54 source findings, **39 are MERGED**, 6 PRESERVED, 3 DEFERRED, 4 REQUIRES_DECISION, and 2 RESOLVED_BY_EVIDENCE. These are mutually exclusive per-source counts; MERGED means evidence remains traceable under a consolidated entry, not resolved.

No P0 defect exists in an active installer/runtime consumer: those consumers do not exist. P0 gates apply only **before activating the named future capability**. Runtime identity, evidence, privacy, and approval prerequisites are P1 for a future Observer/proposal/promotion capability. Documentation clarifications and naming/syntax debt that have no consumer are P2. Risk severity is kept separate from implementation priority.

The repository target order remains `Codex → Claude Code → Kilo Code`; a separate strategic direction in the R2 inventory says `Codex → Kilo Code → Claude Code`. There is no accepted decision choosing between them. Record `TARGET PRIORITY — DECISION REQUIRED`; do not infer a winner. The product's V1 boundary is also not precise enough to assume model, adapter, installation, runtime, and continuous improvement ship together: `V1 SCOPE — DECISION REQUIRED`.

## 3. Source coverage and treatment rules

Treatment categories are used only for this audit:

- **PRESERVED** — a supported boundary or current behavior remains the recommendation; no new defect is asserted.
- **MERGED** — a source finding is represented in a consolidated entry with related evidence; it remains open or otherwise gets the status separately stated there.
- **RESOLVED_BY_EVIDENCE** — direct evidence in an already approved/reconciled record closes the specific ambiguity. No new policy/schema decision is inferred.
- **DEFERRED** — no current consumer justifies deciding or changing it; preserve the boundary until a use case activates it.
- **REQUIRES_DECISION** — a responsible decision is a prerequisite to a named future capability or commitment.

### Numbered findings crosswalk

Each source identifier below has exactly one treatment. A consolidated ID joins related findings; its priority and status appear in Section 5.

| Source | Consolidated ID | Treatment |
|---|---|---|
| Inventory `INV-01` | CF-05 | MERGED |
| Inventory `INV-02` | CF-08 | MERGED |
| Inventory `INV-03` | CF-01 | MERGED |
| Inventory `INV-04` | CF-03 | MERGED |
| Inventory `INV-05` | CF-04 | RESOLVED_BY_EVIDENCE |
| Inventory `INV-06` | CF-07 | MERGED |
| Inventory `INV-07` | CF-08 | MERGED |
| Inventory `INV-08` | CF-09 | MERGED |
| Inventory `INV-09` | CF-06 | DEFERRED |
| Inventory `INV-10` | CF-20 | MERGED |
| Inventory `INV-11` | CF-14 | MERGED |
| Inventory `INV-12` | CF-16 | MERGED |
| Inventory `INV-13` | CF-21 | MERGED |
| Inventory `INV-14` | CF-01 | MERGED |
| R2A-01 | CF-01 | MERGED |
| R2A-02 | CF-01 | MERGED |
| R2A-03 | CF-02 | PRESERVED |
| R2A-04 | CF-02 | PRESERVED |
| R2A-05 | CF-01 | MERGED |
| R2B-01 | CF-07 | MERGED |
| R2B-02 | CF-07 | MERGED |
| R2B-03 | CF-08 | MERGED |
| R2B-04 | CF-09 | MERGED |
| R2B-05 | CF-14 | MERGED |
| R2B-06 | CF-16 | MERGED |
| R2B-07 | CF-05 | MERGED |
| R2B-08 | CF-18 | PRESERVED |
| R2C-01 | CF-08 | MERGED |
| R2C-02 | CF-03 | MERGED |
| R2C-03 | CF-10 | DEFERRED |
| R2C-04 | CF-11 | REQUIRES_DECISION |
| R2C-05 | CF-09 | MERGED |
| R2C-06 | CF-12 | PRESERVED |
| R2C-07 | CF-13 | RESOLVED_BY_EVIDENCE |
| R2C-08 | CF-15 | MERGED |
| R2D-01 | CF-17 | DEFERRED |
| R2D-02 | CF-19 | PRESERVED |
| R2D-03 | CF-14 | MERGED |
| R2D-04 | CF-14 | MERGED |
| R2D-05 | CF-14 | MERGED |
| R2D-06 | CF-16 | MERGED |
| R2D-07 | CF-15 | MERGED |
| R2D-08 | CF-15 | MERGED |
| R2D-09 | CF-20 | MERGED |
| R2E-01 | CF-21 | MERGED |
| R2E-02 | CF-21 | MERGED |
| R2E-03 | CF-21 | MERGED |
| R2E-04 | CF-22 | MERGED |
| R2E-05 | CF-23 | REQUIRES_DECISION |
| R2E-06 | CF-24 | REQUIRES_DECISION |
| R2E-07 | CF-22 | MERGED |
| R2E-08 | CF-25 | REQUIRES_DECISION |
| R2E-09 | CF-26 | PRESERVED |
| R2E-10 | CF-27 | MERGED |

The inventory's separate target-priority statement is not one of its 14 numbered topics; it is retained as **SUP-TP** under CF-27. The source totals are 14 + 5 + 8 + 8 + 9 + 10 = 54. No expected identifier was assumed: IDs were checked against the actual headings/tables in each record.

### Baseline sources

- R2 records: [entry inventory](r2-canonical-ontology-entry-inventory.md), [R2-A](r2-a-capability-runtime-diagnostic.md), [R2-B](r2-b-observation-proposal-lifecycle-diagnostic.md), [R2-C](r2-c-governance-contracts-approval-diagnostic.md), [R2-D](r2-d-runtime-references-identity-integrity-diagnostic.md), [R2-E](r2-e-distribution-deployment-safety-diagnostic.md).
- R1 evidence: [final reconciliation](r1-final-reconciliation-report.md), [independent architecture review](r1-independent-architecture-review.md), and [internal closure decision](r1-internal-closure-decision.md).
- Model and authority: [model index](../model/README.md), [canonical information](../model/canonical-information.md), [capability/runtime](../model/capability-runtime.md), [governance/authority](../model/governance-authority.md), [learning/evolution](../model/learning-evolution.md), [distribution/release](../model/distribution-release.md), [assurance/certification](../model/assurance-certification.md), [source of truth](../source-of-truth.md), [versioning](../versioning.md), and [roadmap](../../ROADMAP.md).

## 4. Consolidation map

| Group | Consolidated entries | Principal overlap / decision seam |
|---|---|---|
| A — Semantic boundaries | CF-01–CF-06 | Capability fulfillment wording, Resolver/Adapter, Agent contracts, Role/Agent, complexity and Rule trigger. |
| B — Governance & approval | CF-08–CF-13 | Change-size and approval taxonomies, approval evidence/owner, Contract validation, delegation, resolved READY. |
| C — Observation & improvement | CF-07, CF-14–CF-18 | Observation status axes, runtime references/identity, provenance/evidence, storage/retention, privacy. |
| D — Distribution & installation | CF-21–CF-26 | Eligibility, complete artifact set/runtime dependencies, path compatibility, provenance trust, installer reconciliation, assurance/release. |
| E — Governance decisions & maintenance debt | CF-19–CF-20, CF-27 | CanonicalIndex/version behavior, directory naming, target order/V1 scope. |

Related findings are consolidated where they share a future decision boundary. Distinct source facts remain distinguished within the entry; for example, `metadata.status` is not collapsed into `resultStatus`, and integrity is not collapsed into authorization.

## 5. Consolidated matrix

Priority means when a gate matters: **P0** before activating a specific consumer; **P1** before a dependent future capability; **P2** clarification or maintenance that can wait. Status is current (`OPEN`, `DEFERRED`, `CLARIFIED`, `PRESERVED`), not approval.

### Group A — Semantic boundaries

#### CF-01 — Capability fulfillment wording and Adapter/Resolver/Profile boundary

- **Source findings:** INV-03, INV-14, R2A-01, R2A-02, R2A-05.
- **Canonical authority:** Core Directive and accepted [ADR 0004](../decisions/0004-codex-adapter-translation-contract.md); current responsibility detail in capability/runtime model and Codex translation contract.
- **Confirmed behavior:** Profile bundles requirements/constraints; Adapter translates target semantics; Runtime Resolver (not implemented) is the conceptual owner of selecting a compatible Binding. Codex compiler has no Provider/Binding selection input.
- **Gap / risk:** two phrases (“decide how a capability is fulfilled” and “adapter-resolved provider”) can blur requirements, translation, and runtime selection. No observed authority expansion or provider selection results.
- **Current / future impact:** current behavior is bounded and documented elsewhere; future reader confusion only unless a Resolver is implemented.
- **Proposed disposition:** `REFINE` wording, without changing semantics. **Dependency:** an authorized documentation decision. **Minimum candidate:** one short clarification assigning Profile constraints, Adapter translation, and Resolver Binding selection.
- **Decision owner:** responsible maintainer; no external decision identity is recorded. **Gate:** before publishing a new normative wording or implementing Resolver. **Priority/status:** P2 / OPEN.

#### CF-02 — Capability references, availability, Authority, and Permission remain separate

- **Source findings:** R2A-03, R2A-04.
- **Canonical authority:** Agent schema, governance/authority model, ADR 0005, Codex compiler and role-renderer contract.
- **Confirmed behavior:** Capability references express needs/provenance; canonical Agent authority is separate; Provider availability does not imply authority or runtime Permission. Role rendering does not emit tools/providers/permissions.
- **Gap / risk:** Resolver and runtime Permission checks are future concepts. Risk exists only if a later consumer treats `usable`, availability, or a reference as a grant.
- **Current / future impact:** current boundary is coherent; preserve it for any future runtime binding.
- **Proposed disposition:** `KEEP`. **Dependency:** none for current behavior. **Minimum candidate:** none; future implementation must retain separate checks.
- **Decision owner:** not applicable unless a runtime authorization design is proposed. **Gate:** any Resolver/provider/permission feature. **Priority/status:** P1 before that feature / PRESERVED.

#### CF-03 — Agent inputs and output Contract expectations

- **Source findings:** INV-04, R2C-02.
- **Canonical authority:** Agent and Contract schemas; Agent/Contract concepts; Workforce and orchestration models.
- **Confirmed behavior:** Agent concept describes inputs/output Contract as expectations; the Agent schema has no such typed fields and only an optional free-text `handoff`. Contract definitions are canonical, while instances are runtime.
- **Gap / risk:** a concept-level expectation may be mistaken for schema validation or a verified handoff. No current Agent production entities/runtime handoff consumer were found.
- **Current / future impact:** no current validator promise; future routing/contract validation requires an owning relationship and instance validator.
- **Proposed disposition:** `REFINE` explanatory text if needed; do not add Agent fields by default. **Dependency:** choose whether Workflow/Assignment or Agent owns the relationship and identify a consumer. **Minimum candidate:** clarify current conceptual-only status first.
- **Decision owner:** responsible maintainer. **Gate:** before a typed Agent handoff or schema-backed contract consumer. **Priority/status:** P1 before that capability / OPEN.

#### CF-04 — Roadmap Phase 3 is not one Agent per responsibility line

- **Source findings:** INV-05.
- **Canonical authority:** Workforce model and the R1 final reconciliation of its Phase 3 interpretation.
- **Confirmed behavior:** the model explicitly says evaluate each responsibility, choose organizational Roles, apply the Agent creation gate, then implement a minimum actor model; each roadmap line does not imply an Agent. R1 records this interpretation and left `ROADMAP.md` unchanged.
- **Gap / risk:** no unresolved semantic gap established by this source set. The roadmap still names work areas, not an approved Agent catalogue.
- **Current / future impact:** prevents premature Agent/entity creation; no change required.
- **Proposed disposition:** `KEEP` current interpretation. **Dependency:** none. **Minimum candidate:** none.
- **Decision owner:** not applicable for the current clarification. **Gate:** if a future roadmap revision creates production Agent commitments. **Priority/status:** P2 / CLARIFIED (`RESOLVED_BY_EVIDENCE`).

#### CF-05 — Organizational Complexity and Observation complexity are not yet mapped

- **Source findings:** INV-01, R2B-07.
- **Canonical authority:** Observation schema; lifecycle, Learning/Evolution, and Knowledge/Experience models.
- **Confirmed behavior:** Observation permits `BOUNDED | COMPLEX`; organizational work classification also has `TRIVIAL`. No approved mapping or executable consumer was found.
- **Gap / risk:** shared labels do not prove equal measurement or lifecycle point. No current aggregation depends on an equivalence.
- **Current / future impact:** no current behavior change; future analytics could compare unlike axes if they assume equivalence.
- **Proposed disposition:** `KEEP` the separation; `REFINE` wording only if users need cross-axis comparison. **Dependency:** a consumer/use case requiring comparison. **Minimum candidate:** label axes and lifecycle points before a mapping.
- **Decision owner:** responsible maintainer if such use case is approved. **Gate:** before cross-axis aggregation. **Priority/status:** P2 / DEFERRED.

#### CF-06 — `Rule.trigger` remains absent pending an independent use case

- **Source findings:** INV-09.
- **Canonical authority:** Rule schema and Rule concept.
- **Confirmed behavior:** schema rejects undeclared fields and has no `trigger`; concept records its future intent as unclear.
- **Gap / risk:** adding a trigger without semantics could duplicate activation/routing mechanisms. No present consumer requires it.
- **Current / future impact:** none; the absence is valid current behavior.
- **Proposed disposition:** `NO CHANGE`. **Dependency:** a use case proving independent value and owner. **Minimum candidate:** first document trigger semantics and relationship to workflow/skill activation; no schema change implied.
- **Decision owner:** responsible maintainer. **Gate:** before any proposal to add the field. **Priority/status:** P2 / DEFERRED.

### Group B — Governance & approval

#### CF-08 — Change size is not an approval authority scale

- **Source findings:** INV-02, R2C-01.
- **Canonical authority:** Governance/Authority, Learning/Evolution, Self-Improvement Policy, Assurance/Certification.
- **Confirmed behavior:** `LOCAL | BOUNDED | STRUCTURAL | CONSTITUTIONAL` is conceptual change-size vocabulary. It does not assign approvers; no A0–A3 or automatic mapping is accepted.
- **Gap / risk:** future automation might infer approval rights from size. Current decisions still require explicit authority/approval.
- **Current / future impact:** no present approval is granted by classification. Any automated gate needs a separate policy decision.
- **Proposed disposition:** `KEEP` the axes separate. **Dependency:** approval automation or a specific protected-change workflow. **Minimum candidate:** if needed, define independent approval criteria by protected change/scope rather than reusing size labels.
- **Decision owner:** responsible maintainer. **Gate:** before an automated approval gate. **Priority/status:** P1 before approval automation / OPEN.

#### CF-09 — Proposal decision, approval, review, and promotion evidence

- **Source findings:** INV-07, INV-08, R2B-03, R2B-04, R2C-05.
- **Canonical authority:** ImprovementProposal schema, Self-Improvement Policy, Learning/Evolution, Canonical Information, Governance, and Assurance.
- **Confirmed behavior:** `requiresExplicitApproval: true` states a requirement, not an approval result. Proposal `metadata.status` has no defined proposal decision meaning. Review/Evaluation are distinct from Approval; Promotion is a later governed action. No Proposal runtime store or promotion engine exists.
- **Gap / risk:** a future producer could confuse `stable`, PASS, or a favorable review with approval/promotion, or fail to preserve decision evidence. No current runtime transition does so.
- **Current / future impact:** current schema does not claim approval. Before proposal automation/promotion, decision identity, scope, evidence, and transition record need an owner.
- **Proposed disposition:** `REFINE` a future decision/evidence contract; retain all lifecycle boundaries. **Dependency:** CF-11 authority/decision-record ownership and CF-15 identity/evidence resolution. **Minimum candidate:** document where an explicit human decision is recorded before automating transitions; avoid overloading `metadata.status` without decision.
- **Decision owner:** responsible maintainer; specific approver identity/role is not established. **Gate:** before a Proposal producer or promotion gate relies on machine-readable approval. **Priority/status:** P1 / OPEN.

#### CF-10 — Contract Definition validation is not Contract Instance validation

- **Source findings:** R2C-03.
- **Canonical authority:** Contract schema/concept, canonical validator, Work Lifecycle model.
- **Confirmed behavior:** canonical validation checks Contract Definition shape; some lists may be empty/omitted. No runtime Contract Instance validator exists.
- **Gap / risk:** a valid definition does not prove useful payload constraints or that a runtime handoff satisfies them. No runtime instance violation was observed.
- **Current / future impact:** do not claim instance validation or handoff correctness from schema PASS. A future consumer must define which constraints it enforces.
- **Proposed disposition:** `NO CHANGE` now; defer contract-consumer design. **Dependency:** a concrete runtime producer/consumer and handoff use case. **Minimum candidate:** identify owner and validation claim before tightening schema constraints.
- **Decision owner:** responsible maintainer. **Gate:** before a runtime handoff claims conformance. **Priority/status:** P1 before that consumer / DEFERRED.

#### CF-11 — Decision rights, approver identity, and traceability

- **Source findings:** R2C-04.
- **Canonical authority:** Governance/Authority, Precedence, Completion, Evidence Policies.
- **Confirmed behavior:** relevant decisions should trace decision, scope, authority source, evidence, and applicable approval. No universal approver identity, actor registry, or decision store is selected; cited Policies are source documents, not runtime enforcement.
- **Gap / risk:** future protected transitions cannot be automated safely without resolving who can approve what and how the approval binds to scope. Current product has no such engine.
- **Current / future impact:** human approval is current direction for protected canonical changes; no automatic authority may be inferred from Role, Agent, Provider, or environment Permission.
- **Proposed disposition:** `REQUIRES_DECISION` before implementing automated approval. **Dependency:** define protected change classes and approval evidence scope; related to CF-08/09. **Minimum candidate:** retain manual explicit approval with traceable evidence until a decision model is authorized.
- **Decision owner:** responsible maintainer; named actor/approver identity is unknown. **Gate:** before automated approval or Promotion. **Priority/status:** P1 / OPEN.

#### CF-12 — Delegation remains bounded and cannot create authority

- **Source findings:** R2C-06.
- **Canonical authority:** Delegation Policy, Governance/Authority, Workforce and Operations/Orchestration models.
- **Confirmed behavior:** delegation names objective, scope, context, output, and completion condition; parent accountability remains. Role, Agent, Capability, Permission, and Authority are distinct.
- **Gap / risk:** automatic enforcement is not implemented; documents do not claim it is.
- **Current / future impact:** preserve the ceiling `child <= delegated <= parent/Assignment authority`; runtime enforcement becomes a requirement only if delegation is automated.
- **Proposed disposition:** `KEEP`. **Dependency:** future delegation runtime. **Minimum candidate:** no change to current sources; define enforcement only with an authorized consumer.
- **Decision owner:** responsible maintainer if automation is proposed. **Gate:** before automated delegation execution. **Priority/status:** P1 for automation / PRESERVED.

#### CF-13 — Completion `READY` is already resolved by scope

- **Source findings:** R2C-07.
- **Canonical authority:** R1-G evidence, Completion Policy, Contract concept, Work Lifecycle and Assurance models.
- **Confirmed behavior:** Intake READY, Contract Instance handoff READY, and terminal Assignment outcomes are separate scopes. R1 reconciliation records this as resolved; no contrary evidence in R2-C.
- **Gap / risk:** none established. Reopening without new evidence would recreate a settled issue.
- **Current / future impact:** keep READY as nonterminal handoff readiness, not Assignment PASS or approval.
- **Proposed disposition:** `KEEP` the R1-G resolution. **Dependency:** none. **Minimum candidate:** none.
- **Decision owner:** none for current status. **Gate:** reopen only with contradictory evidence. **Priority/status:** P2 / CLARIFIED (`RESOLVED_BY_EVIDENCE`).

### Group C — Observation & improvement

#### CF-07 — Observation metadata status and resultStatus are separate axes

- **Source findings:** INV-06, R2B-01, R2B-02.
- **Canonical authority:** shared envelope and Observation schema; Canonical Information and Assurance models.
- **Confirmed behavior:** shared `metadata.status` is schema-required but has no defined runtime Observation lifecycle meaning. `spec.resultStatus` is a separate Observation result (`observed`, `validated`, `failed`, `blocked`); it is not completion, Evaluation, or Certification. No Observer consumer exists.
- **Gap / risk:** `stable` or `validated` may be overread as canonical truth or assurance absent criteria. No such consumer behavior was observed.
- **Current / future impact:** schema acceptance remains structural only. Before writing/consuming runtime Observations, determine what is being assessed and what evidence supports `validated`.
- **Proposed disposition:** `REFINE` future documentation/contract criteria without conflating fields. **Dependency:** Observer use case, CF-16 identity/source-of-record and CF-18 privacy. **Minimum candidate:** document explicitly that generic metadata status is not approval/truth and define result criteria before a writer exists.
- **Decision owner:** responsible maintainer. **Gate:** before an Observer writer/consumer claims result semantics. **Priority/status:** P1 before Observer semantics / OPEN.

#### CF-14 — Canonical reference resolution does not resolve runtime references

- **Source findings:** INV-11, R2B-05, R2D-03, R2D-04, R2D-05.
- **Canonical authority:** reference field rules, CanonicalIndex validator, Canonical Information and D's complete 14-field inventory.
- **Confirmed behavior:** current index resolves schema-valid, correctly placed canonical records only. Observation/ImprovementProposal runtime source records are not indexed. Runtime schemas/fixtures validate syntax, not target existence/scope/availability. `ANY` skips only finite target-Kind checking; it still parses and looks up against the canonical index. Canonical diagnostics may independently report type mismatch and unresolved target.
- **Gap / risk:** no runtime resolver exists; treating declarations/fixture PASS as resolved runtime integrity would be unsupported.
- **Current / future impact:** canonical reference guarantees are intact. A runtime consumer needs identity/source-of-record and explicit missing, inaccessible, stale, wrong-scope/version semantics.
- **Proposed disposition:** `REFINE` before a runtime producer depends on resolution. **Dependency:** CF-16 runtime identity/store and information-class relationship policy. **Minimum candidate:** choose authoritative runtime source and scope before specifying checks; do not extend canonical discovery by assumption.
- **Decision owner:** responsible maintainer. **Gate:** before a runtime reference consumer or approval gate relies on resolution. **Priority/status:** P1 / OPEN.

#### CF-15 — Evidence sufficiency, provenance, and proposal support

- **Source findings:** R2C-08, R2D-07, R2D-08.
- **Canonical authority:** ImprovementProposal/Observation schemas, Evidence and Self-Improvement Policies, Learning/Evolution and Canonical Information.
- **Confirmed behavior:** `observationRefs` is required as a property but `[]` is schema-valid. `provenanceRefs` and Observation `spec.evidence` are string lists, not resolved typed links. No runtime Proposal store/resolver exists; conceptual sources may include evidence beyond Observation.
- **Gap / risk:** syntax or a non-empty text reference alone cannot prove the evidence exists, is accessible/current/relevant, or is sufficient for the proposed scope. There is no observed orphan runtime Proposal.
- **Current / future impact:** preserve `SCHEMA VALID != EVIDENCE SUFFICIENT != REVIEWED != APPROVED != PROMOTED`. Before proposal approval/promotion, evidence source admissibility and sufficiency need an explicit gate.
- **Proposed disposition:** `REQUIRES_DECISION` when enabling proposal/promotion consumers. **Dependency:** CF-16 identity and CF-11 decision evidence. **Minimum candidate:** define admissible evidence, resolution, freshness, and sufficiency owner; do not assume `minItems: 1` alone resolves it.
- **Decision owner:** responsible maintainer. **Gate:** before an approval/promotion transition relies on proposal evidence. **Priority/status:** P1 / OPEN.

#### CF-16 — Runtime identity, source-of-record, storage, and retention

- **Source findings:** INV-12, R2B-06, R2D-06.
- **Canonical authority:** Canonical Information, Learning/Evolution, Knowledge/Experience and Self-Improvement Policy.
- **Confirmed behavior:** Observation/Proposal schemas require envelope identity syntax, but there is no generator/store, uniqueness namespace, runtime resolver, physical Proposal location, or concrete retention policy. Contract Instance, Assignment, and Evaluation Run identity are conceptual/unknown. `observer/` is placeholder-only.
- **Gap / risk:** syntax does not guarantee uniqueness, persistence, cross-run resolution, correction linkage, retention, or deletion semantics. No current runtime persistence claim exists.
- **Current / future impact:** no runtime identity guarantee today. These decisions become prerequisites for persistence/correlation and R2B/C/D referenced runtime consumers.
- **Proposed disposition:** `DEFER` storage design until a concrete producer/consumer is approved; before that, decide per-artifact scope, source-of-record, retention, privacy, correction/history behavior. **Dependency:** selected runtime use case and CF-18 privacy.
- **Decision owner:** responsible maintainer. **Gate:** before persisting runtime records or resolving references across executions. **Priority/status:** P1 before persistence / DEFERRED.

#### CF-17 — Canonical reference ID/version syntax is narrower than full SemVer assumptions

- **Source findings:** R2D-01.
- **Canonical authority:** common schema, reference parser, ADR 0001.
- **Confirmed behavior:** canonical identity is `Kind:id`; optional reference version is exact matching numeric triplet. Regex accepts leading zeros and does not implement SemVer ordering/ranges/compatibility; reference ID does not impose the metadata ID's maximum length.
- **Gap / risk:** consumers may assume full SemVer compatibility or historical selection. No current need for range/history resolution is established.
- **Current / future impact:** current exact-pin references work under actual syntax; no version ordering or compatibility guarantee should be claimed.
- **Proposed disposition:** `DEFER` syntax change; consider narrow documentation clarification if useful. **Dependency:** longer IDs, history, or compatibility consumer. **Minimum candidate:** align only the specific bound/semantics proven necessary.
- **Decision owner:** responsible maintainer. **Gate:** before a consumer depends on version ranges/history or IDs beyond bound. **Priority/status:** P2 / DEFERRED.

#### CF-18 — Privacy schema value is not authorization to collect source content

- **Source findings:** R2B-08.
- **Canonical authority:** Observation schema, Task Observer contract, Learning/Evolution, Evidence and Self-Improvement Policies.
- **Confirmed behavior:** `privacy.sourceContentStored` is a boolean shape; the Observer contract expects false by default and requires separately approved collection policy for true. No Observer runtime or approved content-collection policy was found.
- **Gap / risk:** a future writer could mistake schema-valid `true` for collection permission. This is a high privacy risk if activated, but not an observed exposure.
- **Current / future impact:** no collection behavior exists. Any future capture needs scoped authorization, content classes, retention, and handling; unavailable telemetry remains absent rather than fabricated.
- **Proposed disposition:** `KEEP` restrictive boundary. **Dependency:** approved collection policy and CF-16 retention. **Minimum candidate:** no collection until that policy exists.
- **Decision owner:** responsible maintainer with governance authority; identity is not specified here. **Gate:** before any source-content collection. **Priority/status:** P1 / PRESERVED.

### Group D — Distribution & installation

#### CF-21 — One bundle-level eligibility gate must include renderers and previews

- **Source findings:** INV-13, R2E-01, R2E-02, R2E-03.
- **Canonical authority:** ADR 0005, distribution/release model, Codex renderer result types and C4-B1 review.
- **Confirmed behavior:** ADR 0005 requires compilation usable AND renderer success AND no renderer-level blocking diagnostic. Agent-role rendering exposes `deploymentEligible` and can produce non-deployable previews; AGENTS/Skill results do not expose the same field. Diagnostic propagation differs. No bundle consumer exists.
- **Gap / risk:** manifest construction can hash preview bytes without carrying renderer eligibility; downstream consumer could mistake bytes/hash for deployability. This is a future misuse risk, not a current installer defect.
- **Current / future impact:** none in current in-memory/no-installer system. P0 before any Phase 1.2 consumer trusts output.
- **Proposed disposition:** `REQUIRES_DECISION` on aggregate eligibility owner/representation before consumer implementation; preserve ADR 0005 formula. **Dependency:** CF-22 exact artifact-set contract. **Minimum candidate:** a fail-closed bundle gate bound to exact renderer results/artifacts, preserving all diagnostics and preview state; representation/API is not selected.
- **Decision owner:** responsible maintainer. **Gate:** before a manifest consumer/installer treats bytes as deployable. **Priority/status:** P0 at activation / OPEN.

#### CF-22 — Bundle completeness and unsatisfied runtime dependencies

- **Source findings:** R2E-04, R2E-07.
- **Canonical authority:** compilation/runtime dependency model, distribution model, renderer contracts.
- **Confirmed behavior:** manifest helper accepts arbitrary, including empty, artifact lists and does not know expected renderers or source coverage. `runtimeDependencies` records Workflow/Contract with `satisfied:false`; required dependencies normally block compile, while explicitly degraded optional dependencies may remain warnings.
- **Gap / risk:** valid digest metadata does not prove complete renderer output or an installed Nexo runtime. Empty output may be valid for a no-op component, not necessarily an installable integration.
- **Current / future impact:** no materialized distribution today. Before packaging, operation intent must determine expected artifacts; consumer must retain severity and required/optional dependency semantics.
- **Proposed disposition:** `REFINE` bundle assembly contract. **Dependency:** CF-21 and an approved distribution intent. **Minimum candidate:** bind manifest to exact assembler-validated renderer output set and fail required unsatisfied runtime needs.
- **Decision owner:** responsible maintainer. **Gate:** before distribution is labeled complete/deployable. **Priority/status:** P0 at packaging/consumer / OPEN.

#### CF-23 — Target filesystem path equivalence and collisions

- **Source findings:** R2E-05.
- **Canonical authority:** ADR 0005 path safety boundary and future supported target/platform contract.
- **Confirmed behavior:** manifest normalizes separators and rejects traversal, absolute paths, and exact duplicates. Role renderer case-folds its internal role paths; manifest does not check case-fold or parent/child collisions. Current renderers constrain many paths; no filesystem writes exist.
- **Gap / risk:** no general collision guarantee exists across target filesystem semantics. Risk activates only with materialization/installation.
- **Current / future impact:** no current overwrite path; future bundle must define supported platforms and path equivalence.
- **Proposed disposition:** `REQUIRES_DECISION` on supported filesystem model at distribution design. **Dependency:** target/platform scope and artifact path contract. **Minimum candidate:** test normalized exact, case-fold, and file/directory-prefix conflicts for the chosen scope.
- **Decision owner:** responsible maintainer. **Gate:** before bundle materialization or file installation. **Priority/status:** P0 at activation / OPEN.

#### CF-24 — Manifest hashes/provenance do not authenticate producer or approval

- **Source findings:** R2E-06.
- **Canonical authority:** distribution/release model, Canonical Information, Governance, Versioning.
- **Confirmed behavior:** manifest carries source refs, adapter/target versions and unsigned content hashes; no source-revision SHA or producer signature. Documentation explicitly separates hash, authenticity, authorization, and certification.
- **Gap / risk:** manifest alone cannot prove source commit, trusted producer, approval, or certification. No bundle is currently published.
- **Current / future impact:** future distribution channel needs provenance/trust evidence appropriate to its threat model; this is not a current failed release.
- **Proposed disposition:** `REQUIRES_DECISION` when channel is selected. **Dependency:** threat model, distribution channel, approval/certification scope. **Minimum candidate:** specify required source and producer binding before selecting signature/field representation.
- **Decision owner:** responsible maintainer. **Gate:** before publishing or consuming a bundle across a trust boundary. **Priority/status:** P0 before trusted publication / OPEN.

#### CF-25 — Installation scope, ownership, collision, drift, rollback, uninstall

- **Source findings:** R2E-08.
- **Canonical authority:** distribution/release model, Codex translation contract, source-of-truth, Governance.
- **Confirmed behavior:** principles require explicit scope and authorization, preserve user files, stop on unresolved collision/unknown ownership, and separate install/removal. `installer/` is `.gitkeep` only; no installer/uninstaller, ownership inventory, drift or rollback implementation exists.
- **Gap / risk:** there is no current mechanism to prove scope, ownership, idempotence, partial-apply safety, rollback, or removal. A hash/manifest cannot supply these.
- **Current / future impact:** no current install operation. These become P0 before any installation/update/removal claim.
- **Proposed disposition:** `REQUIRES_DECISION` on scope/ownership/reconciliation contract before implementation authorization. **Dependency:** CF-21 eligibility, CF-22 bundle intent, CF-23 path model, governance authorization. **Minimum candidate:** first approve an explicit user-reviewed scope and unknown-ownership no-overwrite/collision-stop behavior; defer broader claims until tested.
- **Decision owner:** responsible maintainer. **Gate:** before installer implementation or filesystem mutation. **Priority/status:** P0 at activation / OPEN.

#### CF-26 — Doctor, runtime verification, certification, and release are separate claims

- **Source findings:** R2E-09.
- **Canonical authority:** Assurance/Certification, Distribution/Release, Versioning, `phase-close.ts`, `verify-release.ts`, CI/Release workflows.
- **Confirmed behavior:** CI validates repository code. `phase:close` promotes an approved exact SHA to a phase tag after fresh repository checks; Release workflow creates a GitHub Release but no Codex bundle. Doctor is absent. C4-C R5-F2 remains `INVALID / FROZEN`.
- **Gap / risk:** green CI/tag/release object does not prove installation, target loading/behavior, or Codex certification. No current docs reviewed claim these are established.
- **Current / future impact:** preserve claim scopes. Runtime verification needs target evidence; Certification and product publication each have separate gates.
- **Proposed disposition:** `KEEP` distinctions and frozen probe status. **Dependency:** eligible distribution and installation evidence before runtime claim. **Minimum candidate:** claim-specific assurance plan only after prerequisites exist.
- **Decision owner:** responsible maintainer. **Gate:** before a Doctor/runtime/certification/product-release claim. **Priority/status:** P0 for those claims / PRESERVED.

### Group E — Governance decisions & maintenance debt

#### CF-19 — CanonicalIndex is one current logical record per `Kind:id`

- **Source findings:** R2D-02.
- **Canonical authority:** ADR 0001, canonical discovery/integrity validator, validation model.
- **Confirmed behavior:** index key omits version; duplicate same Kind/id is diagnosed even at differing versions; a versioned ref requires exact equality with the one indexed record. No history/range selection is implemented.
- **Gap / risk:** only future historical-resolution consumers would need more. Current single-version lookup is tested and explicit.
- **Current / future impact:** current references resolve as intended under unique current key; no automatic history claim.
- **Proposed disposition:** `KEEP`. **Dependency:** concrete historical/version compatibility use case. **Minimum candidate:** separate history source only if required, not automatically expand index.
- **Decision owner:** not required for current behavior. **Gate:** before adding historical resolution. **Priority/status:** P2 / PRESERVED.

#### CF-20 — `requiredCanonicalDirectories` is naming debt, not discovery behavior

- **Source findings:** INV-10, R2D-09.
- **Canonical authority:** repository validator and Canonical Information/source-of-truth.
- **Confirmed behavior:** list contains required repository directories, including non-canonical roots; `CANONICAL_ROOTS` alone drives canonical discovery. Current behavior is correct.
- **Gap / risk:** name may confuse maintainers; no validation error or architecture defect is shown.
- **Current / future impact:** none operational. Rename is not required for V1 absent evidence of confusion/API need.
- **Proposed disposition:** `DEFER` naming-only cleanup. **Dependency:** explicit maintenance value and API/test references. **Minimum candidate:** rename only, preserving exact list/checks.
- **Decision owner:** responsible maintainer. **Gate:** ordinary approved maintenance change. **Priority/status:** P2 / DEFERRED.

#### CF-27 — Target order and V1 product scope require explicit responsible-person decisions

- **Source findings:** R2E-10 and supplemental inventory statement `SUP-TP` (the inventory's separate target-priority decision).
- **Canonical authority:** current architecture, model index, README/ROADMAP, ADR 0003, target-specific research, and explicit project strategy supplied outside those repository documents.
- **Confirmed behavior:** current repository documentation orders Codex → Claude Code → Kilo Code. The recorded strategic instruction orders Codex → Kilo Code → Claude Code. No accepted ADR resolves Claude/Kilo priority. ADR 0003 pins current Codex Local CLI research/adapter scope, not the future product order. The documents do not define one encompassing V1 across model, adapter, installer, runtime, and Observer.
- **Gap / risk:** selecting an order or one broad V1 by inference could overstate authority and misallocate certification work.
- **Current / future impact:** Codex CLI 0.160.0 remains the current bounded target. Future target certification and V1 commitments are open; `ROADMAP.md` must remain unchanged in R2-F.
- **Proposed disposition:** `REQUIRES_DECISION`; present options in docket. **Dependency:** responsible person clarifies authority/priority and intended V1 claim. **Minimum candidate:** make separate explicit decisions for product V1 scope and next target order; do not retrospectively reinterpret ADR 0003.
- **Decision owner:** responsible person/maintainer; no decision identifier or role record is supplied. **Gate:** before next-target certification commitment or product V1 claim. **Priority/status:** P1 / OPEN.

## 6. Prioritization

### P0 — prerequisites before activating a concrete consumer

No P0 implementation defect is active today because the named consumers are absent. Before enabling them, require:

- **Distribution consumer/Installer:** CF-21 uniform eligibility and preview preservation; CF-22 complete artifact intent and required runtime dependency handling; CF-23 target-path collision rules; CF-25 explicit scope/ownership/reconciliation. Resolve CF-24 to the chosen publication trust boundary before distributing beyond a trusted local process.
- **Runtime/certification claims:** CF-26 claim-relative Doctor/runtime evidence and separate certification/release gates. C4-C remains invalid/frozen until separately authorized work produces valid evidence.
- **Proposal promotion consumer:** CF-09/11/15 decision identity and evidence sufficiency gates before machine-supported approval/promotion. No current Proposal consumer makes these present P0 repository defects.

These gates block only the capability that relies on them; they do not block the present R2 audit or canonical model validation.

### P1 — needed before a selected future capability

- **Observer/proposal persistence and reference consumers:** CF-07, CF-14, CF-15, CF-16, CF-18 before writing, resolving, retaining, or claiming validated runtime Observations/Proposals.
- **Approval/Promotion automation:** CF-08, CF-09, CF-11 and CF-15 before automated rights, approval, evidence or promotion transitions.
- **Runtime authorization/delegation:** CF-02 and CF-12 before Resolver or automated delegated execution; capability availability/reference must not widen Authority or Permission.
- **Agent contract execution:** CF-03 and CF-10 before typed handoffs or claims that instances conform.
- **Product scope and target commitment:** CF-27 before a next-target certification or unified V1 claim.

### P2 — clarification or maintenance that can be deferred

- CF-01 wording; CF-04 already clarified; CF-05 comparison semantics; CF-06 Rule.trigger; CF-13 already clarified; CF-17 full SemVer/history assumptions; CF-19 current CanonicalIndex behavior; CF-20 naming cleanup.
- P2 is not “unimportant”; it means no current consumer requires a change. If a concrete consumer emerges, reassess its gate and risk.

## 7. Dependency graph

These are diagnostic dependencies, not an approved implementation plan. The two branches remain separate until a specific integration is selected.

### A. Distribution / Installer

```text
Select distribution intent and target scope (CF-27)
  → decide exact artifact set/completeness (CF-22)
  → define aggregate eligibility + preview/diagnostic gate (CF-21)
  → define target path compatibility (CF-23)
  → decide trusted provenance boundary for selected channel (CF-24)
  → decide explicit installation scope, ownership and reconciliation (CF-25)
  → separately authorized implementation and tests
  → Doctor/installation inspection
  → target-runtime verification (CF-26)
  → scoped certification
```

Order correction: artifact-set intent is needed to define what the eligibility gate is gating. Eligibility and exact bytes then precede installer consumption. Provenance/authenticity requirements depend on whether the bundle crosses a trust boundary, so that decision may be parallel to local installation design. Runtime verification and certification remain downstream claims, not installer outputs.

### B. Observer / Improvement

```text
Select Observer/proposal use case (CF-27)
  → decide runtime identity + source of record + scope (CF-16)
  → decide privacy/collection authorization and retention (CF-18, CF-16)
  → define runtime reference and availability outcomes (CF-14)
  → define Observation result semantics (CF-07)
  → define Proposal admissible evidence/sufficiency (CF-15)
  → define decision rights/record and approval transition (CF-11, CF-09, CF-08)
  → separately authorized producer/consumer implementation
  → Evaluation / Review / explicit Approval
  → governed Promotion
```

Identity and privacy/collection boundaries precede persistence; runtime reference resolution depends on an identity source. Proposal evidence adequacy and approval authority are separate decisions, even where both are prerequisites to Promotion. The chain does not require an installer dependency.

### Independent clarifications

CF-01/03/05/06/10/17/19/20 can be addressed on their own if an authorized, specific use case justifies it. They are not artificial prerequisites for the distribution or Observer branches.

## 8. V1 scope boundaries

The term “V1” is underspecified in current sources. Each row below is a distinct deliverable claim; choosing one does not imply the others.

| V1 claim | What current evidence supports | Prerequisites before claiming it | May be deferred independently |
|---|---|---|---|
| **Canonical model V1** | Registered schemas, source roots, and repository/canonical validation exist; schema-valid instances and runtime behavior remain different claims. | Define the exact model coverage claim; keep schema, integrity, and semantic/runtime validation distinct. | Runtime stores, Observer, Resolver, approval automation. |
| **Adapter V1** | Codex compiler and renderers exist in memory for the declared Codex Local CLI 0.160.0 target; authority gaps and preview status remain explicit. | A claim-scoped translation/support matrix and valid target evidence for each claimed behavior. | Filesystem installer, Doctor, other Codex versions/surfaces, Claude/Kilo adapters. |
| **Installable V1** | Not currently supported: no filesystem bundle or Installer exists. | CF-21–25; scope, eligible complete distribution, paths, ownership, collision/drift/apply/removal behavior and tests. | Observer and proposal promotion unless explicitly included in product scope. |
| **Runtime V1** | Not established by render success, repo tests, CI, or hashes. C4-C R5-F2 is `INVALID / FROZEN`. | Exact target/surface/version/configuration and runtime evidence, plus eligibility/install evidence where installation is in the claim. | Generic Provider Resolver and non-selected target surfaces. |
| **Continuous-improvement V1** | Schemas and Policies define boundaries; no Observer, Proposal store, approval/promotion runtime exists. | CF-07, CF-09, CF-11, CF-14–18 for any selected producer, evidence, approval, and promotion scope. | May be excluded from a model-only or adapter-only V1. |

**`V1 SCOPE — DECISION REQUIRED`.** Recommended governance approach: select and name a single claim scope (for example, model validation or pinned-target adapter) and list excluded capabilities explicitly. This is a recommendation, not an accepted product decision.

## 9. Proposed Decision Docket

Every option and recommendation below is unapproved. Approval status is `NOT APPROVED` for each item.

### DKT-01 — Define the first V1 claim boundary

- **Issue:** “V1” may mean model, adapter, installable, runtime, or improvement-continuous product.
- **Why needed:** acceptance criteria and prereqs differ materially; one broad label risks implying unsupported installation/runtime behavior.
- **Current evidence:** model and Codex adapter work exist; distribution, installer, Observer, and runtime certification do not.
- **Options:** (A) model-validation V1; (B) pinned Codex adapter V1; (C) installable/runtime Codex V1; (D) include Observer/promotion as well.
- **Recommended option:** select one claim boundary at a time and explicitly list exclusions; (A) or (B) is currently evidence-aligned. No one option is selected here.
- **Rationale:** minimizes scope while matching existing evidence and avoids coupling independent systems.
- **Impact if deferred:** product readiness cannot be stated precisely; no code change is blocked except broad V1 claims.
- **Blocked capability:** a unified product V1 claim.
- **Dependencies:** DKT-02 if adapter order is included; P0 gates only for selected install/runtime features.
- **Requested authority:** responsible maintainer/product decision.
- **Approval status:** `NOT APPROVED`.

### DKT-02 — Resolve future adapter target priority

- **Issue:** repository order is Codex → Claude Code → Kilo Code; recorded strategic instruction is Codex → Kilo Code → Claude Code.
- **Why needed:** next-target certification and future roadmap commitments require one authority decision.
- **Current evidence:** ADR 0003 selects Codex CLI 0.160.0 for current Phase 1 scope; R1 review notes no accepted ADR selects Claude/Kilo order.
- **Options:** (A) retain documented order; (B) adopt strategic order; (C) defer next-target commitment until evidence/strategy is reviewed.
- **Recommended option:** (C) until the responsible person explicitly chooses A or B; no roadmap reorder by inference.
- **Rationale:** respects both authorities without retroactively expanding ADR 0003.
- **Impact if deferred:** no next-target certification commitment; current Codex scope remains valid.
- **Blocked capability:** committing to the next target-specific certification.
- **Dependencies:** explicit source-of-authority/priority decision.
- **Requested authority:** responsible person.
- **Approval status:** `NOT APPROVED`.

### DKT-03 — Approve bundle eligibility and preview trust boundary before Phase 1.2

- **Issue:** renderers have different `usable`/diagnostic behavior; only Agent roles express `deploymentEligible`; manifest can hash previews and arbitrary/partial artifacts.
- **Why needed:** an installer needs a fail-closed decision tied to the exact eligible bundle.
- **Current evidence:** ADR 0005 formula and R2-E findings CF-21/22; no consumer exists.
- **Options:** (A) eligibility owned by bundle assembler; (B) eligibility owned by one consumer contract; (C) manifest-only flag without renderer aggregation.
- **Recommended option:** (A) or another single aggregate decision bound to exact renderer results/artifacts; reject (C) unless it carries sufficient verifiable inputs. The final representation remains undecided.
- **Rationale:** one complete gate reduces consumer disagreement and prevents preview promotion.
- **Impact if deferred:** Phase 1.2 cannot safely trust a manifest for installation.
- **Blocked capability:** manifest consumer/Installer.
- **Dependencies:** selected distribution intent and exact artifact set; renderer diagnostics.
- **Requested authority:** responsible maintainer, including API decision if needed.
- **Approval status:** `NOT APPROVED`.

### DKT-04 — Select artifact intent, supported paths, and distribution provenance level

- **Issue:** no contract specifies required outputs per install intent, target filesystem collision model, or trust proof across a distribution channel.
- **Why needed:** completeness, path safety, and authenticity have different boundaries.
- **Current evidence:** manifest validates relative paths and exact duplicates, hashes bytes, and includes no source revision/signature; no bundle is materialized.
- **Options:** (A) one minimal local-only bundle intent with pinned platform and source provenance; (B) multi-platform/portable bundle with stronger path and producer-authenticity requirements; (C) no bundle publication until channel/threat model is chosen.
- **Recommended option:** (C) until use/channel is selected, then specify A or B explicitly.
- **Rationale:** avoids designing a generic package without product or threat-model inputs.
- **Impact if deferred:** no package/publication or installer claim.
- **Blocked capability:** complete trusted distribution publication.
- **Dependencies:** DKT-01, CF-22–24.
- **Requested authority:** responsible maintainer.
- **Approval status:** `NOT APPROVED`.

### DKT-05 — Set installation scope, ownership, and reconciliation rules

- **Issue:** policy principles exist, but scope taxonomy, ownership evidence, collision handling, apply/rollback/removal behavior are not implemented or selected.
- **Why needed:** file mutation needs explicit authorization and safe handling of user state.
- **Current evidence:** no Installer exists; docs require no overwrite for unknown ownership and collision stop.
- **Options:** (A) one explicitly user-selected narrow scope, fail on unknown ownership/collision; (B) support multiple scopes after separate ownership rules; (C) defer Installer.
- **Recommended option:** (A) as a candidate for initial design, with (C) until that design is explicitly authorized. No scope path or algorithm is approved here.
- **Rationale:** narrow scope and fail-closed ownership reduce consequences of uncertainty.
- **Impact if deferred:** no installation/update/uninstall capability.
- **Blocked capability:** Installer, rollback and Doctor installation inventory.
- **Dependencies:** DKT-03/04; governance authorization for the action.
- **Requested authority:** responsible maintainer.
- **Approval status:** `NOT APPROVED`.

### DKT-06 — Establish runtime identity and evidence prerequisites if Observer/Proposal is selected

- **Issue:** no runtime identity/source-of-record, reference resolver, evidence sufficiency, privacy/retention, or approval record is implemented.
- **Why needed:** Observation/Proposal producers cannot claim resolved identity or support from schema-valid strings alone.
- **Current evidence:** R2-B/C/D; runtime roots/stores absent; `observationRefs: []` validates; collection requires separate policy.
- **Options:** (A) keep Observer/proposal production out of selected V1; (B) approve a bounded, privacy-reviewed runtime source and evidence contract before implementation; (C) build generic infrastructure without selected use case.
- **Recommended option:** (A) unless an approved concrete use case justifies (B); reject (C) as unsupported scope.
- **Rationale:** keeps model types distinct from absent runtime services and prevents speculative persistence.
- **Impact if deferred:** no runtime observation/proposal-resolution or promotion claim.
- **Blocked capability:** Observer persistence, evidence-backed proposals, approval/promotion automation.
- **Dependencies:** CF-11, CF-14–18; approved privacy and retention authority.
- **Requested authority:** responsible maintainer/governance authority; approver identity not currently specified.
- **Approval status:** `NOT APPROVED`.

No docket item approves implementation or a roadmap assignment.

## 10. Minimal remediation packages — candidate sequence only

These packages are not automatically assigned to R3. The later governance decision must authorize a phase and scope.

| Candidate package | Minimum scope | Dependencies | Proposed verification | Explicit exclusions |
|---|---|---|---|---|
| **P-A — Semantic clarification** | Clarify CF-01/03 only where readers need it; preserve conceptual vs schema-backed Agent Contract fields. CF-05 remains separate unless a comparison consumer exists. | Explicit documentary approval; no target-order decision needed. | Local-link checks; compare wording to ADRs/Policies/schemas; assert no semantic source edits. | No schema, Agent entity, Rule.trigger, or roadmap change. |
| **P-B — Runtime identity/evidence decision** | If runtime use case approved, decide per-artifact identity/source/scope, evidence admissibility/sufficiency, privacy/retention and decision record before choosing storage/validator. | DKT-06; CF-11/14–18. | Traceability table from each guarantee to approved owner and evidence; review privacy/authorization boundaries before implementation. | No new Kinds, roots, store, Observer, resolver, or approval engine in this diagnostic. |
| **P-C — Distribution eligibility** | Before Phase 1.2 consumer, specify complete artifact intent, aggregate eligibility/diagnostic/preview gate and required dependency handling. | DKT-03/04; CF-21/22. | State-transition tests distinguishing renderable, usable, deployable and preview; include arbitrary/empty/partial inputs and required vs explicitly degraded dependencies. | No manifest edits, bundle schema, installer or generated output until authorized. |
| **P-D — Safe reconciliation** | For an approved installation scope, specify ownership/collision/drift and reviewable apply, partial failure, rollback/removal semantics. | DKT-05; eligible distribution and target path scope. | Adversarial filesystem tests for unknown ownership, collisions, drift, idempotence, interruption and preserved user bytes. | No auto-discovery, broad path catalogue, or mutation authorization inferred from cwd. |
| **P-E — Observer and governed Promotion** | Only if selected: implement the approved producer/reference/evidence/privacy boundary, then Evaluation/Review/explicit Approval/Promotion as separate governed transitions. | P-B and DKT-06; approved authority/decision record. | Claim-specific privacy, identity, reference, evidence and promotion tests; independent review appropriate to risk. | No autonomous canonical mutation or Observer self-promotion. |

Packages P-B, P-C, P-D, and P-E are independent branches except for their stated dependencies. No package ordering implies automatic inclusion in one release.

## 11. Residual risks

- A future consumer could misread `usable`, a successful renderer, a manifest hash, schema validity, CI PASS, or a phase/release object as stronger evidence. Existing documents prohibit those equivalences, but consistency across future APIs remains unimplemented.
- Runtime data has no implemented identity, persistence, resolver, privacy collection engine, or retention policy. This is not evidence of missing or corrupt production records; there is no producer/store.
- Approval and Promotion have coherent conceptual boundaries but no general actor identity or machine-readable decision store. Do not automate protected transitions from status strings or review PASS.
- Current target research is scoped to Codex Local CLI 0.160.0. No inference extends to other Codex surfaces/versions, Claude, or Kilo.
- Source finding risk labels remain source-audit context and do not automatically become priority. No high risk was promoted to P0 without naming a concrete consumer and gate.

## 12. Deferrable decisions

- Rule trigger semantics and `requiredCanonicalDirectories` rename; both lack a current consumer requirement.
- Full SemVer compatibility, history lookup, long-reference ID alignment; decide only if a real consumer requires those semantics.
- A unified Observation complexity mapping; keep axes separate until aggregation/use case is chosen.
- Proposal physical location and retention details until a producer/store is approved.
- Resolver/provider registry, general runtime permission manager, Doctor, installer/uninstaller, and other adapter implementations until their claims and scopes are selected.
- READY is not deferred: its R1-G scope distinction is resolved and should not be reopened without contrary evidence.

## 13. Validation and exclusions

Fresh local validation on the report worktree:

- `npm run typecheck` — PASS.
- `npm run validate` — PASS; repository validation, 13 registered schemas with 13 valid/13 invalid fixtures, canonical integrity for 8 entities.
- `npm test` — PASS, 162/162 tests.
- `npm run verify:core` — PASS; freshly reran typecheck, validation, 162/162 tests, and `git diff --check`.
- Markdown local links — PASS in the fresh suite test `documentation links resolve`.
- Source-coverage arithmetic — PASS: 14 inventory + 5 A + 8 B + 8 C + 9 D + 10 E = 54; each ID listed once, treatment totals 39 + 6 + 3 + 4 + 2 = 54; 27 consolidated IDs are represented.

Commit SHA and its GitHub Actions result are recorded in the final closeout. Before commit, the staged diff is checked separately and must contain this new report only.

Acceptance exclusions: this report is the only authorized new path. No finding is approved; no technical change, schema/Kind/Policy/Directive/ADR/adapter/tool/test change, Agent/Skill/Eval/manifest/artifact, Observer/Installer/Doctor/Resolver implementation, `dist/`, roadmap/target-order modification, permission or credential change, tag, or release is made.

## 14. Verdict and independent-review readiness

**R2-F VERDICT: PASS — CONSOLIDATED DIAGNOSIS COMPLETE; DECISIONS NOT APPROVED.** The source ledger covers all 54 numbered findings with exactly one explicit treatment each; duplicates retain their source IDs; settled READY/Phase 3 evidence is distinguished from open decisions; P0 is scoped to future activation; P1/P2 dependencies are explicit; and no roadmap/implementation authority is inferred.

The report is ready for the requested **bounded independent review** of coverage, deduplication, prioritization, and dependency order. That reviewer must not implement recommendations. A favorable review should be followed by presenting the Decision Docket to the responsible person for explicit approval/rejection. No R3 or remediation may start from this PASS alone.
