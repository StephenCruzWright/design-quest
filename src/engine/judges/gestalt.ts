import type { CheckResult } from "../types";

/** One `data-dq-stack` read for common region: how many groups stand out as boxes, and the spacing. */
export interface RegionStack {
  label: string;
  groups: number;
  /** Groups whose box stands out from what is behind it. */
  boxed: number;
  /** Smallest gap between groups. */
  minBetween: number;
  /** Largest gap between stacked children inside a group. */
  maxWithin: number;
}

/** The look of one `data-dq-kind` element. */
export interface KindStyle {
  kind: string;
  where: string;
  /** Text colour as painted, in OKLab. */
  lab: { l: number; a: number; b: number };
  size: number;
  weight: number;
}

const px = (n: number) => `${Math.round(n)}px`;
const ratioOf = (s: RegionStack) => s.minBetween / Math.max(1, s.maxWithin);
const allBoxed = (s: RegionStack) => s.groups > 0 && s.boxed === s.groups;

/** Common region: every group is its own box, or the space around it does the job. */
export function judgeRegion(stacks: RegionStack[], minRatio = 2): CheckResult {
  const base = {
    id: "region",
    kind: "core" as const,
    label: `Common region: every group has its own box, or sits ${minRatio}× further from the next than its contents sit apart`,
  };
  if (stacks.length === 0) return { ...base, pass: false, detail: "No groups found to measure." };
  const failing = stacks.filter((s) => !allBoxed(s) && ratioOf(s) < minRatio);
  if (failing.length === 0) {
    const how = stacks
      .map((s) =>
        allBoxed(s)
          ? `“${s.label}”: all ${s.groups} groups have a box`
          : `“${s.label}”: ${px(s.minBetween)} between groups vs ${px(s.maxWithin)} inside`,
      )
      .join("; ");
    return { ...base, pass: true, detail: `${how}. Each group reads as one thing.` };
  }
  const s = failing[0];
  return {
    ...base,
    pass: false,
    detail: `“${s.label}”: ${s.boxed} of ${s.groups} groups have a box that stands out, and groups sit ${px(s.minBetween)} apart against ${px(s.maxWithin)} inside (${ratioOf(s).toFixed(1)}×). Give every group a background or border, or open the space between them.`,
  };
}

/** Bonus: box and space agree, so two cues say the same thing. */
export function judgeCuesAgree(stacks: RegionStack[], minRatio = 2): CheckResult {
  const base = {
    id: "cues-agree",
    kind: "bonus" as const,
    label: `Cues agree: every group has a box and ${minRatio}× the space around it`,
  };
  const weak = stacks.find((s) => !allBoxed(s) || ratioOf(s) < minRatio);
  if (stacks.length > 0 && !weak) {
    return {
      ...base,
      pass: true,
      detail: "Box and spacing both mark every group. Grouping cues add up.",
    };
  }
  return {
    ...base,
    pass: false,
    detail: weak
      ? `“${weak.label}”: ${weak.boxed} of ${weak.groups} groups boxed, ${ratioOf(weak).toFixed(1)}× between against within.`
      : "No groups found to measure.",
  };
}

/** Distance between two colours in OKLab. */
export function labDistance(a: KindStyle["lab"], b: KindStyle["lab"]): number {
  return Math.hypot(a.l - b.l, a.a - b.a, a.b - b.b);
}

/** Thresholds for "looks different" and "looks the same". Studio rules. */
const COLOUR_DIFFERS = 0.06;
const COLOUR_SAME = 0.02;
const SIZE_DIFFERS = 1.15;
const SIZE_SAME = 1.04;
const WEIGHT_DIFFERS = 200;

/** Which of colour, size and weight tell two styles apart. */
export function differences(a: KindStyle, b: KindStyle): ("colour" | "size" | "weight")[] {
  const out: ("colour" | "size" | "weight")[] = [];
  if (labDistance(a.lab, b.lab) >= COLOUR_DIFFERS) out.push("colour");
  if (Math.max(a.size, b.size) / Math.min(a.size, b.size) >= SIZE_DIFFERS) out.push("size");
  if (Math.abs(a.weight - b.weight) >= WEIGHT_DIFFERS) out.push("weight");
  return out;
}

function alike(a: KindStyle, b: KindStyle): boolean {
  return (
    labDistance(a.lab, b.lab) < COLOUR_SAME &&
    Math.max(a.size, b.size) / Math.min(a.size, b.size) < SIZE_SAME &&
    Math.abs(a.weight - b.weight) < 100
  );
}

const look = (k: KindStyle) => `${px(k.size)}, weight ${k.weight}`;

/** One representative per kind, in page order. */
function byKind(styles: KindStyle[]): Map<string, KindStyle[]> {
  const kinds = new Map<string, KindStyle[]>();
  for (const s of styles) kinds.set(s.kind, [...(kinds.get(s.kind) ?? []), s]);
  return kinds;
}

/** Similarity: one kind, one look; different kinds look different. */
export function judgeSimilarity(styles: KindStyle[]): CheckResult {
  const base = {
    id: "similarity",
    kind: "core" as const,
    label: "Similarity: things of one kind look alike, and different kinds look different",
  };
  const kinds = byKind(styles);
  if (kinds.size === 0) return { ...base, pass: false, detail: "No marked kinds found." };
  for (const [kind, members] of kinds) {
    const odd = members.find((m) => !alike(m, members[0]));
    if (odd)
      return {
        ...base,
        pass: false,
        detail: `“${kind}” changes its look: ${members[0].where} is ${look(members[0])}, but ${odd.where} is ${look(odd)}${labDistance(odd.lab, members[0].lab) >= COLOUR_SAME ? " in another colour" : ""}. A visitor reads a different look as a different kind of thing.`,
      };
  }
  const reps = [...kinds.entries()].map(([kind, m]) => ({ kind, s: m[0] }));
  for (let i = 0; i < reps.length; i++)
    for (let j = i + 1; j < reps.length; j++)
      if (differences(reps[i].s, reps[j].s).length === 0)
        return {
          ...base,
          pass: false,
          detail: `“${reps[i].kind}” and “${reps[j].kind}” look the same (${look(reps[i].s)}, one colour), so a visitor reads them as one kind. Change at least one of colour, size or weight.`,
        };
  return {
    ...base,
    pass: true,
    detail: `${kinds.size} kinds, each with one look, and no two kinds alike.`,
  };
}

/** Bonus: kinds differ in two cues, not one. */
export function judgeCuesAdd(styles: KindStyle[]): CheckResult {
  const base = {
    id: "cues-add",
    kind: "bonus" as const,
    label: "Cues add up: every two kinds differ in at least two of colour, size and weight",
  };
  const reps = [...byKind(styles).entries()].map(([kind, m]) => ({ kind, s: m[0] }));
  for (let i = 0; i < reps.length; i++)
    for (let j = i + 1; j < reps.length; j++) {
      const d = differences(reps[i].s, reps[j].s);
      if (d.length < 2)
        return {
          ...base,
          pass: false,
          detail: `“${reps[i].kind}” and “${reps[j].kind}” differ only in ${d[0] ?? "nothing"}.`,
        };
    }
  return {
    ...base,
    pass: reps.length > 1,
    detail: reps.length > 1 ? "Every pair of kinds differs in two cues or more." : "Too few kinds.",
  };
}
