import { describe, expect, it } from 'vitest';
import { clusterValues, gapBetween } from '../../src/engine/measure/geometry';
import {
  judgeEconomy,
  judgeProximity,
  judgeScale,
  judgeTiers,
  judgeTokens,
} from '../../src/engine/judges/spacing';
import { starsFor, type CheckResult } from '../../src/engine/types';

const vals = (...px: number[]) => px.map((p) => ({ px: p, where: `x${p}` }));

describe('gapBetween', () => {
  it('measures vertical gaps between stacked boxes', () => {
    expect(gapBetween({ top: 0, bottom: 20, left: 0, right: 100 }, { top: 36, bottom: 50, left: 0, right: 100 })).toBe(16);
  });
  it('measures horizontal gaps between side-by-side boxes', () => {
    expect(gapBetween({ top: 0, bottom: 50, left: 0, right: 100 }, { top: 10, bottom: 40, left: 124, right: 200 })).toBe(24);
  });
  it('treats overlapping boxes as zero gap', () => {
    expect(gapBetween({ top: 0, bottom: 50, left: 0, right: 100 }, { top: 10, bottom: 40, left: 90, right: 200 })).toBe(0);
  });
});

describe('clusterValues', () => {
  it('merges sub-pixel noise but not chains of 1px steps', () => {
    expect(clusterValues(vals(16, 15.6, 16.4)).map((s) => s.px)).toEqual([15.6]);
    expect(clusterValues(vals(14, 15, 16)).map((s) => s.px)).toEqual([14, 16]);
  });
});

describe('judgeProximity', () => {
  it('passes when groups are ≥2× further apart than their contents', () => {
    expect(judgeProximity([{ label: 'Menu', between: [24, 24], within: [4, 8] }]).pass).toBe(true);
  });
  it('fails an inverted relationship and names the stack', () => {
    const r = judgeProximity([{ label: 'Menu', between: [14], within: [20] }]);
    expect(r.pass).toBe(false);
    expect(r.detail).toContain('Menu');
  });
  it('judges the weakest stack', () => {
    const r = judgeProximity([
      { label: 'Good', between: [40], within: [4] },
      { label: 'Bad', between: [16], within: [12] },
    ]);
    expect(r.pass).toBe(false);
    expect(r.detail).toContain('Bad');
  });
  it('respects a stricter New Game+ ratio', () => {
    const stack = [{ label: 'S', between: [20], within: [9] }];
    expect(judgeProximity(stack, 2).pass).toBe(true);
    expect(judgeProximity(stack, 2.5).pass).toBe(false);
  });
});

describe('judgeScale', () => {
  it('passes a ratio scale', () => {
    expect(judgeScale(vals(4, 8, 16, 24, 40, 64)).pass).toBe(true);
  });
  it('fails values within 25% of each other', () => {
    const r = judgeScale(vals(16, 18, 24));
    expect(r.pass).toBe(false);
    expect(r.detail).toContain('16px');
  });
  it('ignores hairline values under 2px', () => {
    expect(judgeScale(vals(1, 1.5, 8, 16)).pass).toBe(true);
  });
});

describe('judgeEconomy', () => {
  it('counts distinct steps', () => {
    expect(judgeEconomy(vals(4, 8, 16, 24, 40, 64)).pass).toBe(true);
    expect(judgeEconomy(vals(4, 8, 12, 16, 24, 40, 64)).pass).toBe(false);
  });
});

describe('judgeTokens', () => {
  it('passes when spacing uses custom properties', () => {
    const css = ':root{--space-s:16px} .a{margin:0 0 var(--space-s);padding:var(--space-s)} .b{gap:var(--space-s)}';
    expect(judgeTokens(css).pass).toBe(true);
  });
  it('treats 0 and auto as fine, magic numbers as not', () => {
    const css = ':root{--s:1rem} .a{margin:0 auto;padding:var(--s)} .b{gap:13px}';
    const r = judgeTokens(css);
    expect(r.pass).toBe(false);
    expect(r.detail).toContain('2/3');
  });
  it('fails with no custom properties at all', () => {
    expect(judgeTokens('.a{margin:0}').pass).toBe(false);
  });
  it('ignores spacing-like text inside comments', () => {
    const css = ':root{--s:1rem} /* padding: 13px */ .a{padding:var(--s)}';
    expect(judgeTokens(css).pass).toBe(true);
  });
});

describe('judgeTiers', () => {
  it('requires section gaps to beat group gaps', () => {
    const stacks = [{ label: 's', between: [24], within: [4] }];
    expect(judgeTiers({ stacks, sectionGaps: [64, 80], values: [] }).pass).toBe(true);
    expect(judgeTiers({ stacks, sectionGaps: [30], values: [] }).pass).toBe(false);
  });
});

describe('starsFor', () => {
  const c = (kind: 'core' | 'bonus', pass: boolean): CheckResult => ({ id: Math.random().toString(), kind, pass, label: '', detail: '' });
  it('gives 0 stars while any core check fails', () => {
    expect(starsFor([c('core', true), c('core', false), c('bonus', true)])).toBe(0);
  });
  it('gives 1 + passed bonuses, capped at 3', () => {
    expect(starsFor([c('core', true), c('bonus', false), c('bonus', false)])).toBe(1);
    expect(starsFor([c('core', true), c('bonus', true), c('bonus', false)])).toBe(2);
    expect(starsFor([c('core', true), c('bonus', true), c('bonus', true), c('bonus', true)])).toBe(3);
  });
});
