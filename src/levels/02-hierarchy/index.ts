import {
  judgeFluid,
  judgeFocus,
  judgeHeadingScale,
  judgeQuiet,
  judgeRestraint,
} from "../../engine/judges/hierarchy";
import { judgeIntact } from "../../engine/judges/integrity";
import { measureIntegrity } from "../../engine/measure/integrity";
import { measureType } from "../../engine/measure/type";
import type { LevelDef } from "../types";
import { bosses, clue, quiz, rules } from "./content";
import { lesson } from "./lesson";

export const hierarchyLevel: LevelDef = {
  id: "hierarchy",
  num: 2,
  title: "Visual Hierarchy",
  subtitle: "Size, weight and colour as three separate dials",
  intro:
    "Three clients this week, and all three say the same thing in different words: people can't find what matters. Every page came from Lorem & Ipsum. Every page treats every line as the most important line.",
  lesson,
  rules,
  quiz,
  bosses,
  clue,
  judge(doc, css, { hard }) {
    const snap = measureType(doc);
    return [
      judgeIntact(measureIntegrity(doc)),
      judgeHeadingScale(snap, hard ? 1.25 : 1.2),
      judgeFocus(snap, hard ? 1.75 : 1.5),
      judgeRestraint(snap, hard ? 0.2 : 0.3),
      judgeQuiet(snap),
      judgeFluid(css),
    ];
  },
};
