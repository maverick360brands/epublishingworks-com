import images from "@/generated/legacy-images.json";

const MAP = images as Record<string, string>;
const PREFIX = "/wp-content/uploads/";

// WordPress serves each upload at its own name plus resized copies ("Cover-300x450.jpg") and, for big
// files, a "-scaled" copy. Those all lead back to the one file in the map.
const VARIANT = /-(?:\d+x\d+|scaled|rotated)(?=\.[a-z0-9]+$)/;

/**
 * The new image an old WordPress image address forwards to (Dustin, 2026-11-25: keep the covers' Google
 * Images traffic), or null. Only the flat /uploads/ folder held this site's images; the dated folders
 * (/uploads/2019/05/…) belong to an older, unrelated use of the install and stay 404.
 */
export function legacyImage(pathname: string): string | null {
  if (!pathname.startsWith(PREFIX)) return null;
  let name: string;
  try {
    name = decodeURIComponent(pathname.slice(PREFIX.length)).toLowerCase();
  } catch {
    return null;
  }
  if (!name || name.includes("/")) return null;
  return MAP[name] ?? MAP[name.replace(VARIANT, "")] ?? MAP[name.replace(VARIANT, "").replace(VARIANT, "")] ?? null;
}
