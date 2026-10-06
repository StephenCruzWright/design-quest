import type { Screen } from "../router";
import { go } from "../router";
import { rankFor } from "../state/progress";
import { store } from "../state/save";
import { el, esc } from "../util/dom";

export const titleScreen: Screen = (root) => {
  const s = store.get();
  const returning = s.xp > 0 || Object.keys(s.levels).length > 0;
  const word = "Design Quest";
  // Each word stays on one line; the letters inside animate from bad kerning to good.
  let i = 0;
  const letters = word
    .split(" ")
    .map(
      (w) =>
        `<span class="wordmark-word">${Array.from(w)
          .map((ch) => `<span aria-hidden="true" style="--i:${i++}">${esc(ch)}</span>`)
          .join("")}</span>`,
    )
    .join(" ");

  const note = returning
    ? `<p>You're back. Your desk is where you left it: ${esc(rankFor(s.xp).rank.title)}, ${s.xp} XP.</p>
       <p>Clients don't fix themselves.</p>`
    : `<p>Welcome in. Your first client is Rosa from Crumb &amp; Co. Her customers keep reading the wrong description under her loaves.</p>
       <p>Read the spacing notes on your desk first. Then open her stylesheet and fix it. The judges will tell you when it's right.</p>`;

  root.append(
    el(`
    <div class="title-screen">
      <header class="title-head">
        <p class="studio-name">Kerning &amp; Co.<span>A small studio with strong opinions about whitespace</span></p>
        <h1 class="wordmark" aria-label="${word}">${letters}</h1>
        <p class="title-lede">Learn why good layouts work, then fix bad ones with real CSS. Every fix is measured on the rendered page.</p>
      </header>
      <aside class="pinned-note" aria-label="Note from Ada Kern">
        ${note}
        <p class="note-sign">Ada Kern, studio lead</p>
      </aside>
      <div class="title-actions">
        <button type="button" class="btn btn-primary btn-lg" data-go="start">${returning ? "Back to your desk" : "Read the spacing notes"}</button>
        <a class="text-link" href="#/profile">I have a save code</a>
      </div>
    </div>`),
  );
  root.querySelector('[data-go="start"]')?.addEventListener("click", () => {
    go(returning ? "/map" : "/level/spacing");
  });
};
