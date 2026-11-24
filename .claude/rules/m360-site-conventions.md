# Maverick360 site conventions

This file is managed by `maverick360brands/site-template` and synced into every site repo.
Don't edit it in a site repo; change it in site-template and run the kit-sync skill there.
Site-specific context lives in this repo's `CLAUDE.md`.

## Working with Dustin

- Direct and efficient. Don't explain obvious implications; he has already thought them through.
- No unsolicited brand, design, or color feedback. Designs and brand decisions come from him.
- Never invent facts, prices, credentials, testimonials, or claims. Leave a visible
  `TODO(dustin): <what's needed>` instead.
- When blocked, state the blocker and the decision needed in one or two lines, then stop.
- Report results as: what changed, the staging URL, the site-reviewer result, and what went live
  with its URL. Nothing else.
- Plain language. He doesn't use GitHub; never ask him to merge, click through PRs, or run git.

## Stack

- Framework: Next.js 15 (App Router), React 19, TypeScript (strict), npm, Node 20+. The app
  lives at the repo root. `trailingSlash: true`; redirects are single-hop 301s in
  `next.config.ts` (`statusCode: 301`, not `permanent`, which sends 308).
- Styling: Tailwind CSS v4 through `@tailwindcss/postcss`. Site tokens go in `@theme` in
  `app/globals.css`. Fonts are self-hosted with `next/font/local` and are never shared between sites.
- Content: Markdown in `content/pages/*.md` with strict frontmatter (`slug`, `title`,
  `metaTitle`, `metaDescription`, `h1`, optional `form`, `noindex`), validated by zod in
  `lib/content.ts`. Unknown keys fail the build. Rendered by `app/[[...slug]]/page.tsx`
  (static, one route per file). Raw HTML in Markdown is dropped.
- Forms: client component POSTs JSON to a route handler under `app/api/` (trailing slash
  included). The handler validates required fields and delivers by email through Resend (plain
  `fetch`, no SDK). Delivery switches on only when its env vars are set. Without them the
  submission is logged and still returns 200. Every subject sent off production is tagged `[staging]`.
- Spam protection: Cloudflare Turnstile on every form (`components/Turnstile.tsx`), verified
  server-side in the route handler (`lib/turnstile.ts`). The submit button enables only after
  Turnstile passes. Production uses the site's own keys (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`,
  `TURNSTILE_SECRET_KEY`). Without them on production, submissions are rejected. Off production,
  unset keys fall back to Cloudflare's always-pass test keys. Each form also keeps a hidden
  honeypot field (`website`): when it's filled, the handler drops the submission and still returns ok.
- Analytics: Google Tag Manager, loaded only when `VERCEL_ENV=production` and
  `NEXT_PUBLIC_GTM_ID` is set (Production env only). Staging and previews never load it.
- Indexing guard: `middleware.ts` sends `X-Robots-Tag: noindex, nofollow` on any host but
  production. `app/robots.ts` disallows everything off production. `app/sitemap.ts` lists
  production URLs for indexable pages only. Production host comes from `SITE_URL` in `lib/site.ts`.
- Images: `next/image` with AVIF/WebP output. Source images are committed already sized, with
  explicit width and height.
- Commands: `npm run dev`, `npm run build`, `npm run typecheck`, `npm test` (all Playwright),
  `BASE_URL=<url> npm run test:forms`.
- Env vars: listed in `.env.example`.
- Hosting: Vercel (Pro team). One Vercel project per repo.
- Database: none by default. Content lives as files in the repo. Use Neon only when a feature
  needs stored data (accounts, memberships, orders). Use the Neon–Vercel integration so each
  preview deployment gets its own database branch.
- DNS: stays at SiteGround. Nameservers never change.

## Branches and environments

- `main` → production. Protected: never commit or push to it directly. The only way in is the
  promotion PR from `staging`, which you open and merge yourself, without asking anyone first
  (Dustin, 2026-11-24).
