# Codex CLI 0.160.0 Custom Agent Role Evidence

Date: 2026-10-06
NexoHarness baseline: `eea037ed40d66d793b30774a80dd07326a745dce`
Codex CLI: `codex-cli 0.160.0`
Pinned upstream tag: `rust-v0.160.0`
Pinned upstream commit: `a956835d020762cb2b570053af06f643a11c0ecc`

This report separates local runtime observations from facts in the pinned Codex release source and the bounded inference they support. It records the accepted positive role control and the final negative control. The negative run started one child but stalled in its local mock before the child's model request could be inspected. No additional child or model run is part of this evidence promotion.

## RELEASE_PINNED_SOURCE

All source links below refer to commit `a956835d020762cb2b570053af06f643a11c0ecc`, the `rust-v0.160.0` release pin.

### A. Spawn argument selects the role

The V1 `spawn_agent` handler reads `args.agent_type`, trims it into `role_name`, and passes that role name into spawn preparation. ([`spawn.rs`](https://github.com/openai/codex/blob/a956835d020762cb2b570053af06f643a11c0ecc/codex-rs/core/src/tools/handlers/multi_agents/spawn.rs#L781-L815))

### B. Child configuration is prepared before spawning

The handler awaits `prepare_agent_spawn_config(...)`, propagates its error, and only then calls `agent_control.spawn(...)` with `prepared.config`. ([`spawn.rs`](https://github.com/openai/codex/blob/a956835d020762cb2b570053af06f643a11c0ecc/codex-rs/core/src/tools/handlers/multi_agents/spawn.rs#L868-L945))

### C. V1 role application fails closed before spawn

For a V1 spawn without a full-history fork, `prepare_agent_spawn_config(...)` awaits `apply_spawn_agent_role(...)` with `?`. A role-application error therefore returns before preparation succeeds and before the handler can spawn the child. ([`child_config.rs`](https://github.com/openai/codex/blob/a956835d020762cb2b570053af06f643a11c0ecc/codex-rs/core/src/agent/child_config.rs#L1002-L1095))

### D. Configured role file must load and parse

For a configured role with `config_file`, role application loads the file, parses and deserializes its TOML, and propagates load/parse errors. ([`role.rs`](https://github.com/openai/codex/blob/a956835d020762cb2b570053af06f643a11c0ecc/codex-rs/core/src/agent/role.rs#L1144-L1163), [`role.rs`](https://github.com/openai/codex/blob/a956835d020762cb2b570053af06f643a11c0ecc/codex-rs/core/src/agent/role.rs#L1256-L1314))

### E. Role instructions become child Config instructions

The deserialized role configuration supplies `developer_instructions` to the role override, and applying that override sets `Config.developer_instructions`. ([`role.rs`](https://github.com/openai/codex/blob/a956835d020762cb2b570053af06f643a11c0ecc/codex-rs/core/src/agent/role.rs#L1161-L1168), [`role.rs`](https://github.com/openai/codex/blob/a956835d020762cb2b570053af06f643a11c0ecc/codex-rs/core/src/agent/role.rs#L1340-L1362))

### F. Prepared Config reaches child SessionConfiguration

The handler places the prepared Config in `SpawnRequest`. `LocalAgentControl::spawn` destructures that request and forwards its Config into `spawn_agent_internal`. ([`spawn.rs`](https://github.com/openai/codex/blob/a956835d020762cb2b570053af06f643a11c0ecc/codex-rs/core/src/tools/handlers/multi_agents/spawn.rs#L897-L945), [`api.rs`](https://github.com/openai/codex/blob/a956835d020762cb2b570053af06f643a11c0ecc/codex-rs/core/src/agent/control/api.rs#L53-L92))

For the V1 new-thread path, `spawn_agent_internal` calls `spawn_new_thread_with_source(config.clone(), ...)`. The thread manager passes that Config to `StartThreadOptions::new(config)`. ([`spawn.rs`](https://github.com/openai/codex/blob/a956835d020762cb2b570053af06f643a11c0ecc/codex-rs/core/src/agent/control/spawn.rs#L708-L737), [`thread_manager.rs`](https://github.com/openai/codex/blob/a956835d020762cb2b570053af06f643a11c0ecc/codex-rs/core/src/thread_manager.rs#L1827-L1858))

Session startup constructs `SessionConfiguration` with `developer_instructions: config.developer_instructions.clone()`. ([`session/mod.rs`](https://github.com/openai/codex/blob/a956835d020762cb2b570053af06f643a11c0ecc/codex-rs/core/src/session/mod.rs#L807-L848))

### G. Thread spawn role is reported as SubagentStart agent_type

For a `ThreadSpawn`, the hook runtime passes `agent_role` into subagent hook context; that context uses the role as `agent_type` and defaults only if no role exists. The resulting context populates `StartHookTarget::SubagentStart`. ([`hook_runtime.rs`](https://github.com/openai/codex/blob/a956835d020762cb2b570053af06f643a11c0ecc/codex-rs/core/src/hook_runtime.rs#L121-L147), [`hook_runtime.rs`](https://github.com/openai/codex/blob/a956835d020762cb2b570053af06f643a11c0ecc/codex-rs/core/src/hook_runtime.rs#L991-L1009))

## OBSERVED_LOCAL

### Accepted positive control

Evidence basis: the previously accepted positive-control report. Its raw fixture artifacts were not re-read for this promotion.

- Configured custom role: `nexo-probe-0160`.
- `SubagentStart`: 1; `agent_type`: `nexo-probe-0160`; unique child: 1.
- Role-specific canary was isolated to the role configuration and observed from the child.
- `CHILD_POS_OK` was observed.
- `SubagentStop` was correlated to the child.

### Final negative control (R3)

The preserved R3 hook JSONL was independently inspected during review:

- `PreToolUse` with `tool_name=spawn_agent`: observed.
- `SubagentStart`: 1; `agent_type=nexo-probe-0160`; unique child: 1.
- Child ID: `01a11192-eddd-7141-8305-b9dfa569d1d1`.
- No second child appears in the inspected R3 runtime evidence.
- The allowlisted mock summary records one root initial request and zero child requests. The mock stalled after the spawn response was written, before it could inspect the child request or continue the parent flow.
- `SubagentStop`: not observed.

The preserved negative fixture declared `[agents.nexo-probe-0160]` with `config_file = "./nexo-probe-0160.toml"`. The role file was 242 bytes with SHA-256 `2DEFBA864E5B245D4C487EBD7AD69CE58DDD09EDC0402554152DF2E253D4C581`. It contained `developer_instructions`, the negative-control child identity, `CHILD_NEG_OK`, and a no-delegation instruction; the positive-canary namespace occurred zero times.

Historical pre-run/post-run role-file hash continuity: **NOT ESTABLISHED**. The observed hash is the preserved file's current hash only.

Explicitly unobserved negative runtime surfaces:

- Negative child model request directly observed: **NO**.
- `CHILD_NEG_OK` model output observed: **NO**.
- Negative `SubagentStop` observed: **NO**.

No role-canary value, raw model request, credentials, or unrelated hook/config data is reproduced here.

## INFERENCE

Because the negative runtime reached `SubagentStart` with `agent_type=nexo-probe-0160`, and the pinned V1 spawn path applies the configured role fail-closed before creating the child session, the configured role was applied to that child's effective `SessionConfiguration` before startup.

This is a source-supported inference. It is **not** direct observation that the negative child model request contained those instructions.

## Spawn accounting

- Accepted positive actual children: 1
- Final negative R3 actual children: 1
- Total actual children: 2
- Earlier negative probes with no child created: 0 each
- Additional runtime probes for this evidence promotion: none

## Established claim

Codex 0.160.0 supports configured custom agent roles whose role-specific `developer_instructions` are applied to the effective session configuration of a spawned child.

## Not established

- The negative model request directly contained the role instructions.
- The negative child produced `CHILD_NEG_OK` or reached an observed stop event.
- A Codex role is a Nexo Agent or grants Nexo authority, permissions, or canonical capabilities.
- Role configuration changes canonical authority.
- General role behavior beyond the tested role, invocation path, and pinned Codex release.

`ROLE != AUTHORITY`.

## Translation consequence

This evidence authorizes later renderer design for `AgentCandidate` → Codex `[agents.<role>]` declaration → role-specific `config_file` → `developer_instructions`. It does not implement that renderer or decide unrelated Agent mapping fields.
