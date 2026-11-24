---
name: wp-migration
description: Move this site off WordPress onto the Maverick360 site stack with URL and SEO parity. Use when migrating, inventorying, or cutting over a WordPress site, or when building its redirect map.
---

# WordPress migration

Run the phases in order. Stop and report to Dustin at the end of each phase marked **STOP**.
Never change anything on the live WordPress site.

## Phase 1: Inventory (read-only)

1. Pull every sitemap (`/sitemap_index.xml` for Yoast, else `/sitemap.xml`, `/wp-sitemap.xml`).
2. Pull content through the public REST API: `/wp-json/wp/v2/pages`, `/posts`, `/media`,
   `/categories`, `/tags`, plus any custom post types listed at `/wp-json/wp/v2/types`.
   Page through with `per_page=100&page=N`.
3. Write `migration/urls.csv`: `url,type,status,title,meta_description,canonical,h1,indexable`.
   Fetch each URL once for the head tags. Indexable means 200, no `noindex`, self-canonical.
4. Write `migration/seo-meta.csv`: `url,meta_title,meta_description` (exactly these columns).
5. Note in `migration/notes.md`: plugins visible in page source, forms and where they post,
   embeds, tracking IDs, WooCommerce or membership URLs, anything that won't move as plain content.
6. SiteGround's bot protection can block crawlers. If requests start returning 403 or a
   challenge page, slow down. If it persists, stop and ask Dustin to allowlist the crawler
   rather than working around it.

**STOP**: report URL counts by type, indexable count, and anything unusual from the notes.

## Phase 2: Content

1. Convert pages and posts to the stack's content format, keeping slugs. Keep published dates
   and authors on posts.
2. Download only media that live content references. Convert to modern formats, keep originals
   out of the repo if over 1 MB.
3. Strip page-builder markup (Thrive, shortcodes) down to clean content. Where a layout can't be
   recovered from content alone, leave `TODO(dustin): layout` and keep going.
4. Rebuild forms on the stack and list each in `forms.json`.

## Phase 3: Redirects

1. Write `migration/redirects.csv`: `from,to,code,reason`. Every indexable URL in `urls.csv`
   either still resolves at the same path or gets a row here.
2. Map each old URL to its closest equivalent. Homepage only as a last resort, with a reason.
3. Cover WordPress leftovers that get traffic: `/feed/`, `/category/...`, `/tag/...`,
   `/author/...`, `/?p=ID`, `/wp-content/uploads/...` for linked files.
4. Generate the Vercel redirect config from the CSV. The CSV is the source of truth.

## Phase 4: Review

Deploy to staging and run the `site-reviewer` agent. Fix every blocker. Re-run until PASS.

**STOP**: send Dustin the staging URL, the reviewer result, and any `TODO(dustin):` items.

## Phase 5: Cutover (with Dustin, only when he says go)

1. Confirm the Turnstile widget exists for the domain and both keys are set in Vercel
   Production (new-site step 8). Without them every form on the live site rejects
   submissions. If they're missing, stop and ask Dustin.
2. On Dustin's go-live, open the PR from `staging` into `main` and merge it. Confirm the production deployment is live on its
   `*.vercel.app` URL and passes a quick reviewer run against it (form tests excluded).
3. Add the domain to the Vercel project. Read back the exact DNS records Vercel asks for.
   If the WordPress site being retired lives on a different domain (a legacy domain listed in
   `CLAUDE.md`), add that domain to this same project too, with host-based redirects from
   `migration/redirects.csv` so every old URL 301s to its new equivalent on the main domain.
4. Give Dustin the change list for SiteGround DNS: only the apex record and the `www` record.
   Every other record (MX, SPF, DKIM, DMARC, verification TXT) stays exactly as is.
   Ask him to export the zone as a backup first.
5. After DNS propagates: confirm HTTPS, submit each form once on the live domain with a
   `TEST` submission (Turnstile must pass with the real keys), check 20 random rows from `redirects.csv` on the live
   domain, submit `sitemap.xml` in Search Console.

**STOP**: report live status.

## Phase 6: Aftercare

- Week 1 and week 4: check Search Console for new 404s and coverage drops; add redirects as needed.
- After week 4 with no issues, tell Dustin the WordPress install can come off SiteGround.
