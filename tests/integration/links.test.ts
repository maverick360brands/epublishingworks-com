import type { Payload } from "payload";
import { afterAll, beforeAll, expect, it } from "vitest";
import { lexicalToHtml } from "@/lib/richtext";
import { getTestPayload, testImage } from "../helpers/payload";

let payload: Payload;
type Doc = Record<string, unknown> & { id: number };
const api = () => payload as unknown as Record<"create" | "findByID", (a: object) => Promise<Doc>>;

beforeAll(async () => {
  payload = await getTestPayload();
});
afterAll(async () => {
  await payload?.db?.destroy?.();
});

it("internal links in a post point at the linked book's page when read the way the site reads them", async () => {
  const author = await api().create({ collection: "authors", data: { name: "Ben", slug: "benkroeske" } });
  const cover = (await testImage(payload)).id;
  const book = await api().create({ collection: "books", data: { title: "Provider", slug: "provider", authors: [author.id], cover } });
  const body = {
    root: {
      type: "root", version: 1, direction: null, format: "", indent: 0,
      children: [{ type: "paragraph", version: 1, direction: null, format: "", indent: 0, textFormat: 0, children: [
        { type: "link", version: 3, direction: null, format: "", indent: 0, fields: { linkType: "internal", newTab: false, doc: { relationTo: "books", value: book.id } }, children: [{ type: "text", text: "Provider", version: 1, detail: 0, format: 0, mode: "normal", style: "" }] },
      ] }],
    },
  };
  const post = await api().create({ collection: "posts", data: { title: "Links", slug: "links", description: "d", summary: "s", body, _status: "published" } });
  const read = await api().findByID({ collection: "posts", id: post.id, depth: 1 });
  expect(lexicalToHtml(read.body as never)).toContain('href="/provider/"');
});
