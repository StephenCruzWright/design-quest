import { clampChroma, formatCss, formatHex } from "culori/fn";
import { composite, contrastRatio, parseColor, type Rgb } from "../../engine/measure/color";
import { slider, toggleGroup } from "../../ui/controls";
import { $ } from "../../util/dom";
import type { DemoContext, LessonSection } from "../types";

const WHITE = "oklch(100% 0 0)";

/** WCAG 2.x ratio of two CSS colours; 0 if either can't be read. */
function ratioOf(text: string, background: string): number {
  const fg = parseColor(text);
  const bg = parseColor(background);
  return fg && bg ? contrastRatio(fg, bg) : 0;
}

const shown = (r: number) => `${(Math.floor(r * 10) / 10).toFixed(1)}:1`;
const hex = (c: Rgb) => formatHex({ mode: "rgb", r: c.r, g: c.g, b: c.b });

/** Demo: lighten a grey caption until it is as light as it can be and still pass. */
function greyFloor(host: HTMLElement, ctx: DemoContext) {
  host.innerHTML = `
    <div class="demo-stage floor-stage" style="background:${WHITE}">
      <p class="floor-head">Book a check-up</p>
      <p class="floor-hint">We text a reminder the day before your appointment.</p>
    </div>
    <div class="demo-controls-row"></div>
    <p class="demo-readout"></p>`;
  const hint = $<HTMLElement>(host, ".floor-hint");
  const readout = $<HTMLElement>(host, ".demo-readout");
  const update = (l: number) => {
    const grey = `oklch(${l}% 0 0)`;
    hint.style.color = grey;
    const r = ratioOf(grey, WHITE);
    const parsed = parseColor(grey);
    readout.innerHTML = `Caption ${parsed ? `<strong>${hex(parsed)}</strong>` : ""} on white: <strong>${shown(r)}</strong>. ${
      r < 4.5
        ? "Below 4.5:1: too light for body text."
        : r <= 5
          ? "As light as it can go and still pass."
          : "Passes, with room to go lighter."
    }`;
    if (r >= 4.5 && r <= 5) ctx.complete();
  };
  $(host, ".demo-controls-row").append(
    slider({
      label: "Caption lightness (OKLCH)",
      min: 20,
      max: 90,
      step: 0.5,
      value: 78,
      unit: "%",
      onInput: update,
    }),
  );
  update(78);
}

/** Demo: a translucent card over a dark band. The text sits on the mix. */
function overlay(host: HTMLElement) {
  const BAND = "oklch(32% 0.08 260)";
  const INK = "oklch(25% 0.02 260)";
  host.innerHTML = `
    <div class="demo-stage overlay-stage" style="background:${BAND}">
      <div class="overlay-card">
        <p>Doors 19:00. Standing only.</p>
      </div>
    </div>
    <div class="demo-controls-row"></div>
    <p class="demo-readout"></p>`;
  const card = $<HTMLElement>(host, ".overlay-card");
  card.style.color = INK;
  const readout = $<HTMLElement>(host, ".demo-readout");
  const band = parseColor(BAND);
  const ink = parseColor(INK);
  const update = (alpha: number) => {
    card.style.background = `oklch(100% 0 0 / ${alpha})`;
    if (!band || !ink) return;
    const under = composite({ r: 1, g: 1, b: 1, alpha }, band);
    const r = contrastRatio(ink, under);
    readout.innerHTML = `The card is white at <strong>${Math.round(alpha * 100)}%</strong>. Over the band it paints <strong>${hex(under)}</strong>, and the text measures <strong>${shown(r)}</strong> against that.`;
  };
  $(host, ".demo-controls-row").append(
    slider({
      label: "Card opacity",
      min: 0.2,
      max: 1,
      step: 0.05,
      value: 0.5,
      onInput: update,
    }),
  );
  update(0.5);
}

const HUES = Array.from({ length: 12 }, (_, i) => i * 30);
const hslAt = (h: number) => `hsl(${h} 100% 50%)`;
const oklchAt = (h: number) => `oklch(52% 0.12 ${h})`;

