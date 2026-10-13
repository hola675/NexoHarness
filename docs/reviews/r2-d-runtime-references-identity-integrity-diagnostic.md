# R2-D — Runtime References, Identity & Integrity Diagnostic

## Scope and baseline

- **Baseline:** `b7f1e619a6ac457175c4e5351419278a9e05acf2`; `main`, synchronized with `origin/main`, clean tree before work.
- **Authorization:** R2 diagnosis and documentation only. R1 is internally closed without a tag; R2-A through R2-C are completed. No R3, schema or validator edits, new Kinds, runtime work, roadmap or target-priority changes are authorized.
- **Sources inspected:** the ten schemas named in this audit plus `policy.schema.json`, `skill.schema.json`, and `enforcement.schema.json` to check every reference-field/schema correspondence; `references.ts`, `canonical-discovery.ts`, `canonical-integrity.ts`, `schemas.ts` and `repository.ts`; `tests/integrity.test.ts` and both fixture trees; the named source-of-truth, canonical-format, schema-system, validation, canonical-information, knowledge-experience, learning-evolution and assurance documents; the four named concepts; ADR 0001; and prior R1/R2-A/B/C diagnostic records. Implementation claims below come from direct code and fixture inspection, not from conceptual prose alone.
- **Index caveat:** MCP coverage reported `metadata_changed` for inspected paths. Direct source inspection was used as required; graph results are not relied on for completeness.

## Identity and reference contract

The canonical envelope has `apiVersion`, `kind`, `metadata`, and `spec`. The schema registry and validator require exactly 13 registered kinds. Each kind schema fixes its `kind`; common schema fixes `apiVersion` to `nexoharness.dev/v1alpha1`. `metadata.id` is lowercase kebab-case with maximum length 80. `metadata.version` is a required numeric dotted triplet matching `^[0-9]+\\.[0-9]+\\.[0-9]+$`. That is lexical shape validation: it does not implement full SemVer rules, precedence, compatibility, ranges, aliases, or migration behavior. In particular leading zeros are accepted by the expression.

Reference syntax is `Kind:id` with optional exact `@version`. The schema pattern names the registered Kinds and matches the ID shape, but does not set the metadata ID's 80-character maximum on the reference string. `parseEntityReference()` independently checks registered Kind, kebab-case ID and numeric dotted-triplet version, but likewise does not impose the 80-character bound. Both schema and parser therefore accept a longer syntactic reference ID than a canonical entity may define; resolution will fail unless a matching index key exists. Empty IDs, malformed IDs, unknown kinds, and malformed/empty version suffixes fail parsing/schema validation.

The CanonicalIndex key is exactly `Kind:id`; the version is stored on the record, not in the key. One logical key is allowed regardless of metadata version. Duplicate keys emit `DUPLICATE_IDENTITY`; the later file in deterministic lexical path order is omitted from `byKey`. Different Kinds may share the same text ID. An unversioned reference resolves by this unique logical key. A versioned reference resolves to that same record only when its `metadata.version` exactly equals the requested triplet. There is no automatic historical-version selection or SemVer compatibility behavior.

## CanonicalIndex pipeline (observed implementation)

| Stage | Input and responsibility | Output / checks actually run | Failure behavior and limit |
| --- | --- | --- | --- |
| Canonical Roots | Fixed `CANONICAL_ROOTS` array: 11 roots, each with required Kind and Markdown/YAML format. | Roots are inspected for directory/symlink status. | Missing/non-directory roots and symlinks produce discovery diagnostics; not every repository directory is a canonical root. |
| Discovery | Recursively walk each root in deterministic order. | Regular files of expected extensions are discovered; `.gitkeep` is ignored. | Nested symlinks, non-regular entries, unsupported extensions and unreadable roots are diagnosed. Runtime `observer/` is not traversed. |
| Parsing | Read each discovered file; Markdown uses frontmatter parser, YAML must be exactly one valid object document. | Parsed envelope and, for Markdown, normalized body. | Parse/read errors yield `MALFORMED_MANIFEST`; no record is made. |
| Schema validation | Validate each parsed entity against its registered schema; scan for prohibited harness/provider coupling. | Schema-valid document and custom Workflow checks (unique step IDs and declared entry step). | Schema-invalid entities are not indexed; relevant malformed declared references may also be reported. Schema validates shape, not runtime availability or authority. |
| Placement | Compare document `kind` with the root’s expected Kind. | Correctly placed canonical entity candidate. | Mismatch emits `PLACEMENT_MISMATCH`; mismatched entity is not indexed. |
| Entity index | Schema-valid, correctly placed records with required metadata. | `records`, plus `byKey: Map<Kind:id, record>` containing `kind`, `id`, `version`, `status`, file, format and document. | Duplicate logical key emits `DUPLICATE_IDENTITY` and is omitted from the map after the first deterministic record. Filename is provenance/location only, not identity. |
| Reference collection | Declared reference fields selected by source Kind in `REFERENCE_FIELD_RULES`. | Each present field value is parsed; malformed declared values produce issues. Arbitrary prose and `metadata.provenanceRefs` are not collected. | Missing/empty arrays yield no per-item reference; structural requirements remain the schema’s responsibility. |
| Reference resolution | Collected parsed references from indexed records, looked up in `byKey`. | Missing `Kind:id` emits `UNRESOLVED_REFERENCE`; supplied version unequal to target metadata emits `VERSION_MISMATCH`. | Lookup is only against the canonical index; it does not query runtime stores or permissions. |
| Typed relationship check | Declared references whose rule has a finite allowed-target-Kind list. | Wrong parsed Kind emits `REFERENCE_KIND_MISMATCH`; `ANY` skips this additional check. | It is separate from target lookup and can coexist with `UNRESOLVED_REFERENCE` for a wrong-Kind target that is absent. Diagnostics are sorted deterministically. |

