import { describe, expect, it } from "vitest";
import { GATE_COOKIE, gatePage, gateToken, isUnlocked, safeNext } from "@/lib/site-gate";

describe("site gate", () => {
  it("unlocks only with the token for the current password", async () => {
    const token = await gateToken("letmein");
    expect(await isUnlocked(token, "letmein")).toBe(true);
    expect(await isUnlocked(token, "changed")).toBe(false);
    expect(await isUnlocked(undefined, "letmein")).toBe(false);
    expect(await isUnlocked("letmein", "letmein")).toBe(false); // the cookie never holds the password
  });

  it("is open when no password is set", async () => {
    expect(await isUnlocked(undefined, "")).toBe(true);
    expect(await isUnlocked(undefined, undefined)).toBe(true);
  });

  it("only returns to addresses on this site", () => {
    expect(safeNext("/provider/?a=1")).toBe("/provider/?a=1");
    expect(safeNext("//evil.example/")).toBe("/");
    expect(safeNext("https://evil.example/")).toBe("/");
    expect(safeNext("/\\evil.example")).toBe("/");
    expect(safeNext(null)).toBe("/");
  });

  it("renders a noindex form that posts the return address", () => {
    const html = gatePage({ next: '/a/?q="x"', wrong: true });
    expect(html).toContain('<meta name="robots" content="noindex"');
    expect(html).toContain('action="/api/site-gate/"');
    expect(html).toContain('value="/a/?q=&quot;x&quot;"');
    expect(html).toContain("That password isn");
    expect(GATE_COOKIE).toBe("epw_site_gate");
  });
});
