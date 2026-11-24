import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { verifyTicket } from "@/lib/forms";
import { MANUSCRIPT_MAX_BYTES, MANUSCRIPT_TYPES } from "@/lib/manuscript";

// Step 2: the browser uploads the manuscript straight to Vercel Blob (files up to 20 MB are too
// big for a serverless request), using a token this route issues to holders of a valid ticket.
// Files get a random suffix, so their addresses can't be guessed; they are linked only from
// the notification email.

export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return Response.json({ error: "File upload is not available right now." }, { status: 503 });
  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!verifyTicket(clientPayload)) throw new Error("Your session expired. Please submit the form again.");
        if (!pathname.startsWith("manuscripts/")) throw new Error("Unexpected upload path.");
        return { allowedContentTypes: MANUSCRIPT_TYPES, maximumSizeInBytes: MANUSCRIPT_MAX_BYTES, addRandomSuffix: true };
      },
    });
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
