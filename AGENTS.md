# Agent notes

- Stack: Vite + TypeScript (vanilla DOM), CodeMirror 6, culori. Static build, relative paths (`base: './'`), so it runs inside itch.io's iframe.
- Hook contract: `lefthook.yml` (pre-commit: `npm run typecheck`, `npm test`). Install with `npm ci && npm run lefthook:install`. Never bypass it.
- Before committing, run `npm run verify`. The Playwright suite proves every boss is broken as shipped and solvable to 3 stars.
- Judges must stay pure (`src/engine/judges/`). DOM access belongs in `src/engine/measure/`.
- The game's own UI must follow what it teaches: spacing only from `--space-*` tokens, type from `--step-*`, colours from the OKLCH tokens in `src/styles/tokens.css`, with AA contrast in light and dark.
- `tests/solutions/` contains answers. Don't surface them in the game bundle.
