import { toggleGroup } from "../../ui/controls";
import { $ } from "../../util/dom";
import type { DemoContext, LessonSection } from "../types";

type Axis = "none" | "rows" | "cols";

/** A grid of dots. `colour` and `shape` pick which axis each cue follows. */
function dots(n: number, colour: Axis, shape: Axis = "none"): string {
  const pick = (axis: Axis, r: number, c: number) =>
    axis === "rows" ? r % 2 : axis === "cols" ? c % 2 : 0;
  let out = "";
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      out += `<span class="gs-dot" data-c="${pick(colour, r, c)}" data-s="${pick(shape, r, c)}"></span>`;
  return out;
}

/** Demo: an evenly spaced grid that colour alone turns into rows or columns. */
function similarityDemo(host: HTMLElement, ctx: DemoContext) {
  host.innerHTML = `
    <div class="demo-stage gs-stage"><div class="gs-grid" style="--n:5"></div></div>
    <div class="demo-controls-row"></div>
    <p class="demo-readout"></p>`;
  const grid = $<HTMLElement>(host, ".gs-grid");
  const readout = $<HTMLElement>(host, ".demo-readout");
  const update = (v: string) => {
    grid.innerHTML = dots(5, v as Axis);
    readout.innerHTML =
      v === "none"
        ? "One colour, even spacing: <strong>one block</strong> with no groups."
        : `The spacing never changed. Colour alone makes <strong>${v === "rows" ? "rows" : "columns"}</strong>.`;
    if (v === "cols") ctx.complete();
  };
  $(host, ".demo-controls-row").append(
    toggleGroup({
      label: "Colour",
      options: [
        { value: "none", label: "One colour" },
        { value: "rows", label: "Colour by row" },
        { value: "cols", label: "Colour by column" },
      ],
      value: "none",
      onChange: update,
    }),
  );
  update("none");
}

/** Demo: shape by row against colour by column. */
function shapeDemo(host: HTMLElement) {
  host.innerHTML = `
    <div class="demo-stage gs-stage"><div class="gs-grid" style="--n:5"></div></div>
    <div class="demo-controls-row"></div>`;
  const grid = $<HTMLElement>(host, ".gs-grid");
  const update = (v: string) => {
    grid.innerHTML = dots(5, v === "shape" ? "none" : "cols", v === "colour" ? "none" : "rows");
  };
  $(host, ".demo-controls-row").append(
    toggleGroup({
      label: "Cues",
      options: [
        { value: "shape", label: "Shape by row" },
        { value: "both", label: "Shape by row, colour by column" },
      ],
      value: "shape",
      onChange: update,
    }),
  );
  update("shape");
}

/** Demo: pairs by proximity, then tinted boxes that cut across the pairs. */
function regionDemo(host: HTMLElement) {
  host.innerHTML = `
    <div class="demo-stage gs-stage">
      <div class="gs-row" data-boxes="off">
        <span class="gs-dot"></span>
        <span class="gs-box"><span class="gs-dot"></span><span class="gs-dot"></span></span>
        <span class="gs-box"><span class="gs-dot"></span><span class="gs-dot"></span></span>
        <span class="gs-box"><span class="gs-dot"></span><span class="gs-dot"></span></span>
        <span class="gs-dot"></span>
      </div>
    </div>
    <div class="demo-controls-row"></div>`;
  const row = $<HTMLElement>(host, ".gs-row");
  $(host, ".demo-controls-row").append(
    toggleGroup({
      label: "Boxes",
      options: [
        { value: "off", label: "Spacing only" },
        { value: "on", label: "Add tinted boxes" },
      ],
      value: "off",
      onChange: (v) => (row.dataset.boxes = v),
    }),
  );
}

/** Demo: spacing and colour, each set to rows or columns. Goal: make them agree. */
function cuesDemo(host: HTMLElement, ctx: DemoContext) {
  host.innerHTML = `
    <div class="demo-stage gs-stage"><div class="gs-grid" style="--n:4"></div></div>
    <div class="demo-controls-row"></div>
    <p class="demo-readout"></p>`;
  const grid = $<HTMLElement>(host, ".gs-grid");
  const readout = $<HTMLElement>(host, ".demo-readout");
  let space: Axis = "rows";
  let colour: Axis = "cols";
  const update = () => {
    grid.innerHTML = dots(4, colour);
    grid.dataset.space = space;
    const agree = space === colour;
    readout.innerHTML = agree
      ? `Spacing and colour both make <strong>${space === "rows" ? "rows" : "columns"}</strong>. The cues add up.`
      : `Spacing makes <strong>${space === "rows" ? "rows" : "columns"}</strong> and colour makes <strong>${colour === "rows" ? "rows" : "columns"}</strong>. The cues fight, and the grid flickers between readings.`;
    if (agree) ctx.complete();
  };
  const axis = (label: string, value: Axis, set: (v: Axis) => void) =>
    toggleGroup({
      label,
      options: [
        { value: "rows", label: `${label} by row` },
        { value: "cols", label: `${label} by column` },
      ],
      value,
      onChange: (v) => {
        set(v as Axis);
        update();
      },
    });
  $(host, ".demo-controls-row").append(
    axis("Spacing", space, (v) => (space = v)),
    axis("Colour", colour, (v) => (colour = v)),
  );
  update();
}

