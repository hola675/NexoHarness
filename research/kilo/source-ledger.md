# Kilo Code K0 source ledger

**Inspected:** 2026-10-13 (UTC). All sources below are official Kilo-owned sources unless stated otherwise. No secondary/community source was used to establish findings. Documentation is rolling/current and does not expose a historical version selector; source-based claims are pinned to the release tag where noted. Release `v7.8.8` is dated 2026-10-07. Source repository license at that tag: MIT. Documentation license is not asserted here; the report links and summarizes, without copying extended text.

| ID | URL / repository | Owner; type | Version / commit | License / provenance | Claim supported | Confidence |
|---|---|---|---|---|---|---|
| S01 | https://github.com/Kilo-Org/kilocode/releases/tag/v7.8.8 | Kilo-Org; official release | v7.8.8; `e2887f08e5a6394299c810ba508f358aaf4c5bc3` | Repository MIT; release/tag provenance | Current pinned release; CLI and VS Code release components | `OFFICIAL_DOCUMENTED` |
| S02 | https://kilo.ai/docs/customize/custom-instructions | Kilo; official documentation | Rolling docs; inspected 2026-10-13 | Docs license not asserted; summarized only | Instruction discovery, sources, precedence and URL behavior | `OFFICIAL_DOCUMENTED` |
| S03 | https://kilo.ai/docs/customize/custom-rules | Kilo; official documentation | Rolling docs; inspected 2026-10-13 | As above | Rule files/config, path/glob and ordering | `OFFICIAL_DOCUMENTED` |
| S04 | https://kilo.ai/docs/customize/agents-md | Kilo; official documentation | Rolling docs; inspected 2026-10-13 | As above | AGENTS.md discovery and precedence; memory note | `OFFICIAL_DOCUMENTED` |
| S05 | https://kilo.ai/docs/customize/custom-modes | Kilo; official documentation | Current CLI-backed VS Code / CLI docs; inspected 2026-10-13 | As above | Agent definitions, role mode, prompt/model/permissions/config precedence | `OFFICIAL_DOCUMENTED` |
| S06 | https://kilo.ai/docs/customize/custom-subagents | Kilo; official documentation | Rolling docs; inspected 2026-10-13 | As above | Subagent invocation, isolated sessions, noninteractive child, delegation permissions | `OFFICIAL_DOCUMENTED` |
| S07 | https://kilo.ai/docs/customize/skills | Kilo; official documentation | Agent Skills implementation documented; inspected 2026-10-13 | As above; standard provenance attributed by Kilo docs | SKILL.md format, paths, discovery and on-demand use | `OFFICIAL_DOCUMENTED` |
| S08 | https://kilo.ai/docs/customize/workflows | Kilo; official documentation | Current slash-command implementation; inspected 2026-10-13 | As above | Markdown commands, invocation, frontmatter and subtask option | `OFFICIAL_DOCUMENTED` |
| S09 | https://kilo.ai/docs/code-with-ai/platforms/cli | Kilo; official documentation | CLI docs state applicability to Kilo v1.0+; release separately pinned to v7.8.8 | As above | CLI surface, tool/permission behavior, interactive vs `--auto`, exit states | `OFFICIAL_DOCUMENTED` |
| S10 | https://kilo.ai/docs/customize/context/codebase-indexing | Kilo; official documentation | Rolling docs; inspected 2026-10-13 | As above | Opt-in indexing, embeddings and vector stores | `OFFICIAL_DOCUMENTED` |
| S11 | https://kilo.ai/docs/automate/mcp/using-in-kilo-code | Kilo; official documentation | Rolling docs; inspected 2026-10-13 | As above | MCP configuration, transports, scope, enable/disable | `OFFICIAL_DOCUMENTED` |
| S12 | https://kilo.ai/docs/customize/agent-permissions | Kilo; official documentation | Rolling docs; inspected 2026-10-13 | As above | Allow/ask/deny, ordered matching, task delegation and sensitive files | `OFFICIAL_DOCUMENTED` |
| S13 | https://kilo.ai/docs/getting-started/settings/auto-approving-actions | Kilo; official documentation | Rolling docs; inspected 2026-10-13 | As above | Approval defaults, auto-approval risk, cross-client model, session config caching | `OFFICIAL_DOCUMENTED` |
| S14 | https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/permission/index.ts | Kilo-Org; pinned source | `e2887f08e5a6394299c810ba508f358aaf4c5bc3` | Repository MIT | Permission rule default/matching/decision path and Kilo permission hooks | `VERIFIED_SOURCE` |
| S15 | https://kilo.ai/docs/desktop/settings/ai | Kilo; official documentation | Rolling docs; inspected 2026-10-13 | Docs license not asserted | Provider/model settings as target-owned configuration | `OFFICIAL_DOCUMENTED` |
| S16 | https://kilo.ai/docs/customize/context/memory | Kilo; official documentation | Rolling docs; inspected 2026-10-13 | As above | Target context/memory feature scope; not Nexo Shared Runtime | `OFFICIAL_DOCUMENTED` |
| S17 | https://github.com/Kilo-Org/kilocode/tree/e2887f08e5a6394299c810ba508f358aaf4c5bc3 | Kilo-Org; pinned source tree | `v7.8.8` tag commit | MIT | Repo identity, current source layout and CLI/extension implementation provenance | `VERIFIED_SOURCE` |
| S18 | https://github.com/hola675/NexoHarness/blob/0a22a52c8f5155a696f82da12640075711677a2a/docs/adapters/codex-capability-matrix.md | NexoHarness; internal methodology reference | Baseline `0a22a52c8f5155a696f82da12640075711677a2a` | Nexo repository provenance | Translation classification and evidence/loss recording method only | Internal reference |
| S19 | https://github.com/hola675/NexoHarness/blob/0a22a52c8f5155a696f82da12640075711677a2a/docs/adapters/codex-translation-contract.md | NexoHarness; internal methodology reference | Same baseline | Nexo repository provenance | Authority/effect, fail-closed, renderability and provenance method only | Internal reference |
| S20 | https://github.com/hola675/NexoHarness/blob/0a22a52c8f5155a696f82da12640075711677a2a/docs/decisions/0003-codex-target-surface.md | NexoHarness; internal decision | Same baseline | Nexo repository provenance | Version/surface pinning method only; no Codex target assumption imported | Internal reference |
| S21 | https://github.com/hola675/NexoHarness/blob/0a22a52c8f5155a696f82da12640075711677a2a/docs/decisions/0004-codex-adapter-translation-contract.md | NexoHarness; internal decision | Same baseline | Nexo repository provenance | Translation classification method only | Internal reference |
| S22 | https://github.com/hola675/NexoHarness/blob/0a22a52c8f5155a696f82da12640075711677a2a/docs/decisions/0005-codex-agent-role-rendering.md | NexoHarness; internal decision | Same baseline | Nexo repository provenance | Role/authority separation as a review question only | Internal reference |

## Confidence rules

- `VERIFIED_SOURCE`: directly supported by source code at the pinned release commit.
- `OFFICIAL_DOCUMENTED`: stated by official Kilo documentation; rolling docs may have changed after the pinned release and do not by themselves prove the installed release's exact behavior.
- `INFERRED`: architectural classification from Nexo semantics plus cited target evidence; not a direct Kilo feature claim.
- `UNKNOWN`: evidence not sufficient for a material claim.

Each external source was consulted on 2026-10-13. The URLs are direct resources; the Kilo documentation pages are not versioned snapshots. Before any K1 implementation contract, re-check them against the selected v7.8.8 surface and source tag. No local probes, installs, config writes, credentials, or services were used.
