# Schema System

NexoHarness uses strict canonical schemas to make definitions understandable, inspectable and validatable before adapters or runtime behavior exist.

## Canonical envelope

Every canonical entity uses the same envelope:

```yaml
apiVersion: nexoharness.dev/v1alpha1
kind: Capability
metadata:
  id: repository-search
  title: Repository Search
  version: 0.1.0
  status: draft
spec:
  name: repository.search
  purpose: Search repository content without naming a provider.
  effect: read
```

- **`apiVersion`** identifies the canonical schema dialect.
- **`kind`** selects one registered entity schema.
- **`metadata`** carries logical identity, entity version, lifecycle status and optional provenance references.
- **`spec`** carries kind-specific content.

Entity IDs are logical kebab-case identifiers, not filesystem paths. Entity references use `Kind:entity-id` and may include an explicit version such as `Kind:entity-id@0.1.0`.

## Lifecycle and runtime status

`metadata.status` uses the entity lifecycle values `draft`, `experimental`, `stable` and `deprecated`. Runtime completion statuses (`READY`, `PASS`, `FAIL`, `BLOCKED`, `INCOMPLETE`, `ESCALATION_REQUIRED`) are separate and must not substitute for entity lifecycle status.

Canonical metadata requires `id`, `title`, `version` and `status`. `provenanceRefs` is optional for original NexoHarness work and uses a strict unique non-empty string array when present; provenance graph resolution is deferred.

## Versioning and strictness

Schemas use JSON Schema Draft 2020-12. Entity versions use semantic `major.minor.patch` syntax. Unknown fields fail validation and no generic `extra`, `extensions` or unbounded metadata escape hatches are provided.

Observation telemetry is deliberately bounded. Execution, boolean signals and metrics each have explicit allowed fields. Unknown telemetry fields fail validation, and unavailable measurements remain absent. Observation privacy metadata is required; structured telemetry does not authorize raw conversation or source capture.

Contract definitions use a constrained completion-status list when they declare allowed outcomes. They cannot select a concrete next agent; workflow definitions own routing and state transitions.

## Authoring formats

- Markdown entities use a small YAML frontmatter envelope followed by an uninterpreted Markdown body.
- Structured definitions and fixtures use JSON/YAML values.
- YAML parsing is limited to frontmatter and structured values; no Markdown framework is required.

Frontmatter must begin with `---`, contain a closing `---`, parse as one YAML object and preserve the body separately. Malformed frontmatter is an error.

## Registry and validation

`core/schemas/registry.json` maps each supported `kind` to exactly one schema. The validator loads the registry, parses every schema, resolves references, compiles every schema under Draft 2020-12 and validates fixtures and canonical entities.

Validation reports the file and field path for failures. It does not silently skip malformed canonical entities. Phase 0.2 adds deterministic repository-wide discovery, indexing, typed reference checks and version-aware resolution without treating runtime observer artifacts as canonical source.

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
