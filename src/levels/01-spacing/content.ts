import type { BossDef, QuizQuestion, RuleCard } from '../types';
import bakeryHtml from './bosses/bakery.html?raw';
import bakeryCss from './bosses/bakery.css?raw';
import saasHtml from './bosses/saas.html?raw';
import saasCss from './bosses/saas.css?raw';
import blogHtml from './bosses/blog.html?raw';
import blogCss from './bosses/blog.css?raw';

export const rules: RuleCard[] = [
  {
    id: 'between-within',
    title: 'Between > within',
    rule: 'The gap between groups should be at least 2× the largest gap inside them.',
    why: 'Proximity is read pre-attentively. Equal gaps force people to read before they can see the structure.',
  },
  {
    id: 'ratio-scale',
    title: 'Scale by ratio',
    rule: 'Make each spacing step ~1.5× the last. If two values are within 25% of each other, merge them.',
    why: "Weber's law: we notice relative differences, not absolute ones. 28 vs 32px looks the same.",
    code: '4 · 8 · 16 · 24 · 40 · 64',
  },
  {
    id: 'three-tiers',
    title: 'Three tiers',
    rule: 'Inside a group < between groups < between sections. Each tier clearly bigger than the last.',
    why: 'Proximity nests. Each tier answers a different question: what goes together, what is a unit, where a topic ends.',
  },
  {
    id: 'headings-hug',
    title: 'Headings hug',
    rule: 'Give headings much more space above than below.',
    why: 'Symmetric margins leave a heading floating equally between two sections, so it belongs to neither.',
    code: 'h2 { margin: var(--space-xl) 0 var(--space-2xs); }',
  },
  {
    id: 'inner-outer',
    title: 'Inner ≤ outer',
    rule: "A container's padding should be no larger than the gap around it.",
    why: "Otherwise a card's content sits nearer its neighbour's edge than its own, and the grid reads as one slab.",
  },
  {
    id: 'name-space',
    title: 'Name your space',
    rule: 'Use a few named tokens, never raw numbers. Decide once, reuse everywhere.',
    why: 'Every one-off value is an unexplained decision. Tokens turn spacing into a vocabulary.',
    code: 'gap: var(--space-m);',
  },
];

/* Mini mockups for quiz questions. Inline styles keep them self-contained. */
const pairList = (inside: number, between: number) => `
  <div style="font:14px/1.3 system-ui;display:grid;gap:${between}px;max-width:220px">
    ${[['Shipping', 'Free over €50'], ['Returns', '30 days'], ['Warranty', '2 years']]
      .map(([a, b]) => `<div style="display:grid;gap:${inside}px"><span style="color:#666">${a}</span><strong>${b}</strong></div>`)
      .join('')}
  </div>`;

const cardGrid = `
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;font:12px/1.3 system-ui;max-width:300px">
    ${['Starter', 'Team', 'Scale']
      .map((n) => `<div style="padding:22px;background:#eef1f6;border-radius:6px"><b>${n}</b><br>3 seats<br>Support</div>`)
      .join('')}
  </div>`;

const formMock = `
  <div style="font:13px/1.3 system-ui;display:grid;gap:8px;max-width:220px">
    <span>Name</span><span style="border:1px solid #999;border-radius:4px;height:26px"></span>
    <span>Email</span><span style="border:1px solid #999;border-radius:4px;height:26px"></span>
    <span>Phone</span><span style="border:1px solid #999;border-radius:4px;height:26px"></span>
  </div>`;

const pageMock = (tiered: boolean) => {
  const g = tiered ? 4 : 12;
  const b = tiered ? 12 : 12;
  const s = tiered ? 32 : 12;
  const grp = (t: string) =>
    `<div style="display:grid;gap:${g}px"><b>${t}</b><span style="height:6px;background:#ccc;width:80%"></span></div>`;
  const sec = (h: string) =>
    `<div style="display:grid;gap:${b}px"><b style="font-size:15px">${h}</b>${grp('Item one')}${grp('Item two')}</div>`;
  return `<div style="font:12px/1.2 system-ui;display:grid;gap:${s}px;width:140px">${sec('Breads')}${sec('Pastries')}${sec('Drinks')}</div>`;
};

