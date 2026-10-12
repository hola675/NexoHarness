# R2-B — Observation & ImprovementProposal Lifecycle Diagnostic

- Date: 2026-10-12.
- Baseline: `9a4004f537ca4a16b1a0cd25910e9d3e420f142c` (`main` == `origin/main`, clean before this diagnostic).
- Authorization: R1 internal closure and diagnosis-only R2 authorization are recorded in [`r1-internal-closure-decision.md`](r1-internal-closure-decision.md). R2-B does not authorize remediation, runtime implementation, or roadmap changes.
- Prior phase: R2-A closed at the baseline above. This audit does not reopen R2-A findings.
- Scope: identity/information class, status and result semantics, references, provenance, lifecycle, approval/promotion, persistence/retention, privacy, and complexity vocabulary for Observation and ImprovementProposal.
- Evidence method: direct inspection of every required source; relevant schema history at `e953831` and `e706db3`; current validator and tests; graph search/trace for canonical validation structure. The graph is best-effort. It reported `metadata_changed` for inspected files, so material conclusions rely on direct source. Its only recorded test-scope parse gap is the unrelated malformed fixture `tests/fixtures/canonical-graph/invalid/capabilities/bad.yaml:1-2`.

## Classification key

These are audit descriptions, not product states:

- **IMPLEMENTED** — machine-validated schema or executable validation behavior exists.
- **DOCUMENTED** — an accepted current source states the meaning/boundary.
- **CONCEPTUAL** — a model describes a responsibility or lifecycle without a runtime implementation/schema.
- **DEFERRED** — a source explicitly postpones the decision or implementation.
- **UNKNOWN** — inspected evidence does not establish the meaning or behavior.

## Lifecycle matrix

