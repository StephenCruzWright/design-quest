import type { BossDef, Clue, QuizQuestion, RuleCard } from "../types";
import gazetteCss from "./bosses/gazette.css?raw";
import gazetteHtml from "./bosses/gazette.html?raw";
import guesthouseCss from "./bosses/guesthouse.css?raw";
import guesthouseHtml from "./bosses/guesthouse.html?raw";
import kitchenCss from "./bosses/kitchen.css?raw";
import kitchenHtml from "./bosses/kitchen.html?raw";

export const rules: RuleCard[] = [
  {
    id: "measure",
    title: "A comfortable measure",
    rule: "Set running text at 45 to 75 characters per line.",
    why: "Readers rate moderate lines easier to read, and one study found better comprehension at 55 characters than at 100. Very long lines can be scanned faster, so the range is a typographer's rule, not a law. WCAG's AAA level asks that blocks of text can be kept to 80 characters.",
    source:
      "Bringhurst, quoted by Rutter (practice); Dyson 2004; Dyson & Haselgrove 2001; WCAG 2.2, Success Criterion 1.4.8",
  },
  {
    id: "measure-ch",
    title: "Measure in ch",
    rule: "Set the text column's max-width in ch, so the column grows with the type.",
    why: "1ch is the width of the 0 in the current font. A column in ch holds about the same number of characters when the reader enlarges the text. A column in px holds fewer.",
    code: "max-width: 50ch;",
    source: "W3C, CSS Values and Units Module Level 4 (the ch unit)",
  },
  {
    id: "leading",
    title: "Leading 1.4 to 1.7",
    rule: "Set body text at line-height 1.4 to 1.7.",
    why: "In an eye-tracking study of 104 readers, line spacing made little difference except at the extremes: 0.8 and 1.8 both hurt. Butterick's practice range is 1.2 to 1.45, and WCAG's text spacing criterion uses 1.5 as its reference.",
    source:
      "Rello, Pielot & Marcos 2016; Butterick; WCAG 2.2, Success Criterion 1.4.12. The band is Ada's rule",
  },
  {
    id: "tight-headings",
    title: "Tighten the headings",
    rule: "Set headings at line-height 1.3 or less.",
    why: "Line-height scales with font size. At 1.6, a 34px heading leaves about 20px between its two lines, as much as a short paragraph break.",
    source: "Ada's rule",
  },
  {
    id: "two-families",
    title: "Two families, two jobs",
    rule: "Use at most two font families: one for display, one for reading. Code is the exception.",
    why: "No located study sets a limit on families. In the studies that tested typefaces, the choice mattered less to reading performance than size and measure. A third family has to earn its place.",
    source: "Ling & van Schaik 2006; Bernard, Liao & Mills 2001. The limit is Ada's rule",
  },
  {
    id: "paragraph-line",
    title: "A line between paragraphs",
    rule: "Space paragraphs at least one line apart.",
    why: "The gap between paragraphs has to beat the gap between lines, by the same proximity logic as the first desk. WCAG 1.4.8 (AAA) asks that paragraph spacing of 1.5 times the line spacing be available.",
    code: "p { margin: 0 0 1lh; }",
    source: "WCAG 2.2, Success Criterion 1.4.8. One line is Ada's rule",
  },
];

/* Mini mockups. Inline styles keep them self-contained. */
const tight = `
  <div style="font:15px/1.05 Georgia,serif;max-width:280px">
    <p style="margin:0">Heat the oven to 180°C and line a 23cm tin. Melt the butter and let it bubble until it smells of toffee.</p>
    <p style="margin:0">Whisk the sugar and eggs into the butter until smooth, then fold in the flour.</p>
  </div>`;

const looseHeading = `
  <p style="font:700 24px/1.7 Georgia,serif;max-width:240px;margin:0">The last ferry closes after ninety years</p>`;

