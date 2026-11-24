import type { Payload } from "payload";
import os from "node:os";
import path from "node:path";
import pg from "pg";

export const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || "postgres://postgres:postgres@localhost:5432/rup_test";

/**
 * A Payload instance on an empty test database. The schema is dropped first, then Payload
 * creates the tables from the config (development "push" mode), so each test file starts clean.
 */
export async function getTestPayload(): Promise<Payload> {
  process.env.DATABASE_URL = TEST_DATABASE_URL;
  process.env.PAYLOAD_SECRET ||= "test-secret";
  process.env.PAYLOAD_MEDIA_DIR = path.join(os.tmpdir(), "rup-test-media");
  const client = new pg.Client({ connectionString: TEST_DATABASE_URL });
  await client.connect();
  await client.query("DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;");
  await client.end();
  const { getPayload } = await import("payload");
  const { default: config } = await import("@payload-config");
  return getPayload({ config });
}

/** Creates a media document from a small generated PNG. */
export async function testImage(payload: Payload, alt = "Test image") {
  const sharp = (await import("sharp")).default;
  const data = await sharp({ create: { width: 60, height: 90, channels: 3, background: "#0b4c9e" } }).png().toBuffer();
  return (payload.create as unknown as (a: object) => Promise<{ id: number }>)({ collection: "media", data: { alt }, file: { data, mimetype: "image/png", name: `t-${Date.now()}-${Math.random().toString(36).slice(2)}.png`, size: data.length } });
}
