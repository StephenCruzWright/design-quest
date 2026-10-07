import type { CheckResult } from "../types";
import { customProperties, declarations, resolveVars } from "./css";

/** One paragraph of running text (inside [data-dq-prose]), as rendered. */
export interface ProseParagraph {
  where: string;
  /** Characters of text, whitespace collapsed. */
  chars: number;
  /** Rendered line boxes. */
  lines: number;
  /** Lines with the last, short line counted as the fraction of a full line it fills. */
  fullLines: number;
  /** Computed font-size in px. */
  fontSize: number;
  /** Used line height in px. */
  lineHeight: number;
  /** Space to the next paragraph of the same block, in px, or null when none follows. */
  gapAfter: number | null;
}

/** A heading with its leading. */
export interface HeadingSetting {
  where: string;
  fontSize: number;
  lineHeight: number;
}

/** The first family in an element's font-family stack: the face the designer asked for. */
export interface FamilyUse {
  family: string;
  where: string;
  chars: number;
}

const one = (n: number) => n.toFixed(1);
const two = (n: number) => n.toFixed(2);
const px = (n: number) => `${Math.round(n)}px`;

/** Characters per line over the paragraphs that run to two lines or more. */
export function charsPerLine(paragraphs: ProseParagraph[]): number {
  const multi = paragraphs.filter((p) => p.lines >= 2);
  const pool = multi.length > 0 ? multi : paragraphs;
  const lines = pool.reduce((n, p) => n + p.fullLines, 0);
  return lines === 0 ? 0 : pool.reduce((n, p) => n + p.chars, 0) / lines;
}

/** Measure: body paragraphs hold a comfortable number of characters per line. */
export function judgeMeasure(paragraphs: ProseParagraph[], min = 45, max = 75): CheckResult {
  const base = {
    id: "measure",
    kind: "core" as const,
    label: `Measure: body paragraphs average ${min} to ${max} characters per line`,
  };
  if (paragraphs.length === 0)
    return { ...base, pass: false, detail: "No body paragraphs marked on the page." };
  const cpl = charsPerLine(paragraphs);
  const longest = paragraphs
    .filter((p) => p.lines >= 2)
    .map((p) => ({ p, cpl: p.chars / p.fullLines }))
    .sort((a, b) => b.cpl - a.cpl)[0];
  const n = Math.round(cpl);
  if (n >= min && n <= max)
    return {
      ...base,
      pass: true,
      detail: `Body paragraphs average ${n} characters per line.`,
    };
  return {
    ...base,
    pass: false,
    detail:
      n > max
        ? `Body paragraphs average ${n} characters per line${longest ? `, up to ${Math.round(longest.cpl)} in ${longest.p.where}` : ""}. Readers rate long lines harder to read, and one study found lower comprehension at 100 characters than at 55. Narrow the column with max-width.`
        : `Body paragraphs average ${n} characters per line. Most screen studies found longer lines read faster than short ones. Widen the column.`,
  };
}

/** Leading: body text breathes, headings stay compact. */
export function judgeLeading(
  paragraphs: ProseParagraph[],
  headings: HeadingSetting[],
  body: [number, number] = [1.4, 1.7],
  headingMax = 1.3,
): CheckResult {
  const base = {
    id: "leading",
    kind: "core" as const,
    label: `Leading: body line-height ${body[0]} to ${body[1]}, headings ${headingMax} or less`,
  };
  if (paragraphs.length === 0)
    return { ...base, pass: false, detail: "No body paragraphs marked on the page." };
  const problems = new Map<string, string>();
  for (const p of paragraphs) {
    const r = p.lineHeight / p.fontSize;
    // Two decimals, so 1.395 is not reported as a passing 1.40.
    const rr = Math.round(r * 100) / 100;
    if ((rr < body[0] || rr > body[1]) && !problems.has(p.where))
      problems.set(
        p.where,
        `${p.where} has line-height ${two(r)} (${px(p.lineHeight)} on ${px(p.fontSize)} text), ${rr < body[0] ? "too tight" : "too loose"} for body text`,
      );
  }
  for (const h of headings) {
    const r = h.lineHeight / h.fontSize;
    if (Math.round(r * 100) / 100 > headingMax && !problems.has(h.where))
      problems.set(
        h.where,
        `${h.where} has line-height ${two(r)}, so a heading that wraps reads as two headings`,
      );
  }
  if (problems.size === 0) {
    const ratios = paragraphs.map((p) => p.lineHeight / p.fontSize);
    return {
      ...base,
      pass: true,
      detail: `Body text sits at ${one(Math.min(...ratios))}${Math.max(...ratios) - Math.min(...ratios) > 0.05 ? ` to ${one(Math.max(...ratios))}` : ""}, and ${headings.length === 0 ? "there are no headings" : `every heading at ${headingMax} or less`}.`,
    };
  }
  const list = [...problems.values()];
  return {
    ...base,
    pass: false,
    detail: `${list.slice(0, 2).join("; ")}${list.length > 2 ? `; ${list.length - 2} more` : ""}.`,
  };
}

