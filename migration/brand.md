# ePublishingWorks brand (from the live WordPress site)

Sources: live CSS on epublishingworks.com (Thrive Theme Builder + Thrive Architect, `:root` variables in `<style id="tve_global_variables">`), the Thrive palette in postmeta (`thrv_lp_template_palettes_config_v2`, which gives the colour *names*), the logo files in the media library, and Google Fonts requests in page `<head>`s. Checked 2026-11-24.

The site runs one Thrive "skin". All blues are generated from one master colour, `--tcb-main-master-h/s/l = 213 / 86% / 33%` (= `#0C4D9D`). The palette in postmeta still carries the template's original yellow master (`hsl(52,100%,59%)`); it is overridden live, so the names below are Thrive's but the values are the live ones.

## Colour palette

### Core brand colours

| Name (Thrive palette) | CSS variable | Hex | Used for |
|---|---|---|---|
| Main Accent (brand blue) | `--tcb-skin-color-0` | `#0C4D9D` | Title banners on every inner page, the 4-card band and hero on Home, H2/H3 headings, nav "Submit Manuscript" pill text and its hover fill, link and icon hover colour. Matches the logo's dark blue `#0B4C9E`. Most-used colour on the site. |
| Headings 02 (sky blue) | `--tcb-skin-color-23` | `#4EB3E2` | Default H1, H4, H5 colour; button icons; divider on the privacy page. Matches the logo's light blue (the italic "Works!" and the book spines). |
| General Texts 02 | `--tcb-skin-color-24` | `#3B3B3B` | Body paragraphs, list items, blockquotes, in-text links. |
| Dark elements | `--tcb-skin-color-4` | `#1C252C` | Button text and 3px button border; button hover fill. |
| Light elements | `--tcb-skin-color-22` | `#FFFFFF` | Page and card backgrounds, text on dark sections, button fill. |
| Accent Light | `--tcb-skin-color-9` | `#EFF5FB` | Light blue section backgrounds ("Why choose", "Getting Started Is Simple", closing CTA band). Also used at 85% (`-19`, "Accent Light High Opacity", the 3-step roadmap sections) and 90% (`-20`, "Accent See Through"). |
| Dividers (amber) | `--tcb-skin-color-14` | `#FCB813` | Accent only: the icons on the dark blue 4-card band (as `rgb(252,184,19)`), the round icon badges in "Why choose ePublishing Works?", the active-tab icon on /authors/. |

### Supporting / transparent tints

| Name | Variable | Value | Used for |
|---|---|---|---|
| Accent Transparent Light | `--tcb-skin-color-29` | `#0964D3` at 40% | Blue overlay on background photos (FAQ block, The Advantage), hero word underline highlights, testimonial author titles. |
| Accent High Opacity | `--tcb-skin-color-18` | `#0B4D99` at 80% | Fill of the "Step 1 - Submit Your Manuscript »" button. |
| Accent Medium Opacity | `--tcb-skin-color-1` | `#0A4D9E` at 50% | Border of the nav "Submit Manuscript" pill. |
| Accent Low Opacity / 02 | `-8` / `-26` | `#0A4D9E` at 18% / `#095ECE` at 12% | Soft borders, shadows and hover tints. |
| Accent Dark Medium Opacity | `-13` | `#052348` at 50% | Shadows. |
| Neutral backgrounds | `-2` | `#F8F8F8` | Neutral panels. |
| General text | `-5` | `#636363` | Secondary text. |

### Fixed (non-palette) colours seen in the CSS

| Hex | Where |
|---|---|
| `#0C2F5A`, `#123054` | Navy stops of the Home hero gradient: `linear-gradient(122deg, #0C2F5A 12%, #0C4D9D 40%, #0C4D9D 63%, Main Accent 63%, #123054 86%)`. |
| `#0C1115` | Footer background (near-black). |
| `#AEAEAE` | Footer menu links. |
| `#1372D3` | Fill of the manuscript-form submit button (contact form button uses Main Accent `#0C4D9D`). |
| `#39A3D1` | Mobile menu open/close icons. |
| `#FFEEC4` (`--tcb-color-0`, cream) | "ePublishingWorks!" in the Home hero subline; text-highlight label behind "get started" / "THREE EASY STEPS TO". |
| `#F0C419` fill / `#FBB040` outline | 5-star rating graphics on testimonials. |
| `#D0D2D3` | Light grey page edges in the logo icon (from the logo files, not CSS). |
| `rgb(255,229,48)` | Only appears as the Thrive template's default fallback (`var(--x, rgb(255,229,48))`); it is never actually shown. Not a brand colour. |

