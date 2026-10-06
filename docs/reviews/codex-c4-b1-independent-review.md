# Codex C4-B1 Independent Review

- Review date: 2026-10-06
- Reviewed commit: `c333d22c8ceec9a5eef48e61a63880b76961aa40`
- Scope: ADR 0005 + Codex Agent role renderer
- Result: `PASS_WITH_GOVERNANCE_REMEDIATION`

## Governance sequence

The intended order was:

```text
proposal
→ independent review
→ acceptance
→ implementation
```

The actual history was:

```text
AgentCandidate baseline
14b9feb1...

→

ADR 0005 Accepted + C4-B1 implementation
c333d22c8ceec9a5eef48e61a63880b76961aa40

→

independent review
C4-B1-R1
```

No Proposed ADR commit existed before implementation, and no independent review occurred before acceptance. ADR 0005 acceptance and C4-B1 implementation landed in the same commit. The original ordering was non-compliant. The independent review occurred later; this review does not change or conceal that chronology.

## Independent approval

- ADR 0005 substance: **APPROVED**
- C4-B1 implementation: **APPROVED**
- CRITICAL: **0**
- MAJOR: **0**

Minor findings:

1. `CodexManifest` does not explicitly encode `deploymentEligible`.
2. The 100-character role-name test exercises renderer defensive behavior outside schema-valid canonical input and must not be cited as canonical ID validity evidence.

The manifest deployability boundary must be resolved before Phase 1.2 introduces any manifest consumer or installer. Current classification: **API MISUSE RISK EXISTS BUT NO INSTALLER/CONSUMER YET**. This is not a C4-B1 blocker after independent review, but it is a mandatory pre-Phase-1.2 gate.

## Approved invariants

```text
RENDERABLE != USABLE
RENDERABLE != DEPLOYABLE
TESTABLE != DEPLOYABLE
ROLE != AUTHORITY
CAPABILITY != TOOL
TARGET CAPABILITY != AUTHORIZATION
ADAPTER GENERATES; INSTALLER RECONCILES
```

## Technical review summary

- `compilation.usable` is never promoted by the renderer.
- `deploymentEligible` cannot be true when renderer `usable` is false.
- Required Agent previews remain non-deployable.
- Compiler authority diagnostics are retained.
- Capability references remain provenance only.
- The renderer emits no model, sandbox, tools, MCP, or permissions settings.
- Rendering is deterministic and in-memory only.
- Path, serialization, and collision failures are atomic.
- Existing AGENTS.md and Skill renderer strict gates remain unchanged.
