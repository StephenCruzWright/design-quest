import type { LevelDef } from '../types';
import { measureSpacing } from '../../engine/measure/spacing';
import { judgeEconomy, judgeProximity, judgeScale, judgeTiers, judgeTokens } from '../../engine/judges/spacing';
import { lesson } from './lesson';
import { bosses, quiz, rules } from './content';

export const spacingLevel: LevelDef = {
  id: 'spacing',
  num: 1,
  title: 'Spacing & Whitespace',
  subtitle: 'Space as a system: ratios, tokens, and between > within',
  intro:
    "Welcome to Kerning & Co. First lesson, and the one that pays off on every project: space. Most pages that feel like a template have nothing wrong with their colours or fonts. They're spaced evenly, so nothing on them says what belongs together. Let's fix that. — Ada Kern, studio lead",
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
