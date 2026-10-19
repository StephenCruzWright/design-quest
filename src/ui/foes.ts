/**
 * The foes the player fights and the clients they turn back into. Each foe is
 * the desk's design flaw drawn as a creature, in the same line-mark style as
 * the player sprite. Decorative: every state it shows is also in text.
 */

export interface Foe {
  /** Matches the level id; styles pick the foe's colours by it. */
  id: string;
  name: string;
  /** What the foe does to a page, shown under its name. */
  flaw: string;
  /** Body parts inside `.foe-fig`, drawn on a 80 × 90 viewBox. */
  art: string;
}

const EYES = (a: number, b: number, y: number, r = 4) =>
  `<circle class="foe-eye" cx="${a}" cy="${y}" r="${r}"/><circle class="foe-eye" cx="${b}" cy="${y}" r="${r}"/>
   <circle class="foe-pupil" cx="${a + 0.6}" cy="${y + 0.6}" r="1.4"/><circle class="foe-pupil" cx="${b - 0.6}" cy="${y + 0.6}" r="1.4"/>`;

export const FOES: Record<string, Foe> = {
  spacing: {
    id: "spacing",
    name: "The Cram",
    flaw: "Squeezes everything together until nothing belongs to anything.",
    art: `<path class="foe-body" d="M14 40q0-6 6-6l4-8 6 7 5-9 5 9 5-9 5 9 6-7 4 8q6 0 6 6v38q0 6-6 6H20q-6 0-6-6z"/>
      <path class="foe-shade" d="M14 70h52v8q0 6-6 6H20q-6 0-6-6z"/>
      ${EYES(36.5, 43.5, 48)}
      <path fill="none" d="M30 41l9 4M50 41l-9 4"/>
      <path fill="none" d="M33 56l2.5 3 2.5-3 2.5 3 2.5-3 2.5 3 2.5-3"/>
      <path fill="none" d="M14 60c6 2 10 6 12 10M66 60c-6 2-10 6-12 10"/>
      <path fill="none" d="M28 84v3M52 84v3"/>`,
  },
  hierarchy: {
    id: "hierarchy",
    name: "The Shouter",
    flaw: "Says every line at the same volume, so nobody hears the important one.",
    art: `<path class="foe-body" d="M40 22c16 0 26 12 26 30v26q0 6-6 6H20q-6 0-6-6V52c0-18 10-30 26-30z"/>
      <path class="foe-shade" d="M14 72h52v6q0 6-6 6H20q-6 0-6-6z"/>
      <circle class="foe-eye" cx="25" cy="44" r="4"/><circle class="foe-eye" cx="35" cy="44" r="4"/>
      <circle class="foe-eye" cx="45" cy="44" r="4"/><circle class="foe-eye" cx="55" cy="44" r="4"/>
      <circle class="foe-pupil" cx="25" cy="44.5" r="1.4"/><circle class="foe-pupil" cx="35" cy="44.5" r="1.4"/>
      <circle class="foe-pupil" cx="45" cy="44.5" r="1.4"/><circle class="foe-pupil" cx="55" cy="44.5" r="1.4"/>
      <path fill="none" d="M21 37l8 2M31 37l8 2M41 39l8-2M51 39l8-2"/>
      <rect class="foe-mouth" x="28" y="53" width="24" height="16" rx="2"/>
      <path fill="none" d="M28 58h24"/>
      <path fill="none" d="M14 56c-6-4-8-10-7-16M66 56c6-4 8-10 7-16"/>
      <g class="foe-noise" fill="none"><path d="M9 50l-7-3M8 58H0M9 66l-7 3"/><path d="M71 50l7-3M72 58h8M71 66l7 3"/></g>
      <path fill="none" d="M28 84v3M52 84v3"/>`,
  },
  color: {
    id: "color",
    name: "The Murk",
    flaw: "Washes the contrast out of a page until the words sink into it.",
    art: `<path class="foe-body" d="M18 46c0-14 10-24 22-24s22 10 22 24v30q-2 4-4 0t-5 0t-5 0t-5 0t-5 0t-5 0t-5 0t-5 0t-5 0V46z"/>
      <path class="foe-smear" d="M24 66q8-4 14 0t14 0"/>
      <path class="foe-drip" d="M27 79q-2 4 0 6 2-2 0-6zM49 79q-2 5 0 7 2-2 0-7z"/>
      <ellipse class="foe-eye foe-eye-dim" cx="32" cy="45" rx="5" ry="3.5"/><ellipse class="foe-eye foe-eye-dim" cx="48" cy="45" rx="5" ry="3.5"/>
      <circle class="foe-pupil" cx="33" cy="45.5" r="1.3"/><circle class="foe-pupil" cx="47" cy="45.5" r="1.3"/>
      <path fill="none" d="M25 38l9 3M55 38l-9 3"/>
      <path fill="none" d="M31 56q3-3 6 0t6 0 6 0"/>
      <path fill="none" d="M18 54c-5 2-8 6-9 11M62 54c5 2 8 6 9 11"/>`,
  },
  typography: {
    id: "typography",
    name: "The Wall",
    flaw: "Runs every line to the edge and packs them tight, so readers lose their place.",
    art: `<rect class="foe-body" x="16" y="12" width="48" height="72" rx="3"/>
      <path class="foe-shade" d="M16 78h48v3q0 3-3 3H19q-3 0-3-3z"/>
      <g class="foe-lines" fill="none"><path d="M8 52h64M8 57h64M8 62h64M8 67h64M8 72h58"/></g>
      ${EYES(29, 51, 32, 3.6)}
      <path fill="none" d="M22 25l11 4M58 25l-11 4"/>
      <path fill="none" d="M31 44q9-5 18 0"/>
      <path fill="none" d="M16 46c-6 2-9 6-10 11M64 46c6 2 9 6 10 11"/>
      <path fill="none" d="M28 84v3M52 84v3"/>`,
  },
};

