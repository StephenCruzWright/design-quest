import { el, esc } from "../util/dom";
import { clientSvg, type Foe, foeSvg } from "./foes";
import { beat } from "./fx";
import { type Sprite, sprite } from "./sprite";

/**
 * The battle arena: the player on the left, the desk's foe on the right and the
 * foe's HP between them. HP is whatever the screen measures (failing core
 * checks, or trial questions left), so a hit always means real progress and a
 * heal always means a real regression. The player has no HP: a mistake shows
 * as the foe striking back and costs nothing. Decorative (`aria-hidden`); the
 * screens carry the same state in text.
 */

export type BattleStep = "none" | "hit" | "finish" | "heal" | "revive";

/** What a change in the foe's HP means. `prev` is null on the first reading. */
export function battleStep(prev: number | null, next: number): BattleStep {
  if (prev === null || prev === next) return "none";
  if (next < prev) return next === 0 ? "finish" : "hit";
  return prev === 0 ? "revive" : "heal";
}

export interface BattleOpts {
  foe: Foe;
  /** The client the foe turns back into, if there is one. */
  client?: { variant: number; from: string; thanks: string };
  /** Caption once the foe is beaten when there is no client (the trial). */
  beaten?: string;
}

export interface Battle {
  el: HTMLElement;
  player: Sprite;
  /** Set the foe's HP. Animates the change unless `instant`. */
  sync(remaining: number, total: number, opts?: { instant?: boolean }): void;
  /** The foe attacks: a wrong answer. HP is unchanged. */
  strike(): void;
  /** The foe leaves the fight unbeaten, with a caption. */
  retreat(caption: string): void;
}

export function battle(opts: BattleOpts): Battle {
  const { foe, client } = opts;
  const root = el(`
    <div class="arena" aria-hidden="true" data-phase="fight">
      <div class="arena-head">
        <span class="arena-name">${esc(foe.name)}</span>
        <span class="arena-hp-label"></span>
      </div>
      <div class="arena-hp"></div>
      <div class="arena-stage">
        <div class="arena-player"></div>
        <div class="arena-target">
          <span class="foe" data-foe="${foe.id}" data-state="idle">${foeSvg(foe)}</span>
          ${client ? `<span class="arena-client sprite" data-variant="${client.variant % 4}">${clientSvg(client.variant)}</span>` : ""}
          <svg class="arena-slash" viewBox="0 0 100 100" fill="none"><path pathLength="100" d="M14 18 86 82"/></svg>
          <span class="arena-dmg">−1</span>
          <span class="arena-puff">${Array.from({ length: 8 }, (_, i) => `<span style="--a:${i * 45}deg"></span>`).join("")}</span>
        </div>
      </div>
      <p class="arena-caption"></p>
    </div>`);
  const player = sprite();
  root.querySelector(".arena-player")?.append(player.el);
  const foeEl = root.querySelector<HTMLElement>(".foe") as HTMLElement;
  const target = root.querySelector<HTMLElement>(".arena-target") as HTMLElement;
  const hpEl = root.querySelector<HTMLElement>(".arena-hp") as HTMLElement;
  const hpLabel = root.querySelector<HTMLElement>(".arena-hp-label") as HTMLElement;
  const caption = root.querySelector<HTMLElement>(".arena-caption") as HTMLElement;

  let hp: number | null = null;
  let foeTimer: number | undefined;
  // Each animation checks its ticket so a newer change wins over a slower one.
  let ticket = 0;

  /** Restart a CSS state even when it repeats, as the sprite does. */
  const pose = (node: HTMLElement, attr: string, value: string) => {
    delete node.dataset[attr];
    void node.offsetWidth;
    node.dataset[attr] = value;
  };
  /** A foe reaction. With `holdMs`, the foe goes back to idle afterwards. */
  const act = (state: string, holdMs?: number) => {
    window.clearTimeout(foeTimer);
    pose(foeEl, "state", state);
    if (holdMs) foeTimer = window.setTimeout(() => pose(foeEl, "state", "idle"), holdMs);
  };
  const renderHp = (remaining: number, total: number) => {
    hpEl.innerHTML = Array.from(
      { length: total },
      (_, i) => `<span data-on="${i < remaining}"></span>`,
    ).join("");
    hpLabel.textContent = `HP ${remaining}/${total}`;
  };
  const setPhase = (phase: "fight" | "won" | "gone") => {
    root.dataset.phase = phase;
    if (phase === "won" && client) {
      caption.innerHTML = `“${esc(client.thanks)}” <span class="arena-from">${esc(client.from)}</span>`;
    } else if (phase === "won") {
      caption.textContent = opts.beaten ?? "";
    } else if (phase === "fight") {
      caption.textContent = foe.flaw;
    }
  };
  const hit = async (mine: number) => {
    player.set("attack", 700);
    await beat(220);
    if (mine !== ticket) return false;
    pose(target, "fx", "hit");
    return true;
  };

  setPhase("fight");

  return {
    el: root,
    player,
    sync(remaining, total, o = {}) {
      const first = hp === null;
      const step = o.instant ? "none" : battleStep(hp, remaining);
      hp = remaining;
      renderHp(remaining, total);
      if (step === "none") {
        // A re-measure with no change leaves any animation in flight alone.
        if (o.instant || first) {
          ++ticket;
          setPhase(remaining === 0 ? "won" : "fight");
          act(remaining === 0 ? "defeated" : "idle");
        }
        return;
      }
      const mine = ++ticket;
      if (step === "hit") {
        void hit(mine).then((landed) => {
          if (landed) act("hurt", 600);
        });
      } else if (step === "finish") {
        void (async () => {
          if (!(await hit(mine))) return;
          act("defeated");
          await beat(380);
          if (mine !== ticket) return;
          pose(target, "puff", "on");
          await beat(300);
          if (mine !== ticket) return;
          setPhase("won");
          player.set("cheer", 1400);
        })();
      } else if (step === "heal") {
        act("strike", 650);
        player.set("wince", 900);
      } else {
        setPhase("fight");
        act("enter", 550);
        player.set("wince", 900);
      }
    },
    strike() {
      ++ticket;
      act("strike", 650);
      player.set("wince", 900);
    },
    retreat(text) {
      ++ticket;
      act("retreat");
      root.dataset.phase = "gone";
      caption.textContent = text;
    },
  };
}
