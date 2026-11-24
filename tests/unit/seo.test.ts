import { describe, expect, it } from "vitest";
import { bookFacts, metaFor, pageMetadata } from "@/lib/seo";

const empty = { title: "", description: "", image: "" };
const summary = "Pasadena, California, 1920. Daisy Gumm Majesty does what she must to keep her family afloat, and if that means conducting séances and reading tarot cards, so be it.";

describe("metaFor", () => {
  it("falls back to the title, the summary as written, and the main image", () => {
    expect(metaFor({ title: "Strong Spirits", summary, seo: empty }, "/c.jpg")).toEqual({ title: "Strong Spirits", description: summary, image: "/c.jpg" });
  });

  it("uses the SEO overrides when they're filled in", () => {
    const m = metaFor({ title: "Strong Spirits", summary, seo: { title: "Strong Spirits: A Daisy Gumm Majesty Mystery", description: "Short.", image: "/social.jpg" } }, "/c.jpg");
    expect(m).toEqual({ title: "Strong Spirits: A Daisy Gumm Majesty Mystery", description: "Short.", image: "/social.jpg" });
  });

  it("keeps a short summary as it is", () => {
    expect(metaFor({ title: "T", summary: "Short summary.", seo: empty }, "").description).toBe("Short summary.");
  });
});

describe("bookFacts", () => {
  it("describes a book from its own record only", () => {
    const book = { title: "Portal", genre: "Science Fiction", series: "", seriesNumber: null, retailers: [{ name: "Amazon", url: "a" }, { name: "Kobo", url: "k" }, { name: "Amazon", url: "a2" }] };
    expect(bookFacts(book, "Richard Bowker")).toBe("Portal by Richard Bowker. Science Fiction, published by ePublishingWorks. Available from Amazon and Kobo.");
  });
  it("names the series and copes with no links", () => {
    const book = { title: "A Fair Isle Murder", genre: "Cozy Mystery", series: "Maggie Pace Mysteries", seriesNumber: 2, retailers: [] };
    expect(bookFacts(book, "Ann Yost")).toBe("A Fair Isle Murder by Ann Yost. Cozy Mystery, Maggie Pace Mysteries Book 2, published by ePublishingWorks.");
  });
});

describe("pageMetadata", () => {
  it("sets the canonical, og:url, and the share image", () => {
    const m = pageMetadata({ title: "Books", description: "All of them.", path: "/books/" });
    expect(m.alternates?.canonical).toBe("/books/");
    expect(m.openGraph).toMatchObject({ url: "/books/", title: "Books | ePublishingWorks", description: "All of them." });
    expect((m.openGraph as { images: { url: string }[] }).images[0].url).toBe("/images/site/social-share.jpg");
  });
  it("keeps an absolute title as is and can noindex", () => {
    const m = pageMetadata({ title: { absolute: "Home | ePublishingWorks!" }, path: "/", noindex: true });
    expect(m.openGraph).toMatchObject({ title: "Home | ePublishingWorks!" });
    expect(m.robots).toEqual({ index: false, follow: true });
  });
});
