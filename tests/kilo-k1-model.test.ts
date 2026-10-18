import assert from "node:assert/strict";
import { test } from "node:test";
import type { CanonicalKind } from "../tools/validate/schemas.ts";
import {
  KILO_TARGET,
  KILO_KIND_DISPOSITIONS,
  KILO_AUTHORITY_DIMENSIONS,
  KILO_PERMISSION_BOUNDARY,
} from "../adapters/kilo/index.ts";

const kinds = [
  "Directive", "Policy", "Agent", "Skill", "Rule", "Workflow", "Contract",
  "Capability", "Profile", "Enforcement", "Evaluation", "Observation",
  "ImprovementProposal",
] as const satisfies readonly CanonicalKind[];

test("K1 target is pinned to the approved Windows + VS Code baseline", () => {
  assert.deepEqual(KILO_TARGET, {
    client: "vscode-extension",
    platform: "windows",
    version: "7.8.8",
    sourceCommit: "e2887f08e5a6394299c810ba508f358aaf4c5bc3",
  });
});

test("K1 dispositions cover exactly the 13 registered canonical Kinds", () => {
  assert.deepEqual(Object.keys(KILO_KIND_DISPOSITIONS).sort(), [...kinds].sort());
  assert.equal(KILO_KIND_DISPOSITIONS.Skill, "DIRECT_TRANSLATION");
  assert.equal(KILO_KIND_DISPOSITIONS.Observation, "NEXO_RUNTIME_ONLY");
  assert.equal(KILO_KIND_DISPOSITIONS.ImprovementProposal, "NO_TARGET_ARTIFACT");
});

test("K1 metadata cannot imply target permission grants or provider enablement", () => {
  assert.deepEqual(KILO_AUTHORITY_DIMENSIONS, [
    "sourceModification", "delegation", "commandExecution", "externalMutation",
  ]);
  assert.deepEqual(KILO_PERMISSION_BOUNDARY, {
    emitsAllowRules: false,
    enablesAutonomousMode: false,
    configuresProviders: false,
    permissionSensitiveClaimsRequireRuntimeProbe: true,
  });
});
