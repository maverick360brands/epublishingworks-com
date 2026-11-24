import type { Payload } from "payload";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { getTestPayload, testImage } from "../helpers/payload";

let payload: Payload;
let authorId: number;
let coverId: number;

beforeAll(async () => {
  payload = await getTestPayload();
  const author = await create({ collection: "authors", data: { name: "Ben Kroeske", slug: "benkroeske" } });
  authorId = author.id as number;
  coverId = (await testImage(payload, "Cover of Provider")).id as number;
});

afterAll(async () => {
  await payload?.db?.destroy?.();
});

const book = (over: Record<string, unknown> = {}) => ({ title: "Provider", authors: [authorId], cover: coverId, ...over });

// These tests send deliberately incomplete data to exercise validation, so they call the
// Local API through a loosely typed wrapper.
type Doc = Record<string, unknown> & { id: number };
const create = (args: { collection: string; data: unknown; context?: Record<string, unknown>; file?: unknown }) =>
  (payload.create as unknown as (a: typeof args) => Promise<Doc>)(args);

describe("books", () => {
  it("require at least one author", async () => {
    await expect(create({ collection: "books", data: book({ slug: "noauthor", authors: [] }) })).rejects.toThrow(/authors/i);
  });

  it("can't use an address that another page uses", async () => {
    const error = await create({ collection: "books", data: book({ slug: "books" }) }).catch((e) => e);
    expect(JSON.stringify(error?.data)).toMatch(/used by another page/);
  });

  it("can't share an address with another book", async () => {
    await create({ collection: "books", data: book({ slug: "provider" }) });
    await expect(create({ collection: "books", data: book({ slug: "provider" }) })).rejects.toThrow();
  });

  it("get a title-then-author address suggested when none is given, like the WordPress book pages", async () => {
    const created = await create({ collection: "books", data: book({ title: "A Woman's Heart", slug: "" }) });
    expect(created.slug).toMatch(/^a-womans-heart-[a-z0-9-]+$/);
  });
});

describe("media", () => {
  it("requires alt text", async () => {
    await expect(testImage(payload, "")).rejects.toThrow(/alt/i);
  });

  it("takes default alt text from the request context", async () => {
    const sharp = (await import("sharp")).default;
    const data = await sharp({ create: { width: 10, height: 10, channels: 3, background: "#fff" } }).png().toBuffer();
    const m = await create({
      collection: "media",
      data: {},
      context: { altDefault: "Cover of Provider" },
      file: { data, mimetype: "image/png", name: "ctx.png", size: data.length },
    });
    expect(m.alt).toBe("Cover of Provider");
  });
});

describe("posts", () => {
  const body = (tag: string) => ({
    root: {
      type: "root",
      version: 1,
      direction: null,
      format: "",
      indent: 0,
      children: [{ type: "heading", tag, version: 1, direction: null, format: "", indent: 0, children: [{ type: "text", text: "Hello", version: 1, detail: 0, format: 0, mode: "normal", style: "" }] }],
    },
  });

  it("require an In short summary", async () => {
    await expect(create({ collection: "posts", data: { title: "No summary", slug: "no-summary", description: "d", body: body("h2") } })).rejects.toThrow(/summary|In short/i);
  });

  it("turn an H1 in the body into an H2 (the title is the page's only H1)", async () => {
    const p = await create({ collection: "posts", data: { title: "Headings", slug: "headings", description: "d", summary: "s", body: body("h1") } });
    const first = (p.body as { root: { children: { tag: string }[] } }).root.children[0];
    expect(first.tag).toBe("h2");
  });
});

describe("authors", () => {
  it("list their books through the join", async () => {
    const a = await payload.findByID({ collection: "authors", id: authorId, depth: 1 });
    const titles = ((a.books as { docs: { title: string }[] }).docs ?? []).map((b) => b.title);
    expect(titles).toContain("Provider");
  });
});

describe("media list", () => {
  it("isn't readable anonymously when images are served from Blob", async () => {
    process.env.BLOB_READ_WRITE_TOKEN = "test-token";
    try {
      await expect((payload.find as unknown as (a: object) => Promise<unknown>)({ collection: "media", overrideAccess: false })).rejects.toThrow();
    } finally {
      delete process.env.BLOB_READ_WRITE_TOKEN;
    }
  });
});
