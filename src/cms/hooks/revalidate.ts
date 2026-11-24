import { revalidateTag } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";

/** Refreshes every cached page that reads CMS content (one shared "content" tag). */
export function refreshSite(context: Record<string, unknown> | undefined) {
  if (context?.skipRevalidate) return;
  try {
    // Expire at once: with "max" (stale-while-revalidate) the first visit to a book added a
    // moment ago rendered from the old catalog, and that "not found" render was cached.
    revalidateTag("content", { expire: 0 });
  } catch {
    // Outside a Next.js request (CLI migrations, scripts) there is no cache to refresh.
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc, req }) => {
  refreshSite(req.context);
  return doc;
};

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  refreshSite(req.context);
  return doc;
};
