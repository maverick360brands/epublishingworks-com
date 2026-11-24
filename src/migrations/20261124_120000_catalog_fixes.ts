import type { MigrateUpArgs } from "@payloadcms/db-postgres";

// Corrections to records the first import already wrote (the Markdown seed has the same
// fixes, so a fresh database gets them either way). Each one checks before it writes, so an
// editor's later change is never overwritten.
const LOREM = /lorem ipsum/i;
// No cache to refresh during the build.
const context = { skipRevalidate: true };

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const bySlug = async (slug: string) =>
    (await payload.find({ collection: "books", where: { slug: { equals: slug } }, limit: 1, depth: 0, draft: true, req })).docs[0];

  // Placeholder text the WordPress author page carried as Forbidden's description.
  const forbidden = await bySlug("forbidden-jo-beverley");
  if (forbidden && LOREM.test(JSON.stringify(forbidden.description ?? ""))) {
    await payload.update({ collection: "books", id: forbidden.id, data: { description: null, summary: "" }, context, req });
    payload.logger.info("Cleared the placeholder description on Forbidden");
  }

  // The Yoast description of the WordPress Dancing Angels page.
  const dancing = await bySlug("dancing-angels-alice-duncan");
  if (dancing && !dancing.seo?.description) {
    await payload.update({
      collection: "books",
      id: dancing.id,
      data: {
        seo: {
          ...dancing.seo,
          description: "New Release from Alice Duncan! Intrigue and danger dance hand in hand in Dancing Angels, a Historical Cozy Mystery from Alice Duncan",
        },
      },
      context,
      req,
    });
    payload.logger.info("Restored the search description on Dancing Angels");
  }
}

export async function down(): Promise<void> {
  // Nothing to undo: these are content corrections.
}
