import { describe, expect, it } from "vitest";
import { isManuscriptPath, manuscriptLink, manuscriptPath } from "@/lib/manuscript";

describe("private manuscript store", () => {
  it("accepts only files in the private store's manuscripts folder", () => {
    expect(manuscriptPath("https://abc123.private.blob.vercel-storage.com/manuscripts/My-Book-x7Ks9.pdf")).toBe("manuscripts/My-Book-x7Ks9.pdf");
    expect(manuscriptPath("https://abc123.public.blob.vercel-storage.com/manuscripts/My-Book.pdf")).toBe("");
    expect(manuscriptPath("https://abc123.private.blob.vercel-storage.com/covers/a.jpg")).toBe("");
    expect(manuscriptPath("https://evil.example/manuscripts/a.pdf")).toBe("");
    expect(manuscriptPath("https://abc123.private.blob.vercel-storage.com/manuscripts/a.pdf?x=1")).toBe("");
    expect(manuscriptPath("")).toBe("");
  });
  it("never lets the download route leave the manuscripts folder", () => {
    expect(isManuscriptPath("manuscripts/a-b_c.1.pdf")).toBe(true);
    expect(isManuscriptPath("manuscripts/../covers/a.jpg")).toBe(false);
    expect(isManuscriptPath("manuscripts/a..pdf")).toBe(false);
    expect(isManuscriptPath("manuscripts/sub/a.pdf")).toBe(false);
    expect(isManuscriptPath("covers/a.jpg")).toBe(false);
  });
  it("links the email to the editor-only route on the submitting host", () => {
    expect(manuscriptLink("https://epublishingworks.com", "manuscripts/a.pdf")).toBe("https://epublishingworks.com/api/manuscript/file/?path=manuscripts%2Fa.pdf");
  });
});
