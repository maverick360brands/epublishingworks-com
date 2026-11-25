import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { legacyImage } from "@/lib/legacy-images";

const root = process.cwd();
const csv = fs.readFileSync(path.join(root, "migration", "image-redirects.csv"), "utf8").trim().split(/\r?\n/).slice(1);
const rows = csv.map((line) => line.split(",")).map(([from, to, item]) => ({ from, to, item }));
const seed = JSON.parse(fs.readFileSync(path.join(root, "src", "generated", "content.json"), "utf8")) as {
  books: { url: string }[];
  authors: { url: string }[];
};
// Items name the address segment (the CMS slug): /authors/sl_menear/ is "sl_menear" even though its seed file is sl-menear.
const segment = (url: string) => url.split("/").filter(Boolean).at(-1) ?? "";
const slugs = { book: new Set(seed.books.map((b) => segment(b.url))), author: new Set(seed.authors.map((a) => segment(a.url))) };

describe("old WordPress image addresses", () => {
  it("forwards every mapped file: covers and author photos to the item, site images to a file that exists", () => {
    expect(rows.length).toBeGreaterThan(600);
    for (const { from, to, item } of rows) {
      expect(fs.existsSync(path.join(root, "public", to)), to).toBe(true);
      const target = legacyImage(from);
      if (item) {
        const [kind, slug] = item.split(":") as ["book" | "author", string];
        expect(target, from).toEqual({ kind, slug });
        expect(slugs[kind].has(slug), item).toBe(true);
      } else {
        expect(target, from).toEqual({ path: to });
      }
    }
  });

  it("maps WordPress's resized and scaled copies back to their file", () => {
    const bruised = { kind: "book", slug: "bruised-spirits-alice-duncan" };
    expect(legacyImage("/wp-content/uploads/Alice_Duncan_Bruised_Spirits-200x300.jpg")).toEqual(bruised);
    expect(legacyImage("/wp-content/uploads/alice_duncan_bruised_spirits-1024x1536.jpg")).toEqual(bruised);
    const dancing = { kind: "book", slug: "dancing-angels-alice-duncan" };
    expect(legacyImage("/wp-content/uploads/9781644577745-1-scaled.jpg")).toEqual(dancing);
    expect(legacyImage("/wp-content/uploads/9781644577745-1-300x450.jpg")).toEqual(dancing);
    expect(legacyImage("/wp-content/uploads/jo-goodman-author-150x150.jpg")).toEqual({ path: "/images/site/testimonials/jo-goodman.jpg" });
  });

  it("files with no counterpart, other folders, the older site's dated folders and odd names stay unmapped", () => {
    for (const p of [
      "/wp-content/uploads/book-provider.jpg",
      "/wp-content/uploads/Mary-Ellen-Johnson-Eternal-Beloved.jpeg",
      "/wp-content/uploads/2019/05/Lotus-icon.png",
      "/wp-content/themes/thrive-theme/style.css",
      "/wp-content/uploads/%E0%A4%A.jpg",
      "/wp-content/uploads/constructor",
      "/wp-content/uploads/__proto__",
      "/wp-content/uploads/toString",
    ]) {
      expect(legacyImage(p), p).toBeNull();
    }
  });
});
