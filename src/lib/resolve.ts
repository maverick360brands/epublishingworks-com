import type { Author, Book, Catalog, Post } from "./catalog";
import { resolveSlug } from "./catalog";
import { getCatalog } from "./content";

type Kinds = { book: Book; author: Author; post: Post };

/**
 * The item a content page shows, or null. Redirects and 404 statuses come from the proxy
 * (src/proxy.ts), before the page streams. Pages never throw redirect() or notFound() here:
 * Next.js caches a thrown redirect on a prerendered page outside the "content" tag, so it
 * would outlive the edit that caused it. In the few seconds before the proxy's address
 * table refreshes, a page whose item isn't visible renders the "wandered off" content
 * (noindex) inside the normal cache instead.
 */
export async function resolvePage<K extends keyof Kinds>(path: string, kind: K): Promise<{ c: Catalog; item: Kinds[K] | null }> {
  const c = await getCatalog();
  const result = resolveSlug(c, path);
  return { c, item: result.kind === kind ? (result as unknown as { item: Kinds[K] }).item : null };
}

export const lostMetadata = { title: "Page not found", robots: { index: false, follow: true } } as const;