const ransom = `
  <div style="max-width:280px;display:grid;gap:4px">
    <span style="font:28px 'Brush Script MT',cursive">The Gull's Rest</span>
    <span style="font:700 18px Georgia,serif">Rooms</span>
    <span style="font:15px 'Trebuchet MS',sans-serif">Double bed and a window seat.</span>
    <span style="font:15px 'Courier New',monospace">£110 a night</span>
  </div>`;

export const quiz: QuizQuestion[] = [
  {
    id: "in-range",
    prompt: "Which line length sits inside the studio's measure for running text?",
    options: ["30 characters", "60 characters", "100 characters", "140 characters"],
    answer: 1,
    note: "45 to 75 characters is Bringhurst's range, quoted by Rutter. 60 sits near its middle.",
  },
  {
    id: "long-fast",
    prompt:
      "In several screen studies, 100-character lines were read fastest. Why does the studio still stop at 75?",
    options: [
      "Long lines are slower to read",
      "Readers rated long lines harder, and one study found lower comprehension at 100 characters than at 55",
      "WCAG AA forbids lines over 75 characters",
      "Screens cannot show more than 75 characters",
    ],
    answer: 1,
    note: "Speed is not the only measure. Preference and comprehension both favoured moderate lines.",
  },
  {
    id: "what-ch",
    prompt: "What is 1ch?",
    options: [
      "Exactly one average character",
      "The width of the 0 in the current font",
      "One hundredth of the viewport width",
      "The same as 1em",
    ],
    answer: 1,
    note: "Most letters are narrower than the 0, so a column holds more characters than its ch number. How many more depends on the face, so measure the result.",
  },
  {
    id: "px-column",
    prompt:
      "A text column is max-width: 600px. A reader sets a larger default font size in the browser. What happens?",
    options: [
      "The characters per line drop, because the text grows and the column does not",
      "Nothing changes",
      "The column grows to fit",
      "The text shrinks back to fit the column",
    ],
    answer: 0,
    note: "Set the column in ch and it grows with the text, so the measure holds.",
  },
  {
    id: "tight-body",
    prompt: "This recipe is set at line-height 1.05. What is the fix?",
    visual: tight,
    options: [
      "Make the text bold so each line stands out",
      "Set the body's line-height between 1.4 and 1.7",
      "Make the text smaller so more fits",
      "Justify the text",
    ],
    answer: 1,
    note: "Crowded lines are one of the two extremes that measurably hurt reading.",
  },
  {
    id: "leading-research",
    prompt: "What did Rello, Pielot and Marcos find about line spacing?",
    options: [
      "Double spacing is always best",
      "1.5 is the proven optimum",
      "Effects were small, but the extremes, 0.8 and 1.8, hurt readability",
      "Line spacing has no effect at all",
    ],
    answer: 2,
    note: "104 readers, eye-tracked on Wikipedia articles. Font size mattered more than line spacing.",
  },
  {
    id: "wcag-spacing",
    prompt: "What does WCAG 2.x Success Criterion 1.4.12, Text Spacing, ask of a page?",
    options: [
      "That line-height is set to exactly 1.5",
      "That nothing breaks when a reader raises line-height to 1.5, paragraph spacing to 2× and letter and word spacing",
      "That paragraphs are always 2× apart",
      "That authors never set line-height",
    ],
    answer: 1,
    note: "1.4.12 is about surviving the reader's overrides, not a value the author must use.",
  },
  {
    id: "loose-heading",
    prompt: "A 24px heading at line-height 1.7 wraps onto two lines. What is the problem?",
    visual: looseHeading,
    options: [
      "The heading is too small",
      "Nothing: headings should match the body's leading",
      "Its two lines sit so far apart they read as two headings. Set 1.3 or less",
      "Headings should never wrap",
    ],
    answer: 2,
    note: "Line-height scales with size, so large text needs a smaller ratio to look as tight as body text.",
  },
  {
    id: "ransom",
    prompt: "The guesthouse uses four families. What is the fix?",
    visual: ransom,
    options: [
      "Add a fifth family for the buttons",
      "Keep Courier for the prices, because prices are a kind of code",
      "Keep two families, one for display and one for reading, and set the prices in the reading face",
      "Use Brush Script everywhere so it matches",
    ],
    answer: 2,
    note: "Each family gets a job. Prices line up with tabular figures in the reading face.",
  },
  {
    id: "families-evidence",
    prompt: "What does the research say about how many font families a page can use?",
    options: [
      "Two is the proven maximum",
      "Pages with three families are read 30% slower",
      "No located study sets a limit. Two is a studio rule",
      "Serif families are always read faster",
    ],
    answer: 2,
    note: "Studies that compared typefaces found little effect on performance. The limit is about the page having a voice, and it is labelled as a rule.",
  },
  {
    id: "paragraph-gap",
    prompt:
      "Body text has a 24px line-height, and paragraphs are 8px apart. What does the reader see?",
    options: [
      "Breaks between paragraphs that barely show, because they are smaller than a line",
      "Paragraphs that are too far apart",
      "Text that fails contrast",
      "Nothing: 8px is a spacing token",
    ],
    answer: 0,
    note: "Make the gap at least one line, for example margin-bottom: 1lh.",
  },
  {
    id: "body-size",
    prompt: "Which body text size sits inside Butterick's practice range for the web?",
    options: ["11px", "13px", "18px", "30px"],
    answer: 2,
    note: "Butterick suggests 15 to 25px for web body text. Larger web sizes also improved reading measures in Rello and colleagues' study.",
  },
];

