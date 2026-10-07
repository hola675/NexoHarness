# Profiles

> **Boundary note:** this document remains the TECHNICAL_NORMATIVE source for Profile semantics (`spec.capabilities` + `spec.constraints`). [`docs/model/profiles-context-configuration.md`](../model/profiles-context-configuration.md) provides the organizational framing (selection timing, composition, creation gate, context and configuration boundaries) and records the candidate audit summarized below. A Profile is not provider configuration: API keys, MCP servers, CLI executables, provider accounts, and provider-specific endpoints never belong in a Profile.

Profiles determine bundles of capabilities and their associated constraints. They make the execution context explicit without changing canonical agent behavior.

Future candidates requiring evaluation (no Profile entity exists yet):

- `core`
- `web`
- `database`
- `assets`

These are historical Phase 0.0 examples, not approved canonical entities or a public API. Each must pass the Profile creation gate before becoming a canonical entity. `cloudflare`, also listed in the Phase 0.0 draft, was removed from this list in R1-I because it is provider-scoped rather than a portable execution domain; vendor-specific needs belong to Project Knowledge, configuration, or Capability bindings.

Phase 0.0 does not configure MCPs, permissions or providers for these profiles. A future profile must document its capability set, activation conditions, degradation behavior and adapter mapping.
