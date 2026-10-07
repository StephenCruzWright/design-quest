# Game plan

Design Quest teaches the rules behind good web design, not tools or trends. It started from one designer's placement test. Their eye was good but their reasoning had gaps: spacing as a ratio system, hierarchy through size and weight, colour as a model, typography reasoning, Gestalt beyond proximity, alignment vocabulary and grids. The game covers those gaps in that order of payoff, and it is built so anyone can play it.

Two things come out of a full playthrough:

1. The skill. Every principle is applied to a real page with real CSS, and the result is measured, not graded on vibes.
2. A portfolio piece. The game exports a case study page with a before/after slider for every client, the CSS the player wrote and their one-sentence reasoning.

The research behind the mechanics, the lesson claims and the thresholds is in `research/`: `game-design.md`, `learning-science.md` and `design-theory.md`. A mechanic or a claim that contradicts those papers needs a reason written next to it.

## Story

The player is a new hire at Kerning & Co., a two-person studio run by Ada Kern. It is the last independent studio on its street. Every broken client page in the game was built by the same template mill, Lorem & Ipsum, and each page carries their credit in its footer (`data-dq-ignore`, so measurement skips it).

- Each desk opens with a note from Ada and closes with a clue about Lorem & Ipsum: who runs it, why its pages fail the same way, why it keeps undercutting Kerning & Co.
- The Final Client (level 8) is Lorem & Ipsum's own site, rebuilt by the player.
- Clients describe symptoms in their own words, never the fix. Their briefs are the hook for each job.

## The loop

Each level is one desk:

1. **Lesson.** About six pages. Each page states the principle, the perceptual or cognitive reason it works with a source, and an interactive demo where the player drags a control and watches a layout fall apart or come together.
2. **Gates.** Every lesson page ends with a gate, and the next page stays locked until the gate is passed. A gate is either a *choice* (one question, options shuffled; a wrong pick shows why it is wrong and locks that option) or a *goal* (reach a target state in the demo, for example "make the gap between dishes 2× the gap inside them"). Pages already passed stay open. Gates are retrieval practice, which only helps when the answer is followed by feedback, so every gate explains why each wrong option is wrong.
3. **Rule cards.** Finishing the lesson adds its rules of thumb to the Field Guide. Each card has a source line.
4. **Trial.** Five judgment questions ("what's wrong here, and what's the fix?") drawn from a pool of twelve, options shuffled every run.
5. **Clients.** Three broken client pages. The player edits the page's real stylesheet in a CSS editor. Layout checks measure the rendered page on every edit. All core checks pass: the job can ship. Bonus checks unlock once every core check passes, and each one passed adds a star, up to three.
6. **Rationale.** Before shipping, the player writes one or two sentences on why the fix works. It is required, it goes into the case study, and it is self-explanation practice.

A placement test at the start suggests a level order. Once the placement is done or skipped, the map lets players take levels in any order.

## Game feel

Every effect answers a player action or marks a change of state, and its size tracks how well the player did: feedback that depends on success raises motivation, while amplified feedback on its own lowers it (`research/game-design.md`). Nothing animates over lesson text while the player reads it, because decoration beside reading material lowers learning (`research/learning-science.md`). Every effect has a still alternative under `prefers-reduced-motion` and the in-game Motion setting.

- **The player sprite.** A drawn SVG character in the line style of `src/ui/marks.ts`. On first launch the player picks a name and one of four looks. States: idle, think, cheer, wince, sweat, walk. It walks between desks on the map, stands still beside lesson gates until the player answers, and reacts to quiz answers and to checks on the client screen.
- **Ada.** A drawn portrait with expressions (neutral, raised eyebrow, nod) in place of initials.
- **Client problems bar.** On the client screen, each failing core check is one segment of the client's problems bar. Fixing a check knocks a segment out. An empty bar shows the "Ship it" stamp.
- **Stamps.** Correct answers, passed checks and shipped jobs land as rubber stamps. Wrong answers shake once.
- **Results.** Stars stamp in one at a time with a short pause between them. Paper-strip confetti in role colours. XP counts up.
- **Streaks.** The trial shows a streak of correct answers. A broken streak costs nothing.
- **Promotion.** A full-screen promotion card from Ada when the rank changes.
- **Sound.** Short, optional, off when the Sound setting is off (milestone 6).

