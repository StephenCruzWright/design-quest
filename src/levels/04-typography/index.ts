import { judgeIntact } from "../../engine/judges/integrity";
import {
  judgeFamilies,
  judgeLeading,
  judgeMeasure,
  judgeMeasureCh,
  judgeRhythm,
} from "../../engine/judges/typography";
import { measureIntegrity } from "../../engine/measure/integrity";
import { measureTypography } from "../../engine/measure/typography";
import type { LevelDef } from "../types";
import { bosses, clue, quiz, rules } from "./content";
import { lesson } from "./lesson";

export const typographyLevel: LevelDef = {
  id: "typography",
  num: 4,
  title: "Typography",
  subtitle: "Measure in ch, leading, and a testable pairing rule",
  intro:
    "Three clients, and each one says the words are hard to read. Nobody has changed a word. Lorem & Ipsum set the lines too long, too tight or in too many typefaces, and the writing took the blame.",
  lesson,
  rules,
  quiz,
  bosses,
  clue,
  judge(doc, css, { hard }) {
    const set = measureTypography(doc);
    return [
      judgeIntact(measureIntegrity(doc)),
      judgeMeasure(set.paragraphs, hard ? 50 : 45, hard ? 70 : 75),
      judgeLeading(set.paragraphs, set.headings),
      judgeFamilies(set.families),
      judgeMeasureCh(css),
      judgeRhythm(set.paragraphs),
    ];
  },
};
