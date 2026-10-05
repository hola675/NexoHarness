export const PROHIBITED_CANONICAL_COUPLING = /\b(?:Codex|Claude|Kilo)\b|Context7|Serena|DBHub|Playwright|GitMCP|Cloudflare MCP|modelId|providerId/i;

export function hasProhibitedCanonicalCoupling(content: string): boolean {
  return PROHIBITED_CANONICAL_COUPLING.test(content);
}
