# Kilo Code Adapter

Kilo Code is the first certified target. Phase 0.0 documents the conceptual mapping but does not implement adapter code.

## Conceptual mapping

```text
Canonical agents    → Kilo agent definitions
Canonical skills    → Kilo SKILL.md
Canonical rules     → Kilo instructions/rules/plugins depending on enforcement level
Canonical commands  → Kilo custom commands
Capabilities        → Kilo-native tools / MCP / plugins / CLI
Permissions         → Kilo permission configuration
Generated output    → dist/kilo/
```

## Relevant Kilo concepts

- `AGENTS.md`
- `CONTEXT.md`
- `.kilo/`
- `kilo.jsonc`
- agents
- skills
- commands
- plugins
- permissions
- MCP

Any implementation detail not yet verified against the target release is marked:

> **TBD — VERIFY AGAINST CURRENT KILO VERSION**

The adapter must consume canonical definitions and produce generated output. It must not make Kilo-specific names or behavior a dependency of the canonical source. Claude Code is planned after canonical model certification and has no adapter implementation in this phase.
