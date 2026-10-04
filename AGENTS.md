# NexoHarness

NexoHarness is a portable, testable engineering harness for AI coding agents. It defines harness-neutral canonical behavior and translates it into native configurations through adapters.

## Current Target

Kilo Code first. Claude Code follows canonical model certification and is not implemented in Phase 0.0.5.

## Source of Truth

Canonical directories:

- `core/` (including the canonical Nexo Core Directive and policies)
- `agents/`
- `skills/`
- `rules/`
- `workflows/`
- `capabilities/`
- `profiles/`
- `enforcement/`

Generated output: `dist/`

## Universal Engineering Rules

- inspect before modifying
- preserve scope
- make the minimum necessary change
- provide evidence before claiming completion
- do not fabricate verification
- do not manually edit generated files
- do not encode tool-specific names into canonical behavior
- preserve provenance
- observer proposals may not self-promote
- preserve the semantic separation between agents, skills, rules, policies, workflows, capabilities and providers
- respect the Nexo Core Directive architecture without copying it into this file
- review licenses and provenance before adapting third-party content

## Documentation

- [Architecture](docs/architecture.md)
- [Principles](docs/principles.md)
- [Source of truth](docs/source-of-truth.md)
- [Lifecycle](docs/lifecycle.md)
- [Execution model](docs/execution-model.md)
- [Component coordination](docs/concepts/directives.md)
- [Nexo Core Directive](core/directives/core-directive.md)

This file governs agents developing NexoHarness. It is not the canonical runtime directive installed into supported harnesses and is not detailed architecture documentation.
