import type { Rect } from '../types';

/**
 * Visual distance between two boxes. If they are stacked (no vertical overlap)
 * it's the vertical gap; if they sit side by side it's the horizontal gap.
 */
export function gapBetween(a: Rect, b: Rect): number {
  const vOverlap = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
  if (vOverlap <= 0) return Math.max(a.top, b.top) - Math.min(a.bottom, b.bottom);
  return Math.max(0, Math.max(a.left, b.left) - Math.min(a.right, b.right));
}

export function overlapsVertically(a: Rect, b: Rect): boolean {
  return Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 0;
}

export function union(rects: Rect[]): Rect | null {
  if (rects.length === 0) return null;
  return {
    top: Math.min(...rects.map((r) => r.top)),
    bottom: Math.max(...rects.map((r) => r.bottom)),
    left: Math.min(...rects.map((r) => r.left)),
    right: Math.max(...rects.map((r) => r.right)),
  };
}

export interface Sample {
  px: number;
  where: string;
}

/**
 * Collapse measured values into distinct steps. Values within `tolerance` px of
 * a cluster's first value join it (so 15.6 and 16 count as one step, but a chain
 * 14 → 15 → 16 does not silently merge into one).
 */
export function clusterValues(samples: Sample[], tolerance = 1): Sample[] {
  const sorted = samples.slice().sort((a, b) => a.px - b.px);
  const out: Sample[] = [];
  for (const s of sorted) {
    const last = out[out.length - 1];
    if (last && s.px - last.px <= tolerance) continue;
    out.push(s);
  }
  return out;
}
