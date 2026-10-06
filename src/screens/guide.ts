import type { Screen } from '../router';
import { LEVELS } from '../levels';
import { store } from '../state/save';
import { ruleCardHtml } from '../ui/rule-card';
import { el, esc } from '../util/dom';

export const guideScreen: Screen = (root) => {
  const owned = new Set(store.get().rules);
  const total = LEVELS.reduce((n, l) => n + l.rules.length, 0);
  root.append(
    el(`
    <div class="page guide">
      <header class="page-head">
        <p class="eyebrow">${owned.size} of ${total} collected</p>
        <h1>Field Guide</h1>
        <p class="lede">Every rule of thumb you've earned, with the reason it works. Finish a lesson to add its cards.</p>
      </header>
      ${LEVELS.map(
        (l) => `
        <section class="guide-level">
          <h2>${l.num}. ${esc(l.title)}</h2>
          <ul class="rule-grid">
            ${l.rules
              .map((r) =>
                owned.has(`${l.id}/${r.id}`)
                  ? `<li>${ruleCardHtml(r)}</li>`
                  : `<li><article class="rule-card is-locked"><h3>Locked card</h3><p class="rule-text">Finish the ${esc(l.title)} lesson to reveal this card.</p></article></li>`,
              )
              .join('')}
          </ul>
        </section>`,
      ).join('')}
    </div>`),
  );
};
