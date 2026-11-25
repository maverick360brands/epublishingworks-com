# ePublishingWorks — epublishingworks.com

Shared rules: `.claude/rules/m360-site-conventions.md` (synced from site-template; don't edit here).
This file holds only what's specific to this site. Fill every `TODO(dustin):` from Dustin's input,
never from guesses.

## Site

- Domain: epublishingworks.com
- Repo / Vercel project: `epublishingworks-com`
- Owner entity: same owner as Rise UP Publications (riseuppublications.com). TODO(dustin): legal entity name.
- Status: migrate from WordPress (Thrive Theme Builder + Thrive Architect, Yoast). The WordPress export
  used for the migration is in the team Dropbox: `_CLIENTS/ePublishing Works/epublishingworks.WordPress.2026-11-24.xml`.
- Purpose and audience: an author-first independent publisher (80% to 85% royalties) of mostly crime fiction,
  mystery, cozy mystery, and historical romance, including reverted backlist titles. Two audiences: authors
  deciding where to publish, and readers browsing the catalog.
- Language and spelling: US English.

## Stack (differs from the kit default)

At Dustin's request this site runs the same stack as riseuppublications.com, not the kit's
Markdown-only default: Next.js 16 (Cache Components), Payload CMS 3 in the app (admin at `/admin/`),
Neon Postgres, Vercel Blob for uploads, Tailwind CSS 4. The code was copied from
`riseuppublications-com` (commit `ecd2f94`) and then made this site's own; nothing is imported from or
shared with that repo at runtime, and it can diverge freely. See `README.md` for how it works.

## People

Approvers (may approve a staging preview to go live; see the change loop in the conventions):
- Dustin
- Marie

## Related sites

- riseuppublications.com: sister brand. The FAQ sends Christian fiction and nonfiction there.
  TODO(dustin): confirm whether any other cross-links are wanted.

## Design

Brand carried over from the WordPress site (logo, palette, fonts: see `migration/brand.md`), laid out
with the riseuppublications.com component system. Designs come from Dustin. Don't change type, color,
spacing, or layout decisions without his direction.

- Eyebrows (`.type-kicker`): tangerine `#e8590c`, 19px extra-bold at every width (Dustin, 2026-11-25). At that
  size it's large text, so its 3.6:1 on white passes; never set an eyebrow smaller. Gold on the dark bands.
  Small labels inside cards (a book's series) use `.type-label` (13px blue caps), not the eyebrow.
- Menu: "Find Your Fit" opens the submission guidelines; the header button is "Get Started" (Dustin, 2026-11-25).
- Delight touches (2026-11-25), all off with reduced motion: the authors roll call comes into focus once;
  books reshelve (rise in) after a genre or sort change; the home 80–85% counts up once when scrolled to;
  the thank-you check draws itself and the manuscript illustration settles in; FAQs slide open.

## Pages

Every WordPress URL keeps its address (see `migration/urls.csv`). Book pages live at the site root as
`/<title>-<author>/`, the pattern the three existing book landing pages used; every book now has one.
Author pages stay at `/authors/<slug>/`, including the legacy forms `/authors/phoebe-conn-2/` and
`/authors/sl_menear/`. New: `/books/` (full catalog with genre filter) and the blog at `/blog/`.
Thrive Apprentice course URLs were dropped on purpose (no course); see `migration/notes.md`.

## Forms and integrations

- Forms: manuscript submission (`/submit-your-manuscript/`, with file upload to a private Vercel Blob store,
  `MANUSCRIPTS_READ_WRITE_TOKEN`; the email links to `/api/manuscript/file/`, which only signed-in editors can open) and contact
  (`/contact/`). Both email the team through Resend. TODO(dustin): recipient addresses (`CONTACT_TO_EMAIL`).
- Every "Submit Your Manuscript" CTA has a "Start With a Sample" partner (`src/components/SampleCta.tsx`; the one
  exception is the compact button in the desktop header, where there's no room; the phone menu has both), which opens
  the form with "Sample chapters" chosen; the form asks what's being sent and needs a file only for the full
  manuscript or sample chapters (Dustin, 2026-11-24). The padlock notice on the form (`SecureBadge.tsx`) states only
  what the build does: HTTPS (HSTS in `next.config.ts`), private store, downloads only for people signed in to the
  admin; the storage lines show only when uploads are on. Change it if the storage changes.
- Spam: no Cloudflare Turnstile on this site. Dustin (2026-11-24): use the spam controller from bluetowerroofs.com
  and the Orion site. Copied into `src/lib/spam/` and adapted (no import or shared module): same-site check, rate
  limit (5 a minute per IP), bot traps (honeypot, `_t` under 2.5 s, junk phone, digits in names, random strings),
  pitch rules with publishing vocabulary, optional Claude check (`ANTHROPIC_API_KEY`, this site's own key).
  Flagged submissions go to `SPAM_TO_EMAIL` marked `[spam]`, never to the team. TODO(dustin): the Claude API key
  and `SPAM_TO_EMAIL` in Vercel Production.
- Email platform / CRM: none found on the WordPress site.
- Analytics IDs (production only): the WordPress site loads Google tag `GT-K4VMCWDN`. TODO(dustin): confirm
  it should carry over (set `NEXT_PUBLIC_GA_ID` in Vercel Production).

## Data

Database: Neon Postgres, for the CMS (books, authors, blog posts, redirects, editors). Uploads in Vercel Blob.

## Legacy domains and redirects

No other domains. Old-URL redirects are in `migration/redirects.csv` and `next.config.ts`; address changes
made in the admin create their own redirects.

## Site-specific rules

- Forms don't use Turnstile, overriding the kit convention; they use the spam controller (see Forms and integrations).
- Branches: `main` was created from `staging` on 2026-11-24, before go-live, and is Vercel's production branch.
  Publishing follows the kit's change loop (1.3.0: agents merge the `staging` → `main` PR themselves, no approval step).
- Book and author content is edited in the admin (`/admin/`), not in `content/`. The Markdown in
  `content/` only seeds a new database.
- Blog covers: one house style, a cut-paper collage in navy, logo blue, sky and gold on cream (Dustin,
  2026-11-24). Recipe and how to add one: `docs/blog-covers.md`. An uploaded cover wins; otherwise
  `src/lib/post-art.ts`. Category labels on covers stay small; the title leads.
- Keep testimonials verbatim (`content/site/testimonials.json`).
- ePublishingWorks is an Amazon Associate: some Amazon links carry its tag (`wwwebookdisco-20`), and the
  footer keeps the Amazon Associates disclosure, which the program requires. Keep retailer links verbatim.
