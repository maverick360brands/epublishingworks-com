import { describe, expect, it, vi } from "vitest";
import { resolveSlug } from "@/lib/catalog";
import { createManifestCache, manifestToCatalog, type RouteManifest } from "@/lib/route-manifest";

const manifest: RouteManifest = {
  books: [
    { slug: "provider", hidden: false, authorSlugs: ["benkroeske"] },
    { slug: "secret", hidden: true, authorSlugs: ["benkroeske"] },
  ],
  authors: [{ slug: "benkroeske", hidden: false }],
  posts: [{ slug: "how-to-publish", published: true }],
  redirects: [{ from: "/old/", to: "/provider/" }],
};

describe("manifestToCatalog", () => {
  const c = manifestToCatalog(manifest);
  it("resolves visible, hidden, moved, and unknown addresses like the pages do", () => {
    expect(resolveSlug(c, "/provider/").kind).toBe("book");
    expect(resolveSlug(c, "/secret/")).toEqual({ kind: "redirect", to: "/authors/benkroeske/", permanent: false });
    expect(resolveSlug(c, "/old/")).toEqual({ kind: "redirect", to: "/provider/", permanent: true });
    expect(resolveSlug(c, "/blog/how-to-publish/").kind).toBe("post");
    expect(resolveSlug(c, "/nope/").kind).toBe("not-found");
  });
});

describe("createManifestCache", () => {
  it("loads once, then serves from memory until the copy is 30 seconds old", async () => {
    let t = 0;
    const load = vi.fn().mockResolvedValue(manifest);
    const get = createManifestCache(load, { ttlMs: 30_000, now: () => t });
    expect(await get()).toBe(manifest);
    t = 29_000;
    await get();
    expect(load).toHaveBeenCalledTimes(1);
  });

  it("serves the stale copy while refreshing in the background", async () => {
    let t = 0;
    const fresh = { ...manifest, redirects: [] };
    const load = vi.fn().mockResolvedValueOnce(manifest).mockResolvedValueOnce(fresh);
    const get = createManifestCache(load, { ttlMs: 30_000, now: () => t });
    await get();
    t = 31_000;
    expect(await get()).toBe(manifest);
    await Promise.resolve();
    await Promise.resolve();
    expect(await get()).toBe(fresh);
    expect(load).toHaveBeenCalledTimes(2);
  });

  it("returns null when the database can't be reached and nothing is cached", async () => {
    const get = createManifestCache(vi.fn().mockRejectedValue(new Error("down")), { ttlMs: 30_000, now: () => 0 });
    expect(await get()).toBeNull();
  });

  it("keeps serving the last good copy when a refresh fails", async () => {
    let t = 0;
    const load = vi.fn().mockResolvedValueOnce(manifest).mockRejectedValueOnce(new Error("down"));
    const get = createManifestCache(load, { ttlMs: 30_000, now: () => t });
    await get();
    t = 31_000;
    expect(await get()).toBe(manifest);
    await Promise.resolve();
    expect(await get()).toBe(manifest);
  });

  it("passes requests through when the first load is slow, instead of stalling them", async () => {
    const get = createManifestCache(() => new Promise(() => {}), { ttlMs: 30_000, now: () => 0, firstLoadTimeoutMs: 50 });
    const started = Date.now();
    expect(await get()).toBeNull();
    expect(Date.now() - started).toBeLessThan(1000);
  });
});
