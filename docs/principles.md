# Principles

These stable identifiers name the initial NexoHarness principles. They describe intent and expected behavior, not implementation details.

## NH-P001 — Context Before Action

- **Intent:** Gather relevant context before changing or executing anything.
- **Rationale:** Correct action depends on understanding scope, constraints and existing behavior.
- **Applies to:** Agents, workflows, adapters and contributors.
- **Violation example:** Editing a generated file before inspecting its canonical input.

## NH-P002 — Evidence Before Claims

- **Intent:** Support completion and correctness claims with observed evidence.
- **Rationale:** An assertion without verification is not a reliable engineering result.
- **Applies to:** Agents, reviewers, validation and release gates.
- **Violation example:** Reporting tests as passing without running them.

## NH-P003 — Minimum Necessary Change

- **Intent:** Change only what the requested outcome requires.
- **Rationale:** Smaller changes reduce regression risk and make review meaningful.
- **Applies to:** Implementation, remediation and generated output.
- **Violation example:** Refactoring unrelated modules during a documentation fix.

## NH-P004 — Scope Discipline

- **Intent:** Keep work within the declared task and phase boundary.
- **Rationale:** Unbounded work obscures ownership and weakens validation.
- **Applies to:** All project work.
- **Violation example:** Implementing runtime agents during a foundation-only phase.

## NH-P005 — Progressive Disclosure

- **Intent:** Keep core instructions concise and reveal detail when needed.
- **Rationale:** Focused context improves comprehension and reduces instruction load.
- **Applies to:** Documentation, skills, agents and adapters.
- **Violation example:** Putting all specialist procedures into every core instruction file.

## NH-P006 — Independent Review

- **Intent:** Use a separate review perspective for consequential changes.
- **Rationale:** The author is less likely to notice assumptions in their own work.
- **Applies to:** Rules, enforcement, adapters, permissions and promotion.
- **Violation example:** Promoting a security-sensitive change without independent review.

## NH-P007 — Bounded Remediation

- **Intent:** Limit fixes to diagnosed failures and explicit follow-up scope.
- **Rationale:** Remediation should not become uncontrolled redesign.
- **Applies to:** Debugging, reviews and observer proposals.
- **Violation example:** Expanding a one-line fix into an unrequested architecture rewrite.

## NH-P008 — Capability Over Tool

- **Intent:** Specify abstract capabilities instead of vendor or tool names.
- **Rationale:** Canonical behavior must survive provider and harness changes.
- **Applies to:** Agents, profiles, adapters and contracts.
- **Violation example:** Making a canonical agent require a named MCP server.

## NH-P009 — Single Source of Truth

- **Intent:** Author behavior once in the canonical source.
- **Rationale:** Manual duplication drifts and makes parity unverifiable.
- **Applies to:** Canonical definitions and generated adapters.
- **Violation example:** Maintaining separate hand-edited Kilo and Claude agent copies.

## NH-P010 — Generated Output Is Immutable

- **Intent:** Treat generated artifacts as outputs, not authoring surfaces.
- **Rationale:** Manual edits are lost or create untraceable divergence.
- **Applies to:** `dist/` and future installers.
- **Violation example:** Fixing a generated file instead of its canonical input.

## NH-P011 — No Silent Self-Modification

- **Intent:** Prevent autonomous changes to canonical behavior.
- **Rationale:** A failed task is evidence for review, not authorization to rewrite the system.
- **Applies to:** Task Observer and promotion paths.
- **Violation example:** Applying an observer-generated patch without approval.

## NH-P012 — Evidence-Driven Improvement

- **Intent:** Base improvement proposals on structured observations and evaluations.
- **Rationale:** Repeated evidence is stronger than an isolated intuition.
- **Applies to:** Task Observer, evals and review.
- **Violation example:** Promoting a change because it sounds plausible without a regression comparison.

## NH-P013 — Explicit Provenance

- **Intent:** Record the origin, license and adaptation path of external material.
- **Rationale:** Traceability protects the project and preserves credit.
- **Applies to:** Research, adaptations and third-party notices.
- **Violation example:** Copying a procedure without recording its source or license.

## NH-P014 — Graceful Degradation

- **Intent:** Make capability failures visible and bounded rather than silently unsafe.
- **Rationale:** Partial tool availability should not produce false confidence.
- **Applies to:** Resolvers, adapters, workflows and verification.
- **Violation example:** Silently skipping verification when a required capability is unavailable.

## NH-P015 — Harness-Neutral Canonical Behavior

- **Intent:** Keep canonical definitions independent from any harness implementation.
- **Rationale:** Portability is an architectural requirement, not a later migration task.
- **Applies to:** All canonical directories.
- **Violation example:** Encoding a platform-specific hook in a canonical rule.
