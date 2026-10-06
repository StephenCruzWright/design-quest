export type CheckKind = 'core' | 'bonus';

/** One line in the judge panel. Core checks gate the win; bonus checks earn stars. */
export interface CheckResult {
  id: string;
  kind: CheckKind;
  label: string;
  pass: boolean;
  /** Plain-language explanation of what was measured, written to teach. */
  detail: string;
}

export interface JudgeOptions {
  /** New Game+: stricter thresholds. */
  hard: boolean;
}

export interface Rect {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/** 1 star for passing every core check, +1 per passed bonus check (max 3). */
export function starsFor(results: CheckResult[]): number {
  const core = results.filter((r) => r.kind === 'core');
  if (core.length === 0 || core.some((r) => !r.pass)) return 0;
  const bonus = results.filter((r) => r.kind === 'bonus' && r.pass).length;
  return Math.min(3, 1 + bonus);
}
