import type { MarkName } from "../ui/marks";
import type { SaveData } from "./save";

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  mark: MarkName;
  earned: (s: SaveData) => boolean;
}

const allBossRecords = (s: SaveData) =>
  Object.entries(s.levels).flatMap(([levelId, lp]) =>
    Object.entries(lp.bosses).map(([bossKey, rec]) => ({
      levelId,
      bossKey,
      hard: bossKey.endsWith("+"),
      ...rec,
    })),
  );

const winsIn = (s: SaveData, levelId: string) =>
  allBossRecords(s).filter((r) => r.levelId === levelId && r.stars > 0);
const spacingWins = (s: SaveData) => winsIn(s, "spacing");
/** Distinct clients of a level shipped in either mode. */
const shippedIn = (s: SaveData, levelId: string) =>
  new Set(winsIn(s, levelId).map((r) => r.bossKey.replace("+", ""))).size;

export const BADGES: BadgeDef[] = [
  {
    id: "first-day",
    name: "First Day",
    description: "Finish your first lesson at the studio.",
    mark: "cup",
    earned: (s) => Object.values(s.levels).some((l) => l.lessonDone),
  },
  {
    id: "sharp-eye",
    name: "Sharp Eye",
    description: "Get every question in a trial right.",
    mark: "eye",
    earned: (s) =>
      Object.values(s.levels).some((l) => l.quizTotal > 0 && l.quizBest === l.quizTotal),
  },
  {
    id: "ratio-wrangler",
    name: "Ratio Wrangler",
    description: "Fix a client’s spacing so that between > within.",
    mark: "spread",
    earned: (s) => spacingWins(s).length > 0,
  },
  {
    id: "token-keeper",
    name: "Token Keeper",
    description: "Ship a fix where spacing comes from named tokens.",
    mark: "token",
    earned: (s) => allBossRecords(s).some((r) => r.bonuses.includes("tokens")),
  },
  {
    id: "three-tiers",
    name: "Three-Tier Thinker",
    description: "Earn three stars on a spacing client.",
    mark: "tiers",
    earned: (s) => spacingWins(s).some((r) => r.stars === 3),
  },
  {
    id: "full-house",
    name: "Full House",
    description: "Ship work for all three spacing clients.",
    mark: "door",
    earned: (s) => shippedIn(s, "spacing") >= 3,
  },
  {
    id: "one-voice",
    name: "One Voice",
    description: "Ship a hierarchy fix where one element clearly leads.",
    mark: "focus",
    earned: (s) => winsIn(s, "hierarchy").length > 0,
  },
  {
    id: "fluent",
    name: "Fluent",
    description: "Ship a fix whose headings scale with clamp().",
    mark: "wave",
    earned: (s) => allBossRecords(s).some((r) => r.bonuses.includes("fluid")),
  },
  {
    id: "house-style",
    name: "House Style",
    description: "Ship work for all three hierarchy clients.",
    mark: "scale",
    earned: (s) => shippedIn(s, "hierarchy") >= 3,
  },
  {
    id: "clear-signal",
    name: "Clear Signal",
    description: "Ship a colour fix that reads without relying on colour.",
    mark: "contrast",
    earned: (s) => winsIn(s, "color").length > 0,
  },
  {
    id: "perceptual",
    name: "Perceptual",
    description: "Ship a fix whose colours come from oklch() custom properties.",
    mark: "swatch",
    earned: (s) => allBossRecords(s).some((r) => r.bonuses.includes("oklch")),
  },
  {
    id: "full-spectrum",
    name: "Full Spectrum",
    description: "Ship work for all three colour clients.",
    mark: "drop",
    earned: (s) => shippedIn(s, "color") >= 3,
  },
  {
    id: "unassisted",
    name: "Unassisted",
    description: "Beat a client without opening a single hint.",
    mark: "hand",
    earned: (s) => allBossRecords(s).some((r) => r.stars > 0 && r.hintsUsed === 0),
  },
  {
    id: "quick-study",
    name: "Quick Study",
    description: "Beat a client in under five minutes.",
    mark: "clock",
    earned: (s) => allBossRecords(s).some((r) => r.stars > 0 && r.seconds < 300),
  },
  {
    id: "glutton",
    name: "Glutton for Punishment",
    description: "Beat a client in New Game+ mode.",
    mark: "plus",
    earned: (s) => allBossRecords(s).some((r) => r.hard && r.stars > 0),
  },
];

/** Badges whose condition is met but which the save hasn't recorded yet. */
export function newlyEarned(s: SaveData): BadgeDef[] {
  return BADGES.filter((b) => !s.badges[b.id] && b.earned(s));
}
