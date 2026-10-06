import type { CheckResult, JudgeOptions } from "../engine/types";

/** A question the player must answer correctly before the next lesson page opens. */
export interface ChoiceGate {
  kind: "choice";
  prompt: string;
  options: string[];
  answer: number;
  /** Shown once the gate is passed: why the answer is right. */
  note: string;
  /** Shown under a wrong pick, one per option; empty for the right answer. */
  why: string[];
}

/** A target state the player must reach in the page's demo. */
export interface GoalGate {
  kind: "goal";
  /** What to do, shown above the demo. */
  goal: string;
  /** Shown once the goal is reached. */
  note: string;
}

export type LessonGate = ChoiceGate | GoalGate;

export interface DemoContext {
  /** The demo calls this when the player reaches the page's goal. */
  complete: () => void;
}

export interface LessonSection {
  id: string;
  title: string;
  /** Trusted HTML authored in the repo. */
  body: string;
  /** Optional interactive demo mounted under the body. Returns a cleanup. */
  // biome-ignore lint/suspicious/noConfusingVoidType: a screen or demo may return a cleanup or nothing; void is the idiomatic return type
  demo?: (host: HTMLElement, ctx: DemoContext) => void | (() => void);
  gate: LessonGate;
  /** References for the page's factual claims. */
  sources: string[];
}

export interface RuleCard {
  id: string;
  title: string;
  rule: string;
  why: string;
  code?: string;
  /** Where the "why" comes from, or "Studio rule" for a rule of thumb. */
  source: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  /** Optional mini mockup (trusted HTML with inline styles). */
  visual?: string;
  options: string[];
  answer: number;
  /** Brief note shown after answering. */
  note: string;
}

/** A Lorem & Ipsum clue from Ada, shown when the desk's last client ships. */
export interface Clue {
  title: string;
  body: string;
}

export interface BossDef {
  id: string;
  client: string;
  /** One-line description shown on the client card. */
  tagline: string;
  /** What the client says is wrong, in their own (non-designer) words. */
  brief: string;
  /** Who said it, e.g. "Rosa, owner". */
  from: string;
  html: string;
  css: string;
  /** Progressive hints, gentlest first. */
  hints: string[];
}

export interface LevelDef {
  id: string;
  num: number;
  title: string;
  subtitle: string;
  /** Studio-lead intro that frames the level. */
  intro: string;
  lesson: LessonSection[];
  rules: RuleCard[];
  quiz: QuizQuestion[];
  bosses: BossDef[];
  clue: Clue;
  judge: (doc: Document, css: string, opts: JudgeOptions) => CheckResult[];
}

/** Placeholder entry for levels still in production. */
export interface LockedLevel {
  id: string;
  num: number;
  title: string;
  subtitle: string;
  locked: true;
}
