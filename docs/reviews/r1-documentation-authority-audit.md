# R1 Documentation Authority Audit

- Audit date: 2026-10-07
- Baseline at audit time: `1d9427ecee1bfc9ff34999b712ca33f72a27397b` (R0-F checkpoint, HEAD == origin/main, worktree clean)
- Scope: R1-A documentation authority reconciliation
- Status: reconciliation record, **not** source-of-truth conductual. It classifies existing documentation; it does not itself define or change canonical behavior.

This record supports the introduction of `docs/model/` as the organizational/system architecture frontier (see [`docs/model/README.md`](../model/README.md)). It inventories every architecturally relevant document found under `docs/`, `docs/concepts/`, `docs/decisions/`, `docs/reviews/`, `docs/adapters/`, `docs/research/`, `research/` and the governing `core/policies/*` entries, and classifies each by authority class and disposition. No document listed here was deleted, moved, or rewritten by this audit; `core/policies/*` content is included only as the authoritative reference for duplication findings and was not modified.

## Authority Classes

```text
NORMATIVE            — governs intended behavior directly (policy, architecture-defining)
TECHNICAL_NORMATIVE   — governs technical canonical Kind semantics or schema-adjacent behavior
EXPLANATORY           — explains concepts without itself being the enforced source
DECISION              — historical ADR record
REVIEW                — independent review record
RESEARCH              — empirical/external investigation evidence
STATUS                — current implementation/attempt status tracker
```

## Dispositions

```text
PRESERVE    — stays exactly where it is, as the authoritative source for its scope
MERGE       — candidate to be folded into a docs/model/ document in a later phase (not performed now)
REFINE      — stays in place, but its responsibility narrows (minimal edit made or scheduled)
SUPERSEDE   — a newer document replaces this one (not used in R1-A; no document is superseded yet)
RELOCATE    — candidate to move to a different existing directory (not performed now)
STATUS_ONLY — its job is to state current status only, not explain rationale
NO_CHANGE   — correctly placed and scoped; no action of any kind
CONFLICT    — a real, unresolved contradiction exists; flagged for a later decision
```

## Authority Matrix

