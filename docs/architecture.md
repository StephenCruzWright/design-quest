# Architecture

## Flow of a challenge

1. `src/screens/boss.ts` creates two `Sandbox` instances (`src/engine/sandbox.ts`): the player's version and the original.
2. Each sandbox is an `<iframe sandbox="allow-same-origin">` whose `srcdoc` holds the client HTML and an empty `<style id="dq-player">`. There is no `allow-scripts`, so nothing in a client page can run, and same origin lets the game read the DOM.
3. The iframe is laid out at a fixed 760px width (`SANDBOX_WIDTH`) and scaled with a CSS transform to fit the preview pane. Layout happens at 760px for every player, so measurements are identical everywhere. `getBoundingClientRect()` inside the iframe ignores the parent's transform.
4. On each editor change (250ms debounce) the game writes the stylesheet into the `<style>` element's `textContent`, which avoids any `</style>` injection, then calls the level's `judge(doc, css, { hard })`.
5. `judge` runs measurement functions against the iframe document and passes the numbers to judge functions. The result is a list of `CheckResult`.
6. `starsFor()` (`src/engine/types.ts`) turns results into stars: 0 while any core check fails, otherwise 1 plus one per passed bonus check, capped at 3.
7. The judge panel (`src/ui/judge-panel.ts`) shows bonus checks as locked while any core check fails. The client problems bar in the header has one segment per core check.

## Measure vs judge

- `src/engine/measure/` reads the DOM. `dom.ts` decides what box a reader perceives (`visualRect`): a box with a visible background, border or shadow counts as its border box, and an invisible wrapper counts as the union of its children, so padding on an invisible wrapper reads as space, not as part of an object. `spacing.ts` collects gaps and computed spacing values.
- `src/engine/judges/` is pure. Each function takes plain numbers or strings and returns a `CheckResult` with a `detail` written to teach (it names the selectors and values involved). These are unit-tested in `tests/unit/` without a browser.

Keep that split. A new principle gets a `measure/<topic>.ts` and a `judges/<topic>.ts`.

Shared modules:

- `measure/type.ts` collects every element with its own text: computed font-size, weight, heading level, character count and contrast. Levels 2 and 4 use it.
- `measure/color.ts` parses computed colours with culori (`culori/fn`, only the modes a computed value can arrive in) and computes the WCAG 2.x contrast ratio against the effective background: every ancestor's background colour composited over white. Background images are ignored.
- `judges/css.ts` reads the player's stylesheet as text: declarations, custom properties and `var()` resolution. Checks about how CSS is written (tokens, `clamp()`) use it.
- `judges/integrity.ts` with `measure/integrity.ts` is the `intact` core check every level runs first. Every element outside `data-dq-ignore` that carries its own text must have rendered line boxes (read with a DOM `Range`, so off-screen text indents fail), be at least 12px, sit inside the 760px page, and keep an opacity chain and text colour alpha of at least 0.6.

## Data attributes on client pages

Client HTML marks its structure so measurement knows what the designer meant:

| Attribute | On | Meaning |
| --- | --- | --- |
| `data-dq-section` | top-level page regions | Consecutive sections; their content-to-content gaps are the section tier |
| `data-dq-stack="Label"` | a container | Its `data-dq-group` children are sibling groups. The label appears in check details |
| `data-dq-group` | children of a stack | One group. Gaps between its stacked children are "within" gaps |
| `data-dq-focus="Label"` | one element | Level 2: the thing the client needs seen first |
| `data-dq-quiet` | secondary text | Level 2: dates, captions and categories that should step back |
| `data-dq-ignore` | any element | Excluded from measurement. Every client footer carries the Lorem & Ipsum credit with it |

Inside a group, children that sit side by side (vertical overlap) are skipped, because a name and a price on one line is a layout choice, not a grouping signal. Between groups, the gap is vertical if the boxes are stacked and horizontal if they sit side by side.

