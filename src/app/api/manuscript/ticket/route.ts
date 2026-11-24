import { clientIp, isSameSite, issueTicket } from "@/lib/forms";
import { rateLimited } from "@/lib/spam/rateLimit";
import { botCheck } from "@/lib/spam/spam";

// Step 1 of a manuscript submission: a short-lived ticket, for the site's own pages only, that the
// file upload and the form submission both accept (see src/lib/forms.ts). The rate limit and the
// bot traps run here too, so a bot can't collect upload tokens.
export async function POST(request: Request) {
  if (!isSameSite(request)) return Response.json({ error: "Please submit the form from our website." }, { status: 403 });
  if (rateLimited(clientIp(request))) return Response.json({ error: "Too many submissions. Please wait a few minutes and try again." }, { status: 429 });
  const raw = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const bot = botCheck(raw);
  if (bot) {
    console.info(`[manuscript] bot refused a ticket (${bot.reasons.join("; ")})`);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 400 });
  }
  return Response.json({ ticket: issueTicket() });
}
