# Status

Unfinished work only. Delete an entry when it ships.

## Next milestones

- **2b**: level 3, Colour and OKLCH.
- **2c**: level 4, Typography.
- **Levels 5 to 7 and the final client**: puzzle clients (`BossDef.kind: "puzzle"`), alignment and grid checks, Lorem & Ipsum's site.
- **Placement test and map ordering.**
- **Arcade mode "Spot the Flaw"**: layout generator, flaw injection, lives and streak scoring.
- **Case study export**: self-contained HTML with before/after sliders, the player's CSS and rationale per client.
- **itch.io release**: packaging script, cover image, store text, nested-iframe test. The owner uploads.

## Known gaps

- The production bundle is about 670 KB of JavaScript (about 230 KB gzipped), mostly CodeMirror. Lazy-load the editor on the challenge screen.
- Rank thresholds (Creative Director at 4500 XP) are sized for about five levels, not eight.
- The Unassisted (no hints) and Quick Study (under five minutes) badges reward avoiding help and rushing. `research/game-design.md` argues both work against productive struggle. The owner decides whether to replace them.
- Hint 3 on most clients spells out the fix. `research/learning-science.md` finds hints that end in the answer teach least; consider a last hint that names the property and leaves the value to the player.
- Choice gates are multiple choice. The learning-science review finds that answers the player produces (typing a value, dragging a demo) roughly double the benefit; more goal gates would follow it.
- No sound yet.
- No `docs/post-mortem.md` until the project ends.
