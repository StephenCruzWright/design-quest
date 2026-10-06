import { shuffle } from "../engine/random";
import { levelById } from "../levels";
import type { ChoiceGate, LessonSection, LevelDef } from "../levels/types";
import type { Screen } from "../router";
import { reachedPages, XP } from "../state/progress";
import { commit } from "../state/rewards";
import { emptyLevel, store } from "../state/save";
import { shake, stamp } from "../ui/fx";
import { ruleCardHtml } from "../ui/rule-card";
import { type Sprite, sprite } from "../ui/sprite";
import { $, el, esc } from "../util/dom";
import { notFound } from "./not-found";

const LETTERS = ["A", "B", "C", "D"];

function finishLesson(level: LevelDef, root: HTMLElement) {
  const first = !store.level(level.id).lessonDone;
  if (first) {
    commit(
      (s) => {
        s.levels[level.id] ??= emptyLevel();
        const lp = s.levels[level.id];
        lp.lessonDone = true;
        lp.lessonPage = level.lesson.length;
        for (const r of level.rules) {
          const key = `${level.id}/${r.id}`;
          if (!s.rules.includes(key)) s.rules.push(key);
        }
      },
      XP.lesson,
      `Lesson complete: ${level.title}`,
    );
  }
  const page = el(`
    <div class="page lesson-done">
      <div class="lesson-done-head">
        <div>
          <p class="eyebrow">Lesson complete</p>
          <h1>${first ? "Rule cards collected" : "Your rule cards"}</h1>
          <p class="lede">${level.rules.length} cards are in your Field Guide, each with its source. The trial draws five questions from a pool of ${level.quiz.length}.</p>
        </div>
      </div>
      <ul class="rule-grid deal">${level.rules.map((r, i) => `<li style="--i:${i}">${ruleCardHtml(r)}</li>`).join("")}</ul>
      <div class="actions">
        <a class="btn btn-primary btn-lg" href="#/level/${level.id}/trial">Take the trial →</a>
        <a class="btn btn-ghost" href="#/level/${level.id}">Back to desk</a>
      </div>
    </div>`);
  const cheer = sprite({ size: "l" });
  $(page, ".lesson-done-head").prepend(cheer.el);
  root.replaceChildren(page);
  cheer.set("cheer", 900);
  root.querySelector<HTMLElement>("h1")?.focus();
}

