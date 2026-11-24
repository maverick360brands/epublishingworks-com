import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionBeforeChangeHook, PayloadRequest } from "payload";
import { after } from "next/server";
import { notifyIndexNow } from "../indexnow";
import { isPublic, pathOf, type ContentCollection } from "../paths";

type Reason = "address-changed" | "deleted";

async function findRedirects(req: PayloadRequest, where: Record<string, unknown>) {
  const { docs } = await req.payload.find({ collection: "redirects", where: where as never, limit: 1000, depth: 0, req });
  return docs as unknown as { id: number; from: string; to: string }[];
}

/**
 * Points `from` at `to`: removes any redirect *from* the new address (it's live again, so a
 * rename back can't loop), re-points redirects that ended at `from`, then records from → to.
 */
async function moveAddress(req: PayloadRequest, from: string, to: string, reason: Reason) {
  for (const r of await findRedirects(req, { from: { equals: to } })) {
    await req.payload.delete({ collection: "redirects", id: r.id, req });
  }
  for (const r of await findRedirects(req, { to: { equals: from } })) {
    await req.payload.update({ collection: "redirects", id: r.id, data: { to }, req });
  }
  const [existing] = await findRedirects(req, { from: { equals: from } });
  if (existing) await req.payload.update({ collection: "redirects", id: existing.id, data: { to, reason }, req });
  else await req.payload.create({ collection: "redirects", data: { from, to, reason }, req });
}

/** A live address can't also be a redirect: drop any redirect from it. */
async function clearRedirectFrom(req: PayloadRequest, path: string) {
  for (const r of await findRedirects(req, { from: { equals: path } })) {
    await req.payload.delete({ collection: "redirects", id: r.id, req });
  }
}

/**
 * Tells IndexNow after the response is sent (tied to the request, so serverless doesn't drop
 * it). Skipped for saves that ask not to refresh the site, such as the build-time import.
 */
function pingIndexNow(req: PayloadRequest, paths: (string | null)[]) {
  if (req.context?.skipRevalidate) return;
  const list = paths.filter((p): p is string => Boolean(p));
  try {
    after(() => notifyIndexNow(list));
  } catch {
    void notifyIndexNow(list); // outside a Next.js request (scripts)
  }
}

const publishedKey = (id: unknown) => `publishedAddress:${String(id)}`;

/**
 * Posts have drafts, so the address that matters is the *published* one, not the last saved
 * draft. Before a post save, remember the currently published address for trackAddress().
 */
export const rememberPublishedAddress: CollectionBeforeChangeHook = async ({ originalDoc, operation, req, data }) => {
  if (operation !== "update" || !originalDoc?.id) return data;
  const current = await req.payload.findByID({ collection: "posts", id: originalDoc.id, depth: 0, draft: false, req, disableErrors: true });
  let published = current && current._status === "published" ? pathOf("posts", current) : null;
  if (!published) {
    // Unpublished now: the address people may have linked to is the last one that was live.
    const { docs } = await req.payload.findVersions({
      collection: "posts",
      where: { and: [{ parent: { equals: originalDoc.id } }, { "version._status": { equals: "published" } }] },
      sort: "-updatedAt",
      limit: 1,
      depth: 0,
      req,
    });
    published = docs[0] ? pathOf("posts", docs[0].version as { slug?: unknown }) : null;
  }
  req.context[publishedKey(originalDoc.id)] = published;
  return data;
};

/** Posts: act only when a save publishes, comparing against the previously published address. */
const trackPostAddress: CollectionAfterChangeHook = async ({ doc, req }) => {
  if (doc._status !== "published") return doc;
  const now = pathOf("posts", doc);
  const before = (req.context[publishedKey(doc.id)] as string | null | undefined) ?? null;
  if (now) await clearRedirectFrom(req, now);
  if (before && now && before !== now) await moveAddress(req, before, now, "address-changed");
  pingIndexNow(req, [before, now]);
  return doc;
};

/** After a save: keep old addresses working, free the current one, and ping IndexNow. */
export const trackAddress =
  (collection: ContentCollection): CollectionAfterChangeHook =>
  async (args) => {
    if (collection === "posts") return trackPostAddress(args);
    const { doc, previousDoc, operation, req } = args;
    const now = pathOf(collection, doc);
    const before = operation === "update" ? pathOf(collection, previousDoc ?? {}) : null;
    const wasPublic = operation === "update" && isPublic(collection, previousDoc);
    const nowPublic = isPublic(collection, doc);

    if (now) await clearRedirectFrom(req, now);
    // Hidden items keep their history too, so old links work again once they're unhidden.
    if (before && now && before !== now) await moveAddress(req, before, now, "address-changed");

    if (wasPublic || nowPublic) pingIndexNow(req, [before, now]);
    return doc;
  };

async function deletedTarget(collection: ContentCollection, doc: Record<string, unknown>, req: PayloadRequest) {
  if (collection === "posts") return "/blog/";
  if (collection === "authors") return "/authors/";
  const first = Array.isArray(doc.authors) ? doc.authors[0] : null;
  const id = typeof first === "object" && first !== null ? (first as { id: number }).id : first;
  if (id === null || id === undefined) return "/books/";
  const author = await req.payload.findByID({ collection: "authors", id: id as number, depth: 0, req, disableErrors: true });
  return author && !author.hidden ? (pathOf("authors", author) ?? "/books/") : "/books/";
}

/** After a delete: send the old address somewhere useful, permanently. */
export const redirectDeleted =
  (collection: ContentCollection): CollectionAfterDeleteHook =>
  async ({ doc, req }) => {
    const from = pathOf(collection, doc);
    if (!from || (collection === "posts" && doc._status !== "published")) return doc;
    await moveAddress(req, from, await deletedTarget(collection, doc, req), "deleted");
    pingIndexNow(req, [from]);
    return doc;
  };
