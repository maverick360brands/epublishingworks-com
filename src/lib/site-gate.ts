// A password in front of the whole site while it is in development. On when SITE_PASSWORD is
// set (Vercel production and preview until launch), off when it isn't (local, tests, launch).
// The proxy checks the cookie; /api/site-gate/ checks the password and sets it. The cookie holds
// a hash of the password, never the password, and changing the password signs everyone out.
// The admin keeps its own sign-in and is not behind this gate.

export const GATE_COOKIE = "rup_site_gate";
export const GATE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function gateToken(password: string): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`rup-site-gate:${password}`));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** True when there is no password, or the cookie matches the current one. */
export async function isUnlocked(cookie: string | undefined, password: string | undefined): Promise<boolean> {
  if (!password) return true;
  if (!cookie) return false;
  const expected = await gateToken(password);
  if (cookie.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= cookie.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

/** Where to go after unlocking: a path on this site, never another site. */
export function safeNext(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return "/";
  return next;
}

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function gatePage({ next, wrong = false }: { next: string; wrong?: boolean }): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Rise UP Publications</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;padding:16px;background:#0b2545;color:#0b2545;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
  main{width:100%;max-width:400px;text-align:center;background:#fff;border-radius:20px;padding:40px 28px;box-shadow:0 20px 50px rgba(0,0,0,.35)}
  img{width:160px;height:auto;margin-bottom:24px}
  h1{font-size:22px;font-weight:600;margin:0 0 8px}
  p{margin:0 0 24px;color:#4a5b73;font-size:15px;line-height:1.5}
  label{display:block;text-align:left;font-size:14px;font-weight:600;margin-bottom:6px}
  input{width:100%;padding:12px 14px;border-radius:10px;border:1px solid #8a9bb3;background:#fff;color:#0b2545;font-size:16px}
  input:focus{outline:3px solid #e8b04a;outline-offset:2px}
  button{width:100%;margin-top:14px;padding:12px;border:0;border-radius:999px;background:#0b4c9e;color:#fff;font-weight:700;font-size:16px;cursor:pointer}
  button:hover{background:#0b2545}
  button:focus-visible{outline:3px solid #e8b04a;outline-offset:2px}
  .error{color:#b42318;margin:12px 0 0;font-size:14px}
</style>
</head>
<body>
<main>
  <img src="/images/site/logo.png" alt="Rise UP Publications">
  <h1>This site is in development</h1>
  <p>Enter the password to preview it.</p>
  <form method="post" action="/api/site-gate/">
    <input type="hidden" name="next" value="${escape(next)}">
    <label for="password">Password</label>
    <input id="password" name="password" type="password" autocomplete="current-password" required autofocus>
    <button type="submit">View the site</button>
    ${wrong ? `<p class="error" role="alert">That password isn’t right. Try again.</p>` : ""}
  </form>
</main>
</body>
</html>`;
}

export function gateResponseInit(status: number): ResponseInit {
  return { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" } };
}
