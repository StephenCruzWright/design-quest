import type { BossDef, Clue, QuizQuestion, RuleCard } from "../types";
import cyclesCss from "./bosses/cycles.css?raw";
import cyclesHtml from "./bosses/cycles.html?raw";
import farmshopCss from "./bosses/farmshop.css?raw";
import farmshopHtml from "./bosses/farmshop.html?raw";
import timetableCss from "./bosses/timetable.css?raw";
import timetableHtml from "./bosses/timetable.html?raw";

export const rules: RuleCard[] = [
  {
    id: "like-with-like",
    title: "Like with like",
    rule: "Give things of one kind one look, and things of different kinds different looks.",
    why: "Wertheimer called it the factor of similarity: “the tendency of like parts to band together”. A visitor groups what looks alike whether or not the designer meant it.",
    source: "Wertheimer 1923, Laws of organization in perceptual forms",
  },
  {
    id: "colour-over-shape",
    title: "Shape is a quiet cue",
    rule: "Don't rely on shape alone to group things. Use colour, space or a shared box.",
    why: "In lab tests, grouping by spacing showed up within 60 ms, and grouping by shape similarity only at 160 ms. Shape grouping also faded when attention was elsewhere, while grouping by spacing did not.",
    source: "Ben-Av & Sagi 1995 and Rashal, Yeshurun & Kimchi 2017",
  },
  {
    id: "common-region",
    title: "Common region",
    rule: "Things inside one box read as one group, even when spacing says otherwise.",
    why: "Palmer showed that elements inside a shared bounded region group together, and that a region can beat proximity. Cards, panels and fieldsets work because of it.",
    code: ".card { padding: var(--space-m); background: var(--card); }",
    source: "Palmer 1992, Common region: a new principle of perceptual grouping",
  },
  {
    id: "cues-add-up",
    title: "Cues add up",
    rule: "When two cues mark a group, make them agree.",
    why: "In dot-lattice experiments, the combined pull of proximity and similarity was the sum of each pull on its own. Two cues that agree make a stronger group. Two that disagree split the vote.",
    source: "Kubovy & van den Berg 2008. Two cues per kind is Ada's rule",
  },
  {
    id: "continuation",
    title: "Good continuation",
    rule: "Line related items up on one edge, so the edge reads as a line.",
    why: "Elements on a smooth line or curve group together. A shared left edge is that line in a layout. The next desk measures it.",
    source: "Wagemans et al. 2012, A century of Gestalt psychology in visual perception I",
  },
  {
    id: "closure",
    title: "Closure",
    rule: "A box does not need four full borders. A background or a partial outline is enough.",
    why: "The eye completes shapes with gaps in their outlines. A light background or a top rule marks a region with less ink than a heavy frame.",
    source: "Wagemans et al. 2012. Less ink is Ada's rule",
  },
];

/* Mini mockups. Inline styles keep them self-contained. */
const dot = (bg: string, radius = "50%") =>
  `<span style="display:block;width:18px;height:18px;border-radius:${radius};background:${bg}"></span>`;
const grid = (cells: string[]) =>
  `<div style="display:grid;grid-template-columns:repeat(4,18px);gap:14px">${cells.join("")}</div>`;

const colourColumns = grid(
  Array.from({ length: 16 }, (_, i) => dot(i % 4 < 2 ? "#2563eb" : "#d97706")),
);
const shapeVsColour = grid(
  Array.from({ length: 16 }, (_, i) =>
    dot(i % 2 ? "#d97706" : "#2563eb", Math.floor(i / 4) % 2 ? "2px" : "50%"),
  ),
);
const boxedPairs = `
  <div style="display:flex;align-items:center;gap:6px">
    ${dot("#334155")}
    <span style="display:flex;gap:28px;padding:8px;background:#e2e8f0;border-radius:6px">${dot("#334155")}${dot("#334155")}</span>
    ${dot("#334155")}
  </div>`;

