# ePublishingWorks: Phase 1 inventory notes

Read-only inventory of https://epublishingworks.com, done 2026-11-24 for the rebuild on the RiseUP Publications stack. Nothing on the live site was changed. Sources: Yoast sitemaps, public REST API (`/wp-json/`), one GET of every page (polite, ~1 request per 0.6–0.7 s, browser User-Agent; no 403s or challenge pages), and the WordPress export (WXR) as a cross-check. The export matches the live pages closely (same Yoast titles/descriptions; body text differs only where Thrive renders symbols/buttons at runtime), so live copy was used throughout.

## 1. Inventory summary

| Type | URLs | Notes |
|---|---:|---|
| home | 1 | `/` |
| page | 9 | `/about/`, `/the-advantage/`, `/submission-guidelines/`, `/submit-your-manuscript/`, `/frequently-asked-questions/`, `/reviews/`, `/contact/`, `/authors/` (index), `/blog/` |
| author | 57 | `/authors/<slug>/` (children of the Authors page) |
| book | 3 | `/spirits-adopted-alice-duncan/`, `/celluloid-angels-alice-duncan/`, `/dancing-angels-alice-duncan/` |
| legal | 1 | `/privacy-policy/` (also holds the Terms of Use) |
| utility | 2 | `/thank-you/` (form confirmation), `/author-name-book-or-series-title/` (placeholder template) |
| **Total in `urls.csv`** | **73** | |

- **Indexable: 73 of 73.** Every URL returns 200, has `index, follow`, no `X-Robots-Tag`, and a self-referencing canonical. That includes three that should not be indexable: `/thank-you/`, `/author-name-book-or-series-title/` (placeholder) and `/blog/` (empty).
- `page-sitemap.xml` lists 73 URLs. 72 are in `urls.csv`; the 73rd, `/apprentice-registration-page/`, is Thrive Apprentice and left out on purpose (see section 10). `/blog/` is a published page that is **not** in the sitemap and was added.
- The WXR has 74 published pages (= the 73 above + the apprentice page), **0 posts**, 1,302 media items, 0 comments.
- **Author count is 57, not 64.** The sitemap, the WXR (pages with parent 4639) and the REST API all agree on 57 author pages. 56 are linked from `/authors/`; `/authors/ann-yost/` is in the sitemap but no card links to it (the Ann Yost card in the Mystery tab links to `/authors/dallas-gorham/` by mistake). The only slug with an underscore, `sl_menear`, keeps its address on the new site (URL parity; the stack allows underscores in legacy author addresses). `/authors/phoebe-conn-2/` has a `-2` because `/authors/phoebe-conn/` is taken by an image attachment.
- Meta descriptions: only 10 of 73 URLs have one (`/`, `/about/`, `/the-advantage/`, `/submission-guidelines/`, `/submit-your-manuscript/`, `/frequently-asked-questions/`, `/reviews/`, `/contact/`, `/authors/`, `/dancing-angels-alice-duncan/`), all set in Yoast. All 57 author pages, the other 2 book pages, privacy, thank-you, blog and the template page have none and use the default title "<Page title> - ePublishingWorks".
- Author pages all share the H1 "One of our esteemed Authors." (a few variants: no full stop, lower-case "authors"); the author's name is not in the H1.
- Book landing pages have 3 H1s each ("<Title>", "ORDER NOW", "Author"); the template page has "Full Book Title", "Get it at your favorite retailer!", "Author". `/submission-guidelines/` has 2 H1s. `/blog/` has none.

Other WordPress URLs checked:

| URL | Live status | Handling |
|---|---|---|
| `/feed/`, `/comments/feed/` | 200 (empty RSS, linked from every page `<head>`) | 301 → `/blog/rss.xml` |
| `/category/<slug>/` (11 categories, all 0 posts) | 200, index,follow, "Other Archives" etc. | 301 → `/blog/` each |
| `/tag/<slug>/` (83 tags, all 0 posts) | 200 | one pattern row → `/blog/` |
| `/author/<user>/` (anna, dustinadmin, marieadmin, rebekah) | 200, noindex | 301 → `/blog/` |
| `/?p=ID`, `/?page_id=ID` | 301 to the permalink | rows for all 73 pages |
| `/sitemap_index.xml`, `/page-sitemap.xml`, `/wp-sitemap.xml` | 200 / 200 / 301 | 301 → `/sitemap.xml` (the new site's own sitemap) |
| `/?attachment_id=N`, attachment permalinks | 301 to the file (Yoast) | none; nothing links to them |
| `/?s=…` (search), `/page/2/` | 200 | none (query/pagination URLs, not linked anywhere) |
| `/wp-admin/…`, `/wp-login.php` | 200 | 302 → `/` |
| `/wp-content/uploads/…` files linked from pages | **none found** (no PDFs, docs or audio are linked from any live page) | no rows needed |

The category and tag names (Talk with Tom, Coaching Suggestions for the Week, Affirmations…, Grow Your Life…) and about 620 media items in dated folders 2013–2024 (incl. 15 MP3s such as "Talk-with-Tom-…mp3" and "day-1c-meditation.mp3", "Lotus-icon" images, "Shareholders-Agreement" covers) are unrelated to publishing; the install looks re-used from an older site. None of it is linked from the live pages. 682 media items sit in the flat `/uploads/` folder (the current site's images).

## 2. Plugins and platform visible in page source / REST API

Host: SiteGround (nginx, `x-proxy-cache`, SG Optimizer lazy-load; REST namespaces `sg-ai-studio`, `siteground-optimizer/v1`, `sg-security/v1`).

| Plugin / product | Evidence |
|---|---|
| Thrive Theme Builder (theme `thrive-theme`, v11.4 assets) | `wp-content/themes/thrive-theme`, `ttb/v1`; theme templates, layouts, symbols (header 4605, footer 4607, FAQ 4969, Testimonials 5575, Full Reviews 5683, Manuscript Submission Form 5619, Author Bio 4654, Book Template 4656) |
| Thrive Architect (`thrive-visual-editor`) | every page is a Thrive landing page (`tve_lp`), `tcb/v1` |
| Thrive Leads | `tve-leads/v2` + `tve_leads_ajax_impression/conversion` in page JS; **no opt-in forms or popups are displayed** |
| Thrive Apprentice | `tva/*` REST, CPTs, assets loaded only on `/apprentice-registration-page/` (to be removed) |
| Thrive Automator | `tap/v1` (automations not visible publicly) |
| Thrive Dashboard / Product Manager and other Thrive Suite modules | `tve-dash/v1`, `thrive-product-manager/v1`, `td/v1`, `td-metrics/v1`, `tss/v1`, `trd/v1`, `thrivethemes/v1`, `thrivethemes/v2-automations`; login-screen branding post (`tvd_login_edit`) |
| Yoast SEO | sitemaps, `yoast/v1`, schema graph (WebPage, WebSite, Organization, BreadcrumbList, ImageObject) |
| Google Site Kit 1.192.0 | `<meta name="generator">`, gtag snippet, "content events" script |
| WP Mail SMTP | `wp-mail-smtp/v1` (outgoing mail; settings not public) |
| SiteGround Optimizer / Security / AI Studio | see Host above |
| WooCommerce templates | Thrive templates "Shop 01", "WooCommerce Cart/Checkout/Account" exist, but WooCommerce itself is **not** active (no `wc/` REST namespace, no shop URLs). No membership plugin. |

## 3. Forms

All forms are Thrive Architect "Lead Generation" elements. They submit by AJAX to `https://epublishingworks.com/wp-admin/admin-ajax.php` (`<form action="#" method="post">`, Thrive `data-connection="api"`). **No CAPTCHA** (`"recaptcha":[]`, `"turnstile":[]`). Where submissions go (email notification / CRM list) is stored in Thrive form-settings records (IDs below) that are not in the export or page source: **check Thrive Dashboard → API Connections and each form's settings in WP admin before cutover.**

### 3.1 Manuscript submission form: `/submit-your-manuscript/`

- Thrive template "Application Form 08", element id `lg-m79z1lw3`, form settings id **5612**, file-upload config id 5614. Lives in a dark-blue section inside a white box under the H3 "Submit Your Manuscript". Also saved as the symbol "Manuscript Submission Form" (5619).
- On submit: **redirects to `/thank-you/`** (`_submit_option=redirect`, `_back_url=https://epublishingworks.com/thank-you/`). Stored messages: success "Sign up successful", error "Error!" (the success text is never shown because of the redirect).
- **File upload goes to Dropbox**: folder "EPW Manuscript Submissions" (Dropbox folder id `id:M18LGrNytoEAAAAAAAAABg`), file name pattern `Manuscript-Upload__{date}__{match}`, 1 file, max 20 MB, required, allowed types: zip + "documents" (pdf, doc, docx, ppt, pptx, pps, ppsx, odt, xls, xlsx, psd, txt, zip, tar, gzip, gz).

| # | Label as shown | Field (name / data-name) | Type | Required in code | Notes |
|---|---|---|---|---|---|
| 1 | First Name* | `name` / Name | text, placeholder "First Name" | **no** | label shows * but not enforced |
| 2 | Last Name* | `mapping_text_624` / Last Name | text, "Last Name" | yes | |
| 3 | Email Address* | `email` | email, "Email Address" | yes | email validation |
| 4 | Phone* | `phone` / Phone | text, "Phone Number" | **no** | label shows * but not enforced |
| 5 | Author Pen Name *(Optional)* | `mapping_text_516` / Pen Name | text, "Optional Pen Name" | no | |
| 6 | Select the Most Appropriate Genre* | `mapping_select_278` / Book Genre | dropdown, "Please Select Genre" | yes | options: Thriller, Cozy Mystery, Mystery, Romance, Poetry, Young Adult Fiction, Non-Fiction, Memoir/Auto-Biography, Children's, Other |
| 7 | Book Title* | `mapping_text_349` / Book Title | text, "Book Title" | yes | |
| 8 | What is your book or series about?* | `mapping_textarea_92` / Synopsis | textarea, "Brief book/series synopsis...", 3 rows | yes | min 10, max 350 characters, live counter "0 of 350" |
| 9 | Has your book already been edited?* | `mapping_radio_465` / Already Edited | radio | yes | "Yes, already edited." / "No, not edited." |
| 10 | If already edited, by whom? | `mapping_text_149` / Edit By Whom | text, "If edited, by whom?" | no | |
| 11 | Are you seeking to solve a problem with a new publisher?* | `mapping_text_979` / Solving a Problem | text, "e.g. Poor royalties, no book ownership, etc." | **no** | label shows * but not enforced |
| 12 | What interests you most about ePublishing *Works!* as an author?* | `mapping_checkbox_697[]` / Interest in EPW | checkboxes | yes | Higher Royalties, Retain Book Ownership, Ability to Focus on Writing, Professional Guidance, Alignment and Fit, Our Genre List, Other |
| 13 | How did you hear about ePublishing *Works!* ?* | `mapping_radio_716` / Hear about EPW | radio | yes | Web Search, Referral, Online Ad, In-Person Event, Email, Other |
| 14 | Upload Your Manuscript (.pdf, .doc, .docx, .zip – max 20MB) | `mapping_file_687` / Manuscript Upload | file (drag and drop, "Drag and drop file here... or Select file...") | yes | see Dropbox above |
| – | button | | "Submit Manuscript" | | |

Error messages configured: "Email address invalid", "Phone number invalid", "Required field missing", file size/extension/max-files messages, "At least one file is required", "File upload in progress. Please wait for the upload to finish and try again."

### 3.2 Contact form: `/contact/` ("Quick Contact")

- Thrive template "Application Form 10", element id `lg-m4bdjak4`, form settings id **4673**. In a white box in the right column of the dark-blue contact section, under the H1 "Quick Contact".
- On submit: **stays on the page and shows an inline message** (`_submit_option=message`): success "Thanks for reaching out! We will reach out soon.", error "Error!". No confirmation page.

| Label | Field | Type | Required in code | Notes |
|---|---|---|---|---|
| Name * | `name` | text, placeholder "Name" | **no** (label shows *) | |
| Email * | `email` | email, "Email" | yes | email validation |
| Message | `mapping_textarea_889` / Message | textarea, "Write Message" | no | max 350 characters, counter "0 of 350" |
| – | button "Contact Us" | | | |

The page copy asks people to "include a list of your past titles (if any), and your genre and sub-genre of interest" but the form has no field for it beyond Message (350 characters).

### 3.3 Other forms

- `/blog/`: the theme's WordPress search box ("Search for:", GET `/?s=`). Placeholder, not migrated.
- `/apprentice-registration-page/`: Thrive Apprentice account sign-up (email, password, confirm, "Sign Up"). Removed with Thrive Apprentice.
- No newsletter / opt-in form anywhere on the site.

Confirmation page: `/thank-you/` (H1 "Success!", "Thank you for your submission to ePublishingWorks! Our team will review your information and reach out within 48 hours."). Only the manuscript form uses it.

## 4. Embeds and interactive elements

- **No iframes, videos, maps or booking widgets** on any page (no YouTube/Vimeo, no Calendly, no Google Maps).
- Thrive image carousels: Home hero (8 covers) and Submit page (7 covers); one image at a time with arrows, 500px tall.
- Thrive accordion ("Toggle") for the 6 FAQs (FAQ symbol on 3 pages).
- Thrive vertical tabs on `/authors/` (6 genre tabs).
- Star-rating graphics (5/5) on testimonial cards and under the Reviews H1.
- Animated hand-drawn "wavy" underline highlights (Home H1 words, "royalties" on The Advantage).
- Countdown timer on the book landing pages / template ("NEW Book Launch in...", expired state "You missed out!") – book pages are out of scope here but this element will not move as content.
- Sticky header that switches to a second state after 100px of scroll.

## 5. Tracking and verification IDs

| ID | What | Where found |
|---|---|---|
| **GT-K4VMCWDN** | Google tag (gtag.js), added by Google Site Kit ("Google Analytics snippet added by Site Kit"), with `linker` for epublishingworks.com | `<head>` of every page: `googletagmanager.com/gtag/js?id=GT-K4VMCWDN`. The GA4 measurement ID (`G-…`) behind this Google tag is not in the source; look it up in Site Kit / GA admin and use it for `NEXT_PUBLIC_GA_ID`. |
| Site Kit content events | `googlesitekit-events-provider-content-events` script (read-time/scroll events through gtag) | every page |
| `imiJzeMIxugvG_OLrrWL9IVqiQQ_Wyi9cPElAQOsm8o` | `google-site-verification` meta tag (Search Console) | every page `<head>`; keep it on the new site unless the property is DNS-verified |
| none | No Google Tag Manager container (no `GTM-`), no Meta/Facebook pixel, no LinkedIn/TikTok/Pinterest/Bing/Hotjar/Clarity, no AdSense | checked all 74 pages |
| Thrive Leads impressions/conversions | internal WordPress AJAX analytics | page JS |

Affiliate IDs (on author/book pages only, not core pages; for the author/book migration): Barnes & Noble via CJ (`anrdoezrs.net/links/7960781/…`, 10 links), Google Play `PAffiliateID=1100lcQHW`, Kobo `utm_source=linkshare_us` / `walmarthybrid`, `bwlnk.com` redirect links (11), `amzn.to` and `bit.ly` short links (24). Amazon Associates tags on Amazon links in the book listings (counted in `content/books/` after the catalog extraction; the core pages carry none): `wwwebookdisco-20` (148 links), `epubworkforre-20` (4, Sharon Ihle and Phoebe Conn), `wwwbookwirede-21` (4: Death of a Crooked Cat, In Want of a Wife, The Last Renegade, True to the Law), and one malformed `wwwebookdisco-20-20` (Scoundrel for Hire). Links are kept verbatim. TODO(dustin): confirm which tags are ePublishingWorks' own; `wwwbookwirede-21` may belong to someone else.

## 6. Email and CRM integrations

- Thrive Lead Generation forms with an API connection (`data-connection="api"`); the connected service(s) are not exposed publicly (see Forms). WP Mail SMTP is installed, so WordPress email notifications are likely one destination: confirm in WP admin.
- **Dropbox** (Thrive file-upload API) receives manuscript files: folder "EPW Manuscript Submissions".
- Thrive Automator is installed (possible automations on form submit; not visible publicly).
- No mailing-list provider scripts (Mailchimp, ConvertKit, MailerLite, ActiveCampaign, etc.) and no newsletter forms on the site.

## 7. Contact details shown on the site

- Email: **info@epublishingworks.com** (footer line on every page; privacy policy and terms). In the privacy/terms text the address is styled as a link but has no `href` (pasted from a chat tool: the HTML carries `data-start`/`data-end` attributes); the new file uses `mailto:`.
- Phone: **866.846.5123** (footer) / **866-846-5123** (contact page H3). Plain text, not a `tel:` link. Same number as RiseUP Publications (`src/lib/site.ts` on the sister site).
- Address: **644 Shrewsbury Commons Ave, Suite 249, Shrewsbury, PA 17361** (footer only).
- Social profiles: **none** for the brand. No social links in header/footer, no `sameAs` in the Yoast schema. (Facebook links on two author pages belong to the authors.)
- Sister brand: FAQ links to `http://www.riseuppublications.com/` for Christian fiction/non-fiction.
- Testimonials name "Brian" as the publisher ("Brian and the team…", "Brian [publisher]…"); no founder or staff names appear elsewhere on the site.

## 8. Header and footer (shared on every page)

**Header** (symbol "EPW Header" 4605): white, sticky; logo `logo-primary.png` linking to `https://epublishingworks.com`.

- Default state menu: **Why Choose Us?** → `/about/` (dropdown: Our Signature Advantage → `/the-advantage/`, Submission Guidelines → `/submission-guidelines/`, Frequently Asked Questions → `/frequently-asked-questions/`) · **Reviews** → `/reviews/` · **Authors** → `/authors/` · **Contact** → `/contact/` · **Submit Manuscript** → `/submit-your-manuscript/` (outlined pill).
- Scroll state (after 100px): **Home** → `/` · **Why Choose Us?** → `/about/` (dropdown: Our Signature Advantage, Submission Guidelines; no FAQ) · **Authors** · **Contact** · **Publish Your Book** → `/submit-your-manuscript/` (pill). Reviews is missing from this state.
- Mobile: hamburger menu.

**Footer** (symbol "EPW Footer" 4607): near-black `#0C1115`.

- Reversed logo `logo-primary-reversed.png` linking home.
- Menu: Home (`/`) · About (`/about/`) · Our Advantage (`/the-advantage/`) · Submission Guidelines (`/submission-guidelines/`) · Contact (`/contact/`).
- "© Copyright 2026. All rights reserved." (year is dynamic)
- "ePublishing Works is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to amazon.com."
- "Privacy Policy" → `/privacy-policy/` and "Terms & Conditions" → `/privacy-policy#TERMS`.
- H3: "644 Shrewsbury Commons Ave, Suite 249, Shrewsbury, PA 17361 | info@epublishingworks.com | 866.846.5123" (plain text, no links).

The book landing pages and the template page use their own minimal footer: "Copyright 2025 • All Rights Reserved • Privacy Policy & Terms of Use" (link to `/privacy-policy/`). That is where the "Privacy Policy & Terms of Use" wording comes from.

## 9. Things that won't move as plain content

- Thrive layout: sections, columns, wave dividers, diagonal gradients, photo-as-column-background with blue overlay, sticky two-state header. Layout is described per section in `migration/pages/*.md` (`<!-- layout: … -->`).
- Shared Thrive symbols repeated across pages: FAQ block (Home, FAQ, Submission Guidelines), Testimonials block (The Advantage, Submission Guidelines), 3-step roadmap (Home, Submission Guidelines; variant on About), closing CTA band (Home, The Advantage). These should become reusable components.
- Forms (2) with Thrive's AJAX handler, Dropbox upload and unknown API connections; the new stack must rebuild both and decide where manuscripts go (Dropbox or elsewhere) and who gets notified.
- Carousels, accordion, tabs, star ratings, animated underline highlights, button hover animations, countdown timers (book pages).
- Inline SVG icons from Thrive icon packs (Font Awesome / Material duotone names noted in the page files): replace with the stack's icon set.
- Testimonial "cards" with photo + stars + headline + quote: data is in `content/site/testimonials.json`.
- Yoast schema graph and default OG image (`/images/site/social-share.jpg`).
- Amazon Associates disclosure in the footer (keep if any links will carry an Associates tag).
- Unrendered/placeholder template output on `/blog/` (see below) and the template page.

## 10. Intentional changes

### Thrive Apprentice removed (client instruction: no course)

These URLs are left out of `urls.csv`/`seo-meta.csv` and get **no redirect**; they will 404 on the new site. Today only the registration page is live; every course URL below already returns 404 on the live site (checked 2026-11-24), even though two of them are still listed in Yoast sitemaps. The content is Thrive Themes' demo course ("Scarcity Marketing…", "From Internet Rubbish to Content Marketing Gold"), not ePublishingWorks material.

| URL | WordPress item | Live status |
|---|---|---|
| `/apprentice-registration-page/` | page 4136 "Apprentice registration page" (in `page-sitemap.xml`, index,follow, account sign-up form) | **200** |
| `/chapter/scarcity-marketing-secrets/` | tva_chapter 4165 (in `tva_chapter-sitemap.xml`) | 404 |
| `/complete/congratulations/` | tva_course_completed 4173 (in `tva_course_completed-sitemap.xml`) | 404 |
| `/module/learn-how-to-use-scarcity-marketing/` | tva_module 4164 | 404 |
| `/module/putting-scarcity-marketing-into-practice/` | tva_module 4170 | 404 |
| `/assessment/assessment-two-scarcity-marketing-recipes/` | tva_assessment 4185 | 404 |
| `/tva_course_type/4135/` | tva_course_type 4135 | 404 |
| `/course/intro-proof/` | tva_lesson 4166 | 404 |
| `/course/scarcity-marketing-good-bad-examples/` | tva_lesson 4167 | 404 |
| `/course/how-to-build-courses-with-thrive-apprentice/` | tva_lesson 4168 | 404 |
| `/course/how-to-build-a-digital-product-empire/` | tva_lesson 4169 | 404 |
| `/course/behind-the-scenes-our-exact-scarcity-marketing-sequence/` | tva_lesson 4171 | 404 |
| `/course/two-scarcity-marketing-recipes/` | tva_lesson 4172 | 404 |
| `/course/introduction-from-internet-rubbish-to-content-marketing-gold/` | tva_lesson 4175 | 404 |
| `/course/why-most-internet-content-never-sees-the-light-of-day/` | tva_lesson 4176 | 404 |
| `/course/mastering-your-technique-and-presentation/` | tva_lesson 4177 | 404 |
| `/course/introduction-from-internet-rubbish-to-content-marketing-gold-2/` | tva_lesson 4179 | 404 |
| `/course/introduction-from-internet-rubbish-to-content-marketing-gold-3/` | tva_lesson 4181 | 404 |
| `/course/introduction-from-internet-rubbish-to-content-marketing-gold-4/` | tva_lesson 4183 | 404 |
| `/course/thrive-themes-22-tips-to-build-your-mailing-list-faster/` | tva_courses term | 404 |
| `/course/thrive-themes-assessment-course-demo/` | tva_courses term | 404 |
| `/course/thrive-themes-build-a-conversion-focused-website-from-scratch/` | tva_courses term | 404 |
| `/course/thrive-themes-from-internet-rubbish-to-content-gold/` | tva_courses term | 404 |
| `/course/thrive-themes-make-more-sales-without-needing-more-traffic/` | tva_courses term | 404 |
| `/course/thrive-themes-multi-step-mastery-build-a-targeted-mailing-list/` | tva_courses term | 404 |
| `/?post_type=tva_course_overview&p=4163` (also 4174, 4178, 4180, 4182, 4184) | 6 draft "Course overview post" items | drafts, not public |
| `/tva_lesson-sitemap.xml`, `/tva_chapter-sitemap.xml`, `/tva_module-sitemap.xml`, `/tva_assessment-sitemap.xml`, `/tva_course_completed-sitemap.xml`, `/tva_courses-sitemap.xml` | Yoast sitemaps listed in `sitemap_index.xml` | 200 (only chapter and course_completed list a URL) |

Because `/apprentice-registration-page/` is indexable and in the sitemap, Google may report it as a new 404 after cutover; a `410 Gone` would be cleaner if the stack supports it.

### Other changes

- **Blog added.** `/blog/` exists today only as an empty theme placeholder (no posts, unrendered pagination shortcodes, Thrive default CTA "Direct Your Visitors to a Clear Action at the Bottom of the Page"). The new site adds a real blog at `/blog/` with `/blog/rss.xml`; old `/feed/`, `/comments/feed/`, category, tag and user archives redirect there.
- `/authors/sl_menear/` keeps its address (no redirect). `/authors/phoebe-conn/` (attachment URL today) → `/authors/phoebe-conn-2/`.
- `/author-name-book-or-series-title/` (placeholder book template, indexable, in the sitemap; copy is all filler: "Full Book Title", "by Author Name", "Here you want to write a short introductory paragraph…", retailer buttons linking to `#`) is not migrated → 301 to `/books/`.
- `/thank-you/` should be `noindex` and out of the sitemap on the new site.
- The 3 book landing pages keep their root paths (`/<book-slug>/`), author pages keep `/authors/<slug>/` exactly (including `sl_menear` and `phoebe-conn-2`), and core pages keep their paths, so none of them get redirect rows.
- Terms of Use live inside the privacy page (anchor `#TERMS`); footer link "Terms & Conditions" points to `/privacy-policy#TERMS`. They are kept verbatim at the end of `content/pages/privacy-policy.md`. If the new site gets a separate `/terms/` page (as RiseUP has), keep an anchor or link at `/privacy-policy/#TERMS`, because a URL fragment cannot be redirected server-side.

### Decisions made during the build (2026-11-24)

- **A page for every book (approved by Dustin).** On WordPress, 507 of the 510 books existed only inside their author's page. Each now also has its own page at `/<title>-<author>/` (the pattern of the 3 existing landing pages), with Book schema, buy links, and the series in reading order. Author pages still list every book.
- **New pages:** `/books/` (full catalog with search and genre filter) and the blog. Nothing else is added at the root.
- **Titles and descriptions:** core pages keep their live Yoast title and description verbatim, except the FAQ description, which promised answers about royalties and distribution the page doesn't give; it now describes what the page answers. Author, book, and blog pages that had only WordPress default titles ("Name - ePublishingWorks") get descriptive titles ("Name: Books & Biography", "Title by Author").
- **Headings:** one H1 per page. Submission Guidelines' second H1 ("Getting Started Is Simple") is an H2; Contact's H1 is "We'd love to hear from you." and the form keeps its "Quick Contact" heading.
- **`/thank-you/`** is `noindex` and left out of the sitemap. Its "within 48 hours" line is kept verbatim (it conflicts with "2 to 4 business days" elsewhere; see section 11).
- **Reviews heading typo** ("some our authors") reads "some of our authors".
- **Navigation:** Books, Authors, About, The Advantage, Submissions, Blog, Contact (the WordPress menu had About as "Why Choose Us?", The Advantage, Submission Guidelines, and FAQ). FAQ and Reviews are in the footer.
- **Forms:** same fields as Thrive and the same required fields: on the manuscript form everything marked `*`, including the file (when uploads are on); on the contact form name and email, with the message optional and up to 350 characters, as on Thrive. Manuscript files upload to a private Vercel Blob store (instead of the Dropbox folder "EPW Manuscript Submissions"); the notification email links to `/api/manuscript/file/`, which serves the file only to an editor signed in to the admin. No Turnstile: the spam controller used on bluetowerroofs.com and the Orion site (Dustin's choice), copied into `src/lib/spam/`.
- **Search titles and headings that differ from WordPress:**
  - `/privacy-policy/`: title "Privacy Policy & Terms of Use | ePublishingWorks" (was "Privacy Policy - ePublishingWorks"), H1 "Privacy Policy & Terms of Use", and a description (it had none).
  - `/thank-you/`: title "Thank You for Your Submission | ePublishingWorks" (was "Thank you - ePublishingWorks"), with a description taken from the page's own copy.
  - Author pages: the H1 is the author's name (every WordPress author page had the same H1, "One of our esteemed Authors."), and each has a description from the start of the bio.
  - Book pages: a description from the start of the book's description. Dancing Angels keeps its Yoast description verbatim.
  - The three WordPress book landing pages: `/spirits-adopted-alice-duncan/` drops the "New Book:" prefix from its title (was "New Book: Spirits Adopted by Alice Duncan - ePublishingWorks"; now "Spirits Adopted by Alice Duncan | ePublishingWorks", like every book page), and each H1 is the book title alone (was "Title | ORDER NOW | Author"; the author and the buy buttons sit under it).
  - Search titles over 60 characters drop the byline when the book has a subtitle (box sets differ only by it). Some long titles still run past 60 characters and are shortened in search results.
- **Redirects and status codes:** address changes made in the admin answer with a 301 (hidden items with a 302), as the conventions ask. The six Thrive Apprentice sitemaps still listed in the live `sitemap_index.xml` 301 to `/sitemap.xml`. Root paths with a file extension the site doesn't serve (`/index.php`, `/xmlrpc.php`, `/readme.html`) are real 404s. Old addresses typed without the trailing slash take one extra hop (Next.js adds the slash, then the 301), e.g. `/feed` → `/feed/` → `/blog/rss.xml`.
- **Indexing:** only epublishingworks.com and www are indexable. Every other host (the `*.vercel.app` addresses, previews) sends `X-Robots-Tag: noindex, nofollow` and a disallow-all `robots.txt`.
- **`/books/`** shows 60 books at a time with a "Show More Books" button; search and the genre filter cover all 510.
- **Fonts:** one self-hosted variable font (Manrope) replaces Manrope, Muli, and Lato from Google Fonts.
- **Home page:** the carousel's books are featured (in its order) on the cover wall and a new "Featured books" row; "Eternal Beloved" by Mary Ellen Johnson appears only in that carousel, not on her author page, so it isn't in the catalog yet.
- **A lighter way in (Dustin, 2026-11-24).** Beside every "Submit Your Manuscript" button (except the compact one in the desktop header, where there's no room) there is now a "Start With a Sample" button, or a line "Not ready to send the whole book? Start with a sample: a few chapters, a synopsis, or an outline." where a spot already has two buttons or little room (header phone menu, footer, blog, in-article note for authors, FAQ, contact, reviews). Both open `/submit-your-manuscript/?send=sample#submit`. The manuscript form gained one required question, "What are you sending?" (the full manuscript, sample chapters, a synopsis or outline, a published backlist book); the file is required only for the first two, and the button reads "Send for Review" unless it's the full manuscript. The email subject says what came in, e.g. "Manuscript submission (sample chapters): …". The link works from the submit page itself too (the form follows the address, and the phone menu closes). Step 1 of the three steps reads "Send us your manuscript, or a few sample chapters, for review."
- **Secure-form signal (Dustin, 2026-11-24).** A 3D padlock (`src/components/SecureBadge.tsx`) heads the manuscript form with checks that are true of the build: an encrypted connection (HSTS in `next.config.ts`), files in a private store with no public link, and only signed-in members of the team can open them. The two file lines show only when uploads are on; otherwise the second check is "We never sell your information". On the dark bands, keyboard focus rings are white (the blue one disappeared into the background). A small padlock line sits by the submit buttons of both forms.
- **The big 80–85% (Dustin, 2026-11-24).** The large figure in the home page's Signature Advantage band now carries the label "Our authors earn 80% to 85% royalties".

## 11. Copy issues spotted (not fixed in the page files; copy is verbatim)

- Reviews H2: "Here's what some our authors have been saying..." (missing "of").
- "Send us your manuscript" in the 3-step block links to `#` (Home, About, Submission Guidelines).
- Home "Expert Sales Copy and Covers" re-uses the "High Royalty Payouts" icon.
- Response-time promises disagree: "within 48 hours" (thank-you) vs "2 to 4 business days" (submission guidelines) vs "2-4 business days" (contact).
- Genre lists disagree across the guidelines grid, the form dropdown, the FAQ answer and the authors tabs.
- Royalty figure written "80% to 85%", "80-85%" and "80–85%".
- Jillian David's testimonial exists in two versions (About: "Brian [publisher] and their team… and Years later"; elsewhere "Brian and the team… and years later").
- Form labels with "*" on fields that are not required (First Name, Phone, "solve a problem" on the manuscript form; Name on the contact form).
- Upload label lists 4 file types; the uploader accepts 16.
- `/authors/`: Jade Lee appears twice (Romance); the Ann Yost card (Mystery) links to Dallas Gorham's page, so Ann Yost's page is orphaned.
- SL Menear's author page links to `http://www.newsite.twinpeaksroofing.ca` (looks like a wrong website link; for the author migration).
- Privacy/terms text carries chat-tool paste artifacts (`data-start`/`data-end` attributes, email "link" without href).

## 12. Testimonials and FAQs

- `content/site/testimonials.json`: 6 unique testimonials (Alice Duncan, T.M. Simmons, Jillian David, Jo Goodman, David O. Stewart, Jeanne Glidewell). The Reviews page is the complete set; Home shows 4 of them, The Advantage and Submission Guidelines show 2 (Jillian David, Jeanne Glidewell), About shows Jillian David. The Reviews-page wording is used. Besides the RiseUP keys (`id`, `name`, `authorSlug`, `photo`, `quote`) each entry has `role` (the line under the name, e.g. "Author of The Lincoln Deception") and, where the card has one, `headline` (the pull-quote); drop them if the type must stay strict. Quotes are stored without the surrounding quotation marks and without italics.
- T.M. Simmons: shown with the photo `Trana_Mae_Simmons.png` (alt "Trana Mae Simmons Author"). The site has two author pages, `/authors/tm-simmons/` (cozy mystery, "T. M. Simmons lives in a haunted house…East Texas") and `/authors/trana-mae-simmons/` (romance/historical, "lives in East Texas…in a haunted house"); they read as two pen names of one author but the site never says so. `authorSlug` is set to `tm-simmons` to match the name on the card.
- Photos: `public/images/site/testimonials/<id>.jpg` (≤400 px, JPEG, 10–28 KB).
- `migration/pages/faqs.json`: 6 FAQs. The same 6 (one shared Thrive symbol, "FAQ Section" 4969) appear on `/frequently-asked-questions/`, `/` and `/submission-guidelines/`; text verified identical on all three. No other FAQs on the site. Two answers carry a link (`link.label` is the inline anchor text, which is also part of `a`).

## 13. Files written

- `migration/urls.csv`, `migration/seo-meta.csv` (73 rows each), `migration/redirects.csv` (172 rows), `migration/notes.md`, `migration/brand.md`
- `migration/pages/`: `home.md`, `about.md`, `the-advantage.md`, `submission-guidelines.md`, `submit-your-manuscript.md`, `frequently-asked-questions.md`, `reviews.md`, `contact.md`, `thank-you.md`, `blog.md`, `authors.md`, `faqs.json`
- `content/site/testimonials.json`, `content/pages/privacy-policy.md`
- `public/images/site/`: 15 logo/brand files (see brand.md), 8 section photos (`author-*.jpg`), 16 cover/mockup images (`cover-*.jpg`), `book-shadow.png`, `social-share.jpg`, and `testimonials/` (6 photos). Covers in the Home and Submit carousels are saved here as page images; the book migration may keep its own copies.
