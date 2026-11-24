// Fails when the Payload config has schema changes that no migration covers. Asks Payload to
// generate a migration against the latest snapshot: with no changes it writes nothing; if it
// writes one, a migration is missing. The generated file is removed again either way, so add
// the real one with `npx payload migrate:create <name>`.
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const dir = "src/migrations";
const before = new Set(fs.readdirSync(dir));
const index = fs.readFileSync(`${dir}/index.ts`, "utf8");
execFileSync("npx", ["payload", "migrate:create", "schema_drift_check", "--skip-empty"], { stdio: ["ignore", "inherit", "inherit"] });
const created = fs.readdirSync(dir).filter((f) => !before.has(f));
if (created.length) {
  for (const f of created) fs.rmSync(`${dir}/${f}`);
  fs.writeFileSync(`${dir}/index.ts`, index);
  console.error("\nThe config has schema changes without a migration. Run: npx payload migrate:create <name>");
  process.exit(1);
}
console.log("Migrations match the config.");
