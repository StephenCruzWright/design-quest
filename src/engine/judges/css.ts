/** Reading the player's stylesheet as text, for checks about how CSS is written. */

import { colorsNamed } from "culori/fn";

export interface Declaration {
  prop: string;
  value: string;
}

export function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

/** Every `property: value` pair in the stylesheet, custom properties included. */
export function declarations(cssText: string): Declaration[] {
  const css = stripComments(cssText);
  return Array.from(css.matchAll(/(--[\w-]+|[a-z-]+)\s*:\s*([^;{}]+)/gi), (m) => ({
    prop: m[1].startsWith("--") ? m[1] : m[1].toLowerCase(),
    value: m[2].trim(),
  }));
}

/** Custom property name → value, last declaration wins. */
export function customProperties(cssText: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const d of declarations(cssText)) if (d.prop.startsWith("--")) out.set(d.prop, d.value);
  return out;
}

/**
 * Follow `var(--x)` references until a value without them, so a token defined
 * as `clamp(...)` reads as `clamp(...)`. Stops after a few hops to survive cycles.
 */
export function resolveVars(value: string, props: Map<string, string>): string {
  let out = value;
  for (let hop = 0; hop < 5 && /var\(--/.test(out); hop++) {
    out = out.replace(
      /var\((--[\w-]+)(?:\s*,\s*([^()]*))?\)/g,
      (_, name: string, fallback?: string) => props.get(name) ?? fallback ?? "",
    );
  }
  return out;
}

const COLOUR_FN = /^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix|light-dark)\(/i;
const HEX = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

/** Split a value at top-level spaces, commas and slashes, keeping functions whole. */
function topLevelTokens(value: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let token = "";
  for (const ch of value) {
    if (ch === "(") depth++;
    if (ch === ")") depth = Math.max(0, depth - 1);
    if (depth === 0 && /[\s,/]/.test(ch)) {
      if (token) out.push(token);
      token = "";
    } else token += ch;
  }
  if (token) out.push(token);
  return out;
}

/**
 * The colours written in a declaration value: hex codes, colour functions and
 * named colours. Keywords that carry no colour of their own (transparent,
 * currentColor, inherit) are left out.
 */
export function colourValues(value: string): string[] {
  return topLevelTokens(value).filter((t) => {
    const lower = t.toLowerCase();
    if (lower === "transparent") return false;
    return HEX.test(t) || COLOUR_FN.test(t) || Object.hasOwn(colorsNamed, lower);
  });
}
