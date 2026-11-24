// The live domain. Only these hosts are indexed; every other host (*.vercel.app, previews,
// localhost) gets noindex headers and a disallow-all robots.txt (next.config.ts, src/proxy.ts).
export const PRODUCTION_HOSTS = ["epublishingworks.com", "www.epublishingworks.com"];

/** Regex source for Next.js `has`/`missing` host conditions. */
export const PRODUCTION_HOST_PATTERN = "(?:www\\.)?epublishingworks\\.com";

export function isProductionHost(host: string | null | undefined) {
  return PRODUCTION_HOSTS.includes((host ?? "").toLowerCase().replace(/:\d+$/, ""));
}
