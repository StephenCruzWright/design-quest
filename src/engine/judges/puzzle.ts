import type { CheckResult } from "../types";

/**
 * Puzzle clients: the player sorts a page's items into the groups a visitor
 * sees, then names the principle at work. The board state goes in, the same
 * CheckResult list as a stylesheet comes out, so stars, the problems bar and
 * the battle work unchanged.
 */

export interface PuzzleGroup {
  items: string[];
  why: string;
}

export interface PuzzleState {
  /** Item ids in each bin on the board, in bin order. */
  bins: string[][];
  /** Times an item was dropped beside an item from another group. */
  wrongDrops: number;
  /** Wrong answers to the principle question so far. */
  principleMisses: number;
  principleNamed: boolean;
}

const sameSet = (a: string[], b: string[]) =>
  a.length === b.length && a.every((id) => b.includes(id));

/** Is `group` sitting alone in one bin? */
export function groupFound(group: string[], bins: string[][]): boolean {
  return bins.some((bin) => sameSet(bin, group));
}

/** The group an item belongs to, as an index into `groups`, or -1. */
export function groupOf(item: string, groups: PuzzleGroup[]): number {
  return groups.findIndex((g) => g.items.includes(item));
}

/** Would dropping `item` into `bin` put it beside an item from another group? */
export function isWrongDrop(item: string, bin: string[], groups: PuzzleGroup[]): boolean {
  const mine = groupOf(item, groups);
  return bin.some((other) => other !== item && groupOf(other, groups) !== mine);
}

export function judgePuzzle(
  groups: PuzzleGroup[],
  state: PuzzleState,
  labels: (string | undefined)[] = [],
): CheckResult[] {
  const found = groups.map((g) => groupFound(g.items, state.bins));
  const allFound = found.every(Boolean);
  const results: CheckResult[] = groups.map((g, i) => ({
    id: `group-${i + 1}`,
    kind: "core",
    label: `Group ${i + 1} of ${groups.length}: sorted the way a visitor sees it`,
    pass: found[i],
    detail: found[i]
      ? `${(labels[i] ?? g.items.join(", ")).trim()}. ${g.why}`
      : `Not found yet. A bin holds a group when it has all of that group's items and nothing else.`,
  }));
  results.push({
    id: "principle",
    kind: "core",
    label: "Principle: name what made the groups",
    pass: state.principleNamed,
    detail: state.principleNamed
      ? "Named. You can tell the client why the page reads the way it does."
      : allFound
        ? "Every group is sorted. Answer the question under the board."
        : "The question opens once every group is sorted.",
  });
  results.push({
    id: "clean-sort",
    kind: "bonus",
    label: "Clean sort: no item dropped beside one from another group",
    pass: state.wrongDrops === 0,
    detail:
      state.wrongDrops === 0
        ? "Every item went in beside its own kind."
        : `${state.wrongDrops} drop${state.wrongDrops > 1 ? "s" : ""} put an item beside one from another group.`,
  });
  results.push({
    id: "first-read",
    kind: "bonus",
    label: "First read: name the principle on the first answer",
    pass: state.principleNamed && state.principleMisses === 0,
    detail:
      state.principleMisses === 0
        ? state.principleNamed
          ? "Named on the first answer."
          : "Not answered yet."
        : `${state.principleMisses} wrong answer${state.principleMisses > 1 ? "s" : ""} before the right one.`,
  });
  return results;
}
