import { defineConfig, devices } from "@playwright/test";

// One config for both kinds of browser tests (*.spec.ts):
// - tests/e2e: against a local production build: npm run build && ROUTE_MANIFEST_TTL_MS=1000 npx next start -p 3100
// - tests/forms.spec.ts (kit): against staging: BASE_URL=<staging url> npx playwright test tests/forms.spec.ts
// Protected Vercel previews are reached with the Protection Bypass for Automation secret.
const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

export default defineConfig({
  testDir: "tests",
  testMatch: "**/*.spec.ts",
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3100",
    trace: "off",
    extraHTTPHeaders: bypass ? { "x-vercel-protection-bypass": bypass, "x-vercel-set-bypass-cookie": "true" } : undefined,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
