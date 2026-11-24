// Compiles Markdown content in /content into a single JSON module the app imports.
// Runs automatically before `dev` and `build` (see package.json). Pages never read
// the filesystem at request time, which keeps every route fully static.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const root = process.cwd();
const contentDir = path.join(root, "content");
const outDir = path.join(root, "src", "generated");

marked.setOptions({ gfm: true });

const toHtml = (md) => marked.parse(md.trim());
const plain = (md) =>
  md
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[*_>#`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
const excerpt = (md, len = 155) => {
  const text = plain(md);
  if (text.length <= len) return text;
  const cut = text.slice(0, len);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "") + "…";
};

function readCollection(dir) {
  const full = path.join(contentDir, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(full, file), "utf8");
      const { data, content } = matter(raw);
      return { slug: file.replace(/\.mdx?$/, ""), data, body: content };
    });
}

const errors = [];

const authors = readCollection("authors")
  .map(({ slug, data, body }) => ({
    slug,
    name: data.name,
    role: data.role || "",
    photo: data.photo || "",
    photoWidth: data.photoWidth || 0,
    photoHeight: data.photoHeight || 0,
    website: data.website || "",
    // Public URL, kept identical to the WordPress site (e.g. "/authors/alice-duncan/").
    url: data.url || "",
    order: data.order ?? 50,
    bookSlugs: data.books || [],
    bioHtml: toHtml(body),
    // Blank: the site takes the start of the bio, as it does for CMS records (src/lib/richtext.ts).
    summary: data.summary || "",
  }))
  .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

const books = readCollection("books")
  .map(({ slug, data, body }) => ({
    slug,
    title: data.title,
    subtitle: data.subtitle || "",
    authorSlugs: data.authors || [],
    byline: data.byline || "",
    isbn: String(data.isbn || ""),
    category: data.category || "fiction",
    genre: data.genre || "",
    formats: data.formats || [],
    language: data.language || "en",
    series: data.series || "",
    seriesNumber: data.seriesNumber ?? null,
    cover: data.cover || "",
    coverWidth: data.coverWidth || 0,
    coverHeight: data.coverHeight || 0,
    // Standalone root URL, title then author (e.g. "/spirits-adopted-alice-duncan/").
    url: data.url || "",
    featured: Boolean(data.featured),
    retailers: data.retailers || [],
    descriptionHtml: toHtml(body),
    summary: data.summary || "",
    seoDescription: data.seoDescription || "",
  }))
  .sort((a, b) => a.title.localeCompare(b.title));