| Dimension | Observation | ImprovementProposal | Source of evidence | Technical status |
|---|---|---|---|---|
| Identity | Registered schema Kind; runtime record would carry shared `metadata.id` and version. | Registered schema Kind; runtime proposal record would carry shared `metadata.id` and version. | `core/schemas/registry.json`; both Kind schemas; `docs/model/canonical-information.md:265-287` | Schema identity **IMPLEMENTED**; runtime identity allocation/uniqueness **UNKNOWN / DEFERRED**. |
| Information class | Schema is canonical technical contract; each Observation instance is RUNTIME evidence, never canonical behavior. | Schema is canonical technical contract; each ImprovementProposal instance is RUNTIME, not a new `PROPOSAL` class. | `docs/model/canonical-information.md:37-60,265-287`; `docs/source-of-truth.md:60-79` | Class boundary **DOCUMENTED**; runtime storage **DEFERRED**. |
| `metadata.status` | Requires shared `draft`, `experimental`, `stable`, or `deprecated`; no runtime-instance lifecycle meaning is established. | Same shared enum; it does not encode proposal decision, approval, or promotion. | `core/schemas/common.schema.json`; `docs/model/canonical-information.md:473-484`; history `e953831` → `e706db3` | Enum/required field **IMPLEMENTED**; runtime semantics **UNKNOWN / CLARIFICATION**. |
| Result / decision | `spec.resultStatus` allows `observed`, `validated`, `failed`, `blocked`; it is separate from metadata status and does not itself establish Assignment completion, Evaluation result, or Certification. Criteria/evidence for these values are not fully specified. | No proposal decision state. `requiresExplicitApproval: true` states an obligation, not an approval result. | Both schemas; `docs/concepts/task-observer.md:44-70`; `docs/model/work-lifecycle.md:120-126`; `docs/model/learning-evolution.md:91-115,129-137` | Accepted vocabulary/structural validation **IMPLEMENTED**; detailed result criteria and proposal decision record **UNKNOWN / DEFERRED**. |
| References | Optional `workflowRef`→Workflow, `execution.agentRefs`→Agent, `subject`→any supported Kind. | Required `observationRefs`→Observation, optional `target`→any supported Kind. | Schemas; `tools/validate/references.ts:24-41`; `docs/model/canonical-information.md:486-492` | Syntax and typed-rule declarations **IMPLEMENTED**; runtime resolution **DEFERRED**. `observationRefs` may be an empty array under the current schema. |
| Provenance | Optional shared `metadata.provenanceRefs`; `spec.evidence` is a list of strings, not a typed reference contract. Schema has task/cycle IDs but no required collector, timestamp, or source identity. | Optional shared `metadata.provenanceRefs`; required Observation references provide a conceptual evidence link, but schema-validity does not prove the references resolve. | `core/schemas/common.schema.json`; both Kind schemas; `docs/model/knowledge-experience.md:18-32` | Some fields **IMPLEMENTED**; complete provenance/identity semantics **CONCEPTUAL / UNKNOWN**. |
| Lifecycle | Conceptual signal → Observation → Experience Record → Pattern or direct finding → Knowledge Candidate/Knowledge; no Observer runtime or lifecycle state machine exists. | Part of a conceptual governed improvement path. Proposal, Candidate, Evaluation, Review, Approval, and Promotion remain distinct. | `docs/model/knowledge-experience.md:18-32,97-115`; `docs/model/learning-evolution.md:19-43,87-137`; `core/policies/self-improvement.md:17-58` | Lifecycle **DOCUMENTED / CONCEPTUAL**; runtime **DEFERRED**. |
| Persistence | No Observation store, event bus, runtime directory, or persistence implementation. | Physical proposal location is explicitly undecided; no proposal store or `proposals/` root exists. | `docs/model/knowledge-experience.md:5,169-219`; `docs/model/canonical-information.md:80,275-287,449-468`; `docs/shared-runtime.md:5-9,63-67` | **DEFERRED**. |
| Retention | Experience is preferentially append-oriented; corrections/contradictions/supersessions are additive, and historical facts must not be silently rewritten. Concrete retention is not set. | Rejected Candidate rationale and promoted proposal/evaluation/review/approval evidence are conceptually preserved. No proposal retention schedule or enforcement exists. | `docs/model/knowledge-experience.md:26-32,169-173`; `docs/model/learning-evolution.md:101-111,129-137`; `docs/model/canonical-information.md:391-395` | Preservation principle **DOCUMENTED**; retention period/deletion controls **DEFERRED**; enforcement **not implemented**. |
| Authority / Promotion | Observation is evidence only; it cannot grant authority or promote behavior. | Proposal is not approval or promotion. Promotion applies an approved Candidate/change to authoritative source; neither Proposal nor Candidate can self-promote. | `core/policies/self-improvement.md:19-58`; `docs/model/governance-authority.md:124-148,198-219`; `docs/model/learning-evolution.md:129-137` | Boundary **DOCUMENTED**; generic approval/promotion record service **DEFERRED**. |

## Findings

### R2B-01 — Observation `metadata.status` has no established runtime lifecycle meaning

- **Facts:** `common.schema.json` requires `metadata.status` for all registered schemas and accepts `draft`, `experimental`, `stable`, `deprecated`. `Observation` instances are RUNTIME. History confirms Observation originally reused shared metadata without `status` (`e953831`); `e706db3` added the shared `entityStatus` and required it for every Kind, alongside generic canonical-envelope lifecycle wording. No inspected runtime consumer assigns Observation-specific meaning to the value. Current valid/invalid Observation fixtures use `draft`.
- **Evidence:** `core/schemas/common.schema.json` (`entityStatus`, `metadata`); `core/schemas/observation.schema.json`; `docs/model/canonical-information.md:37-60,265-274,473-480`; `tests/fixtures/schemas/valid/observation.json`; `tests/fixtures/schemas/invalid/observation-invalid-result-status.json`; commits `e953831`, `e706db3`.
- **Inference:** `stable` could be misread as verified evidence, canonical truth, or promotion if the shared entity lifecycle vocabulary is read without the instance-class boundary. This is a plausible reader risk, not an observed consumer behavior.
- **Severity / risk / V1 impact:** Medium semantic ambiguity; no current Observer/runtime path is implemented, so no present V1 runtime effect was found.
- **Proposed disposition:** `REFINE` (proposal only); preserve the enum until an authorized decision establishes runtime semantics.
- **Descriptive candidate:** State explicitly what the existing field does and does not mean for runtime records, or decide that it has no runtime lifecycle semantics. Do not map `stable` to validation or approval.
- **Recommendation / pending decision:** Keep the current R1-K clarification open. Decide in a future authorized phase whether shared metadata status has a useful runtime meaning or should be separated from entity lifecycle.
- **Future phase:** R2 synthesis, then separately authorized remediation if warranted.

