import { connection } from "next/server";

// The IndexNow key file (https://www.indexnow.org/documentation). Search engines fetch it to
// confirm that pings about this site come from its owner. Read per request, so the key comes
// from the running environment rather than the build.
export async function GET() {
  await connection();
  const key = process.env.INDEXNOW_KEY;
  if (!key) return new Response("Not found", { status: 404 });
  return new Response(key, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
