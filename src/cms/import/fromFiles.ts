// One-time import of the Markdown content (content/authors, content/books, content/blog) into
// the CMS. Runs as a data migration during the build, so every new database fills itself.
// Idempotent: documents are matched by page address and updated instead of duplicated.
import fs from "node:fs";
import path from "node:path";
import { sql } from "@payloadcms/db-postgres";
import { convertMarkdownToLexical, editorConfigFactory } from "@payloadcms/richtext-lexical";
import matter from "gray-matter";
import type { Payload, PayloadRequest, RichTextField } from "payload";

type Front = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
export type ContentFile = { file: string; data: Front; body: string };

const segmentOf = (url: string) => url.split("/").filter(Boolean).pop() ?? "";

function readDir(dir: string): ContentFile[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
      return { file: f.replace(/\.md$/, ""), data, body: content.trim() };
    });
}

/**
 * Rewrites Markdown the Lexical importer can't parse into equivalent Markdown it can.
 * An italic quote ending in a bold reference ("*quote **~Ref***") becomes "*quote* **_~Ref_**":
 * the same words and emphasis, with the nesting the importer drops written out flat. Backslash
 * escapes the importer doesn't understand are resolved to the plain character.
 */
export function normalizeMarkdown(md: string): string {
  return (
    md
      .replace(/^\*([^*\n].*?) \*\*([^*\n]+)\*\*\*[ \t]*$/gm, "*$1* **_$2_**")
      // Escapes the editor's importer would keep as a literal backslash ("\[sled\]", "\~Kirkus").
      // None of these characters can start a link, heading, or strikethrough where they appear.
      .replace(/\\([[\]~#])/g, "$1")
  );
}

export function readContentFiles(root: string) {
  return { authors: readDir(path.join(root, "authors")), books: readDir(path.join(root, "books")), posts: readDir(path.join(root, "blog")) };
}

export function toAuthorData(f: ContentFile, photoId: number | null) {
  return {
    name: String(f.data.name),
    slug: segmentOf(String(f.data.url)),
    role: f.data.role || "",
    photo: photoId,
    website: f.data.website || "",
    order: Number(f.data.order ?? 50),
    hidden: false,
  };
}

export function toBookData(f: ContentFile, authorIds: number[], coverId: number) {
  return {
    title: String(f.data.title),
    subtitle: f.data.subtitle || "",
    authors: authorIds,
    slug: segmentOf(String(f.data.url)),
    cover: coverId,
    isbn: f.data.isbn ? String(f.data.isbn) : "",
    category: f.data.category || "fiction",
    genre: f.data.genre || "Contemporary Romance",
    language: f.data.language || "en",
    // An empty list means the site never stated the formats; keep it empty rather than guess.
    formats: Array.isArray(f.data.formats) ? f.data.formats : [],
    series: f.data.series || "",
    seriesNumber: f.data.seriesNumber ?? null,
    retailers: ((f.data.retailers || []) as { name: string; url: string }[]).map((r) => ({ name: r.name, url: r.url })),
    summary: f.data.summary || "",
    // The WordPress page's own search description (Yoast), where it had one.
    seo: { title: "", description: String(f.data.seoDescription || ""), image: null },
    heroFeatured: Boolean(f.data.featured),
    hidden: false,
  };
}

export function toPostData(f: ContentFile) {
  const iso = (d: unknown) => (d ? new Date(String(d)).toISOString() : null);
  return {
    title: String(f.data.title),
    slug: f.file,
    description: String(f.data.description || ""),
    summary: String(f.data.summary || ""),
    category: f.data.category || "Publishing",
    date: iso(f.data.date),
    updated: iso(f.data.updated),
    authorName: f.data.author || "ePublishingWorks",
    tags: f.data.tags || [],
    seo: { title: String(f.data.seoTitle || ""), description: "", image: null },
    faqs: ((f.data.faqs || []) as { q: string; a: string }[]).map((x) => ({ q: x.q, a: x.a })),
    _status: (f.data.draft ? "draft" : "published") as "draft" | "published",
  };
}

type Api = {
  find(a: object): Promise<{ docs: { id: number }[] }>;
  create(a: object): Promise<{ id: number }>;
  update(a: object): Promise<{ id: number }>;
};

/** Imports everything and returns the counts. Throws, listing mismatches, if anything is missing. */
export async function importContent(payload: Payload, req?: Partial<PayloadRequest>, root = process.cwd()) {
  const api = payload as unknown as Api;
  const publicDir = path.join(root, "public");
  const files = readContentFiles(path.join(root, "content"));
  const editorFor = (collection: "books" | "authors" | "posts", field: string) =>
    editorConfigFactory.fromField({ field: payload.collections[collection].config.flattenedFields.find((f) => f.name === field) as RichTextField });
  const toRichText = (editor: ReturnType<typeof editorFor>, markdown: string) =>
    markdown ? convertMarkdownToLexical({ editorConfig: editor, markdown: normalizeMarkdown(markdown) }) : null;
  const base = { req, overrideAccess: true, depth: 0 };
  const context = { skipRevalidate: true };

  // Payload keeps createdAt/updatedAt given on create but restamps updatedAt on every update,
  // so a re-run writes the intended times straight to the row.
  async function restamp(collection: "books" | "posts", id: number, stamps: { createdAt: string; updatedAt: string }) {
    const adapter = payload.db as unknown as { drizzle: { execute(q: unknown): Promise<unknown> }; sessions?: Record<string, { db: { execute(q: unknown): Promise<unknown> } }> };
    const tx = req?.transactionID ? adapter.sessions?.[String(await req.transactionID)]?.db : undefined;
    await (tx ?? adapter.drizzle).execute(
      sql`update ${sql.identifier(collection)} set created_at = ${stamps.createdAt}, updated_at = ${stamps.updatedAt} where id = ${id}`,
    );
  }

  async function upsert(collection: string, where: object, data: object, extra: object = {}, stamps?: { createdAt: string; updatedAt: string }) {
    const [existing] = (await api.find({ ...base, collection, where, limit: 1, draft: true })).docs;
    if (!existing) return api.create({ ...base, collection, data: { ...data, ...stamps }, context, ...extra });
    const doc = await api.update({ ...base, collection, id: existing.id, data, context, ...extra });
    if (stamps) await restamp(collection as "books" | "posts", existing.id, stamps);
    return doc;
  }

  async function media(publicPath: string, alt: string) {
    if (!publicPath) return null;
    const filePath = path.join(publicDir, publicPath);
    if (!fs.existsSync(filePath)) throw new Error(`Image not found: ${publicPath}`);
    const filename = path.basename(filePath);
    const [existing] = (await api.find({ ...base, collection: "media", where: { filename: { equals: filename } }, limit: 1 })).docs;
    if (existing) return existing.id;
    return (await api.create({ ...base, collection: "media", data: { alt }, filePath, context: { ...context, altDefault: alt } })).id;
  }

  const bioEditor = editorFor("authors", "bio");
  const descriptionEditor = editorFor("books", "description");
  const bodyEditor = editorFor("posts", "body");

  const authorIds = new Map<string, number>();
  for (const f of files.authors) {
    const photo = await media(f.data.photo || "", `Photo of ${f.data.name}`);
    const data = { ...toAuthorData(f, photo), bio: toRichText(bioEditor, f.body) };
    authorIds.set(f.file, (await upsert("authors", { slug: { equals: data.slug } }, data)).id);
  }

  // Featured books (the WordPress home carousel and book landing pages) are stamped newest first,
  // in their `featured: <rank>` order, so the home wall leads with the publisher's own picks.
  const rankOf = (f: ContentFile) => (typeof f.data.featured === "number" ? f.data.featured : 1000);
  const featured = files.books
    .filter((f) => f.data.featured)
    .sort((a, b) => rankOf(a) - rankOf(b))
    .map((f) => f.file);
  const now = Date.now();
  for (const [i, f] of files.books.entries()) {
    const ids = ((f.data.authors || []) as string[]).map((s) => authorIds.get(s)).filter((id): id is number => id !== undefined);
    const cover = await media(f.data.cover || "", `Cover of ${f.data.title}`);
    if (cover === null) throw new Error(`Book ${f.file} has no cover`);
    const rank = featured.indexOf(f.file);
    const stamp = new Date(now - (rank === -1 ? 3600_000 + i * 1000 : rank * 1000)).toISOString();
    const data = { ...toBookData(f, ids, cover), description: toRichText(descriptionEditor, f.body) };
    await upsert("books", { slug: { equals: data.slug } }, data, {}, { createdAt: stamp, updatedAt: stamp });
  }

  for (const f of files.posts) {
    const post = toPostData(f);
    // Date imported posts by their own dates, so "last modified" isn't the import time.
    const stamp = post.updated ?? post.date ?? undefined;
    const cover = await media(String(f.data.cover || ""), String(f.data.coverAlt || f.data.title));
    const data = { ...post, ...(cover ? { cover } : {}), body: toRichText(bodyEditor, f.body) };
    await upsert("posts", { slug: { equals: data.slug } }, data, { draft: data._status === "draft" }, stamp ? { createdAt: post.date ?? stamp, updatedAt: stamp } : undefined);
  }

  const count = async (collection: string) => (await payload.count({ collection: collection as "books", req, overrideAccess: true })).totalDocs;
  const result = { authors: await count("authors"), books: await count("books"), posts: await count("posts") };
  const problems: string[] = [];
  if (result.authors !== files.authors.length) problems.push(`authors: ${result.authors} in CMS, ${files.authors.length} files`);
  if (result.books !== files.books.length) problems.push(`books: ${result.books} in CMS, ${files.books.length} files`);
  if (result.posts !== files.posts.length) problems.push(`posts: ${result.posts} in CMS, ${files.posts.length} files`);
  const slugs = new Set(
    ((await api.find({ ...base, collection: "books", limit: 10_000, pagination: false })).docs as unknown as { slug: string }[]).map((b) => `/${b.slug}/`),
  );
  for (const f of files.books) if (!slugs.has(String(f.data.url))) problems.push(`book address missing: ${f.data.url}`);
  if (problems.length) throw new Error(`Content import mismatch:\n${problems.join("\n")}`);
  return result;
}