## Copy standard

Every sentence a player reads is story or fact.

- **Story** builds the studio, the clients and the Lorem & Ipsum thread.
- **Fact** is checkable: a finding about perception or reading with a source, a standard (WCAG), a CSS behaviour, or a fact about the interface ("Five questions from a pool of twelve").
- A studio rule of thumb is labelled as a rule ("Ada's rule: 2×"), never presented as a law of perception.
- Rule cards carry a `source`. Lesson pages list their `sources`. The Field Guide shows both.
- No filler: no sentence that only restates the one before it, no motivational lines without content.

## Integrity

A core `intact` check runs on every client in every level. Every element in the client HTML that carries its own text must stay rendered, at least 12px, inside the 760px frame, with an opacity chain of at least 0.6 and a text colour alpha of at least 0.6. Hiding or shrinking content cannot pass a level. Original pages pass `intact`; their failures come from the level's own checks.

## Levels and their checks

Thresholds are normal / New Game+. "Research", "standard" and "studio rule" say where each threshold comes from; see `research/design-theory.md`.

### 1. Spacing and whitespace

Data attributes: `data-dq-section`, `data-dq-stack`, `data-dq-group`.

| Check | Kind | Threshold | Source |
| --- | --- | --- | --- |
| Between > within | core | gap between groups ≥ 2× / 2.5× the largest gap inside them | studio rule on top of proximity research |
| Ratio scale | core | each distinct spacing value ≥ 25% / 40% above the last | studio rule |
| Economy | core | ≤ 6 / 5 distinct values | studio rule |
| Tokens | bonus | ≥ 90% / 100% of spacing declarations use custom properties | practice |
| Three tiers | bonus | section gap ≥ 1.5× / 2× the largest group gap | studio rule |

Clients: Crumb & Co. (bakery menu), Pipeline (SaaS pricing), Field Notes (essay blog).

### 2. Visual hierarchy

Data attributes: `data-dq-focus` (the one element the client needs seen first), `data-dq-quiet` (secondary text such as dates and captions).

| Check | Kind | Threshold |
| --- | --- | --- |
| Heading scale | core | each heading level's computed `font-size` ≥ 1.2× / 1.25× the next level present; the lowest heading ≥ body size |
| Focus | core | `[data-dq-focus]` is the largest text on the page and ≥ 1.5× / 1.75× the next largest |
| Restraint | core | text at `font-weight` ≥ 600 is ≤ 30% / 20% of rendered characters |
| Quiet | bonus | every `[data-dq-quiet]` is smaller, lighter or lower in contrast than body text, and still ≥ 4.5:1 |
| Fluid | bonus | ≥ 2 `font-size` declarations use `clamp()`, directly or through a custom property |

Lesson: where the eye lands (squint test); size, weight and colour as three dials; a type scale is a ratio; when everything is bold; emphasise by de-emphasising; fluid type with `clamp()`.

Clients: a swim school sign-up page (everything bold, the booking line buried), a record shop product page (heading sizes 22, 21 and 20px), a theatre listing (dates louder than show titles).

### 3. Colour and OKLCH

Data attributes: `data-dq-state` with `data-dq-peer` (an element in a state, such as error or selected, and an element of the same kind not in it).

| Check | Kind | Threshold |
| --- | --- | --- |
| Contrast | core | every text element ≥ 4.5:1 / 7:1 against its effective background (large text 3:1 / 4.5:1), WCAG 2.x |
| Not colour alone | core | each `[data-dq-state]` differs from its peer in a non-colour property (border width or style, weight, size, decoration, generated text or icon), WCAG 1.4.1 |
| Links | core | links inside body text are underlined |
| OKLCH palette | bonus | ≥ 90% of colour declarations use `oklch()` custom properties |
| Restrained accents | bonus | at most two hues with OKLCH chroma above 0.1 |

