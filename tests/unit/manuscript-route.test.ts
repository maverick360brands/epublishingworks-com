import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// The submission route's rules with uploads on: what an author is sending is required and must be
// one of the four choices, and the file is required only for the full manuscript or sample chapters.
// head() is mocked: one stored file exists in the private store.

const STORED = "https://abc123.private.blob.vercel-storage.com/manuscripts/book-x1Y2.pdf";
vi.mock("@vercel/blob", () => ({
  head: vi.fn(async (url: string) => {
    if (url === STORED) return { url };
    throw new Error("not found");
  }),
}));

const ENV_KEYS = ["PAYLOAD_SECRET", "MANUSCRIPTS_READ_WRITE_TOKEN", "RESEND_API_KEY", "ANTHROPIC_API_KEY", "VERCEL_ENV", "SPAM_TO_EMAIL"] as const;
const saved: Partial<Record<(typeof ENV_KEYS)[number], string | undefined>> = {};
beforeAll(() => {
  for (const k of ENV_KEYS) saved[k] = process.env[k];
  process.env.PAYLOAD_SECRET = "test-secret";
  process.env.MANUSCRIPTS_READ_WRITE_TOKEN = "vercel_blob_rw_dummy";
  delete process.env.RESEND_API_KEY;
  delete process.env.ANTHROPIC_API_KEY;
  delete process.env.SPAM_TO_EMAIL;
});
afterAll(() => {
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

let ip = 0;
async function post(fields: Record<string, string>, env = "production") {
  process.env.VERCEL_ENV = env;
  const { POST } = await import("@/app/api/manuscript/route");
  const { issueTicket } = await import("@/lib/forms");
  const form = new FormData();
  const base: Record<string, string> = {
    ticket: issueTicket(),
    _t: "9000",
    website: "",
    firstName: "Jane",
    lastName: "Author",
    email: "jane@example.com",
    phone: "212-555-0187",
    genre: "Mystery",
    title: "A Quiet Grave",
    about: "A cozy mystery set in a small Maine town where a librarian finds a body in the stacks.",
    edited: "Yes, already edited.",
    problem: "My old publisher closed and I want my backlist back in print.",
    interests: "Higher Royalties",
    heardFrom: "Referral",
  };
  for (const [k, v] of Object.entries({ ...base, ...fields })) form.append(k, v);
  const request = new Request("https://epublishingworks.com/api/manuscript/", {
    method: "POST",
    body: form,
    headers: { host: "epublishingworks.com", origin: "https://epublishingworks.com", "x-forwarded-for": `10.0.0.${++ip}` },
  });
  return (await POST(request)).status;
}

describe("manuscript submission, uploads on", () => {
  it.each([
    ["the full manuscript without a file", { sending: "The full manuscript" }, 400],
    ["sample chapters without a file", { sending: "Sample chapters" }, 400],
    ["a link to a file that isn't stored", { sending: "Sample chapters", fileUrl: "https://abc123.private.blob.vercel-storage.com/manuscripts/nope.pdf" }, 400],
    ["a public Blob link", { sending: "Sample chapters", fileUrl: "https://abc123.public.blob.vercel-storage.com/manuscripts/book-x1Y2.pdf" }, 400],
    ["a link on another host", { sending: "Sample chapters", fileUrl: "https://evil.example/manuscripts/book.pdf" }, 400],
    ["a TEST name on production", { sending: "The full manuscript", firstName: "TEST – bot" }, 400],
    ["no answer to what's being sent", {}, 400],
    ["an answer that isn't a choice", { sending: "Everything" }, 400],
    ["a synopsis or outline without a file", { sending: "A synopsis or outline" }, 200],
    ["a backlist book without a file", { sending: "A published (backlist) book" }, 200],
    ["sample chapters with a stored file", { sending: "Sample chapters", fileUrl: STORED, fileName: "book.pdf" }, 200],
  ])("%s → %i", async (_label, fields, status) => {
    expect(await post(fields as Record<string, string>)).toBe(status);
  });

  it("lets the TEST identity skip the file off production (the form tests)", async () => {
    expect(await post({ sending: "Sample chapters", firstName: "TEST – reviewer" }, "preview")).toBe(200);
  });
});
