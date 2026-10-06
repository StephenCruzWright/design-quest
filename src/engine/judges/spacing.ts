import type { CheckResult } from '../types';
import { clusterValues, type Sample } from '../measure/geometry';

export interface StackMeasure {
  label: string;
  /** Gaps between consecutive groups in the stack. */
  between: number[];
  /** Gaps between consecutive stacked children inside each group. */
  within: number[];
}

export interface SpacingSnapshot {
  stacks: StackMeasure[];
  /** Content-to-content gaps between consecutive page sections. */
  sectionGaps: number[];
  /** Every margin/padding/gap value in use. */
  values: Sample[];
}

const px = (n: number) => `${Math.round(n)}px`;
const times = (n: number) => `${n.toFixed(1)}×`;

/** Proximity: the space between groups must clearly exceed the space inside them. */
export function judgeProximity(stacks: StackMeasure[], minRatio = 2): CheckResult {
  const base = {
    id: 'proximity',
    kind: 'core' as const,
    label: `Between > within: groups sit at least ${minRatio}× further apart than their contents`,
  };
  const rows = stacks
    .filter((s) => s.between.length > 0)
    .map((s) => {
      const minBetween = Math.min(...s.between);
      const maxWithin = Math.max(1, ...s.within);
      return { ...s, minBetween, maxWithin, r: minBetween / maxWithin };
    });
  if (rows.length === 0) return { ...base, pass: false, detail: 'No groups found to measure.' };
  const worst = rows.reduce((a, b) => (b.r < a.r ? b : a));
  if (worst.r >= minRatio) {
    return {
      ...base,
      pass: true,
      detail: `Weakest grouping is “${worst.label}”: ${px(worst.minBetween)} between groups vs ${px(worst.maxWithin)} inside (${times(worst.r)}). The eye can tell what belongs together.`,
    };
  }
  const failing = rows.filter((r) => r.r < minRatio).length;
  const others = failing > 1 ? ` ${failing - 1} other set${failing > 2 ? 's' : ''} of groups also blur together.` : '';
  return {
    ...base,
    pass: false,
    detail: `“${worst.label}”: groups are only ${px(worst.minBetween)} apart, but things inside a group are up to ${px(worst.maxWithin)} apart (${times(worst.r)}, need ${times(minRatio)}).${others}`,
  };
}

/** Ratio scale: every spacing step should be visibly different from its neighbour. */
export function judgeScale(values: Sample[], minStep = 1.25): CheckResult {
  const base = {
    id: 'scale',
    kind: 'core' as const,
    label: `Ratio scale: each spacing step is at least ${Math.round((minStep - 1) * 100)}% bigger than the last`,
  };
  const steps = clusterValues(values).filter((s) => s.px >= 2);
  const clashes: string[] = [];
  for (let i = 1; i < steps.length; i++) {
    const r = steps[i].px / steps[i - 1].px;
    if (r < minStep) {
      clashes.push(
        `${px(steps[i - 1].px)} (${steps[i - 1].where}) vs ${px(steps[i].px)} (${steps[i].where}) are only ${Math.round((r - 1) * 100)}% apart`,
      );
    }
  }
  if (clashes.length === 0) {
    return {
      ...base,
      pass: true,
      detail: `Steps in use: ${steps.map((s) => px(s.px)).join(', ') || 'none'}. Every jump is big enough to see.`,
    };
  }
  return {
    ...base,
    pass: false,
    detail: `${clashes.length} pair${clashes.length > 1 ? 's' : ''} too close to tell apart: ${clashes.slice(0, 2).join('; ')}. Merge each pair into one step.`,
  };
}

/** Economy: a handful of steps, used consistently. */
export function judgeEconomy(values: Sample[], max = 6): CheckResult {
  const steps = clusterValues(values).filter((s) => s.px >= 2);
  const pass = steps.length <= max;
  return {
    id: 'economy',
    kind: 'core',
    label: `Economy: no more than ${max} distinct spacing values`,
    pass,
    detail: pass
      ? `${steps.length} distinct values. A small vocabulary reads as intentional.`
      : `${steps.length} distinct values (${steps.map((s) => px(s.px)).join(', ')}). Every extra step is one more decision the reader has to decode.`,
  };
}

const SPACING_PROP =
  /^(margin|padding)(-(top|right|bottom|left|block|inline)(-(start|end))?)?$|^((row|column)-)?gap$/;

function isTokenValue(value: string): boolean {
  if (/var\(--/.test(value)) return true;
  // Zero and auto aren't magic numbers.
  return value.split(/\s+/).every((part) => /^(0(px|rem|em|%)?|auto)$/.test(part));
}

/** Tokens: spacing declared through custom properties, not magic numbers. */
export function judgeTokens(cssText: string, minShare = 0.9): CheckResult {
  const css = cssText.replace(/\/\*[\s\S]*?\*\//g, '');
  let total = 0;
  let tokenised = 0;
  for (const m of css.matchAll(/([a-z-]+)\s*:\s*([^;{}]+)/gi)) {
    const prop = m[1].toLowerCase();
    if (!SPACING_PROP.test(prop)) continue;
    total++;
    if (isTokenValue(m[2].trim())) tokenised++;
  }
  const defines = /--[\w-]+\s*:/.test(css);
  const share = total === 0 ? 0 : tokenised / total;
  const pass = defines && total > 0 && share >= minShare;
  return {
    id: 'tokens',
    kind: 'bonus',
    label: 'Tokens: spacing comes from custom properties, not magic numbers',
    pass,
    detail: !defines
      ? 'No custom properties yet. Declare a scale such as --space-s: 1rem; on :root and use var(--space-s).'
      : `${tokenised}/${total} spacing declarations use tokens (${Math.round(share * 100)}%, need ${Math.round(minShare * 100)}%).`,
  };
}

/** Three tiers: within a group < between groups < between sections. */
export function judgeTiers(snapshot: SpacingSnapshot, minRatio = 1.5): CheckResult {
  const base = {
    id: 'tiers',
    kind: 'bonus' as const,
    label: `Three tiers: sections sit ${minRatio}× further apart than the groups inside them`,
  };
  const groupGaps = snapshot.stacks.flatMap((s) => s.between);
  if (snapshot.sectionGaps.length === 0 || groupGaps.length === 0) {
    return { ...base, pass: false, detail: 'Not enough sections or groups to measure.' };
  }
  const minSection = Math.min(...snapshot.sectionGaps);
  const maxGroup = Math.max(...groupGaps);
  const r = minSection / maxGroup;
  return {
    ...base,
    pass: r >= minRatio,
    detail:
      r >= minRatio
        ? `Tightest section break is ${px(minSection)} vs ${px(maxGroup)} between groups (${times(r)}). Page → section → group reads at a glance.`
        : `Tightest section break is ${px(minSection)}, but groups are up to ${px(maxGroup)} apart (${times(r)}). Sections need more air than the groups inside them.`,
  };
}
