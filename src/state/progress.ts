/** XP economy and studio ranks. Rewards only pay out improvements, so replays can't farm XP. */

export const XP = {
  lesson: 60,
  perCorrect: 20,
  perfectQuiz: 30,
  stars: [0, 100, 160, 240] as const,
  hardMultiplier: 1.5,
};

export interface Rank {
  title: string;
  min: number;
}

export const RANKS: Rank[] = [
  { title: 'Intern', min: 0 },
  { title: 'Junior Designer', min: 300 },
  { title: 'Designer', min: 900 },
  { title: 'Senior Designer', min: 1800 },
  { title: 'Art Director', min: 3000 },
  { title: 'Creative Director', min: 4500 },
];

export function rankFor(xp: number): { rank: Rank; next: Rank | null; progress: number } {
  let i = 0;
  while (i + 1 < RANKS.length && xp >= RANKS[i + 1].min) i++;
  const rank = RANKS[i];
  const next = RANKS[i + 1] ?? null;
  const progress = next ? (xp - rank.min) / (next.min - rank.min) : 1;
  return { rank, next, progress };
}

export function quizXp(correct: number, total: number): number {
  return correct * XP.perCorrect + (total > 0 && correct === total ? XP.perfectQuiz : 0);
}

export function bossXp(stars: number, hard: boolean): number {
  const base = XP.stars[Math.max(0, Math.min(3, stars))];
  return Math.round(hard ? base * XP.hardMultiplier : base);
}

/** XP gained by improving from a previous best to a new result. Never negative. */
export function improvement(previous: number, next: number): number {
  return Math.max(0, next - previous);
}
