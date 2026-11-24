import { describe, expect, it } from "vitest";
import { isProductionHost, PRODUCTION_HOST_PATTERN } from "@/lib/hosts";

describe("production host check", () => {
  it("indexes only the live domain", () => {
    expect(isProductionHost("epublishingworks.com")).toBe(true);
    expect(isProductionHost("www.epublishingworks.com")).toBe(true);
    expect(isProductionHost("EPublishingWorks.com:443")).toBe(true);
    expect(isProductionHost("epublishingworks-com.vercel.app")).toBe(false);
    expect(isProductionHost("localhost:3100")).toBe(false);
    expect(isProductionHost(null)).toBe(false);
  });
  it("the next.config pattern matches the same hosts, whole", () => {
    const re = new RegExp(`^${PRODUCTION_HOST_PATTERN}$`);
    expect(re.test("epublishingworks.com")).toBe(true);
    expect(re.test("www.epublishingworks.com")).toBe(true);
    expect(re.test("epublishingworks.com.evil.example")).toBe(false);
    expect(re.test("epublishingworks-com.vercel.app")).toBe(false);
  });
});
