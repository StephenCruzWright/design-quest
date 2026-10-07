import type { CheckResult } from "../types";
import { colourValues, customProperties, declarations, resolveVars } from "./css";
import type { TextBlock } from "./hierarchy";

/** An element in a state (error, selected, sold out) and its peer that is not. */
export interface StatePair {
  /** The shared label from `data-dq-state` and `data-dq-peer`. */
  label: string;
  where: string;
  /** The peer element, or null when the page marks none. */
  peerWhere: string | null;
  /** Non-colour properties that differ between the two, e.g. "border-left-width". */
  cues: string[];
  /** Colour properties that differ, e.g. "border-top-color". */
  colourOnly: string[];
}

/** A link inside running text. */
export interface BodyLink {
  text: string;
  where: string;
  underlined: boolean;
}

/** One rendered colour, in OKLCH. */
export interface Ink {
  where: string;
  prop: string;
  /** OKLCH lightness, 0 to 1. */
  l: number;
  /** OKLCH chroma. */
  c: number;
  /** OKLCH hue in degrees; undefined for greys. */
  h: number | undefined;
}

/** WCAG 2.x large text: 18pt (24px), or 14pt (about 18.66px) at bold weight. */
export function isLargeText(fontSize: number, weight: number): boolean {
  return fontSize >= 24 || (fontSize >= 18.66 && weight >= 700);
}

/** A ratio rounded down, so 4.47:1 never reads as a passing 4.5:1. */
export const ratio = (r: number) => `${(Math.floor(r * 10) / 10).toFixed(1)}:1`;

const quoteList = (items: string[]) => {
  const named = items.slice(0, 2).map((t) => `“${t}”`);
  const rest = items.length - named.length;
  return rest > 0 ? `${named.join(", ")} and ${rest} more` : named.join(" and ");
};

/** Contrast: every piece of text meets the WCAG 2.x ratio for its size. */
export function judgeContrast(blocks: TextBlock[], normal = 4.5, large = 3): CheckResult {
  const base = {
    id: "contrast",
    kind: "core" as const,
    label: `Contrast: text is at least ${normal}:1 against its background (large text ${large}:1)`,
  };
  if (blocks.length === 0) return { ...base, pass: false, detail: "No text found on the page." };
  const worst = new Map<string, { block: TextBlock; need: number }>();
  for (const b of blocks) {
    const big = isLargeText(b.fontSize, b.weight);
    const need = big ? large : normal;
    if (b.contrast >= need) continue;
    const seen = worst.get(b.where);
    if (!seen || b.contrast < seen.block.contrast) worst.set(b.where, { block: b, need });
  }
  if (worst.size === 0) {
    const lowest = blocks.reduce((a, b) => (b.contrast < a.contrast ? b : a));
    return {
      ...base,
      pass: true,
      detail: `All ${blocks.length} text elements pass. The lowest is ${lowest.where} at ${ratio(lowest.contrast)}.`,
    };
  }
  const fails = [...worst.values()].sort((a, b) => a.block.contrast - b.block.contrast);
  const named = fails
    .slice(0, 2)
    .map(
      ({ block, need }) =>
        `${block.where} is ${ratio(block.contrast)} (needs ${need}:1${need === large ? " as large text" : ""})`,
    );
  const rest = fails.length - named.length;
  return {
    ...base,
    pass: false,
    detail: `${named.join("; ")}${rest > 0 ? `; ${rest} more below the line` : ""}. The ratio compares the text colour with the background it actually sits on.`,
  };
}

/** Not colour alone: every marked state differs from its peer in something besides colour. */
export function judgeNotColourAlone(pairs: StatePair[]): CheckResult {
  const base = {
    id: "not-colour-alone",
    kind: "core" as const,
    label: "Not colour alone: every marked state differs from its peer in more than colour",
  };
  if (pairs.length === 0) return { ...base, pass: false, detail: "No state marked on the page." };
  const problems: string[] = [];
  for (const p of pairs) {
    if (p.peerWhere === null) problems.push(`“${p.label}” has no peer to compare with`);
    else if (p.cues.length === 0)
      problems.push(
        p.colourOnly.length > 0
          ? `“${p.label}” differs from its peer only in ${p.colourOnly.slice(0, 3).join(", ")}`
          : `“${p.label}” looks the same as its peer`,
      );
  }
  if (problems.length === 0) {
    return {
      ...base,
      pass: true,
      detail: pairs
        .map((p) => `“${p.label}” differs from its peer in ${p.cues.slice(0, 2).join(" and ")}`)
        .join("; ")
        .concat(". Those differences stay visible without colour."),
    };
  }
  return {
    ...base,
    pass: false,
    detail: `${problems.slice(0, 2).join("; ")}. Take the colour away and the state disappears. Add a cue that is not a colour, for example a thicker border or a ::before word.`,
  };
}