export const quiz: QuizQuestion[] = [
  {
    id: "similarity-name",
    prompt: "The dots are evenly spaced. What makes them read as two vertical bands?",
    visual: colourColumns,
    options: ["Proximity", "Similarity of colour", "Closure", "Common region"],
    answer: 1,
    note: "The spacing is even, so spacing can't group them. Wertheimer's factor of similarity does.",
  },
  {
    id: "shape-colour",
    prompt: "Shape changes by row and colour changes by column. What does a visitor see first?",
    visual: shapeVsColour,
    options: [
      "Rows, grouped by shape",
      "Columns, grouped by colour",
      "One block with no groups",
      "Diagonals",
    ],
    answer: 1,
    note: "Shape is the weaker cue. In lab tests it took longer to group by and needed attention.",
  },
  {
    id: "region-wins",
    prompt: "The middle two dots sit far apart, but share a tinted box. How do they read?",
    visual: boxedPairs,
    options: [
      "As a pair, because they share the box",
      "As two separate dots, because the gap between them is the largest",
      "As part of one row of four",
      "As nothing in particular",
    ],
    answer: 0,
    note: "Palmer found that a common region can beat proximity. The box wins.",
  },
  {
    id: "cues-sum",
    prompt:
      "Kubovy and van den Berg combined proximity and colour similarity in one display. What did they find?",
    options: [
      "Colour always cancels out proximity",
      "The two pulls added up: together they were the sum of each alone",
      "Only the first cue the eye meets counts",
      "Proximity has no effect when colours differ",
    ],
    answer: 1,
    note: "Cues add up. Two cues that agree make a stronger group than either alone.",
  },
  {
    id: "region-why",
    prompt: "Why does a card with a background read as one unit?",
    options: [
      "Shadows are required for grouping",
      "Common region: things inside one bounded area are grouped together",
      "Cards are always 16px apart",
      "Rounded corners signal a group",
    ],
    answer: 1,
    note: "A background or border bounds a region, and everything inside it reads together.",
  },
  {
    id: "accidental-similarity",
    prompt:
      "A shop colours its product tags at random. Customers ask why the honey is with the vegetables. What happened?",
    options: [
      "Customers read the tags in alphabetical order",
      "Tags that share a colour read as a group, whether or not they are one",
      "The honey tag is too small",
      "Nothing: colour doesn't group things",
    ],
    answer: 1,
    note: "Similarity works whether you meant it or not. Give a colour a meaning, or give it to everything.",
  },
  {
    id: "kinds-look",
    prompt:
      "On a price list, the small print looks exactly like the list of what's included. What will customers do?",
    options: [
      "Read the small print as something included",
      "Skip the small print",
      "Read the price twice",
      "Nothing: the words explain themselves",
    ],
    answer: 0,
    note: "Same look, same kind. Make the note smaller, lighter or italic so it reads as a different kind of line.",
  },
  {
    id: "one-kind-two-looks",
    prompt:
      "One service name on a price list is red and bigger than the others. What does a visitor assume?",
    options: [
      "That it is a different kind of thing, such as an offer or a warning",
      "That it is the same as the others",
      "That the page is broken",
      "Nothing: visitors read every word",
    ],
    answer: 0,
    note: "A new look reads as a new kind. If the full service is just a service, give it the services' look.",
  },
  {
    id: "continuation",
    prompt: "Why do list items that share a left edge read as one list?",
    options: [
      "Good continuation: the shared edge reads as a line that joins them",
      "Closure: the list closes at the bottom",
      "Common region: the edge is a box",
      "They don't, unless they are bulleted",
    ],
    answer: 0,
    note: "Elements on one smooth line group together. Alignment is good continuation applied to layout.",
  },
  {
    id: "closure",
    prompt: "A card has only a top border and a light background. What does the visitor see?",
    options: [
      "A complete card: the eye closes the shape",
      "A line floating above some text",
      "Two separate objects",
      "Nothing, unless all four borders are drawn",
    ],
    answer: 0,
    note: "Closure fills in the missing edges. A background alone often marks a region with less ink than a frame.",
  },
  {
    id: "shape-only",
    prompt:
      "A dashboard marks warnings with triangles and normal items with circles, in the same colour. What is the risk?",
    options: [
      "Shape alone is a weak grouping cue, so the warnings don't stand out as a set",
      "Triangles are hard to render",
      "Circles read as buttons",
      "None: shape is the strongest cue",
    ],
    answer: 0,
    note: "Add a second cue, such as colour or a label. Shape on its own needs the visitor's attention to group.",
  },
  {
    id: "fix-grouping",
    prompt:
      "Three price cards share one spacing value, with no boxes. Which fix makes each card read as one?",
    options: [
      "Make every line bold",
      "Give each card a background or border, or double the space between cards",
      "Centre all the text",
      "Add more cards",
    ],
    answer: 1,
    note: "Common region or proximity, ideally both. Bold everywhere changes nothing about grouping.",
  },
];

