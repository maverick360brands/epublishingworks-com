import path from "node:path";
import { describe, expect, it } from "vitest";
import { normalizeMarkdown, readContentFiles, toAuthorData, toBookData, toPostData } from "@/cms/import/fromFiles";

const files = readContentFiles(path.resolve("content"));

describe("readContentFiles", () => {
  it("reads every author, book, and post", () => {
    expect([files.authors.length, files.books.length, files.posts.length]).toEqual([57, 510, 6]);
  });
});

describe("toBookData", () => {
  const strong = files.books.find((b) => b.file === "strong-spirits-alice-duncan")!;
  const data = toBookData(strong, [11, 12], 99);

  it("uses the title-author address", () => {
    expect(data.slug).toBe("strong-spirits-alice-duncan");
  });
  it("links the authors and cover", () => {
    expect(data.authors).toEqual([11, 12]);
    expect(data.cover).toBe(99);
  });
  it("keeps the genre, series, and number", () => {
    expect([data.genre, data.series, data.seriesNumber]).toEqual(["Cozy Mystery", "A Daisy Gumm Majesty Mystery", 1]);
  });
  it("never guesses formats the site didn't state", () => {
    expect(data.formats).toEqual([]);
  });
  it("features the WordPress home carousel and landing-page books", () => {
    expect(data.heroFeatured).toBe(false);
    expect(toBookData(files.books.find((b) => b.file === "spirits-adopted-alice-duncan")!, [1], 1).heroFeatured).toBe(true);
  });
  it("keeps the retailer links in order", () => {
    expect(data.retailers.map((r) => r.name)).toEqual(strong.data.retailers.map((r: { name: string }) => r.name));
  });
});

describe("toAuthorData", () => {
  it("uses the WordPress address, underscores included, and keeps the directory order", () => {
    const data = toAuthorData(files.authors.find((a) => a.file === "sl-menear")!, null);
    expect(data.slug).toBe("sl_menear");
    expect(data.order).toBeGreaterThan(0);
  });
});

describe("toPostData", () => {
  it("publishes posts that weren't drafts", () => {
    const data = toPostData(files.posts.find((p) => p.file === "how-to-republish-your-backlist")!);
    expect(data._status).toBe("published");
    expect(data.slug).toBe("how-to-republish-your-backlist");
    expect(data.authorName).toBe("ePublishingWorks");
    expect(data.summary.length).toBeGreaterThan(20);
  });
});

describe("normalizeMarkdown", () => {
  it("splits an italic quote that ends in a bold reference into parts the editor can read", () => {
    expect(normalizeMarkdown('*"A delight." **~Kirkus Reviews***')).toBe('*"A delight."* **_~Kirkus Reviews_**');
  });
  it("leaves other Markdown alone", () => {
    expect(normalizeMarkdown("Plain *italic* and **bold**.")).toBe("Plain *italic* and **bold**.");
  });
});

describe("normalizeMarkdown escapes", () => {
  it("resolves escapes the editor importer would keep as backslashes", () => {
    expect(normalizeMarkdown("dog \\[sled\\] racing. *\\~Kirkus* \\#1")).toBe("dog [sled] racing. *~Kirkus* #1");
  });
  it("keeps escaped asterisks escaped", () => {
    expect(normalizeMarkdown("5 \\* 5")).toBe("5 \\* 5");
  });
});
