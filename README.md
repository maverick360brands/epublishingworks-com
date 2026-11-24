# epublishingworks.com

The ePublishingWorks website, rebuilt from WordPress (Thrive Theme Builder, Thrive Architect, and Yoast) on Next.js 16, Payload CMS 3, Tailwind CSS 4, and Vercel. It runs the same stack as riseuppublications.com.

- **Migration inventory (the WordPress site before the move):** [`migration/`](migration/): every URL with its SEO tags, the redirect map, notes on forms and tracking, the brand, and the catalog extraction report.
- **Site-specific rules for agents:** [`CLAUDE.md`](CLAUDE.md), plus the shared conventions in `.claude/rules/`.

## Getting started

You need Node 22 and a local Postgres database.

```bash
npm install
cp .env.example .env    # then set DATABASE_URL and PAYLOAD_SECRET
npm run payload migrate # creates the tables and imports the starting content (books, authors, posts)
npm run dev             # http://localhost:3000 (admin at /admin/; draft posts are visible)
npm run build           # migrates the database, then builds (drafts hidden)
npm run lint
npm test                # unit and integration tests (needs Postgres; see below)
npm run check:migrations # fails if a schema change has no migration (run after editing collections)
```

## Editing content

Books, authors, and blog posts are edited in the **admin at `/admin/`** (Payload CMS, stored in Neon Postgres, images in Vercel Blob). A save shows on the live site within seconds; no deploy is needed.

Everything else is edited in the code and deployed through the change loop (branch → `staging` → `main`):

| What | Where | Notes |
| --- | --- | --- |
| Privacy policy | `content/pages/privacy-policy.md` | Update `updated:` when the text changes; it shows as "Last updated". |
| Testimonials | `content/site/testimonials.json` | Keep quotes verbatim. |
| FAQs, navigation, contact details, page titles | `src/lib/site.ts` | The FAQ feeds the FAQ page, the home page, their FAQPage schema, and `/llms.txt`. |
| Page copy (home, advantage, submissions, about…) | `src/app/(frontend)/(site)/*/page.tsx` | Copy carried over from WordPress. |

`content/books`, `content/authors`, and `content/blog` are the Markdown extracted from WordPress. A one-time migration (`src/migrations/*_import_content.ts`) imports them into each new database during the build. Once production is verified they can be removed; after that the admin is the only place to edit them.

### Using the admin (for editors)

- **Sign in** at `/admin/` with your email and password.
- **Add a book:** Books → Create New.
  - Fill in the title and pick the author(s). If an author isn't in the list, use the **+** next to the Authors field.
  - Upload the cover and add alt text, e.g. "Cover of Strong Spirits by Alice Duncan".
  - Choose the **genre** (it drives the filter on `/books/`), and the series and number if it's part of one: the book page then shows the whole series in reading order.
  - Add the retailer links. Amazon (or the first link) becomes the main buy button. Links with an Amazon Associates tag are marked as sponsored automatically.
  - The page address is filled in from the title and first author (e.g. `/strong-spirits-alice-duncan/`). Change it only if needed: old links redirect automatically.
- **Feature a book** on the home page wall and featured row: tick **Feature in home hero**. Featured books also lead `/books/`.
- **Hide a book or author** without deleting it: tick **Hidden**. Visitors to its address are sent to the author's page (or the Authors page) until it's unhidden.
- **Delete:** a deleted book's address redirects to its author's page; a deleted post's address redirects to `/blog/`. An author who still has books can't be deleted until those books are reassigned or deleted.
- **Blog posts:** Posts → Create New.
  - Fill in the **In short** answer: 40–60 words that answer the post's question directly. It shows in a box at the top, and answer engines quote it.
  - Add a **Cover photo** (landscape, at least 1600 px wide, with alt text), or leave it empty to use the category artwork.
  - Use Heading 2 for sections (they become the table of contents) and Heading 3 inside them. Phrase most of them as the questions readers ask.
  - Aim for 1,800–2,500 words and 4–5 FAQs.
  - **Save Draft** keeps a post on preview links only; **Publish** puts it live.
- **Search & social (optional):** every book, author, and post has this section. Leave it blank to use the title, summary, and main image.
- **Old links:** Admin → Redirects lists every old address and where it now points. These are created automatically.

