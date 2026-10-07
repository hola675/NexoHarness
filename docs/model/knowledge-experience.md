# NexoHarness Knowledge & Experience

Status: ACTIVE. This document defines how NexoHarness converts observed facts into structured Experience and, after sufficient validation, into reusable contextual Knowledge. It reconciles, but does not replace, [`docs/shared-runtime.md`](../shared-runtime.md), which remains preserved and cross-referenced.

**This is not a storage design.** No database, vector store, event bus, storage directory, embedding architecture, or search mechanism is selected here. No Learning/Evolution engine, Task Observer collector, automatic pattern mining, or canonical promotion is implemented here — that boundary, and the hand-off to it, belongs to a later phase (`learning-evolution.md`, currently PLANNED).

## Fundamental boundary

```text
Experience  → what happened
Knowledge   → what is sufficiently supported to help future work
Governance  → what is allowed
Canonical   → what Nexo is defined to mean/do
```

Therefore: **Experience != Knowledge**, **Knowledge != Authority**, **Knowledge != Canonical**. None of the concepts below grant themselves promotion by existing.

## Observation and Experience Record

`Observation` is the existing technical Kind (`core/schemas/observation.schema.json`, `docs/concepts/task-observer.md`): a structured runtime evidence record describing something observed during execution. **Observation has a schema. Observation is not canonical behavior.**

An **Experience Record** is the organizational framing of that evidence: a normalized, scoped representation of operational evidence suitable for later analysis. It may be represented technically by an `Observation`; **no new Kind is created** for it.

Conceptually, an Experience Record may carry: scope, subject, event/result, evidence reference, timestamp/recency information, provenance, confidence (where applicable), and privacy classification (where applicable). No schema is fixed here — the existing `Observation` schema already defines what is technically representable today (see "Known schema note" below).

### Append-oriented principle

Experience should be preferentially **append-oriented**: historical facts are not rewritten simply because later information arrives. New understanding is added as a correction, contradiction, supersession, or invalidation — never a silent overwrite.

### Preserve historical truth

Later knowledge may reinterpret old evidence, but must never silently rewrite what was originally observed. Concretely: the frozen [C4-C R5-F2 record](../../research/codex/probes/c4c-runtime-r5-f2-0.160.0.md) recorded `INVALID`. A future F3 that reaches `PASS` would not retroactively convert F2 into `PASS` — both facts remain true, scoped to their own attempt.

## Experience scope

Conceptual scopes (not a technical enum):

```text
TASK
PROJECT
WORKSTYLE
ORGANIZATION
TARGET
```

- **TASK** — ephemeral information tied to one Assignment (a current finding, a temporary workaround, a current runtime condition). Expires with the task by default unless explicitly promoted to another scope.
- **PROJECT** — architecture conventions, known commands, known failure patterns, project-specific constraints, effective workflows. **Project state stays project-scoped by default.**
- **WORKSTYLE** — observed preferences (validation intensity, preference for bounded changes, reporting style). Always **advisory**, subordinate to explicit current instruction.
- **ORGANIZATION** — aggregated, non-sensitive patterns useful across projects (recurring workflow failures, common remediation patterns, context-efficiency trends). Raw project content is never copied between projects at this scope.
- **TARGET** — observations specific to a target surface (Codex, Claude Code, Kilo Code), including surface, version, and runtime behavior. Never generalized automatically to other harnesses.

### Cross-project privacy boundary

Never transferred globally by default: source code, raw project files, credentials, secrets, customer data, private conversations, proprietary payloads. Cross-project learning prefers normalized structured signals over raw content.

## Knowledge

Knowledge is contextual information sufficiently supported and valid to inform future work within a defined scope. It is distinct from a single Observation, a guess, an inference, a preference, or a canonical rule.

Useful Knowledge should be able to answer: where did this come from, which evidence supports it, which scope does it apply to, how current is it, and has it been contradicted.

### Knowledge lifecycle (conceptual; no schema change)

```text
ACTIVE       — currently useful within its scope
CHALLENGED   — sufficient contradictory evidence exists to reduce confidence or require review
STALE        — no sufficient evidence remains that it is still current (especially for commands, target behavior, provider reliability, project architecture)
SUPERSEDED   — later, better-supported knowledge replaces its practical use; the old record may be preserved historically
INVALIDATED  — later evidence demonstrates the prior knowledge was incorrect within its scope
EXPIRED      — its validity contract or time window ended
```

### Confidence

Conceptual levels: `LOW`, `MEDIUM`, `HIGH`. **`HIGH` confidence is never Authority.** No magical threshold is declared here (e.g. "3 observations = knowledge" or "5 successes = HIGH confidence") — knowledge promotion requires contextual judgment, not an arbitrary count.

