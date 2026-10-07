import { describe, expect, it } from "vitest";
import {
  hueGroups,
  type Ink,
  isLargeText,
  judgeAccents,
  judgeContrast,
  judgeLinks,
  judgeNotColourAlone,
  judgeOklchPalette,
  ratio,
  type StatePair,
} from "../../src/engine/judges/color";
import { colourValues } from "../../src/engine/judges/css";
import type { TextBlock } from "../../src/engine/judges/hierarchy";

const block = (b: Partial<TextBlock>): TextBlock => ({
  where: "p",
  heading: 0,
  fontSize: 16,
  weight: 400,
  chars: 40,
  contrast: 7,
  focus: null,
  quiet: false,
  ...b,
});

describe("judgeContrast", () => {
  it("passes text at 4.5:1 and names the lowest", () => {
    const r = judgeContrast([block({ contrast: 4.5, where: "p.hint" }), block({})]);
    expect(r.pass).toBe(true);
    expect(r.detail).toContain("p.hint at 4.5:1");
  });
  it("fails body text below 4.5:1 and rounds down", () => {
    const r = judgeContrast([block({ contrast: 4.47, where: "p.hint" })]);
    expect(r.pass).toBe(false);
    expect(r.detail).toContain("p.hint is 4.4:1 (needs 4.5:1)");
  });
  it("holds large text to 3:1", () => {
    expect(judgeContrast([block({ fontSize: 24, contrast: 3.2 })]).pass).toBe(true);
    expect(judgeContrast([block({ fontSize: 19, weight: 700, contrast: 3.2 })]).pass).toBe(true);
    expect(judgeContrast([block({ fontSize: 19, weight: 400, contrast: 3.2 })]).pass).toBe(false);
    const r = judgeContrast([block({ fontSize: 30, contrast: 2.5, where: "h1" })]);
    expect(r.detail).toContain("needs 3:1 as large text");
  });
  it("uses the New Game+ thresholds it is given", () => {
    expect(judgeContrast([block({ contrast: 5 })], 7, 4.5).pass).toBe(false);
  });
  it("names the two worst, once each, and counts the rest", () => {
    const r = judgeContrast([
      block({ where: "p.a", contrast: 3 }),
      block({ where: "p.a", contrast: 2 }),
      block({ where: "p.b", contrast: 4 }),
      block({ where: "p.c", contrast: 1.5 }),
    ]);
    expect(r.detail.indexOf("p.c")).toBeLessThan(r.detail.indexOf("p.a"));
    expect(r.detail).toContain("p.a is 2.0:1");
    expect(r.detail).toContain("1 more");
  });
});

describe("large text and ratio formatting", () => {
  it("follows WCAG's 18pt and 14pt bold", () => {
    expect(isLargeText(24, 400)).toBe(true);
    expect(isLargeText(23.9, 400)).toBe(false);
    expect(isLargeText(18.66, 700)).toBe(true);
    expect(isLargeText(18.66, 600)).toBe(false);
  });
  it("never rounds a failing ratio up", () => {
    expect(ratio(2.99)).toBe("2.9:1");
  });
});

const pair = (p: Partial<StatePair>): StatePair => ({
  label: "Error field",
  where: "div.field",
  peerWhere: "div.field",
  cues: [],
  colourOnly: [],
  ...p,
});

describe("judgeNotColourAlone", () => {
  it("fails a state shown only by colour and names the colour properties", () => {
    const r = judgeNotColourAlone([pair({ colourOnly: ["border-color", "color"] })]);
    expect(r.pass).toBe(false);
    expect(r.detail).toContain("only in border-color, color");
  });
  it("passes when a non-colour cue differs", () => {
    const r = judgeNotColourAlone([pair({ cues: ["border-width"] })]);
    expect(r.pass).toBe(true);
    expect(r.detail).toContain("border-width");
  });
  it("fails when no state or no peer is marked", () => {
    expect(judgeNotColourAlone([]).pass).toBe(false);
    expect(judgeNotColourAlone([pair({ peerWhere: null })]).detail).toContain("no peer");
  });
});

