import type { Payload } from "payload";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { getTestPayload, testImage } from "../helpers/payload";

const revalidateTag = vi.fn();
vi.mock("next/cache", () => ({ revalidateTag: (...args: unknown[]) => revalidateTag(...args) }));

type Doc = Record<string, unknown> & { id: number };
let payload: Payload;
let coverId: number;
let benId: number;

// Loosely typed Local API calls (test data is minimal on purpose).
const api = () => payload as unknown as Record<"create" | "update" | "delete" | "find", (a: object) => Promise<Doc & { docs?: Doc[] }>>;
const redirects = async () => ((await api().find({ collection: "redirects", limit: 100 })).docs ?? []).map((r) => ({ from: r.from, to: r.to, reason: r.reason }));
const newBook = (slug: string, over: object = {}) => api().create({ collection: "books", data: { title: slug, slug, authors: [benId], cover: coverId, ...over } });

beforeAll(async () => {
  payload = await getTestPayload();
  coverId = (await testImage(payload)).id;
  benId = (await api().create({ collection: "authors", data: { name: "Ben Kroeske", slug: "benkroeske" } })).id;
});

afterAll(async () => {
  await payload?.db?.destroy?.();
});

beforeEach(() => revalidateTag.mockClear());

describe("changing a book's page address", () => {
  it("records a redirect and refreshes the site", async () => {
    const book = await newBook("provider");
    await api().update({ collection: "books", id: book.id, data: { slug: "providerbook" } });
    expect(await redirects()).toContainEqual({ from: "/provider/", to: "/providerbook/", reason: "address-changed" });
    expect(revalidateTag).toHaveBeenCalledWith("content", "max");

    // A second rename collapses the chain: every old address points at the newest one.
    await api().update({ collection: "books", id: book.id, data: { slug: "providerthree" } });
    let rows = await redirects();
    expect(rows.filter((r) => r.from === "/provider/")).toEqual([{ from: "/provider/", to: "/providerthree/", reason: "address-changed" }]);
    expect(rows).toContainEqual({ from: "/providerbook/", to: "/providerthree/", reason: "address-changed" });

    // Renaming back to an old address removes that address's redirect, so it can't loop.
    await api().update({ collection: "books", id: book.id, data: { slug: "provider" } });
    rows = await redirects();
    expect(rows.find((r) => r.from === "/provider/")).toBeUndefined();
    expect(rows).toContainEqual({ from: "/providerbook/", to: "/provider/", reason: "address-changed" });
    expect(rows).toContainEqual({ from: "/providerthree/", to: "/provider/", reason: "address-changed" });
  });
});

describe("deleting", () => {
  it("sends a deleted book's address to its author's page", async () => {
    const book = await newBook("goneforgood");
    await api().delete({ collection: "books", id: book.id });
    expect(await redirects()).toContainEqual({ from: "/goneforgood/", to: "/authors/benkroeske/", reason: "deleted" });
  });

  it("refuses to delete an author who still has books", async () => {
    const author = await api().create({ collection: "authors", data: { name: "Has Books", slug: "hasbooks" } });
    await newBook("keepme", { authors: [author.id] });
    await expect(api().delete({ collection: "authors", id: author.id })).rejects.toThrow("This author still has books. Reassign or delete their books first.");
  });

  it("deletes an author with no books", async () => {
    const author = await api().create({ collection: "authors", data: { name: "No Books", slug: "nobooks" } });
    await expect(api().delete({ collection: "authors", id: author.id })).resolves.toBeTruthy();
  });

  it("adds no redirect for a post that was never published", async () => {
    const post = await api().create({ collection: "posts", draft: true, data: { title: "Draft", slug: "draft-only", description: "d", summary: "s", _status: "draft" } });
    await api().delete({ collection: "posts", id: post.id });
    expect((await redirects()).find((r) => r.from === "/blog/draft-only/")).toBeUndefined();
  });
});

describe("an address that an old redirect used", () => {
  it("drops the stale redirect when a new book takes the address", async () => {
    const book = await newBook("reused");
    await api().update({ collection: "books", id: book.id, data: { slug: "reusedmoved" } });
    expect((await redirects()).find((r) => r.from === "/reused/")).toBeTruthy();
    await newBook("reused");
    expect((await redirects()).find((r) => r.from === "/reused/")).toBeUndefined();
  });
});

describe("skipping revalidation", () => {
  it("doesn't refresh the site when the save asks not to", async () => {
    await api().create({ collection: "books", data: { title: "Quiet", slug: "quiet", authors: [benId], cover: coverId }, context: { skipRevalidate: true } } as object);
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});

describe("media", () => {
  it("refreshes the site when an image changes", async () => {
    revalidateTag.mockClear();
    await (payload.update as unknown as (a: object) => Promise<unknown>)({ collection: "media", id: coverId, data: { alt: "New alt" } });
    expect(revalidateTag).toHaveBeenCalledWith("content", "max");
  });
});

describe("renaming a post through drafts", () => {
  it("redirects the published address straight to the newly published one", async () => {
    const p = await api().create({ collection: "posts", data: { title: "Z", slug: "zz-a", description: "d", summary: "s", _status: "published" } });
    const draft = (slug: string) => (payload.update as unknown as (a: object) => Promise<unknown>)({ collection: "posts", id: p.id, draft: true, data: { slug, _status: "draft" } });
    await draft("zz-b");
    await draft("zz-c");
    await (payload.update as unknown as (a: object) => Promise<unknown>)({ collection: "posts", id: p.id, data: { slug: "zz-c", _status: "published" } });
    const rows = (await redirects()).filter((r) => String(r.from).startsWith("/blog/zz-"));
    expect(rows).toEqual([{ from: "/blog/zz-a/", to: "/blog/zz-c/", reason: "address-changed" }]);
  });
});

describe("hidden and unpublished items", () => {
  it("records a redirect when a hidden book's address changes", async () => {
    const book = await newBook("hiddenbook", { hidden: true });
    await api().update({ collection: "books", id: book.id, data: { slug: "hiddenbookmoved" } });
    expect(await redirects()).toContainEqual({ from: "/hiddenbook/", to: "/hiddenbookmoved/", reason: "address-changed" });
  });

  it("redirects a post's last published address after it was unpublished, renamed, and republished", async () => {
    const update = (id: number, data: object, draft = false) => (payload.update as unknown as (a: object) => Promise<unknown>)({ collection: "posts", id, data, ...(draft ? { draft: true } : {}) });
    const p = await api().create({ collection: "posts", data: { title: "U", slug: "up-one", description: "d", summary: "s", _status: "published" } });
    await update(p.id, { _status: "draft" });
    await update(p.id, { slug: "up-two", _status: "draft" }, true);
    await update(p.id, { slug: "up-two", _status: "published" });
    expect(await redirects()).toContainEqual({ from: "/blog/up-one/", to: "/blog/up-two/", reason: "address-changed" });
  });
});

describe("IndexNow during the content import", () => {
  it("doesn't ping for saves made by the import (skipRevalidate)", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("INDEXNOW_KEY", "abc123");
    try {
      await api().create({ collection: "books", data: { title: "Imported", slug: "importedbook", authors: [benId], cover: coverId }, context: { skipRevalidate: true } } as object);
      await new Promise((r) => setTimeout(r, 50));
      expect(fetchMock).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllEnvs();
      vi.unstubAllGlobals();
    }
  });
});
