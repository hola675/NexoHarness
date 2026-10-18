# Kilo Code Adapter — K1 design boundary

**Status:** K1 translation contract exists; adapter implementation and product certification are not established.

Kilo Code is the **first product and certification target** under [ADR 0007](../decisions/0007-windows-vscode-target-scope.md). Initial supported target scope for design is **Windows + VS Code**, pinned to **Kilo Code v7.8.8** (K0 release commit `e2887f08e5a6394299c810ba508f358aaf4c5bc3`). Kilo CLI evidence cannot establish VS Code client behavior.

The adapter must consume the [harness-neutral canonical source](../source-of-truth.md) independently of Codex. Its prospective generated destination is `dist/kilo/`; no generated files should be manually authored. Neither installer nor runtime observation is part of Kilo V1 under ADR 0006.

## K1 contract

See the existing [K1 translation contract](kilo-translation-contract.md) for the per-Kind translation dispositions, fail-closed permission boundary, evidence requirements, and unresolved VS Code probes. This contract was already present in the repository before this documentation reconciliation.

## Evidence and limitations

- [K0 capability matrix](../../research/kilo/capability-matrix.md) is a research snapshot, not a certified runtime configuration.
- [K0 source ledger](../../research/kilo/source-ledger.md) records official source provenance and evidence confidence.
- No live Kilo VS Code permission, precedence, or filesystem probe has been executed as part of this draft.
- No adapter implementation, installation, release or certification is claimed.
