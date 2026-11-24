import { describe, expect, it } from "vitest";
import { absoluteUrl } from "@/lib/urls";

describe("absoluteUrl", () => {
  it("prefixes site paths with the site origin", () => {
    expect(absoluteUrl("/spirits-adopted-alice-duncan/")).toBe("https://epublishingworks.com/spirits-adopted-alice-duncan/");
  });
  it("leaves absolute URLs (Blob images) alone", () => {
    expect(absoluteUrl("https://x.public.blob.vercel-storage.com/provider-abc.jpg")).toBe("https://x.public.blob.vercel-storage.com/provider-abc.jpg");
  });
});
