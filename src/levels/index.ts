import type { LevelDef, LockedLevel } from './types';
import { spacingLevel } from './01-spacing';

export const LEVELS: LevelDef[] = [spacingLevel];

/** Levels still in production, shown on the map so players see the road ahead. */
export const UPCOMING: LockedLevel[] = [
  { id: 'hierarchy', num: 2, title: 'Visual Hierarchy', subtitle: 'Size, weight and colour as three independent dials', locked: true },
  { id: 'color', num: 3, title: 'Colour & OKLCH', subtitle: 'Lightness, chroma, hue: palettes that pass contrast', locked: true },
  { id: 'typography', num: 4, title: 'Typography', subtitle: 'Measure in ch, leading, and a testable pairing rule', locked: true },
  { id: 'gestalt', num: 5, title: 'Gestalt', subtitle: 'Similarity, common region, continuity, closure', locked: true },
  { id: 'alignment', num: 6, title: 'Alignment & Balance', subtitle: 'One axis, visual weight, optical alignment', locked: true },
  { id: 'grids', num: 7, title: 'Grids & Proportion', subtitle: 'Columns, gutters and ratio-based layout', locked: true },
  { id: 'final', num: 8, title: 'The Final Client', subtitle: 'Every judge, one page', locked: true },
];

export function levelById(id: string): LevelDef | undefined {
  return LEVELS.find((l) => l.id === id);
}
