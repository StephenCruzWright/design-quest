import type { Screen } from '../router';
import { LEVELS, UPCOMING } from '../levels';
import type { LevelDef } from '../levels/types';
import { store } from '../state/save';
import { rankFor } from '../state/progress';
import { BADGES } from '../state/badges';
import { starsHtml } from '../ui/stars';
import { el, esc } from '../util/dom';

function levelCard(level: LevelDef): string {
  const p = store.level(level.id);
  const hard = store.get().settings.hard;
  const bossStars = level.bosses.map((b) => p.bosses[hard ? `${b.id}+` : b.id]?.stars ?? 0);
  const totalStars = bossStars.reduce((a, b) => a + b, 0);
  const status = !p.lessonDone ? 'New' : bossStars.every((s) => s > 0) ? 'Complete' : 'In progress';
  return `
    <li class="map-node" data-status="${status.toLowerCase().replace(' ', '-')}">
      <span class="map-num" aria-hidden="true">${level.num}</span>
      <a class="map-card" href="#/level/${level.id}">
        <span class="map-tag">${status}</span>
        <h2>${esc(level.title)}</h2>
        <p>${esc(level.subtitle)}</p>
        <dl class="map-stats">
          <div><dt>Lesson</dt><dd>${p.lessonDone ? 'Done' : 'Not started'}</dd></div>
          <div><dt>Trial</dt><dd>${p.quizTotal ? `${p.quizBest}/${p.quizTotal}` : '–'}</dd></div>
          <div><dt>Clients</dt><dd>${starsHtml(totalStars, level.bosses.length * 3)}</dd></div>
        </dl>
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
        <p class="eyebrow">The studio floor${s.settings.hard ? ' · <span class="ngplus">New Game+</span>' : ''}</p>
        <h1>Your desk at Kerning &amp; Co.</h1>
        <p class="lede">Each desk is one principle: a lesson, a trial, then three clients who need your help. Work through them in order, or replay any client for more stars.</p>
      </header>
      <section class="map-summary" aria-label="Your progress">
        <div><span class="big">${esc(rank.title)}</span><span>${next ? `${next.min - s.xp} XP to ${esc(next.title)}` : 'Top of the masthead'}</span></div>
        <div><span class="big">${s.xp}</span><span>XP earned</span></div>
        <div><span class="big">${earned}/${BADGES.length}</span><span>badges</span></div>
        <div><span class="big">${s.rules.length}</span><span>rule cards</span></div>
      </section>
      <ol class="map-path">
        ${LEVELS.map(levelCard).join('')}
        ${UPCOMING.map(
          (l) => `
          <li class="map-node is-locked">
            <span class="map-num" aria-hidden="true">${l.num}</span>
            <div class="map-card">
              <span class="map-tag">In production</span>
              <h2>${esc(l.title)}</h2>
              <p>${esc(l.subtitle)}</p>
            </div>
          </li>`,
        ).join('')}
      </ol>
    </div>`),
  );
};