describe("judgeLinks", () => {
  const link = (text: string, underlined: boolean) => ({ text, where: "a", underlined });
  it("passes underlined links and pages with none", () => {
    expect(judgeLinks([link("hours", true)]).detail).toContain("The one link");
    expect(judgeLinks([]).pass).toBe(true);
  });
  it("names links that rely on colour", () => {
    const r = judgeLinks([link("hours", false), link("map", true), link("fees", false)]);
    expect(r.pass).toBe(false);
    expect(r.detail).toContain("2 of 3");
    expect(r.detail).toContain("“hours” and “fees”");
  });
});

describe("colourValues", () => {
  it("finds hex, functions and named colours in shorthands", () => {
    expect(colourValues("1px solid #ccc")).toEqual(["#ccc"]);
    expect(colourValues("rgb(0 0 0 / 50%) url(x.png)")).toEqual(["rgb(0 0 0 / 50%)"]);
    expect(colourValues("oklch(60% 0.1 30), Tomato")).toEqual(["oklch(60% 0.1 30)", "Tomato"]);
  });
  it("skips keywords that carry no colour", () => {
    expect(colourValues("transparent")).toEqual([]);
    expect(colourValues("currentColor")).toEqual([]);
    expect(colourValues("none")).toEqual([]);
    expect(colourValues("inherit")).toEqual([]);
  });
});

describe("judgeOklchPalette", () => {
  it("passes when colours come from oklch() custom properties, through nested var()", () => {
    const css = `:root { --blue: oklch(50% 0.12 250); --link: var(--blue); }
      a { color: var(--link); border-bottom: 1px solid var(--blue); }`;
    const r = judgeOklchPalette(css);
    expect(r.pass).toBe(true);
    expect(r.detail).toContain("2 of 2");
  });
  it("fails hex and rgb() written directly, and tokens that hold hex", () => {
    const css = `:root { --ink: #222; }
      body { color: var(--ink); background: rgb(255 255 255); }
      a { color: oklch(50% 0.1 250); }`;
    const r = judgeOklchPalette(css);
    expect(r.pass).toBe(false);
    expect(r.detail).toContain("0 of 3");
  });
  it("ignores transparent, currentColor and declarations without a colour", () => {
    const css = `:root { --ink: oklch(25% 0.02 60); }
      p { color: var(--ink); background: transparent; border-color: currentColor; border: 0; }`;
    expect(judgeOklchPalette(css).detail).toContain("1 of 1");
  });
  it("needs every colour at 100% in New Game+", () => {
    const tokens = Array.from({ length: 9 }, (_, i) => `.t${i} { color: var(--a); }`).join("");
    const css = `:root { --a: oklch(50% 0.1 30); } ${tokens} .x { color: red; }`;
    expect(judgeOklchPalette(css, 0.9).pass).toBe(true);
    expect(judgeOklchPalette(css, 1).pass).toBe(false);
  });
});

describe("judgeAccents", () => {
  const ink = (h: number | undefined, c = 0.15): Ink => ({
    where: `p.h${h}`,
    prop: "color",
    l: 0.5,
    c,
    h,
  });
  it("merges hues within 30 degrees, across 360", () => {
    expect(hueGroups([350, 10, 5])).toHaveLength(1);
    expect(hueGroups([20, 60, 100])).toHaveLength(3);
    expect(hueGroups([])).toHaveLength(0);
    // The widest empty arc sits between 263 and 21, so the reds wrap past 360 and still merge.
    expect(hueGroups([183, 263, 21, 25, 27])).toHaveLength(3);
  });
  it("ignores neutrals and allows two accent hues", () => {
    const r = judgeAccents([ink(250), ink(255), ink(30), ink(120, 0.02), ink(undefined, 0)]);
    expect(r.pass).toBe(true);
    expect(r.detail).toContain("2 accent hues");
  });
  it("fails a rainbow and names the hues", () => {
    const r = judgeAccents([ink(20), ink(90), ink(150), ink(250), ink(320)]);
    expect(r.pass).toBe(false);
    expect(r.detail).toContain("5 accent hues");
    expect(r.detail).toContain("p.h20");
  });
});
