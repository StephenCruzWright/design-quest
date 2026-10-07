import {
  judgeAccents,
  judgeContrast,
  judgeLinks,
  judgeNotColourAlone,
  judgeOklchPalette,
} from "../../engine/judges/color";
import { judgeIntact } from "../../engine/judges/integrity";
import { measureColor } from "../../engine/measure/color";
import { measureIntegrity } from "../../engine/measure/integrity";
import { measureType } from "../../engine/measure/type";
import type { LevelDef } from "../types";
import { bosses, clue, quiz, rules } from "./content";
import { lesson } from "./lesson";

export const colorLevel: LevelDef = {
  id: "color",
  num: 3,
  title: "Colour & OKLCH",
  subtitle: "Lightness, chroma, hue: palettes that pass contrast",
  intro:
    "Three clients this week. One has a form nobody can send, one has booking links nobody finds, one has class times nobody can read. All three pages came from Lorem & Ipsum, and all three say things in colour that some readers cannot see.",
  lesson,
  rules,
  quiz,
  bosses,
  clue,
  judge(doc, css, { hard }) {
    const snap = measureType(doc);
    const colour = measureColor(doc);
    return [
      judgeIntact(measureIntegrity(doc)),
      judgeContrast(snap.blocks, hard ? 7 : 4.5, hard ? 4.5 : 3),
      judgeNotColourAlone(colour.pairs),
      judgeLinks(colour.links),
      judgeOklchPalette(css, hard ? 1 : 0.9),
      judgeAccents(colour.inks),
    ];
  },
};
