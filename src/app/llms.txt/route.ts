// /llms.txt: a plain-language map of the site for AI assistants (https://llmstxt.org).
import { bookAuthorLabel, booksByAuthor, directoryAuthors, getCatalog, publishedPosts, visibleBooks } from "@/lib/content";
import { faqs, site } from "@/lib/site";

export async function GET() {
  const c = await getCatalog();
  const posts = publishedPosts(c, false);
  const books = visibleBooks(c);
  const authors = directoryAuthors(c);
  const series = new Map<string, { author: string; count: number }>();
  for (const b of books) if (b.series) series.set(b.series, { author: bookAuthorLabel(c, b), count: (series.get(b.series)?.count ?? 0) + 1 });
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `${site.about} It primarily publishes crime fiction, mystery, cozy mystery, and historical romance, and considers other genres (not erotica). It accepts backlist titles whose rights have reverted, and first books from new authors with a plan for a series. Submissions get a reply with next steps within 2 to 4 business days. Phone: ${site.phone}. Email: ${site.email}.`,
    "",
    "## Key pages",
    `- [Home](${site.url}/): what ePublishingWorks does for authors`,
    `- [Our Signature Advantage](${site.url}/the-advantage/): 80% to 85% royalties, covers, sales copy, distribution, Kindle Unlimited without exclusivity, preorders, and marketing`,
    `- [Submission Guidelines](${site.url}/submission-guidelines/): who and what we're looking for`,
    `- [Submit Your Manuscript](${site.url}/submit-your-manuscript/): the submission form`,
    `- [Frequently Asked Questions](${site.url}/frequently-asked-questions/)`,
    `- [Books](${site.url}/books/): all ${books.length} books, by genre`,
    `- [Authors](${site.url}/authors/): all ${authors.length} authors`,
    `- [Author reviews](${site.url}/reviews/)`,
    `- [About](${site.url}/about/): history since 2011`,
    `- [Blog](${site.url}/blog/): advice for authors, guides for readers`,
    `- [Contact](${site.url}/contact/)`,
    "",
    "## Frequently asked questions",
    ...faqs.map((f) => `- **${f.q}** ${f.a.replace(/\n\n+/g, " ")}`),
    ...(posts.length ? ["", "## Articles", ...posts.map((p) => `- [${p.title}](${site.url}/blog/${p.slug}/): ${p.description}`)] : []),
    "",
    "## Series",
    ...[...series.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([name, s]) => `- ${name} by ${s.author} (${s.count} ${s.count === 1 ? "book" : "books"})`),
    "",
    "## Authors",
    ...authors.map((a) => `- [${a.name}](${site.url}${a.url})${a.role ? ` (${a.role})` : ""}: ${booksByAuthor(c, a.slug).length} books. ${a.summary}`),
    "",
    "## Books",
    ...books.map((b) => `- [${b.title}](${site.url}${b.url}) by ${bookAuthorLabel(c, b)}${b.series ? `, ${b.series}${b.seriesNumber !== null ? ` #${b.seriesNumber}` : ""}` : ""} (${b.genre})`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
