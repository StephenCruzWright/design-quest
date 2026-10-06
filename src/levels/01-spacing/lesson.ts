import type { LessonSection } from '../types';
import { slider, toggleGroup } from '../../ui/controls';

const DISHES = [
  ['Country loaf', 'Wheat, rye and 36 hours of patience.'],
  ['Seeded rye', 'Dense, dark and nutty, seeds all the way through.'],
  ['Cardamom knot', 'Laminated dough with cardamom sugar.'],
];

/** Demo: two sliders control the gap inside a pair and the gap between pairs. */
function proximityDial(host: HTMLElement) {
  host.innerHTML = `
    <div class="demo-split">
      <div class="demo-stage" aria-live="polite">
        <div class="prox-list">${DISHES.map(
          ([t, d]) => `<div class="prox-item"><strong>${t}</strong><span>${d}</span></div>`,
        ).join('')}</div>
      </div>
      <div class="demo-controls"></div>
    </div>
    <p class="demo-readout"></p>`;
  const list = host.querySelector<HTMLElement>('.prox-list')!;
  const readout = host.querySelector<HTMLElement>('.demo-readout')!;
  const controls = host.querySelector<HTMLElement>('.demo-controls')!;
  const state = { inside: 16, between: 16 };
  const update = () => {
    list.style.setProperty('--inside', `${state.inside}px`);
    list.style.setProperty('--between', `${state.between}px`);
    const r = state.between / Math.max(1, state.inside);
    const verdict =
      r >= 2 ? 'Clear groups: you see three dishes before you read a word.' :
      r >= 1.25 ? 'Weak grouping: you can tell, but you have to look for it.' :
      r > 0.8 ? 'Ambiguous: six equal lines. Which description belongs to which name?' :
      'Inverted: each description now groups with the next dish.';
    readout.innerHTML = `<strong>${r.toFixed(1)}×</strong> between ÷ within. ${verdict}`;
  };
  controls.append(
    slider({ label: 'Gap inside a dish', min: 0, max: 40, value: state.inside, unit: 'px', onInput: (v) => { state.inside = v; update(); } }),
    slider({ label: 'Gap between dishes', min: 0, max: 48, value: state.between, unit: 'px', onInput: (v) => { state.between = v; update(); } }),
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
  const stage = host.querySelector<HTMLElement>('.hug-stage')!;
  host.querySelector('.demo-controls-row')!.append(
    toggleGroup({
      label: 'Heading margins',
      options: [
        { value: 'float', label: 'margin: 24px 0' },
        { value: 'hug', label: 'margin: 40px 0 4px' },
      ],
      value: 'float',
      onChange: (v) => (stage.dataset.mode = v),
    }),
  );
}

function scaleSteps(base: number, ratio: number, count: number): number[] {
  return Array.from({ length: count }, (_, i) => Math.round(base * ratio ** i));
}

/** Demo: linear vs geometric scale, with live tokens you can copy. */
function scaleLab(host: HTMLElement) {
  host.innerHTML = `
    <div class="scale-compare">
      <figure><figcaption>Linear: +4px each step</figcaption><div class="bars" data-kind="linear"></div></figure>
      <figure><figcaption>Ratio: ×<span class="ratio-label"></span> each step</figcaption><div class="bars" data-kind="ratio"></div></figure>
    </div>
    <div class="demo-controls-row"></div>
    <pre class="code-block"><code class="tokens-out"></code></pre>`;
  const linear = host.querySelector<HTMLElement>('[data-kind="linear"]')!;
  const ratioBars = host.querySelector<HTMLElement>('[data-kind="ratio"]')!;
  const label = host.querySelector<HTMLElement>('.ratio-label')!;
  const out = host.querySelector<HTMLElement>('.tokens-out')!;
  const names = ['3xs', '2xs', 'xs', 's', 'm', 'l', 'xl'];
  const bars = (vals: number[]) =>
    vals
      .map((v, i) => {
        const prev = vals[i - 1];
        const step = prev ? Math.round((v / prev - 1) * 100) : null;
        const weak = step !== null && step < 25;
        return `<div class="bar-row${weak ? ' is-weak' : ''}"><span class="bar" style="inline-size:${v}px"></span><span class="bar-val">${v}px${step !== null ? ` <small>+${step}%${weak ? ' · hard to see' : ''}</small>` : ''}</span></div>`;
      })
      .join('');
  let ratio = 1.5;
  const update = () => {
    label.textContent = ratio.toFixed(2);
    linear.innerHTML = bars([4, 8, 12, 16, 20, 24, 28]);
    const vals = scaleSteps(4, ratio, 7);
    ratioBars.innerHTML = bars(vals);
    out.textContent = `:root {\n${vals.map((v, i) => `  --space-${names[i]}: ${v / 16}rem; /* ${v}px */`).join('\n')}\n}`;
  };
  host.querySelector('.demo-controls-row')!.append(
    slider({ label: 'Ratio', min: 1.2, max: 2, step: 0.05, value: ratio, onInput: (v) => { ratio = v; update(); } }),
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
  const group = (t: string, d: string) => `<div class="tp-group"><b>${t}</b><i class="tp-gap t1"></i><span>${d}</span></div>`;
  const section = (h: string, items: [string, string][]) =>
    `<div class="tp-section"><h5>${h}</h5><i class="tp-gap t2"></i>${items.map((it, i) => (i ? '<i class="tp-gap t2"></i>' : '') + group(...it)).join('')}</div>`;
  host.innerHTML = `
    <div class="tier-page" data-show="off">
      ${section('Breads', [['Country loaf', '€6.50 · wheat & rye'], ['Seeded rye', '€7.00 · dense, nutty']])}
      <i class="tp-gap t3"></i>
      ${section('Pastries', [['Cardamom knot', '€3.20 · laminated'], ['Almond croissant', '€3.60 · twice-baked']])}
    </div>
    <div class="demo-controls-row"></div>
    <ul class="tier-legend">
      <li><span class="sw t1"></span> Tier 1 · inside a group (4–8px)</li>
      <li><span class="sw t2"></span> Tier 2 · between groups (16–24px)</li>
      <li><span class="sw t3"></span> Tier 3 · between sections (40–64px)</li>
    </ul>`;
  const page = host.querySelector<HTMLElement>('.tier-page')!;
  host.querySelector('.demo-controls-row')!.append(
    toggleGroup({
      label: 'Show tiers',
      options: [
        { value: 'off', label: 'Off' },
        { value: 'on', label: 'Highlight space' },
      ],
      value: 'off',
      onChange: (v) => (page.dataset.show = v),
    }),
  );
}

export const lesson: LessonSection[] = [
  {
    id: 'signal',
    title: 'Space is a signal',
    body: `
      <p>Before anyone reads a word on your page, their visual system has already sorted it into groups. Elements that sit close together are seen as belonging together. This is the Gestalt principle of <strong>proximity</strong>, and it is <em>pre-attentive</em>: it happens in the first fraction of a second, without effort or conscious thought.</p>
      <p>So spacing isn't decoration. It's the first layer of information on the page. When the gaps are uniform, readers lose that free layer and have to <em>read</em> to work out the structure. That's slower, more tiring, and easy to get wrong.</p>
      <p class="try">Drag the sliders. Set both gaps equal, then make “between” twice “inside”. Watch the moment the six lines snap into three dishes.</p>`,
    demo: proximityDial,
  },
  {
    id: 'between-within',
    title: 'Between > within',
    body: `
      <p>The whole level hangs on one relationship: <strong>the space between groups must be clearly larger than the space inside them.</strong> “Clearly” means about <strong>2×</strong>. Below that, the difference sits close to the limit of what people notice at a glance.</p>
      <p>The most common violation is the floating heading. With <code>margin: 24px 0</code> a heading sits exactly halfway between the previous section and its own content, so it belongs to neither. A heading should <em>hug</em> what it introduces: lots of space above, very little below.</p>`,
    demo: headingHug,
  },
  {
    id: 'ratios',
    title: 'Scales are ratios, not steps',
    body: `
      <p>Perception works in proportions. <strong>Weber's law</strong>: the smallest change we can notice is a roughly constant <em>fraction</em> of what's already there. Going from 4px to 8px is a huge jump (+100%). Going from 28px to 32px adds the same 4px but is nearly invisible (+14%).</p>
      <p>A linear scale (4, 8, 12, 16, 20…) is therefore crowded at the top with steps nobody can tell apart. Each indistinguishable pair invites an arbitrary choice, and arbitrary choices are what make a page feel unconsidered. A <strong>ratio scale</strong> multiplies each step by about 1.5×, so every step looks as different from the last as every other step does.</p>
      <p class="try">Compare the two columns. Then move the ratio slider: below about 1.25× the steps start blurring together again. Copy the tokens if you like the result.</p>`,
    demo: scaleLab,
  },
  {
    id: 'flat',
    title: 'A grid is not a hierarchy',
    body: `
      <p>An 8px grid keeps your numbers consistent, and that's useful. But consistency is not hierarchy. A page where everything is 24px apart is perfectly “on grid” and perfectly flat: every element is equally related to every other.</p>
      <p>Hierarchy comes from <strong>contrast between spaces</strong>. Pull related things together and push unrelated things apart, and the layout starts telling the reader what goes with what.</p>`,
    demo: flatVsTiered,
  },
  {
    id: 'tiers',
    title: 'Three tiers of space',
    body: `
      <p>Proximity nests. A real page needs at least three distinct tiers:</p>
      <ol>
        <li><strong>Inside a group</strong>: a title and its meta line. Tight: 4–8px.</li>
        <li><strong>Between groups</strong>: one dish and the next. Medium: 16–24px.</li>
        <li><strong>Between sections</strong>: Breads and Pastries. Generous: 40–64px or more.</li>
      </ol>
      <p>Each tier should be clearly bigger than the one below it: aim for 1.5–2×. A corollary: <strong>inner ≤ outer</strong>. A card's padding shouldn't exceed the gap between cards, or each card's content ends up nearer its neighbour's edge than its own.</p>`,
    demo: tierHighlighter,
  },
  {
    id: 'system',
    title: 'Make it a system',
    body: `
      <p>You turn this into code by deciding once and naming the decision. Declare a handful of tokens, then use only them:</p>
      <pre class="code-block"><code>:root {
  --space-3xs: 0.25rem;  /*  4 */
  --space-2xs: 0.5rem;   /*  8 */
  --space-s:   1rem;     /* 16 */
  --space-m:   1.5rem;   /* 24 */
  --space-l:   2.5rem;   /* 40 */
  --space-xl:  clamp(2.5rem, 1.5rem + 4vw, 4rem); /* fluid section space */
}

/* Groups: gap applies only BETWEEN items. No collapsing, no :last-child hacks. */
.menu-list { display: grid; gap: var(--space-m); }

/* Headings hug what they introduce */
h2 { margin: var(--space-xl) 0 var(--space-2xs); }</code></pre>
      <p>Note the <code>clamp()</code> on the section tier. Plain <code>vw</code> spacing gets absurd at both extremes. <code>clamp()</code> lets space grow with the screen between a floor and a ceiling.</p>
      <p>In the boss fight, the judges don't read your intentions. They <strong>measure the rendered page</strong>: the real gaps between groups, every distinct margin, padding and gap value, and whether those values come from tokens.</p>`,
  },
];
