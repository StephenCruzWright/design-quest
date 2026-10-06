# Game plan

Design Quest teaches the rules behind good web design, not tools or trends. It started from one designer's placement test. Their eye was good but their reasoning had gaps: spacing as a ratio system, hierarchy through size and weight, colour as a model, typography reasoning, Gestalt beyond proximity, alignment vocabulary and grids. The game covers those gaps in that order of payoff, and it is built so anyone can play it.

Two things come out of a full playthrough:

1. The skill. Every principle is applied to a real page with real CSS, and the result is measured, not graded on vibes.
2. A portfolio piece. The game exports a case study page with a before/after slider for every client, the CSS the player wrote and their one-sentence reasoning.

## The loop

The player is a new hire at Kerning & Co., a small studio run by Ada Kern. Each level is one desk:

1. **Lesson.** The principle, the perceptual or cognitive reason it works, and interactive demos where the player drags a control and watches a layout fall apart or come together.
2. **Rule cards.** Finishing the lesson adds its rules of thumb to the Field Guide.
3. **Trial.** Five judgment questions ("what's wrong here, and what's the fix?") drawn from a pool of about twelve, options shuffled every run.
4. **Clients.** Three broken client pages. The player edits the page's real stylesheet in a CSS editor. Layout checks measure the rendered page on every edit. All core checks pass: the job can ship. Bonus checks add stars, up to three.
5. **Rationale.** Before shipping, the player writes one or two sentences on why the fix works. It is required, it goes into the case study, and it trains the reasoning, not just the eye.

A placement test at the start suggests a level order. The map lets players take levels in any order once the placement is done.

## Levels and their checks

| # | Level | What the checks measure |
| --- | --- | --- |
| 1 | Spacing and whitespace | Gap between groups is at least 2× the largest gap inside them. Every spacing value sits on a ratio scale (each step at least 25% above the last). No more than six distinct values. Bonus: spacing comes from custom properties; section gaps are 1.5× the gaps between groups. |
| 2 | Visual hierarchy | Consecutive heading sizes differ by at least 1.2×. Not everything is bold. One element clearly dominates. Bonus: fluid type with `clamp()`. |
| 3 | Colour and OKLCH | Every text node reaches 4.5:1 against its effective background. The palette is defined as `oklch()` custom properties. State is never carried by colour alone. |
| 4 | Typography | Body measure between 45 and 75 characters, measured. Body leading 1.4 to 1.7, headings tighter. Two families at most. |
| 5 | Gestalt | Mostly interactive puzzles (drag items into groups, name the principle at work), plus a challenge on common region and similarity. |
| 6 | Alignment and balance | At most two distinct left edges per section. No mixed centred and left-aligned text in one block. Bonus: optical alignment. |
| 7 | Grids and proportion | Key elements land on column lines. Gutters come from the spacing scale. |
| 8 | Final client | One full broken page with every check from every level. |

## Replay value

- Three clients per level, so a replay is a different puzzle.
- Quiz questions come from a pool, and options are shuffled each run.
- Star ratings and best times per client.
- New Game+: stricter thresholds (for example AAA contrast instead of AA, a tighter measure range, a 2.5× proximity ratio) and 1.5× XP. It keeps separate star records.
- Arcade mode, "Spot the Flaw": an endless run of generated mini layouts, each with one to three injected flaws (broken proximity, a contrast failure, an extra alignment axis, a flat type scale). Click the flaw, name the principle, keep the streak.
- Badges for specific feats: beating a client without hints, under five minutes, in New Game+, and so on.

## Progress and rewards

- XP for finishing a lesson, for each correct quiz answer (with a bonus for a perfect run) and for client stars. Only improvements pay out, so replays cannot farm XP.
- Ranks from Intern to Creative Director.
- Progress saves to `localStorage` and can be exported as a save code, because itch.io embeds can lose storage.
- Drafts are saved while the player types, so a reload never loses work.

## Tech approach

- Vite and TypeScript, vanilla DOM. The output is a static folder that runs from any subpath.
- CodeMirror 6 for the CSS editor, with a read-only HTML tab so players can see the selectors.
- culori for OKLCH conversion and contrast maths (from the colour level on).
- Client pages render in a script-less, same-origin iframe at a fixed 760px layout width. The game swaps the page's `<style>` on each edit, measures, and re-runs the checks after a short debounce.
- The game's own UI is a worked example of the course: a ratio spacing scale, a modular type scale with `clamp()`, an OKLCH palette and AA contrast in both themes.

## Project layout

```text
src/
  main.ts                 routes and app shell
  router.ts               hash router
  engine/
    sandbox.ts            iframe rendering at a fixed width
    measure/              DOM reads: geometry, visual boxes, spacing values
    judges/               pure check functions, one file per principle
    quiz.ts, random.ts    question draw and seeded shuffle
  levels/
    01-spacing/           lesson.ts, content.ts (rules, quiz, clients), bosses/*.html|css
  state/                  save data, XP and ranks, badges, reward payouts
  screens/                one module per route
  ui/                     editor, judge panel, controls, modal, toasts
  styles/                 tokens.css, base.css, app.css
tests/
  unit/                   vitest: judges and state
  e2e/                    Playwright harness and challenge suite
  solutions/              reference CSS per challenge (kept out of the bundle)
```

## Milestones

Each milestone ends playable.

1. **Engine and level 1.** Sandbox, measurement, spacing checks, lesson with demos, quiz pool, three clients, rationale, XP, ranks, badges, Field Guide, save codes, New Game+ thresholds.
2. **Levels 2 to 4.** Hierarchy, colour, typography: the gaps with the most payoff after spacing.
3. **Levels 5 to 7 and the final client.** Gestalt puzzles, alignment and grid checks.
4. **Placement test and level map.** The test suggests an order; the map allows reordering.
5. **Arcade mode.** The flaw generator and its scoring.
6. **Case study export and polish.** A self-contained HTML case study downloaded from the browser; sound, celebration effects, keyboard paths, reduced motion; lazy-loading the editor to cut the first download.
7. **itch.io release.** A packaging script that zips `dist/` with `index.html` at the root, a cover image, store page text and a test inside a nested iframe. The owner uploads and publishes.

## Spoilers

`tests/solutions/` holds the answers. The first player should play each milestone before reading its level source or its solutions.
