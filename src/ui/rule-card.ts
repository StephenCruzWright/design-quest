import type { RuleCard } from '../levels/types';
import { esc } from '../util/dom';

export function ruleCardHtml(r: RuleCard, levelTitle?: string): string {
  return `
    <article class="rule-card">
      ${levelTitle ? `<p class="rule-level">${esc(levelTitle)}</p>` : ''}
      <h3>${esc(r.title)}</h3>
      <p class="rule-text">${esc(r.rule)}</p>
      ${r.code ? `<code class="rule-code">${esc(r.code)}</code>` : ''}
      <p class="rule-why"><span>Why:</span> ${esc(r.why)}</p>
    </article>`;
}