### R2B-02 — Observation `spec.resultStatus` is separate, but its operational criteria are incomplete

- **Facts:** The schema permits `observed`, `validated`, `failed`, `blocked`; the invalid fixture confirms `promoted` is rejected. The model identifies `validated` as an Observation result, not a canonical status. Observation does not change Assignment/task result. Evaluation results and scoped Certification are separately defined concepts. The schema does not attach an evidence class, validator identity, or transition rule to `resultStatus`.
- **Evidence:** `core/schemas/observation.schema.json`; `tests/fixtures/schemas/invalid/observation-invalid-result-status.json`; `docs/model/canonical-information.md:273,478-480`; `docs/model/work-lifecycle.md:120-126`; `docs/model/assurance-certification.md:29-39,83-124`.
- **Inference:** `validated` could be overread as an independent assurance claim absent a defined criterion and evidence relationship. The inspected sources do not establish that consumers currently do so.
- **Severity / risk / V1 impact:** Low to medium semantic ambiguity; no runtime consumer found.
- **Proposed disposition:** `REFINE` (proposal only), preserving distinct axes and existing enum.
- **Descriptive candidate:** Specify the object/result being described, required evidence or validation source, and explicit non-equivalence to task completion, Evaluation, and Certification.
- **Recommendation / pending decision:** Keep `metadata.status != spec.resultStatus`; determine whether the result enum needs operational criteria before a runtime writer/consumer is authorized.
- **Future phase:** R2 synthesis; future runtime contract design only after authorization.

### R2B-03 — ImprovementProposal `metadata.status` does not represent proposal decision state

- **Facts:** The proposal inherits the shared entity status enum. Its schema has no proposal-specific lifecycle/decision field; the fixture uses `draft`. Existing model says `stable` is not approval or promotion. The schema history shows the status was added to shared metadata for all Kinds, not designed as a proposal decision field.
- **Evidence:** `core/schemas/common.schema.json`; `core/schemas/improvement-proposal.schema.json`; `tests/fixtures/schemas/valid/improvement-proposal.json`; `docs/model/canonical-information.md:275-287,482-484`; `e953831`, `e706db3`.
- **Inference:** A reader could mistake `stable` for “approved” or “ready to promote.” No such runtime consumer or accepted mapping was found.
- **Severity / risk / V1 impact:** Medium semantic ambiguity; no proposal runtime/storage exists today.
- **Proposed disposition:** `REFINE` (proposal only).
- **Descriptive candidate:** Explicitly state that shared `metadata.status` is not proposal approval, rejection, or promotion; decide separately whether proposal-instance lifecycle needs representation.
- **Recommendation / pending decision:** Keep `stable != approved/promoted`; do not assign Candidate lifecycle labels to Proposal metadata without a decision.
- **Future phase:** R2 synthesis and authorized remediation, if needed.

### R2B-04 — Approval and promotion evidence have no proposal-specific runtime representation

- **Facts:** `requiresExplicitApproval` is a required constant `true`, so it expresses the need for approval but contains no evidence that approval happened. The schema has no approval/rejection/promoted state. `PROPOSED`, `EXPERIMENTAL`, `UNDER_ASSESSMENT`, `PROVISIONAL`, `APPROVED`, `REJECTED`, and `RETIRED` are documented as conceptual Candidate lifecycle vocabulary, not an ImprovementProposal enum. Evaluation is not Approval; Approval is not Promotion. Governance calls for important decisions to be traceable but selects no storage.
- **Evidence:** `core/schemas/improvement-proposal.schema.json`; `tests/fixtures/schemas/invalid/improvement-proposal-no-approval.json`; `docs/model/learning-evolution.md:91-111,113-137`; `docs/model/governance-authority.md:124-148,198-219`; `docs/model/canonical-information.md:283-287,391-395`.
- **Inference:** A future system that needs to prove `proposed → evaluated → reviewed → approved/rejected → promoted` will need a governed record/relationship outside the current boolean alone. The current product has no generic proposal decision ledger or approval actor/service.
- **Severity / risk / V1 impact:** Medium future governance traceability risk; no implemented proposal lifecycle is making an unsupported claim today.
- **Proposed disposition:** `REFINE` (proposal only).
- **Alternatives for later consideration:** A separate traceable decision record/relationship, or another governed mechanism with explicit owner/scope/provenance. This audit chooses neither schema nor storage.
- **Recommendation / pending decision:** Keep approval requirement, decision, and promotion distinct. Decide the owner and evidence location before implementing a proposal workflow. Preserve rejected evidence; do not treat rejection as deletion.
- **Future phase:** R2-C Governance, Contracts & Approval Semantics; implementation requires later explicit authorization.

