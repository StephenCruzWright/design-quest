# Design system

The game teaches design theory, so its own UI has to pass the same checks it gives players. All values live in `src/styles/tokens.css` as custom properties.

## Tokens

- **Spacing** is a ratio scale: `--space-3xs` 4px, `--space-2xs` 8, `--space-xs` 12, `--space-s` 16, `--space-m` 24, `--space-l` 40, `--space-xl` 64, `--space-2xl` 96. Layout CSS uses only these. Exceptions are the hard-coded pixel values inside lesson demos that illustrate specific numbers.
- **Type** is a major-third (1.25) modular scale, `--step--1` to `--step-5`. Steps 2 to 5 use `clamp()` so headings grow with the viewport between a floor and a ceiling.
- **Faces.** Fraunces Variable for display text (headings, numerals, Ada's notes, client quotes). Schibsted Grotesk Variable for UI and body text. JetBrains Mono Variable for code, job numbers and quiz keys. Client pages use system font stacks only, because parent fonts do not reach the sandbox iframe.
- **Colour** is OKLCH, with role names, not hue names: `--paper`, `--card`, `--sunk`, `--line`, `--ink`, `--ink-2`, `--accent`, `--accent-ink`, `--good`, `--bad`, `--star`, `--note`. Dark mode redefines the same names. Lightness carries contrast. Every text pair is checked with culori's `wcagContrast` and reaches 4.5:1 in both themes. The yellow `--star` never carries light text; it pairs with `--on-star`.
- **Radii** are small and differ by object: `--radius-s` 3px (buttons, code), `--radius-m` 6px (panels, options), `--radius-l` 10px (dialogs). Rule cards use 2px, like index cards.
- **Shadows** (`--shadow`) belong only to things that sit on top of the page: Ada's pinned notes, toasts and dialogs. Everything else separates with hairline rules (`--line`) or a change of surface.

## Visual language

The studio desk is the metaphor, and each object looks like the thing it is:

- Ada's messages are pinned notes: `--note` paper, a strip of tape, a slight rotation.
- Client briefs are job tickets: a dashed tear-off edge, a monospace job number, the quote in italic Fraunces with the client's name underneath.
- Rule cards are index cards: a red rule under the title.
- The map is a ruled list with large Fraunces numerals, not a grid of cards.
- Status never relies on colour alone. Checks show ✓ or ✗ plus hidden "Passing:" or "Failing:" text, stars have a filled or empty shape, and completed steps carry hidden "Done:" text.
- Icons are the line marks in `src/ui/marks.ts` (24px grid, 1.75 stroke, `currentColor`). No emoji in the interface.

## Characters

- **The player sprite** is drawn in the marks style: 1.75 stroke in `currentColor`, flat fills from role tokens, no gradients. Four looks differ in hair, clothing colour and accessory, never in skin tone alone. States are separate poses (idle, think, cheer, wince, sweat, walk), animated with transforms on body parts only. The sprite is decorative (`aria-hidden`); anything it signals is also in text.
- **Ada** is a head-and-shoulders portrait in the same style, with three expressions: neutral, raised eyebrow, nod.

## Motion

Motion explains a state change, gives feedback on an action or rewards the player. It never plays over lesson text the player is reading.

| Motion | Job |
| --- | --- |
| Wordmark letters settle from bad kerning into good | Title: shows the subject |
| Rule cards dealt onto the desk | Reward: cards collected |
| A check that changes state pulses once | State change |
| Sprite poses (cheer, wince, sweat, think) | Feedback on an answer, a check or typing |
| Sprite walks to the focused desk | Shows where the player is going |
| Ada's expression changes | Story: her reaction to a result |
| Rubber stamp lands on an answer, check or shipped job | Feedback: right, wrong, shipped |
| Wrong answer shakes once | Feedback: wrong |
| Problems bar loses a segment | State change: one core check fixed |
| Stars stamp in one by one with a short pause | Reward |
| XP counts up | Reward: shows the amount |
| Paper-strip confetti on ship | Reward |
| Promotion card | Reward: rank change |

Under `prefers-reduced-motion` or the in-game Motion setting, poses and stamps swap instantly, counters show their final value and confetti does not play.

## Copy

- Every line is story or fact (see "Copy standard" in `docs/plan.md`). Facts about perception and reading carry a source from `research/`. Studio rules of thumb are labelled as Ada's rules.
- Ada speaks like a studio lead: short, direct, a little dry. Clients speak like non-designers describing a symptom, never the fix.
- No em dashes. No hype, no hedging, no stacked groups of three, no "not X, it's Y" constructions.
- Check details name the measured values and the selectors involved. They teach rather than grade.
- Use the terms in the `AGENTS.md` terminology table.

## Does this look AI-made?

Check every new screen against this list before merging.

- Type: the three faces above, set with intent. No default sans left untouched.
- Colour: role tokens only. No decorative gradients, and no purple-to-blue anything.
- Structure: no centred hero above three identical feature cards. Every screen follows the desk metaphor.
- Variety: radii, weights and spacing differ by role. Not everything is a rounded card with a shadow.
- Copy: specific to Kerning & Co. and its clients. Would the owner say it out loud?
- Imagery: real content (client pages, measured numbers), drawn marks and the drawn characters, no stock or generated art.
- Motion: each animation has a job from the list above.
