import { validateCanonicalIntegrity } from "../validate/canonical-integrity.ts";
import { planKiloPreview } from "../../adapters/kilo/preview-plan.ts";
import { buildKiloCandidateBundle } from "../../adapters/kilo/candidate-bundle.ts";

/**
 * Offline JSON export to stdout only. No generated Kilo files or installation.
 * Usage: npm run kilo:preview -- --client desktop --version X.Y.Z --skill ID
 */
async function main(args: string[]): Promise<void> {
  const allowed = new Set(["--client", "--version", "--skill"]);
  const options = new Map<string, string>();
  for (let i = 0; i < args.length; i += 2) {
    if (!allowed.has(args[i]) || !args[i + 1] || options.has(args[i])) {
      throw new Error("Usage: --client desktop|vscode-extension --version X.Y.Z --skill CANONICAL_ID");
    }
    options.set(args[i], args[i + 1]);
  }
  const client = options.get("--client");
  const version = options.get("--version");
  const skill = options.get("--skill");
  if ((client !== "desktop" && client !== "vscode-extension") || !version ||
      !skill || !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(skill)) {
    throw new Error("Explicit --client, --version and safe --skill ID are required.");
  }
  const integrity = await validateCanonicalIntegrity();
  if (integrity.diagnostics.length) throw new Error("Canonical integrity validation failed.");
  const record = integrity.index.byKey.get(`Skill:${skill}`);
  if (!record) throw new Error("Requested canonical skill was not found.");
  const plan = planKiloPreview([{ entity: record, requirement: "REQUIRED" }],
    { client, version, platform: "windows" });
  const bundle = buildKiloCandidateBundle(plan);
  process.stdout.write(JSON.stringify(bundle, null, 2) + "\n");
  if (!bundle.files.length) process.exitCode = 2;
}
main(process.argv.slice(2)).catch(error => {
  process.stderr.write(String(error) + "\n");
  process.exitCode = 1;
});
