import images from "@/generated/legacy-images.json";

const MAP = images as Record<string, string>;
const PREFIX = "/wp-content/uploads/";

// WordPress serves each upload at its own name plus resized copies ("Cover-300x450.jpg") and, for big
// files, a "-scaled" copy. Those all lead back to the one file in the map.
const VARIANT = /-(?:\d+x\d+|scaled|rotated)(?=\.[a-z0-9]+$)/;

export type LegacyImageTarget = { path: string } | { kind: "book" | "author"; slug: string };

const lookup = (key: string) => (Object.hasOwn(MAP, key) ? MAP[key] : undefined);

/**
 * Where an old WordPress image address forwards (Dustin, 2026-11-25: keep the covers' Google Images
 * traffic), or null. A book cover or author photo forwards to that item's current image (the one its
 * page shows), so it's resolved when asked; a site image (logo, photo) to its file here. Only the flat
 * /uploads/ folder held this site's images; the dated folders (/uploads/2019/05/…) belong to an older,
 * unrelated use of the install and stay 404.
 */
export function legacyImage(pathname: string): LegacyImageTarget | null {
  if (!pathname.startsWith(PREFIX)) return null;
  let name: string;
  try {
    name = decodeURIComponent(pathname.slice(PREFIX.length)).toLowerCase();
  } catch {
    return null;
  }
  if (!name || name.includes("/")) return null;
  const once = name.replace(VARIANT, "");
  const value = lookup(name) ?? lookup(once) ?? lookup(once.replace(VARIANT, ""));
  if (!value) return null;
  const item = /^(book|author):(.+)$/.exec(value);
  return item ? { kind: item[1] as "book" | "author", slug: item[2] } : { path: value };
}
