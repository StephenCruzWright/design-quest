import { slider, toggleGroup } from "../../ui/controls";
import { $ } from "../../util/dom";
import type { DemoContext, LessonSection } from "../types";

const DISHES = [
  ["Country loaf", "Wheat, rye and 36 hours of patience."],
  ["Seeded rye", "Dense, dark and nutty, seeds all the way through."],
  ["Cardamom knot", "Laminated dough with cardamom sugar."],
];

/** Demo: two sliders control the gap inside a pair and the gap between pairs. */
function proximityDial(host: HTMLElement, ctx: DemoContext) {
  host.innerHTML = `
    <div class="demo-split">
      <div class="demo-stage" aria-live="polite">
        <div class="prox-list">${DISHES.map(
          ([t, d]) => `<div class="prox-item"><strong>${t}</strong><span>${d}</span></div>`,
        ).join("")}</div>
      </div>
      <div class="demo-controls"></div>
    </div>
    <p class="demo-readout"></p>`;
  const list = $<HTMLElement>(host, ".prox-list");
  const readout = $<HTMLElement>(host, ".demo-readout");
  const controls = $<HTMLElement>(host, ".demo-controls");
  const state = { inside: 16, between: 16 };
  const update = () => {
    list.style.setProperty("--inside", `${state.inside}px`);
    list.style.setProperty("--between", `${state.between}px`);
    const r = state.between / Math.max(1, state.inside);
    const verdict =
      r >= 2
        ? "Ada's rule met: three dishes."
        : r >= 1.5
          ? "In lab dot patterns this ratio is enough to group. On a page of uneven text lines it is borderline."
          : r > 0.8
            ? "Near equal: six evenly spaced lines. Which description belongs to which name?"
            : "Inverted: each description now sits closer to the next dish.";
    readout.innerHTML = `<strong>${r.toFixed(1)}×</strong> between ÷ within. ${verdict}`;
    if (r >= 2) ctx.complete();
  };
  controls.append(
    slider({
      label: "Gap inside a dish",
      min: 0,
      max: 40,
      value: state.inside,
      unit: "px",
      onInput: (v) => {
        state.inside = v;
        update();
      },
    }),
    slider({
      label: "Gap between dishes",
      min: 0,
      max: 48,
      value: state.between,
      unit: "px",
      onInput: (v) => {
        state.between = v;
        update();
      },
    }),
  );
  update();
}

/** Demo: a heading with symmetric margins floats; asymmetric margins attach it. */
function headingHug(host: HTMLElement) {
  host.innerHTML = `
    <div class="demo-stage hug-stage" data-mode="float">
      <p class="hug-text">…and that's why we still bake the rye on Tuesdays only.</p>
      <h4 class="hug-heading">Opening hours</h4>
      <p class="hug-text">Weekdays 7–15. Saturdays 7–13. Sundays we sleep.</p>
    </div>
    <div class="demo-controls-row"></div>`;
  const stage = $<HTMLElement>(host, ".hug-stage");
  $(host, ".demo-controls-row").append(
    toggleGroup({
      label: "Heading margins",
      options: [
        { value: "float", label: "margin: 24px 0" },
        { value: "hug", label: "margin: 40px 0 4px" },
      ],
      value: "float",
      onChange: (v) => (stage.dataset.mode = v),
    }),
  );
}

function scaleSteps(base: number, ratio: number, count: number): number[] {
  return Array.from({ length: count }, (_, i) => Math.round(base * ratio ** i));
}

