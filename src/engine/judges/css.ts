/** Reading the player's stylesheet as text, for checks about how CSS is written. */

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
