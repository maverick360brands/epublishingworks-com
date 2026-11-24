import { expect, test } from "@playwright/test";

// Both forms, against a local production build: without Resend configured, submissions are logged
// and accepted.

test("the contact form sends and thanks the visitor in place", async ({ page }) => {
  await page.goto("/contact/", { waitUntil: "networkidle" }); // interact only after hydration
  await page.getByLabel("Name").fill("TEST – e2e");
  await page.getByLabel("Email").fill("e2e@example.com");
  await page.getByLabel("Message").fill("TEST – e2e message. Ignore.");
  const [res] = await Promise.all([
    page.waitForResponse((r) => r.url().includes("/api/contact/") && r.request().method() === "POST"),
    page.getByRole("button", { name: "Send Message" }).click(),
  ]);
  expect(res.ok()).toBe(true);
  await expect(page.getByText("Your message is on its way")).toBeVisible();
});

test("the manuscript form asks the WordPress questions and lands on the thank-you page", async ({ page }) => {
  await page.goto("/submit-your-manuscript/", { waitUntil: "networkidle" });
  await page.getByLabel("First name").fill("TEST – e2e");
  await page.getByLabel("Last name").fill("Author");
  await page.getByLabel("Email address").fill("e2e@example.com");
  await page.getByLabel("Phone").fill("555-555-0100");
  await page.getByLabel("Most appropriate genre").selectOption("Cozy Mystery");
  await page.getByLabel("Book title").fill("TEST – e2e book");
  await page.getByLabel("What is your book or series about?").fill("A test.");
  await expect(page.getByText("7 of 350")).toBeVisible();
  await page.getByLabel("No, not edited.").check();
  await page.getByLabel("Are you seeking to solve a problem with a new publisher?").fill("TEST – e2e. Ignore.");
  await page.getByLabel("Higher Royalties").check();
  await page.getByLabel("Web Search").check();
  await page.getByRole("button", { name: "Submit Manuscript" }).click();
  await expect(page).toHaveURL(/\/thank-you\/$/, { timeout: 20_000 });
  await expect(page.getByRole("heading", { name: "Success!" })).toBeVisible();
});

test("the manuscript form insists on at least one interest", async ({ page }) => {
  await page.goto("/submit-your-manuscript/", { waitUntil: "networkidle" });
  for (const [label, value] of [
    ["First name", "T"],
    ["Last name", "A"],
    ["Email address", "e2e@example.com"],
    ["Phone", "1"],
    ["Book title", "T"],
    ["What is your book or series about?", "T"],
    ["Are you seeking to solve a problem with a new publisher?", "T"],
  ]) {
    await page.getByLabel(label).fill(value);
  }
  await page.getByLabel("Most appropriate genre").selectOption("Mystery");
  await page.getByLabel("Yes, already edited.").check();
  await page.getByLabel("Referral").check();
  await page.getByRole("button", { name: "Submit Manuscript" }).click();
  await expect(page.getByRole("alert").filter({ hasText: /\S/ })).toContainText("at least one"); // skip Next.js's empty route announcer
});
