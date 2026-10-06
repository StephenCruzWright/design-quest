# Design Quest

A browser game about the rules behind good web design.

You start as an intern at Kerning & Co., a small studio run by Ada Kern. Each desk teaches one principle. Read the lesson and play with its demos, pass a five-question trial, then take on three clients whose sites are broken. You fix their real stylesheet in an editor, and the game measures the rendered page as you type: the gaps between groups, every spacing value you used, whether those values come from tokens. Ship when the must-pass checks are green, polish for stars, and say in one sentence why your fix works.

Nothing is graded on taste. Every check reads numbers off the rendered page and tells you which ones, and which selectors, are off.

## How a desk works

1. **Lesson.** The principle, the perceptual reason it works, and demos where you drag a control and watch a layout fall apart or come together.
2. **Rule cards.** Finishing the lesson adds its rules of thumb to your Field Guide.
3. **Trial.** Five judgment questions drawn from a pool of twelve. The options shuffle on every run.
4. **Clients.** Three broken pages, each with a brief written by a client who can describe the symptom but not the fix. You edit the page's stylesheet while the judges re-measure it. When every must-pass check is green, the job can ship. Bonus checks add stars, up to three.
5. **Rationale.** Before you ship, you write a sentence or two on why the fix works.

The trial opens after the lesson, and the clients open after the trial.

## What you can play now

**Desk 1: Spacing and whitespace.** Space as a system: ratios, tokens, and between > within.

| Client | Who they are |
| --- | --- |
| Crumb & Co. | A neighbourhood sourdough bakery |
| Pipeline | A developer tooling startup's pricing page |
| Field Notes | A woodworker's essay blog |

The judges for this desk:

| Check | Kind | Passes when | New Game+ |
| --- | --- | --- | --- |
| Proximity | Must pass | The gap between groups is at least 2× the largest gap inside a group | 2.5× |
| Scale | Must pass | Each spacing step is at least 25% larger than the one before | 40% |
| Economy | Must pass | The page uses six distinct spacing values or fewer | five |
| Tokens | Bonus star | At least 90% of spacing declarations use custom properties | 100% |
| Tiers | Bonus star | Section gaps are at least 1.5× the gaps between groups | 2× |

Progress earns XP and ranks you up from Intern to Creative Director. Only improvements pay out, so replaying a client never farms XP. Nine badges reward specific feats, such as shipping without opening a hint or finishing a client in under five minutes. New Game+ (on the Profile screen) tightens every threshold, pays 1.5× XP and keeps its own star records.

## What's next

| Desk | Principle |
| --- | --- |
| 2 | Visual hierarchy |
| 3 | Colour and OKLCH |
| 4 | Typography |
| 5 | Gestalt |
| 6 | Alignment and balance |
| 7 | Grids and proportion |
| 8 | The final client: every judge on one page |

After the desks: a placement test that suggests an order, an arcade mode called "Spot the Flaw", an exported case study page with before/after sliders for every client, and a release on itch.io. `docs/plan.md` has the full design and `docs/status.md` tracks what is unfinished.

## Play locally

You need Node.js 24.

```sh
npm ci
npm run dev
```

Then open the address Vite prints, usually <http://localhost:5173>.

Progress saves in your browser. Profile → Save code copies it if you want to move it to another machine. The Profile screen also has the theme (system, light or dark) and motion settings.

## How it works

Each client page renders in an `<iframe sandbox="allow-same-origin">` with no `allow-scripts`, so nothing in it can run, but the game can still read its DOM. The page is laid out at a fixed 760px width and scaled to fit the preview, so every player is measured at the same size.

On each edit the game swaps the page's stylesheet, then two layers take over:

- `src/engine/measure/` reads the DOM: the boxes a reader actually perceives, the gaps between them, and every computed margin, padding and gap value.
- `src/engine/judges/` holds pure functions that turn those numbers into pass or fail results with a readable explanation. They are unit-tested without a browser.

Client pages mark their structure with `data-dq-section`, `data-dq-stack` and `data-dq-group` attributes, so the judges know which gaps are meant to be "within" and which "between".

The game's own interface follows its lessons: a ratio spacing scale, a modular type scale, an OKLCH palette and WCAG AA contrast in both themes.

More detail: `docs/architecture.md` (engine, save format, adding a desk or client) and `docs/design-system.md` (tokens and visual language).

## Accessibility

- A skip link, and focus moves to the heading of each new screen.
- Status never relies on colour alone. Checks show ✓ or ✗ with screen reader text, and stars have filled and empty shapes.
- Every text and background pair reaches 4.5:1 in light and dark themes.
- Keyboard paths for the lesson (arrow keys), the trial (1 to 4 or A to D) and shipping a fix (Ctrl/Cmd+Enter).
- Animations follow `prefers-reduced-motion` and the in-game motion setting.

## Built with

Vanilla TypeScript and Vite, with no UI framework. CodeMirror 6 runs the CSS editor. Vitest covers the judges and save data, Playwright runs every client in a real browser, Biome lints and formats, and lefthook runs the checks before each commit.

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Typecheck and build the static game into `dist/` |
| `npm run preview` | Serve the production build |
| `npm test` | Unit tests |
| `npm run test:browser` | Playwright suite: each original page fails a check, each reference fix passes all of them |
| `npm run ci:repo` | Biome, typecheck, unit tests and build, the same gate CI runs |
| `npm run verify` | `ci:repo` plus the browser suite |

The build uses relative paths, so `dist/` runs from any folder or inside an embed.

## Contributing

Start with `AGENTS.md`. It covers the checks, the hook, the docs and the house rules.

`tests/solutions/` holds the answers to every client. Play first.

## License

All rights reserved. The source is public to read, but no license is granted to copy, modify or redistribute it.
