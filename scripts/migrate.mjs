// Runs the database migrations before `next build` (which also imports the starting content into
// a new database). A preview deployed without a database sets CONTENT_SOURCE=files and skips
// them; production must always build from the CMS, so that combination fails the build.
import { spawnSync } from "node:child_process";

if (process.env.CONTENT_SOURCE === "files") {
  if (process.env.VERCEL_ENV === "production") {
    console.error("CONTENT_SOURCE=files is for previews only. Remove it from the Production environment.");
    process.exit(1);
  }
  console.log("CONTENT_SOURCE=files: skipping database migrations (content comes from src/generated/content.json).");
  process.exit(0);
}
const result = spawnSync("npx", ["payload", "migrate"], { stdio: "inherit", shell: process.platform === "win32" });
process.exit(result.status ?? 1);
