import fs from "node:fs";
import path from "node:path";
import type { Payload } from "payload";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { importContent } from "@/cms/import/fromFiles";
import { featuredBookSlugs } from "@/cms/import/featured";
import { lexicalToHtml, textOf } from "@/lib/richtext";
import { getTestPayload } from "../helpers/payload";

type Doc = Record<string, unknown>;
let payload: Payload;
let first: { authors: number; books: number; posts: number };

const all = async (collection: string) =>
  ((await (payload.find as unknown as (a: object) => Promise<{ docs: Doc[] }>)({ collection, limit: 500, depth: 1, draft: true })).docs);
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
    expect(first).toEqual({ authors: 24, books: 42, posts: 7 });
  });

  it("is safe to run twice", async () => {
    expect(await importContent(payload)).toEqual({ authors: 24, books: 42, posts: 7 });
    expect((await payload.count({ collection: "books" })).totalDocs).toBe(42);
  }, 600_000);

  it("keeps every book at its current address", async () => {
    const paths = (await all("books")).map((b) => `/${b.slug}/`).sort();
    expect(paths).toEqual(generated.books.map((b) => b.url).sort());
  });

  it("links Victorious in Battle to Simone Jooste", async () => {
    const book = (await all("books")).find((b) => b.slug === "victoriousinbattle")!;
    expect((book.authors as Doc[]).map((a) => a.name)).toEqual(["Simone Jooste"]);
  });

  it("features the same 15 hero books", async () => {
    expect((await all("books")).filter((b) => b.heroFeatured)).toHaveLength(featuredBookSlugs.length);
  });

  it("dates imported posts by their publish or Updated date, not the import time", async () => {
    // The live document (what the site reads); a draft version is always stamped at save time.
    const { docs } = await (payload.find as unknown as (a: object) => Promise<{ docs: Doc[] }>)({ collection: "posts", where: { slug: { equals: "how-to-publish-a-christian-book" } }, depth: 0 });
    expect(docs[0].updatedAt).toBe(docs[0].updated ?? docs[0].date);
  });

  it("gives every cover alt text", async () => {
    const book = (await all("books")).find((b) => b.slug === "provider")!;
    expect((book.cover as Doc).alt).toBe("Cover of Provider");
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
