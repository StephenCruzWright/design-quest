import { describe, expect, it } from "vitest";
import { LEVELS } from "../../src/levels";
import { newlyEarned } from "../../src/state/badges";
import { reachedPages } from "../../src/state/progress";
import { emptyLevel, freshSave, normalise } from "../../src/state/save";

describe.each(LEVELS.map((l) => [l.id, l] as const))("level %s content", (_, level) => {
  it("gates every lesson page, with a reason for each wrong option", () => {
    for (const page of level.lesson) {
      const g = page.gate;
      if (g.kind === "choice") {
        expect(g.answer, page.id).toBeLessThan(g.options.length);
        expect(g.why, page.id).toHaveLength(g.options.length);
        g.why.forEach((w, i) => {
          if (i === g.answer) expect(w, page.id).toBe("");
          else expect(w.length, `${page.id} option ${i}`).toBeGreaterThan(0);
        });
      } else {
        expect(page.demo, `${page.id} has a goal but no demo to reach it in`).toBeTypeOf(
          "function",
        );
      }
    }
  });
  it("gives every rule card a source", () => {
    for (const r of level.rules) expect(r.source.length, r.id).toBeGreaterThan(0);
  });
  it("has a pool of twelve with valid answers", () => {
    expect(level.quiz).toHaveLength(12);
    for (const q of level.quiz) expect(q.answer, q.id).toBeLessThan(q.options.length);
  });
  it("has three clients with three hints each", () => {
    expect(level.bosses).toHaveLength(3);
    for (const b of level.bosses) expect(b.hints, b.id).toHaveLength(3);
  });
  it("keeps player-facing copy free of em dashes", () => {
    expect(JSON.stringify({ ...level, judge: null })).not.toContain("—");
  });
});

describe("lesson progress", () => {
  it("opens pages up to the first unpassed gate", () => {
    expect(reachedPages(6, false, 0)).toBe(0);
    expect(reachedPages(6, false, 3)).toBe(3);
    expect(reachedPages(6, false, 99)).toBe(6);
  });
  it("opens every page of a finished lesson, including older saves", () => {
    expect(reachedPages(6, true, 0)).toBe(6);
  });
  it("fills lessonPage and the player in saves from before gates", () => {
    const n = normalise({
      v: 1,
      xp: 0,
      levels: { spacing: { lessonDone: true, quizBest: 0, quizTotal: 0, bosses: {} } },
    });
    expect(n.levels.spacing.lessonPage).toBe(0);
    expect(n.player).toEqual({ name: "", look: 0 });
  });
  it("repairs a corrupt lessonPage", () => {
    const n = normalise({ v: 1, levels: { spacing: { ...emptyLevel(), lessonPage: "x" } } });
    expect(n.levels.spacing.lessonPage).toBe(0);
  });
});

describe("hierarchy badges", () => {
  const win = (stars: number, bonuses: string[] = []) => ({
    stars,
    css: "",
    rationale: "",
    seconds: 400,
    hintsUsed: 1,
    bonuses,
    at: "",
  });
  it("awards One Voice for a hierarchy win and House Style for all three", () => {
    const s = freshSave();
    s.levels.hierarchy = { ...emptyLevel(), bosses: { swim: win(1) } };
    expect(newlyEarned(s).map((b) => b.id)).toContain("one-voice");
    expect(newlyEarned(s).map((b) => b.id)).not.toContain("house-style");
    s.levels.hierarchy.bosses.records = win(1);
    s.levels.hierarchy.bosses["theatre+"] = win(2, ["fluid"]);
    const ids = newlyEarned(s).map((b) => b.id);
    expect(ids).toContain("house-style");
    expect(ids).toContain("fluent");
  });
});

describe("colour badges", () => {
  const win = (stars: number, bonuses: string[] = []) => ({
    stars,
    css: "",
    rationale: "",
    seconds: 400,
    hintsUsed: 1,
    bonuses,
    at: "",
  });
  it("awards Clear Signal for a colour win and Full Spectrum for all three", () => {
    const s = freshSave();
    s.levels.color = { ...emptyLevel(), bosses: { dental: win(1) } };
    expect(newlyEarned(s).map((b) => b.id)).toContain("clear-signal");
    expect(newlyEarned(s).map((b) => b.id)).not.toContain("full-spectrum");
    s.levels.color.bosses.library = win(1);
    s.levels.color.bosses["pottery+"] = win(2, ["oklch"]);
    const ids = newlyEarned(s).map((b) => b.id);
    expect(ids).toContain("full-spectrum");
    expect(ids).toContain("perceptual");
  });
});

describe("typography badges", () => {
  const win = (stars: number, bonuses: string[] = []) => ({
    stars,
    css: "",
    rationale: "",
    seconds: 400,
    hintsUsed: 1,
    bonuses,
    at: "",
  });
  it("awards Good Measure for a typography win and Typesetter for all three", () => {
    const s = freshSave();
    s.levels.typography = { ...emptyLevel(), bosses: { gazette: win(1) } };
    expect(newlyEarned(s).map((b) => b.id)).toContain("good-measure");
    expect(newlyEarned(s).map((b) => b.id)).not.toContain("typesetter");
    s.levels.typography.bosses.kitchen = win(1);
    s.levels.typography.bosses["guesthouse+"] = win(2, ["measure-ch"]);
    const ids = newlyEarned(s).map((b) => b.id);
    expect(ids).toContain("typesetter");
    expect(ids).toContain("in-character");
  });
});
