// Shared server-side helpers for the site's forms (manuscript submission and contact).
// Spam: the same-site check here, then the spam controller in src/lib/spam/ (rate limit, bot traps,
// pitch rules, optional Claude check), the one used on bluetowerroofs.com and the Orion site.
// Email goes out through Resend (https://resend.com) once RESEND_API_KEY and CONTACT_TO_EMAIL are
// set. Without them the submission is logged and still accepted, so staging and the form tests
// work before email is configured. Every subject sent off production is tagged [staging].
import { createHmac, timingSafeEqual } from "node:crypto";

export const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

/** The client's IP as Vercel reports it (for the rate limit). */
export const clientIp = (request: Request) => (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";

/** True when the request comes from one of this site's own pages (Origin, else Referer, matches Host). */
export function isSameSite(request: Request): boolean {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const from = request.headers.get("origin") ?? request.headers.get("referer");
  if (!host || !from) return false;
  try {
    return new URL(from).host === host;
  } catch {
    return false;
  }
}

/** Label/value rows as simple HTML paragraphs (values escaped, line breaks kept). */
export const rowsToHtml = (rows: [string, string][]) =>
  rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<p><strong>${escapeHtml(k)}:</strong><br>${escapeHtml(v).replace(/\n/g, "<br>")}</p>`)
    .join("");

export async function sendFormEmail({ subject, html, replyTo, to: toOverride }: { subject: string; html: string; replyTo?: string; to?: string }): Promise<"sent" | "logged" | "failed"> {
  const key = process.env.RESEND_API_KEY;
  const to = toOverride ?? process.env.CONTACT_TO_EMAIL;
  const tagged = process.env.VERCEL_ENV === "production" ? subject : `[staging] ${subject}`;
  if (!key || !to) {
    console.info(`[forms] email not configured (RESEND_API_KEY, CONTACT_TO_EMAIL); submission logged: ${tagged}`);
    return "logged";
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "ePublishingWorks Website <website@epublishingworks.com>",
      to: to.split(",").map((s) => s.trim()),
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject: tagged,
      html,
    }),
  });
  if (!res.ok) {
    console.error("[forms] Resend error", res.status, await res.text());
    return "failed";
  }
  return "sent";
}

// A submission ticket is a short-lived signed pass, issued only to the site's own pages, that both
// steps of a manuscript submission (the file upload, then the form) must present. It keeps the
// Blob upload route from handing out upload tokens to anyone who finds its address.
const TICKET_TTL_MS = 30 * 60_000;
// Signed with PAYLOAD_SECRET (required wherever the CMS runs). A files-mode preview has no CMS and
// no uploads, so it signs with a fixed key rather than refusing every submission.
const secret = () => process.env.PAYLOAD_SECRET || (process.env.CONTENT_SOURCE === "files" ? "files-preview-only" : "");
const sign = (payload: string) => createHmac("sha256", secret()).update(`submission:${payload}`).digest("base64url");

export function issueTicket(now = Date.now()) {
  const expires = String(now + TICKET_TTL_MS);
  return `${expires}.${sign(expires)}`;
}

export function verifyTicket(ticket: string | null | undefined, now = Date.now()): boolean {
  if (!ticket || !secret()) return false;
  const [expires, sig] = ticket.split(".");
  if (!expires || !sig || !/^\d+$/.test(expires) || Number(expires) < now) return false;
  const want = Buffer.from(sign(expires));
  const got = Buffer.from(sig);
  return want.length === got.length && timingSafeEqual(want, got);
}

/**
 * Delivers a submission the spam filter flagged: to SPAM_TO_EMAIL (marked, with the reasons) when
 * it's set, so a false positive is never lost; otherwise only the verdict is logged, never the
 * visitor's words.
 */
export async function deliverSpam(form: string, subject: string, rows: [string, string][], reasons: string[]) {
  const to = process.env.SPAM_TO_EMAIL;
  console.info(`[spam] ${form}: held as spam (${reasons.join("; ")})`);
  if (!to) return;
  await sendFormEmail({ to, subject: `[spam] ${subject}`, html: `<p><strong>Held as spam:</strong> ${escapeHtml(reasons.join("; "))}</p>${rowsToHtml(rows)}` });
}

/** FormData as a plain object for the bot traps (repeated fields joined). */
export const formObject = (form: FormData) => {
  const out: Record<string, string> = {};
  for (const key of new Set(form.keys())) out[key] = form.getAll(key).map(String).join(", ");
  return out;
};
