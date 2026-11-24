import { expect, test } from "@playwright/test";
import { login, uploadCover } from "./helpers";

test.describe.configure({ mode: "serial" });

// Unique names per run, so the tests can run against a database that already has data.
const run = Date.now().toString(36);
const authorName = `Gate Author ${run}`;
const bookTwo = `Gate Book Two ${run}`;

// Remove what the tests created, so test books never linger in the catalog, sitemap, or llms.txt.
test.afterAll(async ({ browser }) => {
  const page = await browser.newPage();
  await login(page);
  for (const slug of [`gatebookone${run}`, `gatebooktwo${run}`]) {
    await page.request.delete(`/api/cms/books?where[slug][equals]=${slug}`);
  }
  await page.request.delete(`/api/cms/authors?where[slug][equals]=gateauthor${run}`);
  // Deleting them leaves redirects from their addresses, and their covers stay in the media library.
  await page.request.delete(`/api/cms/redirects?where[from][contains]=${run}`);
  await page.request.delete(`/api/cms/media?where[alt][equals]=${encodeURIComponent("Test cover")}`);
  await page.close();
});

test("+ New author from a book keeps the book form and selects the new author", async ({ page }) => {
  await login(page);
  await page.goto("/admin/collections/books/create/");
  await page.locator("#field-title").fill("Gate Book One");
  await page.locator("#field-slug").fill(`gatebookone${run}`);
  await page.getByRole("button", { name: "Add new Author" }).click();
  const drawer = page.locator(".drawer--is-open").last();
  await drawer.locator("#field-name").fill(authorName);
  await drawer.locator("#field-slug").fill(`gateauthor${run}`);
  await drawer.getByRole("button", { name: /^save$/i }).click();
  await expect(page.locator(".drawer--is-open")).toHaveCount(0, { timeout: 15_000 });
  await expect(page.locator("#field-authors")).toContainText(authorName);
  await expect(page.locator("#field-title")).toHaveValue("Gate Book One");
  await uploadCover(page, page);
  await page.getByRole("button", { name: /^save$/i }).click();
  await page.waitForURL(/\/admin\/collections\/books\/\d+\/?$/, { timeout: 20_000 });
});

test("+ New book from an author creates a book linked to that author", async ({ page }) => {
  await login(page);
  // The list is paginated and the site has dozens of authors: search for the new one.
  await page.goto(`/admin/collections/authors/?search=${encodeURIComponent(authorName)}`);
  await page.getByRole("link", { name: authorName }).first().click();
  await page.getByRole("button", { name: "Add new", exact: true }).click();
  const drawer = page.locator(".drawer--is-open").last();
  await drawer.locator("#field-title").fill(bookTwo);
  await drawer.locator("#field-slug").fill(`gatebooktwo${run}`);
  await expect(drawer.locator("#field-authors")).toContainText(authorName);
  await uploadCover(drawer, page);
  await drawer.getByRole("button", { name: /^save$/i }).click();
  await expect(page.locator(".drawer--is-open")).toHaveCount(0, { timeout: 15_000 });
  await expect(page.locator("main").getByText(bookTwo, { exact: true })).toBeVisible({ timeout: 15_000 });
});
