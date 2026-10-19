import {
  judgeCuesAdd,
  judgeCuesAgree,
  judgeRegion,
  judgeSimilarity,
} from "../../engine/judges/gestalt";
import { judgeIntact } from "../../engine/judges/integrity";
import { measureGestalt } from "../../engine/measure/gestalt";
import { measureIntegrity } from "../../engine/measure/integrity";
import type { LevelDef } from "../types";
import { bosses, clue, quiz, rules } from "./content";
import { lesson } from "./lesson";

export const gestaltLevel: LevelDef = {
  id: "gestalt",
  num: 5,
  title: "Gestalt",
  subtitle: "Similarity, common region, continuity, closure",
  intro:
    "A visitor groups a page before reading a word of it, by what looks alike and what shares a box. Two of these clients need you to read their page the way their visitors do and tell them what went wrong. The third needs the fix. Lorem & Ipsum never checked what their pages grouped.",
  lesson,
  rules,
  quiz,
  bosses,
  clue,
  // Puzzle clients judge the board on their own screen; this runs for the CSS client.
  judge(doc, _css, { hard }) {
    const { stacks, kinds } = measureGestalt(doc);
    const ratio = hard ? 2.5 : 2;
    return [
      judgeIntact(measureIntegrity(doc)),
      judgeRegion(stacks, ratio),
      judgeSimilarity(kinds),
      judgeCuesAgree(stacks, ratio),
      judgeCuesAdd(kinds),
    ];
  },
};