### R2B-05 — Runtime references have syntactic/type rules, but no runtime resolution; evidence list may be empty

- **Facts:** `entityRef` syntax is `Kind:id[@major.minor.patch]`, with supported Kind, kebab-case ID, optional semantic version. Declared type rules are: Observation `workflowRef`→Workflow, `execution.agentRefs[]`→Agent, `subject`→ANY; ImprovementProposal `observationRefs[]`→Observation, `target`→ANY. Schema validation checks shape/syntax. `canonical-integrity` resolves only records discovered in the 11 canonical roots; neither Kind has a root. No current runtime reference resolver exists. The shared `refList` schema requires an array but has no `minItems`; therefore `observationRefs: []` is schema-valid even though the conceptual model says each proposal points to supporting evidence. `customDocumentIssues` adds no check for this field.
- **Evidence:** `core/schemas/common.schema.json` (`entityRef`, `refList`); both Kind schemas; `tools/validate/references.ts:24-55`; `tools/validate/canonical-discovery.ts:15-26,86-110`; `tools/validate/canonical-integrity.ts:99-118,132-199`; `tools/validate/schemas.ts:156-171,173-183`; `docs/model/canonical-information.md:435-468,486-492`; `docs/model/learning-evolution.md:91-97`; `tests/integrity.test.ts:55-69`; valid fixtures for both Kinds.
- **Inference:** For a future runtime proposal store, syntactic validity alone would not ensure its Observation records exist, are visible in the relevant scope, or match a requested version. The empty-list allowance is a schema/organizational-contract gap, not evidence of a current orphan proposal: no runtime proposal producer/store exists.
- **Severity / risk / V1 impact:** Medium future integrity risk; no current V1 runtime resolution path. Current canonical integrity continues to resolve canonical references only.
- **Proposed disposition:** `REFINE` (proposal only; overlaps the existing R2 inventory runtime-reference finding rather than creating a second inventory item).
- **Descriptive minimum for a future contract:** Check Kind/type, syntax, identity, existence in the correct information-class/scope, and requested version; return distinguishable missing, mismatched, stale, or inaccessible outcomes. Decide separately whether the proposal evidence list must be non-empty and where that invariant is enforced. This is not an implementation design or approval to add it.
- **Recommendation / pending decision:** Preserve `SCHEMA-VALID REFERENCE != RESOLVED REFERENCE`. Do not call canonical-index validation a runtime resolver.
- **Future phase:** R2-C or later runtime-boundary diagnosis; any validator/storage requires explicit authorization.

### R2B-06 — Preservation is a principle; persistence and retention are not designed

- **Facts:** Experience is preferentially append-oriented; later corrections, contradictions, supersessions, and invalidations should not silently rewrite historical facts. Rejected Candidate evidence/reason and post-promotion Proposal/Evaluation/Review/approval evidence are conceptually preserved. The model explicitly says raw evidence needs scope, provenance, privacy handling, and retention expectations once implemented, but selects no concrete retention policy. No persistence store, runtime directory, Observer implementation, or Proposal store exists; `observer/` contains only `.gitkeep`.
- **Evidence:** `docs/model/knowledge-experience.md:26-32,169-219`; `docs/model/learning-evolution.md:101-111,129-137`; `docs/model/canonical-information.md:80,275-287,391-395,449-468`; `docs/shared-runtime.md:5-9,63-67`; `core/policies/self-improvement.md:57-58`; `git ls-files observer`.
- **Inference:** Without a future retention/ownership policy, append-oriented guidance alone cannot determine duration, deletion rights, correction linkage, deduplication, or storage location. Schema `id` and optional cycle/task strings do not define runtime uniqueness or duplicate handling.
- **Severity / risk / V1 impact:** Low for current V1 because storage/collector are absent; material design prerequisite before persistence.
- **Proposed disposition:** `KEEP` the current no-storage boundary and historical-preservation principle (proposal only).
- **Descriptive candidate:** None now. A later persistence design would need owner, scope, retention, deletion/correction behavior, privacy, and deduplication decisions.
- **Recommendation / pending decision:** Do not infer retention from schema status or ID. Preserve history conceptually; leave storage and concrete retention deferred.
- **Future phase:** Later runtime/persistence design after separate authorization.