### Adding an editor

Admin → Users → Create New. Enter their email and a temporary password, and send them the password separately so they can change it under their account.

### Tests

- `npm test` runs the unit and integration tests. The integration tests use a separate Postgres database: `TEST_DATABASE_URL`, default `postgres://postgres:postgres@localhost:5432/epw_test`. It is wiped on each run.
- `npm run test:e2e` runs the Playwright tests against a running production build. Start it with `ROUTE_MANIFEST_TTL_MS=1000 npx next start -p 3100`.
- `BASE_URL=<staging url> npx playwright test tests/forms.spec.ts` submits every form in `forms.json` (tagged `TEST – reviewer`). It refuses to run against the production host.
- `npm run check:migrations` asks Payload to generate a migration and fails if one is needed. After changing a collection's fields, run `npx payload migrate:create <name>` and commit the new files; the build applies them.

## Forms

| Form | Page | Endpoint | Notes |
| --- | --- | --- | --- |
| Manuscript submission | `/submit-your-manuscript/` | `/api/manuscript/` | Same questions as the Thrive form. The file (.pdf, .doc, .docx, .zip, up to 20 MB) uploads from the browser straight to Vercel Blob under `manuscripts/` with a random, unguessable name; the email links to it. |
| Contact | `/contact/` | `/api/contact/` | |

