# Canonical Format

NexoHarness canonical entities use a strict, harness-neutral manifest envelope.

## Envelope

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

The envelope fields are:

- `apiVersion` — canonical API identifier.
- `kind` — registered entity kind.
- `metadata` — stable logical identity, entity version, lifecycle status and optional provenance.
- `spec` — kind-specific definition.

Entity IDs are machine-stable kebab-case values. References use `Kind:id` and may include a version suffix: `Capability:repository-search@0.1.0`.

Registered non-authoring artifact Kinds may also reuse the canonical manifest envelope. Today these are `Observation` and `ImprovementProposal`, whose schemas reference the same `apiVersion` and `metadata` definitions. Using the envelope does not make an instance canonical behavior. Instances of these Kinds are runtime artifacts: they have no canonical authoring root and never enter the canonical index. Their `metadata.status` comes from the shared envelope, and its meaning for such instances is not yet defined. It must not be read as information class, approval or promotion ([Canonical Information](model/canonical-information.md)).

## Lifecycle and runtime status

`metadata.status` is the entity lifecycle and uses only:

- `draft`
- `experimental`
- `stable`
- `deprecated`

Runtime completion statuses such as `PASS` and `BLOCKED` belong to runtime artifacts or evaluations, not canonical entity metadata.

## Authoring forms

- Prose-heavy canonical entities use Markdown with a YAML frontmatter envelope. The Markdown body is preserved separately and is not interpreted by schema validation.
- Structural canonical definitions and deterministic fixtures use structured JSON/YAML values validated by JSON Schema Draft 2020-12.
- Unknown fields are rejected. Extensions require an explicit schema decision.

## Authority and capabilities

Agent authority is dimensional (`sourceModification`, `delegation`, `commandExecution`, `externalMutation`) and describes what may be authorized, not the agent's role. Capability identity is separate from semantic request: `Capability:repository-search` refers to the entity, while `repository.search` names the abstract request.

## Translation boundary

Canonical manifests do not name harnesses, providers, models or concrete tools. Adapters translate validated canonical entities into target-native formats. Generated output is never canonical input.
