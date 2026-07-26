# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

`use-debouncy` — a ~0.2 kB debounce hook for React, published to npm. Two public hooks
(`useDebouncyEffect`, `useDebouncyFn`) built on a single `requestAnimationFrame` loop.
No runtime dependencies; React is a peer dependency (`^16.8 || ^17 || ^18 || ^19`).

Because the package is sold on its size, treat bundle bytes as a first-class constraint:
check the minified+gzipped size of `lib/index.mjs` after touching `src/`.

## Commands

```bash
yarn build          # tsup → lib/{index.js,index.mjs,index.d.ts,index.d.mts}
yarn test           # Playwright component tests, all three browsers
yarn lint           # biome check --write .
yarn release        # release-it (CI only, normally not run by hand)

# Useful during development
npx playwright install chromium chromium-headless-shell   # first run only
npx playwright test -c playwright-ct.config.mts --project=chromium --reporter=line
npx playwright test -c playwright-ct.config.mts --project=chromium -g "should debounce"
```

`yarn test` requires `yarn build` first: `playwright/app/src/*` imports the built package
from `../../../lib`, so `use-debouncy.test.tsx` fails on a clean checkout without it.

## Layout

- `src/core.ts` — `useAnimationFrame`, the actual debounce implementation. Internal, not exported
  from the package; both public hooks are thin wrappers around it.
- `src/effect.ts` — `useDebouncyEffect`, adds "skip the initial render" semantics via a ref.
- `src/fn.ts` — `useDebouncyFn`, currently a direct re-export of `useAnimationFrame`.
- `src/index.ts` — public surface. Anything not re-exported here is private API.
- `playwright/stories/testing-stories.tsx` — components under test; tests import from here,
  not from the built package.
- `playwright/__tests__/` — specs. `use-debouncy.test.tsx` is the only one that exercises `lib/`.
- `playwright/app/src/` — small demo app used by that end-to-end spec; its network calls are
  intercepted with `page.route`, so no real requests go out.

## Testing notes

- Specs install a fake clock (`page.clock.install()`) and advance it with `page.clock.runFor(ms)`.
  Never use real waits — `requestAnimationFrame` and `performance.now` are both driven by that clock.
- Playwright CT builds the test bundle in **production** mode, so React dev-only behaviour
  (`StrictMode` double-invoking effects, dev warnings) is not reachable from these specs.
  To exercise it, bundle an entry with esbuild and `--define:process.env.NODE_ENV='"development"'`,
  then drive it through the Playwright Node API.
- `fullyParallel` is on and local runs use several workers, which makes the rAF-heavy specs in
  `core.test.tsx` flaky (they pass in isolation). CI hides this behind `workers: 1` and `retries: 2`.
  If a spec fails locally, re-run it alone before assuming a regression.
- Only React 19 is installed, though the peer range claims 16.8+.

## Gotchas

- `tsup.config.ts` sets `terser.mangle.properties` with a small `reserved` list. It mangles every
  property name that is not a known DOM/JS builtin, so any new public option or method
  (`flush`, `cancel`, `maxWait`, …) will be silently renamed in the published bundle while the
  unit specs — which import from `src/` — keep passing. Verify against `lib/` after API changes.
- `package.json` has no `exports` map, so Node ESM resolves to the CJS build; `module` is only
  honoured by bundlers.
- `tsconfig.json` covers `src` only, and CI has no type-check step; type errors in
  `playwright/**` and config files surface only in the editor.
- Do not commit `lib/` — it is gitignored and rebuilt on release.

## Release

Releases are cut by `release-it` from `main` with the Angular conventional-changelog preset, so
commit messages decide the version: `fix:` → patch, `feat:` → minor, `!`/`BREAKING CHANGE` → major.
`chore:`/`docs:` alone produce no release. Version bumps, `CHANGELOG.md`, the git tag and the npm
publish all happen in CI — never bump the version by hand.

Dependencies are managed by Renovate; minor and patch updates are set to automerge.

## Conventions

- Biome handles both formatting and linting: single quotes, two-space indent, organized imports.
  Run `yarn lint` before committing; a `simple-git-hooks` pre-commit hook runs it on staged files.
- Conventional commit messages (see above — they drive releases).
- Keep the public API additive and the bundle small; both are the reasons people pick this package.
