import { levelById } from "../levels";
import type { LevelDef } from "../levels/types";
import type { Screen } from "../router";
import { XP } from "../state/progress";
import { commit } from "../state/rewards";
import { emptyLevel, store } from "../state/save";
import { ruleCardHtml } from "../ui/rule-card";
import { el, esc } from "../util/dom";
import { notFound } from "./not-found";

function finishLesson(level: LevelDef, root: HTMLElement) {
  const first = !store.level(level.id).lessonDone;
  if (first) {
    commit(
      (s) => {
        s.levels[level.id] ??= emptyLevel();
        const lp = s.levels[level.id];
        lp.lessonDone = true;
        for (const r of level.rules) {
          const key = `${level.id}/${r.id}`;
          if (!s.rules.includes(key)) s.rules.push(key);
        }
      },
      XP.lesson,
      `Lesson complete: ${level.title}`,
    );
  }
  root.replaceChildren(
    el(`
    <div class="page lesson-done">
      <p class="eyebrow">Lesson complete</p>
      <h1>${first ? "Rule cards collected" : "Your rule cards"}</h1>
      <p class="lede">These go in your Field Guide. Each one is a rule of thumb you can apply on Monday morning.</p>
      <ul class="rule-grid deal">${level.rules.map((r, i) => `<li style="--i:${i}">${ruleCardHtml(r)}</li>`).join("")}</ul>
      <div class="actions">
        <a class="btn btn-primary btn-lg" href="#/level/${level.id}/trial">Take the trial →</a>
        <a class="btn btn-ghost" href="#/level/${level.id}">Back to desk</a>
      </div>
    </div>`),
  );
  root.querySelector<HTMLElement>("h1")?.focus();
}

export const lessonScreen: Screen = (root, { id }) => {
  const level = levelById(id);
  if (!level) return notFound(root);
  let index = 0;
  let cleanupDemo: undefined | (() => void);

  const shell = el(`
    <div class="page lesson">
      <a class="back" href="#/level/${level.id}">← ${esc(level.title)}</a>
      <nav class="lesson-progress" aria-label="Lesson pages"></nav>
      <article class="lesson-page">
        <p class="eyebrow lesson-count"></p>
        <h1 class="lesson-title"></h1>
        <div class="prose lesson-body"></div>
        <div class="demo"></div>
      </article>
      <div class="lesson-nav">
        <button class="btn btn-ghost" data-act="prev">← Previous</button>
        <button class="btn btn-primary" data-act="next">Next →</button>
      </div>
    </div>`);
  root.append(shell);

  const progress = shell.querySelector<HTMLElement>(".lesson-progress")!;
  const count = shell.querySelector<HTMLElement>(".lesson-count")!;
  const title = shell.querySelector<HTMLElement>(".lesson-title")!;
  const body = shell.querySelector<HTMLElement>(".lesson-body")!;
  const demo = shell.querySelector<HTMLElement>(".demo")!;
  const prev = shell.querySelector<HTMLButtonElement>('[data-act="prev"]')!;
  const next = shell.querySelector<HTMLButtonElement>('[data-act="next"]')!;

  const show = (i: number) => {
    if (cleanupDemo) cleanupDemo();
    index = i;
    const sec = level.lesson[i];
    progress.innerHTML = level.lesson
      .map(
        (s, j) =>
          `<button class="dot" ${j === i ? 'aria-current="step"' : ""} data-i="${j}" aria-label="Page ${j + 1}: ${esc(s.title)}"></button>`,
      )
      .join("");
    count.textContent = `Page ${i + 1} of ${level.lesson.length}`;
    title.textContent = sec.title;
    body.innerHTML = sec.body;
    demo.replaceChildren();
    demo.hidden = !sec.demo;
    cleanupDemo = sec.demo?.(demo) || undefined;
    prev.disabled = i === 0;
    next.textContent = i === level.lesson.length - 1 ? "Collect rule cards →" : "Next →";
    title.setAttribute("tabindex", "-1");
    title.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  };

  progress.addEventListener("click", (e) => {
    const b = (e.target as Element).closest<HTMLButtonElement>(".dot");
    if (b) show(Number(b.dataset.i));
  });
  prev.addEventListener("click", () => index > 0 && show(index - 1));
  next.addEventListener("click", () => {
    if (index < level.lesson.length - 1) show(index + 1);
    else {
      if (cleanupDemo) cleanupDemo();
      finishLesson(level, root);
    }
  });
  const onKey = (e: KeyboardEvent) => {
    if ((e.target as Element).closest("input, textarea, [contenteditable]")) return;
    if (e.key === "ArrowRight" && root.contains(next)) next.click();
    if (e.key === "ArrowLeft" && root.contains(prev) && !prev.disabled) prev.click();
  };
  window.addEventListener("keydown", onKey);
  show(0);

  return () => {
    window.removeEventListener("keydown", onKey);
    if (cleanupDemo) cleanupDemo();
  };
};
