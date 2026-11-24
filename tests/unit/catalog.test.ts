import { describe, expect, it } from "vitest";
import {
  bookAuthorLabel,
  booksByAuthor,
  directoryAuthors,
  heroBooks,
  publishedPosts,
  resolveSlug,
  type Author,
  type Book,
  type Catalog,
  type Post,
} from "@/lib/catalog";

const seo = { title: "", description: "", image: "" };

function author(slug: string, over: Partial<Author> = {}): Author {
  return {
    slug,
    name: slug,
    role: "",
    photo: "",
    photoWidth: 0,
    photoHeight: 0,
    website: "",
    url: `/authors/${slug}/`,
    order: 50,
    bioHtml: "",
    summary: "",
    hidden: false,
    updatedAt: "2026-11-01T00:00:00.000Z",
    seo,
    ...over,
  };
}

function book(slug: string, over: Partial<Book> = {}): Book {
  return {
    slug,
    title: slug,
    subtitle: "",
    authorSlugs: ["benkroeske"],
    isbn: "",
    category: "nonfiction",
    formats: [],
    language: "en",
    series: "",
    seriesNumber: null,
    cover: `/c/${slug}.jpg`,
    coverWidth: 600,
    coverHeight: 900,
    url: `/${slug}/`,
    retailers: [],
    descriptionHtml: "",
    summary: "",
    hidden: false,
    heroFeatured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    seo,
    ...over,
  };
}

function post(slug: string, status: Post["status"]): Post {
  return {
    slug,
    title: slug,
    description: "",
    date: null,
    updated: null,
    authorName: "ePublishingWorks",
    category: "Publishing",
    tags: [],
    image: "",
    cover: null,
    faqs: [],
    summary: "",
    readingMinutes: 1,
    toc: [],
    html: "",
    status,
    updatedAt: "2026-11-01T00:00:00.000Z",
    seo,
  };
}

const catalog = (c: Partial<Catalog>): Catalog => ({ authors: [author("benkroeske")], books: [], posts: [], redirects: [], ...c });

describe("heroBooks", () => {
  it("puts featured books first, newest edit first, then the rest newest first", () => {
    const c = catalog({
      books: [
        book("older-featured", { heroFeatured: true, updatedAt: "2026-11-01T00:00:00.000Z" }),
        book("plain-a", { createdAt: "2026-03-01T00:00:00.000Z" }),
        book("newer-featured", { heroFeatured: true, updatedAt: "2026-11-02T00:00:00.000Z" }),
        book("plain-b", { createdAt: "2026-05-01T00:00:00.000Z" }),
        book("plain-c", { createdAt: "2026-04-01T00:00:00.000Z" }),
      ],
    });
    expect(heroBooks(c).map((b) => b.slug)).toEqual(["newer-featured", "older-featured", "plain-b", "plain-c", "plain-a"]);
  });

  it("leaves out hidden books, even featured ones", () => {
    const c = catalog({ books: [book("shown"), book("hidden-featured", { heroFeatured: true, hidden: true })] });
    expect(heroBooks(c).map((b) => b.slug)).toEqual(["shown"]);
  });

  it("returns an empty list for an empty catalog", () => {
    expect(heroBooks(catalog({}))).toEqual([]);
  });

  it("returns at most 24 books", () => {
    const c = catalog({ books: Array.from({ length: 30 }, (_, i) => book(`b${i}`, { heroFeatured: true })) });
    expect(heroBooks(c)).toHaveLength(24);
  });
});