Spacing values come from the computed values of `margin-top`, `margin-bottom`, all four `padding` sides and, on flex and grid containers, `row-gap` and `column-gap`. Horizontal margins are skipped because `margin-inline: auto` resolves to a used pixel value. Values under 2px are ignored, and values within 1px of a cluster's first value merge into one step.

## Levels

A level is a `LevelDef` (`src/levels/types.ts`): id, number, titles, Ada's intro, `lesson` sections, `rules` (each with a `source`), a `quiz` pool, three `bosses`, the `clue` Ada gives when the desk is cleared, and a `judge` function. Register it in `src/levels/index.ts` and remove its placeholder from `UPCOMING`. `tests/unit/levels.test.ts` checks every level's content shape.

A lesson section is HTML, optional `sources`, an optional `demo(host, ctx)` that returns a cleanup, and a `gate`:

- `{ kind: "choice" }`: a question with a `why` per option (empty for the answer). A wrong pick shakes, locks that option and shows its `why`.
- `{ kind: "goal" }`: the demo calls `ctx.complete()` when the player reaches the goal.

`src/screens/lesson.ts` keeps Next disabled until the gate passes and saves the furthest passed page as `lessonPage`. `reachedPages()` (`src/state/progress.ts`) opens every page of a finished lesson.

## Adding a challenge

1. Add `bosses/<id>.html` (body markup with the data attributes) and a broken `bosses/<id>.css` to the level. Client pages use system font stacks only; parent page fonts do not reach the iframe.
2. Register it in the level's `content.ts` with the client name, a tagline, the client's brief in their own words and three hints, gentlest first.
3. Write a 3-star reference fix at `tests/solutions/<level>/<id>.css`.
4. `npm run test:browser` passes only when the original fails a core check and the fix passes every check.

## Save data

`src/state/save.ts` owns `SaveData` (version 1): XP, per-level progress (lesson done, passed lesson pages, best quiz score, best record per client), earned badges with dates, collected rule-card ids, drafts, settings and the player's sprite (`player.name`, `player.look`; an empty name means the staff pass has not been filled in). Client records use the client id as the key, with a `+` suffix for New Game+ runs.

- The `store` writes to `localStorage` under `design-quest/save/v1` and falls back to memory when storage is blocked (`store.persistent` reports which).
- Save codes are `DQ1.` followed by base64url of the UTF-8 JSON. `decodeSave` rejects other prefixes and versions, and `normalise` fills fields missing from older saves.
- `src/state/rewards.ts` (`commit`) applies a change, pays XP, awards newly earned badges (50 XP each) and announces promotions. Rewards only pay the improvement over the previous best.

## Routing and screens

`src/router.ts` is a hash router (`#/level/spacing/boss/bakery`), which works under any itch.io subpath. Each screen is `(root, params) => cleanup | void`. The router calls the previous cleanup, clears the root and moves focus to the new `h1`.

## Characters and effects

- `src/ui/sprite.ts`: the player sprite. `sprite()` returns `{ el, set(state, holdMs?), rest(state) }`; a pose is a `data-state` attribute and the CSS in `app.css` animates transforms only. `LOOKS` holds the four looks.
- `src/ui/ada.ts`: Ada's portrait, with `data-expr` of neutral, eyebrow or nod.
- `src/ui/fx.ts`: `stamp`, `shake`, `countUp`, `confetti` and `beat`. Each checks `prefersReducedMotion()` or relies on the global reduced-motion override in `base.css`.
- Promotions open a card from `src/state/rewards.ts` once no other dialog is open.

## Tests

- `tests/unit/`: judges on hand-made numbers, contrast maths, save-code round trips, lesson progress, XP maths, badges, quiz draw, and the content shape of every level.
- `tests/e2e/harness.html` loads the real sandbox and judges through the Vite dev server and exposes `window.dq.run(level, boss, css)`. `bosses.spec.ts` runs every challenge against its original CSS (which must fail a core check and pass `intact`) and its reference solution. `lesson-gates.spec.ts` drives the real lesson screen: goal and choice gates, locked pages, resuming, reduced motion.
