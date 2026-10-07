import {
  converter,
  modeHsl,
  modeHwb,
  modeLab,
  modeLch,
  modeLrgb,
  modeOklab,
  modeOklch,
  modeP3,
  modeRgb,
  parse,
  useMode,
  wcagContrast,
} from "culori/fn";
import type { BodyLink, Ink, StatePair } from "../judges/color";
import { colorAlpha, describe, hasOwnText, isRendered, renderedElements, styleOf } from "./dom";

// Only the modes a computed colour can arrive in, so the bundle stays small.
for (const mode of [
  modeRgb,
  modeLrgb,
  modeHsl,
  modeHwb,
  modeLab,
  modeLch,
  modeOklab,
  modeOklch,
  modeP3,
])
  useMode(mode);

const toRgb = converter("rgb");
const toOklch = converter("oklch");

export interface Rgb {
  r: number;
  g: number;
  b: number;
  /** 0 (transparent) to 1 (opaque). */
  alpha: number;
}

const WHITE: Rgb = { r: 1, g: 1, b: 1, alpha: 1 };

/** Parse any CSS colour string to sRGB with alpha, or null if it can't be read. */
export function parseColor(css: string): Rgb | null {
  if (!css || css === "transparent") return { r: 0, g: 0, b: 0, alpha: 0 };
  const parsed = parse(css);
  if (!parsed) return null;
  const c = toRgb(parsed);
  return { r: c.r, g: c.g, b: c.b, alpha: c.alpha ?? 1 };
}

/** Paint `top` over an opaque `bottom` (source-over compositing). */
export function composite(top: Rgb, bottom: Rgb): Rgb {
  const a = top.alpha;
  return {
    r: top.r * a + bottom.r * (1 - a),
    g: top.g * a + bottom.g * (1 - a),
    b: top.b * a + bottom.b * (1 - a),
    alpha: 1,
  };
}

/** WCAG 2.x contrast ratio of a (possibly translucent) text colour on an opaque background. */
export function contrastRatio(text: Rgb, background: Rgb): number {
  const fg = composite(text, background);
  return wcagContrast({ mode: "rgb", ...fg }, { mode: "rgb", ...background });
}

/**
 * The opaque colour behind an element's text: every ancestor's background
 * colour composited in paint order over a white page. Background images are
 * ignored, so a gradient counts as the colour beneath it.
 */
export function effectiveBackground(el: Element): Rgb {
  const layers: Rgb[] = [];
  for (let node: Element | null = el; node; node = node.parentElement) {
    const bg = parseColor(styleOf(node).backgroundColor);
    if (!bg || bg.alpha === 0) continue;
    layers.push(bg);
    if (bg.alpha >= 1) break;
  }
  return layers.reduceRight((under, layer) => composite(layer, under), WHITE);
}

/** Contrast ratio of an element's computed text colour against its effective background. */
export function textContrast(el: Element): number {
  const fg = parseColor(styleOf(el).color) ?? { r: 0, g: 0, b: 0, alpha: 1 };
  return contrastRatio(fg, effectiveBackground(el));
}

const SIDES = ["top", "right", "bottom", "left"] as const;

