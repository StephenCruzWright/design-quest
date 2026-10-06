import type { QuizQuestion } from '../levels/types';
import { shuffle } from './random';

export interface DrawnQuestion extends QuizQuestion {
  /** Options in display order; `answer` is re-indexed to match. */
  options: string[];
  answer: number;
}

/** Draw `count` questions from the pool and shuffle each one's options. */
export function drawQuiz(pool: QuizQuestion[], count: number, rand: () => number = Math.random): DrawnQuestion[] {
  return shuffle(pool, rand)
    .slice(0, Math.min(count, pool.length))
    .map((q) => {
      const order = shuffle(
        q.options.map((_, i) => i),
        rand,
      );
      return { ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) };
    });
}