export const quiz: QuizQuestion[] = [
  {
    id: 'pairs',
    prompt: 'Users keep reading the wrong value for each label. What is the cheapest fix?',
    visual: pairList(14, 14),
    options: [
      'Make the labels bold and a different colour',
      'Tighten the gap inside each pair and widen the gap between pairs',
      'Add a divider line under every row',
      'Increase the line-height',
    ],
    answer: 1,
    note: 'Proximity resolves it with zero extra ink. Dividers work too, but add visual noise to fix what spacing already could.',
  },
  {
    id: 'float-heading',
    prompt: 'A section heading has margin: 32px 0. What is wrong?',
    options: [
      'Nothing: symmetric margins are balanced',
      'It floats halfway between the previous section and its own content, belonging to neither',
      '32px is not on an 8px grid',
      'Headings should use padding, not margin',
    ],
    answer: 1,
    note: 'Headings should hug what they introduce, e.g. margin: 48px 0 8px.',
  },
  {
    id: 'linear',
    prompt: 'Your spacing tokens are 4, 8, 12, 16, 20, 24, 28, 32. What is the problem?',
    options: [
      'There are too few steps',
      'The upper steps are too close to perceive (28 vs 32 looks the same), which invites arbitrary choices',
      'They should be in rem',
      'The scale should start at 0',
    ],
    answer: 1,
    note: "Weber's law: +4px is a big jump at 4px and invisible at 28px. Use ratios.",
  },
  {
    id: 'which-scale',
    prompt: 'Which scale gives each step a similar perceived jump?',
    options: ['4 · 8 · 12 · 16 · 20', '4 · 8 · 16 · 24 · 40 · 64', '10 · 20 · 30 · 40 · 50', '16 · 17 · 18 · 19 · 20'],
    answer: 1,
    note: 'Each step is roughly 1.5–2× the last, so each step looks as different as every other.',
  },
  {
    id: 'slab',
    prompt: 'The cards in this grid blur into one slab. Why?',
    visual: cardGrid,
    options: [
      'They need drop shadows',
      'The gap between cards (6px) is far smaller than the padding inside them (22px)',
      'The text is too small',
      'There should be four columns',
    ],
    answer: 1,
    note: 'Inner ≤ outer. Each card\'s content is closer to its neighbour than to its own edge. Widen the gap or reduce the padding.',
  },
  {
    id: 'template',
    prompt: 'Everything on a landing page is exactly 24px apart, perfectly on the 8px grid. The client says it "feels like a template". Why?',
    options: [
      '24 is not a multiple of 8',
      'Uniform spacing carries no hierarchy: nothing signals what belongs together or where sections end',
      'It needs a stronger colour palette',
      'It needs a hero image',
    ],
    answer: 1,
    note: 'Consistency is not hierarchy. Hierarchy comes from contrast between spaces.',
  },
  {
    id: 'form',
    prompt: 'In this form, labels sit 8px above their input and 8px below the previous input. What is the risk?',
    visual: formMock,
    options: [
      'None: it is consistent',
      'Each label is equally close to the input above and below, so it can be read with the wrong field',
      'Labels should go inside inputs as placeholders',
      'The font is too small',
    ],
    answer: 1,
    note: 'Bind label to input (4px) and separate fields (24px). Placeholders-as-labels create new problems.',
  },
  {
    id: 'twox',
    prompt: 'Inside a group your gap is 12px. What is the smallest between-group gap that reliably reads as separate?',
    options: ['14px', '16px', '24px', '12px'],
    answer: 2,
    note: 'About 2× is a safe floor. 14 or 16px is within perceptual noise of 12px.',
  },
  {
    id: 'gap-vs-margin',
    prompt: 'Why is gap on a flex or grid container usually better than margins on the children for spacing groups?',
    options: [
      'It renders faster',
      'It applies only between items: no :last-child fixes and no margin-collapse surprises',
      'It accepts negative values',
      'Margins are deprecated',
    ],
    answer: 1,
    note: 'gap expresses a relationship between siblings, which is exactly what proximity is.',
  },
  {
    id: 'fluid',
    prompt: 'You want sections to breathe more on big screens without wasting space on phones. Best approach?',
    options: [
      'Five media-query breakpoints, each with its own padding',
      'padding-block: clamp(2.5rem, 1.5rem + 4vw, 6rem)',
      'padding-block: 8vw',
      'padding-block: 10vh',
    ],
    answer: 1,
    note: 'clamp() scales fluidly but keeps a floor and a ceiling. Raw vw gets absurd at both extremes.',
  },
  {
    id: 'scan',
    prompt: 'Which page lets you find the three sections fastest?',
    visual: `<div style="display:flex;gap:40px;align-items:start"><div><p style="font:700 12px system-ui;margin:0 0 8px">A</p>${pageMock(true)}</div><div><p style="font:700 12px system-ui;margin:0 0 8px">B</p>${pageMock(false)}</div></div>`,
    options: [
      'A: its three tiers of space make the section breaks obvious',
      'B: consistent spacing is easier to scan',
      'Both are equally scannable',
      'B: less whitespace fits more on screen',
    ],
    answer: 0,
    note: 'In B every gap is 12px, so sections, groups and lines are all equally related.',
  },
  {
    id: 'merge',
    prompt: 'Your CSS uses both 15px and 16px for spacing. A teammate asks which one to use for a new component. Best answer?',
    options: [
      '16px, because it is rem-friendly',
      "It doesn't matter",
      'Merge them into one token. Two values nobody can tell apart are a decision tax, not a choice',
      '15px for compact components',
    ],
    answer: 2,
    note: 'If a difference cannot be seen, it should not exist in the system.',
  },
];

