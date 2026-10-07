import type { BossDef, Clue, QuizQuestion, RuleCard } from "../types";
import dentalCss from "./bosses/dental.css?raw";
import dentalHtml from "./bosses/dental.html?raw";
import libraryCss from "./bosses/library.css?raw";
import libraryHtml from "./bosses/library.html?raw";
import potteryCss from "./bosses/pottery.css?raw";
import potteryHtml from "./bosses/pottery.html?raw";

export const rules: RuleCard[] = [
  {
    id: "measure-ratio",
    title: "Measure the ratio",
    rule: "Body text needs 4.5:1 against its background. Text at 24px, or about 19px in bold, needs 3:1.",
    why: "WCAG 2.x starts from the 3:1 that older display standards recommend and multiplies it by 1.5, the loss in contrast sensitivity associated with 20/40 vision.",
    source: "W3C, Understanding WCAG 2.2, Success Criterion 1.4.3",
  },
  {
    id: "real-background",
    title: "Count the real background",
    rule: "Measure text against the colour it sits on: every translucent layer composited down to one opaque colour.",
    why: "A text colour is only half of a contrast pair. WCAG counts a text colour set without a background colour as a failure, because the reader's default background is unknown.",
    source: "W3C, Understanding WCAG 2.2, Success Criterion 1.4.3",
  },
  {
    id: "build-oklch",
    title: "Build in OKLCH",
    rule: "Write palette colours once, as oklch() custom properties: lightness, chroma, hue.",
    why: "OKLCH lightness follows perceived lightness across hues far more closely than HSL, so a palette's steps look even. Contrast still has to be measured: WCAG uses relative luminance.",
    code: "--clay: oklch(50% 0.13 40);",
    source: "Ottosson 2020, Oklab; CSS Color Module Level 4; WCAG 2 relative luminance",
  },
  {
    id: "accents-few",
    title: "Neutrals quiet, accents few",
    rule: "Keep neutrals under 0.1 chroma and use two accent hues at most.",
    why: "Colour guides attention in visual search when it differs from its surroundings. An accent stands out against neutrals, not against four other accents.",
    source: "Wolfe & Horowitz 2017. The two-hue limit is Ada's rule",
  },
  {
    id: "not-colour-alone",
    title: "Never colour alone",
    rule: "Every state that colour shows (an error, the current page, sold out) also shows in shape, weight or words.",
    why: "WCAG 2.x Success Criterion 1.4.1. Red-green colour deficiency affects about 8% of men and 0.4% of women of European descent.",
    source: "W3C, Understanding WCAG 2.2, Success Criterion 1.4.1; Birch 2012",
  },
  {
    id: "underline-links",
    title: "Underline links in text",
    rule: "Underline links that sit inside paragraphs.",
    why: "A link marked only by colour depends on the reader seeing that colour. WCAG Technique G183 allows it only with 3:1 against the surrounding text and an extra cue on hover and focus.",
    source: "W3C, Technique G183; Understanding WCAG 2.2, Success Criterion 1.4.1",
  },
];

/* Mini mockups. Inline styles keep them self-contained. */
const twoButtons = `
  <div style="font:600 15px/1.3 system-ui;display:flex;gap:10px">
    <span style="padding:8px 14px;border-radius:4px;background:hsl(60 100% 50%);color:#fff">Book now</span>
    <span style="padding:8px 14px;border-radius:4px;background:hsl(240 100% 50%);color:#fff">Book now</span>
  </div>`;

const field = (label: string, border: string) => `
  <span style="display:grid;gap:4px">
    <span>${label}</span>
    <span style="display:block;height:30px;border:2px solid ${border};border-radius:4px;background:#fff"></span>
  </span>`;

const errorForm = `
  <div style="font:14px/1.4 system-ui;display:grid;gap:10px;max-width:240px">
    ${field("Full name", "#8a9a98")}
    ${field("Mobile number", "#d14343")}
  </div>`;

const greenLinks = `
  <p style="font:15px/1.6 Georgia,serif;max-width:300px;color:#2b2622">
    Groups of more than four should <span style="color:#2f6b45">book a place</span> first. Read the <span style="color:#2f6b45">club rules</span> before the first session.
  </p>`;

