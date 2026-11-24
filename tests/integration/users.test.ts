import type { Payload } from "payload";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { getTestPayload } from "../helpers/payload";

let payload: Payload;
const create = (email: string, user?: object) =>
  (payload.create as unknown as (a: object) => Promise<{ id: number }>)({ collection: "users", data: { email, password: "pass-12345" }, ...(user ? { user, overrideAccess: false } : {}) });

beforeAll(async () => {
  process.env.ADMIN_SETUP_EMAIL = "owner@example.com";
  payload = await getTestPayload();
});
afterAll(async () => {
  delete process.env.ADMIN_SETUP_EMAIL;
  await payload?.db?.destroy?.();
});

describe("the first admin account", () => {
  it("can't be claimed by just anyone", async () => {
    await expect(create("stranger@example.com")).rejects.toThrow(/ADMIN_SETUP_EMAIL|not allowed/i);
  });
  it("can be created for the setup email", async () => {
    await expect(create("Owner@Example.com")).resolves.toBeTruthy();
  });
  it("lets a signed-in editor add more editors", async () => {
    const owner = (await payload.find({ collection: "users", limit: 1 })).docs[0];
    await expect(create("anna@example.com", { ...owner, collection: "users" })).resolves.toBeTruthy();
  });
});