`--tcb-skin-color-3/10/16/21/25/27/28` and `--tcb-color-1/2/3` are defined but unused on the core pages.

## Fonts

All from Google Fonts (requested with `fonts.googleapis.com/css?family=...&display=swap`), nothing self-hosted.

| Family | Weights requested | Where used |
|---|---|---|
| **Manrope** | 200, 300, 400, 700, 800 | Everything: H1–H6, body text, buttons. Theme sets regular = 400, bold = 800. Default sizes (desktop): H1 50px, H2 40px, H3 30px, H4 24px, H5 20px, body 16px with line-height 1.6; smaller-screen overrides take H1 to 36px then 28px, H2 to 28px then 24px, H3 to 22px, H4 to 20px. Weights: H1 and H4–H6 regular, H2/H3 bold (800). |
| **Lato** | 400, 700 | Header navigation links (12px, uppercase, 1px letter-spacing; the "Submit Manuscript" pill is bold). |
| **Muli** (now "Mulish" on Google Fonts) | 200–900 + italics | Dropdown sub-menu items in the header. |
| **DM Sans** | 300, 400, 500, 700, 800 | Labels, radio and checkbox options in the manuscript submission form only. |
| Literata | 400–700 + italics | Requested only on /blog/ by the theme's blog template; not visibly used. |
| Palatino Linotype / Book Antiqua (system serif stack) | regular | Testimonial author titles ("Bestselling Author", "Author") on Home and Reviews, 23px. |

The logo wordmark is artwork (PNG); its typeface is a geometric sans in extra-bold with an italic "Works!" (it looks like Manrope ExtraBold, unconfirmed).

## Buttons and links

- **Primary button** (Thrive button template `btn-tpl-58410`, used for every in-content CTA): white fill, 3px solid `#1C252C` border, 14px corner radius, Manrope 800, 18px, 1px letter-spacing, sentence/title case (no uppercase), padding about 14px 24px 14px 17px, with a leading icon in sky blue `#4EB3E2` (book-stack icon "library_books" on most; "layers" on "Start Your Publishing Journey"; a star on "Read More Author Reviews"). Hover: "shutter out vertical" animation that fills the button `#1C252C` with white text; the icon turns Main Accent.
- **Solid variant**: "Step 1 - Submit Your Manuscript »" on /the-advantage/ has an 80% Main Accent fill.
- **Nav CTA pill** ("Submit Manuscript" / "Publish Your Book"): Lato 12px uppercase bold, 1px letter-spacing, 2px border in 50% Main Accent, 10px radius (one of the two header states uses 3px), text Main Accent; hover fills Main Accent.
- **Form submit buttons**: solid fill (`#1372D3` on the manuscript form "Submit Manuscript", `#0C4D9D` on the contact form "Contact Us"), with icon.
- **Text links**: in-copy links take the text colour `#3B3B3B`; there are also "Learn about it here »" style arrow links.

## Logo files

All in `public/images/site/`. The current set (uploaded 2025-02-12) reads **ePublishingWorks!** with an italic "Works!"; the earlier set (2024-11-19) reads **ePublishingWorks** with no "!" and upright "Works". The icon is a stack of two blue books (dark blue covers `#0B4C9E`, sky-blue spines `#4EB3E2`, light grey pages `#D0D2D3`).

| File | Size (px) | Source on WordPress | Use |
|---|---|---|---|
| `logo-primary.png` | 1200 × 194 | `LOGO-EPW_primary-2000px.png` (2000 × 323) | **Primary logo**, colour on light backgrounds. Header logo and Yoast Organization logo. |
| `logo-primary-reversed.png` | 1200 × 194 | `LOGO-EPW_primary-reversed-2000px.png` (2000 × 324) | **Reversed (white)** for dark backgrounds. Footer logo. |
| `logo-primary-black.png` | 1200 × 194 | `LOGO-EPW_primary-black-2000px.png` (2000 × 324) | One-colour black version (not used on the site). |
| `logo-icon.png` | 1200 × 1200 | `epublishingworks_EPW_icon.png` (2000 × 2000) | **Icon** (book stack), colour, largest available. Same artwork as `logo-icon-500.png`. |
| `logo-icon-500.png` | 500 × 500 | `LOGO-EPW_icon-sm.png` | Icon, colour (2025 set). |
| `logo-icon-black.png` | 500 × 500 | `LOGO-EPW_icon-black-sm.png` | Icon, black. |
| `logo-icon-reversed.png` | 500 × 500 | `LOGO-EPW_icon-reversed-sm.png` | Icon, white/grey for dark backgrounds. |
| `site-icon-512.png` | 512 × 512 | `cropped-epublishingworks_EPW_icon.png` (WordPress Site Icon, attachment 4570) | Favicon / apple-touch-icon / RSS image on the live site. |
| `logo-2024-primary.png` | 1200 × 198 | `epublishingworks_EPW_primary.png` (2000 × 330) | Earlier logo without "!" (not used on the live pages). |
| `logo-2024-wordmark.png` | 1200 × 215 | `epublishingworks_EPW_wordmark.png` (2000 × 358) | Earlier wordmark only, no icon. |
| `logo-2024-primary-reversed.png` | 500 × 83 | `epublishingworks_EPW_primary-copy-reverse.png` | Earlier reversed logo (only 500px exists). |
| `logo-2024-wordmark-reversed.png` | 500 × 90 | `epublishingworks_EPW_wordmark-copy-reverse.png` | Earlier reversed wordmark (only 500px exists). |
| `logo-2024-icon-reversed.png` | 500 × 500 | `epublishingworks_EPW_icon-reverse.png` | Earlier reversed icon. |
| `logo-2024-icon.jpg` | 1200 × 1200 | `epublishingworks_EPW_icon.jpg` (1500 × 1500) | Icon on a solid background (JPEG). |
| `social-share.jpg` | 1200 × 675 | `epublishingworks-social-share-image.jpg` | Default Open Graph image (Yoast): blue background, logo, "Your path to publishing just got easier." and "Bigger Royalties / Better Visibility / Focus on Writing / Sell More Books". |

