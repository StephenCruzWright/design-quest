import { LEVELS, UPCOMING } from "../levels";
import type { LevelDef } from "../levels/types";
import type { Screen } from "../router";
import { BADGES } from "../state/badges";
import { rankFor } from "../state/progress";
import { store } from "../state/save";
import { mark } from "../ui/marks";
import { el, esc } from "../util/dom";

const pad = (n: number) => String(n).padStart(2, "0");

function deskRow(level: LevelDef): string {
  const p = store.level(level.id);
  const hard = store.get().settings.hard;
  const bossStars = level.bosses.map((b) => p.bosses[hard ? `${b.id}+` : b.id]?.stars ?? 0);
  const totalStars = bossStars.reduce((a, b) => a + b, 0);
  const status = !p.lessonDone
    ? "Not started"
    : bossStars.every((s) => s > 0)
      ? "All clients shipped"
      : p.quizTotal
        ? `Trial ${p.quizBest}/${p.quizTotal}`
        : "Lesson read";
  return `
    <li class="desk" data-done="${bossStars.every((s) => s > 0)}">
      <a class="desk-link" href="#/level/${level.id}">
        <span class="desk-num" aria-hidden="true">${pad(level.num)}</span>
        <span class="desk-text">
          <span class="desk-title">${esc(level.title)}</span>
          <span class="desk-sub">${esc(level.subtitle)}</span>
        </span>
        <span class="desk-meta">
          <span>${status}</span>
          <span class="desk-stars">${mark("star")}${totalStars} of ${level.bosses.length * 3} stars</span>
        </span>
      </a>
    </li>`;
}

export const mapScreen: Screen = (root) => {
  const s = store.get();
  const { rank, next } = rankFor(s.xp);
  const earned = BADGES.filter((b) => s.badges[b.id]).length;
  root.append(
    el(`
    <div class="page map">
      <header class="page-head">
        <p class="eyebrow">Studio floor${s.settings.hard ? ' · <span class="ngplus">New Game+</span>' : ""}</p>
        <h1>Desks</h1>
        <p class="lede">One principle per desk. Read the notes, pass the trial, then take the clients. Any client can be replayed for more stars.</p>
      </header>
      <dl class="ledger" aria-label="Your progress">
        <div><dt>Rank</dt><dd>${esc(rank.title)}</dd><dd class="ledger-note">${next ? `${next.min - s.xp} XP to ${esc(next.title)}` : "Top of the masthead"}</dd></div>
        <div><dt>XP</dt><dd>${s.xp}</dd></div>
        <div><dt>Badges</dt><dd>${earned} of ${BADGES.length}</dd></div>
        <div><dt>Rule cards</dt><dd>${s.rules.length}</dd></div>
      </dl>
      <ol class="desk-list">
        ${LEVELS.map(deskRow).join("")}
        ${UPCOMING.map(
          (l) => `
          <li class="desk is-locked">
            <div class="desk-link">
              <span class="desk-num" aria-hidden="true">${pad(l.num)}</span>
              <span class="desk-text">
                <span class="desk-title">${esc(l.title)}</span>
                <span class="desk-sub">${esc(l.subtitle)}</span>
              </span>
              <span class="desk-meta">${mark("lock")}<span>Being built</span></span>
            </div>
          </li>`,
        ).join("")}
      </ol>
    </div>`),
  );
};
