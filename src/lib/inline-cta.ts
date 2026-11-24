// The inline note in the middle of a blog post: one short, relevant next step, placed after
// the section where a reader is most likely to want it. `after` is the number of the post's
// Heading 2 sections it follows. Chosen by the post's category, so new posts get one too.

export type InlineCta = {
  after: number;
  heading: string;
  text: string;
  cta: { label: string; href: string };
  note: string;
};

const forAuthors: Omit<InlineCta, "after"> = {
  heading: "Have a manuscript, or a backlist with its rights back?",
  text: "Send it to us for review. We handle covers, sales copy, distribution, and promotion, so you can keep writing.",
  cta: { label: "Submit Your Manuscript", href: "/submit-your-manuscript/" },
  note: "80% to 85% royalties for our authors",
};

const byCategory: Record<string, Omit<InlineCta, "after">> = {
  "Royalties & Rights": {
    heading: "See what an author-first royalty looks like",
    text: "ePublishingWorks pays our authors 80% to 85% royalties, and we take care of the business of publishing so you can write the next book.",
    cta: { label: "Our Signature Advantage", href: "/the-advantage/" },
    note: "Backlist titles welcome once the rights have reverted",
  },
  "For Readers": {
    heading: "Looking for your next read?",
    text: "Browse every ePublishingWorks book by genre, author, or series, with links to your favorite store.",
    cta: { label: "Browse the Books", href: "/books/" },
    note: "Mystery, cozy mystery, historical romance, and more",
  },
};

/** The post's inline note, for its category, after its third section. */
export function inlineCtaFor(post: { slug: string; category: string }): InlineCta {
  return { after: 3, ...(byCategory[post.category] ?? forAuthors) };
}

/** Splits post HTML just before its (n+1)th Heading 2, so a note can sit after section n. */
export function splitAfterSection(html: string, n: number): [string, string] {
  let idx = -1;
  let from = 0;
  for (let i = 0; i <= n; i++) {
    idx = html.indexOf("<h2", from);
    if (idx === -1) return [html, ""];
    from = idx + 3;
  }
  return [html.slice(0, idx), html.slice(idx)];
}
