import config from "@payload-config";
import { get } from "@vercel/blob";
import { getPayload } from "payload";
import { isManuscriptPath, manuscriptToken } from "@/lib/manuscript";

// Opens a submitted manuscript from the private store: the link in the submission email. Only an
// editor signed in to the admin gets the file; anyone else is sent to the admin sign-in first.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.searchParams.get("path") ?? "";
  if (!isManuscriptPath(path)) return new Response("Not found", { status: 404 });

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user) {
    const back = `${url.pathname}${url.search}`;
    return Response.redirect(new URL(`/admin/login/?redirect=${encodeURIComponent(back)}`, url), 302);
  }

  const token = manuscriptToken();
  if (!token) return new Response("Manuscript storage isn't set up.", { status: 503 });
  const file = await get(path, { access: "private", token, useCache: false }).catch(() => null);
  if (!file || file.statusCode !== 200) return new Response("Not found", { status: 404 });

  const name = path.slice("manuscripts/".length);
  return new Response(file.stream, {
    headers: {
      "Content-Type": file.blob.contentType || "application/octet-stream",
      "Content-Length": String(file.blob.size),
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
