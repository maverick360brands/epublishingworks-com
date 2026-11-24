import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // The site and the Payload admin each have their own root layout, so addresses that match
    // no route need a standalone 404 page (src/app/global-not-found.tsx).
    globalNotFound: true,
  },
  // Every URL keeps its WordPress form, including the trailing slash
  // (e.g. /jesusisntsoft/, /authors/angeladams/). Paths without it redirect to it.
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
    return [
      // WordPress system URLs that search engines and old links may still request.
      { source: "/rise-up-publications/", destination: "/", permanent: true },
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/page-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/wp-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/feed/", destination: "/blog/rss.xml", permanent: true },
      { source: "/wp-admin/:path*", destination: "/", permanent: false },
      { source: "/wp-login.php", destination: "/", permanent: false },
    ];
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
        ],
      },
    ];
  },
};

export default withPayload(nextConfig);
