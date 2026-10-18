# Roadmap

## Current Product Target Priority — ADR 0008

1. **Kilo Code** — first product and certification target for Canonical Model + Kilo Code Adapter V1.
2. **OpenAI Codex** — second harness target, after Kilo Code.

Kilo now prioritizes **Kilo Desktop on Windows** for research and future certification, retaining its VS Code extension as a separate surface. Codex remains a later Windows + VS Code research target. The Kilo VS Code K0 historical baseline is `v7.8.8`, not a Desktop version pin; existing Codex CLI work does not establish Codex VS Code compatibility. Claude Code is outside current target scope; its historical references remain below for provenance. The section order and phase identifiers remain historical and do not define current priority. [ADR 0008](docs/decisions/0008-kilo-desktop-primary-surface.md) governs Kilo surface priority, superseding the relevant portion of ADR 0007; ADR 0006 continues to govern DKT-01 and DKT-03–06.

K1 — define the Kilo Code translation contract for Windows + VS Code using the pinned K0 evidence — is authorized by the responsible person's 2026-10-13 instruction covering this and future phases. It is not part of this roadmap reconciliation and is not started here. K1 must resolve the permission boundary described in ADR 0007.

## Foundation

- 0.0 Repository constitution — COMPLETE
- 0.0.5 Core Directive & Execution Model — COMPLETE
- 0.1 Canonical schemas — CERTIFIED
- 0.1.5 Versioning & Release Automation — CERTIFIED
- 0.2 Validation Framework & Reference Integrity — CERTIFIED
- 0.3 Orchestration, Shared Runtime & Continuous Improvement Architecture — CERTIFIED

## Codex Target — Prior Research and Historical Milestones

- 1.0 Codex capability matrix — CERTIFIED (completed historical milestone)
- 1.1 Codex adapter — IN PROGRESS (historical status at ADR 0006); retained as prior experimental and model-validation work, not the product-priority adapter. This reconciliation does not authorize continuation.
- 1.2 Codex installer / uninstaller / doctor — outside the accepted product V1 scope
- 1.3 Isolated Codex fixture — outside the accepted product V1 scope

## Behavior Core

- 2.0 Principles
- 2.1 Contracts
- 2.2 Rules
- 2.3 Bounded workflow
- 2.4 Complex workflow

## Agents / Orchestration

- 3.0 Core agent architecture
- 3.1 Context
- 3.2 Planning
- 3.3 Implementation
- 3.4 Review
- 3.5 Remediation
- 3.6 Verification
- 3.7 Specialists

## Skills

- 4.0 Skill schema
- 4.1 Core skills
- 4.2 Progressive disclosure
- 4.3 Capability routing

## Task Observer

- 5.0 Observation schema
- 5.1 Collectors
- 5.2 Pattern analysis
- 5.3 Improvement proposals
- 5.4 Eval generation
- 5.5 Promotion gate

## Certification — historical phase numbering retained

- 6.0 Structural certification
- 6.1 Behavioral certification
- 6.2 Codex integration certification — not the first product certification target
- 6.3 Rollback certification
- 6.4 Codex V1 — superseded as the first product V1 by ADR 0006

## Claude Code — Historical Direction, Outside Current Scope

- 7.0 Claude capability matrix
- 7.1 Claude adapter
- 7.2 Claude enforcement translation
- 7.3 Codex / Claude cross-harness parity
- 7.4 Claude V1

## Kilo Code — First Product and Certification Target (Windows Desktop primary; VS Code secondary)

- 8.0 Kilo capability matrix
- 8.1 Kilo adapter
- 8.2 Kilo enforcement translation
- 8.3 Cross-harness parity
- 8.4 Kilo V1
