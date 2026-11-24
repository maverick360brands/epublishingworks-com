import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Authors } from "./cms/collections/Authors";
import { Books } from "./cms/collections/Books";
import { Media } from "./cms/collections/Media";
import { Posts } from "./cms/collections/Posts";
import { Redirects } from "./cms/collections/Redirects";
import { Users } from "./cms/collections/Users";
import { blobStorageOptions } from "./cms/blob";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || "",
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " | ePublishingWorks Admin",
      // Absolute, so shared admin links don't point at the server's own address.
      openGraph: { images: [{ url: "https://epublishingworks.com/images/site/social-share.jpg", width: 1200, height: 675 }] },
    },
    importMap: { baseDir: path.resolve(dirname) },
  },
  routes: { admin: "/admin", api: "/api/cms" },
  graphQL: { disable: true },
  collections: [Books, Authors, Posts, Media, Redirects, Users],
  editor: lexicalEditor(),
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL } }),
  sharp,
  plugins: [
    // Uploads go to Vercel Blob when the store is connected; locally they go to ./media.
    vercelBlobStorage(blobStorageOptions(process.env.BLOB_READ_WRITE_TOKEN)),
  ],
  upload: { limits: { fileSize: 10_000_000 } },
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
});
