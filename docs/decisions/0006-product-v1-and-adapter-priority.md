# ADR 0006: Product V1 Scope and Adapter Priority

- **Status:** Accepted
- **Date:** 2026-10-12
- **Deciders:** Responsible person (explicit approval recorded in the NexoHarness governance conversation)
- **Related:** ADR 0003, Codex target surface; ADR 0004, Codex adapter translation contract; R2-F decision docket DKT-01–06; R2-G independent consolidation review

## Context

R2-F left the product V1 claim boundary and target priority as decisions for the responsible person. Existing repository guidance and ADR 0003 document Codex as the first target, while the strategic direction supplied for R2 records Kilo Code before Claude Code. The product goal is to validate a useful, harness-neutral canonical model through a bounded adapter and product-certification target, without requiring an Installer, Observer, or governed Promotion runtime first.

The six R2 docket decisions were explicitly approved together. This ADR records those decisions and resolves the product-priority conflict. It is a governance record only: it does not authorize implementation, R3, roadmap changes, installation, runtime, or release work.

## Decision

### DKT-01 — Product V1 scope

The first product V1 is **Canonical Model + Kilo Code Adapter V1**. Its claim is:

> NexoHarness V1 demonstrates that one harness-neutral canonical source can be validated and translated deterministically, safely, and verifiably to Kilo Code while preserving semantics, authority, provenance, and eligibility gates.

V1 excludes a generic Installer, operational Task Observer, automatic Promotion, runtime certification, and adapters for other harnesses.

### DKT-02 — Product and certification target priority

The product target order is **Kilo Code first, Claude Code second**. Codex work is retained as prior experimental and model-validation work, but Codex is no longer the product-priority or first product-certification target. Existing Codex artifacts and implementation are preserved; this decision does not authorize their removal or further implementation.

ADR 0003 remains the accepted record of the Codex Local CLI 0.160.0 research snapshot and the design context in which that work began. Its future product-order implication is superseded by this ADR. The R2-F and earlier audit records remain historical evidence of the state and decisions at their respective baselines.

### DKT-03 — Bundle eligibility

When a distribution assembler is authorized and designed, one aggregate, fail-closed eligibility gate will own bundle eligibility. Eligibility must account for the complete selected artifact set and preserve diagnostics. A preview cannot be implicitly promoted to an eligible bundle. This decision selects the owner and governing boundary; it does not define or implement the gate API.

### DKT-04 — Distribution intent

The initial distribution direction is local, deterministic, and bounded to the supported Kilo Code target. A generic publication/signing infrastructure is excluded for now. Artifact completeness, supported paths, hashes, and provenance must be specified for the selected local target before any distribution capability is implemented. This decision does not authorize such implementation.

### DKT-05 — Installation scope and reconciliation

The initial installation design, if separately authorized, will use one explicit scope and fail closed. Unknown ownership or a collision means no modification. Multiple scopes, automatic discovery, complex merges, sophisticated rollback, and uninstallation are outside this initial decision. No Installer, file mutation, or installation design work is authorized by this record.

### DKT-06 — Observer and Promotion

Operational Task Observer and automatic Promotion are excluded from the first V1. Their schemas and conceptual model are retained. Runtime identity, collection/privacy controls, evidence storage, approval authority, and promotion are deferred until after the Kilo target is stabilized and a separate use case and authorization exist.

## Reconciliation with prior direction

This decision sets product and certification priority; it does not erase the Codex research/adapter work or change the harness-neutral sibling-adapter architecture. Existing references that call Codex the first product or certification target are superseded to the extent they assert future priority. `ROADMAP.md` is intentionally unchanged and still contains the previous Codex-led schedule; a separate, explicitly authorized roadmap reconciliation is required before treating its sequence as the plan for this accepted product direction.

## Consequences

### Positive

- **POS-001:** A concrete and bounded product V1 is selected without making Installer or Observer a prerequisite.
- **POS-002:** Kilo Code is now the explicit first product target; Claude Code follows.
- **POS-003:** Existing Codex work remains available as research and validation evidence.
- **POS-004:** Bundle eligibility and installation safety principles are selected before any later design or implementation authorization.

### Negative

- **NEG-001:** Existing roadmap sequencing and some historical documents still describe Codex first until separately reconciled.
- **NEG-002:** Codex work is not the product-priority adapter, which may require explicit separation of research artifacts from future product-certification evidence.
- **NEG-003:** The local Kilo distribution boundary still needs target-specific path, completeness, hash, and provenance requirements before implementation can be proposed.

## Alternatives considered

### Keep Codex as first product target

- **ALT-001:** Preserve Codex as first product and certification target because it has existing research and adapter implementation.
- **ALT-002:** Rejected by the responsible person in favor of Kilo Code first, while retaining Codex work as prior research and validation.

### Include installation or Observer in the first V1

- **ALT-003:** Make installation, runtime observation, or Promotion part of the first V1.
- **ALT-004:** Rejected because those capabilities add independent ownership, runtime, privacy, evidence, and filesystem gates that are not needed to demonstrate the selected model-plus-adapter claim.

### Generic multi-platform distribution

- **ALT-005:** Design a universal distribution/signing channel before choosing a target scope.
- **ALT-006:** Deferred in favor of a local, deterministic, Kilo-bounded direction.

## Authorization boundary

- **AUTH-001:** This ADR records approved governance decisions only.
- **AUTH-002:** It does not formally close R2 or authorize implementation, code or test changes, R3, roadmap edits, Installer work, Observer/Promotion runtime, product release, or certification claims.
- **AUTH-003:** Any roadmap reconciliation or technical design/remediation requires its own explicit scope and authorization.

## References

- **REF-001:** [ADR 0003: Codex V1 Target Surface](0003-codex-target-surface.md)
- **REF-002:** [R2-F: Consolidated Semantic Audit and Decision Matrix](../reviews/r2-f-consolidated-semantic-audit-decision-matrix.md)
- **REF-003:** [R2-G: Independent Consolidation Review](../reviews/r2-independent-consolidation-review.md)