- `staging` → the staging preview, a private link the site's approvers can look at. Every change goes
  through a PR into `staging`. You may merge your own PR into `staging` once `site-reviewer` passes it.

### Approvers

Each site's `CLAUDE.md` lists its approvers under "People". Dustin and Marie are approvers on every site.
The approver list is the same as the person list in `SITES.md` → Approvers. Approvers don't use
GitHub either; the same working rules apply to them as to Dustin (plain language, never ask
them to merge or run git).

### The change loop (every site, every agent)

An approver asks for a change. You handle the branches, PRs, and merges, and publish it yourself:
no approval step (Dustin, 2026-11-24).

1. Make the change on a work branch, PR it into `staging`, run `site-reviewer`, merge on PASS.
2. Open the PR from `staging` into `main` and merge it yourself. If `staging` changed after your
   `site-reviewer` run, run it again first. Confirm the production deployment succeeded.
3. Send the person you're working with what changed, the staging URL, the site-reviewer result,
   and what went live with its URL.
4. Tweaks requested: repeat from step 1.

Rules for step 2:
- Publish only in a session run by an approver for this site. For anyone else, stop at `staging`,
  send the preview, and say an approver can have it published by asking their own agent.
- `staging` may hold changes someone else made; they go live with yours. List them in step 3.
- Before a site's first go-live, `main` is promoted the same way; it serves only the private
  `*.vercel.app` production URL. Attaching the domain and the DNS change (wp-migration Phase 5)
  happen only when Dustin says go live.
- Never merge with `--admin` or bypass branch protection.

### Environments

- Work branches: `<topic>` off `staging`, e.g. `redirects`, `about-page`, `kit-sync-1.0.0`.
- Vercel Standard Protection with Vercel Authentication covers every non-production URL.
  Previews also send `noindex` by default. Don't add password protection (it's a paid add-on).
- Automated checks reach protected previews with the project's Protection Bypass for Automation
  secret, sent as the `x-vercel-protection-bypass` header. In cloud sessions the secret is in the
  environment as `VERCEL_BYPASS_<REPO>` (repo name upper-cased, dashes to underscores). On
  Dustin's Mac it's in the file `~/.config/m360/VERCEL_BYPASS_<REPO>`. Never print it.
- Secrets live in Vercel per environment. Never commit them. Production keys never enter a session.
- Staging uses test keys for spam protection, test form endpoints or tagged test submissions, and
  analytics off.

## Isolation

Each repo is one site.

- Links: any of Dustin's own-brand and partnership sites in `SITES.md` may link to each
  other. No `CLAUDE.md` entry is needed.
- Pen-name sites (bdchester.com, lunachester.com, whispersxo.com) and client sites are the
  exception. They never link to or from another site unless their `CLAUDE.md` lists it as
  related.
- Code and config stay separate on every site. Never import from, or share config, analytics
  IDs, tracking pixels, font files, or components with, another site's repo.

## Forms

Every form is listed in `forms.json` and covered by `tests/forms.spec.ts`. On staging, each form
must submit, return 2xx from its endpoint, and show its success state. Test submissions are tagged
`TEST – reviewer` or go to a sandbox endpoint, never into a live list or CRM. The form tests refuse
to run against a production host.

## Content and SEO

- Every page has a unique title, meta description, canonical, one H1, and Open Graph tags.
- JSON-LD where the site's `CLAUDE.md` calls for it. Validate it.
- `sitemap.xml` lists production URLs only. `robots.txt` allows production and nothing on staging.
- Images: modern formats, explicit width and height, alt text on content images, under 300 KB.
- Migrated sites keep URL parity or 301 each old URL to its closest equivalent (see the
  wp-migration skill). Never blanket-redirect to the homepage.

## Definition of done

A change is ready to publish when it builds, its tests pass, and the `site-reviewer` agent has
passed it against the staging URL with no open blockers. It is done when it is on `main` and the
production deployment succeeded.
