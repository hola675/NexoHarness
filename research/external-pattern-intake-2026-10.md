# External pattern intake — 2026-10-17

Status: research proposals only. No runtime dependency, copied code, canonical schema change, adapter implementation or certification.

## Governance

External repositories are sources of concepts, not packages to install wholesale. Before adoption: pin upstream revision; verify file-level license and attribution; compare against current canonical source and K1 contract; document overlap; implement the smallest neutral concept; write negative and regression evaluations; seek independent review. Never promote from Observer output automatically.

## Candidate ledger

| Source | Concept to evaluate | Nexo destination | Overlap / risk | Decision |
|---|---|---|---|---|
| https://github.com/agentskills/agentskills | SKILL.md frontmatter and progressive disclosure; optional resources loaded on demand | Skill adapter conformance tests and fixture compatibility | K1 already maps Skill to SKILL.md; avoid a second canonical format; repository code Apache-2.0, docs CC-BY-4.0, verify each reused file | P1: spec-compatibility tests only |
| https://github.com/github/spec-kit | Specification -> clarification -> plan -> tasks -> analysis -> implementation -> convergence; explicit consistency checks | Workflow/Contract/Evaluation concept mapping | Nexo already separates workflow from contracts and evals; do not copy CLI commands or introduce new harness target; verify upstream license per file | P1: workflow consistency eval design |
| https://github.com/obra/superpowers | TDD, bounded tasks, independent spec/code review, verification before completion | Evals, review protocol | Nexo already requires independent review; avoid duplicate agents and mandatory heavyweight choreography; MIT, verify pinned files | P1: negative eval scenarios |
| https://github.com/addyosmani/agent-skills | Reusable skill authoring patterns | Skill quality rubric | High overlap with Agent Skills spec; avoid duplicate format and mass-import; verify file-level license | P2: compare after spec conformance |
| https://github.com/affaan-m/everything-claude-code | Hook reliability, session summaries, quality gates, learning proposals | Observer research only | Claude-specific hook APIs and automatic learning risk authority/privacy breaches; verify exact upstream revision and license | DEFER: post-V1 only |
| https://github.com/wshobson/agents | Specialist role catalog and task routing patterns | Agent/Capability review | Role explosion and implicit tool grants conflict with minimal canonical model; verify upstream license | DEFER: no bulk agents |
| https://github.com/deepseek-ai/deepseek-harness | Plugin boundaries and extension composition | Adapter architecture comparison | Runtime plugin model may create dependency and permission complexity; verify upstream license | P2: architectural comparison |

## Bounded first implementation proposal

1. **Skill format compatibility (P1)**: write adapter-only tests using minimal synthetic SKILL.md fixtures; check frontmatter name/description, path traversal rejection, resources not auto-executed, and no permission grants. Do not alter canonical Skill schema or generate deployable Kilo bundles.
2. **Cross-artifact consistency checks (P1)**: derive an evaluation matrix for selected Workflow references to Contract, Capability, Policy and Agent; use existing canonical integrity validator instead of adding a parallel graph engine. Begin with negative fixtures and no runtime routing.
3. **Independent review quality gates (P1)**: introduce a bounded checklist/evaluation fixture that tests false success claims, missing evidence and unauthorized promotion. Do not add more agent roles before a demonstrated gap.
4. **Observer (DEFER)**: classify signals and candidate proposals only after V1 governance and privacy are defined; no autonomous changes.

## Acceptance for each adoption

- Recorded source URL, pinned commit, specific files, license and attribution.
- Clear mapping to exactly one Nexo ownership area; no duplicate canonical source.
- Demonstrated failing scenario before change, regression test after change, and CI evidence.
- Explicit authority and permission preservation, negative cases, no provider/credential changes.
- Independent review and approval before merge/promotion.

## Research limitations

This ledger uses public repository documentation and does not constitute an audit of pinned upstream revisions, complete licenses, or a Nexo runtime experiment. Candidate priorities are proposals, not approved implementation work.
