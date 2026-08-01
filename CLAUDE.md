# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

`use-debouncy` — a tiny debounce hook library for React, published to npm. Three public hooks
(`useDebouncyEffect`, `useDebouncyFn`, `useDebouncyValue`) built on a single
`requestAnimationFrame` loop. No runtime dependencies; React is a peer dependency
(`^18 || ^19`).

Because the package is sold on its size, treat bundle bytes as a first-class constraint. The
smoke suite enforces a gzip budget — raise it deliberately, never to make a build pass.

## Commands

```bash
yarn dev         # Vite dev server; the story gallery lives at
                 # http://localhost:3100/playwright/gallery/index.html
yarn test        # Playwright component tests, all three browsers
yarn typecheck   # tsc over src, the stories and the specs
yarn lint        # oxlint --fix && oxfmt
yarn lint:check  # the same, in check mode — what CI runs
yarn build       # vite build + declarations, into lib/
yarn release     # release-it (CI only, normally not run by hand)
yarn hooks       # install the pre-commit hook (once, after cloning)

# Useful during development
npx playwright install chromium chromium-headless-shell   # first run only
npx playwright test --project=chromium --reporter=line
npx playwright test --project=chromium -g "should debounce"
```

## Layout

- `src/index.ts` — the whole library: the internal `useAnimationFrame` loop plus the three
  exported hooks. Deliberately one module, see "Why one file" below.
- `playwright/gallery/` — the page Playwright drives. `main.tsx` resolves a story id to a
  component via `import.meta.glob` and renders it into `#root` inside `StrictMode`, reusing the
  root so `update()` reconciles instead of remounting.
- `playwright/stories/*.story.tsx` — components under test. One named export per scenario; the
  story owns the state and records what the test asserts on into the DOM.
- `playwright/tests/*.test.ts` — specs importing `test`/`expect` from `./fixtures`, which
  installs the fake clock automatically. They address stories by id
  (`mount('effect/DebounceEffectTest', { delay: 100 })`) and type props with
  `mount<typeof Story>`.
- `smoke/` — installs the packed tarball and checks it on Node's built-in test runner: CJS and
  ESM resolution, server rendering, and the size budget. No dependencies of its own.

## Testing notes

- Specs get a fake clock from the auto fixture in `playwright/tests/fixtures.ts` and advance it
  with `page.clock.runFor(ms)`. Never use real waits — `requestAnimationFrame` and
  `performance.now` are both driven by it. `search.test.ts` is the exception: it types at a real
  speed against a routed API, so it imports from `@playwright/test` directly.
- The gallery is served by the dev server, so React runs in development mode and `StrictMode`
  double-invokes effects. That is intentional: it is the only way the tests can reach React's
  dev-only behaviour, and it caught a real bug where the effect fired on mount.
- Stories import from `src/`, so the tests exercise sources. The published artifact is covered
  separately by `smoke/` and by publint/arethetypeswrong in CI.
- Under heavy parallel load a rAF-driven spec can still flake; re-run it alone before assuming a
  regression. CI uses `workers: 1` with retries.
- Only React 19 is installed, though the peer range also allows 18.

## Gotchas

- **Why one file.** `tsc` emits one `.d.ts` per module and cannot bundle them. Split sources
  therefore produce an `index.d.ts` full of extensionless re-exports, which fails to resolve for
  consumers on `moduleResolution: node16` (arethetypeswrong reports it). Splitting `src` again
  means paying for it with either `.js` extensions in the imports or a dts-bundler plugin.
- **`react-hooks/exhaustive-deps` cannot check `useDebouncyEffect`.** The rule assumes deps are
  the second argument; this hook takes `(callback, wait, deps)`, so pointing `additionalHooks` at
  it makes the rule read the delay as the dependency list. It is off for `src/index.ts`.
- TypeScript 7 is a native compiler with no JS API. Anything that wants to call the compiler
  programmatically (dts plugins, api-extractor) needs `@typescript/typescript6` alongside it.
- Yarn's builtin TypeScript compat patch breaks on TS 7 before 4.17 — keep the pinned Yarn
  release current.
- **`CHANGELOG.md` is excluded from `oxfmt`.** conventional-changelog writes `*` bullets and an
  extra blank line, which the formatter rewrites, so every release used to turn the next pull
  request red. Leave it in `ignorePatterns` — the file is generated, not authored.
- Do not commit `lib/` — it is gitignored and rebuilt on release.

## Release

Releases are cut by `release-it` from `main` with the Angular conventional-changelog preset, so
commit messages decide the version: `fix:` → patch, `feat:` → minor, `!`/`BREAKING CHANGE` →
major. `chore:`/`docs:` alone produce no release. Version bumps, `CHANGELOG.md`, the git tag and
the npm publish all happen in CI — never bump the version by hand.

Publishing uses npm trusted publishing (OIDC): there is no npm token anywhere, the release job
authenticates through `id-token: write` and npm signs provenance automatically. The trusted
publisher on npmjs.com is bound to this repository and to `build-and-test.yml`, so renaming that
workflow file breaks publishing until the binding is updated. release-it runs with
`npm.skipChecks`, because its pre-flight `npm whoami` cannot work without a token.

The release job only runs on `push` — pull requests get no publishing identity.

Dependencies are managed by Renovate; minor and patch updates are set to automerge.

## Conventions

- oxlint and oxfmt handle linting and formatting: single quotes, two-space indent. A
  `simple-git-hooks` pre-commit hook runs both on commit — Yarn 4 has no `prepare` lifecycle,
  so run `yarn hooks` once after cloning to install it.
- Conventional commit messages (see above — they drive releases).
- Everything in this repository is written in English: code, comments, commit messages, docs.
- Keep the public API additive and the bundle small; both are why people pick this package.
