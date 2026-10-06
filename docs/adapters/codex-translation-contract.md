# Codex Adapter Translation Contract

**Status:** Design input for Phase 1.1-A; implementation is not authorized by this document.  
**Design authority:** ADR 0004, Accepted.
**Certified source decision:** ADR 0003, Accepted.  
**Target:** Codex Local CLI / local Codex harness.  
**Research baseline:** Codex CLI 0.160.0, tag rust-v0.160.0; snapshot 2026-10-05.  
**Evidence boundary:** Phase 1.0 distinctions remain in force. Documented or main-only behavior is not thereby verified on 0.160.0; OBSERVED_LOCAL is none. See the research provenance and capability matrix.

## 1. Purpose and invariants

This contract defines how a later adapter may translate selected, validated Nexo canonical inputs into Codex-native generated output. It does not redefine canonical semantics, design a runtime, or authorize implementation of any artifact here.

NEXOHARNESS DEFINES ONCE. CODEX CONSUMES A GENERATED TRANSLATION.

- Canonical source is not Codex generated output.
- Adapter is not installer.
- Adapter translation is not runtime authority.
- Generated artifact is not canonical input.
- Target capability is not authorization.
- Nexo Skill is not a Codex skill file.
- Agent role is not authority.
- Workflow hint is not a workflow state machine.
- Prompt guidance is not hard enforcement.
- Codex session state is not Nexo Shared Runtime.
- Codex main or mutable documentation is not the selected stable baseline.

## 2. Compilation and ownership pipeline

Validated canonical Nexo source → explicit canonical selection → Codex adapter → target-specific internal representation → deterministic Codex artifact rendering → generated distribution → installer/doctor (Phase 1.2) → target repository and Codex environment.

The Nexo control plane or caller chooses task-relevant canonical entities, versions, workflow context, profile and requested target. The adapter consumes that explicit selection; it does not infer an objective, classify a task, choose permissions, or load every canonical entity. It reads validated canonical inputs only. It never reads dist/ as input or writes canonical source.

The adapter owns semantic mapping, target feature gating, intermediate representation construction, deterministic rendering, generated provenance and compile-time diagnostics. The installer owns environment detection, target file discovery, collision reporting, installation, update/removal and post-install verification. ADAPTER GENERATES; INSTALLER RECONCILES. The adapter never installs, merges or overwrites user files.

Target capability availability describes what Codex can do. Canonical authorization independently determines whether an action is permitted.

## 3. Translation and enforcement vocabularies

Translation classes describe disposition, not the Phase 1.0 capability-support classes:

| Class | Meaning |
|---|---|
| DIRECT_TRANSLATION | Semantics map to a corresponding target artifact with no material loss identified. |
| COMPOSED_TRANSLATION | Several target artifacts/settings are needed; each part and limit is explicit. |
| CONDITIONAL_TRANSLATION | Depends on target feature, version, platform or configuration evidence. |
| NEXO_RUNTIME_ONLY | Nexo runtime owns the semantics; a target artifact cannot claim to implement them. |
| NO_TARGET_ARTIFACT | The concept has no generated Codex artifact. |
| UNSUPPORTED | The selected target is demonstrated unable to represent required semantics safely. |
| UNKNOWN | Evidence is insufficient; support must not be assumed. |

Enforcement strength remains a separate field: HARD ENFORCEMENT, RUNTIME GATE, PROMPT / ADVISORY ONLY, or NONE / UNKNOWN. Authority crosswalk strength is separate again: STRONG, PARTIAL, ADVISORY, UNREPRESENTABLE, or UNKNOWN. Do not infer one vocabulary from another. Prompt text is never enforcement.

## 4. Canonical concept mapping

These are future translation dispositions, not claims that Codex 0.160.0 behavior was directly observed.