Both forms email the team through Resend (the manuscript form then sends the visitor to `/thank-you/`; the contact form thanks them in place). Spam: the controller used on bluetowerroofs.com and the Orion site, copied into `src/lib/spam/` and adapted for a publisher (no Turnstile on this site, by Dustin's decision). In order: a same-site check, a per-IP rate limit (5 a minute), bot traps (honeypot, a form sent under 2.5 s after it appeared, a junk phone number, digits in a name, a random-string message: all get a quiet "ok"), pitch rules on the free-text answers (author and reader words pull the score down), and, when `ANTHROPIC_API_KEY` is set, a Claude check of anything the rules didn't settle. Flagged submissions never reach the team; they go to `SPAM_TO_EMAIL` marked `[spam]` if it's set. Each manuscript submission gets a 30-minute signed ticket that the upload and the form both require, so the upload route only hands out Blob tokens to the site's own form. Without `RESEND_API_KEY` and `CONTACT_TO_EMAIL`, submissions are logged and still accepted (so staging works). Subjects sent off production start with `[staging]`.

## SEO and AEO features

- Every WordPress URL keeps its address, trailing slash included, so no redirects are needed for live pages. Removed URLs (Thrive Apprentice course pages, the template page) are listed in `migration/notes.md`; old WordPress system URLs redirect in `next.config.ts`.
- Every book now has its own indexable page (`/<title>-<author>/`) with Book schema (author, series and position, genre, ISBN where known), its retailer links, the series in reading order, and more from the author. Before, most books existed only inside their author's page.
- Author pages group books by series, in reading order, with ProfilePage/Person schema linking the author to every book.
- `/books/` lists the whole catalog with search, a genre filter (shareable as `/books/?genre=Cozy%20Mystery`), and sorting.
- Per-page titles, descriptions, canonicals, and Open Graph data through the Next.js Metadata API; titles and descriptions start from the Yoast values in `migration/seo-meta.csv`.
- JSON-LD entity graph in `src/lib/schema.ts`: Organization, WebSite, Book, Person/ProfilePage, BreadcrumbList, FAQPage, BlogPosting, and ItemList.
- `sitemap.xml` (with image entries), `robots.txt` (blocks crawlers on preview deployments), `/blog/rss.xml`, and `/llms.txt`.
- Admin edits keep this intact: changed addresses redirect permanently, hidden items redirect temporarily, `lastmod` and `dateModified` come from real edit times, and published changes are sent to IndexNow in production.

## Environment variables (Vercel)

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin. Defaults to `https://epublishingworks.com`. |
| `NEXT_PUBLIC_GA_ID` | Google tag ID, Production only. The WordPress site uses `GT-K4VMCWDN`. |
| `RESEND_API_KEY` | Sends form email through Resend. |
| `CONTACT_TO_EMAIL` | Comma-separated recipients for form submissions. |
| `CONTACT_FROM_EMAIL` | Optional sender, e.g. `ePublishingWorks Website <website@epublishingworks.com>` (the domain must be verified in Resend). |
| `DATABASE_URL` | Neon Postgres for the CMS. Set by the Neon integration. |
| `PAYLOAD_SECRET` | Long random string that secures admin sign-ins and signs form tickets (`openssl rand -hex 32`). Required: the build fails without it. |
| `ADMIN_SETUP_EMAIL` | The only email that can create the first admin account (before anyone is signed in). |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob store for covers, photos, and uploaded manuscripts. Set by connecting the Blob store. Without it, the manuscript form hides the upload field. |
| `INDEXNOW_KEY` | Optional. 32 hex characters (`openssl rand -hex 16`), served at `/indexnow-key.txt`. Enables IndexNow pings in production. |
| `SITE_PASSWORD` | Optional. While set, every page asks for this password first (the admin keeps its own sign-in). |
| `ROUTE_MANIFEST_TTL_MS` | Optional. How often the proxy refreshes its address table, in milliseconds (default 30000). |
| `ANTHROPIC_API_KEY`, `ANTHROPIC_WORKSPACE_ID` | Optional Claude check in the spam filter (this site's own key). `SPAM_FILTER=off` turns the rules and AI check off; `SPAM_AI_MODEL` overrides the model. |
| `SPAM_TO_EMAIL` | Optional. Where flagged submissions go, marked `[spam]`, so a false positive is never lost. |
| `CONTENT_SOURCE` | Previews only: `files` serves the compiled Markdown instead of the CMS (no database; the admin doesn't work; pages send `noindex`). Remove it once the database is connected. |

## Launch checklist

- **Vercel project** `epublishingworks-com` (created, Maverick360 team, Vercel Authentication on): connect the Neon and Blob stores, set `PAYLOAD_SECRET` and `ADMIN_SETUP_EMAIL`, then **delete `CONTENT_SOURCE`** (the preview runs without a database until then; the build refuses files mode once a real domain is attached). Make `main` the repo's default and production branch.
- **Resend:** verify the sending domain and set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`.
- **Spam filter:** set `ANTHROPIC_API_KEY` (and `ANTHROPIC_WORKSPACE_ID` if the key isn't workspace-scoped) in Production for the Claude check, and `SPAM_TO_EMAIL` for flagged submissions.
- **Admin:** after the first production deploy, create the first user at `/admin/` with the `ADMIN_SETUP_EMAIL` address, then add the editors.
- **Catalog review:** read `migration/catalog-report.md` (books without buy links, genre judgment calls, anything the extraction couldn't resolve).
- **Blog:** have the client review the six launch articles (in the admin under Posts).
- **Legal:** the privacy policy carried over verbatim; consider a counsel review.
- **DNS:** at cutover, only the apex and `www` records change at SiteGround (see the wp-migration skill, Phase 5).

## Notes

- **Design:** the ePublishingWorks brand (logo, blues, yellow accent; see `migration/brand.md`) on the riseuppublications.com component system. Tokens live in `src/app/globals.css`. Dark brand surfaces are drawn in CSS; no image assets are shared with another site.
- **Book pages** use their own layout without the main menu (`src/app/(frontend)/(spotlight)/`), like the WordPress book landing pages; everything else uses `src/app/(frontend)/(site)/`.
- This app uses **Cache Components** (Next.js 16). Pages read one cached catalog snapshot from the CMS (`getCatalog()` in `src/lib/content.ts`, cache tag `content`), refreshed by Payload hooks on every save. Read `node_modules/next/dist/docs/` before changing data fetching; see `AGENTS.md`.
- **Statuses come from `src/proxy.ts`.** It answers for book, author, and blog addresses before the page streams, so statuses are real (hidden item 307, old address 308, unknown 404). It reads a small address table straight from Postgres (`src/lib/route-manifest.ts`), refreshed every 30 seconds.
- **Payload admin** has its own root layout in `src/app/(payload)/`; the site's is in `src/app/(frontend)/`. `src/app/global-not-found.tsx` renders the 404 page for URLs no route matches.
