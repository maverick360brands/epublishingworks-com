import type { MigrateUpArgs } from "@payloadcms/db-postgres";
import { importContent } from "../cms/import/fromFiles";

// Data migration: moves the Markdown books, authors, and posts into the CMS. Runs once per
// database during the build (preview branches and production), so nobody runs it by hand.
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const counts = await importContent(payload, req);
  payload.logger.info(`Imported ${counts.authors} authors, ${counts.books} books, ${counts.posts} posts`);
}

export async function down(): Promise<void> {
  // Content stays in place; removing it would delete the editors' work.
}