| Canonical concept and semantics | Codex representation candidate | Translation class | Enforcement, loss and runtime boundary | Verification and future phase |
|---|---|---|---|---|
| Directive — universal or scoped intended behavior; Core Directive and execution protocol remain canonical. | Generated AGENTS.md sections derived from selected directives. Never a manually maintained duplicate. | COMPOSED_TRANSLATION | Primarily PROMPT / ADVISORY ONLY. Loading, size limits and precedence differ; required constraints cannot be truncated. | Compare source refs, rendered content, conflicts, budget and loading on pinned CLI. Phase 1.1-B. |
| Policy — canonical constraints, conflict handling and authority rules. | Critical policy summaries may be translated into generated instructions; verified sandbox/approval configuration may support specific effects. | CONDITIONAL_TRANSLATION | Instruction text is advisory. Prose alone cannot satisfy a required policy that needs runtime or hard enforcement. If its required effect lacks a verified adequate target mechanism or Nexo-owned runtime enforcement path, compilation blocks rather than claiming preservation. | Verify each safety claim against native action paths, configuration and OS boundaries. Phase 1.1-B / 1.3. |
| Rule — behavioral invariant independent of one procedure. | Instruction summary; Codex command rules only as an explicitly gated optional candidate. | CONDITIONAL_TRANSLATION | Prompt guidance is advisory. .rules was Experimental in Phase 1.0 research and is not a V1 enforcement dependency. | Exclude experimental controls from required behavior; verify any later selected rule against bypass paths. Phase 1.1-B. |
| Workflow — typed state transitions, gates, handoffs, failure paths and terminal conditions. | Optional procedural hints in selected instructions or skills, labelled as hints. | NEXO_RUNTIME_ONLY | No proven general Codex state machine. Hints do not enforce typed state, retry bounds, handoffs or bounded remediation. | Verify Nexo-owned runtime behavior separately; never certify workflow completion from a hint. Phases 2.x / 3.x. |
| Agent — stable identity, responsibility, triggers, input/output contract and failure/verification expectations; authority is dimensional and separate. | Custom Codex agent representation for role and responsibility only. | COMPOSED_TRANSLATION | Agent instructions/settings do not grant Nexo authority. Version-unclear features are gated; unsupported contract fields are diagnosed, not silently dropped. | Verify exact 0.160.0 schema, discovery, inheritance, triggers, output and failure handling. Phase 1.1-B. |
| Skill — reusable bounded procedure with activation and progressive disclosure. | Codex skill folder / SKILL.md, with references, scripts and assets mapped from selected canonical resources. | CONDITIONAL_TRANSLATION | Skill content is procedural guidance, not permission. Activation, scope, precedence or resource layout may be lossy. No authority field is emitted. | Verify metadata, duplicate handling, activation, resources, size and target behavior. Phase 1.1-B. |
| Contract — canonical handoff definition constraining data and allowed outcomes; workflow owns routing and state. | Optional bounded task instruction derived from a selected Contract Definition. | NEXO_RUNTIME_ONLY | The instruction is not an authoritative definition or validated Contract Instance. Runtime instances, routing and completion validation remain Nexo-owned. | Test any future rendering against canonical fields while runtime validators remain authoritative. Phases 2.1 / 3.x. |
| Capability — abstract requested operation and effect; provider/resolver selection is separate. | Future mapping from abstract names such as repository.search to an audited native operation inventory. | CONDITIONAL_TRANSLATION | Availability is AVAILABLE, UNAVAILABLE, DEGRADED or UNKNOWN; none authorizes use. No resolver or MCP mapping is part of this contract stage. | Verify operation, effect, platform and availability; reject silent substitutions. Phase 1.1-B / 1.2. |
| Profile — context bundle of capabilities and constraints. | Composition input selecting instructions, agents, skills, capability expectations and target settings. | COMPOSED_TRANSLATION | A Profile cannot expand canonical authority. Unsupported constraints block or explicitly degrade according to their requirement. | Verify selected refs, effective settings and authority ceiling. Phase 1.1-B. |
| Enforcement — strength by which an invariant is communicated, detected or blocked. | Separately recorded sandbox, approval and validated target controls; instruction layer only for advisory material. | CONDITIONAL_TRANSLATION | Preserve the actual strength category. A hard boundary that would become prompt-only is a blocking incompatibility. | Verify effects across supported paths and platforms. Phase 1.1-B / 1.3. |
| Evaluation — canonical behavioral expectation and evidence criteria. | Later adapter/integration test inputs or fixtures derived from selected eval definitions. | CONDITIONAL_TRANSLATION | Codex output is not authoritative evaluation state; Nexo owns expected outcomes and result interpretation. | Verify test identity/version, isolation, result handling and evidence provenance. Phase 1.3 / 6.x. |
| Observation — structured execution evidence with privacy and unavailable-value semantics. | NO TARGET ARTIFACT. Future collectors may separately consume supported events. | NO_TARGET_ARTIFACT | Must not be embedded in instructions or promoted to authority. Shared Runtime and Observer remain Nexo-owned. | Future collectors test signal presence, privacy and version stability. Phase 5.x. |
| ImprovementProposal — governed candidate for canonical change requiring eval, review and approval. | NO TARGET ARTIFACT. | NO_TARGET_ARTIFACT | A proposal cannot modify canonical files or generated instruction semantics by itself. Promotion remains governed by Nexo. | Verify canonical promotion lifecycle independently. Phase 5.5. |

