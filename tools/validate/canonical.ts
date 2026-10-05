import { validateCanonicalIntegrity } from "./canonical-integrity.ts";
import type { SchemaBundle } from "./schemas.ts";

export { parseFrontmatter } from "./frontmatter.ts";

export async function validateCanonical(bundle?: SchemaBundle): Promise<number> {
  const result = await validateCanonicalIntegrity(bundle);
  return result.entityCount;
}

if (process.argv[1]?.endsWith("canonical.ts")) {
  const count = await validateCanonical();
  console.log(`Canonical validation passed for ${count} entities.`);
}
