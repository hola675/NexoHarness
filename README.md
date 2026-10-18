# NexoHarness

Portable engineering harness for AI coding agents.

## What is NexoHarness?

NexoHarness is an open-source, portable, testable and continuously improving engineering system for AI coding agents. It defines responsibilities, reusable procedures, behavioral rules, workflows, contracts, capabilities, enforcement and evaluations from a harness-neutral canonical source.

Harness-specific adapters translate that canonical system into native configurations without making the canonical model depend on one platform. Kilo Code is the first product and certification target, followed by OpenAI Codex, initially on Windows + VS Code. Existing Codex CLI work remains experimental/model-validation evidence, not proof of Codex VS Code compatibility. Claude Code is outside current target scope. Each adapter consumes the same canonical source independently; [ADR 0007](docs/decisions/0007-windows-vscode-target-scope.md) governs current priority and target environment; [ADR 0006](docs/decisions/0006-product-v1-and-adapter-priority.md) remains in force for DKT-01 and DKT-03–06.

Foundation phases 0.0–0.3 are marked certified in the roadmap. The repository also contains prior Codex adapter work. These milestones do not establish a production-ready Kilo adapter, runtime Observer, installer, or installable V1.

## Why NexoHarness?

AI coding behavior is fragmented across prompts, agents, skills, rules, commands, permissions, MCPs, plugins and harness-specific configuration. NexoHarness treats those pieces as an engineered system with explicit ownership, contracts, validation and evidence.

## Core Concepts

- **Agents** have bounded responsibilities and handoff contracts.
- **Skills** provide reusable procedural knowledge.
- **Rules** define behavioral invariants; **workflows** coordinate state transitions.
- **Contracts** make handoffs structured and traceable.
- **Capabilities** describe abstract needs independently of tool names.
- **Profiles** bundle capabilities for a task context.
- **Enforcement** makes important invariants progressively stronger.
- **Evaluations** provide structural and behavioral evidence.
- **Task Observer** turns execution signals into reviewed improvement proposals.
- **Adapters** translate canonical definitions into harness-native output.

## Architecture

```text
Canonical Source ─┬→ Kilo Code Adapter ──→ Kilo Code (Windows + VS Code)
                  └→ Codex Adapter ─────→ Codex (Windows + VS Code)
```

Product target priority: **Kilo Code → Codex**, initially on Windows + VS Code, per ADR 0007. Claude Code is outside current target scope.

See [the architecture](docs/architecture.md) and [source-of-truth rules](docs/source-of-truth.md).

## Principles

- one source of truth
- context before action
- evidence before claims
- minimum necessary change
- progressive disclosure
- independent review
- bounded remediation
- capabilities over tool names
- explicit provenance
- generated artifacts are immutable outputs
- observation does not equal autonomous mutation

## Status

**Pre-alpha / Kilo adapter design phase.** The foundation is marked certified, but the Kilo adapter is not implemented or certified. NexoHarness is not ready to install or use as a package.

## Roadmap

See [ROADMAP.md](ROADMAP.md).

## License

MIT.