Shared Runtime state and the canonical promotion lifecycle also have no target artifact. Codex session/resume or local memory does not translate Nexo GLOBAL, WORKSTYLE, PROJECT or TASK state.

## 5. Always-on instructions and canonical precedence

The only acceptable always-on Codex instruction output is generated from canonical source references selected for that compilation. It is never copied by hand into a permanent Codex-specific source file.

The compiler must preserve, with explicit section boundaries and source references:

1. Nexo Core Directive invariants.
2. Critical safety and integrity policies.
3. The relevant Nexo Execution Protocol summary.
4. Explicitly selected canonical project-specific instructions and constraints.

Conditional workflow, responsibility, rule, skill and capability context is included only when selected. The user objective and user-authored project/Codex instructions are external execution context, not canonical content for the compiler to absorb or own.

Nexo semantic precedence remains authoritative:

1. Critical safety and integrity.
2. Explicit user objective and constraints.
3. Project-specific instructions and architecture.
4. Active workflow.
5. Agent responsibility and contract.
6. Applicable rules and policies.
7. Skills and procedures.
8. Provider details.

Codex AGENTS discovery/loading order is a target mechanism, not an equivalent precedence model. Generated headings may label canonical priority and prohibit lower-layer authority expansion, but prompt wording cannot force the host to disregard conflicting higher-priority/system/user instructions. If a material conflict cannot be resolved without guessing, or target ordering reverses a required semantic rule, emit a blocking diagnostic. Never silently choose.

### Ordering, size budget and truncation

Render sections in canonical priority order, with deterministic subsection ordering by canonical identifier. Each generated section carries source refs in stable provenance comments or manifest entries. The compiler uses a versioned target budget supplied by verified target configuration; Phase 1.0 documented a Codex instruction byte limit but did not establish every detail on CLI 0.160.0.

Measure the complete rendered artifact as UTF-8 bytes, including required headings and provenance. Never silently clip, omit or summarize required constraints to fit. If the verified budget is unknown, or required content exceeds it, compilation fails with a blocking TARGET_FEATURE_UNKNOWN or INSTRUCTION_BUDGET_EXCEEDED diagnostic. Optional sections may be excluded only by explicit canonical selection with a recorded warning; required sections are never dropped as fallback.

## 6. Existing user files and install ownership

The adapter compiles distribution artifacts without reading or claiming ownership of the target user's AGENTS.md, AGENTS.override.md or Codex configuration. It emits no merge patch and performs no writes.

The installer owns actual target discovery and collision handling in Phase 1.2. It must report USER_FILE_COLLISION, preserve existing bytes and stop for explicit reconciliation when installation cannot be safely composed. No destructive merge, silent replacement or implicit ownership transfer is defined here. The adapter/installer may not report a clean installation before checking relevant target paths and configuration.

## 7. Skill and agent constraints

### Skills

Map only canonical identity/name, purpose, activation conditions, procedure, referenced materials, scripts/assets and disclosure boundaries to a Codex skill candidate. Preserve provenance on the root skill and each generated resource. Unsupported activation/scope behavior is conditional or blocking according to whether it is required. Never emit authority, permissions or policy grants from a Nexo Skill.

### Agents

Map role/responsibility, triggers, bounded input/context, expected output, completion condition, failure behavior and verification expectations to candidate custom-agent fields only where the pinned target supports them. Report unsupported fields explicitly. Keep ROLE, RESPONSIBILITY and AUTHORITY as distinct IR fields. Codex agent sandbox/approval settings do not rewrite canonical authority.

