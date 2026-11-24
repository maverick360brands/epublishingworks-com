import fs from "node:fs";
import path from "node:path";
import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import { readRedirectRows, shortlinkKey } from "./src/lib/redirects-csv";

// Old-URL redirects from the migration map (single-hop 301s, as the site conventions ask;
// `permanent: true` would send 308). Shortlinks (/?p=ID) are handled in src/proxy.ts.
const legacyRedirects = readRedirectRows(fs.readFileSync(path.join(process.cwd(), "migration", "redirects.csv"), "utf8"))
  .filter((r) => !shortlinkKey(r.from))
  .map((r) => ({ source: r.from, destination: r.to, statusCode: r.code as 301 | 302 }));

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // The site and the Payload admin each have their own root layout, so addresses that match
    // no route need a standalone 404 page (src/app/global-not-found.tsx).
    globalNotFound: true,
  },
  // Every URL keeps its WordPress form, including the trailing slash
  // (e.g. /spirits-adopted-alice-duncan/, /authors/alice-duncan/). Paths without it redirect to it.
  trailingSlash: true,
  images: {
    // Covers and photos uploaded in the admin are stored in Vercel Blob.
    remotePatterns: [new URL("https://*.public.blob.vercel-storage.com/**")],
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return legacyRedirects;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Previews built from files (CONTENT_SOURCE=files) are never indexed.
          ...(process.env.CONTENT_SOURCE === "files" ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] : []),
        ],
      },
    ];
  },
};

export default withPayload(nextConfig);