// Markdown with id'd headings and a table of contents from the H2s (anchor links for readers
// and answer engines). External links open in a new tab.
function withToc(body) {
  const toc = [];
  const renderer = new marked.Renderer();
  renderer.heading = ({ tokens, depth }) => {
    const text = tokens.map((t) => t.raw).join("");
    const id = text.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (depth === 2) toc.push({ id, text: text.replace(/[*_`]/g, "") });
    return `<h${depth} id="${id}">${marked.parseInline(text)}</h${depth}>`;
  };
  renderer.link = function ({ href, title, tokens }) {
    const text = this.parser.parseInline(tokens);
    const ext = /^https?:\/\//.test(href) && !href.includes("epublishingworks.com");
    return `<a href="${href}"${title ? ` title="${title}"` : ""}${ext ? ' target="_blank" rel="noopener"' : ""}>${text}</a>`;
  };
  return { html: marked.parse(body.trim(), { renderer }), toc };
}

const posts = readCollection("blog")
  .map(({ slug, data, body }) => {
    const words = plain(body).split(" ").length;
    const { html, toc } = withToc(body);
    return {
      slug,
      title: data.title,
      description: data.description || excerpt(body),
      date: data.date ? new Date(data.date).toISOString() : null,
      updated: data.updated ? new Date(data.updated).toISOString() : null,
      authorName: data.author || "ePublishingWorks",
      category: data.category || "Publishing",
      tags: data.tags || [],
      image: data.image || "",
      draft: Boolean(data.draft),
      faqs: data.faqs || [],
      summary: data.summary || "",
      readingMinutes: Math.max(1, Math.round(words / 230)),
      toc,
      html,
    };
  })
  .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

const pages = Object.fromEntries(
  readCollection("pages").map(({ slug, data, body }) => [
    slug,
    { slug, title: data.title, description: data.description || "", updated: data.updated || null, ...withToc(body) },
  ]),
);

// Referential integrity: every book author must exist, and vice versa.
const authorSlugs = new Set(authors.map((a) => a.slug));
const bookSlugs = new Set(books.map((b) => b.slug));
for (const b of books) for (const a of b.authorSlugs) if (!authorSlugs.has(a)) errors.push(`Book "${b.slug}" references unknown author "${a}"`);
for (const a of authors) for (const b of a.bookSlugs) if (!bookSlugs.has(b)) errors.push(`Author "${a.slug}" references unknown book "${b}"`);
for (const b of books) if (!b.cover) errors.push(`Book "${b.slug}" has no cover`);
const urlPattern = /^\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/;
// A few legacy author addresses use an underscore (/authors/sl_menear/); they stay as they were.
const authorUrlPattern = /^\/authors\/[a-z0-9]+(?:[-_][a-z0-9]+)*\/$/;
const GENRES = new Set(["Contemporary Romance", "Historical Romance", "Romantic Suspense", "Paranormal & Fantasy Romance", "Western", "Mystery", "Cozy Mystery", "Thriller & Suspense", "Historical Fiction", "Fantasy & Science Fiction", "Young Adult", "Children's", "Literary & Women's Fiction", "Nonfiction", "Memoir & Biography"]);
const RESERVED = new Set(["about", "admin", "authors", "blog", "books", "contact", "frequently-asked-questions", "privacy-policy", "reviews", "submission-guidelines", "submit-your-manuscript", "thank-you", "the-advantage", "api"]);
for (const b of books) if (!GENRES.has(b.genre)) errors.push(`Book "${b.slug}" has an unknown genre "${b.genre}"`);
for (const b of books) if (!b.url) errors.push(`Book "${b.slug}" needs a url like "/title-author/"`);
for (const b of books) if (RESERVED.has(b.url.replaceAll("/", ""))) errors.push(`Book "${b.slug}" url ${b.url} is one of the site's own pages`);
for (const a of authors) if (!authorUrlPattern.test(a.url)) errors.push(`Author "${a.slug}" needs a url like "/authors/name/" (got "${a.url}")`);
for (const b of books) if (b.url && !urlPattern.test(b.url)) errors.push(`Book "${b.slug}" url must look like "/title-author/" (got "${b.url}")`);
const seen = new Map();
for (const item of [...authors, ...books].filter((x) => x.url)) {
  if (seen.has(item.url)) errors.push(`URL ${item.url} is used by both "${seen.get(item.url)}" and "${item.slug}"`);
  seen.set(item.url, item.slug);
}

if (errors.length) {
  console.error("Content errors:\n  " + errors.join("\n  "));
  process.exit(1);
}

// WordPress shortlinks (/?p=ID, /?page_id=ID) from the redirect map, for the proxy. Their
// from/to columns never contain commas or quotes, so a plain split is enough here.
const shortlinks = {};
const redirectsCsv = path.join(root, "migration", "redirects.csv");
if (fs.existsSync(redirectsCsv)) {
  for (const line of fs.readFileSync(redirectsCsv, "utf8").split(/\r?\n/).slice(1)) {
    const m = /^\/\?(p|page_id)=(\d+),([^,]+),/.exec(line);
    if (m) shortlinks[`${m[1]}=${m[2]}`] = m[3];
  }
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "shortlinks.json"), JSON.stringify(shortlinks));
fs.writeFileSync(path.join(outDir, "content.json"), JSON.stringify({ authors, books, posts, pages, buildYear: new Date().getFullYear() }, null, 0));
console.log(`content: ${authors.length} authors, ${books.length} books, ${posts.length} posts, ${Object.keys(pages).length} pages, ${Object.keys(shortlinks).length} shortlinks`);
