import { clientIp, issueTicket } from "@/lib/forms";
import { verifyTurnstile } from "@/lib/turnstile";

// Step 1 of a manuscript submission: checks Turnstile once and returns a short-lived ticket that
// the file upload and the form submission both accept (see src/lib/forms.ts).
export async function POST(request: Request) {
  const { token } = (await request.json().catch(() => ({}))) as { token?: string };
  if (!(await verifyTurnstile(String(token ?? ""), clientIp(request)))) {
    return Response.json({ error: "Please complete the spam check and try again." }, { status: 400 });
  }
  return Response.json({ ticket: issueTicket() });
}
