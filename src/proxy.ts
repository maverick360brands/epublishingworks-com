import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import pg from "pg";
import { RESERVED_ROOT_SEGMENTS } from "@/cms/slugs";
import { resolveSlug } from "@/lib/catalog";
import { isProductionHost } from "@/lib/hosts";
import { createManifestCache, loadManifest, manifestToCatalog } from "@/lib/route-manifest";
import { GATE_COOKIE, gatePage, gateResponseInit, isUnlocked } from "@/lib/site-gate";
import shortlinks from "@/generated/shortlinks.json";
import { legacyImage } from "@/lib/legacy-images";

// Book pages live at the site root (/spirits-adopted-alice-duncan/), authors at /authors/<name>/, and posts at
// /blog/<slug>/, matching the WordPress URLs. Under Cache Components a page streams before it
// can decide, so redirects and 404s from the page itself would arrive with a 200 status. The
// proxy decides first, from a small address table read from the CMS database:
//   visible item → the page renders; hidden item → 302 to its author (or listing) page;
//   old address → 301 to the new one (single-hop 301s, as the site conventions ask); unknown → a real 404.
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

// Files the app itself serves at the root. Any other root path with a dot (/index.php,
// /xmlrpc.php, /readme.html) is a WordPress leftover or a probe and gets a real 404, not the
// book route's "not found" page with a 200.
const ROOT_FILES = new Set(["robots.txt", "sitemap.xml", "llms.txt", "indexnow-key.txt", "icon.png", "apple-icon.png"]);
// Served outside the password gate: browser icons and the IndexNow key (the feeds stay inside).
const UNGATED_FILES = new Set(["/icon.png", "/apple-icon.png", "/indexnow-key.txt"]);
// Files the app serves under the content folders; any other dotted path there is a real 404.
const NESTED_FILES = new Set(["/blog/rss.xml"]);

function isContentPath(segments: string[]) {
  if (segments.some((s) => s.includes("."))) return false; // feeds such as /sitemap.xml
  if (segments.length === 1) return !RESERVED_ROOT_SEGMENTS.has(segments[0]);
  return segments.length === 2 && (segments[0] === "authors" || segments[0] === "blog");
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  // Only the live domain may be crawled; robots.txt on any other host disallows everything.
  if (pathname === "/robots.txt") {
    if (isProductionHost(request.headers.get("host"))) return NextResponse.next();
    return new NextResponse("User-agent: *\nDisallow: /\n", { headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex, nofollow" } });
  }
  if (UNGATED_FILES.has(pathname)) return NextResponse.next();
  // While the site is in development, every page asks for the password first.
  if (!(await isUnlocked(request.cookies.get(GATE_COOKIE)?.value, process.env.SITE_PASSWORD))) {
    return new NextResponse(gatePage({ next: pathname + search }), gateResponseInit(401));
  }
  // WordPress shortlinks (/?p=4617) go straight to the page's address, without the query.
  if (pathname === "/") {
    const p = request.nextUrl.searchParams;
    const key = p.has("p") ? `p=${p.get("p")}` : p.has("page_id") ? `page_id=${p.get("page_id")}` : null;
    const to = key ? (shortlinks as Record<string, string>)[key] : undefined;
    if (to) return NextResponse.redirect(new URL(to, request.url), 301);
  }
  // Old WordPress image addresses forward to the same image on this site in one 301
  // (migration/image-redirects.csv); any other /wp-content/ file is a real 404.
  if (pathname.startsWith("/wp-content/")) {
    const to = legacyImage(pathname);
    return to ? NextResponse.redirect(new URL(to, request.url), 301) : NextResponse.rewrite(new URL("/__not-found/__/__/", request.url));
  }
  const segments = pathname.split("/").filter(Boolean);
  const strayFile =
    (segments.length === 1 && segments[0].includes(".") && !ROOT_FILES.has(segments[0])) ||
    (segments.length === 2 && (segments[0] === "authors" || segments[0] === "blog") && segments[1].includes(".") && !NESTED_FILES.has(pathname));
  if (strayFile) {
    return NextResponse.rewrite(new URL("/__not-found/__/__/", request.url));
  }
  if (!isContentPath(segments)) return NextResponse.next();
  // A preview without a database (CONTENT_SOURCE=files) has no address table; pages decide.
  if (process.env.CONTENT_SOURCE === "files") return NextResponse.next();
  const manifest = await getManifest();
  if (!manifest) return NextResponse.next();
  const result = resolveSlug(manifestToCatalog(manifest, { includeDrafts }), pathname);
  if (result.kind === "redirect") return NextResponse.redirect(new URL(result.to, request.url), result.permanent ? 301 : 302);
  if (result.kind === "not-found") return NextResponse.rewrite(new URL("/__not-found/__/__/", request.url));
  return NextResponse.next();
}

export const config = {
  // Pages only: skip Next.js internals, the admin, API routes, and files with an extension
  // (images, fonts), except the feeds that list the site's content, which the gate also covers.
  matcher: ["/", "/((?!_next/|admin(?:/|$)|api/|.*\\.[a-zA-Z0-9]+$).+)", "/sitemap.xml", "/llms.txt", "/blog/rss.xml", "/robots.txt", "/:file([^/]+\\.[^/]+)", "/:dir(authors|blog)/:file([^/]+\\.[^/]+)", "/wp-content/:path*"],
};