| Document | Current Role | Authority Class | Target Owner | Disposition | Reason | Dependencies |
|---|---|---|---|---|---|---|
| `docs/architecture.md` | High-level system architecture | NORMATIVE | `docs/model/` (index role) + stays in place | REFINE | Becomes a thinner index/navigation document per the new frontier; its current content is still accurate and is not duplicated into `docs/model/` yet. | `docs/model/README.md`, `docs/source-of-truth.md` |
| `docs/source-of-truth.md` | Canonical directory ownership table | NORMATIVE | stays in place | REFINE | Needs to explicitly place `docs/model/` as organizational/system layer alongside existing CANONICAL/GENERATED/RUNTIME/RESEARCH classes. | `docs/model/README.md` |
| `docs/principles.md` | NH-P001–NH-P015 stable engineering principles | NORMATIVE | `docs/model/charter.md` | MERGE — **reconciliation started in R1-B** | Principles describe why the system behaves as it does — organizational/charter material. `docs/model/charter.md` now exists (ACTIVE) and carries forward the Growth, Minimality, Source-of-truth, Improvement, Authority, Verification and External-source principles in organizational form. `docs/principles.md` itself is preserved in full (R1-B.21) with a visible authority note; it is not yet marked fully superseded because not every NH-P identifier's exact wording has been individually cross-walked. | `docs/model/charter.md` (now exists, ACTIVE) |
| `docs/terminology.md` | Full vocabulary (organizational + technical terms) | EXPLANATORY | split: `docs/model/vocabulary.md` (organizational terms) and `docs/concepts/*` (technical Kind terms stay authoritative there) | MERGE — **reconciliation started in R1-B** | Not a clean single merge: terms like Agent Role, Capability Provider, Orchestrator are organizational, but Contract Definition/Instance, Canonical Index, Validation Diagnostic are technical Kind semantics already owned by `docs/concepts/contracts.md` and `docs/validation.md`. `docs/model/vocabulary.md` now exists (ACTIVE) and is authoritative for the organizational/cross-layer terms; `docs/terminology.md` is preserved in full with a visible authority note, since its technical-only terms are not yet individually migrated or split out. | `docs/model/vocabulary.md` (now exists, ACTIVE), `docs/concepts/contracts.md`, `docs/validation.md` |
| `docs/lifecycle.md` | Build lifecycle + Improvement lifecycle summary | NORMATIVE | split: `docs/model/work-lifecycle.md` (build lifecycle) and `docs/model/learning-evolution.md` (improvement lifecycle, already elaborated by `docs/continuous-improvement.md`) | MERGE — **build-lifecycle half reconciled in R1-C** | The suggested single target (`work-lifecycle.md`) does not fit the Improvement lifecycle half, which is already authoritatively elaborated by `docs/continuous-improvement.md`; that half remains deferred to the `learning-evolution.md` phase. `docs/model/work-lifecycle.md` now exists (ACTIVE) and reconciles the build-lifecycle half, explicitly mapped against NEP-1's stages. `docs/lifecycle.md` is preserved in full with a visible authority note. | `docs/model/work-lifecycle.md` (now exists, ACTIVE), `docs/continuous-improvement.md` |
| `docs/execution-model.md` | Progressive-disclosure context loading (ALWAYS-ON/CONDITIONAL/LEARNED/TASK/TARGET RUNTIME) | TECHNICAL_NORMATIVE | `docs/model/operations-orchestration.md` | MERGE — **reconciliation started in R1-C** | Control-plane/operational behavior describing how context is loaded during execution, matching the Operations/Control Plane layer. `docs/model/operations-orchestration.md` now exists (ACTIVE) and reconciles this document's *operational use inside the control loop* only; the full progressive-disclosure context model remains `docs/execution-model.md`'s responsibility, preserved in full with a visible authority note. | `docs/model/operations-orchestration.md` (now exists, ACTIVE) |
| `docs/orchestration.md` | Orchestration responsibility, control loop, escalation | NORMATIVE | `docs/model/operations-orchestration.md` | MERGE — **reconciliation started in R1-C** | Matches the Operations/Control Plane layer directly. `docs/model/operations-orchestration.md` now exists (ACTIVE) and reconciles its control loop, escalation, and minimum-sufficient-orchestration content; `docs/orchestration.md` is preserved in full with a visible authority note. | `docs/model/operations-orchestration.md` (now exists, ACTIVE) |
| `docs/shared-runtime.md` | Shared Runtime State scopes and Adaptation Envelope | NORMATIVE | `docs/model/knowledge-experience.md` | MERGE — **reconciliation started in R1-D** | Matches organizational knowledge/experience framing. `docs/model/knowledge-experience.md` now exists (ACTIVE) and reconciles this document's scopes, Adaptation Envelope, and boundary rules, and develops Experience Record/Knowledge lifecycle/confidence/contradiction/gap concepts this document never had. `docs/shared-runtime.md` is preserved in full with a visible authority note; its hand-off to a future Learning/Evolution model remains pending. | `docs/model/knowledge-experience.md` (now exists, ACTIVE) |
| `docs/continuous-improvement.md` | Governed improvement lifecycle, learning categories | NORMATIVE | `docs/model/learning-evolution.md` | MERGE | Matches Learning/Evolution layer; already explicitly disclaims competing with `core/policies/self-improvement.md`, which is a good existing pattern to preserve in the merge. | `docs/model/learning-evolution.md`, `core/policies/self-improvement.md` |
| `docs/canonical-format.md` | Canonical manifest envelope (apiVersion/kind/metadata/spec) | TECHNICAL_NORMATIVE | `docs/schema-system.md` | MERGE | Near-duplicate of `docs/schema-system.md`'s envelope section (see duplication findings below); merging consolidates one authoritative technical description instead of two. | `docs/schema-system.md` |
| `docs/schema-system.md` | Canonical schema system, registry, validation | TECHNICAL_NORMATIVE | stays in place (absorbs `docs/canonical-format.md`) | PRESERVE (as merge target) | More complete than `docs/canonical-format.md` (also covers registry, versioning, authoring formats); best authoritative home for the envelope description. | `docs/canonical-format.md` |
| `docs/validation.md` | Validation pipeline, diagnostics, reference resolution | TECHNICAL_NORMATIVE | stays in place | NO_CHANGE | Correctly scoped technical description adjacent to `docs/concepts/`; no organizational-model overlap identified. | none |
| `docs/versioning.md` | Phase tags, SemVer, commits, release/promotion mechanics | NORMATIVE | split: `docs/model/governance-authority.md` (approval/governance framing) and `docs/model/distribution-release.md` (release mechanics) | MERGE (partial, split required) | Governance (independent review, explicit approval) and release mechanics (tag format, CI classification) are organizationally distinct concerns bundled in one file today. | `docs/model/governance-authority.md`, `docs/model/distribution-release.md` |
| `docs/concepts/directives.md` | Component coordination table + non-equivalences | TECHNICAL_NORMATIVE | stays in place | PRESERVE | Exactly matches the declared `docs/concepts/` role: technical canonical Kind semantics. | none |
| `docs/concepts/agents.md` | Agent Kind contract | TECHNICAL_NORMATIVE | stays in place | PRESERVE | Correctly scoped. | none |
| `docs/concepts/skills.md` | Skill Kind contract | TECHNICAL_NORMATIVE | stays in place | PRESERVE | Correctly scoped. | none |
| `docs/concepts/rules.md` | Rule/Policy/Gate concepts | TECHNICAL_NORMATIVE | stays in place | PRESERVE | Correctly scoped. | none |
| `docs/concepts/workflows.md` | Workflow Kind concept | TECHNICAL_NORMATIVE | stays in place | PRESERVE | Correctly scoped. | none |
| `docs/concepts/contracts.md` | Contract Definition vs. Instance | TECHNICAL_NORMATIVE | stays in place | PRESERVE | Correctly scoped; also the authoritative completion-status list reference (see CONFLICT below). | none |
| `docs/concepts/capabilities.md` | Capability Kind, identity vs. semantic request | TECHNICAL_NORMATIVE | stays in place | PRESERVE | Correctly scoped. | none |
| `docs/concepts/profiles.md` | Profile Kind concept | TECHNICAL_NORMATIVE | stays in place | PRESERVE | Correctly scoped. | none |
| `docs/concepts/enforcement.md` | Enforcement L1/L2/L3 levels | TECHNICAL_NORMATIVE | stays in place | PRESERVE | Correctly scoped. | none |
| `docs/concepts/evaluations.md` | Evaluation forms (structural/behavioral/adapter/integration/regression) | TECHNICAL_NORMATIVE | stays in place | PRESERVE | Correctly scoped; note: does not itself define the E0–E4 evidence-class vocabulary, which lives in `core/policies/evidence.md` — not a conflict, just a distinct but related concern worth cross-referencing in a future edit. | `core/policies/evidence.md` |
| `docs/concepts/task-observer.md` | Task Observer responsibilities and boundary | TECHNICAL_NORMATIVE | stays in place | PRESERVE | Correctly scoped. | none |
| `docs/decisions/0001-canonical-manifest-model.md` | ADR: canonical envelope | DECISION | stays in place | PRESERVE | Historical decision record; never rewritten. | none |
| `docs/decisions/0002-orchestration-shared-runtime.md` | ADR: orchestration/shared runtime | DECISION | stays in place | PRESERVE | Historical decision record; never rewritten. | none |
| `docs/decisions/0003-codex-target-surface.md` | ADR: Codex target surface | DECISION | stays in place | PRESERVE | Historical decision record; never rewritten. | none |
| `docs/decisions/0004-codex-adapter-translation-contract.md` | ADR: Codex translation contract | DECISION | stays in place | PRESERVE | Historical decision record; never rewritten. | none |
| `docs/decisions/0005-codex-agent-role-rendering.md` | ADR: Agent role rendering | DECISION | stays in place | PRESERVE | Historical decision record; never rewritten. Its "C4-C runtime verification has NOT YET been run" sentence remains as written — see [R0-F freeze record](../../research/codex/probes/c4c-runtime-r5-f2-0.160.0.md) for the current status, which lives outside this ADR. | `research/codex/probes/c4c-runtime-r5-f2-0.160.0.md` |
| `docs/reviews/codex-c4-b1-independent-review.md` | Independent review of ADR 0005 / C4-B1 | REVIEW | stays in place | PRESERVE | Correctly scoped historical review record. | none |
| `docs/adapters/codex.md` | Codex adapter implementation status | STATUS | stays in place | STATUS_ONLY | Its sole job is to state current status; it already does only that. R0-F already corrected its stale C4-C line. | `research/codex/probes/c4c-runtime-r5-f2-0.160.0.md` |
| `docs/adapters/kilo.md` | Kilo adapter status (not implemented) | STATUS | stays in place | STATUS_ONLY | Correctly minimal status-only stub. | none |
| `docs/adapters/claude-code.md` | Claude Code adapter status (not implemented) | STATUS | stays in place | STATUS_ONLY | Correctly minimal status-only stub. | none |
| `docs/adapters/codex-capability-matrix.md` | Codex capability research summary for adapter design | RESEARCH | stays in place | PRESERVE | Correctly scoped design-facing research summary, cross-referenced to `research/codex/`. | `research/codex/capability-matrix.md`, `research/codex/sources.md` |
| `docs/adapters/codex-translation-contract.md` | Accepted Codex translation contract design | TECHNICAL_NORMATIVE | stays in place | PRESERVE | Design authority is ADR 0004; correctly scoped and already distinguishes translation-class/enforcement-strength/authority-crosswalk vocabularies. | ADR 0004 |
| `docs/research/methodology.md` | Third-party research intake procedure | RESEARCH | stays in place | PRESERVE | Correctly scoped. | none |
| `docs/research/upstream-sources.md` | Upstream research registry | RESEARCH | stays in place | PRESERVE | Correctly scoped. | none |
| `research/codex/sources.md` | Codex research source provenance | RESEARCH | stays in place | PRESERVE | Correctly scoped. | none |
| `research/codex/capability-matrix.md` | Detailed Codex capability research | RESEARCH | stays in place | PRESERVE | Correctly scoped. | none |
| `research/codex/gaps.md` | Codex/Nexo gap analysis | RESEARCH | stays in place | PRESERVE | Correctly scoped. | none |
| `research/codex/probes/*.md` (4 files: `agents-md-0.160.0.md`, `skills-0.160.0.md`, `generated-skill-0.160.0.md`, `custom-agent-roles-0.160.0.md`) | Bounded local runtime observation reports | RESEARCH | stays in place | PRESERVE | Correctly scoped, each already separates OBSERVED/INFERRED/NOT ESTABLISHED. | none |
| `research/codex/probes/c4c-runtime-r5-f2-0.160.0.md` | R0-F frozen C4-C attempt record (added this phase) | RESEARCH | stays in place | PRESERVE | Current authoritative C4-C status source; already cross-referenced from `docs/adapters/codex.md`. | `docs/adapters/codex.md` |
| `core/policies/precedence.md` | Canonical precedence Policy | NORMATIVE | stays in place | PRESERVE | Authoritative owner for precedence; see duplication findings below. | none |
| `core/policies/completion.md` | Canonical completion-status Policy | NORMATIVE | stays in place | PRESERVE | Authoritative owner for completion reporting; see CONFLICT finding below. | none |
| `core/policies/delegation.md` | Canonical delegation Policy | NORMATIVE | stays in place | PRESERVE | Authoritative owner for delegation; see duplication findings below. | none |
| `core/policies/scope-control.md` | Canonical scope-control Policy | NORMATIVE | stays in place | PRESERVE | Correctly scoped; no duplication found elsewhere at the same level of detail. | none |
| `core/policies/self-improvement.md` | Canonical self-improvement Policy | NORMATIVE | stays in place | PRESERVE | Authoritative owner for the promotion gate; see duplication findings below. | none |
| `core/policies/evidence.md` | Canonical evidence Policy (E0–E4) | NORMATIVE | stays in place | PRESERVE | Authoritative owner for evidence classes; already correctly the sole source (R0 initially mis-assessed this as undefined — it is defined here). | none |

