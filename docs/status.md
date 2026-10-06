# Status

Unfinished work only. Delete an entry when it ships.

## Next milestones

- **2a**: lesson gates (`LessonSection.gate`, saved `lessonPage`), the `intact` check on every level, bonus checks locked while a core check fails, the player sprite with a name and look picker, Ada's portrait, the client problems bar, stamps, confetti, XP ticker, trial streak, promotion card. Level 1 rewritten to the copy standard with gates, sources and Lorem & Ipsum footers. Level 2, Visual hierarchy, with `measure/type.ts`, `measure/color.ts` and `judges/hierarchy.ts`.
- **2b**: level 3, Colour and OKLCH.
- **2c**: level 4, Typography.
- **Levels 5 to 7 and the final client**: puzzle clients (`BossDef.kind: "puzzle"`), alignment and grid checks, Lorem & Ipsum's site.
- **Placement test and map ordering.**
- **Arcade mode "Spot the Flaw"**: layout generator, flaw injection, lives and streak scoring.
- **Case study export**: self-contained HTML with before/after sliders, the player's CSS and rationale per client.
- **itch.io release**: packaging script, cover image, store text, nested-iframe test. The owner uploads.

## Known gaps

- The production bundle is about 580 KB of JavaScript (about 200 KB gzipped), mostly CodeMirror. Lazy-load the editor on the challenge screen.
- `culori` is installed for the colour checks and not used yet.
- The Spacing tiers bonus passes on the original bakery and blog pages, and its detail reads as praise on a broken page.
- Badges are all tied to the spacing level.
- Rank thresholds (Creative Director at 4500 XP) are sized for about five levels, not eight.
- Level 1 lesson copy states contested claims as fact: proximity grouping as pre-attentive, and "28px vs 32px looks the same".
- The Unassisted (no hints) and Quick Study (under five minutes) badges reward avoiding help and rushing. `research/game-design.md` argues both work against productive struggle. The owner decides whether to replace them.
- No sound yet.
- No `docs/post-mortem.md` until the project ends.
