# NexoHarness Charter

Status: ACTIVE. This is the organizational/system constitution for NexoHarness. It is reconciled from, and supersedes as *organizational* framing, the principles previously stated only in [`docs/principles.md`](../principles.md); that document is preserved and cross-referenced, not deleted (see its authority note).

**Charter is not Core Directive.** [`core/directives/core-directive.md`](../../core/directives/core-directive.md) (`NH-CORE`) is the canonical, machine-relevant behavioral constitution inherited by every NexoHarness-controlled coding agent. This Charter is the organizational/system constitution: it explains what NexoHarness is and why it is shaped this way. Neither replaces the other; where they overlap (evidence, scope, provenance), the Core Directive and its policies remain the enforceable source and this Charter only frames them.

## Identity

NexoHarness is an open source, portable, verifiable and self-evaluating engineering system for coding agents, defined from a single harness-neutral canonical source.

## Mission

NexoHarness **defines, coordinates, adapts, verifies, learns, and evolves under governance**. It does not silently self-modify: every one of those verbs operates inside the boundaries already established by `core/policies/*` and the Core Directive — none of them grants itself new authority by being performed.

## Target strategy

Target priority is **1. Codex, 2. Claude Code, 3. Kilo Code**. Targets **consume** canonical semantics through adapters; they do not define them. No target implementation becomes the source for another target, or for canonical behavior itself.

## Organizational functions

NexoHarness organizes its work around functions, not mandatory Agents. A function may be realized by a canonical Agent, a workflow, a skill, or no dedicated runtime construct at all — the function describes a responsibility area, not a required implementation:

- **Governance** — precedence, approval, promotion and certification.
- **Workforce** — organizational Roles and their demonstrated Competencies (see [Vocabulary](vocabulary.md)).
- **Operations** — orchestration, execution, capability provisioning.
- **Knowledge** — validated, reusable contextual information.
- **Experience** — recorded operational evidence.
- **Learning & Evolution** — hypotheses and proposed changes derived from Experience.
- **Assurance** — verification, review, evaluation and certification.

## Founding operational divisions

As an initial conceptual organizational structure — not a schema, not a directory, not a canonical Kind — NexoHarness recognizes three founding divisions: **Engineering**, **Product & Design**, and **Editorial**. These are a conceptual grouping of future Roles and Competencies, nothing more.

## Growth principle

**Train before hiring.** Before adding structure, prefer the smallest sufficient step:

```text
understand → reuse Knowledge → improve routing → train existing Role
→ improve existing Competency → add Competency → add Role if justified
→ add Division exceptionally
```

## Minimality

NexoHarness optimizes for quality, correctness, simplicity, reuse, verification, portability and adaptability — **not** for the number of Agents, Skills, Workflows or integrations. More structure is not automatically better structure.

## Source-of-truth principle

There is one canonical, harness-neutral source. Target artifacts, runtime evidence, and generated output are never silently promoted into canonical source; see [`docs/source-of-truth.md`](../source-of-truth.md).

## Improvement principle

Canonical change follows `evidence → proposal → evaluation → comparison → approval → promotion` (`core/policies/self-improvement.md`). No step short-circuits into canonical promotion by itself.

## Authority principle

Experience, Capability, Skill, confidence, or provider availability **are not Authority**. Authority is dimensional and governed separately by `core/policies/precedence.md` and the canonical Agent authority model (`docs/concepts/agents.md`).

## Verification principle

No completion claim without evidence appropriate to the claim and its risk (`core/policies/completion.md`, `core/policies/evidence.md`).

## External-source principle

External repositories are research sources, not runtime dependencies, until explicitly adapted with recorded license, provenance and attribution (`docs/research/methodology.md`).

## Scope of this Charter

This Charter states constitutional commitments. It does not specify Capability resolvers, Evaluation matrices, installer reconciliation, or workflow state machines — those remain owned by their respective technical documents under `docs/concepts/`, `docs/adapters/`, and future `docs/model/` documents listed in [the model README](README.md).
