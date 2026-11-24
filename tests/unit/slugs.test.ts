import { describe, expect, it } from "vitest";
import { RESERVED_ROOT_SEGMENTS, suggestBookSegment, suggestPostSlug, suggestSegment, validateSegment } from "@/cms/slugs";

describe("suggestSegment", () => {
  it("hyphenates words and drops apostrophes, WordPress style", () => {
    expect(suggestSegment("A Woman's Heart")).toBe("a-womans-heart");
  });
  it("folds accents", () => {
    expect(suggestSegment("Inés Saint")).toBe("ines-saint");
  });
  it("spells out ampersands", () => {
    expect(suggestSegment("Spirits & Spells")).toBe("spirits-and-spells");
  });
  it("returns an empty string when nothing usable is left", () => {
    expect(suggestSegment("!!!")).toBe("");
  });
});

describe("suggestBookSegment", () => {
  it("names a book title-then-author, like the WordPress book pages", () => {
    expect(suggestBookSegment("Spirits Adopted", "alice-duncan")).toBe("spirits-adopted-alice-duncan");
  });
  it("falls back to the title alone without an author", () => {
    expect(suggestBookSegment("Celluloid Angels")).toBe("celluloid-angels");
  });
  it("normalizes legacy author addresses", () => {
    expect(suggestBookSegment("Ghost Town", "sl_menear")).toBe("ghost-town-sl-menear");
  });
});

describe("suggestPostSlug", () => {
  it("hyphenates words", () => {
    expect(suggestPostSlug("How to Republish Your Backlist: A Guide")).toBe("how-to-republish-your-backlist-a-guide");
  });
  it("trims leading and trailing hyphens", () => {
    expect(suggestPostSlug("  — Hello, World! — ")).toBe("hello-world");
  });
});

describe("validateSegment", () => {
  it("rejects addresses other pages use", () => {
    expect(validateSegment("books")).toBe("This address is used by another page on the site. Please choose a different one.");
  });
  it("requires a value", () => {
    expect(validateSegment("")).toBe("Page address is required.");
  });
  it("allows only lowercase letters, numbers, and single separators", () => {
    for (const bad of ["Bad Value", "-leading", "trailing-", "double--hyphen", "UPPER"]) {
      expect(validateSegment(bad)).toBe("Use lowercase letters, numbers, and hyphens only.");
    }
  });
  it("accepts the site's address forms, legacy underscores included", () => {
    for (const ok of ["spirits-adopted-alice-duncan", "phoebe-conn-2", "sl_menear", "sjmaciver"]) expect(validateSegment(ok)).toBe(true);
  });
  it("reserves every root page and Next.js internals", () => {
    for (const s of [
      "about",
      "admin",
      "authors",
      "blog",
      "books",
      "contact",
      "frequently-asked-questions",
      "privacy-policy",
      "reviews",
      "submission-guidelines",
      "submit-your-manuscript",
      "thank-you",
      "the-advantage",
      "api",
      "_next",
      "__not-found",
    ]) {
      expect(RESERVED_ROOT_SEGMENTS.has(s)).toBe(true);
    }
  });
});