/** Demo: linear vs geometric scale, with live tokens you can copy. */
function scaleLab(host: HTMLElement, ctx: DemoContext) {
  host.innerHTML = `
    <div class="scale-compare">
      <figure><figcaption>Linear: +4px each step</figcaption><div class="bars" data-kind="linear"></div></figure>
      <figure><figcaption>Ratio: ×<span class="ratio-label"></span> each step</figcaption><div class="bars" data-kind="ratio"></div></figure>
    </div>
    <div class="demo-controls-row"></div>
    <pre class="code-block"><code class="tokens-out"></code></pre>`;
  const linear = $<HTMLElement>(host, '[data-kind="linear"]');
  const ratioBars = $<HTMLElement>(host, '[data-kind="ratio"]');
  const label = $<HTMLElement>(host, ".ratio-label");
  const out = $<HTMLElement>(host, ".tokens-out");
  const names = ["3xs", "2xs", "xs", "s", "m", "l", "xl"];
  const bars = (vals: number[]) =>
    vals
      .map((v, i) => {
        const prev = vals[i - 1];
        const step = prev ? Math.round((v / prev - 1) * 100) : null;
        const weak = step !== null && step < 25;
        return `<div class="bar-row${weak ? " is-weak" : ""}"><span class="bar" style="inline-size:${v}px"></span><span class="bar-val">${v}px${step !== null ? ` <small>+${step}%${weak ? " · under Ada's 25%" : ""}</small>` : ""}</span></div>`;
      })
      .join("");
  let ratio = 1.5;
  const update = () => {
    label.textContent = ratio.toFixed(2);
    linear.innerHTML = bars([4, 8, 12, 16, 20, 24, 28]);
    const vals = scaleSteps(4, ratio, 7);
    ratioBars.innerHTML = bars(vals);
    out.textContent = `:root {\n${vals.map((v, i) => `  --space-${names[i]}: ${v / 16}rem; /* ${v}px */`).join("\n")}\n}`;
    if (ratio >= 1.25) ctx.complete();
  };
  $(host, ".demo-controls-row").append(
    slider({
      label: "Ratio",
      min: 1.2,
      max: 2,
      step: 0.05,
      value: ratio,
      onInput: (v) => {
        ratio = v;
        update();
      },
    }),
  );
  update();
}

const CARD = `
  <p class="tc-eyebrow">Workshop</p>
  <h4 class="tc-title">Intro to hand-cut dovetails</h4>
  <p class="tc-meta">Sat 14 June · 3 hours</p>
  <p class="tc-body">Learn to mark, saw and chop a through-dovetail with nothing but hand tools.</p>
  <span class="tc-btn">Book a seat</span>`;

/** Demo: the same card spaced three ways. */
function flatVsTiered(host: HTMLElement) {
  host.innerHTML = `
    <div class="tri-cards">
      <figure><div class="tc" data-v="even">${CARD}</div><figcaption><strong>Even 16px.</strong> Consistent, but everything is equally related.</figcaption></figure>
      <figure><div class="tc" data-v="grid">${CARD}</div><figcaption><strong>24px, on an 8px grid.</strong> Still flat, just looser.</figcaption></figure>
      <figure><div class="tc" data-v="tiered">${CARD}</div><figcaption><strong>Tiered 4 / 24.</strong> Label, title and meta clump into one header; body and button stand apart.</figcaption></figure>
    </div>`;
}

/** Demo: colour the three tiers of space on a mini page. */
function tierHighlighter(host: HTMLElement) {
  const group = (t: string, d: string) =>
    `<div class="tp-group"><b>${t}</b><i class="tp-gap t1"></i><span>${d}</span></div>`;
  const section = (h: string, items: [string, string][]) =>
    `<div class="tp-section"><h5>${h}</h5><i class="tp-gap t2"></i>${items.map((it, i) => (i ? '<i class="tp-gap t2"></i>' : "") + group(...it)).join("")}</div>`;
  host.innerHTML = `
    <div class="tier-page" data-show="off">
      ${section("Breads", [
        ["Country loaf", "€6.50 · wheat & rye"],
        ["Seeded rye", "€7.00 · dense, nutty"],
      ])}
      <i class="tp-gap t3"></i>
      ${section("Pastries", [
        ["Cardamom knot", "€3.20 · laminated"],
        ["Almond croissant", "€3.60 · twice-baked"],
      ])}
    </div>
    <div class="demo-controls-row"></div>
    <ul class="tier-legend">
      <li><span class="sw t1"></span> Tier 1 · inside a group (4–8px)</li>
      <li><span class="sw t2"></span> Tier 2 · between groups (16–24px)</li>
      <li><span class="sw t3"></span> Tier 3 · between sections (40–64px)</li>
    </ul>`;
  const page = $<HTMLElement>(host, ".tier-page");
  $(host, ".demo-controls-row").append(
    toggleGroup({
      label: "Show tiers",
      options: [
        { value: "off", label: "Off" },
        { value: "on", label: "Highlight space" },
      ],
      value: "off",
      onChange: (v) => (page.dataset.show = v),
    }),
  );
}

