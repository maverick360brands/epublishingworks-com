import { expect, test, type APIRequestContext } from "@playwright/test";

// Real HTTP statuses for content addresses. Runs against a build whose database has the
// imported content. Start the server with ROUTE_MANIFEST_TTL_MS=1000 so the proxy picks up
// changes quickly.
const EMAIL = process.env.E2E_EMAIL || "editor@example.com";
const PASSWORD = process.env.E2E_PASSWORD || "editor-pass-123";
const fs = await import("node:fs");
const legacy = fs.readFileSync("tests/fixtures/legacy-urls.txt", "utf8").trim().split("\n");
// Legacy addresses that moved (old new), e.g. a misspelled WordPress address.
const moved = fs.readFileSync("tests/fixtures/legacy-redirects.txt", "utf8").trim().split("\n").map((l) => l.split(" "));

const status = async (request: APIRequestContext, path: string) => {
  const res = await request.get(path, { maxRedirects: 0 });
  return { code: res.status(), location: res.headers()["location"] ?? "" };
};

async function eventually(check: () => Promise<boolean>, timeoutMs = 15_000) {
  const end = Date.now() + timeoutMs;
  while (Date.now() < end) {
    if (await check()) return true;
    await new Promise((r) => setTimeout(r, 500));
  }
  return check();
}

async function signIn(request: APIRequestContext) {
  const res = await request.post("/api/cms/users/login", { data: { email: EMAIL, password: PASSWORD } });
  if (res.status() !== 200) {
    await request.post("/api/cms/users/first-register", { data: { email: EMAIL, password: PASSWORD, "confirm-password": PASSWORD } });
    await request.post("/api/cms/users/login", { data: { email: EMAIL, password: PASSWORD } });
  }
}

async function bookId(request: APIRequestContext, slug: string) {
  const res = await request.get(`/api/cms/books?where[slug][equals]=${slug}&depth=0`);
  return (await res.json()).docs[0].id as number;
}

test("every legacy WordPress URL still returns 200", async ({ request }) => {
  for (const path of legacy) expect.soft((await status(request, path)).code, path).toBe(200);
});

test("moved legacy WordPress URLs redirect permanently to the new address", async ({ request }) => {
  for (const [from, to] of moved) {
    const res = await status(request, from);
    expect.soft(res.code, from).toBe(308);
    expect.soft(new URL(res.location, "http://x").pathname, from).toBe(to);
    expect.soft((await status(request, to)).code, to).toBe(200);
  }
});

test("unknown addresses return a real 404", async ({ request }) => {
  // "/adminsguide/" only starts like the admin; the proxy must still handle it.
  for (const path of ["/zzzz/", "/authors/zzzz/", "/blog/zzzz/", "/adminsguide/"]) expect((await status(request, path)).code, path).toBe(404);
});

test("the admin loads", async ({ request }) => {
  expect((await request.get("/admin/")).status()).toBe(200);
});

test("a hidden book redirects to its author's page, temporarily", async ({ request }) => {
  await signIn(request);
  const id = await bookId(request, "spirits-adopted-alice-duncan");
  try {
    await request.patch(`/api/cms/books/${id}`, { data: { hidden: true } });
    expect(await eventually(async () => (await status(request, "/spirits-adopted-alice-duncan/")).code === 307)).toBe(true);
    expect((await status(request, "/spirits-adopted-alice-duncan/")).location).toMatch(/\/authors\/[a-z0-9_-]+\/$/);
    // Meanwhile the page itself never caches a redirect: its own HTML is the noindex fallback.
  } finally {
    await request.patch(`/api/cms/books/${id}`, { data: { hidden: false } });
  }
  expect(await eventually(async () => (await status(request, "/spirits-adopted-alice-duncan/")).code === 200)).toBe(true);
});

test("a renamed book's old address redirects permanently to the new one", async ({ request }) => {
  await signIn(request);
  const id = await bookId(request, "unshakable");
  try {
    await request.patch(`/api/cms/books/${id}`, { data: { slug: "unshakablebook" } });
    expect(await eventually(async () => (await status(request, "/unshakable/")).code === 308)).toBe(true);
    // Every 308 along the way must carry the new address.
    expect((await status(request, "/unshakable/")).location).toMatch(/\/unshakablebook\/$/);
  } finally {
    await request.patch(`/api/cms/books/${id}`, { data: { slug: "unshakable" } });
  }
  expect(await eventually(async () => (await status(request, "/unshakable/")).code === 200)).toBe(true);
});
