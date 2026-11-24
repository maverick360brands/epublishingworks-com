# Blog cover illustrations

Every post gets a cover in one house style, chosen by Dustin (2026-11-24): a **cut-paper collage**
in the brand's colors on cream. Same style, palette and composition every time, with a subject
that fits the post.

## The prompt

Made in Sume (image model left on Auto), `aspect_ratio` 16:9, `quality` high, `resolution` 2K, about
$0.05 each. Replace only the subject line:

```
Editorial illustration in a layered cut-paper collage style, flat paper cutouts only.
Subject: <2–4 objects that say what the post is about, on a writer's desk or shelf>,
the scene placed right of center with calm space on the left.
Strictly limited to cut paper in deep navy (#0c2f5a), logo blue (#0b4c9e), light sky blue (#4eb3e2)
and warm gold (#fcb813) on a cream background; no other colors.
Soft shadows between the paper layers, visible paper fiber texture and slightly imperfect hand-cut
edges, tactile and personal. No words, no letters, no numbers, no logos, no people.
```

Regenerate a result that has any of these:

- text or faces
- colors outside the palette (green crept into one)
- a painted look instead of paper

Subjects used so far:

| Post | Subject |
|---|---|
| book-royalties-explained | open book, stack of gold coins, balance scale |
| ebook-vs-paperback-vs-audiobook | paperback, e-reader with a blank screen, headphones |
| how-to-read-a-book-series-in-order | matching books rising in height on a shelf, tea, lamp |
| how-to-republish-your-backlist | book stack, new leaves from the open top book, gold key |
| how-to-submit-a-manuscript-to-a-publisher | manuscript tied with string, envelope, fountain pen |
| how-to-write-a-book-description | book with its back cover out, magnifying glass, pen, index cards |

## Adding one

Either:

- **In the admin** (simplest): upload the image as the post's Cover. An uploaded cover always wins.
- **In the code**:
  1. Save a 1600×900 WebP (quality 80, under 300 KB) as `public/images/blog/<slug>.webp`.
  2. Save a 1200×630 JPEG as `public/images/blog/<slug>-share.jpg` (the link-preview image).
  3. Add the post to `src/lib/post-art.ts`, with alt text that describes the picture.

  `tests/unit/catalog-source.test.ts` checks the files exist.

A post with neither shows the category artwork (`src/components/PostArt.tsx`).
