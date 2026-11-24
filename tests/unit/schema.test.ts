import { describe, expect, it } from "vitest";
import { articleSchema } from "@/lib/schema";
import type { Post } from "@/lib/catalog";

const post = (over: Partial<Post>): Post => ({
  slug: "p",
  title: "T",
  description: "D",
  date: "2026-10-01T00:00:00.000Z",
  updated: null,
  authorName: "ePublishingWorks",
  category: "Publishing",
  tags: [],
  image: "",
  cover: null,
  faqs: [],
  summary: "",
  readingMinutes: 1,
  toc: [],
  html: "",
  status: "published",
  updatedAt: "2026-11-10T07:15:40.000Z",
  seo: { title: "", description: "", image: "" },
  ...over,
});

describe("articleSchema", () => {
  it("dates a post by its latest real change: Updated date, publish date, or last edit", () => {
    expect(articleSchema(post({ updatedAt: "2026-10-01T00:00:00.000Z" })).dateModified).toBe("2026-10-01T00:00:00.000Z");
    expect(articleSchema(post({ updated: "2026-10-20T00:00:00.000Z", updatedAt: "2026-10-01T00:00:00.000Z" })).dateModified).toBe("2026-10-20T00:00:00.000Z");
    expect(articleSchema(post({ updatedAt: "2026-11-10T07:15:40.000Z" })).dateModified).toBe("2026-11-10T07:15:40.000Z");
  });
});
