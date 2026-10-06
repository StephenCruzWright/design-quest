import { store } from "../state/save";
import { el } from "../util/dom";

/**
 * The player's character, drawn in the line-mark style. Poses are CSS states on
 * the root element, so a reaction is one attribute change. Decorative: anything
 * it signals is also shown in text.
 */

export type SpriteState = "idle" | "think" | "cheer" | "wince" | "sweat" | "walk";

export interface Look {
  name: string;
  /** Hair and accessory paths, drawn over the head. */
  top: string;
}

export const LOOKS: Look[] = [
  {
    name: "Bob and glasses",
    top: `<path class="sp-hair" d="M17 33c-1-12 6-19 15-19s16 7 15 19c-3-6-8-9-15-9s-12 3-15 9z"/>
      <g class="sp-glasses" fill="none"><circle cx="27" cy="33" r="4.2"/><circle cx="37" cy="33" r="4.2"/><path d="M31.2 33h1.6"/></g>`,
  },
  {
    name: "Curls",
    top: `<path class="sp-hair" d="M18 30a5 5 0 0 1 5-8 6 6 0 0 1 9-4 6 6 0 0 1 9 4 5 5 0 0 1 5 8c-4-4-9-6-14-6s-10 2-14 6z"/>`,
  },
  {
    name: "Beanie",
    top: `<path class="sp-hat" d="M17 29c0-9 7-15 15-15s15 6 15 15z"/><path class="sp-hat" d="M16 27h32v4H16z"/><circle class="sp-hat" cx="32" cy="12" r="3"/>`,
  },
  {
    name: "Bun and pencil",
    top: `<path class="sp-pencil" d="M23 8l17 9"/><circle class="sp-hair" cx="32" cy="14" r="5"/>
      <path class="sp-hair" d="M17 31c0-10 7-16 15-16s15 6 15 16c-4-5-9-7-15-7s-11 2-15 7z"/>`,
  },
];

const FACES = `
  <g class="sp-face" data-for="idle walk">
    <g class="sp-eyes"><circle cx="27" cy="33" r="1.6"/><circle cx="37" cy="33" r="1.6"/></g>
    <path fill="none" d="M29 39q3 2 6 0"/>
  </g>
  <g class="sp-face" data-for="think">
    <circle cx="28.5" cy="31.5" r="1.6"/><circle cx="38.5" cy="31.5" r="1.6"/>
    <path fill="none" d="M30 40h4"/>
  </g>
  <g class="sp-face" data-for="cheer">
    <path fill="none" d="M25 34l2-2.5 2 2.5M35 34l2-2.5 2 2.5"/>
    <path d="M28 38q4 5 8 0z"/>
  </g>
  <g class="sp-face" data-for="wince">
    <path fill="none" d="M25 31l3 2-3 2M39 31l-3 2 3 2"/>
    <path fill="none" d="M29 40q3-2 6 0"/>
  </g>
  <g class="sp-face" data-for="sweat">
    <circle cx="27" cy="33" r="1.6"/><circle cx="37" cy="33" r="1.6"/>
    <path fill="none" d="M28 40q1.5-1.5 3 0t3 0 3 0"/>
    <path class="sp-drop" d="M48 22q-2.5 4 0 5.5 2.5-1.5 0-5.5z"/>
  </g>`;

function svg(look: Look): string {
  return `<svg viewBox="0 0 64 90" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <ellipse class="sp-shadow" cx="32" cy="86" rx="14" ry="2.5"/>
    <g class="sp-fig">
      <path class="sp-leg sp-leg-l" d="M28 68v15h-4"/>
      <path class="sp-leg sp-leg-r" d="M36 68v15h4"/>
      <path class="sp-arm sp-arm-l" d="M23 56c-4 4-6 8-6 12"/>
      <path class="sp-arm sp-arm-r" d="M41 56c4 4 6 8 6 12"/>
      <path class="sp-shirt" d="M20 72c0-13 5-21 12-21s12 8 12 21z"/>
      <g class="sp-head">
        <circle class="sp-skin" cx="32" cy="32" r="15"/>
        ${FACES}
        ${look.top}
      </g>
      <g class="sp-bubble"><circle cx="50" cy="18" r="1.2"/><circle cx="54" cy="12.5" r="1.7"/><circle cx="59.5" cy="6" r="2.3"/></g>
    </g>
  </svg>`;
}

export interface Sprite {
  el: HTMLElement;
  /** Switch pose. With `holdMs`, return to the resting pose afterwards. */
  set(state: SpriteState, holdMs?: number): void;
  /** The pose the sprite returns to after a timed reaction. */
  rest(state: SpriteState): void;
}

export function sprite(
  opts: { look?: number; state?: SpriteState; size?: "s" | "m" | "l" } = {},
): Sprite {
  const lookIndex = opts.look ?? store.get().player.look;
  const look = LOOKS[lookIndex] ?? LOOKS[0];
  const root = el(
    `<span class="sprite sprite-${opts.size ?? "m"}" data-look="${lookIndex}">${svg(look)}</span>`,
  );
  let resting: SpriteState = opts.state ?? "idle";
  let timer: number | undefined;
  const apply = (state: SpriteState) => {
    root.dataset.state = state;
  };
  apply(resting);
  return {
    el: root,
    set(state, holdMs) {
      window.clearTimeout(timer);
      timer = undefined;
      // Restart the pose's animation even when the state repeats.
      delete root.dataset.state;
      void root.offsetWidth;
      apply(state);
      if (holdMs)
        timer = window.setTimeout(() => {
          timer = undefined;
          apply(resting);
        }, holdMs);
    },
    rest(state) {
      resting = state;
      if (timer === undefined) apply(state);
    },
  };
}