export const bosses: BossDef[] = [
  {
    id: 'bakery',
    client: 'Crumb & Co.',
    tagline: 'Neighbourhood sourdough bakery',
    brief:
      "People keep reading the description under one loaf as if it belongs to the next one. And the page feels… cramped but also loose? I don't know. My nephew built it. — Rosa, owner",
    html: bakeryHtml,
    css: bakeryCss,
    hints: [
      "Look at one menu item. Is the loaf's name closer to its own description, or to the description above it?",
      '.item-head has margin-bottom: 20px but .item has margin-bottom: 14px. Inside should be small and between should be big. Flip that relationship.',
      'Choose a scale like 4 · 8 · 16 · 24 · 40 and swap every spacing value for the nearest step. Define them as --space-* tokens on :root for a bonus star.',
    ],
  },
  {
    id: 'saas',
    client: 'Pipeline',
    tagline: 'Developer tooling startup, pricing page',
    brief:
      "Our pricing cards look like one big blob. People can't tell which features belong to which plan, and our designer left. — Dev, founder",
    html: saasHtml,
    css: saasCss,
    hints: [
      'Compare the gap between the cards with the spacing inside a card.',
      'The cards are 12px apart, but the elements inside each card are 22px apart. The gap between cards must be at least 2× the largest gap inside one.',
      'Try gap: 24px on .plan-grid and 4–8px between the elements inside each card. Sections need more still: around 64px between them earns the tiers star.',
    ],
  },
  {
    id: 'blog',
    client: 'Field Notes',
    tagline: "A woodworker's essay blog",
    brief:
      'Readers say the archive is hard to scan. Every title seems to float halfway between two posts. — June, writer',
    html: blogHtml,
    css: blogCss,
    hints: [
      'Headings should hug what they introduce.',
      '.post h3 has margin: 24px 0, the same space above and below, so it belongs to neither neighbour. .meta and .excerpt have the same problem.',
      'Zero the margins inside a post and use small bottom margins (4–8px). Then space the posts apart with display: grid; gap on .posts.',
    ],
  },
];
