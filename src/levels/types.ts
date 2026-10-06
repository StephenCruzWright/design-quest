import type { CheckResult, JudgeOptions } from "../engine/types";

export interface LessonSection {
  id: string;
  title: string;
  /** Trusted HTML authored in the repo. */
  body: string;
  /** Optional interactive demo mounted under the body. Returns a cleanup. */
  // biome-ignore lint/suspicious/noConfusingVoidType: a screen or demo may return a cleanup or nothing; void is the idiomatic return type
  demo?: (host: HTMLElement) => void | (() => void);
}

export interface RuleCard {
  id: string;
  title: string;
  rule: string;
  why: string;
  code?: string;
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