export const lesson: LessonSection[] = [
  {
    id: "signal",
    title: "Space is a signal",
    body: `
      <p>In 1923 Max Wertheimer drew a row of dots with gaps that alternated between 3mm and 12mm. It is normally seen as pairs, grouped across the small gaps. He called the effect <strong>proximity</strong>: elements that sit close together are seen as belonging together.</p>
      <p>Grouping by proximity is fast. In lab tests it shows up within about a tenth of a second, sooner than grouping by shape, and some experiments find it shapes what people do even when their attention is elsewhere.</p>
      <p>On a page with even gaps, proximity has nothing to work with. The reader has to read the words to find the structure.</p>
      <p class="try">Set both gaps equal, then pull the dishes apart. Watch the six lines become three dishes.</p>`,
    demo: proximityDial,
    gate: {
      kind: "goal",
      goal: "Make the gap between dishes at least 2× the gap inside a dish.",
      note: "Each name now sits closer to its own description than to the next dish, so the eye pairs them before reading.",
    },
    sources: [
      "Wertheimer 1923, Laws of organization in perceptual forms (Ellis 1938 translation)",
      "Han, Song, Ding, Yund & Woods 2001, Neural substrates for visual perceptual grouping",
      "Rashal, Yeshurun & Kimchi 2017, Attentional requirements in perceptual grouping",
    ],
  },
  {
    id: "between-within",
    title: "Between > within",
    body: `
      <p>Proximity can be measured. In dot-pattern experiments by Kubovy, Holcombe and Wagemans, what decides the grouping is the ratio between gaps, not their size in pixels. Once one gap is about 1.5 times the other, people almost never group across the larger one.</p>
      <p>Pages are messier than dot patterns: lines of text have different lengths, and colour and borders compete with spacing. So the studio works with a safety margin. <strong>Ada's rule: the gap between groups is at least 2× the largest gap inside them.</strong></p>
      <p>The common way to break it is the floating heading. With <code>margin: 24px 0</code> a heading sits exactly halfway between the previous section and its own content.</p>`,
    demo: headingHug,
    gate: {
      kind: "choice",
      prompt:
        "A heading has margin: 24px 0, with text above and below it. Which text does it group with?",
      options: [
        "Neither: it sits halfway between both",
        "The text below it, because headings introduce what follows",
        "The text above it, because it is read after that text",
        "Both, which is what balanced margins are for",
      ],
      answer: 0,
      note: "Equal gaps give proximity nothing to work with. Give the heading far more space above than below, such as margin: 40px 0 4px.",
      why: [
        "",
        "That is what the heading is for, but the spacing doesn't say so. With equal gaps the eye has no reason to pair it with either side.",
        "Reading order doesn't create grouping. The gaps are equal, so the heading is as close to the text above as to the text below.",
        "Grouping with both sides at once is grouping with neither. The heading should hug what it introduces.",
      ],
    },
    sources: [
      "Kubovy, Holcombe & Wagemans 1998, On the lawfulness of grouping by proximity",
      "Wagemans et al. 2012, A century of Gestalt psychology in visual perception I",
    ],
  },
  {
    id: "ratios",
    title: "Scales are ratios, not steps",
    body: `
      <p>We judge size by proportion. <strong>Weber's law</strong>: the smallest difference people can detect is a fixed fraction of the size being compared. For the length of a line that fraction is about 3 to 4%.</p>
      <p>So 28px and 32px, 14% apart, can be told apart when you compare them side by side. Across a busy page, with the two gaps far apart, a 4px difference does not read as a deliberate step. A 4px step from 4px to 8px is a doubling.</p>
      <p>A <strong>ratio scale</strong> multiplies each step by the same number, so every step is the same proportion larger than the last. Ada's rule: each step at least 25% above the one before, about 1.5× for spacing. Published design systems use ratios between about 1.25 and 2.</p>
      <p class="try">Compare the two columns, then move the ratio. Copy the tokens if you like the result.</p>`,
    demo: scaleLab,
    gate: {
      kind: "goal",
      goal: "Set a ratio where every step is at least 25% larger than the one before.",
      note: "From 1.25 up, no two steps are close enough to be mistaken for each other on a page.",
    },
    sources: [
      "Lubashevsky 2018, Psychophysical laws as reflection of mental space properties (Weber fractions)",
      "Pickering & Bell, Every Layout: modular scale (practice)",
      "IBM Carbon design system, spacing tokens (practice)",
    ],
  },
  {
    id: "flat",
    title: "A grid is not a hierarchy",
    body: `
      <p>An 8px grid keeps your numbers consistent. Material Design aligns components to one, and many teams use it. Consistency is not hierarchy, though. A page where everything is 24px apart is on the grid and flat: every element is as close to every other.</p>
      <p>Hierarchy comes from <strong>differences between spaces</strong>. Pull related things together, push unrelated things apart, and the layout tells the reader what goes with what.</p>`,
    demo: flatVsTiered,
    gate: {
      kind: "choice",
      prompt:
        "Everything on a landing page is exactly 24px apart, on an 8px grid. The client says it looks like a template. What is missing?",
      options: [
        "Different gaps for different relationships: tight inside groups, wide between them",
        "A stricter grid, such as 4px",
        "More colour",
        "A larger base font size",
      ],
      answer: 0,
      note: "Equal gaps say every element is equally related. Varying the gaps is what creates groups.",
      why: [
        "",
        "A finer grid makes the numbers more consistent. The gaps would still all be equal.",
        "Colour can group things too, but the spacing would still say every element is equally related.",
        "Type size changes the elements, not the relationships between them.",
      ],
    },
    sources: ["Material Design, the 8dp grid (practice)"],
  },
  {
    id: "tiers",
    title: "Three tiers of space",
    body: `
      <p>Proximity nests. A real page needs at least three tiers:</p>
      <ol>
        <li><strong>Inside a group</strong>: a title and its meta line. Tight: 4 to 8px.</li>
        <li><strong>Between groups</strong>: one dish and the next. Medium: 16 to 24px.</li>
        <li><strong>Between sections</strong>: Breads and Pastries. 40 to 64px or more.</li>
      </ol>
      <p>Ada's rule: each tier at least 1.5× the one below it. It follows that <strong>inner ≤ outer</strong>: a card's padding shouldn't exceed the gap between cards, or each card's content sits nearer its neighbour's edge than its own.</p>`,
    demo: tierHighlighter,
    gate: {
      kind: "choice",
      prompt: "Pricing cards have 22px of padding and sit 6px apart. What happens?",
      options: [
        "The cards blur into one slab, because content is closer to the next card than to its own edge",
        "Nothing: padding and gaps are unrelated",
        "The cards look more spacious",
        "Only the text size matters here",
      ],
      answer: 0,
      note: "Inner ≤ outer. Widen the gap between cards to at least the padding inside them.",
      why: [
        "",
        "Both are distances the eye compares. Padding is space inside a group, and the gap is space between groups.",
        "Spacious inside, cramped between: the cards read as one block with lines through it.",
        "Spacing decides the grouping here, whatever the text size.",
      ],
    },
    sources: ["Wagemans et al. 2012", "IBM Carbon design system, spacing tokens (practice)"],
  },
  {
    id: "system",
    title: "Make it a system",
    body: `
      <p>In code, decide once and give the decision a name. Declare a handful of tokens as custom properties, then use nothing else:</p>
      <pre class="code-block"><code>:root {
  --space-3xs: 0.25rem;  /*  4 */
  --space-2xs: 0.5rem;   /*  8 */
  --space-s:   1rem;     /* 16 */
  --space-m:   1.5rem;   /* 24 */
  --space-l:   2.5rem;   /* 40 */
  --space-xl:  clamp(2.5rem, 1.5rem + 4vw, 4rem); /* fluid section space */
}

/* Groups: gap applies only BETWEEN items. No collapsing, no :last-child fixes. */
.menu-list { display: grid; gap: var(--space-m); }

/* Headings hug what they introduce */
h2 { margin: var(--space-xl) 0 var(--space-2xs); }</code></pre>
      <p><code>gap</code> on a flex or grid container puts space between items only, and it never collapses the way vertical margins do. <code>clamp()</code> lets section space grow with the screen between a floor and a ceiling.</p>
      <p>On a client page the judges measure the rendered page: the real gaps between groups, every distinct computed margin, padding and gap value, and whether your declarations use tokens.</p>`,
    gate: {
      kind: "choice",
      prompt:
        "Why is gap on a grid container usually better than margins on its children for spacing groups?",
      options: [
        "It applies only between items, so there are no :last-child fixes and no margin collapse",
        "It renders faster",
        "It accepts negative values",
        "Margins are deprecated",
      ],
      answer: 0,
      note: "gap describes a relationship between siblings, which is what proximity is about.",
      why: [
        "",
        "Speed is not the reason. The difference is where the space goes: gap puts it only between items.",
        "gap does not accept negative values. Margins do.",
        "Margins are not deprecated. They are still the right tool for space outside a single element.",
      ],
    },
    sources: ["W3C, CSS Box Alignment Module Level 3 (gap)", "W3C, CSS 2.2, collapsing margins"],
  },
];
