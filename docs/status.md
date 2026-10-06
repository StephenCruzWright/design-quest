# Status

Unfinished work only. Delete an entry when it ships.

## Next milestones

- **Levels 2 to 4**: hierarchy, colour (OKLCH, contrast against the effective background, colour-only state), typography (measure in characters, leading, family count). Each needs a lesson, rule cards, a quiz pool of about twelve, three clients with reference solutions, measurement and judge modules.
- **Levels 5 to 7 and the final client**: Gestalt puzzles, alignment and grid checks, one page with every check.
- **Placement test and map reordering.**
- **Arcade mode "Spot the Flaw"**: layout generator, flaw injection, timer and streak scoring.
- **Case study export**: self-contained HTML with before/after sliders, the player's CSS and rationale per client.
- **itch.io release**: packaging script, cover image, store text, nested-iframe test. The owner uploads.

## Known gaps

- The production bundle is about 580 KB of JavaScript (about 200 KB gzipped), mostly CodeMirror. Lazy-load the editor on the challenge screen.
- `culori` is installed for the colour level and not used yet.
- Biome reports `noNonNullAssertion` warnings on `querySelector(...)!` calls. Replace them with the `$()` helper in `src/util/dom.ts`, which throws a named error.
- The Spacing tiers bonus passes on the original bakery and blog pages. Harmless, since stars need every core check, but the detail text reads as praise on a broken page.
- No sound yet.
- No `docs/post-mortem.md` until the project ends.