All PNG logos keep their transparency.

## Site name styling

| Styling | Where it appears |
|---|---|
| **ePublishingWorks!** (one word, "!") | Current logo; Yoast site/organization name in schema; Home `<title>` ("… \| ePublishingWorks!"); privacy policy and terms; Jo Goodman quote; Jeanne Glidewell quote as shown in the shared Testimonials block; testimonial headline on The Advantage / Submission Guidelines; About-page lead sentence (bold, with the name in italics: "*ePublishingWorks!* was born…"). |
| **ePublishing*Works!*** (italic "Works!", sometimes with a space before it: "ePublishing *Works!*") | The dominant in-copy form: Home hero subline (cream colour), About H1 and H2, The Advantage, Submission Guidelines, Submit page, Thank-you H3, Alice Duncan / T.M. Simmons / David O. Stewart quotes, Home "Signature Advantage" statement. The italic mirrors the logo. |
| **ePublishingWorks** (no "!") | WordPress site title (`blogname`) and so every default `<title>` suffix (" - ePublishingWorks") and every Yoast title ending "\| ePublishingWorks"; `og:site_name`; RSS feed title; Home body ("At ePublishingWorks, we handle…"); Alice Duncan headline; the 2024 logo set. |
| **ePublishing Works!** (two words, "!") | Home CTA "Join ePublishing Works!"; Jillian David quote; About ("At ePublishing Works!, your stories…"); form questions "What interests you most about ePublishing Works! as an author?" and "How did you hear about ePublishing Works! ?". |
| **ePublishing Works** (two words, no "!") | Footer Amazon Associates disclosure ("ePublishing Works is a participant…"); H3 "Why choose ePublishing Works?" (Home) and H2 "Why Choose ePublishing Works?" (Submission Guidelines); WordPress page title "The ePublishing Works Advantage". |
| **ePublishing *Works*!** (italic "Works", roman "!") | /authors/ H2 only. |
| **ePW** / **EPW** | T.M. Simmons quote ("With ePW…"); form field names ("Interest in EPW", "Hear about EPW"); Dropbox folder "EPW Manuscript Submissions"; logo file names. |

Tagline (WordPress site description): "The Partner for Career-Minded Authors". Hero line: "Write, Publish, Prosper".

## Overall look

- Photographic, not illustrated: licensed stock photos of smiling mature/diverse "authors" at laptops and notebooks (file names carry the stock "-utc" suffix), plus real book covers and 3D box-set mockups, and round author headshots on testimonials. Icons are line/solid icons from Thrive's icon packs (Font Awesome / Material duotone), inline SVG; none are images.
- Alternating light and dark sections: every inner page opens with a solid brand-blue title banner with a layered translucent wave divider at the bottom; content sections alternate white and very light blue (`#EFF5FB`); the Home hero is a dark navy-to-blue diagonal gradient; the closing CTA band is light blue with a dark blue diagonal block on the right; the footer is near-black.
- Clean, airy, rounded: 14px-radius outline buttons with icons, white rounded cards, circular photos, amber accent icons, gold star ratings. Small motion touches: hand-drawn wavy underline animation on hero words, button "shutter" hover, carousel and accordion animations.
- Header: white, sticky; it swaps to a second, slimmer state after 100px of scroll.
