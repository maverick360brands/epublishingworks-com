/**
 * Per-IP limit on form submissions: 5 a minute; past that, the IP is held off for 10 minutes.
 * Counts live in this server instance's memory, so it slows bursts rather than being airtight;
 * a Vercel Firewall rate-limit rule on the form endpoints is the hard limit if one is ever needed.
 * (Same limiter as bluetowerroofs.com, copied, not shared.)
 */
const WINDOW_MS = 60_000;
const LIMIT = 5;
const BLOCK_MS = 10 * 60_000;
const hits = new Map<string, { start: number; count: number; blockedUntil: number }>();

/** true when this IP is over the limit (and records the hit). */
export function rateLimited(ip: string, now = Date.now()): boolean {
  if (hits.size > 5000) for (const [k, v] of hits) if (now - v.start > WINDOW_MS && now > v.blockedUntil) hits.delete(k);
  const h = hits.get(ip);
  if (h && now < h.blockedUntil) return true;
  if (!h || now - h.start > WINDOW_MS) {
    hits.set(ip, { start: now, count: 1, blockedUntil: 0 });
    return false;
  }
  h.count++;
  if (h.count > LIMIT) {
    h.blockedUntil = now + BLOCK_MS;
    return true;
  }
  return false;
}
