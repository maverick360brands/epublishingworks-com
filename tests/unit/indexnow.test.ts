import { afterEach, describe, expect, it, vi } from "vitest";
import { notifyIndexNow } from "@/cms/indexnow";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("notifyIndexNow", () => {
  it("does nothing outside production", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("INDEXNOW_KEY", "abc123");
    await notifyIndexNow(["/spirits-adopted-alice-duncan/"]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does nothing while the site is password-protected", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("INDEXNOW_KEY", "abc123");
    vi.stubEnv("SITE_PASSWORD", "secret");
    await notifyIndexNow(["/spirits-adopted-alice-duncan/"]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts the full URLs in production", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("INDEXNOW_KEY", "abc123");
    await notifyIndexNow(["/spirits-adopted-alice-duncan/"]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.indexnow.org/indexnow");
    expect(JSON.parse(init.body)).toEqual({
      host: "epublishingworks.com",
      key: "abc123",
      keyLocation: "https://epublishingworks.com/indexnow-key.txt",
      urlList: ["https://epublishingworks.com/spirits-adopted-alice-duncan/"],
    });
  });

  it("never throws when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("INDEXNOW_KEY", "abc123");
    await expect(notifyIndexNow(["/spirits-adopted-alice-duncan/"])).resolves.toBeUndefined();
  });
});
