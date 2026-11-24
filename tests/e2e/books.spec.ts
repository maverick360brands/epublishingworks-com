import { expect, test } from "@playwright/test";

// The catalog page shows 60 books at a time; search and genre filters cover every book.
test("the books page pages its tiles and searches the whole catalog", async ({ page }) => {
  await page.goto("/books/", { waitUntil: "networkidle" });
  const tiles = page.locator("main ul.grid > li");
  await expect(tiles).toHaveCount(60);
  await page.getByRole("button", { name: "Show More Books" }).click();
  await expect(tiles).toHaveCount(120);
  await page.getByPlaceholder("Search title, author, or series").fill("Dancing Angels");
  await expect(tiles.first()).toContainText("Dancing Angels");
  await expect(page.getByRole("button", { name: "Show More Books" })).toHaveCount(0);
});

test("root-level files that don't exist are real 404s", async ({ request }) => {
  for (const path of ["/index.php", "/xmlrpc.php", "/readme.html", "/favicon.ico", "/authors/foo.php", "/blog/wp-login.php"]) {
    expect((await request.get(path, { maxRedirects: 0 })).status(), path).toBe(404);
  }
  expect((await request.get("/tva_lesson-sitemap.xml", { maxRedirects: 0 })).status()).toBe(301);
  expect((await request.get("/blog/rss.xml")).status()).toBe(200);
});

test("off the live domain, robots.txt disallows everything and pages say noindex", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /");
  expect((await request.get("/books/")).headers()["x-robots-tag"]).toContain("noindex");
});
