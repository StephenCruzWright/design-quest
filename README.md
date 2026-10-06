# Design Quest

A replayable browser game that teaches web design theory. You're the new hire at **Kerning & Co.**, a small design studio. Each desk teaches one principle:

1. **Lesson**: the rule, the perceptual reason it works, and interactive demos.
2. **Trial**: five judgment questions drawn from a pool and shuffled every run.
3. **Clients**: a broken client site plus a CSS editor. Judges measure the rendered page live. Pass every core check to ship and pass bonus checks for stars, then explain *why* your fix works in a sentence.

You earn XP, ranks (Intern → Creative Director), badges and rule cards for your Field Guide along the way. New Game+ turns on stricter judges.

## Status

| Desk | Topic | State |
| --- | --- | --- |
| 1 | Spacing & whitespace | Playable |
| 2–7 | Hierarchy, colour (OKLCH), typography, Gestalt, alignment, grids | In production |
| ★ | Final client | In production |

Coming later: placement test, arcade "Spot the Flaw" mode, case-study export, itch.io build.

## Run it

```sh
npm ci
npm run dev        # http://localhost:5173
```

## Checks

```sh
npm run typecheck
npm test           # judge + state unit tests (vitest)
npm run test:e2e   # every client page is broken as shipped, and its reference solution earns 3 stars (Playwright)
npm run verify     # all of the above
```

The pre-commit hook (lefthook) runs the typecheck and the unit tests. Install it with `npm run lefthook:install`.

## How the judges work

Client pages render in a script-less, same-origin iframe at a fixed 760px width, so every player is measured the same way. Pages mark their structure with data attributes:

- `data-dq-section` marks top-level page sections.
- `data-dq-stack="Label"` marks a container whose `data-dq-group` children are sibling groups.

`src/engine/measure/` turns the live DOM into plain numbers: the visual gaps between groups, the gaps inside groups, and every margin, padding and gap value. `src/engine/judges/` are pure functions over those numbers, so they can be unit-tested without a browser.

## Adding a client

1. Add `bosses/<id>.html` and a deliberately broken `bosses/<id>.css` to a level, and register them in its `content.ts`.
2. Add a 3-star reference fix at `tests/solutions/<level>/<id>.css`.
3. `npm run test:e2e` fails until the original fails a core check and the fix passes every check.

> **Spoiler warning:** `tests/solutions/` holds the answers. Play first.
