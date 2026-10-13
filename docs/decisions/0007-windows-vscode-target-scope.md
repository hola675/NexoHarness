# ADR 0007: Windows + VS Code Target Scope and Harness Priority

- **Status:** Accepted
- **Date:** 2026-10-13
- **Deciders:** Responsible person (explicit authorization recorded in the NexoHarness governance conversation)
- **Related:** ADR 0006, Product V1 Scope and Adapter Priority; ADR 0003, Codex Target Surface; K0 Kilo research

## Context

ADR 0006 established Canonical Model + Kilo Code Adapter V1 and selected Kilo Code first, Claude Code second. The responsible person has since fixed the initial product environment as Windows + VS Code and clarified that the project's two current harness targets are Kilo Code and OpenAI Codex. Claude Code is outside the current target scope. Existing Codex research and adapter work focused on Codex Local CLI and does not establish compatibility with Codex in VS Code.

K0 research is pinned to Kilo Code `v7.8.8` and includes both CLI and VS Code surfaces. This decision selects Windows + VS Code as the initial product surface; it does not rewrite K0's historical evidence or make unverified claims about later Kilo releases. The exact Codex VS Code surface and supported version remain to be researched before any Codex-specific product claim.

## Decision

### Target order and environment

1. **Kilo Code — first product and certification target**, initially on Windows + VS Code. The K0 baseline is Kilo Code `v7.8.8`.
2. **OpenAI Codex — second harness target**, initially on Windows + VS Code. Prior Codex CLI work is preserved as research and experimental/model-validation work; it does not establish Codex VS Code compatibility or certification.
3. **Claude Code — outside the current project target scope.** Historical decisions, research references, and documentation remain preserved as provenance; they do not describe an active target commitment.

Both adapters remain sibling consumers of the same harness-neutral canonical source. The canonical model must not be reshaped around either target.

### Supersession of ADR 0006

This ADR supersedes **only DKT-02 (Product and certification target priority)** in ADR 0006. ADR 0006's DKT-01 and DKT-03 through DKT-06 remain in force without change. ADR 0006 remains the historical record of the decision made on 2026-10-12; it is not rewritten retrospectively.

### Kilo permission boundary

The effective permission contract for Kilo remains open for K1. The current direction is that NexoHarness may declare required constraints and authority but does not grant target permissions. Any future translation must not widen the effective controls of the selected VS Code client and must fail closed when a mandatory restriction cannot be preserved. This records a design constraint for investigation; it does not define or implement a permission mechanism.

## Consequences

- Kilo's first product study and certification surface is Windows + VS Code, pinned to the K0 release baseline until a separately reviewed version decision changes it.
- K1 must distinguish native VS Code behavior from CLI behavior and state any limitations. Kilo CLI observations cannot silently stand in for the VS Code client.
- A future Codex target study must establish the Windows + VS Code surface and version independently. Existing CLI evidence remains useful methodology and historical evidence only.
- `ROADMAP.md`, `AGENTS.md`, and active architecture/status overviews are reconciled to this decision. Historical audit and research records retain the wording and evidence of their original baselines.
- The current target set is Kilo Code and Codex. Claude Code work is deferred outside current scope without deleting its records.

## Alternatives considered

### Keep Claude Code as the second target

Rejected by the responsible person in favor of Codex as the second harness target.

### Treat Codex CLI research as proof of Codex VS Code support

Rejected because the existing research pinned a different surface. Target identity, client, version, and platform must be evidenced separately.

### Preserve a multi-platform initial target

Deferred. Windows + VS Code is the only initial environment selected by this decision; other platforms and clients require later evidence and scope decisions.

## Authorization boundary

The responsible person's 2026-10-13 instruction explicitly authorizes this reconciliation and future phases, including K1. K1 remains a distinct phase and is not initiated by this ADR or its reconciliation commit. This ADR does not itself certify, implement, install, or release an adapter; it does not define the scope of later implementation work or make a certification claim.

## References

- [ADR 0006: Product V1 Scope and Adapter Priority](0006-product-v1-and-adapter-priority.md)
- [Kilo K0 research](../../research/kilo/README.md)
- [Kilo capability matrix](../../research/kilo/capability-matrix.md)
- [Kilo source ledger](../../research/kilo/source-ledger.md)
