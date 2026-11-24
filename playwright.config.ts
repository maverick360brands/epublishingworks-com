import { defineConfig } from "@playwright/test";

// End-to-end tests run against a production build started separately:
//   npm run build && npx next start -p 3100
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  use: { baseURL: process.env.BASE_URL || "http://localhost:3100", trace: "off" },
});
