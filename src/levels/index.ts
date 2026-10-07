import { spacingLevel } from "./01-spacing";
import { hierarchyLevel } from "./02-hierarchy";
import { colorLevel } from "./03-color";
import type { LevelDef, LockedLevel } from "./types";

export const LEVELS: LevelDef[] = [spacingLevel, hierarchyLevel, colorLevel];

/** Levels still in production, shown on the map so players see the road ahead. */
export const UPCOMING: LockedLevel[] = [
  {
    id: "typography",
    num: 4,
    title: "Typography",
    subtitle: "Measure in ch, leading, and a testable pairing rule",
    locked: true,
  },
  {
    id: "gestalt",
    num: 5,
    title: "Gestalt",
    subtitle: "Similarity, common region, continuity, closure",
    locked: true,
  },
  {
    id: "alignment",
    num: 6,
    title: "Alignment & Balance",
    subtitle: "One axis, visual weight, optical alignment",
    locked: true,
  },
  {
    id: "grids",
    num: 7,
    title: "Grids & Proportion",
    subtitle: "Columns, gutters and ratio-based layout",
    locked: true,
  },
  {
    id: "final",
    num: 8,
    title: "The Final Client",
    subtitle: "Every judge, one page",
    locked: true,
  },
];

export function levelById(id: string): LevelDef | undefined {
  return LEVELS.find((l) => l.id === id);
}
