# ADR 0001: Canonical Manifest Model

- **Status:** Accepted
- **Date:** 2026-10-04

## Decision

NexoHarness uses a common `apiVersion/kind/metadata/spec` envelope for canonical entities.

- The canonical API identifier is `nexoharness.dev/v1alpha1`.
- Entity IDs are logical machine-stable kebab-case values.
- Entity references use `Kind:id[@version]` syntax.
- Markdown plus YAML frontmatter is used for prose-heavy entities.
- Structured YAML/JSON values are used for structural canonical definitions and fixtures.
- JSON Schema Draft 2020-12 is the normative validation contract.
- Canonical source remains harness-neutral.
- Adapters own translation into target-native representations.

## Consequences

- Authoring is stricter and requires explicit lifecycle metadata.
- Schema validation detects drift and malformed definitions early.
- A canonical API change requires an explicit migration of manifests, fixtures and validators.
- Runtime instances remain distinct from canonical definitions.
- Provider, model and harness concerns stay outside canonical behavior.
