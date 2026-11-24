// The proxy's view of the site's addresses: which books, authors, and posts exist, which are
// hidden, and which old addresses redirect. Read straight from Postgres (a few small queries)
// and kept in memory, refreshed in the background every 30 seconds, so the proxy can answer
// with a real 404 or redirect before a page starts streaming. Pages apply the same rules.
import type { Author, Book, Catalog, Post } from "./catalog";

export type RouteManifest = {
  books: { slug: string; hidden: boolean; authorSlugs: string[] }[];
  authors: { slug: string; hidden: boolean }[];
  posts: { slug: string; published: boolean }[];
  redirects: { from: string; to: string }[];
};

type Query = (sql: string) => Promise<Record<string, unknown>[]>;

export async function loadManifest(query: Query): Promise<RouteManifest> {
  const [books, links, authors, posts, redirects] = await Promise.all([
    query(`select id, slug, coalesce(hidden, false) as hidden from books`),
    query(`select r.parent_id, a.slug from books_rels r join authors a on a.id = r.authors_id where r.path = 'authors' order by r.parent_id, r."order"`),
    query(`select slug, coalesce(hidden, false) as hidden from authors`),
    query(`select slug, _status from posts`),
    query(`select "from", "to" from redirects`),
  ]);
  const authorsOf = new Map<unknown, string[]>();
  for (const l of links) authorsOf.set(l.parent_id, [...(authorsOf.get(l.parent_id) ?? []), String(l.slug)]);
  return {
    books: books.map((b) => ({ slug: String(b.slug), hidden: Boolean(b.hidden), authorSlugs: authorsOf.get(b.id) ?? [] })),
    authors: authors.map((a) => ({ slug: String(a.slug), hidden: Boolean(a.hidden) })),
    posts: posts.map((p) => ({ slug: String(p.slug), published: p._status === "published" })),
    redirects: redirects.map((r) => ({ from: String(r.from), to: String(r.to) })),
  };
}

const seo = { title: "", description: "", image: "" };

/** A catalog with just enough fields for resolveSlug(). */
export function manifestToCatalog(m: RouteManifest, opts: { includeDrafts?: boolean } = {}): Catalog {
  const books = m.books.map((b) => ({ slug: b.slug, url: `/${b.slug}/`, hidden: b.hidden, authorSlugs: b.authorSlugs, seo }) as unknown as Book);
  const authors = m.authors.map((a) => ({ slug: a.slug, url: `/authors/${a.slug}/`, hidden: a.hidden, seo }) as unknown as Author);
  const posts = m.posts.filter((p) => p.published || opts.includeDrafts).map((p) => ({ slug: p.slug, status: p.published ? "published" : "draft" }) as unknown as Post);
  return { books, authors, posts, redirects: m.redirects };
}

/**
 * Stale-while-revalidate memory cache around a loader. Never throws; null means "unknown"
 * (the proxy then lets the request through). A cold instance waits at most firstLoadTimeoutMs
 * for the first load, so a slow or waking database never stalls visitors.
 */
export function createManifestCache(load: () => Promise<RouteManifest>, { ttlMs = 30_000, now = Date.now, firstLoadTimeoutMs = 1_500 } = {}) {
  let data: RouteManifest | null = null;
  let loadedAt = 0;
  let inflight: Promise<void> | null = null;

  const refresh = () => {
    inflight ??= load()
      .then((m) => {
        data = m;
        loadedAt = now();
      })
      .catch((error) => console.error("Route manifest refresh failed", error))
      .finally(() => {
        inflight = null;
      });
    return inflight;
  };

  return async function getManifest(): Promise<RouteManifest | null> {
    if (!data) {
      let timer: ReturnType<typeof setTimeout> | undefined;
      await Promise.race([refresh(), new Promise<void>((resolve) => (timer = setTimeout(resolve, firstLoadTimeoutMs)))]);
      clearTimeout(timer);
      return data;
    }
    if (now() - loadedAt >= ttlMs) void refresh();
    return data;
  };
}
