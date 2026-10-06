import type { Screen } from "../router";
import { go } from "../router";
import { rankFor } from "../state/progress";
import { store } from "../state/save";
import { LOOKS, sprite } from "../ui/sprite";
import { $, el, esc } from "../util/dom";

const DEFAULT_NAME = "New hire";

export const titleScreen: Screen = (root) => {
  const s = store.get();
  const returning = s.xp > 0 || Object.keys(s.levels).length > 0;
  const needsPass = s.player.name === "";
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

  const name = esc(s.player.name || DEFAULT_NAME);
  const note = returning
    ? `<p>${name}. Your desk is where you left it: ${esc(rankFor(s.xp).rank.title)}, ${s.xp} XP.</p>
       <p>Lorem &amp; Ipsum shipped three more sites on this street while you were out.</p>`
    : `<p>Welcome in. Your first client is Rosa from Crumb &amp; Co. Her customers keep reading the wrong description under her loaves.</p>
       <p>Her site came from Lorem &amp; Ipsum, like most of the shops on this street. Read the spacing notes on your desk, then open her stylesheet. The judges measure every edit.</p>`;

  const page = el(`
    <div class="title-screen">
      <header class="title-head">
        <p class="studio-name">Kerning &amp; Co.<span>The last independent design studio on Baseline Street</span></p>
        <h1 class="wordmark" aria-label="${word}">${letters}</h1>
        <p class="title-lede">Learn why good layouts work, then fix bad ones with real CSS. Every fix is measured on the rendered page.</p>
      </header>
      <aside class="pinned-note" aria-label="Note from Ada Kern">
        ${note}
        <p class="note-sign">Ada Kern, studio lead</p>
      </aside>
      <div class="title-actions">
        <div class="title-buddy"></div>
        <button type="button" class="btn btn-primary btn-lg" data-go="start">${returning ? "Back to your desk" : "Read the spacing notes"}</button>
        <a class="text-link" href="#/profile">I have a save code</a>
      </div>
    </div>`);
  root.append(page);

  const buddyHost = $(page, ".title-buddy");
  let look = s.player.look;
  const renderBuddy = () => {
    const b = sprite({ look, size: "l" });
    buddyHost.replaceChildren(b.el);
    return b;
  };
  let buddy = renderBuddy();

  if (needsPass) {
    const pass = el(`
      <form class="staff-pass" aria-labelledby="pass-title">
        <p class="eyebrow" id="pass-title">Staff pass</p>
        <label class="pass-name"><span>Name on the door</span>
          <input name="name" maxlength="20" autocomplete="nickname" placeholder="${DEFAULT_NAME}">
        </label>
        <fieldset class="looks">
          <legend>Look</legend>
          <div class="looks-row">
            ${LOOKS.map(
              (l, n) =>
                `<button type="button" class="look" aria-pressed="${n === look}" data-look="${n}"><span class="visually-hidden">${esc(l.name)}</span></button>`,
            ).join("")}
          </div>
        </fieldset>
      </form>`);
    pass.querySelectorAll<HTMLButtonElement>(".look").forEach((b) => {
      b.prepend(sprite({ look: Number(b.dataset.look), size: "s" }).el);
      b.addEventListener("click", () => {
        look = Number(b.dataset.look);
        pass.querySelectorAll(".look").forEach((o) => {
          o.setAttribute("aria-pressed", String(o === b));
        });
        buddy = renderBuddy();
        buddy.set("cheer", 800);
      });
    });
    pass.addEventListener("submit", (e) => e.preventDefault());
    $(page, ".title-actions").before(pass);
  }

  $(page, '[data-go="start"]').addEventListener("click", () => {
    if (needsPass) {
      const typed = $<HTMLInputElement>(page, 'input[name="name"]').value.trim();
      store.update((d) => {
        d.player = { name: typed || DEFAULT_NAME, look };
      });
    }
    go(returning ? "/map" : "/level/spacing");
  });
};