describe("resolveSlug", () => {
  it("finds a visible book", () => {
    const c = catalog({ books: [book("provider")] });
    expect(resolveSlug(c, "/provider/")).toMatchObject({ kind: "book", item: { slug: "provider" } });
  });

  it("sends a hidden book to its author's page, temporarily", () => {
    const c = catalog({ books: [book("provider", { hidden: true })] });
    expect(resolveSlug(c, "/provider/")).toEqual({ kind: "redirect", to: "/authors/benkroeske/", permanent: false });
  });

  it("sends a hidden book whose authors are all hidden to /books/", () => {
    const c = catalog({ authors: [author("benkroeske", { hidden: true })], books: [book("provider", { hidden: true })] });
    expect(resolveSlug(c, "/provider/")).toEqual({ kind: "redirect", to: "/books/", permanent: false });
  });

  it("sends a hidden author to /authors/", () => {
    const c = catalog({ authors: [author("benkroeske", { hidden: true })] });
    expect(resolveSlug(c, "/authors/benkroeske/")).toEqual({ kind: "redirect", to: "/authors/", permanent: false });
  });

  it("follows a chain of old addresses to the final one, permanently", () => {
    const c = catalog({
      books: [book("new")],
      redirects: [
        { from: "/old/", to: "/mid/" },
        { from: "/mid/", to: "/new/" },
      ],
    });
    expect(resolveSlug(c, "/old/")).toEqual({ kind: "redirect", to: "/new/", permanent: true });
  });

  it("prefers a visible item over a redirect from the same address", () => {
    const c = catalog({ books: [book("old")], redirects: [{ from: "/old/", to: "/elsewhere/" }] });
    expect(resolveSlug(c, "/old/")).toMatchObject({ kind: "book" });
  });

  it("treats a redirect loop as not found", () => {
    const c = catalog({
      redirects: [
        { from: "/a/", to: "/b/" },
        { from: "/b/", to: "/a/" },
      ],
    });
    expect(resolveSlug(c, "/a/")).toEqual({ kind: "not-found" });
  });

  it("returns not-found for an unknown address", () => {
    expect(resolveSlug(catalog({}), "/nothing/")).toEqual({ kind: "not-found" });
  });

  it("matches addresses with or without the trailing slash", () => {
    const c = catalog({ books: [book("provider")] });
    expect(resolveSlug(c, "/provider")).toMatchObject({ kind: "book" });
  });
});

describe("booksByAuthor", () => {
  it("orders a series by number and leaves out hidden books", () => {
    const c = catalog({
      books: [
        book("three", { series: "The Lost Are Found", seriesNumber: 3 }),
        book("one", { series: "The Lost Are Found", seriesNumber: 1 }),
        book("secret", { hidden: true }),
        book("two", { series: "The Lost Are Found", seriesNumber: 2 }),
      ],
    });
    expect(booksByAuthor(c, "benkroeske").map((b) => b.slug)).toEqual(["one", "two", "three"]);
  });
});

describe("publishedPosts", () => {
  const c = catalog({ posts: [post("live", "published"), post("wip", "draft")] });
  it("leaves out drafts in production", () => {
    expect(publishedPosts(c, false).map((p) => p.slug)).toEqual(["live"]);
  });
  it("includes drafts on previews", () => {
    expect(publishedPosts(c, true).map((p) => p.slug)).toEqual(["live", "wip"]);
  });
});

describe("directoryAuthors", () => {
  it("lists visible authors with a visible book, by order then name", () => {
    const c = catalog({
      authors: [author("zed", { order: 4 }), author("amy", { order: 50 }), author("bob", { order: 50 }), author("nobooks", { order: 1 })],
      books: [book("z", { authorSlugs: ["zed"] }), book("a", { authorSlugs: ["amy"] }), book("b", { authorSlugs: ["bob"] }), book("n", { authorSlugs: ["nobooks"], hidden: true })],
    });
    expect(directoryAuthors(c).map((a) => a.slug)).toEqual(["zed", "amy", "bob"]);
  });
});

describe("bookAuthorLabel", () => {
  it("names only visible authors", () => {
    const c = catalog({ authors: [author("benkroeske", { name: "Ben" }), author("gone", { name: "Gone", hidden: true })], books: [book("b", { authorSlugs: ["benkroeske", "gone"] })] });
    expect(bookAuthorLabel(c, c.books[0])).toBe("Ben");
  });
});