export const bosses: BossDef[] = [
  {
    id: "farmshop",
    kind: "puzzle",
    client: "Hedgerow Farm Shop",
    tagline: "Farm shop, this week's stock board",
    brief:
      "Customers keep asking why the honey is with the vegetables, and whether the jam is organic like the apples. Nothing on the board is with anything. I coloured the tags so it looked cheerful.",
    from: "Wyn, owner",
    thanks: "So that's why they asked. The tags are all going back to one colour on Monday.",
    html: farmshopHtml,
    css: farmshopCss,
    hints: [
      "Look at the board as if from across the shop. What do you see before you read a word?",
      "Three colours, three tags each. The little shapes cut across the colours, and they are a much quieter cue.",
      "Sort by colour: sage, butter and clay. Then name the principle that groups things that look alike.",
    ],
    puzzle: {
      task: "Sort the tags into the groups a customer sees at a glance. There are three.",
      items: [
        { id: "leeks", label: "Leeks" },
        { id: "eggs", label: "Eggs" },
        { id: "kale", label: "Kale" },
        { id: "cheddar", label: "Cheddar" },
        { id: "honey", label: "Honey" },
        { id: "apples", label: "Apples" },
        { id: "potatoes", label: "Potatoes" },
        { id: "jam", label: "Jam" },
        { id: "milk", label: "Milk" },
      ],
      groups: [
        {
          items: ["leeks", "apples", "jam"],
          why: "Three sage tags. The jam looks like it belongs with the apples.",
        },
        {
          items: ["eggs", "cheddar", "milk"],
          why: "Three butter tags, scattered across the board and still one set.",
        },
        {
          items: ["kale", "honey", "potatoes"],
          why: "Three clay tags. That's how the honey ended up with the vegetables.",
        },
      ],
      principle: {
        prompt: "What made customers group the tags?",
        options: ["Proximity", "Similarity", "Common region", "Closure"],
        answer: 1,
        note: "Similarity: tags that share a colour read as a set. The shapes cut across the colours and barely register, because shape is the weaker cue.",
        why: [
          "Every tag sits the same distance from its neighbours, so spacing can't pick out a group.",
          "",
          "Each tag is its own box. No two tags share one.",
          "Closure completes broken outlines. Nothing on the board is incomplete.",
        ],
      },
    },
  },
  {
    id: "timetable",
    kind: "puzzle",
    client: "Cobble Lane Community Centre",
    tagline: "Community centre, weekly timetable",
    brief:
      "Half the choir came on Monday last week. It's a Tuesday choir. It has always been a Tuesday choir, and the timetable says so.",
    from: "Abena, centre manager",
    thanks: "We moved the panels and the whole choir came on Tuesday. Even the tenors.",
    html: timetableHtml,
    css: timetableCss,
    hints: [
      "Squint at the timetable. How many blocks do you see, and where do their edges fall?",
      "Community choir sits 30px below Pilates but right against Chess club. Which wins, the gap or the tint?",
      "Sort by tinted panel, so the choir goes with Monday's sessions. The principle is the one Palmer named in 1992.",
    ],
    puzzle: {
      task: "Sort the sessions into the groups a visitor sees. There are three.",
      items: [
        { id: "yoga", label: "Chair yoga" },
        { id: "pilates", label: "Pilates" },
        { id: "choir", label: "Community choir" },
        { id: "chess", label: "Chess club" },
        { id: "toddlers", label: "Toddler group" },
        { id: "knitting", label: "Knit and natter" },
        { id: "film", label: "Film night" },
      ],
      groups: [
        {
          items: ["yoga", "pilates", "choir"],
          why: "The Monday panel reaches down over the choir, so the choir reads as a Monday session.",
        },
        {
          items: ["chess", "toddlers"],
          why: "The Tuesday panel starts at Chess club, just below the choir.",
        },
        {
          items: ["knitting", "film"],
          why: "The Wednesday panel. Here the gap and the tint agree.",
        },
      ],
      principle: {
        prompt: "What put the choir on Monday?",
        options: ["Proximity", "Similarity", "Common region", "Good continuation"],
        answer: 2,
        note: "Common region: the tinted panel bounds the choir with Monday's sessions. Palmer found that a shared region can beat proximity, and here it does.",
        why: [
          "Proximity says Tuesday: the choir sits much closer to Chess club than to Pilates. The panel beats it.",
          "Every session is set in the same style, so nothing looks more alike than anything else.",
          "",
          "All the sessions share one left edge, so alignment can't split them.",
        ],
      },
    },
  },
  {
    id: "cycles",
    client: "Northgate Cycles",
    tagline: "Bike workshop, price list",
    brief:
      "Customers ask why the full service costs more when the safety check already does the brakes. They read the lines from one job into the next. Last week somebody asked to book 'Parts are extra'.",
    from: "Della, workshop owner",
    thanks: "Nobody has tried to book the small print this week, and the full service is selling.",
    html: cyclesHtml,
    css: cyclesCss,
    hints: [
      "Where does one job end and the next begin? Now point at a line that is a note, not something included.",
      "The packages share one spacing value and have no box. .incl and .note share one style, and .featured .name gives one service a look of its own.",
      "Give .package a background or border with some padding, and open the gap between packages. Make .note smaller and greyer than .incl, and remove the .featured .name rule.",
    ],
  },
];

export const clue: Clue = {
  title: "The window on Mercer Street",
  body: "I walked down Mercer Street at lunch. Ground floor, blinds half down, a brass plate: Lorem & Ipsum, Templates that work. Taped inside the window is our price list, with our name trimmed off and every price ten pounds lower.",
};
