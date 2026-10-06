import type { BossDef, Clue, QuizQuestion, RuleCard } from "../types";
import recordsCss from "./bosses/records.css?raw";
import recordsHtml from "./bosses/records.html?raw";
import swimCss from "./bosses/swim.css?raw";
import swimHtml from "./bosses/swim.html?raw";
import theatreCss from "./bosses/theatre.css?raw";
import theatreHtml from "./bosses/theatre.html?raw";

export const rules: RuleCard[] = [
  {
    id: "one-focus",
    title: "One thing first",
    rule: "Each page gets one focal element: the largest text, at least 1.5× the next largest.",
    why: "An item that differs from its neighbours in size is found faster in visual search. Two near-equal giants split the reader's first look.",
    source: "Wolfe & Horowitz 2017; Itti & Koch 2001. The 1.5× threshold is Ada's rule",
  },
  {
    id: "step-scale",
    title: "Step the headings",
    rule: "Neighbouring heading levels differ by at least 1.2×. Pick one ratio and build the whole scale from it.",
    why: "In eye-tracking studies, readers of pages with distinct headings scan from heading to heading. When h2 and h3 are a pixel apart, a subsection reads as another section.",
    code: "16 · 20 · 25 · 31 · 39 (×1.25)",
    source: "Pernice 2019, NN/g text scanning patterns; Brown 2011. The 1.2× floor is Ada's rule",
  },
  {
    id: "bold-rare",
    title: "Bold is rare",
    rule: "Keep bold for headings and the few words that must be found. Over 30% bold text: take it off the body.",
    why: "Bold words draw fixations in eye-tracking studies of web reading. Bold on most lines draws the eye nowhere in particular.",
    source:
      "Pernice 2019, NN/g text scanning patterns; Butterick, Practical Typography. The 30% limit is Ada's rule",
  },
  {
    id: "three-dials",
    title: "Three dials",
    rule: "Size, weight and colour each set importance. Turn one dial at a time and check the page before turning the next.",
    why: "Size and colour are separate attributes that guide attention. Turn all three at once and you cannot tell which one did the work.",
    source: "Wolfe & Horowitz 2017. One dial at a time is Ada's rule",
  },
  {
    id: "step-back",
    title: "Quiet the details",
    rule: "Push secondary text back: smaller, lighter or greyer. Never below 4.5:1 contrast.",
    why: "Lowering the details raises everything else without making anything bigger. WCAG 2.x sets 4.5:1 as the minimum for body-size text.",
    source: "Wathan & Schoger, Refactoring UI (practice); WCAG 2.2, Success Criterion 1.4.3",
  },
  {
    id: "fluid-floor",
    title: "Fluid with a floor",
    rule: "Set large headings with clamp(): a minimum, a preferred value that mixes rem and vw, and a maximum.",
    why: "Plain vw text shrinks without limit on phones and does not grow with browser zoom. The rem part keeps zoom working; the bounds stop the extremes.",
    code: "font-size: clamp(2rem, 1.5rem + 2vw, 3rem);",
    source:
      "CSS Values and Units Level 4 (clamp); Utopia (practice); WCAG 2.2, Success Criterion 1.4.4",
  },
];

/* Mini mockups. Inline styles keep them self-contained. */
const card = (title: string, titleCss: string, meta: string, metaCss: string) => `
  <div style="font:15px/1.4 system-ui;max-width:240px;display:grid;gap:4px">
    <span style="${metaCss}">${meta}</span>
    <span style="${titleCss}">${title}</span>
    <span>Doors 19:00. Standing only.</span>
  </div>`;

const headings = (sizes: number[]) => `
  <div style="font:15px/1.3 Georgia,serif;display:grid;gap:6px;max-width:260px">
    <b style="font-size:${sizes[0]}px">Annual report</b>
    <b style="font-size:${sizes[1]}px">Revenue</b>
    <b style="font-size:${sizes[2]}px">By region</b>
    <span>Northern sales rose for the third year.</span>
  </div>`;

const allBold = `
  <div style="font:700 14px/1.4 system-ui;max-width:260px;display:grid;gap:6px">
    <span style="font-size:20px">Spring sale</span>
    <span>Every jacket 30% off until Sunday.</span>
    <span>Free returns within 30 days.</span>
    <span>Code SPRING at checkout.</span>
  </div>`;

