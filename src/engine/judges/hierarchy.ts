import type { CheckResult } from "../types";
import { customProperties, declarations, resolveVars } from "./css";

/** One element's own text, as rendered. */
export interface TextBlock {
  where: string;
  /** 1–6 inside a heading, 0 otherwise. */
  heading: number;
  /** Computed font-size in px. */
  fontSize: number;
  /** Computed font-weight. */
  weight: number;
  /** Characters of its own text, whitespace collapsed. */
  chars: number;
  /** WCAG 2.x contrast ratio against its effective background. */
  contrast: number;
  /** Label of the [data-dq-focus] region it sits in, or null. */
  focus: string | null;
  /** Inside a [data-dq-quiet] region. */
  quiet: boolean;
}

export interface TypeSnapshot {
  blocks: TextBlock[];
  /** Typical body text: chars-weighted medians over text outside headings, focus and quiet. */
  body: { fontSize: number; weight: number; contrast: number };
}

const px = (n: number) => `${Math.round(n)}px`;
const pct = (r: number) => `${Math.round((r - 1) * 100)}%`;
const times = (n: number) => `${n.toFixed(1)}×`;
const largest = (blocks: TextBlock[]) =>
  blocks.reduce<TextBlock | null>((a, b) => (!a || b.fontSize > a.fontSize ? b : a), null);

/** Heading scale: each heading level is visibly larger than the one below it. */
export function judgeHeadingScale(snap: TypeSnapshot, minRatio = 1.2): CheckResult {
  const base = {
    id: "heading-scale",
    kind: "core" as const,
    label: `Heading scale: each heading level is at least ${pct(minRatio)} larger than the next`,
  };
  const levels = [1, 2, 3, 4, 5, 6]
    .map((lv) => largest(snap.blocks.filter((b) => b.heading === lv)))
    .filter((b): b is TextBlock => b !== null);
  if (levels.length === 0)
    return { ...base, pass: false, detail: "No headings found on the page." };
  const clashes: string[] = [];
  for (let i = 1; i < levels.length; i++) {
    const r = levels[i - 1].fontSize / levels[i].fontSize;
    if (r < minRatio)
      clashes.push(
        `${levels[i - 1].where} is ${px(levels[i - 1].fontSize)} and ${levels[i].where} is ${px(levels[i].fontSize)}, ${r >= 1 ? `only ${pct(r)} apart` : "the wrong way round"}`,
      );
  }
  const lowest = levels[levels.length - 1];
  if (snap.body.fontSize > 0 && lowest.fontSize < snap.body.fontSize)
    clashes.push(
      `${lowest.where} (${px(lowest.fontSize)}) is smaller than the body text (${px(snap.body.fontSize)})`,
    );
  if (clashes.length === 0) {
    return {
      ...base,
      pass: true,
      detail: `Heading sizes: ${levels.map((b) => `${b.where} ${px(b.fontSize)}`).join(", ")}. Each level steps down by at least ${pct(minRatio)}.`,
    };
  }
  return {
    ...base,
    pass: false,
    detail: `${clashes.slice(0, 2).join("; ")}. Need ${times(minRatio)} between neighbouring levels.`,
  };
}

/** Focus: the element the client needs seen first is the largest text by a clear margin. */
export function judgeFocus(snap: TypeSnapshot, minRatio = 1.5): CheckResult {
  const base = {
    id: "focus",
    kind: "core" as const,
    label: `One focus: the marked element is the largest text, ${times(minRatio)} the next largest`,
  };
  const focus = largest(snap.blocks.filter((b) => b.focus));
  const rival = largest(snap.blocks.filter((b) => !b.focus));
  if (!focus) return { ...base, pass: false, detail: "No focus element found on the page." };
  if (!rival)
    return { ...base, pass: true, detail: `“${focus.focus}” is the only text on the page.` };
  const r = focus.fontSize / rival.fontSize;
  return r >= minRatio
    ? {
        ...base,
        pass: true,
        detail: `“${focus.focus}” is ${px(focus.fontSize)}, ${times(r)} the next largest text (${rival.where}, ${px(rival.fontSize)}).`,
      }
    : {
        ...base,
        pass: false,
        detail: `“${focus.focus}” is ${px(focus.fontSize)}, but ${rival.where} is ${px(rival.fontSize)} (${times(r)}, need ${times(minRatio)}).`,
      };
}

