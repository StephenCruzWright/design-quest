import { describe, expect, it } from "vitest";
import { judgeIntact, problemWith, type TextSample } from "../../src/engine/judges/integrity";
import { composite, contrastRatio, parseColor } from "../../src/engine/measure/color";

const sample = (s: Partial<TextSample>): TextSample => ({
  where: "p",
  rendered: true,
  fontSize: 16,
  opacity: 1,
  colorAlpha: 1,
  left: 32,
  right: 700,
  ...s,
});

describe("judgeIntact", () => {
  it("passes readable text inside the page", () => {
    expect(judgeIntact([sample({}), sample({ fontSize: 12 })]).pass).toBe(true);
  });
  it.each([
    [{ rendered: false }, "is hidden"],
    [{ fontSize: 4 }, "is 4px"],
    [{ opacity: 0.2 }, "20% opacity"],
    [{ colorAlpha: 0 }, "see-through"],
    [{ left: -9999, right: -9000 }, "outside the page"],
  ])("fails text that %o", (patch, phrase) => {
    const r = judgeIntact([sample({ where: "h1", ...patch })]);
    expect(r.pass).toBe(false);
    expect(r.detail).toContain(phrase);
    expect(r.detail).toContain("h1");
  });
  it("counts the rest after naming two", () => {
    const r = judgeIntact([1, 2, 3, 4].map(() => sample({ rendered: false })));
    expect(r.detail).toContain("2 more elements");
  });
  it("tolerates a pixel of rounding at the page edge", () => {
    expect(problemWith(sample({ right: 760.6 }))).toBeNull();
  });
});

describe("contrast maths", () => {
  it("matches the WCAG 2.x extremes", () => {
    const black = parseColor("#000");
    const white = parseColor("rgb(255, 255, 255)");
    if (!black || !white) throw new Error("parse failed");
    expect(contrastRatio(black, white)).toBeCloseTo(21, 1);
    expect(contrastRatio(white, white)).toBeCloseTo(1, 5);
  });
  it("reads oklch() and composites translucent text", () => {
    const ink = parseColor("oklch(24% 0.03 265)");
    const half = parseColor("rgba(0, 0, 0, 0.5)");
    const white = parseColor("#fff");
    if (!ink || !half || !white) throw new Error("parse failed");
    expect(contrastRatio(ink, white)).toBeGreaterThan(12);
    // 50% black over white is mid grey: about 3.9:1, well below solid black.
    expect(contrastRatio(half, white)).toBeCloseTo(3.95, 1);
    expect(composite(half, white).r).toBeCloseTo(0.5, 5);
  });
  it("treats transparent as alpha 0", () => {
    expect(parseColor("transparent")?.alpha).toBe(0);
  });
});
