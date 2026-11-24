// Cover illustrations for the posts (Dustin, 2026-11-24: one consistent, personal style for every
// post). Cut-paper collage in the brand's navy, logo blue, sky and gold on cream, made in Sume;
// how to make one for a new post: docs/blog-covers.md. A cover uploaded in the admin always wins;
// these fill in when a post has none. `focus` (a CSS object-position) keeps each scene's objects in
// frame when a layout crops tighter: the post hero is square on wide screens, and the subject sits
// right of center. Set per picture; check the square crop when adding one.

export type PostIllustration = { url: string; width: number; height: number; alt: string; share: string; focus: string };

const art = (slug: string, alt: string, x: number): PostIllustration => ({
  url: `/images/blog/${slug}.webp`,
  width: 2048,
  height: 1152,
  alt,
  share: `/images/blog/${slug}-share.jpg`,
  focus: `${x}% 50%`,
});

export const POST_ILLUSTRATIONS: Record<string, PostIllustration> = {
  "book-royalties-explained": art(
    "book-royalties-explained",
    "Cut-paper illustration of an open book beside a stack of gold coins, with a balance scale above",
    66,
  ),
  "ebook-vs-paperback-vs-audiobook": art(
    "ebook-vs-paperback-vs-audiobook",
    "Cut-paper illustration of a paperback, an e-reader and headphones side by side on a desk",
    82,
  ),
  "how-to-read-a-book-series-in-order": art(
    "how-to-read-a-book-series-in-order",
    "Cut-paper illustration of a row of matching books rising in height on a shelf, beside a cup of tea and a lamp",
    58,
  ),
  "how-to-republish-your-backlist": art(
    "how-to-republish-your-backlist",
    "Cut-paper illustration of a stack of books with new leaves growing from the open top book, and a gold key",
    92,
  ),
  "how-to-submit-a-manuscript-to-a-publisher": art(
    "how-to-submit-a-manuscript-to-a-publisher",
    "Cut-paper illustration of a manuscript tied with string beside an envelope and a fountain pen",
    74,
  ),
  "how-to-write-a-book-description": art(
    "how-to-write-a-book-description",
    "Cut-paper illustration of a book standing with its back cover out, a magnifying glass, a pen and index cards",
    76,
  ),
};

/** A post's illustration in the shape of `Post["cover"]`, or null. */
export function illustrationCover(slug: string) {
  const a = POST_ILLUSTRATIONS[slug];
  return a ? { url: a.url, width: a.width, height: a.height, alt: a.alt, focus: a.focus } : null;
}
