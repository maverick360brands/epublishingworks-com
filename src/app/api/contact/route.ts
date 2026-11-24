import { clientIp, isEmail, rowsToHtml, sendFormEmail } from "@/lib/forms";
import { verifyTurnstile } from "@/lib/turnstile";

// Replaces the Thrive "Quick Contact" form on /contact/: name, email, message.
export async function POST(request: Request) {
  const form = await request.formData();
  if (String(form.get("website") ?? "")) return Response.json({ ok: true }); // honeypot
  if (!(await verifyTurnstile(String(form.get("cf-turnstile-response") ?? ""), clientIp(request)))) {
    return Response.json({ error: "Please complete the spam check and try again." }, { status: 400 });
  }
  const value = (k: string) => String(form.get(k) ?? "").trim().slice(0, 5000);
  const data = { name: value("name"), email: value("email"), message: value("message") };
  if (!data.name || !data.message || !isEmail(data.email)) {
    return Response.json({ error: "Please fill in your name, a valid email address, and a message." }, { status: 400 });
  }
  const result = await sendFormEmail({
    subject: `Website message from ${data.name}`,
    html: rowsToHtml([
      ["Name", data.name],
      ["Email", data.email],
      ["Message", data.message],
    ]),
    replyTo: data.email,
  });
  if (result === "failed") return Response.json({ error: "Your message wasn't sent. Please try again, or call us at 866-846-5123." }, { status: 502 });
  return Response.json({ ok: true });
}
