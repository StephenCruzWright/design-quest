import { contrastRatio, parseColor } from "../../engine/measure/color";
import { slider, toggleGroup } from "../../ui/controls";
import { $ } from "../../util/dom";
import type { DemoContext, LessonSection } from "../types";

const STAGE_BG = "#fbf8f2";

/** Demo: blur a busy page until the words go. What still stands out? */
function squint(host: HTMLElement) {
  host.innerHTML = `
    <div class="demo-stage squint-stage">
      <div class="sq-page">
        <p class="sq-logo">Tidewater</p>
        <p class="sq-offer">First lesson free</p>
        <p class="sq-body">Saturday mornings at the Harbour Road pool. Book a 30-minute trial and meet the coach.</p>
        <p class="sq-body">Ages 3 to 12. Goggles, floats and fins provided.</p>
        <span class="sq-btn">Book a trial</span>
      </div>
    </div>
    <div class="demo-controls-row"></div>`;
  const page = $<HTMLElement>(host, ".sq-page");
  $(host, ".demo-controls-row").append(
    slider({
      label: "Blur",
      min: 0,
      max: 8,
      value: 0,
      unit: "px",
      onInput: (v) => page.style.setProperty("filter", v ? `blur(${v}px)` : "none"),
    }),
  );
}

/** Demo: three dials on a loud date. Step it back until the event name leads. */
function threeDials(host: HTMLElement, ctx: DemoContext) {
  host.innerHTML = `
    <div class="demo-split">
      <div class="demo-stage dial-stage" style="background:${STAGE_BG}">
        <p class="dial-date">Friday 14 March</p>
        <p class="dial-name">The Night Office</p>
        <p class="dial-body">Doors 19:00. Standing only.</p>
      </div>
      <div class="demo-controls"></div>
    </div>
    <p class="demo-readout"></p>`;
  const date = $<HTMLElement>(host, ".dial-date");
  const readout = $<HTMLElement>(host, ".demo-readout");
  const NAME_SIZE = 22;
  const state = { size: 22, weight: 800, lightness: 45 };
  const update = () => {
    const colour = `oklch(${state.lightness}% 0.17 27)`;
    date.style.fontSize = `${state.size}px`;
    date.style.fontWeight = String(state.weight);
    date.style.color = colour;
    const fg = parseColor(colour);
    const bg = parseColor(STAGE_BG);
    const ratio = fg && bg ? contrastRatio(fg, bg) : 0;
    const quieter = state.size <= NAME_SIZE * 0.8 || state.weight <= 400 || state.lightness >= 58;
    const readable = ratio >= 4.5;
    readout.innerHTML = `Date: <strong>${state.size}px</strong>, weight <strong>${state.weight}</strong>, contrast <strong>${ratio.toFixed(1)}:1</strong>. ${
      !readable
        ? "Below 4.5:1: the date is now hard to read. Darken it."
        : quieter
          ? "The event name leads, and the date is still readable."
          : "The date still competes with the event name."
    }`;
    if (quieter && readable) ctx.complete();
  };
  $(host, ".demo-controls").append(
    slider({
      label: "Size",
      min: 12,
      max: 26,
      value: state.size,
      unit: "px",
      onInput: (v) => {
        state.size = v;
        update();
      },
    }),
    slider({
      label: "Weight",
      min: 300,
      max: 900,
      step: 100,
      value: state.weight,
      onInput: (v) => {
        state.weight = v;
        update();
      },
    }),
    slider({
      label: "Lightness (OKLCH)",
      min: 30,
      max: 85,
      value: state.lightness,
      unit: "%",
      onInput: (v) => {
        state.lightness = v;
        update();
      },
    }),
  );
  update();
}

const INTERVALS: [number, string][] = [
  [1.067, "minor second"],
  [1.125, "major second"],
  [1.2, "minor third"],
  [1.25, "major third"],
  [1.333, "perfect fourth"],
  [Math.SQRT2, "augmented fourth"],
  [1.5, "perfect fifth"],
  [1.618, "golden ratio"],
];

