// Cover illustrations for the posts (Dustin, 2026-11-24: one consistent, personal style for every
// post). Cut-paper collage in the brand's navy, logo blue, sky and gold on cream, made in Sume;
// how to make one for a new post: docs/blog-covers.md. A cover uploaded in the admin always wins;
// these fill in when a post has none. `focus` keeps the scene in frame when a layout crops tighter
// (the subject sits right of center, leaving calm space on the left).

export type PostIllustration = { url: string; width: number; height: number; alt: string; share: string; focus: string };

const art = (slug: string, alt: string): PostIllustration => ({
  url: `/images/blog/${slug}.webp`,
  width: 1600,
  height: 900,
  alt,
  share: `/images/blog/${slug}-share.jpg`,
  focus: "66% 50%",
});

export const POST_ILLUSTRATIONS: Record<string, PostIllustration> = {
  "book-royalties-explained": art(
    "book-royalties-explained",
    "Cut-paper illustration of an open book beside a stack of gold coins, with a balance scale above",
  ),
  "ebook-vs-paperback-vs-audiobook": art(
    "ebook-vs-paperback-vs-audiobook",
    "Cut-paper illustration of a paperback, an e-reader and headphones side by side on a desk",
  ),
  "how-to-read-a-book-series-in-order": art(
    "how-to-read-a-book-series-in-order",
    "Cut-paper illustration of a row of matching books rising in height on a shelf, beside a cup of tea and a lamp",
  ),
  "how-to-republish-your-backlist": art(
    "how-to-republish-your-backlist",
    "Cut-paper illustration of a stack of books with new leaves growing from the open top book, and a gold key",
  ),
  "how-to-submit-a-manuscript-to-a-publisher": art(
    "how-to-submit-a-manuscript-to-a-publisher",
    "Cut-paper illustration of a manuscript tied with string beside an envelope and a fountain pen",
  ),
  "how-to-write-a-book-description": art(
    "how-to-write-a-book-description",
    "Cut-paper illustration of a book standing with its back cover out, a magnifying glass, a pen and index cards",
  ),
};