/** Families: a page uses few typefaces, each with a job. */
export function judgeFamilies(uses: FamilyUse[], max = 2): CheckResult {
  const base = {
    id: "families",
    kind: "core" as const,
    label: `Families: at most ${max} font families on the page (code is exempt)`,
  };
  const byFamily = new Map<string, FamilyUse[]>();
  for (const u of uses) byFamily.set(u.family, [...(byFamily.get(u.family) ?? []), u]);
  const ranked = [...byFamily.entries()]
    .map(([family, list]) => ({
      family,
      chars: list.reduce((n, u) => n + u.chars, 0),
      where: [...new Set(list.map((u) => u.where))],
    }))
    .sort((a, b) => b.chars - a.chars);
  const named = ranked.map((f) => `${f.family} (${f.where.slice(0, 2).join(", ")})`);
  if (ranked.length <= max)
    return {
      ...base,
      pass: true,
      detail:
        ranked.length === 0
          ? "No text found on the page."
          : `${ranked.length} ${ranked.length === 1 ? "family" : "families"}: ${named.join("; ")}.`,
    };
  return {
    ...base,
    pass: false,
    detail: `${ranked.length} families: ${named.slice(0, 4).join("; ")}${ranked.length > 4 ? "; and more" : ""}. Keep ${max}, give each a job, and set the rest in one of them.`,
  };
}

const WIDTH_PROP = /^(max-width|max-inline-size|width|inline-size)$/;

/** Measure in ch: the text column's width is written in characters. */
export function judgeMeasureCh(cssText: string): CheckResult {
  const props = customProperties(cssText);
  const found = declarations(cssText).find(
    (d) => WIDTH_PROP.test(d.prop) && /(^|[^\w-])\d*\.?\d+ch\b/.test(resolveVars(d.value, props)),
  );
  return {
    id: "measure-ch",
    kind: "bonus",
    label: "Measure in ch: the text column's width is set in ch",
    pass: Boolean(found),
    detail: found
      ? `${found.prop}: ${found.value} ties the column to the width of the text, so it holds the same number of characters at any font size.`
      : "No width or max-width is set in ch. A column in px holds fewer characters as the text grows. Try max-width: 50ch on the text column, then check the measure.",
  };
}

/** Paragraph rhythm: paragraphs sit at least one line apart. */
export function judgeRhythm(paragraphs: ProseParagraph[]): CheckResult {
  const base = {
    id: "rhythm",
    kind: "bonus" as const,
    label: "Paragraph rhythm: the space between paragraphs is at least one line-height",
  };
  const pairs = paragraphs.filter((p) => p.gapAfter !== null);
  if (pairs.length === 0)
    return { ...base, pass: false, detail: "No consecutive body paragraphs to compare." };
  // Half a pixel of rounding is allowed.
  const short = pairs.filter((p) => (p.gapAfter as number) + 0.5 < p.lineHeight);
  if (short.length === 0) {
    const tightest = pairs.reduce((a, b) =>
      (a.gapAfter as number) / a.lineHeight <= (b.gapAfter as number) / b.lineHeight ? a : b,
    );
    return {
      ...base,
      pass: true,
      detail: `Paragraphs sit at least one line apart: the tightest gap is ${px(tightest.gapAfter as number)} after ${px(tightest.lineHeight)} lines.`,
    };
  }
  const worst = short.reduce((a, b) =>
    (a.gapAfter as number) / a.lineHeight <= (b.gapAfter as number) / b.lineHeight ? a : b,
  );
  return {
    ...base,
    pass: false,
    detail: `The gap after ${worst.where} is ${px(worst.gapAfter as number)}, less than its ${px(worst.lineHeight)} line. When paragraphs sit closer than a line, the break between them is easy to miss.`,
  };
}
