import { describe, expect, it } from "vitest";
import { filesCatalog } from "@/lib/catalog-files";
import { POST_ILLUSTRATIONS } from "@/lib/post-art";

// The no-database preview (CONTENT_SOURCE=files) mirrors the CMS: every post gets its illustration.
describe("illustrations in the files catalog", () => {
  const posts = filesCatalog().posts;

  it("gives each post with an illustration its cover, crop point and share image", () => {
    expect(posts.length).toBeGreaterThan(0);
    for (const p of posts) {
      const a = POST_ILLUSTRATIONS[p.slug];
      if (!a) continue;
      expect(p.cover).toEqual({ url: a.url, width: 2048, height: 1152, alt: a.alt, focus: a.focus });
      expect(p.image).toBe(a.share);
    }
  });

  it("has an illustration for every post", () => {
    expect(posts.filter((p) => !POST_ILLUSTRATIONS[p.slug]).map((p) => p.slug)).toEqual([]);
  });

  it("sets a crop point for each picture", () => {
    for (const a of Object.values(POST_ILLUSTRATIONS)) expect(a.focus).toMatch(/^\d{1,3}% 50%$/);
  });
});
