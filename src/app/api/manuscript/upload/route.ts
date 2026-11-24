import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { verifyTicket } from "@/lib/forms";
import { MANUSCRIPT_MAX_BYTES, MANUSCRIPT_TYPES } from "@/lib/manuscript";
import { isManuscriptPath, manuscriptToken } from "@/lib/manuscript-store";

// Step 2: the browser uploads the manuscript straight to Vercel Blob (files up to 20 MB are too
// big for a serverless request), using a token this route issues to holders of a valid ticket.
// Files go to the private manuscripts store (src/lib/manuscript.ts): no public address, and only
// signed-in editors can open them, through /api/manuscript/file/.

export async function POST(request: Request) {
  const token = manuscriptToken();
  if (!token) return Response.json({ error: "File upload is not available right now." }, { status: 503 });
  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      token,
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!verifyTicket(clientPayload)) throw new Error("Your session expired. Please submit the form again.");
        // The same rule the download route applies: one file directly under manuscripts/.
        if (!isManuscriptPath(pathname)) throw new Error("Unexpected upload path.");
        return { allowedContentTypes: MANUSCRIPT_TYPES, maximumSizeInBytes: MANUSCRIPT_MAX_BYTES, addRandomSuffix: true };
      },
    });
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
