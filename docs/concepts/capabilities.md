# Capabilities

> **Boundary note:** this document remains the TECHNICAL_NORMATIVE source for the Capability Kind (identity, semantic request, effect). [`docs/model/capability-runtime.md`](../model/capability-runtime.md) provides the organizational/runtime framing around it (Capability Requirement, Runtime Snapshot, Provider, Binding, Runtime Resolution); it does not change the schema or the effects defined here.

Capabilities are abstract operations that agents request. They separate canonical behavior from the tools, MCPs, plugins or CLIs that provide it.

## Identity versus semantic request

A capability entity has a machine-stable logical identity and a separate semantic request:

```text
Entity identity:          Capability:repository-search
Semantic request:         repository.search
```

Entity IDs remain kebab-case. Semantic capability names use strict dotted notation, for example:

```text
documentation.lookup
repository.search
repository.semantic-analysis
browser.test
database.query
code.edit
command.execute
version-control.inspect
```

Capabilities also classify their effect:

- `read`
- `local-write`
- `external-write`
- `destructive`

This classification describes the abstract effect only. It does not define concrete permissions or provider behavior.

## Roles

- **Capability:** the canonical request and its expected semantics.
- **Capability Provider:** a harness-native implementation that supplies a capability.
- **Resolver:** selects an available provider and reports degradation or failure.
- **Profile:** bundles capabilities and constraints for a context.

Canonical behavior must not hardcode provider names. The canonical agent requests `browser.test`; an adapter maps that request to target semantics, a profile constrains and selects the required capability context, and runtime resolution selects an available, valid binding. None of these grants authority or permission.

## Authority boundary

Capability is not authority. A capability provider cannot broaden an agent's dimensional authority, and an agent role is not an authority level. Adapters later decide how requested effects are enforced.
