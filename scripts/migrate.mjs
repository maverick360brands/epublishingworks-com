// Runs the database migrations before `next build` (which also imports the starting content into
// a new database). A preview deployed without a database sets CONTENT_SOURCE=files and skips them.
// The live site must always build from the CMS: once production serves a real domain, files mode
// fails the build. (Until launch, Vercel treats the work branch as "production" on a private
// *.vercel.app address, which is allowed.)
import { spawnSync } from "node:child_process";

if (process.env.CONTENT_SOURCE === "files") {
  const prodHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || "";
  if (process.env.VERCEL_ENV === "production" && prodHost && !prodHost.endsWith(".vercel.app")) {
    console.error(`CONTENT_SOURCE=files is for previews only, and production now serves ${prodHost}. Remove it from the Production environment.`);
    process.exit(1);
  }
  console.log("CONTENT_SOURCE=files: skipping database migrations (content comes from src/generated/content.json).");
  process.exit(0);
}
const result = spawnSync("npx", ["payload", "migrate"], { stdio: "inherit", shell: process.platform === "win32" });
process.exit(result.status ?? 1);
