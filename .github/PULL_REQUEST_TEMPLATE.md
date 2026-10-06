# Summary

<!-- What changes for players or for the codebase, and why. -->

## Scope and risk

- Risk level: low / medium / high
- Affected levels, screens or systems:
- Backout approach:

## Verification

- [ ] Local hook ran on every commit (`npm run check:light`, typecheck, unit tests)
- [ ] `npm run ci:repo` passed for the exact candidate commit
- [ ] `npm run test:browser` passed (every challenge is broken as shipped and solvable to 3 stars)
- [ ] Screens touched by the change were checked in light and dark, at desktop and phone width
- [ ] Required GitHub checks passed for the pull-request head
- [ ] No secret, upload or publish step was added

## Documentation

- [ ] `AGENTS.md` and `docs/` still describe the current state
- [ ] Finished items were removed from `docs/status.md`
