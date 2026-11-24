// Maps CMS documents (Payload, depth 1) to the site's content model in src/lib/catalog.ts.
// Pure: no database access here, so it can be tested on its own.
import type { Author, Book, Catalog, Post, Seo } from "./catalog";
import { POST_ILLUSTRATIONS, illustrationCover } from "./post-art";
import { excerpt, lexicalToHtml, textOf, withToc } from "./richtext";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Doc = Record<string, any>;
export type RawCatalog = { authors: Doc[]; books: Doc[]; posts: Doc[]; redirects: Doc[] };

const str = (v: unknown) => (typeof v === "string" ? v : "");
const media = (m: unknown) => (m && typeof m === "object" ? (m as Doc) : null);
// Payload adds a trailing slash to local file URLs when Next's trailingSlash is on, and Next
// then redirects them, which the image optimizer won't follow. Files never take the slash.
const fileUrl = (m: Doc | null) => str(m?.url).replace(/(\.[a-z0-9]+)\/$/i, "$1");

function seoOf(doc: Doc): Seo {
  const seo = (doc.seo ?? {}) as Doc;
  return { title: str(seo.title), description: str(seo.description), image: fileUrl(media(seo.image)) };
}

function toAuthor(doc: Doc): Author {
  const photo = media(doc.photo);
  const bioHtml = lexicalToHtml(doc.bio);
  return {
    slug: str(doc.slug),
    name: str(doc.name),
    role: str(doc.role),
    photo: fileUrl(photo),
    photoWidth: Number(photo?.width ?? 0),
    photoHeight: Number(photo?.height ?? 0),
    website: str(doc.website),
    url: `/authors/${str(doc.slug)}/`,
    order: Number(doc.order ?? 50),
    bioHtml,
    summary: excerpt(bioHtml),
    hidden: Boolean(doc.hidden),
    updatedAt: str(doc.updatedAt),
    seo: seoOf(doc),
  };
}

function toBook(doc: Doc, authorSlugById: Map<unknown, string>): Book {
  const cover = media(doc.cover);
  const descriptionHtml = lexicalToHtml(doc.description);
  const authorSlugs = ((doc.authors ?? []) as unknown[])
    .map((a) => (a && typeof a === "object" ? str((a as Doc).slug) : authorSlugById.get(a)))
    .filter((s): s is string => Boolean(s));
  return {
    slug: str(doc.slug),
    title: str(doc.title),
    subtitle: str(doc.subtitle),
    authorSlugs,
    isbn: str(doc.isbn),
    category: (doc.category ?? "fiction") as Book["category"],
    genre: str(doc.genre),
    formats: (doc.formats ?? []) as string[],
    language: str(doc.language) || "en",
    series: str(doc.series),
    seriesNumber: typeof doc.seriesNumber === "number" ? doc.seriesNumber : null,
    cover: fileUrl(cover),
    coverWidth: Number(cover?.width ?? 0),
    coverHeight: Number(cover?.height ?? 0),
    url: `/${str(doc.slug)}/`,
    retailers: ((doc.retailers ?? []) as Doc[]).map((r) => ({ name: str(r.name), url: str(r.url) })),
    descriptionHtml,
    summary: str(doc.summary) || excerpt(descriptionHtml),
    hidden: Boolean(doc.hidden),
    heroFeatured: Boolean(doc.heroFeatured),
    createdAt: str(doc.createdAt),
    updatedAt: str(doc.updatedAt),
    seo: seoOf(doc),
  };
}

function toPost(doc: Doc): Post {
  const { html, toc } = withToc(lexicalToHtml(doc.body));
  const words = textOf(html).split(/\s+/).filter(Boolean).length;
  const seo = seoOf(doc);
  const coverDoc = media(doc.cover);
  const uploaded = coverDoc && fileUrl(coverDoc)
    ? { url: fileUrl(coverDoc), width: Number(coverDoc.width ?? 0), height: Number(coverDoc.height ?? 0), alt: str(coverDoc.alt) }
    : null;
  const art = POST_ILLUSTRATIONS[str(doc.slug)];
  const cover = uploaded ?? illustrationCover(str(doc.slug));
  return {
    slug: str(doc.slug),
    title: str(doc.title),
    description: str(doc.description),
    date: str(doc.date) || null,
    updated: str(doc.updated) || null,
    authorName: str(doc.authorName) || "ePublishingWorks",
    category: str(doc.category) || "Publishing",
    tags: (doc.tags ?? []) as string[],
    image: seo.image || uploaded?.url || art?.share || "",
    cover,
    faqs: ((doc.faqs ?? []) as Doc[]).map((f) => ({ q: str(f.q), a: str(f.a) })),
    summary: str(doc.summary),
    readingMinutes: Math.max(1, Math.round(words / 230)),
    toc,
    html,
    status: doc._status === "draft" ? "draft" : "published",
    updatedAt: str(doc.updatedAt),
    seo,
  };
}

export function docsToCatalog(raw: RawCatalog): Catalog {
  const authors = raw.authors.map(toAuthor).sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  const authorSlugById = new Map(raw.authors.map((a) => [a.id, str(a.slug)]));
  return {
    authors,
    books: raw.books.map((b) => toBook(b, authorSlugById)).sort((a, b) => a.title.localeCompare(b.title)),
    posts: raw.posts.map(toPost).sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "")),
    redirects: raw.redirects.map((r) => ({ from: str(r.from), to: str(r.to) })),
  };
}
