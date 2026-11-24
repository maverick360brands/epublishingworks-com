import { clientIp, deliverSpam, formObject, isEmail, isSameSite, rowsToHtml, sendFormEmail } from "@/lib/forms";
import { rateLimited } from "@/lib/spam/rateLimit";
import { botCheck, checkSpam } from "@/lib/spam/spam";

// Replaces the Thrive "Quick Contact" form on /contact/: name, email, message.
// Spam (src/lib/spam/): rate limit and bot traps get a quiet "ok"; flagged messages never reach the team.
export const maxDuration = 30; // the spam check and the email each time out at 8 s

export async function POST(request: Request) {
  if (!isSameSite(request)) return Response.json({ error: "Please send your message from our website." }, { status: 403 });
  const form = await request.formData();
  const raw = formObject(form);
  if (rateLimited(clientIp(request))) {
    console.info("[contact] rate limited");
    return Response.json({ ok: true });
  }
  const bot = botCheck(raw);
  if (bot) {
    console.info(`[contact] bot dropped (${bot.reasons.join("; ")})`);
    return Response.json({ ok: true });
  }
  const value = (k: string) => (raw[k] ?? "").trim().slice(0, 5000);
  const data = { name: value("name"), email: value("email"), message: value("message") };
  if (!data.name || !data.message || !isEmail(data.email)) {
    return Response.json({ error: "Please fill in your name, a valid email address, and a message." }, { status: 400 });
  }
  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", data.email],
    ["Message", data.message],
  ];
  const subject = `Website message from ${data.name}`;
  const verdict = await checkSpam("contact", data);
  if (verdict.kind !== "ok") {
    await deliverSpam("contact", subject, rows, verdict.reasons);
    return Response.json({ ok: true });
  }
  const result = await sendFormEmail({ subject, html: rowsToHtml(rows), replyTo: data.email });
  if (result === "failed") return Response.json({ error: "Your message wasn't sent. Please try again, or call us at 866-846-5123." }, { status: 502 });
  return Response.json({ ok: true });
}
