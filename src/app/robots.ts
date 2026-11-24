import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Search and AI answer engines are welcome: being cited by ChatGPT, Perplexity,
// Gemini, and Google AI Overviews is part of the AEO strategy.
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true;
  // A files-mode preview (CONTENT_SOURCE=files) is never the live site, whatever Vercel calls it.
  if (!isProduction || process.env.CONTENT_SOURCE === "files") return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
