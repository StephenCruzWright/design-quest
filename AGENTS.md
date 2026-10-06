# Design Quest: agent instructions

A browser game that teaches web design theory. Players read a short lesson, pass a judgment quiz, then fix a deliberately broken client page with real CSS while layout checks measure the rendered DOM. Static Vite build, vanilla TypeScript, no framework, published to itch.io as an HTML5 game.

Organisation-wide Git, approval and live-system rules come from the [Cognisearch central router](https://github.com/Cognisearch/.github/blob/main/AGENTS.md). This file adds only what is specific to this repository.

This repository is personal and not yet registered in the Cognisearch org. Until Vovo approves moving it there, the org CI caller, `config/repositories.json` registration and Vercel deploy rules do not apply. Everything else below does.

## Non-negotiables

- The game follows its own lessons. UI spacing comes only from `--space-*` tokens, type sizes from `--step-*`, colours from the OKLCH custom properties in `src/styles/tokens.css`. Every text and background pair meets WCAG 2.x AA (4.5:1 for body text) in both light and dark themes.
- Every challenge ships with a reference solution in `tests/solutions/<level>/<boss>.css`. The browser suite must show the original page fails at least one core check and the solution passes every check. Solutions never get imported from `src/`, so they never reach the bundle.
- Judge functions in `src/engine/judges/` are pure: numbers in, `CheckResult` out. DOM reads belong in `src/engine/measure/`.
- Client pages render in a sandboxed iframe (`allow-same-origin`, never `allow-scripts`) at a fixed 760px layout width so every player is measured the same way.
- The build uses relative asset paths (`base: "./"`) so it works inside itch.io's nested iframe. Do not add absolute paths, a server or network calls.
- Publishing to itch.io, buying anything or touching a live account is done by the owner. Agents prepare the build and the store text; they do not upload.

## Where to read next

Open the doc for the task. Read the code for everything else.

| Task involves | Read |
| --- | --- |
| What the game is, the eight levels, replay modes, milestones | `docs/plan.md` |
| Sandbox, measuring the DOM, judge functions, data attributes, save format, adding a level or challenge | `docs/architecture.md` |
| Game UI tokens, layout, motion, copy voice, the "does this look AI-made?" check | `docs/design-system.md` |
| Whether something unfinished is intentional; picking the next piece of work | `docs/status.md` |

Source owners: `src/engine/` (sandbox, measurement, judges, quiz draw), `src/levels/` (lesson content, quiz pools, rule cards, client pages), `src/state/` (save data, XP, ranks, badges), `src/screens/` (one module per route), `src/ui/` (shared components), `src/styles/tokens.css` (design tokens).

## Delivery

- Run `git status` before changing anything. Never reset, discard or overwrite files with uncommitted changes; leave them for the owner.
- Branch as `feature/<task>` (or `docs/`, `chore/`) from `main`, open a pull request, and never commit straight to `main`.
- The pre-commit hook is lefthook. Before the first commit in a fresh clone, run `npm ci` and `npm run lefthook:install`, then confirm `git rev-parse --git-path hooks/pre-commit` exists. Never use `--no-verify`. Fix the failure and commit again.
- Stage only files that belong to the task.
- GitHub CI is authoritative once the repository has a remote; never merge a failing pull request. The temporary Actions-minutes exception in the owner's workflow rules applies only when no job ran at all.
- Completion reports state `Local hook: installed and executed successfully` and the GitHub CI result in the owner's exact wording.
- At the end of the project, write `docs/post-mortem.md` (model: `primultaucfo.ro/docs/post-mortem.md`) and submit it as its own pull request.

## Writing rules

These apply to code comments, docs, commit messages, pull requests and every string a player reads.

- No em dashes. Use a full stop, comma, colon or brackets.
- Be specific. No hype ("powerful", "seamless", "cutting-edge"), no hedging ("may help", "can potentially"), no stacked groups of three for rhythm.
- Read it aloud. If the owner would not say it, rewrite it.
- Commit subjects are short imperative sentences ("Add the typography judges"). The body says why.
- No AI attribution lines (`Co-Authored-By`, "Generated with") in commits or pull requests.

## Terminology

Use the precise technical term, in docs and in code review.

| Say | Not |
| --- | --- |
| custom property | CSS variable, CSS var thing |
| design token (a named design decision, usually a custom property) | variable, setting |
| computed value / used value (what `getComputedStyle` returns vs what layout uses) | final CSS, real value |
| cascade, specificity, inheritance | priority, override order |
| contrast ratio (WCAG 2.x), APCA Lc | colour difference, readability score |
| measure (line length, in `ch` or characters) | text width |
| leading (`line-height`) | line spacing |
| modular scale / ratio scale | size steps |
| OKLCH lightness, chroma, hue | brightness, saturation, colour |
| border box, content box, margin collapse | element size, outside space |

Game words map to code like this. Use the game word in UI copy and the code word in technical writing.

| Player sees | Code | Meaning |
| --- | --- | --- |
| Desk | `LevelDef` | One level: lesson, quiz, three challenges |
| Trial | `QuizQuestion[]` | Judgment quiz drawn from a pool |
| Client, boss fight | `BossDef` | A challenge page with broken CSS |
| Judges | judge functions, `CheckResult` | Layout checks run on the rendered page |
| Must pass / bonus stars | `kind: "core" \| "bonus"` | Core checks gate the win; bonus checks add stars |

## Verification

`npm run ci:repo` is the deterministic gate: Biome (`check:light`), typecheck, unit tests, production build. `npm run test:browser` (Playwright) is separate and must pass before a pull request is opened when a level, challenge, judge or measurement changed. `npm run verify` runs both.

## Keeping these docs small

`docs/` holds at most five files and describes the current state only: no dates, changelogs or accounts of how things used to be. Finished work is deleted from `docs/status.md`, not ticked. Adding an instruction means removing or merging one.

`CLAUDE.md` is the one-line import of this file. `README.md` is for players and humans and owns no instructions.
