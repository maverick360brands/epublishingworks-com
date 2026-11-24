import type { CollectionConfig } from "payload";
import { signedIn } from "../access";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

// Covers, author photos, and social images. Stored in Vercel Blob in production.
export const Media: CollectionConfig = {
  slug: "media",
  admin: { group: "Admin", useAsTitle: "alt" },
  // With Blob, images are served from Blob's CDN, so the media list stays private to editors.
  // Without it (local development), Payload serves the files and must allow public reads.
  access: { read: ({ req }) => Boolean(req.user) || !process.env.BLOB_READ_WRITE_TOKEN, create: signedIn, update: signedIn, delete: signedIn },
  // Local uploads (development, tests) go to PAYLOAD_MEDIA_DIR or ./media; production uses Blob.
  upload: { mimeTypes: ["image/*"], staticDir: process.env.PAYLOAD_MEDIA_DIR || "media" },
  hooks: {
    // Pages embed image URLs and sizes, so a replaced or deleted image refreshes them.
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
    beforeValidate: [
      ({ data, req }) => {
        const fallback = req.context?.altDefault;
        if (data && !data.alt && typeof fallback === "string") data.alt = fallback;
        return data;
      },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      label: "Alt text",
      admin: { description: 'Describe the image for people who can\'t see it, e.g. "Cover of Strong Spirits by Alice Duncan".' },
    },
  ],
};
