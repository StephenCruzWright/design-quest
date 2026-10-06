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
import { styleOf } from "./dom";

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
