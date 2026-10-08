import { fullLines, lineBoxes, textLength } from "../../engine/measure/typography";
import { slider, toggleGroup } from "../../ui/controls";
import { $ } from "../../util/dom";
import type { DemoContext, LessonSection } from "../types";

const STORY =
  "The Wrenfield ferry will make its last crossing on Saturday 28 March, the county council confirmed on Tuesday. The service has carried passengers between Mill Quay and the Saltings since 1935, first under oar, then under sail, and since 1971 in the diesel launch Margery, which the council says now needs a new hull it cannot afford.";

/** Characters per line of a rendered paragraph, the way the measure check counts them. */
function perLine(p: Element): number {
  const lines = fullLines(lineBoxes(p));
  return lines > 0 ? textLength(p) / lines : 0;
}

/** Demo: narrow a column of running text and count characters per line. */
function measureDemo(host: HTMLElement, ctx: DemoContext) {
  host.innerHTML = `
    <div class="demo-stage type-stage measure-stage">
      <p class="type-para">${STORY}</p>
    </div>
    <div class="demo-controls-row"></div>
    <p class="demo-readout"></p>`;
  const para = $<HTMLElement>(host, ".type-para");
  const readout = $<HTMLElement>(host, ".demo-readout");
  const update = (w: number) => {
    para.style.inlineSize = `${w}px`;
    const n = Math.round(perLine(para));
    const inRange = n >= 45 && n <= 75;
    readout.innerHTML = `Column <strong>${w}px</strong>: about <strong>${n}</strong> characters per line. ${
      n > 75
        ? "Above 75: longer than the studio's range."
        : n < 45
          ? "Below 45: shorter than the studio's range."
          : "Inside the 45 to 75 range."
    }`;
    if (inRange) ctx.complete();
  };
  $(host, ".demo-controls-row").append(
    slider({
      label: "Column width",
      min: 200,
      max: 760,
      step: 10,
      value: 740,
      unit: "px",
      onInput: update,
    }),
  );
  update(740);
}

/** Demo: the same column in px and in ch, as the reader enlarges the text. */
function chDemo(host: HTMLElement) {
  host.innerHTML = `
    <div class="demo-stage type-stage measure-stage ch-stage">
      <figure><figcaption><code>max-width: 420px</code> <strong data-n="px"></strong></figcaption><p class="type-para" data-col="px">${STORY}</p></figure>
      <figure><figcaption><code>max-width: 50ch</code> <strong data-n="ch"></strong></figcaption><p class="type-para" data-col="ch">${STORY}</p></figure>
    </div>
    <div class="demo-controls-row"></div>`;
  const cols = [
    [$<HTMLElement>(host, '[data-col="px"]'), $<HTMLElement>(host, '[data-n="px"]')],
    [$<HTMLElement>(host, '[data-col="ch"]'), $<HTMLElement>(host, '[data-n="ch"]')],
  ] as const;
  const update = (size: number) => {
    for (const [p, n] of cols) {
      p.style.fontSize = `${size}px`;
      n.textContent = `${Math.round(perLine(p))} per line`;
    }
  };
  $(host, ".demo-controls-row").append(
    slider({
      label: "Reader's text size",
      min: 12,
      max: 26,
      value: 15,
      unit: "px",
      onInput: update,
    }),
  );
  update(15);
}