Current repository validation reports 13 registered Kinds, 11 canonical authoring roots, and 8 indexed entities (2 Directives and 6 Policies). Observation and ImprovementProposal have registered schemas but no authoring roots; they do not enter the index. The 8 count is current tree state, not a permanent invariant.

## Complete typed-reference rule inventory

All listed fields are declared in `REFERENCE_FIELD_RULES`. Schema shape checks apply where the source schema contains the corresponding `entityRef`/`refList` field. `TYPE CHECKED` means the validator applies the finite `allowedTargetKinds` rule to an indexed source record. `RESOLVED` means the implementation attempts the `Kind:id` lookup in the canonical index. The table distinguishes that code path from a live runtime instance; it does not claim runtime execution for Observation or Proposal.

| Source Kind | Field | Target rule | Syntax / schema | Type check | Resolution in current validator |
| --- | --- | --- | --- | --- | --- |
| Policy | `spec.relatedRules[]` | Rule | DECLARED; SCHEMA VALIDATED | TYPE CHECKED for indexed Policy | RESOLVED against CanonicalIndex |
| Agent | `spec.capabilities[]` | Capability | DECLARED; SCHEMA VALIDATED | TYPE CHECKED for indexed Agent | RESOLVED against CanonicalIndex |
| Skill | `spec.relatedAgents[]` | Agent | DECLARED; SCHEMA VALIDATED | TYPE CHECKED for indexed Skill | RESOLVED against CanonicalIndex |
| Rule | `spec.enforcement[]` | Enforcement | DECLARED; SCHEMA VALIDATED | TYPE CHECKED for indexed Rule | RESOLVED against CanonicalIndex |
| Rule | `spec.evals[]` | Evaluation | DECLARED; SCHEMA VALIDATED | TYPE CHECKED for indexed Rule | RESOLVED against CanonicalIndex |
| Workflow | `spec.steps[].agent` | Agent | DECLARED; SCHEMA VALIDATED | TYPE CHECKED for indexed Workflow | RESOLVED against CanonicalIndex |
| Profile | `spec.capabilities[]` | Capability | DECLARED; SCHEMA VALIDATED | TYPE CHECKED for indexed Profile | RESOLVED against CanonicalIndex |
| Enforcement | `spec.ruleRefs[]` | Rule | DECLARED; SCHEMA VALIDATED | TYPE CHECKED for indexed Enforcement | RESOLVED against CanonicalIndex |
| Evaluation | `spec.target` | ANY | DECLARED; SCHEMA VALIDATED | No additional target-Kind check | RESOLVED against CanonicalIndex |
| Observation | `spec.workflowRef` | Workflow | DECLARED; SCHEMA VALIDATED in fixture validation | NOT EXECUTED on a runtime source record | NOT EXECUTED for runtime instances |
| Observation | `spec.execution.agentRefs[]` | Agent | DECLARED; SCHEMA VALIDATED in fixture validation | NOT EXECUTED on a runtime source record | NOT EXECUTED for runtime instances |
| Observation | `spec.subject` | ANY | DECLARED; SCHEMA VALIDATED in fixture validation | No additional type check; runtime source not indexed | NOT EXECUTED for runtime instances |
| ImprovementProposal | `spec.observationRefs[]` | Observation | DECLARED; SCHEMA VALIDATED in fixture validation | NOT EXECUTED on a runtime source record | NOT EXECUTED for runtime instances |
| ImprovementProposal | `spec.target` | ANY | DECLARED; SCHEMA VALIDATED in fixture validation | No additional type check; runtime source not indexed | NOT EXECUTED for runtime instances |

For the canonical rows, resolution is actually invoked for valid declared references on indexed records. For the two runtime-only source Kinds, the rules exist and schemas/fixtures check syntax, but no discovered production source record reaches `resolveReferences()`. A parsed canonical reference may resolve to an indexed target without a finite target-Kind rule when `ANY` is configured; that does not make it an authorization or runtime reference resolver.

