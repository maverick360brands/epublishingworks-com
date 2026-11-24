// The catalog straight from the compiled Markdown (src/generated/content.json), for a preview
// deployment without a database (CONTENT_SOURCE=files). It mirrors what the CMS import produces:
// addresses from each file's url, featured books first in their rank order. The admin needs the
// database, so it doesn't work in this mode; everything visitors see does.
import data from "@/generated/content.json";
import type { Author, Book, Catalog, Post } from "./catalog";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Raw = Record<string, any>;
const seo = { title: "", description: "", image: "" };
const segmentOf = (url: string) => url.split("/").filter(Boolean).pop() ?? "";
const BASE = Date.UTC(2026, 10, 24);
const iso = (ms: number) => new Date(ms).toISOString();

export function filesCatalog(): Catalog {
  const raw = data as unknown as { authors: Raw[]; books: Raw[]; posts: Raw[] };
  const authorSegment = new Map(raw.authors.map((a) => [String(a.slug), segmentOf(String(a.url))]));

  const authors: Author[] = raw.authors.map((a) => ({
    slug: segmentOf(String(a.url)),
    name: String(a.name),
    role: String(a.role ?? ""),
    photo: String(a.photo ?? ""),
    photoWidth: Number(a.photoWidth ?? 0),
    photoHeight: Number(a.photoHeight ?? 0),
    website: String(a.website ?? ""),
    url: String(a.url),
    order: Number(a.order ?? 50),
    bioHtml: String(a.bioHtml ?? ""),
    summary: String(a.summary ?? ""),
    hidden: false,
    updatedAt: iso(BASE),
    seo,
  }));

  const rank = (b: Raw) => (typeof b.featured === "number" ? b.featured : b.featured ? 999 : null);
  const books: Book[] = raw.books.map((b, i) => {
    const r = rank(b);
    const stamp = iso(r === null ? BASE - 3_600_000 - i * 1000 : BASE - r * 1000);
    return {
      slug: segmentOf(String(b.url)),
      title: String(b.title),
      subtitle: String(b.subtitle ?? ""),
      authorSlugs: (b.authorSlugs as string[]).map((s) => authorSegment.get(s) ?? s),
      isbn: String(b.isbn ?? ""),
      category: b.category ?? "fiction",
      genre: String(b.genre ?? ""),
      formats: (b.formats ?? []) as string[],
      language: String(b.language ?? "en"),
      series: String(b.series ?? ""),
      seriesNumber: typeof b.seriesNumber === "number" ? b.seriesNumber : null,
      cover: String(b.cover),
      coverWidth: Number(b.coverWidth ?? 0),
      coverHeight: Number(b.coverHeight ?? 0),
      url: String(b.url),
      retailers: (b.retailers ?? []) as Book["retailers"],
      descriptionHtml: String(b.descriptionHtml ?? ""),
      summary: String(b.summary ?? ""),
      hidden: false,
      heroFeatured: r !== null,
      createdAt: stamp,
      updatedAt: stamp,
      seo,
    };
  });

  const posts: Post[] = raw.posts.map((p) => ({
    slug: String(p.slug),
    title: String(p.title),
    description: String(p.description ?? ""),
    date: p.date ?? null,
    updated: p.updated ?? null,
    authorName: String(p.authorName ?? "ePublishingWorks"),
    category: String(p.category ?? "Publishing"),
    tags: (p.tags ?? []) as string[],
    image: String(p.image ?? ""),
    cover: null,
    faqs: (p.faqs ?? []) as Post["faqs"],
    summary: String(p.summary ?? ""),
    readingMinutes: Number(p.readingMinutes ?? 1),
    toc: (p.toc ?? []) as Post["toc"],
    html: String(p.html ?? ""),
    status: p.draft ? "draft" : "published",
    updatedAt: p.updated ?? p.date ?? iso(BASE),
    seo: { ...seo, title: "" },
  }));

  return {
    authors: authors.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
    books: books.sort((a, b) => a.title.localeCompare(b.title)),
    posts: posts.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "")),
    redirects: [],
  };
}