/** Demo: line-height on a paragraph of method steps. */
function leadingDemo(host: HTMLElement, ctx: DemoContext) {
  host.innerHTML = `
    <div class="demo-stage type-stage">
      <p class="type-para leading-para">Heat the oven to 180°C (160°C fan) and line a 23cm round tin with baking paper. Melt 175g butter in a small pan over a medium heat and let it bubble until it smells of toffee and the solids at the bottom turn golden brown, about five minutes.</p>
    </div>
    <div class="demo-controls-row"></div>
    <p class="demo-readout"></p>`;
  const para = $<HTMLElement>(host, ".leading-para");
  const readout = $<HTMLElement>(host, ".demo-readout");
  const update = (lh: number) => {
    para.style.lineHeight = String(lh);
    const ok = lh >= 1.4 && lh <= 1.7;
    readout.innerHTML = `line-height <strong>${lh.toFixed(2)}</strong>: <strong>${Math.round(lh * 17)}px</strong> lines on 17px text. ${
      lh < 1.4
        ? "Tight: the lines crowd each other."
        : lh > 1.7
          ? "Loose: the lines drift apart."
          : "Inside the 1.4 to 1.7 band."
    }`;
    if (ok) ctx.complete();
  };
  $(host, ".demo-controls-row").append(
    slider({ label: "Line height", min: 0.8, max: 2.2, step: 0.05, value: 1.1, onInput: update }),
  );
  update(1.1);
}

/** Demo: a two-line heading over body text, with its own line-height. */
function headingDemo(host: HTMLElement) {
  host.innerHTML = `
    <div class="demo-stage type-stage">
      <p class="heading-demo">The last ferry closes after ninety years</p>
      <p class="type-para">The Wrenfield ferry will make its last crossing on Saturday 28 March.</p>
    </div>
    <div class="demo-controls-row"></div>
    <p class="demo-readout"></p>`;
  const h = $<HTMLElement>(host, ".heading-demo");
  const readout = $<HTMLElement>(host, ".demo-readout");
  const update = (lh: number) => {
    h.style.lineHeight = String(lh);
    readout.innerHTML = `Heading line-height <strong>${lh.toFixed(2)}</strong>: about <strong>${Math.round(34 * lh - 34)}px</strong> of space between its two lines.`;
  };
  $(host, ".demo-controls-row").append(
    slider({
      label: "Heading line height",
      min: 0.9,
      max: 2,
      step: 0.05,
      value: 1.6,
      onInput: update,
    }),
  );
  update(1.6);
}

/** Demo: the guesthouse card in four families and in two. */
function familiesDemo(host: HTMLElement) {
  host.innerHTML = `
    <div class="demo-stage families-stage" data-set="four">
      <p class="fam-logo">The Gull's Rest</p>
      <p class="fam-head">The Lookout</p>
      <p class="fam-price">£110 a night</p>
      <p class="fam-body">Double bed and a window seat over the harbour mouth.</p>
    </div>
    <div class="demo-controls-row"></div>`;
  const stage = $<HTMLElement>(host, ".families-stage");
  $(host, ".demo-controls-row").append(
    toggleGroup({
      label: "Families",
      options: [
        { value: "four", label: "Four families" },
        { value: "two", label: "Two families" },
      ],
      value: "four",
      onChange: (v) => (stage.dataset.set = v),
    }),
  );
}

/** Demo: the gap between paragraphs against the line height. */
function rhythmDemo(host: HTMLElement, ctx: DemoContext) {
  host.innerHTML = `
    <div class="demo-stage type-stage rhythm-stage">
      <p class="type-para">Spread the batter into the tin. Press 8 to 10 halved plums into the top, cut side up.</p>
      <p class="type-para">Bake for 45 to 50 minutes, until a skewer pushed into the middle comes out clean.</p>
      <p class="type-para">Leave the cake in the tin for 15 minutes before you turn it out.</p>
    </div>
    <div class="demo-controls-row"></div>
    <p class="demo-readout"></p>`;
  const stage = $<HTMLElement>(host, ".rhythm-stage");
  const readout = $<HTMLElement>(host, ".demo-readout");
  const LINE = 27;
  const update = (gap: number) => {
    stage.style.setProperty("--gap", `${gap}px`);
    readout.innerHTML = `Gap between steps <strong>${gap}px</strong>, line height <strong>${LINE}px</strong>. ${
      gap >= LINE
        ? "The break between steps is now at least one line."
        : "The break is smaller than a line, so steps run together."
    }`;
    if (gap >= LINE) ctx.complete();
  };
  $(host, ".demo-controls-row").append(
    slider({ label: "Paragraph gap", min: 0, max: 48, value: 0, unit: "px", onInput: update }),
  );
  update(0);
}

