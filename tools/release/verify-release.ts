export type ReleaseClassification = "phase" | "prerelease" | "stable";

export interface ReleaseInfo {
  tag: string;
  classification: ReleaseClassification;
  title: string;
}

const phaseTagPattern = /^phase-(\d+\.\d+(?:\.\d+)?)-certified$/;
const prereleaseTagPattern = /^v\d+\.\d+\.\d+-(?:alpha|beta|rc)\.\d+$/;
const stableTagPattern = /^v\d+\.\d+\.\d+$/;
const fullShaPattern = /^[0-9a-f]{40}$/i;

export function isFullCommitSha(value: string): boolean {
  return fullShaPattern.test(value);
}

export function parseReleaseTag(tag: string): ReleaseInfo {
  if (phaseTagPattern.test(tag)) {
    return { tag, classification: "phase", title: `NexoHarness ${tag}` };
  }
  if (prereleaseTagPattern.test(tag)) {
    return { tag, classification: "prerelease", title: `NexoHarness ${tag}` };
  }
  if (stableTagPattern.test(tag)) {
    return { tag, classification: "stable", title: `NexoHarness ${tag}` };
  }
  throw new Error(`Unsupported release tag: ${tag}`);
}

export function assertPhase(phase: string): void {
  if (!/^\d+\.\d+(?:\.\d+)?$/.test(phase)) {
    throw new Error(`Invalid phase: ${phase}`);
  }
}

export function assertFullCommitSha(value: string): void {
  if (!isFullCommitSha(value)) {
    throw new Error("approved-sha must be a full 40-character Git commit SHA.");
  }
}

function parseCli(argv: string[]): { tag: string } {
  if (argv.length !== 2 || argv[0] !== "--tag" || !argv[1]) {
    throw new Error("Usage: verify-release.ts --tag <tag>");
  }
  return { tag: argv[1] };
}

if (process.argv[1]?.endsWith("verify-release.ts")) {
  const { tag } = parseCli(process.argv.slice(2));
  console.log(JSON.stringify(parseReleaseTag(tag)));
}
