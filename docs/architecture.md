# Architecture

## Flow of a challenge

1. `src/screens/boss.ts` creates two `Sandbox` instances (`src/engine/sandbox.ts`): the player's version and the original.
2. Each sandbox is an `<iframe sandbox="allow-same-origin">` whose `srcdoc` holds the client HTML and an empty `<style id="dq-player">`. There is no `allow-scripts`, so nothing in a client page can run, and same origin lets the game read the DOM.
3. The iframe is laid out at a fixed 760px width (`SANDBOX_WIDTH`) and scaled with a CSS transform to fit the preview pane. Layout happens at 760px for every player, so measurements are identical everywhere. `getBoundingClientRect()` inside the iframe ignores the parent's transform.
4. On each editor change (250ms debounce) the game writes the stylesheet into the `<style>` element's `textContent`, which avoids any `</style>` injection, then calls the level's `judge(doc, css, { hard })`.
5. `judge` runs measurement functions against the iframe document and passes the numbers to judge functions. The result is a list of `CheckResult`.
6. `starsFor()` (`src/engine/types.ts`) turns results into stars: 0 while any core check fails, otherwise 1 plus one per passed bonus check, capped at 3.

## Measure vs judge

- `src/engine/measure/` reads the DOM. `dom.ts` decides what box a reader perceives (`visualRect`): a box with a visible background, border or shadow counts as its border box, and an invisible wrapper counts as the union of its children, so padding on an invisible wrapper reads as space, not as part of an object. `spacing.ts` collects gaps and computed spacing values.
- `src/engine/judges/` is pure. Each function takes plain numbers or strings and returns a `CheckResult` with a `detail` written to teach (it names the selectors and values involved). These are unit-tested in `tests/unit/` without a browser.

Keep that split. A new principle gets a `measure/<topic>.ts` and a `judges/<topic>.ts`.

## Data attributes on client pages

Client HTML marks its structure so measurement knows what the designer meant:

| Attribute | On | Meaning |
| --- | --- | --- |
| `data-dq-section` | top-level page regions | Consecutive sections; their content-to-content gaps are the section tier |
| `data-dq-stack="Label"` | a container | Its `data-dq-group` children are sibling groups. The label appears in check details |
| `data-dq-group` | children of a stack | One group. Gaps between its stacked children are "within" gaps |
| `data-dq-ignore` | any element | Excluded from measurement |

Inside a group, children that sit side by side (vertical overlap) are skipped, because a name and a price on one line is a layout choice, not a grouping signal. Between groups, the gap is vertical if the boxes are stacked and horizontal if they sit side by side.

Spacing values come from the computed values of `margin-top`, `margin-bottom`, all four `padding` sides and, on flex and grid containers, `row-gap` and `column-gap`. Horizontal margins are skipped because `margin-inline: auto` resolves to a used pixel value. Values under 2px are ignored, and values within 1px of a cluster's first value merge into one step.

## Levels

A level is a `LevelDef` (`src/levels/types.ts`): id, number, titles, Ada's intro, `lesson` sections (HTML plus an optional `demo(host)` that returns a cleanup), `rules`, a `quiz` pool, three `bosses` and a `judge` function. Register it in `src/levels/index.ts` and remove its placeholder from `UPCOMING`.

## Adding a challenge

1. Add `bosses/<id>.html` (body markup with the data attributes) and a broken `bosses/<id>.css` to the level. Client pages use system font stacks only; parent page fonts do not reach the iframe.
2. Register it in the level's `content.ts` with the client name, a tagline, the client's brief in their own words and three hints, gentlest first.
3. Write a 3-star reference fix at `tests/solutions/<level>/<id>.css`.
4. `npm run test:browser` passes only when the original fails a core check and the fix passes every check.

## Save data

`src/state/save.ts` owns `SaveData` (version 1): XP, per-level progress (lesson done, best quiz score, best record per client), earned badges with dates, collected rule-card ids, drafts and settings. Client records use the client id as the key, with a `+` suffix for New Game+ runs.

- The `store` writes to `localStorage` under `design-quest/save/v1` and falls back to memory when storage is blocked (`store.persistent` reports which).
- Save codes are `DQ1.` followed by base64url of the UTF-8 JSON. `decodeSave` rejects other prefixes and versions, and `normalise` fills fields missing from older saves.
- `src/state/rewards.ts` (`commit`) applies a change, pays XP, awards newly earned badges (50 XP each) and announces promotions. Rewards only pay the improvement over the previous best.

## Routing and screens

`src/router.ts` is a hash router (`#/level/spacing/boss/bakery`), which works under any itch.io subpath. Each screen is `(root, params) => cleanup | void`. The router calls the previous cleanup, clears the root and moves focus to the new `h1`.

## Tests

- `tests/unit/`: judges on hand-made numbers, save-code round trips, XP maths, badges, quiz draw.
- `tests/e2e/harness.html` loads the real sandbox and judges through the Vite dev server and exposes `window.dq.run(level, boss, css)`. `bosses.spec.ts` runs every challenge against its original CSS and its reference solution.
