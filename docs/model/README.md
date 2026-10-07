# NexoHarness Model

## Purpose

`docs/model/` is the organizational and system-level architecture frontier for NexoHarness. It explains how NexoHarness is organized as a system — organization, canonical model, operations/control plane, adapters, distribution, target runtime, experience, learning/evolution and governance/promotion — at a level above any single canonical Kind, ADR or adapter.

> `docs/model/` defines NexoHarness organizational and system semantics. It does not replace the technical canonical Kind definitions, schemas, ADR history or target-specific adapter contracts.

## Authority boundary

`docs/model/` is **NORMATIVE for organizational/system framing**, not a canonical authoring surface:

- It does not define new canonical Kinds, schemas, or runtime behavior.
- It cannot introduce, widen, or override authority, enforcement, or precedence. `core/policies/*` remain the authoritative owners of precedence, completion, delegation, self-improvement and evidence whenever a model document discusses them; a model document may only explain or contextualize a Policy, never redefine it incompatibly.
- It cannot invalidate an accepted ADR. A model document that appears to conflict with an accepted ADR is a reconciliation finding, not an implicit supersession — see [`docs/reviews/r1-documentation-authority-audit.md`](../reviews/r1-documentation-authority-audit.md).
- It introduces no new top-level technical directories (`core/`, `agents/`, `skills/`, `rules/`, `workflows/`, `capabilities/`, `profiles/`, `enforcement/`, `evals/`, `observer/`, `installer/`, `adapters/`, `research/`, `tests/`, `tools/` are unaffected).

## Relationship to other documentation roots

| Root | Role | Relationship to `docs/model/` |
|---|---|---|
| `docs/model/` | Organizational / system architecture | Explains why the system is shaped this way and how its layers relate. |
| `docs/concepts/` | Technical canonical Kind semantics | Authoritative for what each of the 13 canonical Kinds (Directive, Policy, Agent, Skill, Rule, Workflow, Contract, Capability, Profile, Enforcement, Evaluation, Observation, ImprovementProposal) means and how it behaves. `docs/model/` may reference a Kind by name but never redefines its schema-validated semantics. |
| `docs/decisions/` (ADRs) | Historical architectural decisions | Authoritative, append-only history of what was decided and why, at the time it was decided. `docs/model/` describes the current reconciled architecture; it does not rewrite or supersede ADR text. A new decision that changes an accepted ADR's conclusion still requires its own ADR. |
| `docs/reviews/` | Independent review records | Authoritative record of independent review outcomes (e.g. C4-B1, the R1 documentation authority audit). `docs/model/` content is not itself an independent review. |
| `docs/adapters/` | Target-specific architecture/status | Authoritative for a specific target's (Codex, Claude Code, Kilo Code) current implementation state and target-specific constraints. `docs/model/` describes target order and the adapter boundary in general; it defers target-specific detail to `docs/adapters/`. |
| `core/schemas/`, `core/policies/`, `core/directives/` | Machine-validated canonical source | Strongest authority for anything schema-validated or policy-governed. A model document explains intent; it never substitutes for a schema or policy when behavior needs machine-validatable representation. |
| `research/` | Empirical/research evidence | Authoritative for what was actually observed against a real target. `docs/model/` may cite research findings but does not itself perform or claim research evidence. |

## Document map

The following model documents are the approved set for this frontier. Documents marked **PLANNED** are not created as empty placeholders; each is authored only in the phase that actually writes its content, to avoid speculative, unreviewed structure.

- [`charter.md`](charter.md) — **ACTIVE.** Mission, scope and non-goals of NexoHarness as an organization/system.
- [`vocabulary.md`](vocabulary.md) — **ACTIVE.** Organization-facing vocabulary (Role, Competency, Handoff, Division) and its explicit relationship to existing technical terminology in `docs/terminology.md` and `docs/concepts/directives.md`.
- [`work-lifecycle.md`](work-lifecycle.md) — **ACTIVE.** How work moves through NexoHarness at the organizational level, building on `docs/lifecycle.md`'s build lifecycle.
- `knowledge-experience.md` — **PLANNED.** Organizational view of shared operational knowledge, building on `docs/shared-runtime.md`.
- `learning-evolution.md` — **PLANNED.** Organizational view of continuous improvement, building on `docs/continuous-improvement.md` and `core/policies/self-improvement.md`.
- `workforce.md` — **PLANNED.** Organizational Role concept and its explicit, non-schema relationship to the technical Agent Kind.
- `governance-authority.md` — **PLANNED.** Organizational governance and authority framing, explicitly subordinate to `core/policies/precedence.md` and the other `core/policies/*` entries.
- `assurance-certification.md` — **PLANNED.** Organizational view of evidence and certification, building on `core/policies/evidence.md` and `core/policies/completion.md`.
- `capability-runtime.md` — **PLANNED.** Organizational view of capability provisioning, building on `docs/concepts/capabilities.md`.
- [`operations-orchestration.md`](operations-orchestration.md) — **ACTIVE.** Organizational control-plane view, building on `docs/orchestration.md` and `docs/execution-model.md`.
- `canonical-information.md` — **PLANNED.** Organizational view of the canonical source of truth, building on `docs/source-of-truth.md` and `docs/canonical-format.md`.
- `profiles-context-configuration.md` — **PLANNED.** Organizational view of context/profile configuration, building on `docs/concepts/profiles.md`.
- `evaluation-quality.md` — **PLANNED.** Organizational view of evidence and quality, building on `docs/concepts/evaluations.md`.
- `distribution-release.md` — **PLANNED.** Organizational view of distribution and release, building on `docs/versioning.md`'s release mechanics.

Each future document must declare, in its own front section, which existing `docs/concepts/`, `docs/decisions/`, `core/policies/` or `docs/adapters/` material it builds on, and must not restate that material's authority incompatibly. See the full reconciliation findings in [`docs/reviews/r1-documentation-authority-audit.md`](../reviews/r1-documentation-authority-audit.md).

## Technical architecture unaffected

The 13 canonical Kinds (Directive, Policy, Agent, Skill, Rule, Workflow, Contract, Capability, Profile, Enforcement, Evaluation, Observation, ImprovementProposal) are unchanged by this frontier. `docs/model/` does not introduce Role, Competency, Standard or Handoff as schema-validated Kinds. Where this frontier discusses an organizational overlay (Role vs. Agent, Competency vs. Skill, Handoff vs. Contract), that overlay is explanatory only and does not require or imply a schema change.

Target order remains **Codex → Claude Code → Kilo Code**, matching `README.md`, `ROADMAP.md`, `docs/architecture.md`, `docs/schema-system.md` and ADR 0002/0003.
