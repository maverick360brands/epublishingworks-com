import { afterEach, describe, expect, it, vi } from "vitest";
import { botCheck, checkSpam, phoneProblem, ruleScore } from "@/lib/spam/spam";

afterEach(() => vi.unstubAllEnvs());

describe("botCheck", () => {
  it("drops a filled honeypot", () => {
    expect(botCheck({ website: "http://spam.example", name: "Ann" })?.kind).toBe("bot");
  });
  it("drops a form sent faster than a person can fill it in", () => {
    expect(botCheck({ name: "Ann Yost", _t: "800" })?.reasons[0]).toMatch(/ms after the form appeared/);
  });
  it("lets the automated form tests through off production", () => {
    expect(botCheck({ firstName: "TEST – reviewer", _t: "300" })).toBeNull();
    vi.stubEnv("VERCEL_ENV", "production");
    expect(botCheck({ firstName: "TEST – reviewer", _t: "300" })?.kind).toBe("bot");
  });
  it("accepts international phone numbers and rejects junk", () => {
    expect(phoneProblem("+44 20 7946 0958")).toBe("");
    expect(phoneProblem("(717) 555-0100")).toBe("");
    expect(phoneProblem("12345")).not.toBe("");
    expect(phoneProblem("call me")).not.toBe("");
    expect(botCheck({ firstName: "Ann", phone: "123", _t: "60000" })?.kind).toBe("bot");
  });
  it("drops digits in a name and random-string messages", () => {
    expect(botCheck({ firstName: "John4821", _t: "60000" })?.kind).toBe("bot");
    expect(botCheck({ name: "Ann", message: "MEJTYJY829014MAMYJRTH", _t: "60000" })?.kind).toBe("bot");
  });
  it("lets a real author through", () => {
    expect(botCheck({ firstName: "Inés", lastName: "Saint", penName: "", phone: "+34 612 345 678", _t: "95000" })).toBeNull();
  });
});

describe("ruleScore and checkSpam (rules only)", () => {
  it("passes an author's pitch for their own backlist", async () => {
    const about = "My historical romance series (6 books) was published by Kensington; the rights reverted last year and I'd like to republish the backlist.";
    expect(ruleScore({ about }).score).toBeLessThan(0);
    expect((await checkSpam("manuscript", { about, problem: "My old publisher closed." })).kind).toBe("ok");
  });
  it("passes an author who mentions wanting more reviews", async () => {
    expect((await checkSpam("contact", { message: "My cozy mystery series needs more reviews. Could you help me publish book 4?" })).kind).toBe("ok");
  });
  it("flags an SEO pitch", async () => {
    const message = "Hi, I came across your website. Our marketing agency does SEO and link building to get you on the first page of Google. Book a quick call?";
    expect((await checkSpam("contact", { message })).kind).toBe("spam");
  });
  it("flags a funding pitch", async () => {
    expect((await checkSpam("contact", { message: "Get working capital today with a merchant cash advance for your business." })).kind).toBe("spam");
  });
  it("never scores names or emails", () => {
    expect(ruleScore({ name: "Seo Casino", email: "seo.kim@example.com", message: "" } as Record<string, string>).score).toBe(0);
  });
  it("can be turned off", async () => {
    vi.stubEnv("SPAM_FILTER", "off");
    expect((await checkSpam("contact", { message: "SEO services, first page of Google, casino" })).kind).toBe("ok");
  });
});