## No stale-authority duplication (R1-A.14)

| Norm | Authoritative owner | Secondary explanation(s) | Note |
|---|---|---|---|
| Precedence | `core/policies/precedence.md` | `docs/shared-runtime.md` (explicitly cites the policy by relative link); `docs/adapters/codex-translation-contract.md` §5 (restates the same 8-level list inline, **without** an explicit link back to `core/policies/precedence.md`) | Not a conflict — the two lists are identical in substance — but the translation contract's restatement should eventually cite the policy explicitly instead of duplicating its text. Not corrected in R1-A. |
| Completion | `core/policies/completion.md` (Policy) **and** `core/schemas/common.schema.json`'s `completionStatus` enum (schema) | `docs/schema-system.md`, `docs/concepts/contracts.md` (both correctly cite the 6-value schema enum) | See CONFLICT below: the Policy and the schema do not list the same values. |
| Delegation | `core/policies/delegation.md` (Policy) and `core/schemas/agent.schema.json` (dimensional authority) | `docs/concepts/agents.md`, `docs/canonical-format.md` | Consistent; ADR 0004/0005's Codex delegation crosswalk is a target-specific application, not a duplicate definition. |
| Self-improvement | `core/policies/self-improvement.md` | `docs/continuous-improvement.md` (explicitly disclaims competing authority), `docs/lifecycle.md`, `docs/concepts/task-observer.md` | Already disciplined: every secondary mention is advisory and consistent. Cited here as the pattern other merges should follow. |

