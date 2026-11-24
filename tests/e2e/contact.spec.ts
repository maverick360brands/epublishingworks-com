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
  await page.getByLabel("The full manuscript").check();
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
  await page.getByLabel("The full manuscript").check();
  await page.getByRole("button", { name: "Submit Manuscript" }).click();
  await expect(page.getByRole("alert").filter({ hasText: /\S/ })).toContainText("at least one"); // skip Next.js's empty route announcer
});

test("Start With a Sample opens the form with sample chapters chosen", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "Start with a sample" }).first().click();
  await expect(page).toHaveURL(/\/submit-your-manuscript\/\?send=sample#submit$/);
  await expect(page.getByLabel("Sample chapters")).toBeChecked();
  await expect(page.getByRole("button", { name: "Send for Review" })).toBeVisible();
  await expect(page.getByText("Secure submission")).toBeVisible();
});

test("Start With a Sample works from the submit page itself", async ({ page }) => {
  await page.goto("/submit-your-manuscript/", { waitUntil: "networkidle" });
  await expect(page.getByLabel("Sample chapters")).not.toBeChecked();
  await page.getByRole("main").getByRole("link", { name: "start with a sample" }).first().click();
  await expect(page).toHaveURL(/\?send=sample#submit$/);
  await expect(page.getByLabel("Sample chapters")).toBeChecked();
  await expect(page.getByRole("button", { name: "Send for Review" })).toBeVisible();
});

test("a synopsis or outline goes through without a file", async ({ page }) => {
  await page.goto("/submit-your-manuscript/?send=sample", { waitUntil: "networkidle" });
  await page.getByLabel("First name").fill("TEST – e2e");
  await page.getByLabel("Last name").fill("Author");
  await page.getByLabel("Email address").fill("e2e@example.com");
  await page.getByLabel("Phone").fill("555-555-0100");
  await page.getByLabel("Most appropriate genre").selectOption("Mystery");
  await page.getByLabel("Book title").fill("TEST – e2e outline");
  await page.getByLabel("What is your book or series about?").fill("A test.");
  await page.getByLabel("Yes, already edited.").check();
  await page.getByLabel("Are you seeking to solve a problem with a new publisher?").fill("TEST – e2e. Ignore.");
  await page.getByLabel("Professional Guidance").check();
  await page.getByLabel("Referral").check();
  await page.getByLabel("A synopsis or outline").check();
  const [res] = await Promise.all([
    page.waitForResponse((r) => new URL(r.url()).pathname === "/api/manuscript/" && r.request().method() === "POST"),
    page.getByRole("button", { name: "Send for Review" }).click(),
  ]);
  expect(res.ok()).toBe(true);
  expect(res.request().postDataBuffer()?.toString() ?? "").toContain("A synopsis or outline");
  await expect(page).toHaveURL(/\/thank-you\/$/, { timeout: 20_000 });
});

test("manuscript files open only for signed-in editors", async ({ request }) => {
  const res = await request.get("/api/manuscript/file/?path=manuscripts/test-file.pdf", { maxRedirects: 0 });
  expect(res.status()).toBe(302);
  expect(res.headers().location).toContain("/admin/login/?redirect=");
  expect((await request.get("/api/manuscript/file/?path=../secrets", { maxRedirects: 0 })).status()).toBe(404);
});
