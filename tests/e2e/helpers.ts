import type { Page } from "@playwright/test";

const EMAIL = process.env.E2E_EMAIL || "editor@example.com";
const PASSWORD = process.env.E2E_PASSWORD || "editor-pass-123";

// Signs in as the test editor, creating it as the first user on an empty database.
export async function login(page: Page) {
  // Wait for the admin to finish loading: filling the form before React takes over loses the input.
  await page.goto("/admin/", { waitUntil: "networkidle" });
  await page.locator("#field-email").waitFor();
  if (await page.locator("#field-confirm-password").count()) {
    await page.locator("#field-email").fill(EMAIL);
    await page.locator("#field-password").fill(PASSWORD);
    await page.locator("#field-confirm-password").fill(PASSWORD);
    await page.getByRole("button", { name: /create/i }).click();
  } else {
    await page.goto("/admin/login/", { waitUntil: "networkidle" });
    await page.locator("#field-email").fill(EMAIL);
    await page.locator("#field-password").fill(PASSWORD);
    await page.getByRole("button", { name: /login/i }).click();
  }
  await page.waitForURL(/\/admin\/?$/);
}

/** Uploads tests/fixtures/cover.jpg through a form's Cover field ("Create New" drawer). */
export async function uploadCover(scope: Page | import("@playwright/test").Locator, page: Page, alt = "Test cover") {
  const before = await page.locator(".drawer--is-open").count();
  await scope.locator("#field-cover").getByRole("button", { name: "Create New" }).click();
  const drawer = page.locator(".drawer--is-open").last();
  await drawer.locator('input[type="file"]').setInputFiles("tests/fixtures/cover.jpg");
  await drawer.locator("#field-alt").fill(alt);
  await drawer.getByRole("button", { name: /^save$/i }).click();
  await page.waitForFunction((n) => document.querySelectorAll(".drawer--is-open").length === n, before, { timeout: 20_000 });
}