export const lessonScreen: Screen = (root, { id }) => {
  const level = levelById(id);
  if (!level) return notFound(root);
  let index = 0;
  let cleanupDemo: undefined | (() => void);
  let keyPick: ((n: number) => void) | null = null;

  const shell = el(`
    <div class="page lesson">
      <a class="back" href="#/level/${level.id}">← ${esc(level.title)}</a>
      <nav class="lesson-progress" aria-label="Lesson pages"></nav>
      <article class="lesson-page">
        <p class="eyebrow lesson-count"></p>
        <h1 class="lesson-title"></h1>
        <div class="prose lesson-body"></div>
        <p class="goal" hidden></p>
        <div class="demo"></div>
        <section class="gate" aria-label="Checkpoint">
          <div class="gate-sprite"></div>
          <div class="gate-body"></div>
        </section>
        <p class="lesson-sources"></p>
      </article>
      <div class="lesson-nav">
        <button class="btn btn-ghost" data-act="prev">← Previous</button>
        <p class="lesson-lock" aria-live="polite"></p>
        <button class="btn btn-primary" data-act="next">Next →</button>
      </div>
    </div>`);
  root.append(shell);

  const progress = $<HTMLElement>(shell, ".lesson-progress");
  const count = $<HTMLElement>(shell, ".lesson-count");
  const title = $<HTMLElement>(shell, ".lesson-title");
  const body = $<HTMLElement>(shell, ".lesson-body");
  const goal = $<HTMLElement>(shell, ".goal");
  const demo = $<HTMLElement>(shell, ".demo");
  const gateEl = $<HTMLElement>(shell, ".gate");
  const gateBody = $<HTMLElement>(shell, ".gate-body");
  const sources = $<HTMLElement>(shell, ".lesson-sources");
  const lock = $<HTMLElement>(shell, ".lesson-lock");
  const prev = $<HTMLButtonElement>(shell, '[data-act="prev"]');
  const next = $<HTMLButtonElement>(shell, '[data-act="next"]');
  const buddy: Sprite = sprite();
  $(shell, ".gate-sprite").append(buddy.el);

  const reached = () => {
    const lp = store.level(level.id);
    return reachedPages(level.lesson.length, lp.lessonDone, lp.lessonPage);
  };
  const passed = (i: number) => i < reached();

  const renderDots = () => {
    const open = reached();
    progress.innerHTML = level.lesson
      .map((s, j) => {
        const state = j < open ? "passed" : j === open ? "open" : "locked";
        const note = state === "passed" ? ", passed" : state === "locked" ? ", locked" : "";
        return `<button class="dot" data-state="${state}" ${j === index ? 'aria-current="step"' : ""} ${state === "locked" ? "disabled" : ""} data-i="${j}" aria-label="Page ${j + 1}: ${esc(s.title)}${note}"></button>`;
      })
      .join("");
  };

  const syncNav = () => {
    const ok = passed(index);
    next.disabled = !ok;
    next.textContent = index === level.lesson.length - 1 ? "Collect rule cards →" : "Next →";
    lock.textContent = ok ? "" : "Pass the checkpoint to open the next page.";
    renderDots();
  };

  const pass = (sec: LessonSection) => {
    if (!passed(index)) {
      const page = index + 1;
      store.update((s) => {
        s.levels[level.id] ??= emptyLevel();
        const lp = s.levels[level.id];
        lp.lessonPage = Math.max(lp.lessonPage, page);
      });
    }
    gateEl.dataset.state = "passed";
    gateBody.querySelector(".gate-note")?.removeAttribute("hidden");
    if (sec.gate.kind === "goal") goal.dataset.done = "true";
    stamp(gateEl, "✓ Passed", "good");
    buddy.set("cheer", 1100);
    syncNav();
  };

  const renderChoice = (sec: LessonSection, gate: ChoiceGate) => {
    const order = shuffle(gate.options.map((_, i) => i));
    const already = passed(index);
    gateBody.innerHTML = `
      <p class="eyebrow">Checkpoint</p>
      <h2 class="gate-prompt">${esc(gate.prompt)}</h2>
      <div class="gate-options" role="group" aria-label="Answers">
        ${order
          .map((o, k) => {
            const state = already
              ? ` disabled${o === gate.answer ? ' data-state="right"' : ""}`
              : "";
            return `<button class="option" data-o="${o}"${state}><span class="option-key" aria-hidden="true">${LETTERS[k]}</span><span>${esc(gate.options[o])}</span></button>`;
          })
          .join("")}
      </div>
      <p class="gate-why" aria-live="polite"></p>
      <p class="gate-note"${already ? "" : " hidden"}><strong>Why:</strong> ${esc(gate.note)}</p>`;
    const why = $<HTMLElement>(gateBody, ".gate-why");
    const pick = (button: HTMLButtonElement) => {
      if (button.disabled || gateEl.dataset.state === "passed") return;
      const o = Number(button.dataset.o);
      if (o === gate.answer) {
        button.dataset.state = "right";
        why.textContent = "";
        for (const b of gateBody.querySelectorAll<HTMLButtonElement>(".option")) b.disabled = true;
        pass(sec);
      } else {
        button.dataset.state = "wrong";
        button.disabled = true;
        why.textContent = gate.why[o] ?? "";
        shake(button);
        buddy.set("wince", 900);
      }
    };
    gateBody.querySelectorAll<HTMLButtonElement>(".option").forEach((b) => {
      b.addEventListener("click", () => pick(b));
    });
    return (n: number) => {
      const b = gateBody.querySelectorAll<HTMLButtonElement>(".option")[n];
      if (b) pick(b);
    };
  };

  const show = (i: number) => {
    if (cleanupDemo) cleanupDemo();
    index = i;
    const sec = level.lesson[i];
    count.textContent = `Page ${i + 1} of ${level.lesson.length}`;
    title.textContent = sec.title;
    body.innerHTML = sec.body;
    gateEl.dataset.state = passed(i) ? "passed" : "open";
    gateEl.querySelector(":scope > .stamp")?.remove();
    buddy.rest("idle");
    keyPick = null;
    goal.hidden = sec.gate.kind !== "goal";
    delete goal.dataset.done;
    if (sec.gate.kind === "goal") {
      goal.innerHTML = `<span class="goal-label">Goal</span> ${esc(sec.gate.goal)}`;
      if (passed(i)) goal.dataset.done = "true";
      gateBody.innerHTML = `
        <p class="eyebrow">Checkpoint</p>
        <h2 class="gate-prompt">${esc(sec.gate.goal)}</h2>
        <p class="gate-note"${passed(i) ? "" : " hidden"}><strong>Why it works:</strong> ${esc(sec.gate.note)}</p>`;
    } else {
      keyPick = renderChoice(sec, sec.gate);
    }
    sources.innerHTML = sec.sources.length
      ? `<span>Sources:</span> ${sec.sources.map(esc).join("; ")}`
      : "";
    demo.replaceChildren();
    demo.hidden = !sec.demo;
    cleanupDemo =
      sec.demo?.(demo, {
        complete: () => {
          if (index === i && sec.gate.kind === "goal" && gateEl.dataset.state !== "passed")
            pass(sec);
        },
      }) || undefined;
    prev.disabled = i === 0;
    syncNav();
    title.setAttribute("tabindex", "-1");
    title.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  };

  progress.addEventListener("click", (e) => {
    const b = (e.target as Element).closest<HTMLButtonElement>(".dot");
    if (b && !b.disabled) show(Number(b.dataset.i));
  });
  prev.addEventListener("click", () => index > 0 && show(index - 1));
  next.addEventListener("click", () => {
    if (!passed(index)) return;
    if (index < level.lesson.length - 1) show(index + 1);
    else {
      if (cleanupDemo) cleanupDemo();
      finishLesson(level, root);
    }
  });
  const onKey = (e: KeyboardEvent) => {
    if ((e.target as Element).closest("input, textarea, [contenteditable]")) return;
    if (e.key === "ArrowRight" && root.contains(next) && !next.disabled) next.click();
    if (e.key === "ArrowLeft" && root.contains(prev) && !prev.disabled) prev.click();
    const n = ["1", "2", "3", "4"].indexOf(e.key);
    if (n >= 0 && keyPick && root.contains(gateEl)) keyPick(n);
  };
  window.addEventListener("keydown", onKey);
  // Resume at the first page whose gate is still open.
  show(Math.min(reached(), level.lesson.length - 1));

  return () => {
    window.removeEventListener("keydown", onKey);
    if (cleanupDemo) cleanupDemo();
  };
};
