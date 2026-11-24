import { isEmail, isSameSite, isSpam, rowsToHtml, sendFormEmail } from "@/lib/forms";

// Replaces the Thrive "Quick Contact" form on /contact/: name, email, message.
export async function POST(request: Request) {
  const form = await request.formData();
  if (await isSpam(form, request)) return Response.json({ ok: true }); // dropped quietly
  if (!isSameSite(request)) return Response.json({ error: "Please send your message from our website." }, { status: 403 });
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
