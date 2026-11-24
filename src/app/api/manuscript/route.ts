import { clientIp, deliverSpam, formObject, isEmail, isSameSite, rowsToHtml, sendFormEmail, verifyTicket } from "@/lib/forms";
import { rateLimited } from "@/lib/spam/rateLimit";
import { head } from "@vercel/blob";
import { NEEDS_FILE, SENDING } from "@/lib/manuscript";
import { manuscriptLink, manuscriptPath, manuscriptToken, manuscriptUploadsEnabled } from "@/lib/manuscript-store";
import { botCheck, checkSpam, isFormTest } from "@/lib/spam/spam";

// Step 3: the manuscript submission itself. Replaces the Thrive form on /submit-your-manuscript/
// with the same fields. Emails the publishing team, with a link to the uploaded file. Spam
// (src/lib/spam/): bot traps get a quiet "ok"; flagged submissions never reach the team.
export const maxDuration = 30; // the spam check and the email each time out at 8 s
const FIELDS = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  phone: "Phone",
  penName: "Author pen name",
  genre: "Genre",
  title: "Book title",
  about: "What the book or series is about",
  edited: "Already edited?",
  editedBy: "Edited by",
  problem: "Problem to solve with a new publisher",
  interests: "Most interested in",
  heardFrom: "Heard about us from",
  sending: "What you're sending",
  fileName: "Manuscript file",
  fileUrl: "Manuscript link (sign in to the admin to open it)",
} as const;
type Field = keyof typeof FIELDS;
// Added to the email subject; the full manuscript needs no note.
const SUBJECT_KIND: Record<string, string> = { "Sample chapters": "sample chapters", "A synopsis or outline": "synopsis or outline", "A published (backlist) book": "backlist book" };
const REQUIRED: Field[] = ["firstName", "lastName", "email", "phone", "genre", "title", "about", "edited", "problem", "interests", "heardFrom", "sending"];

export async function POST(request: Request) {
  if (!isSameSite(request)) return Response.json({ error: "Please submit the form from our website." }, { status: 403 });
  // A ticket is valid for 30 minutes, so the submission has its own per-IP limit (5 a minute).
  if (rateLimited(`manuscript:${clientIp(request)}`)) {
    return Response.json({ error: "Too many submissions. Please wait a few minutes and try again." }, { status: 429 });
  }
  const form = await request.formData();
  if (!verifyTicket(String(form.get("ticket") ?? ""))) {
    return Response.json({ error: "Your session expired. Please submit the form again." }, { status: 400 });
  }
  const bot = botCheck(formObject(form));
  if (bot) {
    console.info(`[manuscript] bot dropped (${bot.reasons.join("; ")})`);
    return Response.json({ ok: true });
  }
  const value = (f: Field) => form.getAll(f).map((v) => String(v).trim()).filter(Boolean).join(", ").slice(0, 5000);
  const data = Object.fromEntries((Object.keys(FIELDS) as Field[]).map((f) => [f, value(f)])) as Record<Field, string>;
  if (!(SENDING as readonly string[]).includes(data.sending)) data.sending = "";
  data.about = data.about.slice(0, 350);
  const missing = REQUIRED.filter((f) => !data[f]);
  if (missing.length || !isEmail(data.email)) {
    return Response.json({ error: `Please fill in: ${missing.map((f) => FIELDS[f].toLowerCase()).join(", ") || "a valid email address"}.` }, { status: 400 });
  }
  // Only a file that is really in the private manuscripts store; the email links to the
  // editor-only download route, never to the file itself.
  const path = manuscriptPath(data.fileUrl);
  const stored = path && manuscriptUploadsEnabled() ? await head(data.fileUrl, { token: manuscriptToken() }).then(() => true, () => false) : false;
  data.fileUrl = stored ? manuscriptLink(new URL(request.url).origin, path) : "";
  if (!stored) data.fileName = "";
  // A full manuscript or sample chapters come as a file whenever uploads are switched on; a synopsis,
  // an outline, or a published book may be described in the form instead.
  if (manuscriptUploadsEnabled() && NEEDS_FILE.has(data.sending) && !data.fileUrl && !isFormTest(data)) {
    return Response.json({ error: `Please upload your ${data.sending === "Sample chapters" ? "sample chapters" : "manuscript"} (.pdf, .doc, .docx, or .zip).` }, { status: 400 });
  }

  const rows = (Object.keys(FIELDS) as Field[]).map((f): [string, string] => [FIELDS[f], data[f]]);
  const kind = SUBJECT_KIND[data.sending] ? ` (${SUBJECT_KIND[data.sending]})` : "";
  const subject = `Manuscript submission${kind}: ${data.title} (${data.firstName} ${data.lastName})`;
  const verdict = await checkSpam("manuscript", data);
  if (verdict.kind !== "ok") {
    await deliverSpam("manuscript", subject, rows, verdict.reasons);
    return Response.json({ ok: true });
  }
  const result = await sendFormEmail({ subject, html: rowsToHtml(rows), replyTo: data.email });
  if (result === "failed") return Response.json({ error: "Your submission wasn't sent. Please try again in a few minutes." }, { status: 502 });
  return Response.json({ ok: true });
}
