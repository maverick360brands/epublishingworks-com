import { describe, expect, it } from "vitest";
import { blobStorageOptions } from "@/cms/blob";

describe("blobStorageOptions", () => {
  const opts = blobStorageOptions("token");
  it("gives every upload a unique file name, so previews never overwrite or delete production files", () => {
    expect(opts.addRandomSuffix).toBe(true);
  });
  it("serves images straight from Blob, not through a server function", () => {
    expect(opts.collections.media).toMatchObject({ disablePayloadAccessControl: true });
  });
  it("adds its database fields even without a token, so migrations match every environment", () => {
    expect(blobStorageOptions(undefined).alwaysInsertFields).toBe(true);
  });
  it("is off without a token (local development uses ./media)", () => {
    expect(blobStorageOptions(undefined).enabled).toBe(false);
  });
});