### Pattern

A Pattern is a repeated or otherwise meaningful relationship detected across Experience. It should consider supporting evidence, contradictory evidence, scope, frequency, recency, and confidence. **No `Pattern` Kind is created.**

A single Observation can matter — but **a single event is not a recurring pattern**, except where the nature of the event itself justifies a direct conclusion (e.g. a single security-critical failure may still warrant acting on one occurrence).

### Negative knowledge

Knowledge of the form "approach X is known to fail under conditions Y" is permitted, but requires scope, evidence, and conditions. An accidental, unscoped failure must never become a universal prohibition.

### Contradiction model

When two records conflict, neither is silently overwritten. Preserve: claim A, claim B, scope, evidence, recency, confidence, and resolution status. For changing operational facts, current direct evidence is normally preferred over old learned state when scopes are comparable — but this is a practical preference, **not a constitutional precedence rule** (`core/policies/precedence.md` is unaffected).

### Knowledge Candidate

A Knowledge Candidate is a proposed knowledge statement derived from Experience that has not yet met the standard for reusable Knowledge. **No new Kind.**

**Knowledge Candidate != ImprovementProposal.** A Knowledge Candidate proposes what may be true or useful; an `ImprovementProposal` (existing Kind, `core/schemas/improvement-proposal.schema.json`) proposes a change to Nexo's own behavior or system. They are never equivalent.

### Knowledge flow

```text
Event
→ Observation
→ Experience Record
→ Pattern / direct finding
→ Knowledge Candidate
→ Validation
→ Knowledge
```

Not every Observation passes through a Pattern — a single sufficiently significant Observation may directly inform a Knowledge Candidate.

### Knowledge does not require canonical promotion

Contextual Knowledge may remain entirely inside Shared Runtime State. Example: "Project X uses pnpm" does not need to become canonical Nexo behavior.

### Canonical-change boundary

If Knowledge implies changing an `Agent`, `Skill`, `Policy`, `Rule`, `Workflow`, `Capability`, `Profile`, `Enforcement`, or `Evaluation` definition, or Adapter behavior, it must pass through the future Evolution/`ImprovementProposal` lifecycle (`core/policies/self-improvement.md`). It is never modified directly from Knowledge.

## Gap taxonomy (conceptual, not yet normalized)

At least the following gap families are recognized conceptually:

```text
KNOWLEDGE_GAP
CONTEXT_GAP
RETRIEVAL_GAP
ROUTING_GAP
CAPABILITY_GAP
PROVIDER_GAP
MAPPING_GAP
PERMISSION_GAP
AUTHORITY_GAP
OBSERVABILITY_GAP
ENFORCEMENT_GAP
```

**Knowledge Gap != Context Gap.** A Knowledge Gap means required information is genuinely unavailable or insufficiently known. A Context Gap means the information existed but was not loaded for this task. No unified enum is frozen here; a future phase must normalize this taxonomy before any schema is introduced for it.

### Routing failure versus Role gap

