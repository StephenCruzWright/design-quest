import { rankFor } from "../state/progress";
import { store } from "../state/save";
import { el } from "../util/dom";

export function mountHud(host: HTMLElement): void {
  const node = el(`
    <header class="hud">
      <a class="hud-logo" href="#/map" aria-label="Design Quest: back to the studio map">
        <span class="logo-mark" aria-hidden="true">Dq</span><span class="logo-word">Design Quest</span>
      </a>
      <nav class="hud-nav" aria-label="Main">
        <a href="#/map">Map</a>
        <a href="#/guide">Field Guide</a>
        <a href="#/profile">Profile</a>
      </nav>
      <div class="hud-rank">
        <span class="hud-rank-title"></span>
        <div class="xpbar" role="progressbar" aria-valuemin="0" aria-valuemax="100"><span></span></div>
        <span class="hud-xp"></span>
      </div>
    </header>`);
  host.append(node);
  const title = node.querySelector<HTMLElement>(".hud-rank-title")!;
  const bar = node.querySelector<HTMLElement>(".xpbar")!;
  const fill = bar.querySelector<HTMLElement>("span")!;
  const xp = node.querySelector<HTMLElement>(".hud-xp")!;
  const render = () => {
    const s = store.get();
    const { rank, next, progress } = rankFor(s.xp);
    title.textContent = rank.title;
    fill.style.inlineSize = `${Math.round(progress * 100)}%`;
    bar.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
    bar.setAttribute(
      "aria-label",
      next ? `${s.xp} XP, ${next.min - s.xp} to ${next.title}` : `${s.xp} XP, top rank`,
    );
    xp.textContent = `${s.xp} XP`;
  };
  const markActive = () => {
    const path = location.hash.replace(/^#/, "");
    node.querySelectorAll<HTMLAnchorElement>(".hud-nav a").forEach((a) => {
      const target = a.getAttribute("href")!.slice(1);
      if (path.startsWith(target)) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  };
  store.subscribe(render);
  window.addEventListener("hashchange", markActive);
  render();
  markActive();
}
