
/**
 * Cloudflare Turnstile (spam protection on every form). Keys come from Vercel env:
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY  widget key (public)
 *   TURNSTILE_SECRET_KEY            server key
 * Off production, unset keys fall back to Cloudflare's always-pass test keys so staging,
 * previews and the form tests work without real keys. Production with no secret fails closed.
 * https://developers.cloudflare.com/turnstile/troubleshooting/testing/
 */
const TEST_SITE_KEY = "1x00000000000000000000AA";
const TEST_SECRET_KEY = "1x0000000000000000000000000000000AA";

const isProduction = () => process.env.VERCEL_ENV === "production";

export const turnstileSiteKey = () => process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || (isProduction() ? "" : TEST_SITE_KEY);

/** True when Cloudflare accepts the token from the form's `cf-turnstile-response` field. */
export async function verifyTurnstile(token: string, ip?: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY || (isProduction() ? "" : TEST_SECRET_KEY);
  if (!secret) {
    console.error("[turnstile] TURNSTILE_SECRET_KEY unset on production; rejecting");
    return false;
  }
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const j = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!j.success) console.warn("[turnstile] rejected", j["error-codes"]);
    return !!j.success;
  } catch (err) {
    console.error("[turnstile] verify failed", err);
    return false;
  }
}
