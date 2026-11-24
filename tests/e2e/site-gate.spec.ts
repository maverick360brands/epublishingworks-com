import { expect, test } from "@playwright/test";

// The development-site password. Runs only when the server under test was started with
// SITE_PASSWORD set, and the same value is in this process's environment.
const PASSWORD = process.env.SITE_PASSWORD;
test.skip(!PASSWORD, "SITE_PASSWORD not set");

test("pages, feeds, and the home page ask for the password", async ({ request }) => {
  for (const path of ["/", "/spirits-adopted-alice-duncan/", "/authors/", "/blog/", "/sitemap.xml", "/llms.txt", "/zzzz/"]) {
    const res = await request.get(path, { maxRedirects: 0 });
    expect(res.status(), path).toBe(401);
    expect(res.headers()["x-robots-tag"], path).toContain("noindex");
  }
});

test("the admin and site images stay outside the gate", async ({ request }) => {
  expect((await request.get("/admin/", { maxRedirects: 0 })).status()).not.toBe(401);
  expect((await request.get("/images/site/logo.png")).status()).toBe(200);
});

test("a wrong password is refused; the right one opens the page you asked for", async ({ page }) => {
  await page.goto("/spirits-adopted-alice-duncan/");
  await page.getByLabel("Password").fill("not-it");
  await page.getByRole("button", { name: "View the site" }).click();
  await expect(page.getByRole("alert")).toContainText("isn’t right");
  await page.getByLabel("Password").fill(PASSWORD!);
  await page.getByRole("button", { name: "View the site" }).click();
  await expect(page).toHaveURL(/\/spirits-adopted-alice-duncan\/$/);
  await expect(page.locator("h1")).toContainText("Spirits Adopted");
  // Unlocked for the rest of the visit, and redirects work again.
  const res = await page.request.get("/authors/phoebe-conn/", { maxRedirects: 0 });
  expect(res.status()).toBe(301);
});
