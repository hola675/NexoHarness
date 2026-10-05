# NexoHarness

Portable engineering harness for AI coding agents.

## What is NexoHarness?

NexoHarness is an open-source, portable, testable and continuously improving engineering system for AI coding agents. It defines responsibilities, reusable procedures, behavioral rules, workflows, contracts, capabilities, enforcement and evaluations from a harness-neutral canonical source.

Harness-specific adapters translate that canonical system into native configurations without making the canonical model depend on one platform. Codex is the first certification target, followed by Claude Code and Kilo Code. Each adapter is built independently from the same canonical source.

Phases 0.0 and 0.0.5 establish the repository constitution, universal execution model and documentation baseline. They do not ship production agents, skills, workflows, runtime observer code or adapter logic.

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
Canonical Source ─┬→ Codex Adapter ─────→ Codex
                  ├→ Claude Code Adapter → Claude Code
                  └→ Kilo Code Adapter ──→ Kilo Code
```

Target priority: **Codex → Claude Code → Kilo Code**.

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

**Pre-alpha / Foundation phase.** NexoHarness is not ready to install or use as a package.

## Roadmap

See [ROADMAP.md](ROADMAP.md).

## License

MIT.
