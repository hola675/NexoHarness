# Kilo Desktop-only target — design spec

**Status:** Proposed for review; no implementation authorized by this document alone.
**Date:** 2026-10-18
**Decision basis:** User instruction to make Kilo Desktop on Windows the sole active Kilo surface.
**Current boundary:** ADR 0008 permits research and non-deployable preview only; runtime certification and installation remain gated.

## 1. Goal

Make Kilo Desktop on Windows the only active Kilo target in NexoHarness. Avoid selecting or accidentally generating output for the Kilo VS Code extension. Preserve the existing harness-neutral canonical source and keep every Desktop result non-deployable until Desktop-specific runtime evidence and an explicit later authorization exist.

## 2. Current state

- `adapters/kilo/model.ts` still declares `vscode-extension` / Windows / `7.8.8` as the default target.
- `adapters/kilo/target.ts`, `tools/kilo/preview.ts`, and `adapters/kilo/install-preflight.ts` accept both Desktop and VS Code.
- The K1 translation dispositions and translation contract were designed for the VS Code extension, not Desktop.
- Skill candidate preview, bundle generation, and read-only preflight already exist. They do not install target files or establish runtime behavior.
- ADR 0008 makes Desktop the primary research surface, requires an explicit Desktop version, and keeps previews non-deployable. It still retains VS Code as a separate research surface; this proposal narrows active support further.

## 3. Proposed behavior

### 3.1 Target identity

- The active Kilo target is exactly `{ client: "desktop", platform: "windows", version: <explicit version> }`.
- Do not supply a Desktop default version or reuse the VS Code `7.8.8` version/source commit.
- Missing or malformed versions produce blocking diagnostics. A syntactically valid explicit version still carries `VERSION_EVIDENCE_REQUIRED` until exact Desktop version evidence is recorded.
- VS Code target selection is rejected with `UNSUPPORTED_CLIENT`; it must not silently fall back to Desktop or any other target.

### 3.2 Translation and preview boundary

- Retain the existing explicitly selected, validated canonical Skill candidate preview as an offline review artifact only.
- Do not treat the VS Code K1 per-Kind disposition table as Desktop evidence. Until Desktop-specific evidence exists, all other Desktop translations with unresolved required semantics remain blocked and emit no usable candidate.
- Every preview/bundle remains deterministic and explicitly non-deployable. `deploymentEligible` remains `false`, including for a syntactically valid Desktop version.
- The preflight accepts only Desktop review bundles and continues to perform read-only validation. It is not an installer and does not authorize writing to Kilo directories.

### 3.3 CLI and compatibility

- The active preview CLI targets Desktop only, requires `--version` and `--skill`, and rejects `--client vscode-extension`. The CLI may accept `--client desktop` for explicitness, but no client flag may enable another surface.
- Keep the output target identity explicit even if Desktop becomes the CLI default.
- Existing Kilo VS Code K0/K1/K2 research, reviews, and source evidence remain preserved as historical records. They do not imply active VS Code support or Desktop runtime parity.
- Add an append-only successor ADR to ADR 0008 recording the Desktop-only active target decision; update the current roadmap and Kilo adapter status to reference it. Do not rewrite ADR 0008 or historical review reports.

## 4. Safety and non-goals

This change does not install Kilo Desktop, generate files in its profile, change permissions or approval modes, configure providers/MCP/credentials, conduct runtime probes, or claim certification. It does not implement Desktop Agents, Rules, Workflows, permission mappings, global skill deployment, installer/rollback behavior, or automatic version discovery. Runtime experimentation requires a separately approved isolated Windows plan and independent evidence review.

## 5. Affected surface

Expected implementation scope: `adapters/kilo/model.ts`, `target.ts`, Kilo compile/preview boundaries, `install-preflight.ts`, `tools/kilo/preview.ts`, associated tests and package CLI usage, `docs/adapters/kilo.md`, Desktop preview documentation, roadmap, and a new successor ADR. Historical research and review artifacts remain intact.

No source changes are made by this spec. The exact minimal file list and API migration details belong in the implementation plan after this spec is approved.

## 6. Acceptance criteria

1. Desktop is the only accepted active client; VS Code selection fails closed in resolver, CLI, bundle preflight, and public adapter entry points.
2. Desktop version must be explicitly supplied and never inherits the VS Code version or commit.
3. Explicit Desktop versions retain `VERSION_EVIDENCE_REQUIRED`; malformed/missing versions block.
4. Existing Skill previews remain deterministic and offline, and every Desktop output remains non-deployable.
5. No VS Code K1 translation/evidence is represented as Desktop capability or enforcement evidence.
6. The roadmap, adapter status, CLI documentation, and successor ADR agree on Desktop-only active scope and historical VS Code status.
7. Tests cover unsupported VS Code selection, version validation/evidence diagnostics, Desktop-only preflight, deterministic preview, and fail-closed unsupported semantics.
8. The implementation adds no installer, target-profile write, permission/provider mutation, or runtime certification claim.

## 7. Validation expectations

Run focused Kilo target/preview/preflight tests first, then typecheck, repository/schema/integrity validation, and the complete `npm test` suite. Review the diff to ensure no historical source/review record was rewritten and no generated `dist/` files were edited.

## 8. Self-review

- **Scope:** one active target policy and its existing preview/preflight interface; no installation or runtime behavior.
- **Consistency:** Desktop identity remains explicit while evidence and deployability remain false, matching ADR 0008's safety boundary.
- **Historical integrity:** prior VS Code evidence is retained but no longer controls active target selection.
- **Unresolved implementation choices:** whether to remove the `--client` flag or accept only `desktop`; how to represent blocked non-Skill Kinds in existing compiler APIs. Resolve these in the implementation plan without widening the safety boundary.
