import { converter } from "culori/fn";
import type { KindStyle, RegionStack } from "../judges/gestalt";
import { composite, effectiveBackground, parseColor, type Rgb } from "./color";
import { describe, isRendered, styleOf } from "./dom";
import { measureSpacing } from "./spacing";

/**
 * Level 5. Common region reads each `data-dq-stack` (from level 1): which of its
 * `data-dq-group` children paint a box that stands out from what is behind
 * them, plus the between and within gaps. Similarity reads the painted text
 * colour, size and weight of every `data-dq-kind` element.
 */

const toLab = converter("oklab");

function lab(c: Rgb) {
  const o = toLab({ mode: "rgb", r: c.r, g: c.g, b: c.b });
  return { l: o.l, a: o.a, b: o.b };
}

/** A colour that sits on `under` stands out when it moves OKLab by this much. Studio rule. */
const STANDS_OUT = 0.02;

function differs(top: Rgb, under: Rgb): boolean {
  const mine = lab(composite(top, under));
  const theirs = lab(under);
  return Math.hypot(mine.l - theirs.l, mine.a - theirs.a, mine.b - theirs.b) >= STANDS_OUT;
}

/** Does the element paint a box a reader can see against what is behind it? */
export function standsOut(el: Element): boolean {
  const cs = styleOf(el);
  const behind = el.parentElement ? effectiveBackground(el.parentElement) : effectiveBackground(el);
  const bg = parseColor(cs.backgroundColor);
  if (bg && bg.alpha > 0 && differs(bg, behind)) return true;
  if (cs.boxShadow && cs.boxShadow !== "none") return true;
  return (["top", "right", "bottom", "left"] as const).some((side) => {
    const width = parseFloat(cs.getPropertyValue(`border-${side}-width`));
    const style = cs.getPropertyValue(`border-${side}-style`);
    const colour = parseColor(cs.getPropertyValue(`border-${side}-color`));
    return (
      width >= 1 && style !== "none" && style !== "hidden" && !!colour && differs(colour, behind)
    );
  });
}

export function measureGestalt(doc: Document): { stacks: RegionStack[]; kinds: KindStyle[] } {
  const spacing = measureSpacing(doc).stacks;
  const stackEls = Array.from(doc.querySelectorAll("[data-dq-stack]")).filter(isRendered);
  const stacks = stackEls.map((stack, i): RegionStack => {
    const groups = Array.from(stack.children).filter(
      (c) => c.hasAttribute("data-dq-group") && isRendered(c),
    );
    const gaps = spacing[i];
    return {
      label: gaps.label,
      groups: groups.length,
      boxed: groups.filter(standsOut).length,
      minBetween: gaps.between.length ? Math.min(...gaps.between) : 0,
      maxWithin: Math.max(1, ...gaps.within),
    };
  });
  const kinds = Array.from(doc.querySelectorAll("[data-dq-kind]"))
    .filter(isRendered)
    .map((el): KindStyle => {
      const cs = styleOf(el);
      const ink = parseColor(cs.color) ?? { r: 0, g: 0, b: 0, alpha: 1 };
      return {
        kind: el.getAttribute("data-dq-kind") || describe(el),
        // Quote the text: members of one kind usually share a selector.
        where: `“${(el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 28)}”`,
        lab: lab(composite(ink, effectiveBackground(el))),
        size: parseFloat(cs.fontSize),
        weight: Number(cs.fontWeight) || 400,
      };
    });
  return { stacks, kinds };
}