/** Demo: a list whose items wander, then line up on one edge. */
function continuationDemo(host: HTMLElement) {
  host.innerHTML = `
    <div class="demo-stage gs-stage">
      <ul class="gs-list" data-aligned="false">
        <li style="--x:18px">Chair yoga, Monday 10:00</li>
        <li style="--x:0px">Pilates, Monday 18:30</li>
        <li style="--x:34px">Community choir, Tuesday 19:00</li>
        <li style="--x:8px">Chess club, Tuesday 14:00</li>
        <li style="--x:26px">Film night, Wednesday 19:30</li>
      </ul>
    </div>
    <div class="demo-controls-row"></div>`;
  const list = $<HTMLElement>(host, ".gs-list");
  $(host, ".demo-controls-row").append(
    toggleGroup({
      label: "Edges",
      options: [
        { value: "false", label: "Ragged" },
        { value: "true", label: "One left edge" },
      ],
      value: "false",
      onChange: (v) => (list.dataset.aligned = v),
    }),
  );
}

/** Demo: three ways to mark a card, from a full frame to a background. */
function closureDemo(host: HTMLElement) {
  host.innerHTML = `
    <div class="demo-stage gs-stage">
      <div class="gs-card" data-mark="frame">
        <p class="gs-card-title">Full service</p>
        <p>Gears indexed, bearings checked, both wheels trued.</p>
      </div>
    </div>
    <div class="demo-controls-row"></div>`;
  const card = $<HTMLElement>(host, ".gs-card");
  $(host, ".demo-controls-row").append(
    toggleGroup({
      label: "Card outline",
      options: [
        { value: "frame", label: "Full frame" },
        { value: "corners", label: "Corners only" },
        { value: "fill", label: "Background only" },
      ],
      value: "frame",
      onChange: (v) => (card.dataset.mark = v),
    }),
  );
}

