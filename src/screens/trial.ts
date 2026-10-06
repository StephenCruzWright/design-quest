import { drawQuiz } from "../engine/quiz";
import { levelById } from "../levels";
import type { Screen } from "../router";
import { improvement, quizXp } from "../state/progress";
import { commit } from "../state/rewards";
import { emptyLevel, store } from "../state/save";
import { $, el, esc } from "../util/dom";
import { notFound } from "./not-found";

const QUESTIONS = 5;
const LETTERS = ["A", "B", "C", "D"];

export const trialScreen: Screen = (root, { id }) => {
  const level = levelById(id);
  if (!level) return notFound(root);
  if (!store.level(level.id).lessonDone) {
    root.append(
      el(
        `<div class="page"><h1>Lesson first</h1><p>The trial tests what the lesson teaches.</p><a class="btn btn-primary" href="#/level/${level.id}/lesson">Start the lesson</a></div>`,
      ),
    );
    return;
  }

  const questions = drawQuiz(level.quiz, QUESTIONS);
  let index = 0;
  let correct = 0;
  let answered = false;

  const shell = el(`
    <div class="page trial">
      <a class="back" href="#/level/${level.id}">← ${esc(level.title)}</a>
      <div class="trial-meter" aria-hidden="true"></div>
      <article class="trial-card">
        <p class="eyebrow trial-count"></p>
        <h1 class="trial-prompt"></h1>
        <div class="trial-visual"></div>
        <div class="trial-options" role="group" aria-label="Answers"></div>
        <div class="trial-feedback" aria-live="polite"></div>
        <div class="trial-actions"><button class="btn btn-primary" data-act="next" hidden>Next →</button></div>
      </article>
    </div>`);
  root.append(shell);

  const meter = $<HTMLElement>(shell, ".trial-meter");
  const countEl = $<HTMLElement>(shell, ".trial-count");
  const prompt = $<HTMLElement>(shell, ".trial-prompt");
  const visual = $<HTMLElement>(shell, ".trial-visual");
  const options = $<HTMLElement>(shell, ".trial-options");
  const feedback = $<HTMLElement>(shell, ".trial-feedback");
  const nextBtn = $<HTMLButtonElement>(shell, '[data-act="next"]');

  const renderMeter = (results: boolean[]) => {
    meter.innerHTML = questions
      .map(
        (_, i) =>
          `<span data-state="${i < results.length ? (results[i] ? "right" : "wrong") : i === index ? "now" : "todo"}"></span>`,
      )
      .join("");
  };
  const results: boolean[] = [];

  const show = () => {
    const q = questions[index];
    answered = false;
    renderMeter(results);
    countEl.textContent = `Question ${index + 1} of ${questions.length}`;
    prompt.textContent = q.prompt;
    visual.innerHTML = q.visual ?? "";
    visual.hidden = !q.visual;
    options.innerHTML = q.options
      .map(
        (o, i) =>
          `<button class="option" data-i="${i}"><span class="option-key" aria-hidden="true">${LETTERS[i]}</span><span>${esc(o)}</span></button>`,
      )
      .join("");
    feedback.replaceChildren();
    nextBtn.hidden = true;
    prompt.setAttribute("tabindex", "-1");
    prompt.focus({ preventScroll: true });
  };

  const answer = (i: number) => {
    const q = questions[index];
    if (answered || i >= q.options.length) return;
    answered = true;
    const right = i === q.answer;
    if (right) correct++;
    results.push(right);
    renderMeter(results);
    options.querySelectorAll<HTMLButtonElement>(".option").forEach((b, j) => {
      b.disabled = true;
      if (j === q.answer) b.dataset.state = "right";
      else if (j === i) b.dataset.state = "wrong";
    });
    feedback.innerHTML = `<p class="verdict" data-right="${right}"><strong>${right ? "✓ Correct." : `✗ Not quite. The answer is ${LETTERS[q.answer]}.`}</strong> ${esc(q.note)}</p>`;
    nextBtn.hidden = false;
    nextBtn.textContent = index === questions.length - 1 ? "See results →" : "Next →";
    nextBtn.focus();
  };

  const finish = () => {
    const prev = store.level(level.id);
    const prevXp = prev.quizTotal ? quizXp(prev.quizBest, prev.quizTotal) : 0;
    const gain = improvement(prevXp, quizXp(correct, questions.length));
    commit(
      (s) => {
        s.levels[level.id] ??= emptyLevel();
        const lp = s.levels[level.id];
        if (correct >= lp.quizBest || lp.quizTotal === 0) {
          lp.quizBest = correct;
          lp.quizTotal = questions.length;
        }
      },
      gain,
      `Trial: ${correct}/${questions.length}`,
    );
    const perfect = correct === questions.length;
    const verdict = perfect
      ? "Flawless. Ada raises an eyebrow, which from her is a standing ovation."
      : correct >= 3
        ? "Solid. You are ready for clients."
        : "Clients are waiting anyway. Rereading the rule cards first might help.";
    shell.replaceChildren(
      el(`
      <div class="trial-done">
        <p class="eyebrow">Trial complete</p>
        <h1>${correct} / ${questions.length}</h1>
        <p class="lede">${verdict}</p>
        <div class="actions">
          <a class="btn btn-primary btn-lg" href="#/level/${level.id}">Meet the clients →</a>
          <a class="btn btn-ghost" href="#/level/${level.id}/trial" data-act="retry">Retake (new questions)</a>
        </div>
      </div>`),
    );
    // Same hash, so force a re-render for a fresh draw.
    $(shell, '[data-act="retry"]').addEventListener("click", (e) => {
      e.preventDefault();
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    $<HTMLElement>(shell, "h1").setAttribute("tabindex", "-1");
    $<HTMLElement>(shell, "h1").focus();
  };

  options.addEventListener("click", (e) => {
    const b = (e.target as Element).closest<HTMLButtonElement>(".option");
    if (b) answer(Number(b.dataset.i));
  });
  nextBtn.addEventListener("click", () => {
    index++;
    if (index < questions.length) show();
    else finish();
  });
  const onKey = (e: KeyboardEvent) => {
    const n = ["1", "2", "3", "4", "a", "b", "c", "d"].indexOf(e.key.toLowerCase());
    if (n >= 0 && !answered && root.contains(options)) answer(n % 4);
  };
  window.addEventListener("keydown", onKey);
  show();
  return () => window.removeEventListener("keydown", onKey);
};
