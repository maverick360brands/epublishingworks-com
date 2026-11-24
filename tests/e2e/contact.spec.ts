import { expect, test } from "@playwright/test";

test("links can preselect what the visitor is working on", async ({ page }) => {
  await page.goto("/contact/?type=fiction", { waitUntil: "networkidle" }); // interact only after hydration
  await expect(page.getByRole("radio", { name: /A fiction book/ })).toBeChecked();
  await expect(page.getByRole("combobox", { name: "Genre" })).toBeVisible();
});

test("each choice asks its own questions", async ({ page }) => {
  await page.goto("/contact/", { waitUntil: "networkidle" }); // interact only after hydration
  await expect(page.getByRole("combobox", { name: "Genre" })).toHaveCount(0);
  await page.getByText("Sermons, podcasts, or videos").click();
  await expect(page.getByLabel("Where do people find your messages?")).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Genre" })).toHaveCount(0);
  await page.getByText("A non-fiction book").click();
  await expect(page.getByRole("combobox", { name: "Genre" })).toBeVisible();
  await expect(page.getByLabel("Where do people find your messages?")).toHaveCount(0);
});

test("the choices work from the keyboard", async ({ page }) => {
  await page.goto("/contact/", { waitUntil: "networkidle" }); // interact only after hydration
  await page.getByRole("radio", { name: /A non-fiction book/ }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: /A fiction book/ })).toBeChecked();
});

test("a failed send explains what to do", async ({ page }) => {
  // Without Resend configured the API answers 503; the form must say so instead of failing silently.
  await page.goto("/contact/?type=other", { waitUntil: "networkidle" }); // interact only after hydration
  await page.getByLabel("First name").fill("Test");
  await page.getByLabel("Last name").fill("Author");
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("alert").filter({ hasText: /\S/ })).toContainText(/866-846-5123/);
});
