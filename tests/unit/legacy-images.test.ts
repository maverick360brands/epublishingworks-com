import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { legacyImage } from "@/lib/legacy-images";

const csv = fs.readFileSync(path.join(process.cwd(), "migration", "image-redirects.csv"), "utf8").trim().split(/\r?\n/).slice(1);
const rows = csv.map((line) => line.split(",")).map(([from, to]) => ({ from, to }));

describe("old WordPress image addresses", () => {
  it("forwards every mapped file to an image that exists on this site", () => {
    expect(rows.length).toBeGreaterThan(600);
    for (const { from, to } of rows) {
      expect(legacyImage(from), from).toBe(to);
      expect(fs.existsSync(path.join(process.cwd(), "public", to)), to).toBe(true);
    }
  });

  it("maps WordPress's resized and scaled copies back to their file", () => {
    expect(legacyImage("/wp-content/uploads/Alice_Duncan_Bruised_Spirits-200x300.jpg")).toBe("/images/books/bruised-spirits-alice-duncan.jpg");
    expect(legacyImage("/wp-content/uploads/alice_duncan_bruised_spirits-1024x1536.jpg")).toBe("/images/books/bruised-spirits-alice-duncan.jpg");
    expect(legacyImage("/wp-content/uploads/9781644577745-1-scaled.jpg")).toBe("/images/books/dancing-angels-alice-duncan.jpg");
    expect(legacyImage("/wp-content/uploads/9781644577745-1-300x450.jpg")).toBe("/images/books/dancing-angels-alice-duncan.jpg");
  });

  it("files with no counterpart, other folders and the older site's dated folders stay unmapped", () => {
    expect(legacyImage("/wp-content/uploads/book-provider.jpg")).toBeNull();
    expect(legacyImage("/wp-content/uploads/2019/05/Lotus-icon.png")).toBeNull();
    expect(legacyImage("/wp-content/themes/thrive-theme/style.css")).toBeNull();
    expect(legacyImage("/wp-content/uploads/%E0%A4%A.jpg")).toBeNull();
  });
});
