// /llms.txt: a plain-language map of the site for AI assistants (https://llmstxt.org).
import { bookAuthorLabel, directoryAuthors, getCatalog, publishedPosts, visibleBooks } from "@/lib/content";
import { faqs, site } from "@/lib/site";

export async function GET() {
  const c = await getCatalog();
  const posts = publishedPosts(c, false);
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `Rise UP Publications is a family-owned Christian publishing house led by ${site.founder}. It publishes Christ-centered fiction and nonfiction in paperback, eBook, and audiobook, with worldwide distribution through Amazon, Barnes & Noble, Apple Books, Google Play, Kobo, and others. Authors keep ownership of the rights to their books. Rise UP also turns recorded content (sermons, podcasts, YouTube videos) into professionally edited books, and offers paid 1:1 publishing coaching ($199 for one hour, $299 for two hours) with no obligation to publish. Phone: ${site.phone}.`,
    "",
    "## Key pages",
    `- [Publish your Christian book](${site.url}/): services, author paths, process, FAQ`,
    `- [Books](${site.url}/books/): recent releases from Rise UP authors`,
    `- [Contact](${site.url}/contact/): submit a manuscript inquiry or book a discovery call`,
    `- [1:1 publishing coaching](${site.url}/coaching/): 1- or 2-hour sessions with head publisher Brian Paules`,
    `- [About](${site.url}/about/): history and team`,
    `- [Author reviews](${site.url}/reviews/)`,
    `- [Blog](${site.url}/blog/): advice for Christian authors`,
    `- [Author newsletter](${site.url}/newsletter/): publishing advice by email`,
    "",
    "## Frequently asked questions",
    ...faqs.map((f) => `- **${f.q}** ${f.a}`),
    "",
    "## Books",
    ...visibleBooks(c).map((b) => `- [${b.title}${b.subtitle && b.seriesNumber === null ? `: ${b.subtitle}` : ""}](${site.url}${b.url}) by ${bookAuthorLabel(c, b)}: ${b.summary}`),
    "",
    "## Authors",
    ...directoryAuthors(c).map((a) => `- [${a.name}](${site.url}${a.url})${a.role ? ` (${a.role})` : ""}: ${a.summary}`),
    ...(posts.length
      ? ["", "## Articles", ...posts.map((p) => `- [${p.title}](${site.url}/blog/${p.slug}/): ${p.description}`)]
      : []),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