/** Links: links inside running text are underlined. */
export function judgeLinks(links: BodyLink[]): CheckResult {
  const base = {
    id: "links",
    kind: "core" as const,
    label: "Links: links inside running text are underlined",
  };
  if (links.length === 0)
    return { ...base, pass: true, detail: "No links sit inside running text on this page." };
  const bare = links.filter((l) => !l.underlined);
  if (bare.length === 0)
    return {
      ...base,
      pass: true,
      detail:
        links.length === 1
          ? "The one link in running text is underlined."
          : `All ${links.length} links in running text are underlined.`,
    };
  return {
    ...base,
    pass: false,
    detail: `${bare.length} of ${links.length} links in running text ${bare.length === 1 ? "is" : "are"} not underlined: ${quoteList(bare.map((l) => l.text))}. Without an underline, only the colour says it is a link.`,
  };
}

/** Properties that paint a colour, for the OKLCH palette check. */
const COLOUR_PROP =
  /^(color|background|background-color|fill|stroke|caret-color|accent-color)$|^(border|outline|text-decoration|column-rule)(-|$)/;

/** OKLCH palette: colour declarations go through custom properties holding oklch() values. */
export function judgeOklchPalette(cssText: string, minShare = 0.9): CheckResult {
  const props = customProperties(cssText);
  let total = 0;
  const off: string[] = [];
  for (const d of declarations(cssText)) {
    if (d.prop.startsWith("--") || !COLOUR_PROP.test(d.prop)) continue;
    const colours = colourValues(resolveVars(d.value, props));
    if (colours.length === 0) continue;
    total++;
    const ok = /var\(--/.test(d.value) && colours.every((c) => /^oklch\(/i.test(c));
    if (!ok) off.push(`${d.prop}: ${d.value}`);
  }
  const share = total === 0 ? 0 : (total - off.length) / total;
  const pass = total > 0 && share >= minShare;
  const label = `OKLCH palette: at least ${Math.round(minShare * 100)}% of colours come from oklch() custom properties`;
  if (total === 0)
    return { id: "oklch", kind: "bonus", label, pass, detail: "No colour declarations found." };
  return {
    id: "oklch",
    kind: "bonus",
    label,
    pass,
    detail: pass
      ? `${total - off.length} of ${total} colour declarations use oklch() custom properties.`
      : `${total - off.length} of ${total} colour declarations use oklch() custom properties (${Math.round(share * 100)}%). Still written directly: ${off.slice(0, 2).join("; ")}. Define the colour once, for example --accent: oklch(55% 0.15 250), and use var(--accent).`,
  };
}

/** Accents are inks with this much OKLCH chroma or more. */
export const ACCENT_CHROMA = 0.1;
/** Hues closer than this count as one hue (Ada's rule). */
export const HUE_MERGE = 30;

/** Group hues on the colour wheel: each group spans at most `span` degrees. */
export function hueGroups(hues: number[], span = HUE_MERGE): number[][] {
  if (hues.length === 0) return [];
  const sorted = hues.map((h) => ((h % 360) + 360) % 360).sort((a, b) => a - b);
  // Start just after the widest empty arc, so a group never straddles the start.
  let cut = 0;
  let widest = -1;
  for (let i = 0; i < sorted.length; i++) {
    const next = i + 1 < sorted.length ? sorted[i + 1] : sorted[0] + 360;
    if (next - sorted[i] > widest) {
      widest = next - sorted[i];
      cut = (i + 1) % sorted.length;
    }
  }
  const ring = [...sorted.slice(cut), ...sorted.slice(0, cut).map((h) => h + 360)];
  const groups: number[][] = [];
  for (const h of ring) {
    const g = groups[groups.length - 1];
    if (g && h - g[0] <= span) g.push(h);
    else groups.push([h]);
  }
  return groups.map((g) => g.map((h) => h % 360));
}

/** Restrained accents: few saturated hues, so each one still means something. */
export function judgeAccents(inks: Ink[], max = 2): CheckResult {
  const base = {
    id: "accents",
    kind: "bonus" as const,
    label: `Restrained accents: at most ${max} hues with OKLCH chroma above ${ACCENT_CHROMA} (hues within ${HUE_MERGE}° count as one)`,
  };
  const accents = inks.filter((i) => i.c > ACCENT_CHROMA && i.h !== undefined);
  const groups = hueGroups(accents.map((i) => i.h as number));
  const describeGroup = (g: number[]) => {
    const h = g[0];
    const ink = accents.find((i) => Math.abs(((i.h as number) % 360) - h) < 0.5);
    return `${Math.round(h)}°${ink ? ` (${ink.where})` : ""}`;
  };
  const pass = groups.length <= max;
  return {
    ...base,
    pass,
    detail:
      groups.length === 0
        ? "No accent colours: every colour on the page is a low-chroma neutral."
        : pass
          ? `${groups.length} accent hue${groups.length === 1 ? "" : "s"}: ${groups.map(describeGroup).join(", ")}. Everything else is neutral.`
          : `${groups.length} accent hues: ${groups.map(describeGroup).slice(0, 4).join(", ")}${groups.length > 4 ? " and more" : ""}. With this many, no colour stands for anything. Keep ${max} and make the rest neutral (chroma under ${ACCENT_CHROMA}).`,
  };
}
