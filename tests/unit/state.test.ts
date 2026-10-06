import { describe, expect, it } from "vitest";
import { drawQuiz } from "../../src/engine/quiz";
import { rng } from "../../src/engine/random";
import { spacingLevel } from "../../src/levels/01-spacing";
import { BADGES, newlyEarned } from "../../src/state/badges";
import { bossXp, improvement, quizXp, rankFor } from "../../src/state/progress";
import { decodeSave, encodeSave, freshSave, normalise } from "../../src/state/save";

describe("save codes", () => {
  it("round-trips, including non-ASCII text", () => {
    const s = freshSave();
    s.xp = 420;
    s.drafts["spacing/bakery"] = "/* Crème brûlée, “quotes”, naïve café */ .a { gap: 8px }";
    const back = decodeSave(encodeSave(s));
    expect(back.xp).toBe(420);
    expect(back.drafts["spacing/bakery"]).toBe(s.drafts["spacing/bakery"]);
  });
  it("rejects garbage with a readable message", () => {
    expect(() => decodeSave("hello")).toThrow(/save code/);
  });
  it("fills in missing fields from older saves", () => {
    const n = normalise({ v: 1, xp: 10 });
    expect(n.settings.theme).toBe("auto");
    expect(n.levels).toEqual({});
  });
});

describe("xp and ranks", () => {
  it("only pays out improvements", () => {
    expect(improvement(bossXp(2, false), bossXp(3, false))).toBe(80);
    expect(improvement(bossXp(3, false), bossXp(1, false))).toBe(0);
  });
  it("pays more in New Game+", () => {
    expect(bossXp(1, true)).toBeGreaterThan(bossXp(1, false));
  });
  it("adds a perfect-quiz bonus", () => {
    expect(quizXp(5, 5)).toBe(130);
    expect(quizXp(4, 5)).toBe(80);
  });
  it("maps XP to ranks", () => {
    expect(rankFor(0).rank.title).toBe("Intern");
    expect(rankFor(300).rank.title).toBe("Junior Designer");
    expect(rankFor(99999).next).toBeNull();
  });
});

describe("badges", () => {
  it("awards Ratio Wrangler for a spacing win, once", () => {
    const s = freshSave();
    s.levels.spacing = {
      lessonDone: true,
      lessonPage: 6,
      quizBest: 3,
      quizTotal: 5,
      bosses: {
        bakery: {
          stars: 1,
          css: "",
          rationale: "",
          seconds: 500,
          hintsUsed: 1,
          bonuses: [],
          at: "",
        },
      },
    };
    const ids = newlyEarned(s).map((b) => b.id);
    expect(ids).toContain("ratio-wrangler");
    expect(ids).toContain("first-day");
    expect(ids).not.toContain("unassisted");
    for (const id of ids) s.badges[id] = "now";
    expect(newlyEarned(s)).toEqual([]);
  });
  it("has unique ids", () => {
    expect(new Set(BADGES.map((b) => b.id)).size).toBe(BADGES.length);
  });
});

describe("quiz", () => {
  it("draws distinct questions and keeps the right answer after shuffling options", () => {
    const drawn = drawQuiz(spacingLevel.quiz, 5, rng(7));
    expect(drawn).toHaveLength(5);
    expect(new Set(drawn.map((q) => q.id)).size).toBe(5);
    for (const q of drawn) {
      const original = spacingLevel.quiz.find((o) => o.id === q.id);
      if (!original) throw new Error(`Drawn question ${q.id} is not in the pool`);
      expect(q.options[q.answer]).toBe(original.options[original.answer]);
    }
  });
  it("every question in the pool is well formed", () => {
    for (const q of spacingLevel.quiz) {
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(q.options.length);
      expect(q.note.length).toBeGreaterThan(10);
    }
  });
});
