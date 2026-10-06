import {
  judgeEconomy,
  judgeProximity,
  judgeScale,
  judgeTiers,
  judgeTokens,
} from "../../engine/judges/spacing";
import { measureSpacing } from "../../engine/measure/spacing";
import type { LevelDef } from "../types";
import { bosses, quiz, rules } from "./content";
import { lesson } from "./lesson";

export const spacingLevel: LevelDef = {
  id: "spacing",
  num: 1,
  title: "Spacing & Whitespace",
  subtitle: "Space as a system: ratios, tokens, and between > within",
  intro:
    "First lesson, and the one you'll use on every job: space. When a page feels like a template, the colours and fonts are usually fine. Everything is spaced evenly, so nothing tells the reader what belongs together. Start there.",
  lesson,
  rules,
  quiz,
  bosses,
  judge(doc, css, { hard }) {
    const snap = measureSpacing(doc);
    return [
      judgeProximity(snap.stacks, hard ? 2.5 : 2),
      judgeScale(snap.values, hard ? 1.4 : 1.25),
      judgeEconomy(snap.values, hard ? 5 : 6),
      judgeTokens(css, hard ? 1 : 0.9),
      judgeTiers(snap, hard ? 2 : 1.5),
    ];
  },
};
