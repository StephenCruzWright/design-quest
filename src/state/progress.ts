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
  /** What Ada says on the promotion card. */
  note: string;
}

export const RANKS: Rank[] = [
  { title: "Intern", min: 0, note: "" },
  {
    title: "Junior Designer",
    min: 300,
    note: "Your name goes on the door, under mine. In pencil, for now.",
  },
  {
    title: "Designer",
    min: 900,
    note: "A client cancelled their Lorem & Ipsum contract today and asked for you by name. That has never happened before.",
  },
  {
    title: "Senior Designer",
    min: 1800,
    note: "You take the difficult clients from now on. Lorem & Ipsum sent one of theirs to spy on us last week. I'll tell you which one.",
  },
  {
    title: "Art Director",
    min: 3000,
    note: "Here is the key to the plan chest. The top drawer holds everything I know about Lorem & Ipsum. Read it before the final client calls.",
  },
  {
    title: "Creative Director",
    min: 4500,
    note: "The studio runs on your rules now. Lorem & Ipsum knows your name, and they are not happy about it.",
  },
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

/**
 * Lesson pages whose gate is passed. The page after them is open and the rest
 * are locked. A finished lesson opens every page, including in older saves.
 */
export function reachedPages(pages: number, lessonDone: boolean, lessonPage: number): number {
  return lessonDone ? pages : Math.min(Math.max(0, lessonPage), pages);
}
