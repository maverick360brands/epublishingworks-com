import { getCatalog } from "@/lib/content";

// An old WordPress cover or author-photo address, rewritten here by the proxy (src/lib/legacy-images.ts):
// one 301 to that book's or author's current image, the same one its page shows, so a cover replaced
// in the admin is followed. Hidden or unknown items are a 404.
export async function GET(request: Request, { params }: { params: Promise<{ kind: string; slug: string }> }) {
  const { kind, slug } = await params;
  const c = await getCatalog();
  // Matched on the address, which is the same from the CMS and the seed files (/authors/sl_menear/).
  const book = kind === "book" ? c.books.find((b) => b.url === `/${slug}/`) : undefined;
  const author = kind === "author" ? c.authors.find((a) => a.url === `/authors/${slug}/`) : undefined;
  const src = book && !book.hidden ? book.cover : author && !author.hidden ? author.photo : "";
  if (!src) return new Response("Not found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
  return new Response(null, { status: 301, headers: { location: new URL(src, request.url).toString(), "cache-control": "public, max-age=86400" } });
}
