import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import pg from "pg";
import { RESERVED_ROOT_SEGMENTS } from "@/cms/slugs";
import { resolveSlug } from "@/lib/catalog";
import { createManifestCache, loadManifest, manifestToCatalog } from "@/lib/route-manifest";
import { GATE_COOKIE, gatePage, gateResponseInit, isUnlocked } from "@/lib/site-gate";

// Book pages live at the site root (/spirits-adopted-alice-duncan/), authors at /authors/<name>/, and posts at
// /blog/<slug>/, matching the WordPress URLs. Under Cache Components a page streams before it
// can decide, so redirects and 404s from the page itself would arrive with a 200 status. The
// proxy decides first, from a small address table read from the CMS database:
//   visible item → the page renders; hidden item → 307 to its author (or listing) page;
//   old address → 308 to the new one; unknown → a real 404.
// If the database can't be reached, requests pass through and pages apply the same rules.

const includeDrafts = process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV === "preview";

let pool: pg.Pool | null = null;
const getManifest = createManifestCache(
  () => {
    if (!pool) {
      pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        max: 2,
        connectionTimeoutMillis: 1_500,
        idleTimeoutMillis: 30_000,
        statement_timeout: 2_000,
      });
      // Idle connections dropped by the database (restarts, scaling) must not crash the instance.
      pool.on("error", (error) => console.error("Route manifest pool error", error));
    }
    return loadManifest((sql) => pool!.query(sql).then((r) => r.rows));
  },
  { ttlMs: Number(process.env.ROUTE_MANIFEST_TTL_MS) || 30_000 },
);

function isContentPath(segments: string[]) {
  if (segments.some((s) => s.includes("."))) return false; // feeds such as /sitemap.xml
  if (segments.length === 1) return !RESERVED_ROOT_SEGMENTS.has(segments[0]);
  return segments.length === 2 && (segments[0] === "authors" || segments[0] === "blog");
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  // While the site is in development, every page asks for the password first.
  if (!(await isUnlocked(request.cookies.get(GATE_COOKIE)?.value, process.env.SITE_PASSWORD))) {
    return new NextResponse(gatePage({ next: pathname + search }), gateResponseInit(401));
  }
  if (!isContentPath(pathname.split("/").filter(Boolean))) return NextResponse.next();
  const manifest = await getManifest();
  if (!manifest) return NextResponse.next();
  const result = resolveSlug(manifestToCatalog(manifest, { includeDrafts }), pathname);
  if (result.kind === "redirect") return NextResponse.redirect(new URL(result.to, request.url), result.permanent ? 308 : 307);
  if (result.kind === "not-found") return NextResponse.rewrite(new URL("/__not-found/__/__/", request.url));
  return NextResponse.next();
}

export const config = {
  // Pages only: skip Next.js internals, the admin, API routes, and files with an extension
  // (images, fonts), except the feeds that list the site's content, which the gate also covers.
  matcher: ["/", "/((?!_next/|admin(?:/|$)|api/|.*\\.[a-zA-Z0-9]+$).+)", "/sitemap.xml", "/llms.txt", "/blog/rss.xml"],
};