const twoGiants = `
  <div style="font:14px/1.3 system-ui;max-width:280px;display:grid;gap:6px">
    <b style="font-size:26px">Rent a bike</b>
    <b style="font-size:25px">From €12 a day</b>
    <span>Pick up at the station. Helmets included.</span>
  </div>`;

export const quiz: QuizQuestion[] = [
  {
    id: "squint",
    prompt: "You blur a page until the words are unreadable. What does that show you?",
    options: [
      "Which elements still stand out on size, weight and contrast alone",
      "Whether the copy is too long",
      "Whether the fonts are installed",
      "Nothing useful: hierarchy needs the words",
    ],
    answer: 0,
    note: "Blur removes the words and keeps size, weight and contrast, the cues that guide visual search before anything is read.",
  },
  {
    id: "flat-headings",
    prompt:
      "Headings are 22px, 21px and 20px. Readers can't tell sections from subsections. Best fix?",
    visual: headings([22, 21, 20]),
    options: [
      "Make every heading a different colour",
      "Rebuild the sizes on one ratio, for example 31, 25 and 20px (×1.25)",
      "Underline the subsections",
      "Number the headings 1, 1.1, 1.1.1",
    ],
    answer: 1,
    note: "A 1px step is about 5%. A ratio scale makes every step the same visible jump.",
  },
  {
    id: "all-bold",
    prompt: "A shop sets all its text in bold so customers 'don't miss anything'. What happens?",
    visual: allBold,
    options: [
      "Customers read every line more carefully",
      "Nothing stands out, because bold only works against plain text",
      "The page loads more slowly",
      "Bold text fails WCAG contrast",
    ],
    answer: 1,
    note: "Emphasis is a difference. Make everything bold and there is no difference left to see.",
  },
  {
    id: "two-giants",
    prompt: "The title is 26px and the price under it is 25px. What is the problem?",
    visual: twoGiants,
    options: [
      "Nothing: both matter to the customer",
      "Two near-equal giants compete, so the page has no clear first thing",
      "The price should be in a different font",
      "26px is too small for a title",
    ],
    answer: 1,
    note: "Pick the one thing that comes first and make it clearly larger, about 1.5×. Make the other smaller or quieter.",
  },
  {
    id: "quiet-meta",
    prompt:
      "A concert card prints the date in bold red capitals, the same size as the band name. The band name gets lost. Fix?",
    visual: card(
      "The Night Office",
      "font-size:18px",
      "FRIDAY 14 MARCH",
      "font-size:18px;font-weight:800;color:#c0262d",
    ),
    options: [
      "Make the band name red too",
      "Keep the date but step it back: smaller, normal weight, a quieter colour",
      "Remove the date",
      "Put both in a box",
    ],
    answer: 1,
    note: "De-emphasising the detail raises the headline without adding anything louder.",
  },
  {
    id: "grey-floor",
    prompt: "You make captions light grey to quieten them. What is the limit?",
    options: [
      "They must stay at 4.5:1 contrast or more against their background",
      "They must stay darker than #999",
      "Grey text is never accessible",
      "There is no limit as long as they are small",
    ],
    answer: 0,
    note: "WCAG 2.x Success Criterion 1.4.3: 4.5:1 for normal text, 3:1 for large text.",
  },
  {
    id: "one-dial",
    prompt:
      "A heading isn't standing out. You make it bigger, bolder, red and underlined at once. Why is that a poor method?",
    options: [
      "It uses too much CSS",
      "You can't tell which change did the work, and the page gets louder overall",
      "Underlines are reserved for links",
      "Red fails contrast",
    ],
    answer: 1,
    note: "Turn one dial, look, then decide. Often size alone is enough.",
  },
  {
    id: "vw-only",
    prompt: "A heading is set to font-size: 6vw. What goes wrong?",
    options: [
      "It is tiny on phones, huge on wide screens, and ignores browser zoom",
      "Nothing: vw is the modern unit",
      "vw is not supported in Safari",
      "It is always exactly 6% of the font size",
    ],
    answer: 0,
    note: "Use clamp() with a rem term: clamp(2rem, 1.5rem + 2vw, 3rem) has a floor, a ceiling and respects zoom.",
  },
  {
    id: "clamp-read",
    prompt: "What does font-size: clamp(2rem, 1.5rem + 2vw, 3rem) do?",
    options: [
      "Picks a random size between 2rem and 3rem",
      "Grows with the viewport but never goes below 2rem or above 3rem",
      "Sets 2rem on phones and 3rem on desktops with nothing in between",
      "Adds 2vw of padding",
    ],
    answer: 1,
    note: "clamp(minimum, preferred, maximum). The preferred value is used while it sits between the bounds.",
  },
  {
    id: "colour-only",
    prompt: "Which change raises a heading's importance without making anything else louder?",
    options: [
      "Make the body text bold",
      "Make the metadata around it smaller and greyer",
      "Add a drop shadow to every element",
      "Make every heading the same size",
    ],
    answer: 1,
    note: "Hierarchy is relative. Lowering the neighbours raises the heading.",
  },
  {
    id: "focus-pick",
    prompt:
      "A swim school's page has a logo, a menu, an offer and a timetable. Parents need to book a trial. What should be largest?",
    options: [
      "The logo",
      "The free trial offer",
      "The menu",
      "Everything the same size, to be fair",
    ],
    answer: 1,
    note: "The focal element is the one the visitor came to act on. The logo is already in the corner of every page.",
  },
  {
    id: "scale-ratio",
    prompt: "Which heading sizes follow one ratio?",
    options: [
      "16, 18, 20, 22, 24",
      "16, 20, 25, 31, 39",
      "16, 24, 26, 40, 41",
      "16, 32, 33, 34, 35",
    ],
    answer: 1,
    note: "Each step is ×1.25 (a major third). Equal ratios read as equal steps; equal pixel gaps do not.",
  },
];

