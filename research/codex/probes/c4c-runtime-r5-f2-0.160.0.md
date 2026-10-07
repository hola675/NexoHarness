# Codex CLI 0.160.0 — C4-C Runtime Verification, Attempt R5-F2

Date observed: 2026-10-07
NexoHarness baseline at observation time: `c1e94665c2a3e892366698c046d2a023eb26fb39`
Codex CLI: `codex-cli 0.160.0` (`rust-v0.160.0`, matches the pinned target baseline in ADR 0003/0004)
Recorded: 2026-10-07 (R0-F freeze)

This record promotes a bounded local attempt at C4-C Agent-role runtime verification. The attempt ran against the real `codex.exe` 0.160.0 binary, a local mock OpenAI-compatible provider, and the `NexoHarness` Codex adapter's non-deployable Agent-role preview output for a single `REQUIRED`, unusable `context-agent` compilation (same preview class as C4-B1 / ADR 0005). It is the latest known local C4-C attempt. No later attempt (F3 or otherwise) exists.

## OVERALL VERDICT

```text
C4-C-R5-F2
status: INVALID
reason: runtime/request budget exceeded because the provider fixture did not correctly
        route/classify concurrent child traffic
```

`INVALID` is the probe contract's own classification for a run that failed its operating constraints before completing its verification matrix. It is not `FAIL`: the harness-neutral behavior under test was not exercised to a conclusive pass or fail outcome.

**This record does not establish, and must not be read as, C4-C certification, PASS, or FAIL of Agent-role runtime behavior.**

## Evidence provenance

