import { describe, expect, it } from "vitest";
import { wallColumns } from "@/lib/hero";

const cover = (n: number) => ({ src: `/c${n}.jpg`, alt: `Book ${n}`, width: 600, height: 900, href: `/b${n}/` });

describe("wallColumns", () => {
  it("fills all five columns even with only three books", () => {
    const cols = wallColumns([cover(1), cover(2), cover(3)]);
    expect(cols).toHaveLength(5);
    for (const c of cols) expect(c.length).toBeGreaterThan(0);
    expect(cols.flat()).toHaveLength(30);
  });

  it("returns five empty columns when there are no books", () => {
    expect(wallColumns([])).toEqual([[], [], [], [], []]);
  });

  it("deals covers across columns in order", () => {
    const cols = wallColumns(Array.from({ length: 10 }, (_, i) => cover(i)), 10);
    expect(cols[0].map((c) => c.src)).toEqual(["/c0.jpg", "/c5.jpg"]);
    expect(cols[1].map((c) => c.src)).toEqual(["/c1.jpg", "/c6.jpg"]);
  });
});
