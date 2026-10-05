# Validation Framework

Phase 0.2 validates the canonical repository as one deterministic system. It separates canonical authoring from runtime artifacts and checks both individual manifests and their relationships.

## Pipeline

```text
DISCOVER
→ PARSE
→ SCHEMA VALIDATE
→ INDEX
→ PLACEMENT CHECK
→ REFERENCE RESOLUTION
→ TYPED REFERENCE CHECK
→ REPOSITORY INTEGRITY RESULT
```

Malformed or schema-invalid entities never enter the canonical index and cannot satisfy another entity's reference.

## Canonical source discovery

Supported canonical roots and formats are:

| Root | Kind | Format |
|---|---|---|
| `core/directives/` | Directive | Markdown + YAML frontmatter |
| `core/policies/` | Policy | Markdown + YAML frontmatter |
| `core/contracts/` | Contract | YAML |
| `agents/` | Agent | Markdown + YAML frontmatter |
| `skills/` | Skill | Markdown + YAML frontmatter |
| `rules/` | Rule | YAML |
| `workflows/` | Workflow | YAML |
| `capabilities/` | Capability | YAML |
| `profiles/` | Profile | YAML |
| `enforcement/` | Enforcement | YAML |
| `evals/` | Evaluation | YAML |

Discovery is recursive, stays inside repository-controlled roots, rejects unsupported files and sorts paths with a locale-independent comparator before parsing. `.gitkeep` is the only ignored infrastructure file. Entity identity never depends on its filename. Canonical roots and nested entries that are symbolic links are rejected.

`observer/` is runtime storage, not a canonical authoring root. Observation and ImprovementProposal schemas are validated as structured artifacts by their dedicated schema tests, but their runtime instances do not enter the canonical index.

## Entity index

Each discovered entity becomes a record containing:

```text
key
kind
id
version
status
file
format
document
```

The logical key is `Kind:id`; the optional versioned identity is `Kind:id@version`. Two canonical definitions may not share one logical key, even when their versions differ. Equal text IDs across different kinds are allowed.

## Reference resolution

References use `Kind:id` or `Kind:id@version`. References are discovered only from declared reference-bearing fields. Arbitrary prose that resembles `Kind:id` is not a dependency edge. The shared semantic relationship table in `references.ts` is the single source of truth for reference extraction, syntax checking, allowed target kinds and resolution. Unversioned references resolve to the unique current entity; versioned references resolve only when the target metadata version matches.

Failures are distinct:

- `UNRESOLVED_REFERENCE` — no logical target exists.
- `VERSION_MISMATCH` — the logical target exists, but its version differs.
- `REFERENCE_KIND_MISMATCH` — the target exists but is not allowed by that relationship.
- `MALFORMED_REFERENCE` — reference syntax is invalid.

Typed relationship truth is centralized in `references.ts`'s semantic reference-field table. Examples include Agent capabilities to Capability, Workflow step agents to Agent, Profile capabilities to Capability, Rule enforcement to Enforcement, and ImprovementProposal observation references to Observation. Schema validation and repository reference integrity intentionally remain separate responsibilities.

Generic fields such as evaluation targets remain open to any supported canonical kind unless a more specific rule exists.

## Placement and format integrity

Directory ownership defines the expected kind and format. A manifest's `kind` must agree with its root, and its extension and envelope must agree with the root format. A Skill in `agents/`, a Markdown Rule in `rules/`, a malformed frontmatter block or an unsupported extension fails validation.

## Diagnostics and determinism

Validation emits structured diagnostics with:

```text
code
severity
file
path
message
reference (when applicable)
```

Initial errors include `DUPLICATE_IDENTITY`, `UNRESOLVED_REFERENCE`, `VERSION_MISMATCH`, `REFERENCE_KIND_MISMATCH`, `PLACEMENT_MISMATCH`, `FORMAT_MISMATCH`, `MALFORMED_MANIFEST` and `SCHEMA_VALIDATION_FAILED`.

Paths, index records and diagnostics are sorted. The same repository state therefore produces the same result and issue order.

## Cycles

The framework may expose graph edges for inspection, but it does not reject generic reference cycles. A cycle can be legitimate, such as a Rule referring to an Enforcement that refers back to the Rule. Relationship-specific semantics must establish any future cycle prohibition.

## Safety boundary

Validation parses data only. It does not execute manifest contents, follow symlinks outside canonical roots, access the network or invoke tools during parsing. The canonical index is not a runtime artifact store and does not grant authority to agents, providers or observers.
