import { getCatalog, publishedPosts } from "@/lib/content";
import { site } from "@/lib/site";

const esc = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);

export async function GET() {
  const items = publishedPosts(await getCatalog(), false)
    .map(
      (p) => `<item><title>${esc(p.title)}</title><link>${site.url}/blog/${p.slug}</link><guid>${site.url}/blog/${p.slug}</guid>${
        p.date ? `<pubDate>${new Date(p.date).toUTCString()}</pubDate>` : ""
      }<description>${esc(p.description)}</description><category>${esc(p.category)}</category></item>`,
    )
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(site.name)} Blog</title><link>${site.url}/blog/</link><description>Advice for authors on publishing, royalties, rights, and marketing, plus reading guides.</description><language>en-us</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
