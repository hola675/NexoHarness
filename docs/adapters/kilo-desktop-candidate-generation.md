# Kilo Desktop candidate generation (K2 preview)

Status: offline-only, no installation, no runtime certification.

Prerequisites: Node.js >=22, dependencies installed, canonical integrity valid. A real canonical Skill with supported metadata, spec.purpose and Markdown body must exist. Unmapped semantic fields are rejected.

Generate an auditable JSON bundle to stdout:

```powershell
npm run kilo:preview -- --client desktop --version 1.2.3 --skill review-code > kilo-review.json
```

Replace version and skill ID with the **actual installed version** and a **real canonical Skill ID**. The version above is illustrative, not a claim of a released Desktop version. Use `--client vscode-extension` for the other research surface.

The JSON contains target identity, candidate SKILL.md content, source reference, per-file SHA-256, manifest SHA-256 and blocking diagnostics. The command never writes into Kilo directories or changes permissions, models, providers or settings. Redirecting stdout saves the JSON wherever the operator chooses; **do not place it in a Kilo-discovered skill directory**.

A generated candidate is NOT an installable pack. Do not extract or copy its SKILL.md into Desktop until client-specific discovery, trust, permissions and loading semantics are proven in isolated Windows probes, independently reviewed, and an explicit installation gate is approved.

Known gaps: no global skill deployment, no automatic discovery of Desktop version, no mapping of agents/rules/workflows/enforcement, no schema-to-target full semantic parity, no target capability certification.