export const lesson: LessonSection[] = [
  {
    id: "measure",
    title: "The measure",
    body: `
      <p>Typographers call the length of a line the <strong>measure</strong> and count it in characters. Robert Bringhurst's rule, quoted by Richard Rutter: "Anything from 45 to 75 characters is widely regarded as satisfactory."</p>
      <p>The screen research is mixed. Most studies Mary Dyson reviewed found long lines read faster, but readers rated a 55-character line easiest to read, and Dyson and Haselgrove found better comprehension at 55 characters than at 100. WCAG's AAA level asks that blocks of text can be kept to 80 characters. 45 to 75 sits inside all of that, and it is the studio's range.</p>
      <p class="try">Narrow the column until its lines fall inside the range.</p>`,
    demo: measureDemo,
    gate: {
      kind: "goal",
      goal: "Set the column so its lines hold 45 to 75 characters.",
      note: "On a 760px page, body text at full width runs to around 100 characters. A max-width on the text column fixes that without touching the rest of the layout.",
    },
    sources: [
      "Rutter, The Elements of Typographic Style Applied to the Web, 2.1.2 (quoting Bringhurst)",
      "Dyson 2004, How physical text layout affects reading from screen",
      "Dyson & Haselgrove 2001",
      "W3C, Understanding WCAG 2.2, Success Criterion 1.4.8 Visual Presentation",
    ],
  },
  {
    id: "ch",
    title: "Measure in ch",
    body: `
      <p>A column set in px holds a fixed width, whatever the text size. When a reader sets a larger default font size, the same 420px column holds fewer characters per line, and the measure falls out of range.</p>
      <p>The <code>ch</code> unit is the width of the 0 in the current font. A column of <code>50ch</code> grows with the text, so it holds about the same number of characters at any size. Most letters are narrower than the 0, so a column holds more characters than its ch number, and how many more depends on the face. Georgia has a wide 0: a 50ch column of Georgia holds about 68 characters. Set the width, then count.</p>
      <pre class="code-block"><code>.story { max-width: 50ch; }</code></pre>
      <p class="try">Raise the reader's text size and watch both counts.</p>`,
    demo: chDemo,
    gate: {
      kind: "choice",
      prompt: "A reader doubles their default text size. Which column keeps its measure?",
      options: ["max-width: 50ch", "max-width: 620px", "width: 100%", "max-width: 80vw"],
      answer: 0,
      note: "ch is relative to the font, so the column and the text grow together.",
      why: [
        "",
        "620px stays 620px while the text doubles, so each line holds about half as many characters.",
        "100% follows the container, not the text. On a wide screen the lines get very long.",
        "vw follows the screen width. Text size does not move it at all.",
      ],
    },
    sources: [
      "W3C, CSS Values and Units Module Level 4 (the ch unit)",
      "W3C, Understanding WCAG 2.2, Success Criterion 1.4.4 Resize Text",
    ],
  },
  {
    id: "leading",
    title: "Leading",
    body: `
      <p><strong>Leading</strong>, set with <code>line-height</code>, is the distance from one line of text to the next. In CSS a unitless value multiplies the font size: 1.5 on 16px text gives 24px lines.</p>
      <p>Rello, Pielot and Marcos eye-tracked 104 people reading Wikipedia articles at line spacings from 0.8 to 1.8. Spacing made little difference in the middle of that range, and both extremes hurt. Butterick's practice range is 1.2 to 1.45, and WCAG's text spacing criterion uses 1.5 as its reference. Ada's rule for body text: 1.4 to 1.7.</p>
      <p class="try">Open up Lorem &amp; Ipsum's 1.1 until it sits in the band.</p>`,
    demo: leadingDemo,
    gate: {
      kind: "goal",
      goal: "Set the body text's line-height between 1.4 and 1.7.",
      note: "Leave room above 1.7 for the reader: WCAG 1.4.12 asks that nothing breaks when a reader raises line-height to 1.5 or more.",
    },
    sources: [
      "Rello, Pielot & Marcos 2016, Make it big!",
      "Butterick, Practical Typography: summary of key rules",
      "W3C, Understanding WCAG 2.2, Success Criterion 1.4.12 Text Spacing",
    ],
  },
  {
    id: "headings",
    title: "Tighter leading for headings",
    body: `
      <p>A line-height ratio scales with the font size. At 1.6, 16px text gets 10px between its lines; a 34px heading gets about 20px. When the heading wraps, its two lines sit as far apart as a paragraph break.</p>
      <p>Large text needs a smaller ratio to look as tight as body text. Ada's rule: headings at 1.3 or less.</p>
      <p class="try">Bring the heading's lines together.</p>`,
    demo: headingDemo,
    gate: {
      kind: "choice",
      prompt:
        "A 34px heading wraps onto two lines. Which line-height keeps it reading as one heading?",
      options: ["1.15", "1.6", "2", "The body's 1.5, so everything matches"],
      answer: 0,
      note: "1.15 leaves about 5px between the lines of a 34px heading, so they read as one unit.",
      why: [
        "",
        "1.6 leaves about 20px between the two lines, as much as a paragraph break.",
        "At 2, the two lines sit 34px apart and read as two separate headings.",
        "The same ratio gives large text far more space between lines than small text.",
      ],
    },
    sources: ["Butterick, Practical Typography: summary of key rules"],
  },
  {
    id: "families",
    title: "Two families, two jobs",
    body: `
      <p>No located study sets a limit on the number of typefaces on a page. In the studies that compared faces, such as Arial against Times, the choice made little difference to reading performance; size and measure mattered more.</p>
      <p>So the limit is a studio rule, and Ada labels it as one: at most two families. One for display (the logo and headings), one for reading (body, prices, captions). Code in <code>pre</code> and <code>code</code> is the exception. A third family has to earn its place with a job neither of the others can do.</p>
      <p class="try">Switch between the four-family card and the two-family card.</p>`,
    demo: familiesDemo,
    gate: {
      kind: "choice",
      prompt: "Margit asks why her four fonts have to go. Which answer is accurate?",
      options: [
        "No study sets a limit. Two families with clear jobs is the studio's rule, and her four have no jobs",
        "Research proves that pages with more than two families are read slower",
        "Browsers can only load two families",
        "WCAG limits pages to two families",
      ],
      answer: 0,
      note: "Present a rule as a rule. The client can still disagree, and she will at least know what she is disagreeing with.",
      why: [
        "",
        "No located study shows that. The studies that compared typefaces found little effect on speed.",
        "Browsers load as many families as the page asks for.",
        "WCAG says nothing about the number of families.",
      ],
    },
    sources: [
      "Ling & van Schaik 2006, The influence of font type and line length on visual search",
      "Bernard, Liao & Mills 2001",
    ],
  },
  {
    id: "rhythm",
    title: "A line between paragraphs",
    body: `
      <p>Paragraphs are groups, and the first desk's rule applies: the gap between groups has to beat the gap inside them. Inside a paragraph the gap is the leading. If paragraphs sit closer than a line apart, the break between them is easy to miss.</p>
      <p>Ada's rule: at least one line between paragraphs. The <code>lh</code> unit is the element's own line height, so <code>margin-bottom: 1lh</code> stays right if the leading changes. WCAG 1.4.8 (AAA) asks that paragraph spacing of 1.5 times the line spacing be available to readers who need it.</p>
      <pre class="code-block"><code>.method p { margin: 0 0 1lh; }</code></pre>`,
    demo: rhythmDemo,
    gate: {
      kind: "goal",
      goal: "Open the gap between steps until it is at least one line.",
      note: "Each step now reads as its own group, and the reader can find where one ends and the next begins.",
    },
    sources: [
      "Wertheimer 1923 and Kubovy & Wagemans 1995, grouping by proximity",
      "W3C, Understanding WCAG 2.2, Success Criterion 1.4.8 Visual Presentation",
    ],
  },
];