/** Restraint: bold is rare enough to still mark something out. */
export function judgeRestraint(snap: TypeSnapshot, maxShare = 0.3): CheckResult {
  const total = snap.blocks.reduce((n, b) => n + b.chars, 0);
  const boldBlocks = snap.blocks.filter((b) => b.weight >= 600);
  const bold = boldBlocks.reduce((n, b) => n + b.chars, 0);
  const share = total === 0 ? 0 : bold / total;
  const pass = total > 0 && share <= maxShare;
  const heaviest = boldBlocks
    .filter((b) => b.heading === 0)
    .sort((a, b) => b.chars - a.chars)
    .slice(0, 2)
    .map((b) => b.where);
  return {
    id: "restraint",
    kind: "core",
    label: `Restraint: no more than ${Math.round(maxShare * 100)}% of the text is bold`,
    pass,
    detail: pass
      ? `${Math.round(share * 100)}% of the characters are bold (weight 600 or more).`
      : `${Math.round(share * 100)}% of the characters are bold (weight 600 or more)${heaviest.length ? `, most of it in ${heaviest.join(" and ")}` : ""}. When most text is bold, bold stops marking anything out.`,
  };
}

/** Quiet: secondary text steps back from body text and stays readable. */
export function judgeQuiet(snap: TypeSnapshot, minContrast = 4.5): CheckResult {
  const base = {
    id: "quiet",
    kind: "bonus" as const,
    label: `Quiet: secondary text is smaller, lighter or lower in contrast than body text, and still ${minContrast}:1`,
  };
  const quiet = snap.blocks.filter((b) => b.quiet);
  if (quiet.length === 0)
    return { ...base, pass: false, detail: "No secondary text marked on the page." };
  const body = snap.body;
  const problems = new Map<string, string>();
  for (const q of quiet) {
    if (problems.has(q.where)) continue;
    const louder = q.fontSize > body.fontSize * 1.05 || q.weight > body.weight;
    const quieter =
      q.fontSize <= body.fontSize * 0.9 ||
      q.weight < body.weight ||
      q.contrast <= body.contrast * 0.75;
    const looks = `${px(q.fontSize)}, weight ${q.weight}, ${q.contrast.toFixed(1)}:1`;
    const bodyLooks = `${px(body.fontSize)}, weight ${body.weight}, ${body.contrast.toFixed(1)}:1`;
    if (louder)
      problems.set(q.where, `${q.where} (${looks}) is louder than the body text (${bodyLooks})`);
    else if (!quieter)
      problems.set(q.where, `${q.where} (${looks}) is as loud as the body text (${bodyLooks})`);
    else if (q.contrast < minContrast)
      problems.set(q.where, `${q.where} drops to ${q.contrast.toFixed(1)}:1 contrast`);
  }
  if (problems.size === 0) {
    return {
      ...base,
      pass: true,
      detail: `All ${quiet.length} secondary elements step back from the body text and keep at least ${minContrast}:1 contrast.`,
    };
  }
  return { ...base, pass: false, detail: `${[...problems.values()].slice(0, 2).join("; ")}.` };
}

/** Fluid type: headings scale with the viewport between a floor and a ceiling. */
export function judgeFluid(cssText: string, min = 2): CheckResult {
  const props = customProperties(cssText);
  const fluid = declarations(cssText).filter(
    (d) => d.prop === "font-size" && /clamp\(/.test(resolveVars(d.value, props)),
  ).length;
  const pass = fluid >= min;
  return {
    id: "fluid",
    kind: "bonus",
    label: `Fluid type: at least ${min} font sizes use clamp()`,
    pass,
    detail: pass
      ? `${fluid} font-size declarations resolve to clamp(), so they grow with the screen between a floor and a ceiling.`
      : `${fluid} font-size declaration${fluid === 1 ? " uses" : "s use"} clamp(); ${min} needed. Try font-size: clamp(2rem, 1.5rem + 2vw, 3rem) on the largest headings.`,
  };
}
