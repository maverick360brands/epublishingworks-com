// The site's content model and the pure rules on top of it: what is visible, how the hero
// and book lists are ordered, and what an address resolves to. No I/O here; the catalog
// itself is loaded (and cached) by src/lib/content.ts.

export type Retailer = { name: string; url: string };
export type Seo = { title: string; description: string; image: string };

export type Author = {
  /** Page address segment, e.g. "alice-duncan". */
  slug: string;
  name: string;
  role: string;
  photo: string;
  photoWidth: number;
  photoHeight: number;
  website: string;
  /** Public path, e.g. "/authors/alice-duncan/". */
  url: string;
  order: number;
  bioHtml: string;
  summary: string;
  hidden: boolean;
  updatedAt: string;
  seo: Seo;
};

export type Book = {
  /** Page address segment, e.g. "spirits-adopted-alice-duncan". */
  slug: string;
  title: string;
  subtitle: string;
  /** The authors' `slug` values, in byline order. */
  authorSlugs: string[];
  isbn: string;
  category: "fiction" | "nonfiction" | "children";
  genre: string;
  formats: string[];
  language: string;
  series: string;
  seriesNumber: number | null;
  cover: string;
  coverWidth: number;
  coverHeight: number;
  /** Public path, e.g. "/spirits-adopted-alice-duncan/". */
  url: string;
  retailers: Retailer[];
  descriptionHtml: string;
  summary: string;
  hidden: boolean;
  heroFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  seo: Seo;
};

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string | null;
  updated: string | null;
  authorName: string;
  category: string;
  tags: string[];
  /** Social and schema image: the SEO override, else the cover photo. */
  image: string;
  cover: { url: string; width: number; height: number; alt: string } | null;
  faqs: { q: string; a: string }[];
  summary: string;
  readingMinutes: number;
  toc: { id: string; text: string }[];
  html: string;
  status: "draft" | "published";
  updatedAt: string;
  seo: Seo;
};

export type Redirect = { from: string; to: string };

/** A post's latest real change: its Updated date, publish date, or last edit in the admin. */
export const postModified = (post: Pick<Post, "updated" | "date" | "updatedAt">) =>
  [post.updated, post.date, post.updatedAt].filter((d): d is string => Boolean(d)).sort().pop() ?? null;

export type Catalog = { authors: Author[]; books: Book[]; posts: Post[]; redirects: Redirect[] };

export type Resolution =
  | { kind: "book"; item: Book }
  | { kind: "author"; item: Author }
  | { kind: "post"; item: Post }
  | { kind: "redirect"; to: string; permanent: boolean }
  | { kind: "not-found" };

const HERO_SLOTS = 24;
const MAX_REDIRECT_HOPS = 10;

/** "/about" and "/about/" are the same address. */
export const normalizePath = (path: string) => (path.endsWith("/") ? path : `${path}/`);

const byTitle = (a: Book, b: Book) => a.title.localeCompare(b.title);
const newest = (key: "updatedAt" | "createdAt") => (a: Book, b: Book) => b[key].localeCompare(a[key]);

export const visibleBooks = (c: Catalog) => c.books.filter((b) => !b.hidden);
export const visibleAuthors = (c: Catalog) => c.authors.filter((a) => !a.hidden);

export const publishedPosts = (c: Catalog, includeDrafts: boolean) => c.posts.filter((p) => includeDrafts || p.status === "published");

export function authorsOfBook(c: Catalog, book: Book, opts: { visibleOnly?: boolean } = {}): Author[] {
  return book.authorSlugs
    .map((s) => c.authors.find((a) => a.slug === s))
    .filter((a): a is Author => Boolean(a) && (!opts.visibleOnly || !a!.hidden));
}

/** "Eileen & Kathleen": the book's visible authors (hidden authors aren't named on the site). */
export const bookAuthorLabel = (c: Catalog, book: Book) =>
  authorsOfBook(c, book, { visibleOnly: true })
    .map((a) => a.name)
    .join(" & ");

/** An author's visible books: each series in order, then the rest by title. */
export function booksByAuthor(c: Catalog, authorSlug: string): Book[] {
  return visibleBooks(c)
    .filter((b) => b.authorSlugs.includes(authorSlug))
    .sort((a, b) => a.series.localeCompare(b.series) || (a.seriesNumber ?? 0) - (b.seriesNumber ?? 0) || byTitle(a, b));
}

export function seriesSiblings(c: Catalog, book: Book): Book[] {
  if (!book.series) return [];
  return visibleBooks(c)
    .filter((b) => b.series === book.series && b.seriesNumber !== null)
    .sort((a, b) => (a.seriesNumber ?? 0) - (b.seriesNumber ?? 0));
}

/** Authors listed on the Authors page: visible, with at least one visible book. */
export function directoryAuthors(c: Catalog): Author[] {
  const withBooks = new Set(visibleBooks(c).flatMap((b) => b.authorSlugs));
  return visibleAuthors(c)
    .filter((a) => withBooks.has(a.slug))
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

/** Home hero wall: featured books (most recently edited first), topped up with the newest others. */
export function heroBooks(c: Catalog, slots = HERO_SLOTS): Book[] {
  const books = visibleBooks(c);
  const featured = books.filter((b) => b.heroFeatured).sort(newest("updatedAt"));
  const others = books.filter((b) => !b.heroFeatured).sort(newest("createdAt"));
  return [...featured, ...others].slice(0, slots);
}

/** /books/ order: featured books as in the hero, then everything else A to Z. */
export function booksPageOrder(c: Catalog): Book[] {
  const books = visibleBooks(c);
  return [...books.filter((b) => b.heroFeatured).sort(newest("updatedAt")), ...books.filter((b) => !b.heroFeatured).sort(byTitle)];
}

/** Follows old-address redirects to the final address. Null when there is none or it loops. */
export function followRedirects(redirects: Redirect[], from: string): string | null {
  const next = new Map(redirects.map((r) => [normalizePath(r.from), normalizePath(r.to)]));
  let at = normalizePath(from);
  if (!next.has(at)) return null;
  for (let hop = 0; hop < MAX_REDIRECT_HOPS; hop++) {
    const to = next.get(at);
    if (to === undefined) return at;
    if (to === normalizePath(from)) return null;
    at = to;
  }
  return null;
}

function hiddenBookTarget(c: Catalog, book: Book) {
  return authorsOfBook(c, book, { visibleOnly: true })[0]?.url ?? "/books/";
}

/**
 * What an address shows: a visible item renders; a hidden one redirects temporarily (hiding
 * can be undone); an old address redirects permanently; anything else is not found.
 */
export function resolveSlug(c: Catalog, path: string): Resolution {
  const at = normalizePath(path);
  const book = c.books.find((b) => normalizePath(b.url) === at);
  if (book) return book.hidden ? { kind: "redirect", to: hiddenBookTarget(c, book), permanent: false } : { kind: "book", item: book };
  const author = c.authors.find((a) => normalizePath(a.url) === at);
  if (author) return author.hidden ? { kind: "redirect", to: "/authors/", permanent: false } : { kind: "author", item: author };
  const post = c.posts.find((p) => `/blog/${p.slug}/` === at);
  if (post) return { kind: "post", item: post };
  const to = followRedirects(c.redirects, at);
  return to ? { kind: "redirect", to, permanent: true } : { kind: "not-found" };
}
