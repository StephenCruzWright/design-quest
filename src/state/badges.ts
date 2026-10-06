import type { SaveData } from './save';

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  glyph: string;
  earned: (s: SaveData) => boolean;
}

const allBossRecords = (s: SaveData) =>
  Object.entries(s.levels).flatMap(([levelId, lp]) =>
    Object.entries(lp.bosses).map(([bossKey, rec]) => ({ levelId, bossKey, hard: bossKey.endsWith('+'), ...rec })),
  );

const spacingWins = (s: SaveData) => allBossRecords(s).filter((r) => r.levelId === 'spacing' && r.stars > 0);

export const BADGES: BadgeDef[] = [
  {
    id: 'first-day',
    name: 'First Day',
    description: 'Finish your first lesson at the studio.',
    glyph: '☕',
    earned: (s) => Object.values(s.levels).some((l) => l.lessonDone),
  },
  {
    id: 'sharp-eye',
    name: 'Sharp Eye',
    description: 'Ace a trial without a single wrong answer.',
    glyph: '◉',
    earned: (s) => Object.values(s.levels).some((l) => l.quizTotal > 0 && l.quizBest === l.quizTotal),
  },
  {
    id: 'ratio-wrangler',
    name: 'Ratio Wrangler',
    description: 'Fix a client’s spacing so that between > within.',
    glyph: '↕',
    earned: (s) => spacingWins(s).length > 0,
  },
  {
    id: 'token-keeper',
    name: 'Token Keeper',
    description: 'Ship a fix where spacing comes from named tokens.',
    glyph: '⌗',
    earned: (s) => allBossRecords(s).some((r) => r.bonuses.includes('tokens')),
  },
  {
    id: 'three-tiers',
    name: 'Three-Tier Thinker',
    description: 'Earn three stars on a spacing client.',
    glyph: '≡',
    earned: (s) => spacingWins(s).some((r) => r.stars === 3),
  },
  {
    id: 'full-house',
    name: 'Full House',
    description: 'Win over all three spacing clients.',
    glyph: '⌂',
    earned: (s) => new Set(spacingWins(s).map((r) => r.bossKey.replace('+', ''))).size >= 3,
  },
  {
    id: 'unassisted',
    name: 'Unassisted',
    description: 'Beat a client without opening a single hint.',
    glyph: '✦',
    earned: (s) => allBossRecords(s).some((r) => r.stars > 0 && r.hintsUsed === 0),
  },
  {
    id: 'quick-study',
    name: 'Quick Study',
    description: 'Beat a client in under five minutes.',
    glyph: '⏱',
    earned: (s) => allBossRecords(s).some((r) => r.stars > 0 && r.seconds < 300),
  },
  {
    id: 'glutton',
    name: 'Glutton for Punishment',
    description: 'Beat a client in New Game+ mode.',
    glyph: '✚',
    earned: (s) => allBossRecords(s).some((r) => r.hard && r.stars > 0),
  },
];

/** Badges whose condition is met but which the save hasn't recorded yet. */
export function newlyEarned(s: SaveData): BadgeDef[] {
  return BADGES.filter((b) => !s.badges[b.id] && b.earned(s));
}
