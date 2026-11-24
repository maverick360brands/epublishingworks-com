// Public paths for CMS documents. Books live at the site root, authors under /authors/,
// posts under /blog/ (all with trailing slashes, like the WordPress URLs).
export type ContentCollection = "books" | "authors" | "posts";

export function pathOf(collection: ContentCollection, doc: { slug?: unknown }): string | null {
  const slug = typeof doc.slug === "string" ? doc.slug : "";
  if (!slug) return null;
  if (collection === "books") return `/${slug}/`;
  if (collection === "authors") return `/authors/${slug}/`;
  return `/blog/${slug}/`;
}

/** Whether a document is publicly visible (published and not hidden). */
export function isPublic(collection: ContentCollection, doc: Record<string, unknown> | undefined): boolean {
  if (!doc) return false;
  if (collection === "posts") return doc._status === "published";
  return !doc.hidden;
}