All evidence below was captured under a local, ephemeral probe root (pattern `%TEMP%\nexo-c4c-r5-f2-<timestamp>\`) produced by a prior, unpromoted local run. That root is not part of this repository and is not guaranteed to persist. The facts, byte sizes and SHA-256 digests below were computed directly against those local artifacts at freeze time and are reproduced here as the durable record; the raw artifacts themselves (provider request bodies, stdout/stderr, SQLite state) are deliberately not copied into the repository, consistent with how prior Codex probes in this directory promote findings without importing raw fixture dumps.

| Artifact (relative to probe root) | Bytes | SHA-256 |
|---|---|---|
| `fixture/.codex/config.toml` | 431 | `a14a0d14ed758bcba0c6060f3cb22f3aac72bac9277e5fd0a3ef8c9612ff0ddd` |
| `fixture/.codex/agents/context-agent.toml` | 853 | `ed78f0de669b7ca5d8658b50919c2cb86d9b1a8ee6beff88c22b6ac6338b2bc6` |
| `fixture/compilation-report.json` | 5066 | `71a8ed20eee2892cc3b4b82a32bbab66d95f2726a821ccd30d1d2684e177e598` |
| `evidence/spawn-call-arguments.json` | 99 | `0326f707e0746e879a479cc71737aff9a0bcae6d533054fc621a3ad222dab5ea` |
| `evidence/wait-call-arguments.json` | 65 | `e623ff17263340dee8e260c8652fbc395ae9a45fece66061a443a54368982b28` |
| `evidence/actual-child-id.txt` | 36 | `8814a9775a6f5760ff425fe2c7e8eeb5f3776bbabf2b0a3ff3843d8ef5572020` |
| `instrumentation/hooks.jsonl` | 814 | `9f57c1238b94914f84e9f9806cd2d392c3ef9b2ac7bc6052f36f067dd72baa04` |
| `provider/probe-defects.jsonl` | 3718 | `9fb485b7ed83af4a22efdb382180f3ed5b7c2412ae8925c1f2e36894cdec15ba` |

The compilation under test (`fixture/compilation-report.json`) is a `REQUIRED` Agent (`Agent:context-agent@0.1.0`) with `compilation.usable = false` (four `BLOCKING` authority diagnostics: `commandExecution`/`externalMutation`/`sourceModification` `AUTHORITY_MAPPING_PARTIAL`, `delegation` `AUTHORITY_UNREPRESENTABLE`) and `rendered.usable = false`, `rendered.deploymentEligible = false` — the same non-deployable-preview class already accepted under ADR 0005. This attempt did not change, weaken, or bypass that gate.

## OBSERVED

Each item below was read directly from the probe-root artifacts hashed above.

- **Real native `codex.exe` 0.160.0 child spawn: OBSERVED.** The captured launch argv (`evidence/spawn-call-arguments.json`, `agent_type: "context-agent"`, `message: "NEXO_C4C_R5_CHILD_TASK"`) corresponds to a real local Codex CLI 0.160.0 process invocation against the local mock provider — not a simulated/stubbed spawn.
- **Distinct child identity: OBSERVED.** `evidence/actual-child-id.txt` records a single child ID (`01a116b9-94a8-7cb1-9217-dcefec42d7e2`).
- **`SubagentStart` correlated with the spawned child identity: OBSERVED.** `instrumentation/hooks.jsonl` contains exactly one `SubagentStart` event, with `agent_id` equal to the ID in `actual-child-id.txt` and `agent_type: "context-agent"` — matching the configured role name.
- **Generated child `developer_instructions` observed in the child's actual model request: OBSERVED.** The `developer_instructions` string rendered into `fixture/.codex/agents/context-agent.toml` (role responsibility "Collect bounded task context.", handoff "Context Brief", failure behavior "Report BLOCKED when context is unavailable.") appears verbatim in 25 of 28 captured provider request bodies for this run, i.e. in the request traffic generated for the spawned child, not merely in the on-disk preview artifact.
- **Capability reference did not appear as an escalated capability or tool in the captured child request: OBSERVED.** `context-agent`'s only `capabilityRefs` entry is `Capability:repository-search`. The full set of tool names present across all 28 captured request bodies for this run is `create_goal`, `exec_command`, `get_goal`, `multi_agent_v1`, `request_user_input`, `update_goal`, `view_image`, `write_stdin` — no repository-search-specific tool, MCP server, or permission entry. This is consistent with ADR 0005's `CAPABILITY != TOOL` invariant: the reference remained provenance-only and was not translated into an available operation.
- **Real `wait` dispatch observed: OBSERVED, via a separate capture point, not via the hook matcher.** `evidence/wait-call-arguments.json` records a real wait call targeting `["01a116b9-94a8-7cb1-9217-dcefec42d7e2"]` — the same child ID. However, `instrumentation/hooks.jsonl` contains no event for this call at all (see Fixture defect 2 below): the wait dispatch is established by the dedicated wait-argument capture, not by hook instrumentation.

## NOT ESTABLISHED

- **Clean child completion: NOT ESTABLISHED.** No completion/result event for the spawned child was captured.
- **`wait` → `SubagentStop` correlation: NOT ESTABLISHED.** `instrumentation/hooks.jsonl` contains exactly two events total (`PreToolUse` for `spawn_agent`, and `SubagentStart`). No `SubagentStop` event was captured at all, so no correlation to the observed `wait` dispatch can be made.
- **Exact required request budget: NOT ESTABLISHED.** The run's own defect log (`provider/probe-defects.jsonl`) shows the fixture failing to classify traffic before any budget threshold could be exercised to a conclusive result; no bounding request count for a valid run was established.
- **C4-C certification: NOT ESTABLISHED.** No run to date (R5-F1, R5-F2, or earlier D4) has produced a certifiable result. No F3 or later attempt has been run.

## Fixture defects (not corrected by this record)

1. **Concurrent child request routing/classification window.** `provider/probe-defects.jsonl` records 24 `PROBE_DEFECT` entries, code `UNKNOWN classification: did not match any expected state transition`, within an 18-second window (`2026-10-07T14:17:13.281Z`–`2026-10-07T14:17:31.698Z`). This indicates the local mock provider fixture could not correctly route/classify concurrent request traffic once the child session was active, which is the proximate cause of the `INVALID` verdict.
2. **Hook matcher name mismatch (`wait_agent` vs. actual `wait`).** The run's hook instrumentation never recorded any event for the observed `wait` dispatch (see above), despite `evidence/wait-call-arguments.json` proving the call occurred. This is consistent with a fixture hook matcher registered for a tool name of `wait_agent` that does not match Codex's actual internal tool call name (`wait`), so the real call never reached the hook capture path.

Neither defect is corrected here. Correcting them is explicitly out of scope for this freeze record and belongs to a future, separately authorized attempt.

## Freeze state

```text
latest known attempt: C4-C-R5-F2
overall verdict: INVALID
research state: FROZEN
active process: none (mock provider PID from this run is not running)
future attempt: requires a new, explicitly authorized task (F3 or later); not authorized by this record
```

`FROZEN` means: no active C4-C runtime process exists, this is the last known attempt, it is not certified, its evidence is preserved (locally, and durably summarized here), and starting a new attempt requires separate authorization. `FROZEN` does not mean C4-C is closed as `PASS`, and does not mean C4-C is abandoned.

## Not established beyond this record's scope

- Whether the concurrent-classification defect or the `wait_agent`/`wait` matcher defect also affected the earlier `R5-F1` or `D4` attempts.
- General Agent-role runtime behavior beyond this tested role, invocation path, and the pinned Codex 0.160.0 release.
- Any claim that this preview-class compilation is, or will become, deployable. `RENDERABLE != USABLE`, `RENDERABLE != DEPLOYABLE`, `TESTABLE != DEPLOYABLE` (ADR 0005) apply unchanged.