/** Demo: a modular type scale built from one ratio. */
function modularScale(host: HTMLElement, ctx: DemoContext) {
  host.innerHTML = `
    <div class="demo-stage scale-stage" style="background:${STAGE_BG}"></div>
    <div class="demo-controls-row"></div>
    <p class="demo-readout"></p>`;
  const stage = $<HTMLElement>(host, ".scale-stage");
  const readout = $<HTMLElement>(host, ".demo-readout");
  const labels = ["Annual report", "Revenue", "By region", "Northern office"];
  let ratio = 1.067;
  const update = () => {
    const sizes = [4, 3, 2, 1].map((n) => Math.round(16 * ratio ** n));
    stage.innerHTML = `${labels
      .map(
        (t, i) =>
          `<p class="ms-h" style="font-size:${sizes[i]}px">${t} <small>${sizes[i]}px</small></p>`,
      )
      .join("")}<p class="ms-body">Northern sales rose for the third year. <small>16px</small></p>`;
    const named = INTERVALS.reduce((a, b) =>
      Math.abs(b[0] - ratio) < Math.abs(a[0] - ratio) ? b : a,
    );
    const pct = Math.round((ratio - 1) * 100);
    readout.innerHTML = `<strong>×${ratio.toFixed(3)}</strong> (near a ${named[1]}): each step is ${pct}% larger than the one below. ${
      ratio >= 1.2
        ? "Every level is a visible step."
        : "Neighbouring levels are close enough to be confused."
    }`;
    if (ratio >= 1.2) ctx.complete();
  };
  $(host, ".demo-controls-row").append(
    slider({
      label: "Ratio",
      min: 1.05,
      max: 1.62,
      step: 0.01,
      value: ratio,
      onInput: (v) => {
        ratio = v;
        update();
      },
    }),
  );
  update();
}

const PROMO: [string, boolean][] = [
  ["Spring sale", true],
  ["Every jacket 30% off until Sunday.", true],
  ["Free returns within 30 days of delivery.", true],
  ["Use code SPRING at checkout.", true],
  ["Offer ends 23:59 on Sunday 6 April.", true],
];

/** Demo: toggle bold line by line and watch the share of bold text. */
function boldShare(host: HTMLElement, ctx: DemoContext) {
  host.innerHTML = `
    <div class="demo-split">
      <div class="demo-stage bold-stage" style="background:${STAGE_BG}"></div>
      <div class="demo-controls bold-controls"></div>
    </div>
    <p class="demo-readout"></p>`;
  const stage = $<HTMLElement>(host, ".bold-stage");
  const controls = $<HTMLElement>(host, ".bold-controls");
  const readout = $<HTMLElement>(host, ".demo-readout");
  const bold = PROMO.map(([, b]) => b);
  const update = () => {
    stage.innerHTML = PROMO.map(
      ([t], i) =>
        `<p class="${i === 0 ? "bs-head" : "bs-line"}" style="font-weight:${bold[i] ? 700 : 400}">${t}</p>`,
    ).join("");
    const total = PROMO.reduce((n, [t]) => n + t.length, 0);
    const heavy = PROMO.reduce((n, [t], i) => n + (bold[i] ? t.length : 0), 0);
    const share = heavy / total;
    readout.innerHTML = `<strong>${Math.round(share * 100)}%</strong> of the characters are bold. ${
      share <= 0.3 && bold[0]
        ? "Bold now marks the headline and one detail."
        : !bold[0]
          ? "The headline lost its bold. Keep it."
          : "Above 30%: bold is the norm here, not the exception."
    }`;
    if (share <= 0.3 && bold[0]) ctx.complete();
  };
  PROMO.forEach(([t], i) => {
    controls.append(
      toggleGroup({
        label: t,
        options: [
          { value: "bold", label: "Bold" },
          { value: "plain", label: "Plain" },
        ],
        value: "bold",
        onChange: (v) => {
          bold[i] = v === "bold";
          update();
        },
      }),
    );
  });
  update();
}

/** Demo: the same card made louder versus its details made quieter. */
function stepBack(host: HTMLElement) {
  host.innerHTML = `
    <div class="demo-stage stepback-stage" data-mode="loud" style="background:${STAGE_BG}">
      <p class="sb-meta">Halden Records · Jazz reissue</p>
      <p class="sb-title">Night Ferry</p>
      <p class="sb-meta">180g vinyl · €32 · Ships in 2 days</p>
    </div>
    <div class="demo-controls-row"></div>`;
  const stage = $<HTMLElement>(host, ".stepback-stage");
  $(host, ".demo-controls-row").append(
    toggleGroup({
      label: "Approach",
      options: [
        { value: "loud", label: "Make the title louder" },
        { value: "quiet", label: "Make the details quieter" },
      ],
      value: "loud",
      onChange: (v) => (stage.dataset.mode = v),
    }),
  );
}

