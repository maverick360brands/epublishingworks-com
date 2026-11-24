import { describe, expect, it } from "vitest";
import { metaFor } from "@/lib/seo";

const empty = { title: "", description: "", image: "" };
const summary = "We know God as our Provider, but how often do we truly experience Him that way? This book invites you to discover a magnificent truth hidden within the pages of Scripture and live it.";

describe("metaFor", () => {
  it("falls back to the title, the summary as written, and the main image", () => {
    expect(metaFor({ title: "Provider", summary, seo: empty }, "/c.jpg")).toEqual({ title: "Provider", description: summary, image: "/c.jpg" });
  });

  it("uses the SEO overrides when they're filled in", () => {
    const m = metaFor({ title: "Provider", summary, seo: { title: "Provider: A Book on Faith", description: "Short.", image: "/social.jpg" } }, "/c.jpg");
    expect(m).toEqual({ title: "Provider: A Book on Faith", description: "Short.", image: "/social.jpg" });
  });

  it("keeps a short summary as it is", () => {
    expect(metaFor({ title: "T", summary: "Short summary.", seo: empty }, "").description).toBe("Short summary.");
  });
});
