import { expect, test, type Page } from "@playwright/test";
import { login } from "./helpers";

// End-to-end editor workflows through the admin UI. Run against a build whose database has the
// imported content, with ROUTE_MANIFEST_TTL_MS=1000 so the proxy picks up changes quickly.
test.describe.configure({ mode: "serial" });

async function eventually(check: () => Promise<boolean>, timeoutMs = 20_000) {
  const end = Date.now() + timeoutMs;
  while (Date.now() < end) {
    if (await check()) return true;
    await new Promise((r) => setTimeout(r, 500));
  }
  return check();
}

async function openBySlug(page: Page, collection: string, slug: string) {
  const res = await page.request.get(`/api/cms/${collection}?where[slug][equals]=${slug}&depth=0&draft=true`);
  const id = (await res.json()).docs[0].id;
  await page.goto(`/admin/collections/${collection}/${id}/`);
  await page.locator("#field-slug").waitFor();
  return id as number;
}

async function save(page: Page) {
  await page.getByRole("button", { name: /^(save|publish changes)$/i }).first().click();
  await expect(page.getByText(/successfully|updated/i).first()).toBeVisible({ timeout: 15_000 });
}

test("ticking Feature in home hero puts the cover on the home page", async ({ page }) => {
  await login(page);
  await openBySlug(page, "books", "the-protector-marliss-melton");
  const box = page.locator("#field-heroFeatured");
  if (await box.isChecked()) {
    await box.uncheck();
    await save(page);
  }
  await box.check();
  await save(page);
  // Featured books come first, most recently edited first: this one leads the wall now.
  expect(await eventually(async () => (await (await page.request.get("/")).text()).match(/_next\/image\/\?url=[^"&]*the-protector/i) !== null)).toBe(true);
});

test("hiding a book sends its address to the author's page", async ({ page }) => {
  await login(page);
  await openBySlug(page, "books", "the-protector-marliss-melton");
  try {
    await page.locator("#field-hidden").check();
    await save(page);
    expect(await eventually(async () => (await page.request.get("/the-protector-marliss-melton/", { maxRedirects: 0 })).status() === 302)).toBe(true);
  } finally {
    await page.locator("#field-hidden").uncheck();
    await save(page);
  }
  expect(await eventually(async () => (await page.request.get("/the-protector-marliss-melton/", { maxRedirects: 0 })).status() === 200)).toBe(true);
});

test("renaming a post's address redirects the old one permanently", async ({ page }) => {
  await login(page);
  await openBySlug(page, "posts", "how-to-republish-your-backlist");
  const field = page.locator("#field-slug");
  try {
    await field.fill("republish-your-backlist");
    await save(page);
    expect(await eventually(async () => (await page.request.get("/blog/how-to-republish-your-backlist/", { maxRedirects: 0 })).status() === 301)).toBe(true);
  } finally {
    await field.fill("how-to-republish-your-backlist");
    await save(page);
  }
  expect(await eventually(async () => (await page.request.get("/blog/how-to-republish-your-backlist/", { maxRedirects: 0 })).status() === 200)).toBe(true);
  // Renaming back leaves a redirect from the test address; remove it once the rename has landed.
  await page.request.delete(`/api/cms/redirects?where[from][equals]=${encodeURIComponent("/blog/republish-your-backlist/")}`);
  expect(await eventually(async () => (await page.request.get("/blog/republish-your-backlist/", { maxRedirects: 0 })).status() === 404)).toBe(true);
});

test("an author with books can't be deleted", async ({ page }) => {
  await login(page);
  const id = await openBySlug(page, "authors", "alice-duncan");
  const res = await page.request.delete(`/api/cms/authors/${id}`);
  expect(res.status()).toBe(400);
  expect(JSON.stringify(await res.json())).toContain("This author still has books. Reassign or delete their books first.");
});