The effective background composites every ancestor background with its alpha, down to white. Large text is at least 24px, or 18.66px at weight 700. Hues within 30° count as one (studio rule).

Lesson: what 4.5:1 means and where it comes from; the background you actually see; why HSL lightness misleads (OKLCH, with APCA named as a proposal); lightness, chroma, hue and a two-accent palette; never by colour alone; links in running text.

Clients: a dental booking form (a missing field marked only by a red border, pale hints), a library events page (links and the current tab marked only by colour), a pottery class schedule (pale times, white labels on pastels, a sold-out class shown only by a paler button).

### 4. Typography

| Check | Kind | Threshold |
| --- | --- | --- |
| Measure | core | body paragraphs average 45 to 75 / 50 to 70 characters per line, counted from rendered line boxes |
| Leading | core | body `line-height` 1.4 to 1.7 × `font-size`; headings ≤ 1.3 |
| Families | core | ≤ 2 font families on rendered text; monospace in `code` and `pre` is exempt |
| Measure in ch | bonus | body `max-width` set in `ch` |
| Paragraph rhythm | bonus | space between paragraphs ≥ one line of leading |

### 5. Gestalt

Two puzzle clients (`BossDef.kind: "puzzle"`): drag items into groups, then name the principle at work. One CSS client checked on common region (each `data-dq-group` has a visible box or passes the level 1 proximity ratio) and similarity (elements with the same `data-dq-kind` share a style signature of colour, size and weight; different kinds differ in at least one).

### 6. Alignment and balance

| Check | Kind | Threshold |
| --- | --- | --- |
| Edges | core | ≤ 2 distinct left edges per section (edges within 1px merge) |
| One alignment | core | no block mixes centred and left-aligned text |
| Optical alignment | bonus | `[data-dq-optical]` marks (quotes, icons) hang outside the text edge |

### 7. Grids and proportion

| Check | Kind | Threshold |
| --- | --- | --- |
| On the grid | core | every `[data-dq-col]` edge lands within 1px of a column line resolved from the computed `grid-template-columns` |
| Gutters | core | `column-gap` values sit on the level 1 spacing scale |
| Proportion | bonus | the main and side columns follow a named ratio (1:1.5, 1:2, golden) within 2% |

### 8. The Final Client

Lorem & Ipsum's own site. Every core check from levels 1 to 7 on one page, each with its data attributes. Bonus checks from every level count, still capped at three stars.

## Replay value

- Three clients per level, so a replay is a different puzzle.
- Quiz questions come from a pool, and options are shuffled each run.
- Star ratings and best times per client.
- New Game+: the stricter thresholds above and 1.5× XP. It keeps separate star records.
- Arcade mode, "Spot the Flaw": see below.
- Badges for specific feats.

## Progress and rewards

- **XP.** Lesson 60, each correct trial answer 20 plus 30 for a perfect trial, clients 100 / 160 / 240 for one, two and three stars (× 1.5 in New Game+), badges 50. A level is worth up to 910 XP before badges.
- **No farming.** Every payout pays only the improvement over the previous best. Replaying a client at the same star count pays nothing, so the only way to gain XP is to do better or do something new. There is no dominant strategy that trades repetition for XP.
- **Ranks.** Intern to Creative Director, spread over all eight levels.
- **Badges.** Per level: one for the principle (for example "Ratio Wrangler") and one for shipping all three clients. Global: first lesson, perfect trial, no hints, under five minutes, New Game+ win.
- **Saves.** Progress saves to `localStorage` and can be exported as a save code, because itch.io embeds can lose storage. Drafts save while the player types, and reached lesson pages are saved.

## Placement test