## 8. Authority crosswalk

This is a conservative design disposition from Phase 1.0 evidence, not an implementation or claim of direct CLI observation. No mapping is STRONG by default. PARTIAL must never be rendered or reported as STRONG.

| Nexo authority dimension | Candidate Codex control | Crosswalk | Loss / blocking condition |
|---|---|---|---|
| sourceModification | Read-only/workspace-write sandbox and filesystem boundary | PARTIAL | Target controls file access more coarsely and platform/configuration varies. If the requested boundary cannot be guaranteed, fail closed. |
| delegation | Multi-agent enablement, spawn controls and child inheritance of parent sandbox/approval | UNKNOWN | Nexo's bounded delegation contract and per-dimension authorization are not structurally enforced; exact 0.160.0 feature inclusion is not established. Required delegation constraints block until verified/represented. |
| commandExecution | Sandbox, approval policy and optional command-prefix rules | PARTIAL | Rules were Experimental; wrappers and non-shell operations can differ. Do not rely on prompt text or experimental rules as the sole required control. |
| externalMutation | Network boundary and approvals for covered operations | PARTIAL | Network, file and external-service effects do not map one-to-one; alternate tool paths and Windows fallback vary. An unverified external-write restriction blocks. |

The IR records each requested dimension, canonical requirement, target control, crosswalk strength, enforcement strength, evidence/version confidence, loss and diagnostic. A required authority boundary classified PARTIAL, ADVISORY, UNREPRESENTABLE or unresolved UNKNOWN cannot produce a usable artifact; compilation fails or emits a BLOCKING incompatibility. A PARTIAL mapping for optional, non-required behavior may be represented only as explicit degradation with diagnostics when the canonical selection permits the loss. It never silently downgrades a required boundary to prompt guidance. Target environment status is SUPPORTED, DEGRADED or UNKNOWN; environment detection belongs primarily to installer/doctor Phase 1.2.

## 9. Target-specific intermediate representation

CodexCompilation is a small adapter-internal model, not a canonical Kind or persisted runtime state. Its conceptual fields include:

- target and explicit target baseline/configuration;
- selected canonical source refs and versions;
- ordered instruction sections;
- translated skill and agent candidates;
- authority and capability mappings;
- environment status;
- diagnostics and provenance.

Each selected entity ref includes stable canonical ID and version. Mapped entries retain source refs, target candidate, translation class, evidence confidence, enforcement/crosswalk strength and loss/degradation. User-file collision data is excluded because the pure compiler does not inspect target files. The concrete TypeScript type and runtime schema are deferred to Phase 1.1-B implementation review.

## 10. Provenance and deterministic generation

Every future generated artifact and manifest identifies:

- adapter name and exact adapter version;
- canonical source IDs and versions used for that artifact;
- target surface and explicit baseline (Codex CLI 0.160.0, rust-v0.160.0 for this contract);
- target configuration/profile identity where relevant;
- artifact identity and relative generated path;
- applicable translation/authority diagnostics;
- content hash with a defined algorithm and byte encoding.

A future dist/codex/manifest.json is generated target metadata, not a canonical entity. It records artifact hashes and source refs. If the manifest has its own digest, compute it over canonical serialization with the digest field omitted to avoid recursive hashing. Do not include timestamps, machine paths, usernames, random IDs or secrets in deterministic content.

For identical canonical selections, source versions, adapter version, target baseline and target configuration, output bytes must be identical. Require stable ordering by canonical ID/path, explicit key order, UTF-8 encoding, LF line endings and a final newline. No random identifiers, implicit clocks, locale-dependent ordering, network-dependent lookups or host discovery are allowed during compilation. Compilation is offline; research/version updates are separate reviewed work.

## 11. Diagnostics and degradation

Diagnostics are target-specific compiler or installer outputs, not a new canonical diagnostic schema in this design stage.

| Severity | Meaning | Compiler/installer behavior |
|---|---|---|
| INFO | Traceable translation fact without material loss. | Continue and include provenance. |
| WARNING | Optional behavior is omitted or degraded explicitly. | Continue only if selected canonical requirements permit the loss. |
| ERROR | Invalid, inconsistent or unverifiable input/output. | Do not emit a usable distribution. |
| BLOCKING | Required semantics or authority cannot be preserved safely. | Fail compilation/installation; no partial usable deployment. |

