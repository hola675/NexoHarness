# Kilo Code K0 research

**Status:** K0 research record; not an adapter, support declaration, or certification.

## Verdict

**K0 RESEARCH COMPLETE WITH A SCOPE QUESTION FOR K1.** The target release is pinned to official Kilo Code `v7.8.8`, tag commit `e2887f08e5a6394299c810ba508f358aaf4c5bc3` (released 2026-10-07). The official release covers both the CLI and current VS Code extension. This report inventories both surfaces where documented; it does not claim feature parity. The product certification client (CLI versus VS Code extension) remains to be selected before K1 can define a concrete contract. This is not a target-baseline failure: the research baseline itself is reproducible.

No local installation, authentication, credential use, live configuration change, or probe was performed. No target files were generated. Official docs and source at the pinned tag were inspected on 2026-10-13.

## Scope and authority

This work follows ADR 0006 and the R2 closure: Kilo Code is the first product target; the canonical model remains neutral; K0 authorizes research only. Codex work was consulted for method, not copied as a target design. No K1, R3, adapter implementation, schema change, roadmap change, tag, release, or product certification is authorized by this record.

The report distinguishes canonical semantics from Kilo surfaces and keeps capability, provider, authority, permission, and enforcement separate. Target configuration proves a mechanism exists, not that a particular action is authorized in a specific session or deployment.

## Files

- [Capability matrix](capability-matrix.md) — target surfaces, 13-Kind dispositions, and enforcement assessment.
- [Source ledger](source-ledger.md) — source provenance, pinned version, claims and confidence.

## Main findings

- Kilo provides Markdown instructions/rules, custom agent definitions, reusable skills, slash-command procedures, tools, MCP configuration, configurable permissions, and interactive/autonomous CLI operation.
- Many controls are policy/configuration-mediated and can be widened by project/global configuration or autonomous modes. A prompt or instruction is advisory; it is not enforcement.
- Kilo does not supply Nexo's canonical authority model, provider-neutral capability contract, profile semantics, evaluation/certification evidence, Observation governance, or proposal approval process.
- `--auto`, saved allow rules, and effective permissions require environment-specific review. K0 does not certify their security for any Nexo distribution.
- Kilo has project/session context and optional semantic code indexing. This does not constitute Nexo Shared Runtime or Nexo-owned observation.
- Feature availability and exact behavior can change after `v7.8.8`; any later design must re-check the selected surface against its pinned release.

## Evidence limits and next gate

The findings rely on official documentation and source at the pinned release. No behavior probe was run. Documentation does not establish deployment-specific effective configuration, platform parity, model/provider availability, organizational overrides, or every enforcement edge case. Those remain `NEEDS_PROBE` where material (see matrix).

A future K1 decision must select the initial product client (CLI or VS Code extension), supported operating systems, configuration ownership/scope, and whether project-controlled permissions are eligible. K1 is not started by this report and requires separate authorization.

## Provenance and reuse

All external source identifiers and inspected dates are recorded in the [ledger](source-ledger.md). Official Kilo Code source repository is MIT-licensed at the pinned tag. No code, prompts, or extended documentation text were copied into NexoHarness.

Codex methodology reused: pin a target version, classify translation and loss, separate capability from provider and permission from authority, preserve provenance, fail closed for missing evidence, and distinguish renderable from deployable. Codex paths, config fields, renderer, CLI assumptions, and target-specific IR were not reused.
