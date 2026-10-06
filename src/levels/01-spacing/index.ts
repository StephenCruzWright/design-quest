import { judgeIntact } from "../../engine/judges/integrity";
import {
  judgeEconomy,
  judgeProximity,
  judgeScale,
  judgeTiers,
  judgeTokens,
} from "../../engine/judges/spacing";
import { measureIntegrity } from "../../engine/measure/integrity";
import { measureSpacing } from "../../engine/measure/spacing";
import type { LevelDef } from "../types";
import { bosses, clue, quiz, rules } from "./content";
import { lesson } from "./lesson";

export const spacingLevel: LevelDef = {
  id: "spacing",
  num: 1,
  title: "Spacing & Whitespace",
  subtitle: "Space as a system: ratios, tokens, and between > within",
  intro:
    "A bakery menu, a pricing page and a woodworker's blog. Three Lorem & Ipsum sites with one fault between them: everything is spaced evenly, so nothing tells the reader what belongs together. Start with space.",
  lesson,
  rules,
  quiz,
  bosses,
  clue,
  judge(doc, css, { hard }) {
    const snap = measureSpacing(doc);
    return [
      judgeIntact(measureIntegrity(doc)),
      judgeProximity(snap.stacks, hard ? 2.5 : 2),
      judgeScale(snap.values, hard ? 1.4 : 1.25),
      judgeEconomy(snap.values, hard ? 5 : 6),
      judgeTokens(css, hard ? 1 : 0.9),
      judgeTiers(snap, hard ? 2 : 1.5),
    ];
  },
};