## Conflicts

1. **Completion-status vocabulary mismatch (Policy vs. schema).** `core/policies/completion.md` enumerates exactly five completion states: `PASS`, `FAIL`, `BLOCKED`, `INCOMPLETE`, `ESCALATION_REQUIRED`. `core/schemas/common.schema.json`'s `completionStatus` enum (the machine-validated source consumed by `Contract.spec.allowedStatuses`) defines **six** states, adding `READY`. `docs/schema-system.md` and `docs/concepts/contracts.md` both correctly cite the six-value schema enum, so the documentation is internally consistent with the schema — the discrepancy is between the Policy text and the schema itself. This may be an intentional scope difference (`READY` could be a Contract/workflow-instance state rather than a value an agent self-reports via the Completion Policy), but that distinction is not stated anywhere. **Not resolved here.** This is left as a CONFLICT for a later decision (R1-B or later) rather than silently edited in either direction.

2. **Complexity vocabulary mismatch (schema vs. organizational model) — CLARIFICATION, not blocking.** `core/schemas/observation.schema.json`'s `spec.complexity` enum is `["BOUNDED", "COMPLEX"]`, matching `core/directives/execution-protocol.md`'s (NEP-1) "Initial complexity model: BOUNDED, COMPLEX." [`docs/model/work-lifecycle.md`](../model/work-lifecycle.md) (R1-C) introduced a three-value organizational Complexity dimension (`TRIVIAL`, `BOUNDED`, `COMPLEX`) for Classify, without noting that the Observation schema only tracks two of those three values. This is not a contradiction of meaning — `TRIVIAL` work can still be recorded as `BOUNDED` at the Observation-schema level — but it is an unremarked vocabulary gap between an organizational-model dimension and the one existing schema field with a related name. Recorded here as a CLARIFICATION for a later phase; neither `work-lifecycle.md` nor the schema is changed by this finding.