const rainbow = `
  <div style="font:600 14px/1.3 system-ui;display:flex;flex-wrap:wrap;gap:8px;max-width:300px">
    ${["#e8836b", "#6bbf8a", "#8f86d9", "#e5b54a", "#5aaed6"]
      .map(
        (c) =>
          `<span style="padding:6px 12px;border-radius:999px;background:${c};color:#fff">Book</span>`,
      )
      .join("")}
  </div>`;

export const quiz: QuizQuestion[] = [
  {
    id: "lightest-grey",
    prompt: "Which is the lightest grey that passes 4.5:1 as body text on white?",
    options: ["#aaaaaa", "#999999", "#888888", "#767676"],
    answer: 3,
    note: "#767676 is 4.54:1 on white. #888888 is about 3.5:1, #999999 about 2.8:1 and #aaaaaa about 2.3:1.",
  },
  {
    id: "large-text",
    prompt:
      "A 24px heading and a 16px caption share one colour, at 3.4:1 against the background. Which pass WCAG 2.x AA?",
    options: ["The heading only", "Both", "Neither", "The caption only"],
    answer: 0,
    note: "24px (18pt) is large text, which needs 3:1. The 16px caption needs 4.5:1.",
  },
  {
    id: "origin",
    prompt: "Where does the 4.5:1 minimum come from?",
    options: [
      "A reading-speed experiment that found 4.5:1 to be the best ratio",
      "3:1 from older display standards, multiplied by 1.5 to allow for 20/40 vision",
      "The average contrast of printed books",
      "The default contrast setting of most monitors",
    ],
    answer: 1,
    note: "WCAG's Understanding document cites ISO-9241-3 for 3:1 and a contrast sensitivity loss of about 1.5 at 20/40 vision. It is an engineering threshold, not a reading-speed optimum.",
  },
  {
    id: "hsl-lies",
    prompt:
      "Both buttons are hsl(… 100% 50%), the same lightness number. Why does the white label read on one and vanish on the other?",
    visual: twoButtons,
    options: [
      "HSL lightness is a formula on the RGB channels, not perceived lightness: yellow at 50% looks far lighter than blue at 50%",
      "The yellow needs more saturation",
      "Screens show yellow too bright",
      "White labels never pass contrast",
    ],
    answer: 0,
    note: "White on hsl(60 100% 50%) is about 1.1:1. White on hsl(240 100% 50%) is about 8.6:1.",
  },
  {
    id: "same-oklch-l",
    prompt:
      "Two accent colours share OKLCH lightness 55% but differ in hue. What can you say about white text on each?",
    options: [
      "The contrast ratios are identical",
      "The ratios will be close, but measure both: WCAG uses relative luminance, which OKLCH lightness does not fix exactly",
      "There is no relation between the two",
      "OKLCH colours always pass contrast",
    ],
    answer: 1,
    note: "Equal OKLCH lightness gives similar luminance, which makes palettes easy to plan. The ratio still comes from the WCAG formula.",
  },
  {
    id: "overlay",
    prompt:
      "Caption text sits on a white card at 60% opacity, over a navy band. What background sets the caption's contrast?",
    options: [
      "White, the card's colour",
      "Navy, the band's colour",
      "The composite: 60% white painted over navy",
      "Whichever of the two is lighter",
    ],
    answer: 2,
    note: "A translucent layer mixes with what is under it. The reader sees one colour, and that is the colour to measure against.",
  },
  {
    id: "error-border",
    prompt:
      "A form marks the field with a problem by a red border. The others have grey borders. Which fix meets WCAG 1.4.1?",
    visual: errorForm,
    options: [
      "A brighter red",
      "Make every border red so nothing is missed",
      "Keep the red and add a heavier border and a short message",
      "A red background on the whole form",
    ],
    answer: 2,
    note: "Colour can stay. The state also needs a cue that does not depend on seeing the hue: weight, shape or words.",
  },
  {
    id: "green-links",
    prompt:
      "Links in a paragraph are dark green, the text is near-black, and nothing is underlined. What is the problem?",
    visual: greenLinks,
    options: [
      "Links should always be blue",
      "Green is too saturated for a link",
      "Nothing: the colour marks the links",
      "Readers who can't tell the green from the black can't find the links. Underline them",
    ],
    answer: 3,
    note: "Dark green and near-black differ mainly in hue. An underline does not depend on seeing it.",
  },
  {
    id: "rainbow",
    prompt: "Five buttons on a class schedule each get their own pastel. What goes wrong?",
    visual: rainbow,
    options: [
      "With five accent hues, no colour marks anything, and white labels on pastels fail contrast",
      "Pastels can't be written in OKLCH",
      "There are not enough colours",
      "Buttons must be grey",
    ],
    answer: 0,
    note: "One accent for the action, neutrals for the rest. Pastel fills behind white text sit near 2.5:1.",
  },
  {
    id: "greyscale",
    prompt: "You view a design in greyscale. What does that check?",
    options: [
      "Whether it passes WCAG contrast",
      "Whether any state or message depends on hue alone",
      "Whether the palette uses OKLCH",
      "How it will print",
    ],
    answer: 1,
    note: "Greyscale removes hue and keeps lightness. It does not compute a contrast ratio; that still needs the formula.",
  },
  {
    id: "prevalence",
    prompt: "Which figure for red-green colour deficiency is accurate?",
    options: [
      "About 8% of all people",
      "About 1 in 1,000 people",
      "About 8% of men and 0.4% of women of European descent",
      "About half of all men",
    ],
    answer: 2,
    note: "Birch's 2012 review of population surveys. Rates differ by population: 4 to 6.5% of men of Chinese and Japanese descent.",
  },
  {
    id: "apca",
    prompt: "What is the status of APCA, the Accessible Perceptual Contrast Algorithm?",
    options: [
      "It replaced the WCAG 2.x ratio in 2023",
      "A proposed method. WCAG 3's contrast algorithm is not decided, so client work is checked against WCAG 2.x",
      "It is a colour space, like OKLCH",
      "It is the legal standard in the EU",
    ],
    answer: 1,
    note: "APCA was removed from the WCAG 3 working draft in 2023. WCAG 2.x is the standard in force.",
  },
];