/** Lowest and highest white-text ratio over the whole hue wheel. */
function ratioRange(at: (h: number) => string): string {
  const all = Array.from({ length: 360 }, (_, h) => ratioOf(WHITE, at(h)));
  return `${shown(Math.min(...all))} to ${shown(Math.max(...all))}`;
}

/** Demo: the same lightness number in HSL and OKLCH, swept round the hue wheel. */
function hslVsOklch(host: HTMLElement) {
  const strip = (at: (h: number) => string) =>
    HUES.map((h) => `<span style="background:${at(h)}"></span>`).join("");
  host.innerHTML = `
    <div class="demo-stage hue-stage">
      <figure class="hue-row">
        <figcaption><code>hsl(h 100% 50%)</code></figcaption>
        <div class="hue-strip">${strip(hslAt)}</div>
        <p class="hue-chip" data-model="hsl">Book now</p>
      </figure>
      <figure class="hue-row">
        <figcaption><code>oklch(52% 0.12 h)</code></figcaption>
        <div class="hue-strip">${strip(oklchAt)}</div>
        <p class="hue-chip" data-model="oklch">Book now</p>
      </figure>
    </div>
    <div class="demo-controls-row"></div>
    <p class="demo-readout"></p>`;
  const hsl = $<HTMLElement>(host, '[data-model="hsl"]');
  const ok = $<HTMLElement>(host, '[data-model="oklch"]');
  const readout = $<HTMLElement>(host, ".demo-readout");
  const spread = `Round the whole wheel, white text on the HSL row ranges from ${ratioRange(hslAt)}, and on the OKLCH row from ${ratioRange(oklchAt)}.`;
  const update = (h: number) => {
    hsl.style.background = hslAt(h);
    ok.style.background = oklchAt(h);
    readout.innerHTML = `Hue <strong>${h}</strong>. White on the HSL chip: <strong>${shown(ratioOf(WHITE, hslAt(h)))}</strong>. White on the OKLCH chip: <strong>${shown(ratioOf(WHITE, oklchAt(h)))}</strong>. ${spread}`;
  };
  $(host, ".demo-controls-row").append(
    slider({ label: "Hue", min: 0, max: 359, value: 60, unit: "°", onInput: update }),
  );
  update(60);
}

/** Demo: build an accent from lightness, chroma and hue, with a white label. */
function accentButton(host: HTMLElement, ctx: DemoContext) {
  host.innerHTML = `
    <div class="demo-split">
      <div class="demo-stage accent-stage">
        <p>Wheel throwing, Thursdays 18:30</p>
        <span class="accent-btn">Book a place</span>
        <pre class="accent-code"><code></code></pre>
      </div>
      <div class="demo-controls"></div>
    </div>
    <p class="demo-readout"></p>`;
  const btn = $<HTMLElement>(host, ".accent-btn");
  const code = $<HTMLElement>(host, ".accent-code code");
  const readout = $<HTMLElement>(host, ".demo-readout");
  const state = { l: 75, c: 0.12, h: 40 };
  const update = () => {
    // Pull out-of-gamut colours back into sRGB, so the numbers match what the screen shows.
    const fit = clampChroma({ mode: "oklch", l: state.l / 100, c: state.c, h: state.h }, "oklch");
    const c = fit.c ?? 0;
    const fill = formatCss({ ...fit, c });
    btn.style.background = fill;
    const r = ratioOf(WHITE, fill);
    code.textContent = `--accent: oklch(${state.l}% ${c.toFixed(2)} ${state.h});`;
    const accent = c > 0.1;
    readout.innerHTML = `Chroma <strong>${c.toFixed(2)}</strong>, white label <strong>${shown(r)}</strong>. ${
      !accent
        ? "At this chroma it reads as a neutral. Raise chroma above 0.1."
        : r < 4.5
          ? "A clear accent, but the label fails 4.5:1. Lower the lightness."
          : "A clear accent with a readable label."
    }`;
    if (accent && r >= 4.5) ctx.complete();
  };
  const set = (key: keyof typeof state) => (v: number) => {
    state[key] = v;
    update();
  };
  $(host, ".demo-controls").append(
    slider({ label: "Lightness", min: 30, max: 90, value: state.l, unit: "%", onInput: set("l") }),
    slider({
      label: "Chroma",
      min: 0,
      max: 0.2,
      step: 0.01,
      value: state.c,
      onInput: set("c"),
    }),
    slider({ label: "Hue", min: 0, max: 359, value: state.h, unit: "°", onInput: set("h") }),
  );
  update();
}