Compiler-owned examples: TARGET_FEATURE_UNKNOWN, TARGET_FEATURE_UNSUPPORTED, AUTHORITY_MAPPING_PARTIAL, AUTHORITY_UNREPRESENTABLE, INSTRUCTION_BUDGET_EXCEEDED, TARGET_VERSION_UNVERIFIED, SOURCE_REFERENCE_INVALID, GENERATED_ARTIFACT_DRIFT. Installer-owned example: USER_FILE_COLLISION. Drift checking compares generated output and is owned by a later validation/doctor path; it does not authorize overwriting user changes.

Degradation rules:

- Optional feature unavailable → omit only under explicit selection/requirement rules and emit a WARNING describing effect and provenance.
- Required semantic unavailable → compilation failure / BLOCKING diagnostic.
- Hard authority representable only as advisory prompt → BLOCK; no fallback.
- Version-unclear or main-only mechanism → CONDITIONAL / UNKNOWN; it cannot satisfy a required feature until verified on the selected release.
- Any fallback is equal or more restrictive in effect; none may expand authority.
- User file/config collision → installer reports and preserves existing file; no silent overwrite.

## 12. Target version and platform policy

Carry the explicit target codex-local-cli and baseline 0.160.0 in every compilation. Do not use “latest”, silently substitute upstream main, or assume current mutable documentation proves stable-release support. Main-only, experimental and version-unclear features remain conditional until release-pinned evidence and direct target verification exist. Phase 1.0 evidence labels and unknowns are retained, not upgraded by this design.

Canonical semantics remain cross-platform. Target compilation accepts or reports environment status SUPPORTED, DEGRADED or UNKNOWN without making canonical rules Windows-specific. Phase 1.0 found meaningful native Windows versus WSL/elevated versus unelevated sandbox differences. Actual host discovery and effective enforcement belong primarily to installer/doctor Phase 1.2; until then required controls with unknown effective behavior block certification.

## 13. Concepts with no output and deferred systems

- Workflow state, typed handoffs, retries, gates and bounded remediation: Nexo runtime owns them. Optional Codex procedural hints are never implementation evidence.
- Contract Definitions and Instances: remain canonical/runtime-owned; a bounded task instruction may be derived but is not the authoritative contract.
- Observation: no target artifact. Later telemetry collection is a distinct, privacy-governed runtime integration.
- ImprovementProposal and promotion lifecycle: no target artifact; proposals never alter generated behavior without governed canonical selection.
- Shared Runtime: no target artifact. Codex sessions/resume/memory do not translate to Nexo scopes.
- MCP: deferred provider mechanism. No MCP routing, configuration, registry, mapping or dependency is part of this contract.
- New canonical Kind: none. CodexCompilation remains adapter-internal.

## 14. Future validation requirements

Before implementation can be reviewed for Phase 1.1-B, compiler tests and pinned-target integration checks must demonstrate:

1. Validated, explicitly selected source refs only; no generated or target file can flow back as canonical input.
2. Stable, byte-identical output for repeated offline compilation from identical inputs/configuration.
3. Complete provenance and stable content/manifest hashes.
4. Instruction ordering, source attribution and fail-closed byte-budget behavior.
5. Correct translation-class, enforcement-strength and authority-strength separation.
6. Required PARTIAL, ADVISORY, UNREPRESENTABLE or unresolved UNKNOWN authority cannot produce a usable artifact.
7. Unsupported optional features degrade only with explicit diagnostics; unsupported required semantics block.
8. Skills cannot emit authority; agent role cannot alter authority; workflow hints are not counted as state-machine behavior.
9. User-authored files are not read or modified by compilation. Installer collision handling is independently tested in Phase 1.2.
10. CLI 0.160.0 target checks are distinguished from mutable docs, main-only evidence, experimental features and unobserved behavior.

Phase 1.1-A defines design only. It creates no adapter, compiler, renderer, generated Codex file, runtime hook, provider resolver, Shared Runtime, Observer collector or installer behavior.

