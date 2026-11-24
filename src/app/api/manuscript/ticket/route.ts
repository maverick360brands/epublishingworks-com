import { isSameSite, issueTicket } from "@/lib/forms";

// Step 1 of a manuscript submission: a short-lived ticket, for the site's own pages only, that the
// file upload and the form submission both accept (see src/lib/forms.ts).
export async function POST(request: Request) {
  if (!isSameSite(request)) return Response.json({ error: "Please submit the form from our website." }, { status: 403 });
  return Response.json({ ticket: issueTicket() });
}