export const bosses: BossDef[] = [
  {
    id: "gazette",
    client: "The Wrenfield Gazette",
    tagline: "Community newspaper, article page",
    brief:
      "Readers write in to say they lose their place in our longer stories and read the same line twice. Nobody ever sent us that letter about the print edition.",
    from: "Bernard, editor",
    html: gazetteHtml,
    css: gazetteCss,
    hints: [
      "Count the characters in one line of the story. Then picture a column in a printed newspaper.",
      ".body has no width limit, so each line runs the full width of the page. The headline's line-height is 1.5, which pushes its two lines apart.",
      "Give .body a max-width in ch, and bring h1's line-height to 1.3 or below. For a bonus star, space the paragraphs with a margin-bottom in lh.",
    ],
  },
  {
    id: "kitchen",
    client: "Morrow's Kitchen",
    tagline: "Recipe blog, recipe page",
    brief:
      "My recipes look like a wall. Mum prints them out and says she can't see where one step ends and the next begins. I wrote them in short steps, so I don't understand it.",
    from: "Ifeoma, cook and writer",
    html: kitchenHtml,
    css: kitchenCss,
    hints: [
      "Compare the space between two lines of the method with the space between two steps.",
      "body sets line-height: 1.1, and the steps have no margin, so lines and steps sit equally close. The Method heading is at line-height 2.",
      "Set the body's line-height between 1.4 and 1.7 and h2's at 1.3 or less. Then give each step a margin-bottom of at least one line.",
    ],
  },
  {
    id: "guesthouse",
    client: "The Gull's Rest",
    tagline: "Guesthouse, home page",
    brief:
      "Guests tell me the website looks like a ransom note. My nephew said it first, and he's twelve, but I've heard it from grown-ups since. I chose every font myself, and I liked each one.",
    from: "Margit, owner",
    html: guesthouseHtml,
    css: guesthouseCss,
    hints: [
      "How many different typefaces can you count on the page?",
      "Four families: Brush Script MT on .logo and .tag, Georgia on the headings, Trebuchet MS on the body and Courier New on .price.",
      "Keep one family for display and one for reading. Move .logo and .tag into one of them and .price into the body face. font-variant-numeric can line its figures up.",
    ],
  },
];

export const clue: Clue = {
  title: "Mercer Street",
  body: "Three invoices this week, one address on all of them: Mercer Street, two streets from this desk. Each one is exactly ten pounds under the quote we gave the same client. Somebody has been reading our quotes.",
};
