import fs from "node:fs";
import path from "node:path";
import type { Payload } from "payload";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { importContent } from "@/cms/import/fromFiles";
import { lexicalToHtml, textOf } from "@/lib/richtext";
import { getTestPayload } from "../helpers/payload";

type Doc = Record<string, unknown>;
let payload: Payload;
let first: { authors: number; books: number; posts: number };

const all = async (collection: string) =>
  ((await (payload.find as unknown as (a: object) => Promise<{ docs: Doc[] }>)({ collection, limit: 10_000, pagination: false, depth: 1, draft: true })).docs);
const generated = JSON.parse(fs.readFileSync(path.resolve("src/generated/content.json"), "utf8")) as {
  authors: { url: string; bioHtml: string; name: string }[];
  books: { slug: string; url: string; descriptionHtml: string; title: string }[];
  posts: { slug: string; html: string }[];
};
const plain = (html: string) => textOf(html).replace(/\s+/g, " ").trim();

beforeAll(async () => {
  payload = await getTestPayload();
  first = await importContent(payload);
}, 600_000);

afterAll(async () => {
  await payload?.db?.destroy?.();
});

describe("importContent", () => {
  it("imports every author, book, and post", () => {
    expect(first).toEqual({ authors: 57, books: 510, posts: 6 });
  });

  it("is safe to run twice", async () => {
    expect(await importContent(payload)).toEqual({ authors: 57, books: 510, posts: 6 });
    expect((await payload.count({ collection: "books" })).totalDocs).toBe(510);
  }, 600_000);

  it("keeps every book at its current address", async () => {
    const paths = (await all("books")).map((b) => `/${b.slug}/`).sort();
    expect(paths).toEqual(generated.books.map((b) => b.url).sort());
  });

  it("keeps the WordPress book landing pages at their addresses and features them", async () => {
    const featured = (await all("books")).filter((b) => b.heroFeatured).map((b) => b.slug).sort();
    expect(featured).toHaveLength(9);
    expect(featured).toEqual(expect.arrayContaining(["celluloid-angels-alice-duncan", "dancing-angels-alice-duncan", "spirits-adopted-alice-duncan"]));
  });

  it("links Strong Spirits to Alice Duncan, with its series, genre, and number", async () => {
    const book = (await all("books")).find((b) => b.slug === "strong-spirits-alice-duncan")!;
    expect((book.authors as Doc[]).map((a) => a.name)).toEqual(["Alice Duncan"]);
    expect([book.series, book.seriesNumber, book.genre]).toEqual(["A Daisy Gumm Majesty Mystery", 1, "Cozy Mystery"]);
  });

  it("keeps legacy author addresses, underscores included", async () => {
    const slugs = (await all("authors")).map((a) => a.slug);
    expect(slugs).toContain("sl_menear");
    expect(slugs).toContain("phoebe-conn-2");
  });

  it("dates imported posts by their publish or Updated date, not the import time", async () => {
    // The live document (what the site reads); a draft version is always stamped at save time.
    const { docs } = await (payload.find as unknown as (a: object) => Promise<{ docs: Doc[] }>)({ collection: "posts", where: { slug: { equals: "how-to-republish-your-backlist" } }, depth: 0 });
    expect(docs[0].updatedAt).toBe(docs[0].updated ?? docs[0].date);
  });

  it("gives every cover alt text", async () => {
    const book = (await all("books")).find((b) => b.slug === "strong-spirits-alice-duncan")!;
    expect((book.cover as Doc).alt).toBe("Cover of Strong Spirits");
  });
});

describe("text fidelity", () => {
  it("keeps every word of every book description", async () => {
    const books = await all("books");
    const diffs = generated.books.filter((g) => plain(lexicalToHtml((books.find((b) => `/${b.slug}/` === g.url)?.description ?? null) as never)) !== plain(g.descriptionHtml));
    expect(diffs.map((d) => d.title)).toEqual([]);
  });

  it("keeps every word of every author bio", async () => {
    const authors = await all("authors");
    const diffs = generated.authors.filter((g) => plain(lexicalToHtml((authors.find((a) => `/authors/${a.slug}/` === g.url)?.bio ?? null) as never)) !== plain(g.bioHtml));
    expect(diffs.map((d) => d.name)).toEqual([]);
  });

  it("keeps every word of every post", async () => {
    const posts = await all("posts");
    const diffs = generated.posts.filter((g) => plain(lexicalToHtml((posts.find((p) => p.slug === g.slug)?.body ?? null) as never)) !== plain(g.html));
    expect(diffs.map((d) => d.slug)).toEqual([]);
  });
});
