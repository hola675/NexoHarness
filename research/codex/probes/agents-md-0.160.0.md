# Codex CLI 0.160.0 `AGENTS.md` Runtime Probe

Date: 2026-10-06
NexoHarness commit: `96f211e2699a071cd3938b8b5958b261ce523fb0`
Platform: Windows
Codex CLI: `codex-cli 0.160.0`
Pinned upstream tag: `rust-v0.160.0`
Pinned upstream commit: `a956835d020762cb2b570053af06f643a11c0ecc`

This report separates facts from the pinned release source from behavior observed by running the local CLI. Temporary Git fixtures were created outside the NexoHarness repository and removed after the probe. No personal absolute paths or credentials are included.

## RELEASE_PINNED_SOURCE

The pinned Codex 0.160.0 source identifies `apps`, `plugins`, and `remote_plugin` as Stable features enabled by default. When Apps is enabled and Codex backend authentication is present, Codex can synthesize its host-owned `codex_apps` server. Thus, a `codex_apps` startup attempt alone does not show that `--ignore-user-config` failed or that user MCP configuration leaked.

`--ephemeral` controls session persistence. It does not mean Codex internal `SessionIsolation::Isolated`.

Source: [openai/codex at the pinned release commit](https://github.com/openai/codex/tree/a956835d020762cb2b570053af06f643a11c0ecc).

## OBSERVED_LOCAL

The local probe used a fresh `codex exec` process for each question with:

- `--ignore-user-config`
- `--ignore-rules`
- `--ephemeral`
- `--sandbox read-only`
- `-c 'approval_policy="never"'`
- `-c 'features.apps=false'`
- `-c 'features.plugins=false'`
- `-c 'features.remote_plugin=false'`
- `-C <temporary Git fixture>`

The feature overrides were process-local. Persisted Codex configuration and credentials were not changed. The sanity fixture had no `AGENTS.md`.

### Routing sanity and host-feature isolation

Prompt: `Reply only with OK.`
Result: `OK`
Exit code: `0`

No `codex_apps`, GitHub MCP, Serena MCP, or remote plugin catalog startup/request was observed in the sanity invocation. The only stderr warning was that Codex could not create a PowerShell shell snapshot because PowerShell snapshots are unsupported. The model response was returned without retry.

### Root loader control

Fixture A had a root `AGENTS.md` containing the static canary `NEXO_AGENTS_CONTROL_0160`. The prompt did not include the canary.

Prompt: `Return only the repository instruction canary.`
Positive result: `NEXO_AGENTS_CONTROL_0160`
Exit code: `0`

Fixture B was a fresh Git repository with no `AGENTS.md`, using the identical prompt and execution flags. It did not return the canary. Codex reported that it could not determine the canary from accessible instructions; attempts to read/search a missing `AGENTS.md` were rejected by the execution policy. This is a negative result for this control, not evidence about other instruction sources or general model knowledge.

### Generated Nexo artifact

The artifact was regenerated from this repository commit using `validateCanonicalIntegrity()`, explicit selection of `Directive:core-directive@0.1.0` and `Directive:execution-protocol@0.1.0`, `compileCodex()`, and `renderCodexAgents()` with a 32,768-byte budget.

- Usable: YES
- Byte length: 8,477
- Previous byte-length match: YES
- SHA-256: `3f489bcb125481b07927410043e0f267ed048a68254c01f899c12370b497e139`
- Previous SHA match: YES
- Materialized temporary `AGENTS.md` SHA match: YES
- Source references: `Directive:core-directive@0.1.0`, `Directive:execution-protocol@0.1.0`

### Nexo identifier observations

In a fresh fixture containing the exact generated root `AGENTS.md`:

| Question | Result |
| --- | --- |
| Stable identifier of the Nexo Core Directive | `NH-CORE` |
| Stable identifier of the Nexo Execution Protocol | `NEP-1` |

Each result came from a fresh process and matched the expected identifier.

In a separate fresh fixture without `AGENTS.md`, the same two questions did not return `NH-CORE` or `NEP-1`. Codex reported that the identifiers could not be determined from accessible instructions. Attempts to read/search `AGENTS.md` were rejected by the execution policy. These negative controls reduce the chance that the answers came from the prompt or unrelated fixture state; they do not prove the model has no prior knowledge of the identifiers.

## Established by this probe

For the tested Windows environment and exact Codex CLI 0.160.0 invocation:

- Root `AGENTS.md` loading was observed with a positive and a negative control.
- The generated NexoHarness root `AGENTS.md` was read sufficiently for the model to return `NH-CORE` and `NEP-1`.

This is prompt-context visibility evidence only. It does not establish policy enforcement or general loading behavior.

## Not established

- Nested `AGENTS.md` precedence or merge behavior
- `AGENTS.override.md`
- Fallback instruction filenames
- Truncation behavior or general byte-limit enforcement
- Skills or custom agents
- Authority enforcement
- Behavior on platforms or CLI versions other than the tested environment and version