Sixteen questions, two from each level's pool (questions tagged `placement`). It awards no XP and can be skipped. The result orders the map by score, weakest level first, with ties in level order. The map marks the suggested next desk; every desk stays open.

## Arcade mode: Spot the Flaw

An endless run of generated mini layouts from a seeded generator. Each layout has one to three injected flaws: broken proximity, a contrast failure, an extra alignment edge, a flat type scale, an over-long measure. Only flaw types from completed levels appear. The player clicks the flaw and names the principle. Three lives; a correct pick extends the timer. The best streak is saved per seed day.

## Case study export

One self-contained HTML file built in the browser and downloaded: per client, a before/after slider (two static renders of the page), the player's CSS, their rationale, stars and checks passed. No network calls; fonts are system stacks.

## Tech approach

- Vite and TypeScript, vanilla DOM. The output is a static folder that runs from any subpath.
- CodeMirror 6 for the CSS editor, with a read-only HTML tab so players can see the selectors.
- culori for OKLCH conversion and contrast maths.
- Client pages render in a script-less, same-origin iframe at a fixed 760px layout width. The game swaps the page's `<style>` on each edit, measures, and re-runs the checks after a short debounce.
- The game's own UI is a worked example of the course: a ratio spacing scale, a modular type scale with `clamp()`, an OKLCH palette and AA contrast in both themes.

## Project layout

```text
research/                 literature reviews behind mechanics, claims and thresholds
src/
  main.ts                 routes and app shell
  router.ts               hash router
  engine/
    sandbox.ts            iframe rendering at a fixed width
    measure/              DOM reads: geometry, visual boxes, spacing, type, colour, integrity
    judges/               pure check functions, one file per principle
    quiz.ts, random.ts    question draw and seeded shuffle
  levels/
    01-spacing/           lesson.ts, content.ts (rules, quiz, clients), bosses/*.html|css
  state/                  save data, XP and ranks, badges, reward payouts
  screens/                one module per route
  ui/                     editor, judge panel, controls, modal, toasts, sprite, Ada, effects
  styles/                 tokens.css, base.css, app.css
tests/
  unit/                   vitest: judges and state
  e2e/                    Playwright harness, challenge suite, lesson gates
  solutions/              reference CSS per challenge (kept out of the bundle)
```

## Definition of done for a level

- Six or so lesson pages, each with a gate and its sources.
- Rule cards with sources, a quiz pool of twelve, three clients each with a brief, three hints, a Lorem & Ipsum footer and a 3-star reference solution.
- A `measure/<topic>.ts` and a pure `judges/<topic>.ts` with unit tests, plus the `intact` check.
- The browser suite: each original fails a core check and passes `intact`; each solution passes every check.
- Two badges, the desk's closing clue, and every player-facing line passes the copy standard and the "does this look AI-made?" list in `docs/design-system.md`.

## Milestones

Each milestone ends playable.

1. **Engine and level 1.** Sandbox, measurement, spacing checks, lesson, quiz, three clients, rationale, XP, ranks, badges, Field Guide, save codes, New Game+.
2. **Levels 2 to 4**, one pull request each.
   - **2a.** Lesson gates, the integrity check, locked bonuses, the sprite, Ada's portrait and the game-feel effects; level 1 reviewed against the copy standard and given gates, sources and the story thread; level 2, Visual hierarchy.
   - **2b.** Level 3, Colour and OKLCH.
   - **2c.** Level 4, Typography.
3. **Levels 5 to 7 and the final client.** Puzzle clients, alignment and grid checks, Lorem & Ipsum's site.
4. **Placement test and map ordering.**
5. **Arcade mode.**
6. **Case study export and polish.** Sound, keyboard paths through every demo, lazy-loading the editor, rank thresholds rescaled for eight levels.
7. **itch.io release.** A packaging script that zips `dist/` with `index.html` at the root, a cover image, store page text and a test inside a nested iframe. The owner uploads and publishes.

## Spoilers

`tests/solutions/` holds the answers. The first player should play each milestone before reading its level source or its solutions.