export const lesson: LessonSection[] = [
  {
    id: "similarity",
    title: "Like with like",
    body: `
      <p>In 1923 Max Wertheimer described a second grouping factor after proximity. He called it the factor of similarity: “the tendency of like parts to band together”.</p>
      <p>Similarity works whether the designer meant it or not. Two buttons in one colour read as a pair. A note set exactly like a heading reads as a heading. Every look you give an element tells the visitor which kind of thing it is.</p>
      <p class="try">The dots below are evenly spaced. Use colour alone to turn them into columns.</p>`,
    demo: similarityDemo,
    gate: {
      kind: "goal",
      goal: "Make the grid read as columns, without moving a dot.",
      note: "Same spacing, new grouping. That is the power and the danger of colour on a page.",
    },
    sources: ["Wertheimer 1923, Laws of organization in perceptual forms"],
  },
  {
    id: "shape",
    title: "Shape is a quiet cue",
    body: `
      <p>Not every kind of similarity is equally strong. Ben-Av and Sagi masked grouped displays after a short delay: grouping by spacing showed up after 60 ms, and grouping by shape only after 160 ms. Rashal, Yeshurun and Kimchi found that grouping by spacing still worked when attention was elsewhere, and grouping by shape did not.</p>
      <p>So a page that marks warnings only with a triangle icon, in the same colour as everything else, asks the visitor to look for them. Add a second cue, such as colour or a label.</p>
      <p class="try">Compare shape alone with shape against colour.</p>`,
    demo: shapeDemo,
    gate: {
      kind: "choice",
      prompt: "Shape runs by row and colour runs by column. What does the visitor see first?",
      options: [
        "Columns, grouped by colour",
        "Rows, grouped by shape",
        "Both at once, equally",
        "Neither: only spacing groups things",
      ],
      answer: 0,
      note: "Colour wins. Shape grouping is slower and needs attention, so it loses a straight contest.",
      why: [
        "",
        "Shape is the slower cue, and it fades when attention is elsewhere. Colour gets there first.",
        "The two cues don't arrive together. Colour groups faster than shape.",
        "Spacing is one cue among several. Here it is even, and colour still groups the dots.",
      ],
    },
    sources: [
      "Ben-Av & Sagi 1995, Perceptual grouping by similarity and proximity",
      "Rashal, Yeshurun & Kimchi 2017, Attentional requirements in perceptual grouping",
    ],
  },
  {
    id: "region",
    title: "Common region",
    body: `
      <p>In 1992 Stephen Palmer added a principle the early Gestalt writers had missed: <strong>common region</strong>. Elements inside one bounded area, such as a tinted box or a border, group together. In his displays, a shared region could beat proximity: two dots far apart in one box read as a pair.</p>
      <p>Cards, panels, table rows with a background and fieldsets all work this way. It also means a box in the wrong place can override careful spacing.</p>
      <p class="try">Start with pairs made by spacing, then add the boxes.</p>`,
    demo: regionDemo,
    gate: {
      kind: "choice",
      prompt: "The spacing makes pairs. The boxes cut across them. Which grouping wins?",
      options: [
        "The boxes",
        "The spacing, because proximity is the fastest cue",
        "Neither: the dots read as one row",
        "Whichever pair is on the left",
      ],
      answer: 0,
      note: "A shared region beats proximity here, as it did in Palmer's displays. That is why a misplaced panel can put a session on the wrong day.",
      why: [
        "",
        "Proximity is fast, but a bounded region can still override it. Palmer showed exactly this case.",
        "With the boxes on, the dots split into the boxed pairs.",
        "Position on the page doesn't decide grouping.",
      ],
    },
    sources: ["Palmer 1992, Common region: a new principle of perceptual grouping"],
  },
  {
    id: "cues",
    title: "Cues add up",
    body: `
      <p>Kubovy and van den Berg showed people dot lattices that varied spacing and similarity at once. The combined pull of the two cues was the sum of each pull on its own. Cues add up.</p>
      <p>Two cues that agree make the strongest groups. Two that disagree split the vote, and the page reads two ways at once. Ada's rule: when a group matters, mark it twice, for example a box and the space around it, or a colour and a size.</p>
      <p class="try">The spacing makes rows and the colour makes columns. Make them agree.</p>`,
    demo: cuesDemo,
    gate: {
      kind: "goal",
      goal: "Set spacing and colour to group the same way.",
      note: "One clear reading. A visitor never has to decide which cue to believe.",
    },
    sources: [
      "Kubovy & van den Berg 2008, The whole is equal to the sum of its parts",
      "Wagemans et al. 2012, A century of Gestalt psychology in visual perception I",
    ],
  },
  {
    id: "continuation",
    title: "Good continuation",
    body: `
      <p>Elements that lie on one smooth line or curve group together. Gestalt psychology calls this <strong>good continuation</strong>, and it is one of the classical principles in Wagemans and colleagues' review.</p>
      <p>In a layout, a shared left edge is that line. Items that start on one edge read as a list. Items that wander read as separate notes. The next desk measures edges.</p>
      <p class="try">Line the list up on one edge.</p>`,
    demo: continuationDemo,
    gate: {
      kind: "choice",
      prompt: "Why does a list with one shared left edge read as one list?",
      options: [
        "The shared edge reads as a line that joins the items",
        "The items are closer together",
        "Lists always read as one",
        "The edge counts as a box around them",
      ],
      answer: 0,
      note: "Good continuation. The edge is invisible, and the eye still follows it.",
      why: [
        "",
        "The spacing didn't change in the demo. Only the edges moved.",
        "The ragged version is the same list, and it reads as scattered notes.",
        "There is no bounded region here, only an implied line.",
      ],
    },
    sources: ["Wagemans et al. 2012, A century of Gestalt psychology in visual perception I"],
  },
  {
    id: "closure",
    title: "Closure",
    body: `
      <p>The eye completes shapes whose outlines have gaps. Gestalt psychology calls this <strong>closure</strong>. A card drawn with only its corners still reads as a card.</p>
      <p>So a region does not need a heavy frame. A light background or a single rule can mark it with less ink, which leaves the content louder than the container. Less ink is Ada's rule, not a finding.</p>
      <p class="try">Switch between a full frame, corners only and a background.</p>`,
    demo: closureDemo,
    gate: {
      kind: "choice",
      prompt: "A card has a light background and no border. What does the visitor see?",
      options: [
        "One card: the background bounds a region",
        "Loose text with no group",
        "Two cards",
        "A broken layout",
      ],
      answer: 0,
      note: "The background is the region. The border was never needed.",
      why: [
        "",
        "A background that differs from the page is a bounded region, so its contents group.",
        "Nothing splits the background, so it reads as one area.",
        "Plenty of well-built pages mark cards with a background alone.",
      ],
    },
    sources: [
      "Wagemans et al. 2012, A century of Gestalt psychology in visual perception I",
      "Palmer 1992, Common region",
    ],
  },
];
