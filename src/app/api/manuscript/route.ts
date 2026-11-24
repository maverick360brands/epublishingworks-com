import { deliverSpam, formObject, isEmail, isSameSite, rowsToHtml, sendFormEmail, verifyTicket } from "@/lib/forms";
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
  fileName: "Manuscript file",
  fileUrl: "Manuscript link",
} as const;
type Field = keyof typeof FIELDS;
const REQUIRED: Field[] = ["firstName", "lastName", "email", "phone", "genre", "title", "about", "edited", "problem", "interests", "heardFrom"];

export async function POST(request: Request) {
  if (!isSameSite(request)) return Response.json({ error: "Please submit the form from our website." }, { status: 403 });
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
  data.about = data.about.slice(0, 350);
  const missing = REQUIRED.filter((f) => !data[f]);
  if (missing.length || !isEmail(data.email)) {
    return Response.json({ error: `Please fill in: ${missing.map((f) => FIELDS[f].toLowerCase()).join(", ") || "a valid email address"}.` }, { status: 400 });
  }
  if (data.fileUrl && !/^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/manuscripts\//.test(data.fileUrl)) data.fileUrl = "";
  // The manuscript file is required, as on the Thrive form, whenever uploads are switched on.
  if (process.env.BLOB_READ_WRITE_TOKEN && !data.fileUrl && !isFormTest(data)) {
    return Response.json({ error: "Please upload your manuscript (.pdf, .doc, .docx, or .zip)." }, { status: 400 });
  }

  const rows = (Object.keys(FIELDS) as Field[]).map((f): [string, string] => [FIELDS[f], data[f]]);
  const subject = `Manuscript submission: ${data.title} (${data.firstName} ${data.lastName})`;
  const verdict = await checkSpam("manuscript", data);
  if (verdict.kind !== "ok") {
    await deliverSpam("manuscript", subject, rows, verdict.reasons);
    return Response.json({ ok: true });
  }
  const result = await sendFormEmail({ subject, html: rowsToHtml(rows), replyTo: data.email });
  if (result === "failed") return Response.json({ error: "Your submission wasn't sent. Please try again in a few minutes." }, { status: 502 });
  return Response.json({ ok: true });
}
