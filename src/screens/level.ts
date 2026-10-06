import { levelById } from "../levels";
import type { Screen } from "../router";
import { store } from "../state/save";
import { starsHtml } from "../ui/stars";
import { el, esc } from "../util/dom";
import { notFound } from "./not-found";

export const levelScreen: Screen = (root, { id }) => {
  const level = levelById(id);
  if (!level) return notFound(root);
  const p = store.level(level.id);
  const hard = store.get().settings.hard;
  const trialOpen = p.lessonDone;
  const clientsOpen = p.quizTotal > 0;

  const clients = level.bosses
    .map((b, i) => {
      const rec = p.bosses[hard ? `${b.id}+` : b.id];
      return `
      <li class="ticket${clientsOpen ? "" : " is-locked"}">
        <p class="ticket-no">Job ${level.num}.${i + 1}</p>
        <div class="ticket-head">
          <h3>${esc(b.client)}</h3>
          ${starsHtml(rec?.stars ?? 0)}
        </div>
        <p class="ticket-tagline">${esc(b.tagline)}</p>
        <figure class="ticket-brief">
          <blockquote>${esc(b.brief)}</blockquote>
          <figcaption>${esc(b.from)}</figcaption>
        </figure>
        ${
          clientsOpen
            ? `<a class="btn ${rec ? "btn-ghost" : "btn-primary"}" href="#/level/${level.id}/boss/${b.id}">${rec ? "Open the job again" : "Take the job"}</a>`
            : '<p class="locked-note">Pass the trial to take this job.</p>'
        }
      </li>`;
    })
    .join("");

  root.append(
    el(`
    <div class="page level">
      <a class="back" href="#/map">← All desks</a>
      <header class="page-head">
        <p class="eyebrow">Desk ${level.num}${hard ? ' · <span class="ngplus">New Game+</span>' : ""}</p>
        <h1>${esc(level.title)}</h1>
        <p class="lede">${esc(level.subtitle)}</p>
      </header>
      <figure class="ada">
        <span class="ada-avatar" aria-hidden="true">AK</span>
        <blockquote>${esc(level.intro)}</blockquote>
        <figcaption>Ada Kern, studio lead</figcaption>
      </figure>
      <ol class="steps">
        <li class="step" data-done="${p.lessonDone}">
          <span class="step-num"><span aria-hidden="true">1</span>${p.lessonDone ? '<span class="visually-hidden">Done:</span>' : ""}</span>
          <div>
            <h2>Lesson</h2>
            <p>${level.lesson.length} short pages, most with a demo you can drag around. Finishing adds ${level.rules.length} rule cards to your Field Guide.</p>
          </div>
          <a class="btn ${p.lessonDone ? "btn-ghost" : "btn-primary"}" href="#/level/${level.id}/lesson">${p.lessonDone ? "Review" : "Start lesson"}</a>
        </li>
        <li class="step" data-done="${p.quizTotal > 0}">
          <span class="step-num"><span aria-hidden="true">2</span>${p.quizTotal > 0 ? '<span class="visually-hidden">Done:</span>' : ""}</span>
          <div>
            <h2>Trial</h2>
            <p>Five questions from a pool of ${level.quiz.length}, different each time. ${p.quizTotal ? `Your best: ${p.quizBest}/${p.quizTotal}.` : ""}</p>
          </div>
          ${
            trialOpen
              ? `<a class="btn ${p.quizTotal ? "btn-ghost" : "btn-primary"}" href="#/level/${level.id}/trial">${p.quizTotal ? "Retake" : "Start trial"}</a>`
              : '<span class="locked-note">Finish the lesson first</span>'
          }
        </li>
        <li class="step step-clients">
          <span class="step-num" aria-hidden="true">3</span>
          <div>
            <h2>Clients</h2>
            <p>Each job ships once every must-pass check is green. Bonus checks add stars.</p>
          </div>
        </li>
      </ol>
      <ul class="tickets">${clients}</ul>
    </div>`),
  );
};
