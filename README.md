# Design Quest

A browser game about the rules behind good web design.

You start as an intern at Kerning & Co., a small studio. Each desk teaches one principle. Read the lesson and play with its demos, pass a five-question trial, then take on three clients whose sites are broken. You fix their real stylesheet in an editor, and the game measures the rendered page as you type: the gaps between groups, every spacing value you used, whether those values come from tokens. Ship when the must-pass checks are green, polish for stars, and say in one sentence why your fix works.

The first desk, Spacing and Whitespace, is playable. Hierarchy, colour, typography, Gestalt, alignment and grids are next. See `docs/plan.md` for the whole game.

## Play locally

```sh
npm ci
npm run dev
```

Then open the address Vite prints, usually http://localhost:5173.

Progress saves in your browser. Profile → Save code copies it if you want to move it to another machine.

## For contributors

Start with `AGENTS.md`. It covers the checks, the hook, the docs and the house rules.

`tests/solutions/` holds the answers to every client. Play first.