### R2B-07 — Observation complexity vocabulary remains a clarification, with no approved mapping

- **Facts:** Observation schema allows `BOUNDED | COMPLEX`; the organizational work lifecycle classifies work using `TRIVIAL | BOUNDED | COMPLEX` during Classify, before execution. The model explicitly keeps these separate and unresolved. Source search found no executable consumer mapping these vocabularies; uses are schema/documentation/tests, not transformation code.
- **Evidence:** `core/schemas/observation.schema.json`; `core/directives/execution-protocol.md:27,68-74`; `docs/model/work-lifecycle.md:84-92`; `docs/model/learning-evolution.md:154-158`; `docs/model/knowledge-experience.md:217-221`; `docs/model/assurance-certification.md:186-188`; R1 audit R1-D/E referenced by the current model.
- **Inference:** Timing/context suggests the organizational classification may be a pre-execution decision and Observation complexity may be recorded with runtime evidence, but the sources do not approve that as a distinct-axis mapping. The shared `BOUNDED` and `COMPLEX` labels do not prove equivalence.
- **Severity / risk / V1 impact:** Low; no consumer depending on an equivalence was found.
- **Proposed disposition:** `REFINE` / `CLARIFICATION` (proposal only); do not add `TRIVIAL` or an automatic mapping.
- **Descriptive candidate:** State whether the fields are the same measurement at different lifecycle points or distinct measurements; retain no mapping until decided.
- **Recommendation / pending decision:** Keep the existing R1-D/E clarification open.
- **Future phase:** R2 synthesis; schema change only after explicit approval.

### R2B-08 — Privacy boolean is a schema field, not collection authorization

- **Facts:** Schema requires `privacy.sourceContentStored` as a boolean, so `true` is structurally valid. The Task Observer technical contract sets `false` as the expected default and permits `true` only under a later, separately approved collection policy; it excludes automatic capture of conversations, source dumps, arbitrary payloads, and credentials. No approved Policy authorizing source-content collection was found. The current Self-Improvement and Evidence Policies have `metadata.status: draft`; the Task Observer contract requires a later, separately approved collection policy before `true` is allowed. No Observer runtime exists. Other telemetry fields are optional; Observer documentation says unavailable telemetry remains absent, never a fabricated zero or `false`.
- **Evidence:** `core/schemas/observation.schema.json`; `docs/concepts/task-observer.md:13-42`; `docs/model/learning-evolution.md:150-169`; `core/policies/self-improvement.md`; `core/policies/evidence.md`; `docs/continuous-improvement.md:46-57`; `docs/model/canonical-information.md:80,468`.
- **Inference:** A consumer treating schema acceptance of `true` as permission to collect content would exceed the documented contract. No such consumer was found.
- **Severity / risk / V1 impact:** High privacy risk if a future writer misreads schema validity as authorization; no current collection implementation or demonstrated V1 exposure.
- **Proposed disposition:** `KEEP` the restrictive contract (proposal only); do not grant authority or collection permission from this field.
- **Descriptive candidate:** Any future separately approved collection policy should define scope, authorization, content classes, retention, and handling; no policy is drafted here.
- **Recommendation / pending decision:** Treat `true` as data describing collection that was separately authorized, not authorization itself. Preserve missing telemetry as absent/unknown.
- **Future phase:** R2-C for Governance/approval semantics; collection behavior only after explicit policy and implementation authorization.

## Cross-cutting lifecycle distinctions

