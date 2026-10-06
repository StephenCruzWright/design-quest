import type { Screen } from "../router";
import { go } from "../router";
import { rankFor } from "../state/progress";
import { store } from "../state/save";
import { el, esc } from "../util/dom";

export const titleScreen: Screen = (root) => {
  const s = store.get();
  const returning = s.xp > 0 || Object.keys(s.levels).length > 0;
  const word = "Design Quest";
  root.append(
    el(`
    <div class="title-screen">
      <div class="title-card">
        <p class="eyebrow">Kerning &amp; Co. presents</p>
        <h1 class="wordmark" aria-label="${word}">
          ${Array.from(word)
            .map(
              (ch, i) =>
                `<span aria-hidden="true" style="--i:${i}">${ch === " " ? "&nbsp;" : esc(ch)}</span>`,
            )
            .join("")}
        </h1>
        <p class="title-lede">A design-theory adventure. Learn the rules behind good web design, then prove it by fixing broken client sites with real CSS while the judges measure your work.</p>
        <div class="title-actions">
          <button class="btn btn-primary btn-lg" data-go="start">${returning ? "Back to the studio" : "Start your first day"}</button>
          ${returning ? `<p class="title-meta">${esc(rankFor(s.xp).rank.title)} · ${s.xp} XP</p>` : ""}
          <a class="btn btn-ghost" href="#/profile">Load a save code</a>
        </div>
      </div>
      <ul class="title-pillars" aria-label="What you'll do">
        <li><strong>Learn</strong> the principle and the perception behind it</li>
        <li><strong>Prove</strong> it in judgment trials</li>
        <li><strong>Fix</strong> real pages, measured live</li>
        <li><strong>Ship</strong> a case study of your redesigns</li>
      </ul>
    </div>`),
  );
  root.querySelector('[data-go="start"]')!.addEventListener("click", () => {
    go(returning ? "/map" : "/level/spacing");
  });
};
