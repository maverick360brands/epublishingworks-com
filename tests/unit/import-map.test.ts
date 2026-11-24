import path from "node:path";
import { describe, expect, it } from "vitest";
import { normalizeMarkdown, readContentFiles, toAuthorData, toBookData, toPostData } from "@/cms/import/fromFiles";
import { featuredBookSlugs } from "@/cms/import/featured";

const files = readContentFiles(path.resolve("content"));

describe("readContentFiles", () => {
  it("reads every author, book, and post", () => {
    expect([files.authors.length, files.books.length, files.posts.length]).toEqual([24, 42, 7]);
  });
});

describe("toBookData", () => {
  const provider = files.books.find((b) => b.file === "provider")!;
  const data = toBookData(provider, [11, 12], 99);

  it("uses the WordPress address as the page address", () => {
    expect(data.slug).toBe("provider");
  });
  it("links the authors and cover", () => {
    expect(data.authors).toEqual([11, 12]);
    expect(data.cover).toBe(99);
  });
  it("marks the hero books", () => {
    expect(data.heroFeatured).toBe(featuredBookSlugs.includes("provider"));
    expect(toBookData(files.books.find((b) => b.file === "jesus-isnt-soft")!, [1], 1).heroFeatured).toBe(true);
  });
  it("keeps the retailer links in order", () => {
    expect(data.retailers.map((r) => r.name)).toEqual(provider.data.retailers.map((r: { name: string }) => r.name));
  });
});

describe("toAuthorData", () => {
  it("uses the WordPress address and keeps the directory order", () => {
    const data = toAuthorData(files.authors.find((a) => a.file === "angel-l-adams")!, null);
    expect(data.slug).toBe("angeladams");
    expect(data.order).toBe(4);
  });
});

describe("toPostData", () => {
  it("publishes posts that weren't drafts", () => {
    const data = toPostData(files.posts.find((p) => p.file === "how-to-publish-a-christian-book")!);
    expect(data._status).toBe("published");
    expect(data.slug).toBe("how-to-publish-a-christian-book");
    expect(data.summary.length).toBeGreaterThan(20);
  });
});

describe("normalizeMarkdown", () => {
  it("splits an italic quote that ends in a bold reference into parts the editor can read", () => {
    expect(normalizeMarkdown('*"Be strong." **~Joshua 1:9 (NKJV)***')).toBe('*"Be strong."* **_~Joshua 1:9 (NKJV)_**');
  });
  it("leaves other Markdown alone", () => {
    expect(normalizeMarkdown("Plain *italic* and **bold**.")).toBe("Plain *italic* and **bold**.");
  });
});