No other real contradiction was found. Everything else marked MERGE is a structural consolidation candidate, not a substantive disagreement.

## Summary counts

```text
PRESERVE:    31
MERGE:        9
REFINE:       2
SUPERSEDE:    0
RELOCATE:     0
STATUS_ONLY:  3
NO_CHANGE:    1
CONFLICT:     1
```

(`docs/schema-system.md` is counted once, under PRESERVE, as the designated merge target for `docs/canonical-format.md`; `docs/validation.md`'s NO_CHANGE is counted separately from PRESERVE to match the requested disposition vocabulary exactly.)

## R1-B update (2026-10-07)

`docs/model/charter.md` and `docs/model/vocabulary.md` were created and are ACTIVE, reconciling `docs/principles.md` and `docs/terminology.md` as described in their updated matrix rows above. Both old documents remain fully preserved with a visible authority note; neither was deleted or marked fully superseded, since not all of their content has an individually confirmed technical-term cross-walk yet. The completion-status `READY` CONFLICT from R1-A was deliberately left **DEFERRED** — R1-B did not touch `core/policies/completion.md` or `core/schemas/common.schema.json`. This update does not make this audit a normative source; it remains a reconciliation record.

## R1-C update (2026-10-07)

`docs/model/work-lifecycle.md` and `docs/model/operations-orchestration.md` were created and are ACTIVE. `work-lifecycle.md` reconciles the build-lifecycle half of `docs/lifecycle.md` (the improvement-lifecycle half remains deferred to the future `learning-evolution.md`) and explicitly maps its master lifecycle stages against NEP-1's canonical stages, elaborating rather than replacing `core/directives/execution-protocol.md`. `operations-orchestration.md` reconciles `docs/orchestration.md` in full and `docs/execution-model.md`'s operational-use-in-the-control-loop only (its full progressive-disclosure context model remains deferred). All three legacy documents (`docs/lifecycle.md`, `docs/execution-model.md`, `docs/orchestration.md`) are preserved in full with visible authority notes; none was deleted or marked fully superseded. The completion-status `READY` conflict from R1-A/R1-B remains **DEFERRED**: `work-lifecycle.md` reuses the word "READY" only as an Intake-outcome label and explicitly states it is a different concept from the schema's `completionStatus` enum value of the same name — `core/policies/completion.md` and `core/schemas/common.schema.json` were not touched. The F2 concurrency observation was cited in `operations-orchestration.md` only as a bounded lesson about event correlation; C4-C remains INVALID/FROZEN. This update does not make this audit a normative source; it remains a reconciliation record.

## R1-D update (2026-10-07)

`docs/model/knowledge-experience.md` was created and is ACTIVE, reconciling `docs/shared-runtime.md`'s scopes, Adaptation Envelope, and boundary rules, and developing Experience Record, Knowledge lifecycle (ACTIVE/CHALLENGED/STALE/SUPERSEDED/INVALIDATED/EXPIRED), confidence, contradiction handling, and a conceptual (not yet normalized) gap taxonomy that `docs/shared-runtime.md` never had. `docs/shared-runtime.md` is preserved in full with a visible authority note; its hand-off to a future Learning/Evolution reconciliation remains pending (`docs/continuous-improvement.md` and `docs/concepts/task-observer.md` were read for consistency but intentionally left unchanged, per R1-D's scope). A new CLARIFICATION finding (complexity vocabulary: schema `BOUNDED`/`COMPLEX` vs. `work-lifecycle.md`'s `TRIVIAL`/`BOUNDED`/`COMPLEX`) was recorded in the Conflicts section above; it is not blocking. The completion `READY` conflict remains **DEFERRED** and untouched. No schema, policy, directive, observer, adapter, or research file was modified. This update does not make this audit a normative source; it remains a reconciliation record.

## What this audit does not do

- It does not create any of the 14 planned `docs/model/*.md` documents; only `docs/model/README.md` exists as of this audit.
- It does not move, merge, or delete any existing file.
- It does not resolve the completion-status CONFLICT.
- It does not change `core/policies/*`, `core/schemas/*`, any ADR, or any adapter implementation.
