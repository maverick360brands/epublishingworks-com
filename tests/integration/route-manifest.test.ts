import type { Payload } from "payload";
import pg from "pg";
import { afterAll, beforeAll, expect, it } from "vitest";
import { loadManifest } from "@/lib/route-manifest";
import { getTestPayload, TEST_DATABASE_URL, testImage } from "../helpers/payload";

let payload: Payload;
let pool: pg.Pool;
type Doc = { id: number };
const create = (a: object) => (payload.create as unknown as (a: object) => Promise<Doc>)(a);

beforeAll(async () => {
  payload = await getTestPayload();
  pool = new pg.Pool({ connectionString: TEST_DATABASE_URL });
  const cover = (await testImage(payload)).id;
  const ben = await create({ collection: "authors", data: { name: "Ben", slug: "benkroeske" } });
  await create({ collection: "books", data: { title: "Provider", slug: "provider", authors: [ben.id], cover } });
  const hidden = await create({ collection: "books", data: { title: "Secret", slug: "secret", authors: [ben.id], cover, hidden: true } });
  await (payload.update as unknown as (a: object) => Promise<Doc>)({ collection: "books", id: hidden.id, data: { hidden: true } });
  await create({ collection: "posts", data: { title: "Live", slug: "live", description: "d", summary: "s", _status: "published" } });
  await create({ collection: "posts", draft: true, data: { title: "Draft", slug: "wip", description: "d", summary: "s", _status: "draft" } });
});

afterAll(async () => {
  await pool?.end();
  await payload?.db?.destroy?.();
});

it("reads books with their authors, hidden flags, and post status straight from Postgres", async () => {
  const m = await loadManifest((sql) => pool.query(sql).then((r) => r.rows));
  expect(m.books).toEqual(
    expect.arrayContaining([
      { slug: "provider", hidden: false, authorSlugs: ["benkroeske"] },
      { slug: "secret", hidden: true, authorSlugs: ["benkroeske"] },
    ]),
  );
  expect(m.authors).toEqual([{ slug: "benkroeske", hidden: false }]);
  expect(m.posts).toEqual(expect.arrayContaining([{ slug: "live", published: true }, { slug: "wip", published: false }]));
});
