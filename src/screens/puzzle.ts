import { groupFound, isWrongDrop, judgePuzzle, type PuzzleState } from "../engine/judges/puzzle";
import { SANDBOX_WIDTH, Sandbox } from "../engine/sandbox";
import { type CheckResult, starsFor } from "../engine/types";
import type { LevelDef, PuzzleBoss } from "../levels/types";
import { store } from "../state/save";
import { battle } from "../ui/battle";
import { foeFor } from "../ui/foes";
import { shake, stamp } from "../ui/fx";
import { renderJudgePanel } from "../ui/judge-panel";
import { starsHtml } from "../ui/stars";
import { $, el, esc, formatTime } from "../util/dom";
import { shipJob } from "./boss";

/**
 * A puzzle client: the page is read-only. The player sorts its items into the
 * groups a visitor sees, then names the principle at work. Each group found is
 * a hit on the foe; a drop beside the wrong kind, or a wrong answer, lets the
 * foe strike back.
 */
export function puzzleScreen(root: HTMLElement, level: LevelDef, boss: PuzzleBoss) {
  const { puzzle } = boss;
  const hard = store.get().settings.hard;
  const labelOf = new Map(puzzle.items.map((i) => [i.id, i.label]));
  const placement = new Map(puzzle.items.map((i) => [i.id, -1]));
  const state: PuzzleState = {
    bins: [],
    wrongDrops: 0,
    principleMisses: 0,
    principleNamed: false,
  };
  let results: CheckResult[] = [];
  let selected: string | null = null;
  let seconds = 0;
  let hintsUsed = 0;
  let disposed = false;
  let lastFailing = -1;
  let sandbox: Sandbox | null = null;
  const previous = new Map<string, boolean>();

  const bin = (i: number, title: string) => `
    <div class="sort-bin" data-bin="${i}">
      <div class="sort-bin-head">
        <h3>${title}</h3>
        <button class="btn btn-ghost btn-s bin-put" data-put="${i}" hidden>Move here</button>
      </div>
      <div class="bin-cards"></div>
    </div>`;

  const shell = el(`
    <div class="boss puzzle">
      <header class="boss-bar">
        <a class="back" href="#/level/${level.id}">← Desk</a>
        <div class="boss-title">
          <h1>${esc(boss.client)}</h1>
          <p>${esc(boss.tagline)}${hard ? ' · <span class="ngplus">New Game+</span>' : ""}</p>
        </div>
        <div class="problems" aria-live="polite">
          <span class="problems-label">Client problems</span>
          <span class="problems-bar" aria-hidden="true"></span>
          <span class="problems-count"></span>
        </div>
        <span class="boss-timer" aria-label="Time on this job">0:00</span>
        <span class="boss-stars"></span>
        <button class="btn btn-primary" data-act="submit" disabled>Hand in</button>
      </header>
      <div class="boss-grid">
        <section class="boss-brief" aria-label="Client brief">
          <figure class="ticket-brief"><blockquote>${esc(boss.brief)}</blockquote><figcaption>${esc(boss.from)}</figcaption></figure>
          <ol class="hints" aria-live="polite"></ol>
          <button class="btn btn-ghost btn-s" data-act="hint">Hint (${boss.hints.length} left)</button>
        </section>
        <section class="boss-board" aria-label="Sorting board" data-picking="false">
          <p class="board-task">${esc(puzzle.task)}</p>
          <p class="board-help">Pick a card, then pick the group to move it to. You can also drag cards.</p>
          ${bin(-1, "Unsorted")}
          <div class="sort-bins">${puzzle.groups.map((_, i) => bin(i, `Group ${i + 1}`)).join("")}</div>
          <div class="board-principle" hidden>
            <h3>${esc(puzzle.principle.prompt)}</h3>
            <div class="board-options" role="group" aria-label="Principle">
              ${puzzle.principle.options.map((o, i) => `<button class="option" data-i="${i}"><span>${esc(o)}</span></button>`).join("")}
            </div>
            <p class="board-why" aria-live="polite"></p>
          </div>
        </section>
        <section class="boss-preview" aria-label="Preview">
          <div class="preview-bar">
            <span class="preview-note">The client's page, as visitors see it · ${SANDBOX_WIDTH}px wide</span>
          </div>
          <div class="preview-host"></div>
        </section>
        <section class="boss-judges" aria-label="Judges">
          <h2 class="visually-hidden">Judges</h2>
          <div class="boss-arena"></div>
          <div class="judge-panel" aria-live="polite"></div>
        </section>
      </div>
    </div>`);
  root.append(shell);

  const q = <T extends HTMLElement>(sel: string) => $<T>(shell, sel);
  const board = q(".boss-board");
  const submitBtn = q<HTMLButtonElement>('[data-act="submit"]');
  const principleEl = q(".board-principle");
  const why = q(".board-why");
  const binEl = (i: number) => q(`.sort-bin[data-bin="${i}"]`);
  const arena = battle({
    foe: foeFor(level.id),
    client: {
      variant: level.bosses.indexOf(boss) + level.num,
      from: boss.from,
      thanks: boss.thanks,
    },
  });
  q(".boss-arena").append(arena.el);

  const cards = new Map(
    puzzle.items.map((item) => [
      item.id,
      el(
        `<button class="sort-card" draggable="true" data-item="${item.id}" aria-pressed="false">${esc(item.label)}</button>`,
      ),
    ]),
  );
  for (const card of cards.values()) $(binEl(-1), ".bin-cards").append(card);

  /** Outline the item on the client's page, so the card and the page connect. */
  let lit: HTMLElement | null = null;
  const light = (id: string | null) => {
    if (lit) lit.style.removeProperty("outline");
    lit = id && sandbox ? sandbox.doc.querySelector<HTMLElement>(`[data-dq-item="${id}"]`) : null;
    lit?.style.setProperty("outline", "3px solid #2563eb");
  };

  const select = (id: string | null) => {
    selected = id;
    for (const [cid, card] of cards) card.setAttribute("aria-pressed", String(cid === id));
    board.dataset.picking = String(id !== null);
    for (const b of shell.querySelectorAll<HTMLButtonElement>(".bin-put")) b.hidden = id === null;
    light(id);
  };

  const binsNow = () =>
    puzzle.groups.map((_, i) => [...placement].filter(([, b]) => b === i).map(([id]) => id));

  const judge = () => {
    state.bins = binsNow();
    const labels = puzzle.groups.map((g) => g.items.map((id) => labelOf.get(id) ?? id).join(", "));
    results = judgePuzzle(puzzle.groups, state, labels);
    renderJudgePanel(q(".judge-panel"), results, previous);
    const stars = starsFor(results);
    q(".boss-stars").innerHTML = starsHtml(stars);
    submitBtn.disabled = stars === 0;
    const core = results.filter((r) => r.kind === "core");
    const failing = core.filter((r) => !r.pass).length;
    q(".problems-bar").innerHTML = core.map((r) => `<span data-fixed="${r.pass}"></span>`).join("");
    q(".problems-count").textContent =
      failing === 0 ? "None left" : `${failing} of ${core.length} left`;
    arena.sync(failing, core.length, { instant: lastFailing < 0 });
    if (lastFailing > 0 && failing === 0) stamp(q(".problems"), "Ship it", "ship");
    lastFailing = failing;
    state.bins.forEach((contents, i) => {
      binEl(i).dataset.found = String(puzzle.groups.some((g) => groupFound(g.items, [contents])));
    });
    principleEl.hidden = !results.slice(0, puzzle.groups.length).every((r) => r.pass);
  };

  const move = (id: string, to: number) => {
    if (placement.get(id) === to) return select(null);
    if (to >= 0 && isWrongDrop(id, binsNow()[to], puzzle.groups)) {
      state.wrongDrops++;
      shake(binEl(to));
      arena.strike();
    }
    placement.set(id, to);
    const card = cards.get(id);
    if (card) $(binEl(to), ".bin-cards").append(card);
    select(null);
    card?.focus();
    judge();
  };

  board.addEventListener("click", (e) => {
    const target = e.target as Element;
    const card = target.closest<HTMLElement>(".sort-card");
    if (card) {
      const id = card.dataset.item ?? null;
      select(selected === id ? null : id);
      return;
    }
    const put = target.closest<HTMLElement>("[data-put]");
    const zone = put ?? target.closest<HTMLElement>(".sort-bin");
    if (zone && selected) move(selected, Number(zone.dataset.put ?? zone.dataset.bin));
  });
  board.addEventListener("dragstart", (e) => {
    const card = (e.target as Element).closest<HTMLElement>(".sort-card");
    if (!card || !e.dataTransfer) return;
    e.dataTransfer.setData("text/plain", card.dataset.item ?? "");
    e.dataTransfer.effectAllowed = "move";
    select(card.dataset.item ?? null);
  });
  board.addEventListener("dragover", (e) => {
    if ((e.target as Element).closest(".sort-bin")) e.preventDefault();
  });
  board.addEventListener("drop", (e) => {
    const zone = (e.target as Element).closest<HTMLElement>(".sort-bin");
    const id = e.dataTransfer?.getData("text/plain");
    if (!zone || !id || !placement.has(id)) return;
    e.preventDefault();
    move(id, Number(zone.dataset.bin));
  });
  board.addEventListener("pointerover", (e) => {
    const card = (e.target as Element).closest<HTMLElement>(".sort-card");
    if (card && !selected) light(card.dataset.item ?? null);
  });
  board.addEventListener("pointerleave", () => {
    if (!selected) light(null);
  });

  // The principle question, once every group is sorted.
  const { principle } = puzzle;
  principleEl.addEventListener("click", (e) => {
    const b = (e.target as Element).closest<HTMLButtonElement>(".option");
    if (!b || state.principleNamed || b.disabled) return;
    const i = Number(b.dataset.i);
    if (i === principle.answer) {
      state.principleNamed = true;
      b.dataset.state = "right";
      stamp(b, "✓", "good");
      for (const o of principleEl.querySelectorAll<HTMLButtonElement>(".option")) o.disabled = true;
      why.innerHTML = `<strong>✓ ${esc(principle.options[i])}.</strong> ${esc(principle.note)}`;
    } else {
      state.principleMisses++;
      b.dataset.state = "wrong";
      b.disabled = true;
      shake(b);
      arena.strike();
      why.innerHTML = `<strong>✗ Not ${esc(principle.options[i].toLowerCase())}.</strong> ${esc(principle.why[i])}`;
    }
    judge();
  });

  // Hints
  const hintBtn = q<HTMLButtonElement>('[data-act="hint"]');
  hintBtn.addEventListener("click", () => {
    if (hintsUsed >= boss.hints.length) return;
    q(".hints").insertAdjacentHTML("beforeend", `<li>${esc(boss.hints[hintsUsed])}</li>`);
    hintsUsed++;
    const left = boss.hints.length - hintsUsed;
    hintBtn.textContent = left ? `Another hint (${left} left)` : "No hints left";
    hintBtn.disabled = left === 0;
  });

  submitBtn.addEventListener("click", () => {
    const stars = starsFor(results);
    if (stars === 0) return;
    shipJob({
      level,
      boss,
      hard,
      stars,
      results,
      css: "",
      rationale: principle.note,
      seconds,
      hintsUsed,
    });
  });

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" && selected) select(null);
  };
  window.addEventListener("keydown", onKey);

  const timer = window.setInterval(() => {
    if (document.visibilityState !== "visible" || document.querySelector("dialog[open]")) return;
    seconds++;
    q(".boss-timer").textContent = formatTime(seconds);
    if (seconds === 240 && lastFailing > 0) arena.player.rest("sweat");
  }, 1000);

  judge();
  (async () => {
    sandbox = new Sandbox(q(".preview-host"), { fit: true, title: `${boss.client}: the page` });
    await sandbox.load(boss.html, boss.css);
    if (disposed) sandbox.destroy();
  })();

  return () => {
    disposed = true;
    window.clearInterval(timer);
    window.removeEventListener("keydown", onKey);
    sandbox?.destroy();
  };
}