Selecting the wrong *existing* Role for a task is a **ROUTING_GAP** (or ROUTING_FAILURE), not automatically evidence of a missing Role. Before proposing a new Role or Agent, routing, Workflow, Contract, Skill, and additional context should be investigated first (consistent with `docs/model/operations-orchestration.md`'s "no agent proliferation").

## Evidence strength

This document reuses, and does not redefine, the existing evidence-strength classification already established in `core/policies/evidence.md` (**E0 — Assertion only** through **E4 — Independent verification**). No parallel taxonomy is introduced.

### Freshness

Knowledge derived from evidence must respect freshness: an old runtime observation is not treated as a current guarantee once the target, configuration, or version has materially changed. Harness observations are always scoped to a specific target, surface, and version (e.g. "Codex CLI 0.160.0" — never "Codex universally"), consistent with `research/codex/`'s existing pinning discipline.

### Fact refresh

Environment/project facts may need re-inspection. Old Knowledge ("uses npm") must be challenged by current direct evidence ("packageManager: pnpm") — current direct evidence does not retroactively erase the old record (append-oriented principle), but it does supersede its practical use.

### Facts versus preferences

Distinguish conceptually: `FACT` (directly observed), `PREFERENCE` (a workstyle choice), `PATTERN` (a detected regularity), `INFERENCE` (a derived, not directly observed, conclusion). `packageManager = pnpm` observed directly is a FACT; "prefer bounded commits" is a WORKSTYLE PREFERENCE. They are not treated as equivalent evidence.

## Performance evidence and the no-leaderboard principle

Experience may record success/failure, retries, remediations, duration, context use, delegations, and workflow path, when observable. **Performance evidence is never Authority.** It must not become a global Agent/Role ranking or a human-style performance leaderboard (`docs/model/operations-orchestration.md`'s existing no-leaderboard principle) — its only legitimate uses are task-class routing, gap diagnosis, and workflow improvement.

**Role statelessness.** Canonical Role/Agent definitions remain stateless definitions; historical performance is never written directly into an Agent definition.

### Competency maturity (conceptual only, explicitly pending)

A future organizational model may describe Competency maturity as `CANDIDATE`, `EXPERIMENTAL`, `PROVISIONAL`, `PROVEN`, `MATURE`, `DEPRECATED`. **This is an explicitly pending conceptual model.** No schema or persistence is created for it in this phase.

## Privacy and retention

Experience should preferentially record structured signals, references, aggregates, and minimal necessary excerpts — not full raw payloads by default. Secrets (passwords, API keys, tokens, private keys, credentials) are **never** stored as Knowledge or Experience.

Raw evidence may be preserved when necessary for reproducibility, but must have scope, provenance, privacy handling, and retention expectations once implemented — none of which is designed here. Different evidence types will likely require different retention; no concrete retention policy is fixed in this phase.

## Cross-harness reuse and target normalization

Nexo learns once and may reuse contextual Knowledge across compatible targets (e.g. a project convention may serve both Codex and Claude Code). Target-specific facts remain target-scoped (e.g. an internal tool-call name observed on one Codex release is not copied as-is into another adapter's assumptions). Before a target-specific signal influences a cross-harness decision, its semantic meaning must be normalized — internal names are never copied between adapters verbatim.

## Runtime Snapshot boundary

Facts such as OS, branch, tool availability, provider state, or installed target version are runtime facts, not canonical behavior. **No `RuntimeSnapshot` schema is created in this phase.**

## Shared Runtime State

Shared Runtime State remains the NexoHarness-owned conceptual location for scoped operational evidence and learned recommendations, outside canonical source (`docs/shared-runtime.md`). No storage is designed here.

### Not a competing authority system

Shared Runtime State remains subordinate to host constraints, Governance, explicit user intent, project instructions, active Workflow, Role responsibility, and applicable Rules/Policies, per `core/policies/precedence.md`.

### Adaptation Envelope (preserved)

```text
CANONICAL ENVELOPE
      ↓
already-allowed choices
      ↓
runtime evidence
      ↓
ranking / recommendation / selection
```

Shared Runtime may rank, recommend, select, or prioritize **only among options already authorized**. It may use evidence to improve Role selection, Workflow selection, Skill selection, context prioritization, and verification planning — always within already-permitted choices.

### What Shared Runtime may never do

It can never autonomously: grant authority, grant permissions, expand scope, weaken verification, change credentials, enable integrations, change adapters, publish releases, or promote itself to canonical behavior.

## Retrieval and context value

Useful Knowledge is selected by scope, relevance, validity, confidence, and recency — never by loading full history. **CONTEXT VALUE != CONTEXT VOLUME** (`docs/execution-model.md`): Shared Runtime does not justify injecting large amounts of history into every task. No search or retrieval mechanism (SQL, vector search, BM25, knowledge graph) is chosen in this phase; a future implementation should select the minimum mechanism that satisfies real requirements.

## Experience-to-Learning boundary

This document ends at validated, scoped Knowledge. It does **not** develop hypothesis generation, evolution proposals, candidate patches, evaluation generation, or promotion — those belong to a later phase (`docs/model/learning-evolution.md`, currently PLANNED).

## Deferred and known notes

- **Persistence is fully deferred.** No database, vector store, event bus, storage directory, or embedding architecture is selected anywhere in this document.
- **Known schema note:** `core/schemas/observation.schema.json`'s `spec.complexity` enum is `["BOUNDED", "COMPLEX"]` (matching NEP-1's "Initial complexity model"), while [`docs/model/work-lifecycle.md`](work-lifecycle.md)'s organizational Complexity dimension uses three values (`TRIVIAL`, `BOUNDED`, `COMPLEX`). This document does not resolve that difference; it is recorded as a CLARIFICATION finding in [`docs/reviews/r1-documentation-authority-audit.md`](../reviews/r1-documentation-authority-audit.md).
- The completion `READY` conflict (R1-A/R1-B/R1-C) is unrelated to this document's content and remains **DEFERRED**; nothing here touches it.
- `core/policies/evidence.md`'s E0–E4 evidence classes are referenced, not redefined.