export const bosses: BossDef[] = [
  {
    id: "dental",
    client: "Alder Street Dental",
    tagline: "Dental surgery, booking form",
    brief:
      "Patients ring to say the form won't send. When I sit with them, the form has marked a box as wrong and they can't see which one. One gentleman said the small grey writing under the boxes might as well not be there.",
    from: "Gwen, practice manager",
    html: dentalHtml,
    css: dentalCss,
    hints: [
      "Imagine the page with the colour drained out. Which field is in trouble?",
      "The mobile number field differs from the name field only in border colour and text colour. The hints under the fields are #a0a0a0 on white.",
      "Give .field.is-error input a heavier border-width, or add a word with .field.is-error .hint::before and a content value. Then darken .hint, the phone number in the header and the button until each reaches 4.5:1.",
    ],
  },
  {
    id: "library",
    client: "Fenwick Library",
    tagline: "Public library, events page",
    brief:
      "Every week we get emails asking how to book Rhyme time. The booking link is right there in the description. People also tell us they can't work out which part of the site they're on.",
    from: "Hollis, events librarian",
    html: libraryHtml,
    css: libraryCss,
    hints: [
      "Read the Rhyme time description. Where is the link, and how would you know?",
      "The stylesheet sets text-decoration: none on every link, so links in paragraphs are marked only by green. The Events tab is marked only by its colour too.",
      "Bring back text-decoration on links inside paragraphs. For .tab.current, add something that is not colour, such as a bottom border or a heavier font-weight.",
    ],
  },
  {
    id: "pottery",
    client: "Saltmarsh Pottery",
    tagline: "Clay studio, class schedule",
    brief:
      "My older students say they can't read the class times, and one said the whole site looks washed out. And every week somebody books the Saturday wheel class, which has been full since June.",
    from: "Ines, studio owner",
    html: potteryHtml,
    css: potteryCss,
    hints: [
      "Which text would you struggle to read on a phone in sunlight?",
      ".when and .tag are pale grey on cream, and the white button labels sit on pastel fills. The Saturday class differs from Thursday's only in its button colour.",
      "Darken the times and the button fills until each passes 4.5:1. Mark .sold-out in a way that is not colour, for example text-decoration on its .book link or a ::after word on its heading.",
    ],
  },
];

export const clue: Clue = {
  title: "The palette file",
  body: "Ines sent me the files Lorem & Ipsum handed over. One is called palette-final-v2.css. Every grey in it fails 4.5:1 on white, and the comment at the top reads 'Approved. Do not test.' Gwen's site has the same file, line for line.",
};
