// The site's data access. Books, authors, posts, and redirects come from the CMS (Payload on
// Postgres) through one cached snapshot, refreshed whenever an editor saves (cache tag
// "content"). Developer-edited pages (privacy, terms, roadmap) still come from Markdown.
import config from "@payload-config";
import { cacheLife, cacheTag } from "next/cache";
import { getPayload } from "payload";
import data from "@/generated/content.json";
import type { Catalog } from "./catalog";
import { docsToCatalog, type RawCatalog } from "./catalog-source";

export * from "./catalog";

export type Page = { slug: string; title: string; description: string; updated: string | null; html: string; toc: { id: string; text: string }[] };

const pages = data.pages as Record<string, Page>;
export const getPage = (slug: string) => pages[slug];
export const buildYear = (data as { buildYear: number }).buildYear;

/** Drafts show in development and on Vercel previews (for review), never in production. */
export const showDrafts = process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV === "preview";

export async function getCatalog(): Promise<Catalog> {
  "use cache";
  cacheTag("content");
  cacheLife("max");
  const payload = await getPayload({ config });
  const all = (collection: "authors" | "books" | "posts" | "redirects", extra: object = {}) =>
    (payload.find as unknown as (a: object) => Promise<{ docs: RawCatalog["books"] }>)({ collection, limit: 10_000, depth: 1, pagination: false, ...extra }).then((r) => r.docs);
  const [authors, books, posts, redirects] = await Promise.all([
    all("authors", { depth: 1, joins: false }),
    all("books"),
    all("posts", showDrafts ? { draft: true } : { where: { _status: { equals: "published" } } }),
    all("redirects", { depth: 0 }),
  ]);
  return docsToCatalog({ authors, books, posts, redirects });
}