/** Demo: an error shown by a red border alone, then in greyscale, then with cues. */
function colourAlone(host: HTMLElement, ctx: DemoContext) {
  host.innerHTML = `
    <div class="demo-split">
      <div class="demo-stage cue-stage" data-grey="false" data-border="false" data-word="false">
        <div class="cue-field">
          <span>Full name</span>
          <span class="cue-box">Ruth Okafor</span>
        </div>
        <div class="cue-field" data-error>
          <span>Mobile number</span>
          <span class="cue-box"></span>
          <span class="cue-msg">We text a reminder the day before</span>
        </div>
      </div>
      <div class="demo-controls"></div>
    </div>
    <p class="demo-readout"></p>`;
  const stage = $<HTMLElement>(host, ".cue-stage");
  const readout = $<HTMLElement>(host, ".demo-readout");
  const update = () => {
    const grey = stage.dataset.grey === "true";
    const cue = stage.dataset.border === "true" || stage.dataset.word === "true";
    readout.textContent = !grey
      ? "In colour, the red border marks the mobile number field. Switch to greyscale."
      : cue
        ? "In greyscale the field with the problem still stands out."
        : "In greyscale the two fields look alike. Add a cue.";
    if (grey && cue) ctx.complete();
  };
  const toggle = (label: string, key: string, on: string, off: string) =>
    toggleGroup({
      label,
      options: [
        { value: "false", label: off },
        { value: "true", label: on },
      ],
      value: "false",
      onChange: (v) => {
        stage.dataset[key] = v;
        update();
      },
    });
  $(host, ".demo-controls").append(
    toggle("View", "grey", "Greyscale", "Colour"),
    toggle("Heavier border", "border", "Heavier border", "Same border"),
    toggle("Message", "word", "Say what's wrong", "No message"),
  );
  update();
}

/** Demo: links in a paragraph, coloured or underlined, in colour or greyscale. */
function linkCue(host: HTMLElement) {
  host.innerHTML = `
    <div class="demo-stage link-stage" data-grey="false" data-style="colour">
      <p>Rhyme time is free. Groups of more than four should <a href="#" tabindex="-1">book a place</a> first, and the <a href="#" tabindex="-1">access guide</a> lists step-free routes into each room.</p>
    </div>
    <div class="demo-controls-row"></div>`;
  const stage = $<HTMLElement>(host, ".link-stage");
  for (const a of host.querySelectorAll("a"))
    a.addEventListener("click", (e) => e.preventDefault());
  $(host, ".demo-controls-row").append(
    toggleGroup({
      label: "Link style",
      options: [
        { value: "colour", label: "Colour only" },
        { value: "underline", label: "Underlined" },
      ],
      value: "colour",
      onChange: (v) => (stage.dataset.style = v),
    }),
    toggleGroup({
      label: "View",
      options: [
        { value: "false", label: "Colour" },
        { value: "true", label: "Greyscale" },
      ],
      value: "false",
      onChange: (v) => (stage.dataset.grey = v),
    }),
  );
}