## `ANY` semantics and integrity dimensions

`ANY` means **no additional target-Kind restriction in that field rule**. It does not bypass `parseEntityReference()`'s supported-Kind check and does not bypass `resolveReferences()`'s lookup. In current canonical validation the target must therefore be one of the uniquely indexed canonical records. A reference to a syntactically registered runtime Kind such as `Observation:id` can pass its shape check but has no target in the CanonicalIndex and is diagnosed unresolved. `ANY` does not search arbitrary entities, runtime artifacts, or other information stores.

| Dimension | Canonical current behavior | Runtime current behavior | Evidence / source | Known gap | Future decision |
| --- | --- | --- | --- | --- | --- |
| IDENTITY | Unique key `Kind:id`; filename is not identity. | Observation/Proposal reuse envelope ID syntax; other runtime identities are conceptual or unknown. | [canonical-integrity.ts](../../tools/validate/canonical-integrity.ts#L146-L200); [integrity.test.ts](../../tests/integrity.test.ts#L110-L114); [canonical-information.md](../model/canonical-information.md#L308-L312) | No universal runtime identity/namespace. | Define per-artifact scope only when runtime requires it. |
| SYNTAX | Schema/parse enforce registered Kind, kebab ID shape and optional numeric triplet version. | Observation/Proposal fixtures validate envelope/reference shape, not storage or lookup. | [common.schema.json](../../core/schemas/common.schema.json#L1-L29); [references.ts](../../tools/validate/references.ts#L1-L61) | Reference ID maximum differs from metadata ID; numeric triplet is not full SemVer. | Decide whether to align syntax and what version semantics, if any, are needed. |
| REGISTERED KIND | Registry and `SUPPORTED_KINDS` agree on 13; registry loading rejects mismatch. | Observation and ImprovementProposal are registered shapes, not runtime services. | [registry.json](../../core/schemas/registry.json#L1-L20); [schemas.ts](../../tools/validate/schemas.ts#L11-L91); [canonical-information.md](../model/canonical-information.md#L201-L232) | Registration is easy to mistake for authoring/storage support. | Preserve separate registry/root counts. |
| TARGET KIND | Finite field rules are checked for indexed sources; `ANY` adds no extra Kind condition. | Runtime source-target Kind rules are declared but not run on runtime records. | [references.ts](../../tools/validate/references.ts#L24-L41); [canonical-integrity.ts](../../tools/validate/canonical-integrity.ts#L77-L120) | No runtime cross-class relationship validator. | Define field-specific rules before implementing runtime resolution. |
| TARGET EXISTENCE | Every collected reference is looked up by `Kind:id` in CanonicalIndex. | No runtime target store/query; fixture syntax does not prove existence. | [canonical-integrity.ts](../../tools/validate/canonical-integrity.ts#L100-L120); [canonical-information.md](../model/canonical-information.md#L486-L492) | Runtime references cannot currently be resolved. | Choose an owned source of runtime identities before a resolver. |
| VERSION CONSISTENCY | If `@version` is present it must equal the single indexed target’s metadata version. | No instance version resolution policy; runtime metadata version semantics are not established. | [references.ts](../../tools/validate/references.ts#L3-L5); [canonical-integrity.ts](../../tools/validate/canonical-integrity.ts#L100-L120) | No history, range, alias or compatibility resolution. | Decide if exact pinning suffices; do not infer SemVer compatibility. |
| INFORMATION CLASS | Index contains only valid entities in canonical roots with matching Kind. | Observation/Proposal are RUNTIME; Contract Instance is RUNTIME; Evaluation Run is VALIDATION. | [canonical-discovery.ts](../../tools/validate/canonical-discovery.ts#L12-L34); [canonical-information.md](../model/canonical-information.md#L208-L255) | A valid schema shape alone does not identify instance class. | Keep classification attached to architecture and lifecycle, not schema reuse. |
| REFERENCE SCOPE | Lookup scope is this repository’s discovered canonical index. | Project/task/execution/global scope of runtime identities is UNKNOWN. | [canonical-integrity.ts](../../tools/validate/canonical-integrity.ts#L146-L200); [canonical-information.md](../model/canonical-information.md#L308-L312) | No namespace or tenant/project/runtime partition. | Decide scope, collision and retention boundaries before runtime persistence. |
| PROVENANCE | `metadata.provenanceRefs` is optional unique non-empty strings; not a declared typed-reference field and not destination-resolved. | Provenance preservation is conceptual; no runtime provenance graph resolver. | [common.schema.json](../../core/schemas/common.schema.json#L38-L62); [references.ts](../../tools/validate/references.ts#L24-L41); [integrity.test.ts](../../tests/integrity.test.ts#L116-L123) | Provenance strings may not resolve or name an entity. | Decide whether provenance remains documentary or needs a separate typed relation. |
| RUNTIME AVAILABILITY | Canonical target is available only if discovered, parseable, schema-valid and placed correctly. | Persistence, lookup, freshness and availability for all listed runtime concepts are UNKNOWN/not implemented. | [canonical-information.md](../model/canonical-information.md#L78-L83), [#L232-L255](../model/canonical-information.md#L232-L255) | No runtime artifact store or reference resolver. | Do not claim runtime existence/resolution until a real store and evidence exist. |
| AUTHORITY BOUNDARY | Validation establishes structural/integrity results only; no permission is granted. | Reference existence/access does not authorize use or promote runtime information. | [validation.md](../validation.md#L101-L103); [canonical-information.md](../model/canonical-information.md#L76-L76), [#L326-L330](../model/canonical-information.md#L326-L330) | No runtime access-control mechanism audited here. | Keep authorization separate from reference integrity. |

## Runtime identity inventory

`UNKNOWN` means the inspected evidence does not establish the property. Schema-required `metadata.id`/`metadata.version` is not evidence of a generator, uniqueness domain, persistence, or history policy.

| Artifact | Schema / representation | Real instance or generator | Uniqueness, scope, namespace, resolution, persistence and retention |
| --- | --- | --- | --- |
| Observation | Registered schema; canonical envelope and required `metadata.id`, `metadata.version`, `metadata.status`; runtime information class. | Valid/invalid fixtures exist; no production Observation instance or runtime generator was identified. | ID syntax is validated; runtime uniqueness, scope, namespace, resolver, persistence, version history and retention are UNKNOWN/not implemented. |
| ImprovementProposal | Registered schema; same shared metadata envelope; runtime governed artifact. | Fixtures exist; no production Proposal producer/store was identified. | ID syntax is validated; runtime uniqueness, scope, namespace, resolver, persistence, version history and retention are UNKNOWN/not implemented. |
| Contract Instance | Conceptual runtime handoff; no separate Kind/schema. | No production instance/generator identified. | All listed identity and lifecycle/storage properties UNKNOWN/not implemented. |
| Assignment | Conceptual runtime/control-plane work representation; no schema in registry. | No production Assignment instance/generator identified. | All listed identity and lifecycle/storage properties UNKNOWN/not implemented. |
| Evaluation Run | Validation evidence from an Evaluation Definition; no separate Kind/schema. | Tests/evaluation evidence may exist, but no general Nexo Evaluation Run identity model/generator was identified. | Run ID, scope, namespace, resolver, persistence, version history and retention UNKNOWN/not established. |

## Reference flow boundaries

| Direction | Semantic/documented status | Current syntax | Current validator/resolution | Authority / missing behavior |
| --- | --- | --- | --- | --- |
| CANONICAL → CANONICAL | Supported for declared relationships. | `entityRef`/`refList` represent Kind:id[@version]. | Schema, source-Kind rule, target existence and optional exact version are checked for indexed records. | Reference does not grant permission. Current relationship table is finite; arbitrary prose is excluded. |
| CANONICAL → RUNTIME | Conceptually representable where schemas/rules name Observation/Proposal, but not an indexed target. | `entityRef` and `ANY` can express registered runtime Kinds; finite fields may forbid them. | No runtime store; current canonical lookup emits unresolved when target not in index. | No guarantee of runtime existence, access, scope or freshness. |
| RUNTIME → CANONICAL | Observation/Proposal schemas declare fields that can point at Workflow/Agent/Observation/etc.; model permits links to canonical definitions. | Relevant fields schema-validate syntax, including in fixtures. | Runtime sources are not discovered, so no runtime-source resolution/type pass. | No guarantee of target’s currentness, accessibility or authorization from fixture success. |
| RUNTIME → RUNTIME | Observation subject / Proposal observationRefs can express registered runtime Kinds at schema level; actual acceptance depends on each field pattern/rule. | Structural syntax may pass. `observationRefs: []` also remains schema-valid. | No runtime-to-runtime resolver/store. | Do not infer instances exist or are resolvable. Preserve R2B-05/R2C-08 without adding `minItems`. |

## Referential integrity versus provenance and evidence

- **Typed entity reference:** string matching `Kind:id[@version]`; a field in `REFERENCE_FIELD_RULES` opts it into collection. Canonical resolution then checks `Kind:id` and, when supplied, exact version.
- **`metadata.provenanceRefs`:** optional array of unique non-empty strings. It is not defined as `entityRef`, absent from `REFERENCE_FIELD_RULES`, and has no destination resolution. Tests explicitly confirm collection ignores it. Its current validation is form-only.
- **`Observation.spec.evidence`:** string-list values, not typed entity references; schema checks non-empty strings/uniqueness for members, not target existence.
- **`ImprovementProposal.spec.observationRefs`:** typed `refList`, but permits an empty array; each present item has an Observation Kind syntax. The canonical validator does not run this source rule on runtime Proposal instances.
- **`spec.target`:** typed syntactically as `entityRef`; where its rule is `ANY`, no extra target-Kind filter applies. A canonical source still needs its target in CanonicalIndex to resolve.
- **Entity identity versus execution identity:** `Kind:id` and optional canonical metadata version identify canonical logical entities; task/cycle/run/session IDs are distinct correlation concepts whose universal format and scope remain undecided.

## Findings

### R2D-01 — Logical identity and version syntax

- **SOURCE:** [common.schema.json](../../core/schemas/common.schema.json#L1-L29); [references.ts](../../tools/validate/references.ts#L1-L61); [ADR 0001](../decisions/0001-canonical-manifest-model.md#L6-L25).
- **CONFIRMED FACT:** identity fields and reference syntax are as described above; `apiVersion` is a fixed dialect constant, `kind` is schema-specific, metadata version is entity data. Canonical logical identity is `Kind:id`; optional version must exactly match target metadata.
- **INFERENCE:** readers may overread “semantic version syntax” as full SemVer compatibility; the actual regex only checks numeric triplet shape. Reference ID maximum is also not aligned with metadata ID maximum.
- **CURRENT IMPLEMENTATION:** schema and parser shape checks only; no version ordering/range/compatibility resolver.
- **RISK:** low/medium; future references may be accepted syntactically yet have no schema-definable target, and version semantics may be overclaimed.
- **V1 IMPACT:** current canonical references with valid existing IDs and exact version are supportable; no historical selection/compatibility claim is justified.
- **PROPOSED DISPOSITION:** `REFINE` documentation/contracts only if actual version-range or compatibility needs arise; no change now.
- **MINIMAL FUTURE CANDIDATE:** align reference ID constraints with canonical ID constraints and explicitly choose exact-pin semantics if needed.
- **DEPENDENCIES:** a concrete need for longer IDs, version history, or compatibility behavior.
- **DECISION REQUIRED:** whether numeric triplet is intentionally a narrow local format or full SemVer is intended; whether references should have max length 80.

### R2D-02 — CanonicalIndex and version coexistence

- **SOURCE:** [canonical-integrity.ts](../../tools/validate/canonical-integrity.ts#L146-L200); [canonical-discovery.ts](../../tools/validate/canonical-discovery.ts#L12-L105); [validation.md](../validation.md#L44-L74); [integrity.test.ts](../../tests/integrity.test.ts#L61-L114), invalid agent fixtures.
- **CONFIRMED FACT:** map key omits version; same Kind/id cannot coexist even across versions; duplicate emits `DUPLICATE_IDENTITY`, second deterministic record is omitted; same ID across different Kinds is allowed; filename is not identity. Schema-invalid or wrong-root entities cannot satisfy references.
- **INFERENCE:** index represents one current canonical definition per logical key, not historical versions.
- **CURRENT IMPLEMENTATION:** this is enforced and tested with duplicate logical records and cross-Kind same-text IDs.
- **RISK:** low for current single-version authoring; historical snapshots cannot be resolved by this index.
- **V1 IMPACT:** unversioned means the unique current indexed record; versioned means exact pin to that record.
- **PROPOSED DISPOSITION:** `KEEP` single-key index behavior.
- **MINIMAL FUTURE CANDIDATE:** separate version-history source only if a supported use case requires historical resolution; not necessarily expansion of CanonicalIndex.
- **DEPENDENCIES:** storage/history policy, migration and compatibility decisions.
- **DECISION REQUIRED:** whether V1 needs historical entity resolution. No such requirement is established here.

### R2D-03 — Typed declarations versus executed resolution

- **SOURCE:** [references.ts](../../tools/validate/references.ts#L24-L102); [canonical-integrity.ts](../../tools/validate/canonical-integrity.ts#L77-L120), [#L146-L200](../../tools/validate/canonical-integrity.ts#L146-L200); [integrity.test.ts](../../tests/integrity.test.ts#L87-L108); [validation.md](../validation.md#L61-L74).
- **CONFIRMED FACT:** all 14 field rules are enumerated above. On canonical indexed records the validator collects declared fields, parses syntax, resolves target identity/version and independently checks finite target Kinds. It does not inspect arbitrary prose. Runtime-only source rules are not executed against runtime records.
- **INFERENCE:** documentation’s short description of `REFERENCE_KIND_MISMATCH` as requiring an existing target is narrower than code: type mismatch is checked independently and may accompany unresolved when wrong-Kind key is absent. No runtime validator guarantee is established by the rule table alone.
- **CURRENT IMPLEMENTATION:** canonical-only source traversal; tests exercise several diagnostics; runtime-reference execution has no implementation/test.
- **RISK:** medium if a consumer interprets declarations/fixtures as proof of runtime integrity or diagnostic codes as mutually exclusive.
- **V1 IMPACT:** claim only the canonical index checks currently implemented; do not claim rules run on runtime Observation/Proposal.
- **PROPOSED DISPOSITION:** `REFINE` diagnostic documentation when authorized; current code unchanged.
- **MINIMAL FUTURE CANDIDATE:** clarify whether wrong type is independently reported and define exact runtime source/target scope before adding checks.
- **DEPENDENCIES:** runtime entity source of truth and permitted class edges.
- **DECISION REQUIRED:** whether diagnostics should be mutually exclusive or report both relationship and existence failures.

### R2D-04 — Effective meaning of `ANY`

- **SOURCE:** [references.ts](../../tools/validate/references.ts#L33-L41), [#L77-L102](../../tools/validate/references.ts#L77-L102); [canonical-integrity.ts](../../tools/validate/canonical-integrity.ts#L77-L120); [canonical-information.md](../model/canonical-information.md#L486-L492).
- **CONFIRMED FACT:** `ANY` skips only the finite allowed-Kind check. Parsing still requires a registered Kind; resolution still looks up the resulting key in the canonical index. It does not mean every entity, runtime inclusion, information-class correctness or access.
- **INFERENCE:** a field declared ANY may syntactically name a runtime Kind and still fail canonical resolution because runtime records are absent from the index.
- **CURRENT IMPLEMENTATION:** no extra kind restriction plus ordinary canonical key/version resolution.
- **RISK:** medium if ANY is interpreted as a universal cross-class resolver.
- **V1 IMPACT:** only indexed canonical destinations resolve today.
- **PROPOSED DISPOSITION:** `KEEP` open target rule, `REFINE` prose if needed to state index scope.
- **MINIMAL FUTURE CANDIDATE:** document the separate target repository/store that a future resolver can query.
- **DEPENDENCIES:** runtime namespaces and information-class relationship policy.
- **DECISION REQUIRED:** what “any” should cover in a future runtime field; no universal rule is adopted here.

### R2D-05 — Runtime references have no current resolver

- **SOURCE:** Observation and Proposal schemas; [references.ts](../../tools/validate/references.ts#L33-L41); [canonical-information.md](../model/canonical-information.md#L265-L287), [#L486-L492](../model/canonical-information.md#L486-L492); [integrity.test.ts](../../tests/integrity.test.ts#L55-L59).
- **CONFIRMED FACT:** Observation/Proposal references have syntactic schema checks and declared semantic rules; no canonical roots exist for either Kind. Runtime fixtures are excluded from discovery; canonical integrity only resolves discovered canonical records.
- **INFERENCE:** runtime reference scenarios such as absent target, stale version, inaccessible target or wrong namespace cannot be assigned actual outcomes under current code; they are hypothetical future cases.
- **CURRENT IMPLEMENTATION:** no runtime reference resolution or runtime reference integrity result.
- **RISK:** high before any runtime consumer relies on references as resolved; absent current producer/store, not an observed production defect.
- **V1 IMPACT:** runtime references cannot substantiate operational traceability or approval evidence on their own.
- **PROPOSED DISPOSITION:** `REFINE` contract/gate expectations before a runtime producer is enabled.
- **MINIMAL FUTURE CANDIDATE:** first choose identity namespace and source of runtime records, then specify checks for existence, scope, version and availability.
- **DEPENDENCIES:** R2D-06 decisions; producer/store lifecycle, privacy, retention and authorization boundaries.
- **DECISION REQUIRED:** which runtime source is authoritative and what failure/unknown states mean. No resolver designed here.

### R2D-06 — Runtime identity scope is not established

- **SOURCE:** [canonical-information.md](../model/canonical-information.md#L234-L263), [#L308-L312](../model/canonical-information.md#L308-L312); `observation.schema.json`, `improvement-proposal.schema.json`; [contracts.md](../concepts/contracts.md#L16-L45); [evaluations.md](../concepts/evaluations.md#L1-L13); [work-lifecycle.md](../model/work-lifecycle.md#L110-L116).
- **CONFIRMED FACT:** Observation and ImprovementProposal use required envelope id/version syntax but lack a canonical root; Contract Instance, Assignment and Evaluation Run are not separate registered Kinds/schemas. Models explicitly say no universal runtime ID schema and no persistence implementation.
- **INFERENCE:** valid fixture `metadata.id` values do not prove generated uniqueness, global/project scope, record persistence, or resolvability.
- **CURRENT IMPLEMENTATION:** schema shape/fixture validation only for Observation/Proposal; no general runtime instance generator/store for the five concepts audited.
- **RISK:** high before persistence or correlation across executions; currently deferred architecture.
- **V1 IMPACT:** no guarantees about deduplication, collision domains, retrieval, retention, staleness or historical runtime versions.
- **PROPOSED DISPOSITION:** `NO CHANGE` until a runtime use case requires identity guarantees.
- **MINIMAL FUTURE CANDIDATE:** per-artifact identity requirements, with namespace and retention choices, before schema/storage work.
- **DEPENDENCIES:** runtime producers/consumers, project/task boundaries, privacy and lifecycle.
- **DECISION REQUIRED:** identity scope, generation owner, uniqueness domain, persistence/version/retention for each runtime artifact.

### R2D-07 — Provenance is not typed reference integrity

- **SOURCE:** [common.schema.json](../../core/schemas/common.schema.json#L38-L62); [references.ts](../../tools/validate/references.ts#L24-L41); [integrity.test.ts](../../tests/integrity.test.ts#L116-L123); [canonical-information.md](../model/canonical-information.md#L314-L330).
- **CONFIRMED FACT:** `provenanceRefs` is a unique list of non-empty strings, optional and not governed by a reference rule. `Observation.spec.evidence` is also a string list. Tests demonstrate provenance-shaped values are not collected as entity references.
- **INFERENCE:** these fields can carry traceability text but do not establish that a referenced entity/record exists, resolves, remains available or is authorized.
- **CURRENT IMPLEMENTATION:** string shape checks only; no provenance graph resolution.
- **RISK:** medium if audit trail completeness is claimed based on syntactic non-empty values.
- **V1 IMPACT:** no target existence claim for provenance/evidence strings.
- **PROPOSED DISPOSITION:** `KEEP` current separation; no conversion to typed refs absent architectural decision.
- **MINIMAL FUTURE CANDIDATE:** define distinct typed relations only for demonstrated traceability requirements.
- **DEPENDENCIES:** source identity, provenance lifecycle and storage/access policy.
- **DECISION REQUIRED:** whether provenance must resolve to entities or remain a documentary source chain.

### R2D-08 — Proposal evidence integrity and empty `observationRefs`

- **SOURCE:** [improvement-proposal.schema.json](../../core/schemas/improvement-proposal.schema.json#L12-L23); [common.schema.json](../../core/schemas/common.schema.json#L81-L90); [learning-evolution.md](../model/learning-evolution.md#L87-L99); [R2-B](r2-b-observation-proposal-lifecycle-diagnostic.md#L83-L91), [R2-C](r2-c-governance-contracts-approval-diagnostic.md#L120-L126).
- **CONFIRMED FACT:** field is required but uses a list without `minItems`; `[]` is schema-valid. Each present member is typed Observation syntax. No runtime Proposal source/resolver exists. Conceptual model requires evidence support; it does not by itself establish that one Observation must be the only permitted evidence type.
- **INFERENCE:** before a future approval/promotion gate, evidence should be identifiable, relevant to scope, available to the decision, and its adequacy explicitly assessed. This is a diagnostic candidate guarantee, not a newly approved contract.
- **CURRENT IMPLEMENTATION:** shape validation only; R2B-05/R2C-08 remain open and there is no observed orphan Proposal instance.
- **RISK:** high before enabling Proposal production or promotion based on schema PASS alone.
- **V1 IMPACT:** distinguish `SCHEMA VALID`, semantically complete, evidence verified and approved.
- **PROPOSED DISPOSITION:** `REFINE` a future gate/producer contract after source, identity and evidence decisions; do not add `minItems` in R2-D.
- **MINIMAL FUTURE CANDIDATE:** require evidence resolution/sufficiency before the approval transition while deciding whether sources beyond Observation are admissible.
- **DEPENDENCIES:** R2D-05/06; source identity, storage, retention, freshness and review policy.
- **DECISION REQUIRED:** whether every proposal needs an Observation, whether alternative evidence sources are valid, and where sufficiency is enforced.

### R2D-09 — `requiredCanonicalDirectories` naming debt

- **SOURCE:** [repository.ts](../../tools/validate/repository.ts#L10-L77), [#L83-L129](../../tools/validate/repository.ts#L83-L129); [canonical-discovery.ts](../../tools/validate/canonical-discovery.ts#L12-L34); [canonical-information.md](../model/canonical-information.md#L494-L496).
- **CONFIRMED FACT:** list has 20 required repository directories and is used for directory-presence checks and nested-`dist` checks. `CANONICAL_ROOTS` separately has 11 authoring roots. Additional directories include `core`, `core/schemas`, `observer`, `adapters`, `installer`, `tools`, `research`, `third-party`, and `tests`.
- **INFERENCE:** name could lead a maintainer to infer all listed directories participate in canonical discovery.
- **CURRENT IMPLEMENTATION:** no effect on discovery: only `CANONICAL_ROOTS` controls traversal and Kind/format classification. Existing diagnostic calls this naming debt only; behavior is correct.
- **RISK:** low, documentation/maintenance confusion.
- **V1 IMPACT:** no runtime or validation behavior change required to state correct counts.
- **PROPOSED DISPOSITION:** `REFINE` name only in a future approved maintenance change, if desired.
- **MINIMAL FUTURE CANDIDATE:** rename exported constant to reflect required repository directories, preserving exact contents and checks.
- **DEPENDENCIES:** code API consumers/tests and explicit change approval.
- **DECISION REQUIRED:** whether a naming-only rename has sufficient value; no behavior change proposed.

## Architectural synthesis

### Guarantees supported by current evidence

- The current validator indexes only schema-valid, correctly placed entities discovered beneath 11 fixed canonical roots; current repository result has 8 entities.
- Logical canonical key is `Kind:id`; duplicate logical keys are diagnosed even if metadata versions differ; text IDs may repeat across Kinds.
- Declared canonical reference fields are syntax parsed; finite relationship target Kinds are checked; parsed references are resolved against the one canonical index; explicit versions require exact equality.
- Registered shape, valid syntax, canonical target existence, target-kind relationship, exact version match, runtime availability, authorization and information class are distinct properties.
- `ANY` removes only the additional target-Kind check; it does not expand the index or authorize access.

### Guarantees not supported yet

- Runtime Observation/Proposal/Contract Instance/Assignment/Evaluation Run existence, global uniqueness, namespace, resolvability, persistence, availability, freshness, retention or version history.
- Runtime reference integrity or provenance graph resolution.
- Automatic historical-version selection, compatibility or migration behavior.
- That `provenanceRefs` or `spec.evidence` values name an existing/resolvable record.
- That a non-empty or schema-valid proposal has sufficient verified evidence, or that `observationRefs: []` represents an observed runtime orphan.
- That a resolved reference grants access, permission, authority or promotion.

### V1 prerequisites versus deferrable work

- **Real prerequisite before the first runtime producer/consumer relies on references:** identify the source of record and identity scope; specify how target existence/version/availability failures are surfaced; define which reference relations cross information classes; ensure a promotion/approval gate can inspect and assess its evidence. The implementation mechanism remains undecided.
- **Deferrable until a feature requires it:** historical canonical version resolution, version ranges/compatibility aliases, generalized runtime resolver/service/database, provenance-graph traversal, new IDs for unimplemented Contract Instance/Assignment/Evaluation Run concepts, and the `requiredCanonicalDirectories` naming cleanup.
- **Candidate change location (not authorization):** schema if a proven structural constraint is absent; validator if a current canonical check is inaccurate/incomplete; runtime source/resolver only after its identity/store contract exists; documentation only for scope/wording clarification. These categories do not preselect or approve a remediation.

## Decisions and no-go boundary

Before any future runtime reference implementation, decide: (1) identity generation owner and scope for each runtime artifact; (2) canonical versus runtime source-of-record boundaries; (3) target relationship matrix and cross-class allowances; (4) exact versus historical version semantics; (5) missing, inaccessible, stale and version-mismatch outcomes; (6) provenance/evidence representation and whether it must resolve; (7) retention and privacy; (8) pre-approval evidence requirements, retaining R2B-05/R2C-08 without assuming `minItems: 1`; and (9) whether naming debt merits a nonfunctional rename. This audit approves none of these decisions and authorizes no schema, validator, runtime or roadmap change.

## Disposition summary

| Finding | Proposed disposition | Status |
| --- | --- | --- |
| R2D-01 Identity/version shape | REFINE if required | Decision deferred |
| R2D-02 CanonicalIndex uniqueness | KEEP | Current behavior verified |
| R2D-03 Typed declaration/execution boundary | REFINE documentation if authorized | Runtime checks deferred |
| R2D-04 ANY | KEEP; clarify index scope if needed | Current semantics verified |
| R2D-05 Runtime reference resolution | REFINE before a producer depends on it | Not implemented |
| R2D-06 Runtime identity | NO CHANGE until a concrete runtime need | Unknown/deferred |
| R2D-07 Provenance | KEEP separate; consider future refinement | No graph resolver |
| R2D-08 Proposal evidence | REFINE future gate/producer contract | R2B-05 and R2C-08 preserved |
| R2D-09 Directory naming | REFINE name only if approved | No functional effect |

**R2-D conclusion:** no material normative contradiction was found that invalidates the current canonical identity/index guarantees. The gaps are explicitly limited to unsupported or unimplemented runtime guarantees. Recommendations above are diagnostic proposals only; R2-D does not authorize R3.

## Validation and change boundary

Fresh command results are recorded in the closeout report. Required gates are `npm run typecheck`, `npm run validate`, `npm test`, and `npm run verify:core`, plus Markdown local-link validation. Acceptance also requires the staged change to contain only this file; schemas, reference rules, tests, validators, directories/naming behavior, dependencies, roadmap and generated artifacts must remain unchanged.
