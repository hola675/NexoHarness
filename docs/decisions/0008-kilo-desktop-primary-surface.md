# ADR 0008: Kilo Desktop as primary investigation surface

- **Status:** Accepted for research and nondeployable preview; certification pending
- **Date:** 2026-10-18
- **Decision:** User-directed change of focus after evaluating the independent Kilo Desktop application.
- **Supersedes:** ADR 0007 only in the Kilo client-surface priority and Windows+VS Code-only assumption; does not change canonical governance, Kilo-first harness priority, or Codex's deferred position.

## Decision

1. Prioritize **Kilo Desktop on Windows** for investigation, capability mapping and the first planned Kilo certification.
2. Retain **Kilo VS Code extension on Windows** as a separate supported research surface; no assumption of feature/permission parity.
3. Maintain one harness-neutral canonical source and one Kilo adapter with explicit client target selection and separately collected evidence.
4. Do not fix Desktop to a historical VS Code version. Desktop requires an explicitly selected version for a preview. Neither target is deployable or certified.
5. Do not install Desktop, change credentials, configure providers/MCP, enable automatic approvals or write generated Kilo artifacts during this phase.

## Evidence and constraints

Official Desktop overview states Desktop starts a local copy of Kilo CLI and uses the same agent engine as CLI and VS Code. This establishes shared runtime architecture, **not identical effective permissions or file discovery**.

Desktop Quickstart documents manual vs automatic approval. Desktop AI Settings documents an Agents/Skills/MCP management UI. Desktop installation confirms Windows x64/ARM64 and beta distribution. CLI Runtime Architecture documents layered configuration precedence. Skills documentation describes trusted global skills and shell-command execution, so installation scope and trust boundaries require particular scrutiny.

Sources (accessed 2026-10-18):
- https://kilo.ai/docs/desktop/overview
- https://kilo.ai/docs/desktop/installation
- https://kilo.ai/docs/desktop/quickstart
- https://kilo.ai/docs/desktop/settings/ai
- https://kilo.ai/docs/contributing/architecture
- https://kilo.ai/docs/contributing/architecture/cli-runtime
- https://kilo.ai/docs/customize/skills
- https://kilo.ai/docs/getting-started/settings/auto-approving-actions

## Acceptance boundary and next gates

- Target identity distinguishes desktop vs vscode-extension; platform stays Windows; version is explicit for Desktop.
- Desktop preview is in-memory, deterministic and has VERSION_EVIDENCE_REQUIRED; deploymentEligible remains false.
- Desktop must be probed in an isolated Windows installation for skill discovery, config ownership, precedence, command execution, autonomous approval, local daemon process, version identification, update behavior, and differences against VS Code.
- Independent review and runtime evidence precede certification, installation and releases.
- Preserve historical K0 v7.8.8 VS Code evidence and ADR 0007 without rewriting it.
