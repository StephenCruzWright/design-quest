import { describe, expect, it } from "vitest";
import { customProperties, declarations, resolveVars } from "../../src/engine/judges/css";
import {
  judgeFluid,
  judgeFocus,
  judgeHeadingScale,
  judgeQuiet,
  judgeRestraint,
  type TextBlock,
  type TypeSnapshot,
} from "../../src/engine/judges/hierarchy";

const block = (b: Partial<TextBlock>): TextBlock => ({
  where: "p",
  heading: 0,
  fontSize: 16,
  weight: 400,
  chars: 100,
  contrast: 12,
  focus: null,
  quiet: false,
  ...b,
});
const snap = (blocks: TextBlock[]): TypeSnapshot => ({
  blocks,
  body: { fontSize: 16, weight: 400, contrast: 12 },
});

describe("judgeHeadingScale", () => {
  it("passes when each level steps down by the ratio", () => {
    const s = snap([
      block({ where: "h1", heading: 1, fontSize: 40 }),
      block({ where: "h2", heading: 2, fontSize: 25 }),
      block({ where: "h3", heading: 3, fontSize: 20 }),
    ]);
    expect(judgeHeadingScale(s).pass).toBe(true);
  });
  it("fails neighbouring levels a pixel apart and names them", () => {
    const r = judgeHeadingScale(
      snap([
        block({ where: "h2", heading: 2, fontSize: 21 }),
        block({ where: "h3", heading: 3, fontSize: 20 }),
      ]),
    );
    expect(r.pass).toBe(false);
    expect(r.detail).toContain("h2 is 21px");
  });
  it("fails a lowest heading smaller than body text", () => {
    const r = judgeHeadingScale(snap([block({ where: "h4", heading: 4, fontSize: 14 })]));
    expect(r.pass).toBe(false);
    expect(r.detail).toContain("smaller than the body text");
  });
  it("is stricter in New Game+", () => {
    const s = snap([block({ heading: 2, fontSize: 24 }), block({ heading: 3, fontSize: 20 })]);
    expect(judgeHeadingScale(s, 1.2).pass).toBe(true);
    expect(judgeHeadingScale(s, 1.25).pass).toBe(false);
  });
});

describe("judgeFocus", () => {
  it("needs the focus to beat the next largest text by the ratio", () => {
    const pass = snap([block({ fontSize: 48, focus: "Offer" }), block({ fontSize: 24 })]);
    const fail = snap([
      block({ fontSize: 26, focus: "Show" }),
      block({ where: "p.when", fontSize: 24 }),
    ]);
    expect(judgeFocus(pass).pass).toBe(true);
    const r = judgeFocus(fail);
    expect(r.pass).toBe(false);
    expect(r.detail).toContain("p.when");
  });
  it("fails a page with no focus marked", () => {
    expect(judgeFocus(snap([block({})])).pass).toBe(false);
  });
});

describe("judgeRestraint", () => {
  it("counts bold by characters", () => {
    const s = snap([block({ chars: 20, weight: 700, heading: 1 }), block({ chars: 80 })]);
    expect(judgeRestraint(s).pass).toBe(true);
    expect(judgeRestraint(s, 0.1).pass).toBe(false);
  });
  it("fails an all-bold page", () => {
    expect(judgeRestraint(snap([block({ weight: 700 })])).pass).toBe(false);
  });
});

describe("judgeQuiet", () => {
  it("passes smaller secondary text that keeps 4.5:1", () => {
    expect(judgeQuiet(snap([block({ quiet: true, fontSize: 13, contrast: 6 })])).pass).toBe(true);
  });
  it("fails quiet text that is louder on any dial, even with lower contrast", () => {
    const r = judgeQuiet(
      snap([block({ where: "p.date", quiet: true, fontSize: 24, weight: 800, contrast: 8 })]),
    );
    expect(r.pass).toBe(false);
    expect(r.detail).toContain("louder");
  });
  it("fails quiet text that drops below 4.5:1", () => {
    const r = judgeQuiet(snap([block({ quiet: true, fontSize: 13, contrast: 3 })]));
    expect(r.pass).toBe(false);
    expect(r.detail).toContain("3.0:1");
  });
  it("names each failing element once", () => {
    const q = block({ where: "p.ages", quiet: true });
    expect(judgeQuiet(snap([q, q, q])).detail.match(/p\.ages/g)).toHaveLength(1);
  });
});

describe("judgeFluid and CSS reading", () => {
  it("counts clamp() directly and through custom properties", () => {
    const css =
      ":root{--big:clamp(2rem,1.5rem + 2vw,3rem)} h1{font-size:var(--big)} h2{font-size:clamp(1.4rem,1rem + 1vw,1.8rem)}";
    expect(judgeFluid(css).pass).toBe(true);
    expect(judgeFluid("h1{font-size:40px}").pass).toBe(false);
  });
  it("ignores clamp() inside comments", () => {
    expect(judgeFluid("/* h1{font-size:clamp(1rem,2vw,3rem)} */ h1{font-size:2rem}").pass).toBe(
      false,
    );
  });
  it("resolves nested var() references and fallbacks", () => {
    const props = customProperties(":root{--a:var(--b);--b:clamp(1rem,2vw,3rem)}");
    expect(resolveVars("var(--a)", props)).toContain("clamp(");
    expect(resolveVars("var(--missing, 2rem)", props)).toBe("2rem");
  });
  it("reads declarations with custom properties kept case-sensitive", () => {
    expect(declarations(":root{--Space-S:1rem} a{MARGIN:0}")).toEqual([
      { prop: "--Space-S", value: "1rem" },
      { prop: "margin", value: "0" },
    ]);
  });
});
