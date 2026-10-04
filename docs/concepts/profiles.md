# Profiles

Profiles determine bundles of capabilities and their associated constraints. They make the execution context explicit without changing canonical agent behavior.

Initial conceptual profiles:

- `core`
- `web`
- `database`
- `cloudflare`
- `assets`

Phase 0.0 does not configure MCPs, permissions or providers for these profiles. A future profile must document its capability set, activation conditions, degradation behavior and adapter mapping.