/** Demo: a heading in px, vw and clamp() across viewport widths. */
function fluidType(host: HTMLElement) {
  host.innerHTML = `
    <div class="fluid-rows"></div>
    <div class="demo-controls-row"></div>`;
  const rows = $<HTMLElement>(host, ".fluid-rows");
  const modes: [string, (w: number) => number][] = [
    ["font-size: 40px", () => 40],
    ["font-size: 6vw", (w) => w * 0.06],
    [
      "font-size: clamp(2rem, 1.5rem + 2vw, 3rem)",
      (w) => Math.min(48, Math.max(32, 24 + w * 0.02)),
    ],
  ];
  const update = (w: number) => {
    rows.innerHTML = modes
      .map(
        ([code, size]) =>
          `<figure class="fluid-row"><figcaption><code>${code}</code> <strong>${Math.round(size(w))}px</strong></figcaption><p style="font-size:${Math.min(size(w), 90)}px">Free first lesson</p></figure>`,
      )
      .join("");
  };
  $(host, ".demo-controls-row").append(
    slider({
      label: "Screen width",
      min: 320,
      max: 1600,
      step: 20,
      value: 760,
      unit: "px",
      onInput: update,
    }),
  );
  update(760);
}

export const lesson: LessonSection[] = [
  {
    id: "first-look",
    title: "Where the eye lands",
    body: `
      <p>Visual search experiments show that attention is guided by a short list of attributes, size and colour among them. An item that differs from its neighbours on one of those attributes is found faster. Salience is relative: a heading stands out because of its difference from what surrounds it, not because of its own size.</p>
      <p>Designers check this with the <strong>squint test</strong> (a practice, not an experiment): blur the page until the words go. What still stands out is what differs most from its surroundings.</p>
      <p class="try">Drag the blur up until you can't read the text. Note which shape survives.</p>`,
    demo: squint,
    gate: {
      kind: "choice",
      prompt: "With the page blurred, which element still stands out?",
      options: [
        "The large offer line",
        "The body paragraphs",
        "The logo",
        "Nothing: blurred pages have no hierarchy",
      ],
      answer: 0,
      note: "The offer is the largest, heaviest text, so it survives the blur. That is the element the page leads with.",
      why: [
        "",
        "The paragraphs blur into grey bars of equal weight. They are the background the offer stands out from.",
        "The logo is small and light here. It blurs out before the offer does.",
        "Blur removes the words but keeps size, weight and contrast. Those still separate the elements.",
      ],
    },
    sources: [
      "Treisman & Gelade 1980, A feature-integration theory of attention",
      "Wolfe & Horowitz 2017, Five factors that guide attention in visual search",
      "Itti & Koch 2001, Computational modelling of visual attention",
    ],
  },
  {
    id: "three-dials",
    title: "Three dials: size, weight, colour",
    body: `
      <p>Importance is set with three separate dials. <strong>Size</strong>: bigger reads as more important. <strong>Weight</strong>: bold reads as more important. <strong>Colour</strong>: higher contrast with the background reads as more important.</p>
      <p>Visual search research lists size and colour among the attributes that guide attention. Ada's rule: turn one dial at a time, look, then decide on the next.</p>
      <p>On the card below, a Lorem &amp; Ipsum date is out-shouting the event. Turn the date down, not the event up.</p>`,
    demo: threeDials,
    gate: {
      kind: "goal",
      goal: "Step the date back on at least one dial until the event name leads, keeping the date at 4.5:1 contrast or more.",
      note: "Lowering a detail raises everything around it. The 4.5:1 floor is WCAG 2.x Success Criterion 1.4.3 for normal-size text.",
    },
    sources: ["Wolfe & Horowitz 2017", "W3C, WCAG 2.2, Success Criterion 1.4.3 Contrast (Minimum)"],
  },
  {
    id: "ratio",
    title: "A type scale is a ratio",
    body: `
      <p>Heading sizes work like the spacing scale from the first desk: each step is the last one multiplied by a ratio. Tim Brown and Scott Kellum's Modular Scale calculator names its ratios after musical intervals: 1.2 is a minor third, 1.25 a major third, 1.5 a perfect fifth. The names are an analogy. No study shows that ratios that sound consonant look better in type.</p>
      <p>Eye-tracking studies of web reading find that distinct headings let readers scan from heading to heading. A small ratio puts neighbouring levels within a few pixels of each other, and a subsection reads as another section. Ada's rule for client work: at least 1.2× between neighbouring levels.</p>`,
    demo: modularScale,
    gate: {
      kind: "goal",
      goal: "Set a ratio where every heading level is at least 20% larger than the one below it.",
      note: "From 1.2 up, every level is a visible step. Larger ratios suit pages with few levels; smaller ones suit long documents with many.",
    },
    sources: [
      "Brown 2011, More Meaningful Typography, A List Apart",
      "Kellum & Brown, Modular Scale calculator",
      "Pernice 2019, Text scanning patterns: eyetracking evidence, NN/g",
    ],
  },
  {
    id: "bold",
    title: "When everything is bold",
    body: `
      <p>Bold is a difference. It only marks something out when the text around it is plain. In eye-tracking studies of web pages, bold words draw fixations: readers skimming a page land on them. Bold on most lines spends those fixations everywhere.</p>
      <p>No study sets a number for too much bold. Ada's rule: no more than 30% of the characters on a page in bold. Headings and one or two must-find details fit inside that.</p>`,
    demo: boldShare,
    gate: {
      kind: "goal",
      goal: "Take bold off the lines that don't need it, until 30% or less of the text is bold and the headline is still bold.",
      note: "With bold on the headline and at most one detail, both are found at a glance because everything else is plain.",
    },
    sources: [
      "Pernice 2019, Text scanning patterns: eyetracking evidence, NN/g",
      "Butterick, Practical Typography: summary of key rules",
    ],
  },
  {
    id: "step-back",
    title: "Emphasise by stepping back",
    body: `
      <p>The usual reaction to "people can't find the title" is to make the title louder. The page then gets louder overall, and the next element to be lost gets louder still.</p>
      <p>The other way works on the neighbours, a practice Refactoring UI calls "de-emphasize to emphasize". Make secondary details (dates, categories, prices that are not the point) smaller, lighter or lower in contrast. Salience is relative, so the title rises without changing. Keep stepped-back text at 4.5:1 contrast or more, the WCAG 2.x minimum for body-size text.</p>`,
    demo: stepBack,
    gate: {
      kind: "choice",
      prompt:
        "A show title is lost among bold, coloured dates. Which change keeps the page calm and lets the title lead?",
      options: [
        "Make the dates 14px, normal weight, in a quieter colour above 4.5:1",
        "Make the title bold, red and underlined",
        "Make the dates light grey at 2.5:1 contrast",
        "Put the title in a box with a drop shadow",
      ],
      answer: 0,
      note: "Stepping the dates back raises the title without adding a louder element, and the dates stay readable.",
      why: [
        "",
        "The title now competes with the dates on every dial at once, and the page is louder overall.",
        "2.5:1 is below the WCAG 2.x minimum of 4.5:1 for body-size text. Quiet must still be readable.",
        "A box adds another loud shape. The dates are still as loud as before.",
      ],
    },
    sources: [
      "Wathan & Schoger, Refactoring UI (practice)",
      "Itti & Koch 2001",
      "W3C, WCAG 2.2, Success Criterion 1.4.3 Contrast (Minimum)",
    ],
  },
  {
    id: "fluid",
    title: "Fluid type with clamp()",
    body: `
      <p>A heading that looks right at 760px is too big on a phone and too small on a wide monitor. <code>clamp(min, preferred, max)</code> lets it scale with the screen between a floor and a ceiling.</p>
      <p>Mix units in the preferred value: <code>1.5rem + 2vw</code>. The <code>vw</code> part follows the screen. The <code>rem</code> part follows the reader's font settings, so browser zoom still enlarges the text. Text set in <code>vw</code> alone does not grow when the reader zooms, which works against WCAG 2.x Success Criterion 1.4.4 (resize text to 200%).</p>
      <pre class="code-block"><code>h1 { font-size: clamp(2rem, 1.5rem + 2vw, 3rem); }</code></pre>`,
    demo: fluidType,
    gate: {
      kind: "choice",
      prompt:
        "Which heading stays readable on a 320px phone, stops growing on a wide screen and still responds to browser zoom?",
      options: [
        "font-size: clamp(2rem, 1.5rem + 2vw, 3rem)",
        "font-size: 6vw",
        "font-size: 40px",
        "font-size: 10vh",
      ],
      answer: 0,
      note: "clamp() bounds both ends, and its rem term keeps zoom working.",
      why: [
        "",
        "6vw is about 19px at 320px wide and 86px at 1440px, and it ignores zoom.",
        "40px does not change with the screen: too big for a phone, small on a wide monitor.",
        "vh follows the screen height, so the heading changes size when the browser window gets shorter.",
      ],
    },
    sources: [
      "W3C, CSS Values and Units Module Level 4, comparison functions",
      "Gilyead & Mudford, Utopia (practice)",
      "W3C, WCAG 2.2, Success Criterion 1.4.4 Resize Text",
    ],
  },
];
