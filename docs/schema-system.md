# Schema System

NexoHarness uses strict canonical schemas to make definitions understandable, inspectable and validatable before adapters or runtime behavior exist.

## Canonical envelope

Every canonical entity uses the same envelope:

```yaml
apiVersion: nexo/v1alpha1
kind: Directive
metadata:
  id: core-directive
  title: Nexo Core Directive
  version: 0.1.0
spec:
  ...
```

- **`apiVersion`** identifies the canonical schema dialect.
- **`kind`** selects one registered entity schema.
- **`metadata`** carries stable identity and entity version.
- **`spec`** carries kind-specific content.

IDs are logical entity identifiers, not filesystem paths. Entity references use the form `Kind:entity-id` and may include an explicit version such as `Kind:entity-id@0.1.0`.

## Versioning and strictness

Schemas use JSON Schema Draft 2020-12. Entity versions use semantic `major.minor.patch` syntax. Phase 0.1 uses strict contracts: unknown fields fail validation and no generic `extra`, `extensions` or unbounded metadata escape hatches are provided.

Strictness is intentional. If a future extension requirement emerges, it must be evaluated and added explicitly rather than bypassing validation.

## Authoring formats

- Markdown entities use a small YAML frontmatter envelope followed by an uninterpreted Markdown body.
- Structured fixtures use JSON for deterministic schema tests.
- YAML parsing is limited to frontmatter and structured YAML values; no Markdown framework is required.

Frontmatter must begin with `---`, contain a closing `---`, parse as one YAML object and preserve the body separately. Malformed frontmatter is an error.

## Registry and validation

`core/schemas/registry.json` maps each supported `kind` to exactly one schema. The validator loads the registry, parses every schema, resolves internal references, compiles every schema under Draft 2020-12 and validates fixtures and canonical entities.

Validation reports the file and field path for failures. It does not silently skip malformed canonical entities. Current reference validation checks syntax and, where the repository contains the target entity, known logical IDs. Full repository graph resolution is deferred to Phase 0.2.

## Canonical versus harness schemas

A canonical schema describes NexoHarness behavior and contracts. It is not a schema for a target harness.

```text
Agent canonical schema
    ↓
Kilo adapter
    ↓
Kilo agent frontmatter
```

Future translation follows the same boundary:

```text
Agent canonical schema
    ↓
Claude adapter
    ↓
Claude-native configuration
```

Canonical schemas must not encode harness names, provider IDs, model IDs or concrete tool configuration. Adapters own translation and provider selection.

## Relationship to adapters

Schemas validate canonical authoring before translation. Adapters consume validated canonical entities and may impose additional target-specific requirements, but target requirements must not be copied back into canonical behavior. Generated distribution artifacts remain outputs and never become schema inputs.
