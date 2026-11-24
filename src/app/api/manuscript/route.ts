import { isEmail, isSameSite, isSpam, rowsToHtml, sendFormEmail, verifyTicket } from "@/lib/forms";

// Step 3: the manuscript submission itself. Replaces the Thrive form on /submit-your-manuscript/
// with the same fields. Emails the publishing team, with a link to the uploaded file.
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
  const form = await request.formData();
  if (await isSpam(form, request)) return Response.json({ ok: true }); // dropped quietly
  if (!isSameSite(request) || !verifyTicket(String(form.get("ticket") ?? ""))) {
    return Response.json({ error: "Your session expired. Please submit the form again." }, { status: 400 });
  }
  const value = (f: Field) => form.getAll(f).map((v) => String(v).trim()).filter(Boolean).join(", ").slice(0, 5000);
  const data = Object.fromEntries((Object.keys(FIELDS) as Field[]).map((f) => [f, value(f)])) as Record<Field, string>;
  data.about = data.about.slice(0, 350);
  const missing = REQUIRED.filter((f) => !data[f]);
  if (missing.length || !isEmail(data.email)) {
    return Response.json({ error: `Please fill in: ${missing.map((f) => FIELDS[f].toLowerCase()).join(", ") || "a valid email address"}.` }, { status: 400 });
  }
  if (data.fileUrl && !/^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/manuscripts\//.test(data.fileUrl)) data.fileUrl = "";

  const result = await sendFormEmail({
    subject: `Manuscript submission: ${data.title} (${data.firstName} ${data.lastName})`,
    html: rowsToHtml((Object.keys(FIELDS) as Field[]).map((f) => [FIELDS[f], data[f]])),
    replyTo: data.email,
  });
  if (result === "failed") return Response.json({ error: "Your submission wasn't sent. Please try again in a few minutes." }, { status: 502 });
  return Response.json({ ok: true });
}