export const lesson: LessonSection[] = [
  {
    id: "ratio",
    title: "What 4.5:1 means",
    body: `
      <p>WCAG 2.x measures contrast as a ratio of relative luminance: the light each colour gives off, worked out from its linearised red, green and blue. Black on white is 21:1. A colour on itself is 1:1. Body text needs at least 4.5:1 (Success Criterion 1.4.3). Large text, 24px or about 19px in bold, needs 3:1.</p>
      <p>WCAG explains where 4.5 comes from. Older display standards recommend 3:1. A reader with 20/40 vision loses about 1.5 in contrast sensitivity, and 3 × 1.5 is 4.5. It is an engineering threshold, not the result of a reading experiment, and it is the line client work has to clear.</p>
      <p class="try">Lighten the caption until it is as light as it can be and still pass.</p>`,
    demo: greyFloor,
    gate: {
      kind: "goal",
      goal: "Find the lightest grey that still passes: a ratio from 4.5:1 up to 5.0:1.",
      note: "On white that grey sits close to #767676, the lightest neutral grey that passes. Lorem & Ipsum's captions use #a0a0a0, about 2.6:1.",
    },
    sources: [
      "W3C, Understanding WCAG 2.2, Success Criterion 1.4.3 Contrast (Minimum)",
      "W3C, WCAG 2, relative luminance definition",
    ],
  },
  {
    id: "background",
    title: "The background you actually see",
    body: `
      <p>A contrast ratio needs two colours, and the second one is whatever the text sits on. A translucent card lets the colour behind it through, so its text sits on a mix of the two. WCAG's Understanding document counts a text colour set without a background colour as a failure for the same reason: the background is half of the pair.</p>
      <p>The game measures every piece of text against its effective background: each ancestor's background colour, composited in paint order, down to a white page. Background images are not counted, so client pages keep their text on solid colour.</p>
      <p class="try">Change the card's opacity and watch the colour the text actually sits on.</p>`,
    demo: overlay,
    gate: {
      kind: "choice",
      prompt:
        "A white card at 40% opacity sits on a navy band. What does the game measure the card's text against?",
      options: [
        "The mix: 40% white painted over navy",
        "White, the card's colour",
        "Navy, the band's colour",
        "The white page under the band",
      ],
      answer: 0,
      note: "Composite the layers from the top down until you reach an opaque one. The result is one colour, and that is the background.",
      why: [
        "",
        "The card is 60% see-through, so where the text sits it is not white.",
        "The card lightens the navy. The text sits on the mix, not on the band.",
        "The band is opaque, so nothing under it shows through.",
      ],
    },
    sources: ["W3C, Understanding WCAG 2.2, Success Criterion 1.4.3 Contrast (Minimum)"],
  },
  {
    id: "oklch",
    title: "Why HSL lightness misleads",
    body: `
      <p>HSL lightness is arithmetic on the red, green and blue channels: halfway between the largest and the smallest. It ignores how much lighter the eye sees green and yellow than blue. <code>hsl(60 100% 50%)</code> and <code>hsl(240 100% 50%)</code> both say 50%, and white text measures 1.07:1 on the first and 8.59:1 on the second.</p>
      <p>OKLCH comes from Björn Ottosson's Oklab (2020) and is part of CSS Color Module Level 4. Oklab was fitted to perceptual data, so OKLCH lightness tracks perceived lightness across hues far better than HSL. Two colours at the same OKLCH lightness are close in luminance, which makes contrast pairs easy to plan. Close is not equal: the ratio still comes from WCAG's luminance formula.</p>
      <p>APCA, a newer contrast method, is a proposal. As of April 2026 the WCAG 3 draft says its contrast algorithm is yet to be determined, so client work here is checked against WCAG 2.x.</p>
      <p class="try">Sweep the hue and compare the two rows.</p>`,
    demo: hslVsOklch,
    gate: {
      kind: "choice",
      prompt:
        "You pick two button colours at the same OKLCH lightness, one blue and one orange. What do you still need to do?",
      options: [
        "Measure white text on each: the ratios will be close but not identical",
        "Nothing: equal OKLCH lightness means equal contrast",
        "Convert both to HSL and compare their lightness",
        "Give them equal chroma, which fixes the ratio",
      ],
      answer: 0,
      note: "OKLCH gets you close by design. The WCAG formula gives the number you report.",
      why: [
        "",
        "OKLCH lightness is not WCAG relative luminance. Chroma and hue move luminance a little.",
        "HSL lightness is the less reliable guide of the two. Yellow and blue at 50% are far apart.",
        "Equal chroma does not make luminance equal. Only the formula gives the ratio.",
      ],
    },
    sources: [
      "Ottosson 2020, A perceptual color space for image processing",
      "W3C, CSS Color Module Level 4",
      "W3C, WCAG 2, relative luminance definition",
      "Somers, APCA introduction (Myndex Research)",
      "Roselli 2026, WCAG3 contrast as of April 2026",
    ],
  },
  {
    id: "palette",
    title: "Lightness, chroma, hue",
    body: `
      <p>An OKLCH colour is three numbers. <strong>Lightness</strong> runs from 0% (black) to 100% (white). <strong>Chroma</strong> is how colourful it is: 0 is grey, and this game counts anything above 0.1 as an accent. <strong>Hue</strong> is an angle round the colour wheel: about 30 is red, 140 green and 265 blue.</p>
      <p>A studio palette is a few neutrals at low chroma and one or two accents. Ada's rule: two accent hues at most, so each one can mean something. Write each colour once as a custom property and use it through <code>var()</code>.</p>
      <pre class="code-block"><code>:root {
  --ink: oklch(30% 0.02 50);
  --clay: oklch(50% 0.13 40);
}
.book { background: var(--clay); }</code></pre>`,
    demo: accentButton,
    gate: {
      kind: "goal",
      goal: "Make an accent button: chroma above 0.1, with its white label at 4.5:1 or more.",
      note: "A white label needs a fairly dark fill. In OKLCH you lower the lightness and the hue stays where you put it.",
    },
    sources: [
      "Ottosson 2020, A perceptual color space for image processing",
      "W3C, CSS Color Module Level 4",
    ],
  },
  {
    id: "colour-alone",
    title: "Never by colour alone",
    body: `
      <p>WCAG 2.x Success Criterion 1.4.1: colour must not be the only visual means of conveying information or distinguishing an element. The Understanding document's own example is a required form field marked with both red text and an icon.</p>
      <p>Birch's review of population surveys puts red-green colour deficiency at about 8% of men and 0.4% of women of European descent, and 4 to 6.5% of men of Chinese and Japanese descent. On a form where only the border turns red, those readers see a form that refuses to send and no sign of why.</p>
      <p class="try">Switch the view to greyscale. Then add cues until the field with the problem stands out again.</p>`,
    demo: colourAlone,
    gate: {
      kind: "goal",
      goal: "With the view in greyscale, add at least one cue so the field with the problem still stands out.",
      note: "A heavier border and a word both survive greyscale. Keep the red as well: colour can help, as long as it is not the only signal.",
    },
    sources: [
      "W3C, Understanding WCAG 2.2, Success Criterion 1.4.1 Use of Color",
      "Birch 2012, Worldwide prevalence of red-green color deficiency",
    ],
  },
  {
    id: "links",
    title: "Links in running text",
    body: `
      <p>Inside a paragraph, a link has to stand out from the words around it. Colour alone works only for readers who can see the difference, and a dark green link beside near-black text differs mostly in hue.</p>
      <p>WCAG Technique G183 allows colour-only links when the link colour has 3:1 contrast with the surrounding text and the link gains another cue, such as an underline, on hover and focus. A check on a still page cannot see hover, so this studio underlines links in running text. Links in a navigation bar are a different case: their position already says they are links.</p>
      <p class="try">Try both link styles in greyscale.</p>`,
    demo: linkCue,
    gate: {
      kind: "choice",
      prompt: "Which link style works for every reader inside a paragraph?",
      options: [
        "A darker green than the text, no underline",
        "Bold, in the same colour as the text",
        "Underlined, in the link colour",
        "Underlined only on hover",
      ],
      answer: 2,
      note: "The underline is the convention readers already know, and it survives greyscale.",
      why: [
        "Two dark colours differ mainly in hue, which is the cue colour-deficient readers lose.",
        "Bold reads as emphasis. Nothing tells the reader it can be clicked.",
        "",
        "Touch screens have no hover, and a reader has to find the link before hovering on it.",
      ],
    },
    sources: [
      "W3C, Technique G183",
      "W3C, Understanding WCAG 2.2, Success Criterion 1.4.1 Use of Color",
    ],
  },
];