/** Generated content that actually shows something: not none, not an empty string. */
function pseudoContent(el: Element, pseudo: "::before" | "::after"): string {
  const view = el.ownerDocument.defaultView;
  const content = view ? view.getComputedStyle(el, pseudo).content : "none";
  if (content === "none" || content === "normal") return "";
  return content.replace(/^["']|["']$/g, "").trim() ? content : "";
}

/** Box shadow geometry with the colours removed. */
function shadowShape(shadow: string): string {
  if (!shadow || shadow === "none") return "";
  return shadow
    .replace(/[a-z-]+\([^)]*\)/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** The style of a border that actually paints, or none. */
function borderStyle(cs: CSSStyleDeclaration, side: (typeof SIDES)[number]): string {
  return borderWidth(cs, side) > 0 ? cs.getPropertyValue(`border-${side}-style`) : "none";
}

function borderWidth(cs: CSSStyleDeclaration, side: (typeof SIDES)[number]): number {
  const style = cs.getPropertyValue(`border-${side}-style`);
  if (style === "none" || style === "hidden") return 0;
  return Number.parseFloat(cs.getPropertyValue(`border-${side}-width`)) || 0;
}

/**
 * Differences between two elements that survive greyscale. Small differences
 * a reader would not notice (under 10% in size, under 200 in weight, under
 * 1px in a border) do not count.
 */
function shapeCues(a: Element, b: Element): string[] {
  const x = styleOf(a);
  const y = styleOf(b);
  const cues: string[] = [];
  const sizeA = Number.parseFloat(x.fontSize);
  const sizeB = Number.parseFloat(y.fontSize);
  if (Math.max(sizeA, sizeB) / Math.min(sizeA, sizeB) >= 1.1) cues.push("font-size");
  if (
    Math.abs((Number.parseFloat(x.fontWeight) || 400) - (Number.parseFloat(y.fontWeight) || 400)) >=
    200
  )
    cues.push("font-weight");
  if (x.fontStyle !== y.fontStyle) cues.push("font-style");
  if (x.textTransform !== y.textTransform) cues.push("text-transform");
  if (x.textDecorationLine !== y.textDecorationLine) cues.push("text-decoration");
  if (SIDES.some((side) => Math.abs(borderWidth(x, side) - borderWidth(y, side)) >= 1))
    cues.push("border-width");
  if (SIDES.some((side) => borderStyle(x, side) !== borderStyle(y, side)))
    cues.push("border-style");
  const outline = (cs: CSSStyleDeclaration) =>
    cs.outlineStyle === "none" ? 0 : Number.parseFloat(cs.outlineWidth) || 0;
  if (Math.abs(outline(x) - outline(y)) >= 1) cues.push("outline-width");
  if (shadowShape(x.boxShadow) !== shadowShape(y.boxShadow)) cues.push("box-shadow");
  if ((x.backgroundImage === "none") !== (y.backgroundImage === "none"))
    cues.push("background-image");
  for (const pseudo of ["::before", "::after"] as const)
    if (pseudoContent(a, pseudo) !== pseudoContent(b, pseudo)) cues.push(`${pseudo} content`);
  return cues;
}

/** Colour properties that differ between two elements, counting only borders and outlines that paint. */
function colourDiffs(a: Element, b: Element): string[] {
  const x = styleOf(a);
  const y = styleOf(b);
  const out: string[] = [];
  if (x.color !== y.color) out.push("color");
  if (x.backgroundColor !== y.backgroundColor) out.push("background-color");
  const borderColour = (cs: CSSStyleDeclaration) =>
    SIDES.map((s) =>
      borderWidth(cs, s) > 0 ? cs.getPropertyValue(`border-${s}-color`) : "",
    ).join();
  if (borderColour(x) !== borderColour(y)) out.push("border-color");
  const outlineColour = (cs: CSSStyleDeclaration) =>
    cs.outlineStyle === "none" ? "" : cs.outlineColor;
  if (outlineColour(x) !== outlineColour(y)) out.push("outline-color");
  return out;
}

/** Compare an element in a state with its peer, element by element. */
function comparePair(state: Element, peer: Element): Pick<StatePair, "cues" | "colourOnly"> {
  const left = renderedElements(state);
  const right = renderedElements(peer);
  const cues = new Set<string>();
  const colourOnly = new Set<string>();
  if (left.length !== right.length) cues.add("the elements inside it");
  for (let i = 0; i < Math.min(left.length, right.length); i++) {
    for (const c of shapeCues(left[i], right[i])) cues.add(c);
    for (const c of colourDiffs(left[i], right[i])) colourOnly.add(c);
  }
  return { cues: [...cues], colourOnly: [...colourOnly] };
}

const TEXT_BLOCK = "p, li, dd, td, blockquote, figcaption";

/** Does the block have words of its own outside any link? */
function hasTextOutsideLinks(block: Element): boolean {
  const walker = block.ownerDocument.createTreeWalker(block, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (n.parentElement?.closest("a")) continue;
    if (/\w/.test(n.textContent ?? "")) return true;
  }
  return false;
}

function isUnderlined(link: Element, block: Element): boolean {
  for (
    let node: Element | null = link;
    node && node !== block.parentElement;
    node = node.parentElement
  ) {
    if (styleOf(node).textDecorationLine.includes("underline")) return true;
  }
  const cs = styleOf(link);
  return borderWidth(cs, "bottom") >= 1 && colorAlpha(cs.borderBottomColor) > 0;
}

function toInk(where: string, prop: string, css: string): Ink | null {
  const parsed = parse(css);
  if (!parsed || (parsed.alpha ?? 1) === 0) return null;
  const c = toOklch(parsed);
  return { where, prop, l: c.l, c: c.c, h: c.h };
}

/**
 * Client pages mark intent for the colour checks:
 *   [data-dq-state="Label"]  an element in a state (error, current, sold out)
 *   [data-dq-peer="Label"]   an element of the same kind that is not in it
 */
export function measureColor(doc: Document): {
  pairs: StatePair[];
  links: BodyLink[];
  inks: Ink[];
} {
  const pairs = Array.from(doc.body.querySelectorAll("[data-dq-state]"))
    .filter(isRendered)
    .map((state): StatePair => {
      const label = state.getAttribute("data-dq-state") || describe(state);
      const peer = Array.from(doc.body.querySelectorAll("[data-dq-peer]")).find(
        (p) => p.getAttribute("data-dq-peer") === label && isRendered(p),
      );
      if (!peer)
        return { label, where: describe(state), peerWhere: null, cues: [], colourOnly: [] };
      return {
        label,
        where: describe(state),
        peerWhere: describe(peer),
        ...comparePair(state, peer),
      };
    });

  const links = Array.from(doc.body.querySelectorAll("a"))
    .filter(isRendered)
    .flatMap((a): BodyLink[] => {
      const block = a.closest(TEXT_BLOCK);
      if (!block || !hasTextOutsideLinks(block)) return [];
      const text = (a.textContent ?? "").replace(/\s+/g, " ").trim();
      return [{ text, where: describe(a), underlined: isUnderlined(a, block) }];
    });

  const inks: Ink[] = [];
  for (const el of renderedElements(doc.body)) {
    const cs = styleOf(el);
    const where = describe(el);
    const found = [
      hasOwnText(el) ? toInk(where, "color", cs.color) : null,
      toInk(where, "background-color", cs.backgroundColor),
      ...SIDES.filter((s) => borderWidth(cs, s) > 0).map((s) =>
        toInk(where, `border-${s}-color`, cs.getPropertyValue(`border-${s}-color`)),
      ),
    ];
    for (const ink of found) if (ink) inks.push(ink);
  }
  return { pairs, links, inks };
}
