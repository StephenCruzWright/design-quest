import { describe, expect, it } from "vitest";
import {
  charsPerLine,
  type FamilyUse,
  type HeadingSetting,
  judgeFamilies,
  judgeLeading,
  judgeMeasure,
  judgeMeasureCh,
  judgeRhythm,
  type ProseParagraph,
} from "../../src/engine/judges/typography";
import { primaryFamily } from "../../src/engine/measure/typography";

const para = (p: Partial<ProseParagraph>): ProseParagraph => ({
  where: "p",
  chars: 600,
  lines: 10,
  fullLines: 10,
  fontSize: 16,
  lineHeight: 24,
  gapAfter: null,
  ...p,
});

describe("judgeMeasure", () => {
  it("passes 60 characters per line", () => {
    const r = judgeMeasure([para({})]);
    expect(r.pass).toBe(true);
    expect(r.detail).toContain("60 characters");
  });
  it("fails long lines and names the longest paragraph", () => {
    const r = judgeMeasure([para({ where: "p.lede", chars: 1000 }), para({})]);
    expect(r.pass).toBe(false);
    expect(r.detail).toContain("up to 100 in p.lede");
  });
  it("fails short lines", () => {
    expect(judgeMeasure([para({ chars: 300 })]).detail).toContain("Widen");
  });
  it("uses the New Game+ range it is given", () => {
    expect(judgeMeasure([para({ chars: 740 })], 50, 70).pass).toBe(false);
    expect(judgeMeasure([para({ chars: 740 })]).pass).toBe(true);
  });
  it("leaves one-line paragraphs out when longer ones exist", () => {
    const ps = [para({}), para({ chars: 20, lines: 1, fullLines: 0.3 })];
    expect(charsPerLine(ps)).toBe(60);
  });
  it("fails a page with no marked prose", () => {
    expect(judgeMeasure([]).pass).toBe(false);
  });
});

const heading = (h: Partial<HeadingSetting>): HeadingSetting => ({
  where: "h1",
  fontSize: 40,
  lineHeight: 48,
  ...h,
});

describe("judgeLeading", () => {
  it("passes body at 1.5 and headings at 1.2", () => {
    const r = judgeLeading([para({})], [heading({})]);
    expect(r.pass).toBe(true);
    expect(r.detail).toContain("1.5");
  });
  it("fails tight and loose body text", () => {
    expect(judgeLeading([para({ lineHeight: 18 })], []).detail).toContain("too tight");
    expect(judgeLeading([para({ lineHeight: 30 })], []).detail).toContain("too loose");
  });
  it("accepts the edges of the band", () => {
    expect(judgeLeading([para({ lineHeight: 22.4 })], []).pass).toBe(true);
    expect(judgeLeading([para({ lineHeight: 27.2 })], []).pass).toBe(true);
  });
  it("fails a loose heading", () => {
    const r = judgeLeading([para({})], [heading({ where: "h2", lineHeight: 64 })]);
    expect(r.pass).toBe(false);
    expect(r.detail).toContain("h2 has line-height 1.60");
  });
});

describe("judgeFamilies", () => {
  const use = (family: string, where = "p", chars = 100): FamilyUse => ({ family, where, chars });
  it("passes two families and names them, most text first", () => {
    const r = judgeFamilies([use("Georgia", "h1", 20), use("system-ui"), use("system-ui")]);
    expect(r.pass).toBe(true);
    expect(r.detail.indexOf("system-ui")).toBeLessThan(r.detail.indexOf("Georgia"));
  });
  it("fails four families", () => {
    const r = judgeFamilies([
      use("Georgia", "h1"),
      use("Trebuchet MS"),
      use("Brush Script MT", "p.tag"),
      use("Courier New", "span.price"),
    ]);
    expect(r.pass).toBe(false);
    expect(r.detail).toContain("4 families");
    expect(r.detail).toContain("Courier New (span.price)");
  });
});

describe("primaryFamily", () => {
  it("takes the first family and strips quotes", () => {
    expect(primaryFamily('"Avenir Next", Avenir, sans-serif')).toBe("Avenir Next");
    expect(primaryFamily("system-ui, sans-serif")).toBe("system-ui");
  });
});

describe("judgeMeasureCh", () => {
  it("finds a width in ch, through custom properties", () => {
    expect(judgeMeasureCh(".post { max-width: 62ch; }").pass).toBe(true);
    expect(
      judgeMeasureCh(":root { --measure: 60ch; } main { max-inline-size: var(--measure); }").pass,
    ).toBe(true);
    expect(judgeMeasureCh("main { width: min(100%, 65ch); }").pass).toBe(true);
  });
  it("ignores px widths and ch outside width properties", () => {
    expect(judgeMeasureCh(".post { max-width: 640px; padding: 2ch; }").pass).toBe(false);
  });
});

describe("judgeRhythm", () => {
  it("passes a full line between paragraphs", () => {
    const r = judgeRhythm([para({ gapAfter: 24 }), para({})]);
    expect(r.pass).toBe(true);
  });
  it("fails paragraphs closer than a line and names the gap", () => {
    const r = judgeRhythm([para({ where: "p.step", gapAfter: 8 }), para({})]);
    expect(r.pass).toBe(false);
    expect(r.detail).toContain("p.step is 8px");
  });
  it("needs at least two paragraphs in a row", () => {
    expect(judgeRhythm([para({})]).pass).toBe(false);
  });
});
