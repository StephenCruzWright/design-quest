import { describe, expect, it } from "vitest";
import {
  differences,
  judgeCuesAdd,
  judgeCuesAgree,
  judgeRegion,
  judgeSimilarity,
  type KindStyle,
  type RegionStack,
} from "../../src/engine/judges/gestalt";
import { groupFound, isWrongDrop, judgePuzzle } from "../../src/engine/judges/puzzle";
import { LEVELS } from "../../src/levels";
import type { PuzzleBoss } from "../../src/levels/types";
import { newlyEarned } from "../../src/state/badges";
import { emptyLevel, freshSave } from "../../src/state/save";

const stack = (over: Partial<RegionStack> = {}): RegionStack => ({
  label: "Packages",
  groups: 3,
  boxed: 0,
  minBetween: 12,
  maxWithin: 12,
  ...over,
});

const ink = { l: 0.28, a: 0, b: -0.02 };
const red = { l: 0.5, a: 0.17, b: 0.08 };
const grey = { l: 0.55, a: 0, b: -0.01 };
const kind = (k: string, over: Partial<KindStyle> = {}): KindStyle => ({
  kind: k,
  where: `“${k}”`,
  lab: ink,
  size: 16,
  weight: 400,
  ...over,
});

describe("common region", () => {
  it("fails groups with no box and no extra space", () => {
    expect(judgeRegion([stack()]).pass).toBe(false);
  });
  it("passes when every group has a box", () => {
    expect(judgeRegion([stack({ boxed: 3 })]).pass).toBe(true);
  });
  it("passes on spacing alone at the ratio, and New Game+ asks for more", () => {
    expect(judgeRegion([stack({ minBetween: 24 })]).pass).toBe(true);
    expect(judgeRegion([stack({ minBetween: 24 })], 2.5).pass).toBe(false);
  });
  it("treats a partly boxed stack as unboxed", () => {
    expect(judgeRegion([stack({ boxed: 2 })]).pass).toBe(false);
  });
  it("gives the bonus only when box and space agree", () => {
    expect(judgeCuesAgree([stack({ boxed: 3 })]).pass).toBe(false);
    expect(judgeCuesAgree([stack({ boxed: 3, minBetween: 24, maxWithin: 6 })]).pass).toBe(true);
  });
});

describe("similarity", () => {
  it("names a kind that changes its look", () => {
    const r = judgeSimilarity([
      kind("Service", { weight: 700 }),
      kind("Service", { weight: 700, size: 22, lab: red }),
    ]);
    expect(r.pass).toBe(false);
    expect(r.detail).toContain("“Service” changes its look");
  });
  it("names two kinds that look the same", () => {
    const r = judgeSimilarity([kind("Included"), kind("Note")]);
    expect(r.pass).toBe(false);
    expect(r.detail).toContain("“Included” and “Note” look the same");
  });
  it("passes when kinds are consistent and distinct", () => {
    expect(judgeSimilarity([kind("Included"), kind("Note", { size: 13, lab: grey })]).pass).toBe(
      true,
    );
  });
  it("counts which cues differ, with small changes ignored", () => {
    expect(differences(kind("a"), kind("b", { size: 17 }))).toEqual([]);
    expect(differences(kind("a"), kind("b", { size: 13, lab: grey, weight: 700 }))).toEqual([
      "colour",
      "size",
      "weight",
    ]);
  });
  it("gives the bonus only when every pair differs in two cues", () => {
    expect(judgeCuesAdd([kind("Included"), kind("Note", { size: 13 })]).pass).toBe(false);
    expect(judgeCuesAdd([kind("Included"), kind("Note", { size: 13, lab: grey })]).pass).toBe(true);
  });
});

describe("puzzle judge", () => {
  const groups = [
    { items: ["a", "b"], why: "" },
    { items: ["c", "d"], why: "" },
  ];
  it("finds a group only when a bin holds it and nothing else", () => {
    expect(groupFound(["a", "b"], [["b", "a"], []])).toBe(true);
    expect(groupFound(["a", "b"], [["a", "b", "c"]])).toBe(false);
  });
  it("calls a drop wrong when the bin holds another group's item", () => {
    expect(isWrongDrop("a", [], groups)).toBe(false);
    expect(isWrongDrop("a", ["b"], groups)).toBe(false);
    expect(isWrongDrop("a", ["c"], groups)).toBe(true);
  });
  it("needs every group and the principle for the core checks", () => {
    const state = {
      bins: [
        ["a", "b"],
        ["c", "d"],
      ],
      wrongDrops: 0,
      principleMisses: 0,
    };
    const unnamed = judgePuzzle(groups, { ...state, principleNamed: false });
    expect(unnamed.filter((r) => r.kind === "core" && !r.pass).map((r) => r.id)).toEqual([
      "principle",
    ]);
    const named = judgePuzzle(groups, { ...state, principleNamed: true });
    expect(named.every((r) => r.pass)).toBe(true);
  });
  it("drops the bonus checks after a wrong drop or a wrong answer", () => {
    const r = judgePuzzle(groups, {
      bins: [
        ["a", "b"],
        ["c", "d"],
      ],
      wrongDrops: 1,
      principleMisses: 2,
      principleNamed: true,
    });
    expect(r.filter((x) => x.kind === "bonus" && x.pass)).toEqual([]);
  });
});

const puzzles = LEVELS.flatMap((l) =>
  l.bosses.filter((b): b is PuzzleBoss => b.kind === "puzzle").map((b) => [b.id, b] as const),
);

describe.each(puzzles)("puzzle %s", (_, boss) => {
  const ids = boss.puzzle.items.map((i) => i.id);
  it("splits every item into exactly one group", () => {
    const grouped = boss.puzzle.groups.flatMap((g) => g.items);
    expect([...grouped].sort()).toEqual([...ids].sort());
  });
  it("marks every item on the client page", () => {
    for (const id of ids) expect(boss.html, id).toContain(`data-dq-item="${id}"`);
  });
  it("explains every wrong answer to the principle question", () => {
    const p = boss.puzzle.principle;
    expect(p.why).toHaveLength(p.options.length);
    p.why.forEach((w, i) => {
      expect(w === "", `option ${i}`).toBe(i === p.answer);
    });
  });
});

describe("gestalt badges", () => {
  const win = (stars: number, bonuses: string[] = []) => ({
    stars,
    css: "",
    rationale: "",
    seconds: 400,
    hintsUsed: 1,
    bonuses,
    at: "",
  });
  it("awards At a Glance for a gestalt win and The Whole for all three", () => {
    const s = freshSave();
    s.levels.gestalt = { ...emptyLevel(), bosses: { farmshop: win(1) } };
    expect(newlyEarned(s).map((b) => b.id)).toContain("at-a-glance");
    expect(newlyEarned(s).map((b) => b.id)).not.toContain("the-whole");
    s.levels.gestalt.bosses.timetable = win(1);
    s.levels.gestalt.bosses["cycles+"] = win(2, ["cues-add"]);
    const ids = newlyEarned(s).map((b) => b.id);
    expect(ids).toContain("the-whole");
    expect(ids).toContain("kindred");
  });
});
