import type { VercelBlobStorageOptions } from "@payloadcms/storage-vercel-blob";

/**
 * Upload storage in Vercel Blob. Every upload gets a unique file name (addRandomSuffix), so a
 * preview deployment's database can never overwrite or delete production's files even though
 * they share one store. Images are served straight from Blob's CDN, not through Payload.
 * Without a token (local development, tests) uploads go to ./media instead; the plugin still
 * adds its database fields (alwaysInsertFields), so migrations are the same in every environment.
 */
export const blobStorageOptions = (token: string | undefined): VercelBlobStorageOptions => ({
  enabled: Boolean(token),
  token,
  addRandomSuffix: true,
  alwaysInsertFields: true,
  collections: { media: { disablePayloadAccessControl: true } },
});
