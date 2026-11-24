// Page-address rules. Book addresses live at the site root (/spirits-adopted-alice-duncan/),
// so they must not collide with the site's own pages. New addresses follow the WordPress
// pattern the site already uses: lowercase words joined by hyphens, title then author for
// books. A few legacy author addresses also use an underscore (/authors/sl_menear/); those
// stay valid so old links keep working.

export const RESERVED_ROOT_SEGMENTS: ReadonlySet<string> = new Set([
  "about",
  "admin",
  "authors",
  "blog",
  "books",
  "contact",
  "frequently-asked-questions",
  "privacy-policy",
  "reviews",
  "submission-guidelines",
  "submit-your-manuscript",
  "thank-you",
  "the-advantage",
  "api",
  "_next",
  "__not-found",
]);

const fold = (text: string) => text.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** "A Woman's Heart" → "a-womans-heart"; "Romeo & Juliet" → "romeo-and-juliet". */
export const suggestPostSlug = (title: string) =>
  fold(title)
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** A root or author address segment, suggested the same way as a post slug. */
export const suggestSegment = suggestPostSlug;

/** "Spirits Adopted" by "alice-duncan" → "spirits-adopted-alice-duncan". */
export const suggestBookSegment = (title: string, authorSlug?: string) =>
  [suggestPostSlug(title), authorSlug ? suggestPostSlug(authorSlug) : ""].filter(Boolean).join("-");

const SEGMENT = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;

/** True when the address can be used, otherwise the message to show in the admin. */
export function validateSegment(value: string): true | string {
  if (!value) return "Page address is required.";
  if (RESERVED_ROOT_SEGMENTS.has(value)) return "This address is used by another page on the site. Please choose a different one.";
  if (!SEGMENT.test(value)) return "Use lowercase letters, numbers, and hyphens only.";
  return true;
}
