import { describe, expect, it } from "vitest";
import { existsSync, statSync } from "node:fs";
import { docsToCatalog } from "@/lib/catalog-source";
import { POST_ILLUSTRATIONS } from "@/lib/post-art";

const text = (t: string, tag?: string) => ({
  type: tag ? "heading" : "paragraph",
  ...(tag ? { tag } : {}),
  version: 1,
  direction: null,
  format: "",
  indent: 0,
  children: [{ type: "text", text: t, version: 1, detail: 0, format: 0, mode: "normal", style: "" }],
});
const rich = (...children: object[]) => ({ root: { type: "root", version: 1, direction: null, format: "", indent: 0, children } });

const cover = { id: 7, url: "https://x.public.blob.vercel-storage.com/provider.jpg", width: 600, height: 899, alt: "Cover of Provider" };
const ben = { id: 1, name: "Benjamin Kroeske", slug: "benkroeske", role: "", website: "", order: 50, hidden: false, bio: rich(text("Ben preaches.")), photo: null, updatedAt: "2026-11-01T00:00:00.000Z", seo: {} };
const raw = {
  authors: [ben],
  books: [
    {
      id: 3,
      title: "Provider",
      subtitle: "",
      slug: "provider",
      authors: [ben],
      cover,
      isbn: "123",
      category: "nonfiction",
      language: "en",
      formats: ["Paperback", "eBook"],
      series: "",
      seriesNumber: null,
      retailers: [{ id: "a", name: "Amazon", url: "https://amazon.com/x" }],
      description: rich(text("We know God as Provider. ".repeat(12).trim())),
      summary: "",
      heroFeatured: true,
      hidden: false,
      createdAt: "2026-10-01T00:00:00.000Z",
      updatedAt: "2026-11-02T00:00:00.000Z",
      seo: { title: "", description: null, image: null },
    },
  ],
  posts: [
    {
      id: 9,
      title: "How to publish",
      slug: "how-to-publish",
      description: "d",
      summary: "s",
      category: "Publishing",
      date: "2026-11-05T00:00:00.000Z",
      updated: null,
      authorName: "ePublishingWorks",
      tags: ["a"],
      faqs: [{ id: "f", q: "Q?", a: "A." }],
      body: rich(text("Step one", "h2"), text("Do it.")),
      _status: "published",
      updatedAt: "2026-11-06T00:00:00.000Z",
      seo: {},
    },
  ],
  redirects: [{ id: 1, from: "/old/", to: "/provider/", reason: "address-changed" }],
};

describe("docsToCatalog", () => {
  const c = docsToCatalog(raw as never);
  const book = c.books[0];

  it("uses the Blob image and its size for the cover", () => {
    expect(book.cover).toBe(cover.url);
    expect([book.coverWidth, book.coverHeight]).toEqual([600, 899]);
  });

  it("builds public paths from page addresses", () => {
    expect(book.url).toBe("/provider/");
    expect(c.authors[0].url).toBe("/authors/benkroeske/");
    expect(book.authorSlugs).toEqual(["benkroeske"]);
  });

  it("falls back to an excerpt of the description when there's no summary", () => {
    expect(book.summary.startsWith("We know God as Provider.")).toBe(true);
    expect(book.summary.endsWith("…")).toBe(true);
  });

  it("renders post bodies with a table of contents", () => {
    const post = c.posts[0];
    expect(post.status).toBe("published");
    expect(post.toc).toEqual([{ id: "step-one", text: "Step one" }]);
    expect(post.faqs).toEqual([{ q: "Q?", a: "A." }]);
  });

  it("defaults empty SEO fields to empty strings", () => {
    expect(book.seo).toEqual({ title: "", description: "", image: "" });
  });

  it("drops the trailing slash Payload adds to local file URLs", () => {
    const local = docsToCatalog({ ...raw, books: [{ ...raw.books[0], cover: { ...cover, url: "/api/cms/media/file/provider-12.jpg/" } }] } as never);
    expect(local.books[0].cover).toBe("/api/cms/media/file/provider-12.jpg");
  });

  it("gives a post its illustration when no cover was uploaded, and the uploaded cover wins", () => {
    const post = (slug: string, extra = {}) => docsToCatalog({ ...raw, posts: [{ ...raw.posts[0], slug, ...extra }] } as never).posts[0];
    const art = post("book-royalties-explained");
    expect(art.cover?.url).toBe("/images/blog/book-royalties-explained.webp");
    expect(art.cover?.alt).toMatch(/^Cut-paper illustration/);
    expect(art.image).toBe("/images/blog/book-royalties-explained-share.jpg");
    const uploaded = post("book-royalties-explained", { cover });
    expect(uploaded.cover).toEqual({ url: cover.url, width: 600, height: 899, alt: cover.alt });
    expect(uploaded.image).toBe(cover.url);
    expect(post("a-post-with-no-art").cover).toBeNull();
  });

  it("gives every illustration a WebP cover and a JPEG share image on disk", () => {
    for (const [slug, a] of Object.entries(POST_ILLUSTRATIONS)) {
      expect(existsSync(`public${a.url}`), slug).toBe(true);
      expect(existsSync(`public${a.share}`), slug).toBe(true);
      expect(statSync(`public${a.url}`).size).toBeLessThan(300 * 1024);
      expect(a.alt.length).toBeGreaterThan(20);
    }
  });

  it("keeps the redirects", () => {
    expect(c.redirects).toEqual([{ from: "/old/", to: "/provider/" }]);
  });
});