export const bosses: BossDef[] = [
  {
    id: "swim",
    client: "Tidewater Swim School",
    tagline: "Children's swimming lessons, landing page",
    brief:
      "Parents ring us to ask how to book a trial, and the offer is the first thing on the page. My daughter says the site sounds like it's shouting. I don't know what she means, but she's usually right.",
    from: "Marisol, head coach",
    html: swimHtml,
    css: swimCss,
    hints: [
      "Blur your eyes at the preview. Does any line stand out from the rest?",
      "body sets font-weight: 700, so every paragraph is bold. Set body text to 400 and keep bold for headings and the booking button.",
      "For bonus stars: make .ages smaller or greyer than body text while keeping 4.5:1, and give h1 and h2 a font-size with clamp().",
    ],
  },
  {
    id: "records",
    client: "Halden Records",
    tagline: "Record shop, product page",
    brief:
      "Customers email me to ask what's on the record. The tracklist is right there. They scroll past it because it looks like every other part of the page.",
    from: "Tomas, owner",
    html: recordsHtml,
    css: recordsCss,
    hints: [
      "Compare the headings 'Tracklist' and 'Side A'. Can you tell which one contains the other?",
      "h2 is 21px and h3 is 20px: 5% apart. Neighbouring heading levels need at least 20%.",
      "Build the sizes on one ratio, for example h3 at 18px and h2 at about 27px. Then make .crumbs and the track times smaller and greyer.",
    ],
  },
  {
    id: "theatre",
    client: "The Lantern",
    tagline: "Small theatre, listings page",
    brief:
      "People turn up on the wrong night. They see the dates, but they don't notice which show is on now. The last agency said dates are important, so they made them big.",
    from: "Priya, box office",
    html: theatreHtml,
    css: theatreCss,
    hints: [
      "Which text on the page is the largest? Is it the show that's on now?",
      ".when and .date are 24px bold capitals, nearly the size of the show title. Dates are details: step them back.",
      "Make the h1 at least 1.5× anything else, for example clamp(2.5rem, 1.8rem + 2.5vw, 3.25rem), and set the dates to 14px at normal weight.",
    ],
  },
];

export const clue: Clue = {
  title: "The price list",
  body: "Marisol kept Lorem & Ipsum's quote. Line four: 'Bold text on every line, included at no extra cost.' Line five: 'Heading sizes, one size fits all.' Somebody wrote those lines on purpose.",
};
