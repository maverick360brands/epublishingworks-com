// Tells IndexNow (Bing, Copilot, Yandex, and others) that pages changed, so they recrawl them
// promptly. Production only, and not while the site is password-protected (it isn't public
// yet); never throws, so a failed ping can't block a save.
const HOST = "epublishingworks.com";

export async function notifyIndexNow(paths: string[]): Promise<void> {
  const key = process.env.INDEXNOW_KEY;
  if (process.env.VERCEL_ENV !== "production" || process.env.SITE_PASSWORD || !key || paths.length === 0) return;
  try {
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key,
        keyLocation: `https://${HOST}/indexnow-key.txt`,
        urlList: [...new Set(paths)].map((p) => `https://${HOST}${p}`),
      }),
    });
  } catch (error) {
    console.error("IndexNow notification failed", error);
  }
}