const GREMLIN: Foe = {
  id: "gremlin",
  name: "The Gremlin",
  flaw: "Breaks whatever this desk teaches.",
  art: `<path class="foe-body" d="M20 34l-4-12 12 6q12-6 24 0l12-6-4 12q8 8 8 22v22q0 6-6 6H18q-6 0-6-6V56q0-14 8-22z"/>
    <path class="foe-shade" d="M12 72h56v6q0 6-6 6H18q-6 0-6-6z"/>
    ${EYES(31, 49, 48)}
    <path fill="none" d="M24 40l10 4M56 40l-10 4"/>
    <path fill="none" d="M32 60l4-3 4 3 4-3 4 3"/>
    <path fill="none" d="M28 84v3M52 84v3"/>`,
};

export function foeFor(levelId: string): Foe {
  return FOES[levelId] ?? GREMLIN;
}

export function foeSvg(foe: Foe): string {
  return `<svg viewBox="0 0 80 90" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <ellipse class="foe-shadow" cx="40" cy="87" rx="24" ry="2.5"/>
    <g class="foe-fig">${foe.art}</g>
  </svg>`;
}

/** Hair, hats and beards for the clients, drawn over a sprite-style head. */
const CLIENT_TOPS = [
  `<path class="cl-hat" d="M17 29c0-9 7-15 15-15s15 6 15 15z"/><path class="cl-hat" d="M17 29h24q7 0 10 3H17z"/>`,
  `<path class="sp-hair" d="M17 33c-1-12 6-19 15-19s16 7 15 19v14c-3-2-4-6-4-14-3-5-7-8-11-8s-9 3-11 8c0 8-1 12-4 14z"/>`,
  `<path fill="none" d="M18 30q0-3 2-5M46 30q0-3-2-5"/>`,
  `<path class="sp-hair" d="M45 24c7 0 10 5 9 12-2-3-5-4-8-4z"/><path class="sp-hair" d="M17 31c0-10 7-16 15-16s15 6 15 16c-4-5-9-7-15-7s-11 2-15 7z"/>`,
];
const BEARD = `<path class="sp-hair" d="M19 36c1 8 6 12 13 12s12-4 13-12c-3 3-7 4-13 4s-10-1-13-4z"/>`;

/** A happy client, arms up. `variant` picks the look (0 to 3). */
export function clientSvg(variant: number): string {
  const v = ((variant % 4) + 4) % 4;
  return `<svg viewBox="0 0 64 90" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <ellipse class="sp-shadow" cx="32" cy="86" rx="14" ry="2.5"/>
    <g class="cl-fig">
      <path d="M28 68v15h-4"/><path d="M36 68v15h4"/>
      <path d="M23 56c-4-4-6-9-6-14"/><path d="M41 56c4-4 6-9 6-14"/>
      <path class="cl-shirt" d="M20 72c0-13 5-21 12-21s12 8 12 21z"/>
      <circle class="sp-skin" cx="32" cy="32" r="15"/>
      ${v === 2 ? BEARD : ""}
      <g class="cl-face"><path fill="none" d="M25 34l2-2.5 2 2.5M35 34l2-2.5 2 2.5"/><path d="M28 38q4 5 8 0z"/></g>
      ${CLIENT_TOPS[v]}
    </g>
  </svg>`;
}