```text
Observation resultStatus != Observation metadata.status
Observation result       != Assignment completion
Observation result       != Evaluation result
Observation result       != Certification
ImprovementProposal      != Candidate
Candidate lifecycle      != Proposal lifecycle
Approval decision        != Promotion event
Canonical schema        != canonical instance
SCHEMA-VALID REFERENCE   != RESOLVED REFERENCE
```

`metadata.status` was introduced through the shared envelope for all Kinds; it cannot be treated as a new proposal/observation decision state. `APPROVED` and `REJECTED` in the model are Candidate vocabulary, not schema-backed ImprovementProposal lifecycle. `promoted` is explicitly not an Observation `resultStatus` value.

## Confirmed facts versus inferences

**Confirmed facts:** the two Kinds are in the 13-Kind registry and schema validator but absent from the 11 canonical authoring roots; schemas are canonical technical contracts while their instances are RUNTIME; schema field values and reference patterns/rules described above; the shared status history; no runtime discovery/resolution; `requiresExplicitApproval` is constant true; the conceptual separation of Evidence, Experience, Proposal, Candidate, Evaluation, Review, Approval, and Promotion; privacy and absent-telemetry boundaries; no persistence/retention implementation; no approved complexity mapping.

**Inferences:** risk/severity ratings; possible reader confusion from `stable`; possible future stale/inaccessible reference cases; complexity may represent separate lifecycle measurements; the empty `observationRefs` allowance could permit an orphan-shaped proposal in a future runtime pipeline. These are risks or consequences derived from current definitions, not observed runtime behavior.

## Proposed dispositions summary

| Finding | Proposal | Approval status |
|---|---|---|
| R2B-01 Observation metadata status | `REFINE` | Diagnostic proposal only |
| R2B-02 Observation result status | `REFINE` | Diagnostic proposal only |
| R2B-03 ImprovementProposal metadata status | `REFINE` | Diagnostic proposal only |
| R2B-04 Approval/decision/promotion representation | `REFINE` | Diagnostic proposal only |
| R2B-05 Runtime references and non-empty evidence rule | `REFINE` | Diagnostic proposal only; overlaps R2 inventory item 11 |
| R2B-06 Persistence/retention | `KEEP` current boundary | Diagnostic proposal only; overlaps R2 inventory item 12 |
| R2B-07 Complexity vocabulary | `REFINE / CLARIFICATION` | Diagnostic proposal only; overlaps R2 inventory item 1 |
| R2B-08 Privacy and absent telemetry | `KEEP` current restrictive boundary | Diagnostic proposal only |

## Verdict and deferred decisions

**R2-B: PASS — diagnostic audit complete; no material normative contradiction requiring an immediate technical-source change was found.** The empty `observationRefs` allowance is a documented future contract/enforcement gap, not a current runtime violation: there is no runtime proposal writer, store, or validator, and the model already defers runtime reference validation. It must be resolved before a future runtime proposal producer relies on “no orphan proposals.”

- Existing R1-K and R2 inventory findings are carried forward and expanded; they are not represented as newly approved defects or remediations.
- The meaning of both runtime `metadata.status` fields, detailed result/decision criteria, proposal decision evidence ownership, runtime reference semantics, persistence/retention, and complexity relationship remain undecided or deferred.
- No `PROPOSAL` information class, new enum, lifecycle machine, schema, storage, Observer, or runtime reference validator is created.
- R1 remains an internal closure only. Target priority and roadmap remain unchanged. R3 and implementation remain unauthorized.
- R2-C — Governance, Contracts & Approval Semantics — is the next proposed diagnosis; it requires no new authorization within diagnosis-only R2, but remediation still requires explicit authorization.

## Sources inspected

All mandatory source groups were inspected directly: technical schemas/registry and validator source; applicable Policies; Task Observer concept; Canonical Information, Knowledge & Experience, Learning & Evolution, Governance & Authority, Assurance & Certification, and Work Lifecycle models; Continuous Improvement, Shared Runtime, Source of Truth; the R1 authority audit and reconciliation report; the existing R2 diagnostic inventory; schema fixtures and integrity tests; current Observer directory contents; and relevant schema history (`e953831`, `e706db3`).

No files outside this new diagnostic under `docs/reviews/` were modified.