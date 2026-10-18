import { readFile } from "node:fs/promises";
import { preflightKiloInstall } from "../../adapters/kilo/install-preflight.ts";

/** Read-only offline inspection. Does not inspect or mutate Kilo installations. */
async function main(args: string[]): Promise<void> {
  if (args.length !== 2 || args[0] !== "--bundle" || !args[1] ||
      args[1].startsWith("-")) throw new Error("Usage: npm run kilo:preflight -- --bundle path/to/candidate.json");
  const raw = await readFile(args[1], "utf8");
  if (raw.length > 5_000_000) throw new Error("Bundle too large");
  const result = preflightKiloInstall(JSON.parse(raw) as unknown);
  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  if (result.diagnostics.some(d => !["INSTALLER_NOT_AUTHORIZED", "RUNTIME_EVIDENCE_REQUIRED", "UNVERIFIED_TARGET_OR_SELECTION"].includes(d))) {
    process.exitCode = 2;
  }
}
main(process.argv.slice(2)).catch(e => {
  process.stderr.write(String(e) + "\n");
  process.exitCode = 1;
});
