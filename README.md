# useDebouncy

🌀 Small (~0.2kb) debounce effect hook for React with TypeScript support

![GitHub](https://img.shields.io/github/license/eavam/use-debouncy)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/use-debouncy)
![npm](https://img.shields.io/npm/dm/use-debouncy)
![types](https://badgen.net/npm/types/use-debouncy)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Feavam%2Fuse-debouncy.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Feavam%2Fuse-debouncy?ref=badge_shield)

![](assets/example.gif)

## Features

- 👌 **No dependencies.**
- 🏋️‍ **Tiny.** ~0.2kb.
- 🦾 **Frame-aligned.** Driven by `requestAnimationFrame`.
- 📖 **Types.** Written in TypeScript, ships its own declarations.
- 🎣 **Three hooks.** Debounce an effect, a callback or a value.

## Installation

```sh
npm install use-debouncy
```

```sh
yarn add use-debouncy
```

```sh
pnpm add use-debouncy
```

Requires React 18 or 19 as a peer dependency.

## Usage

Three hooks, one idea: do the work only after things have stopped changing for a
while. Pick the one that fits what you already have.

### Debounce an effect

Reads like `useEffect`, but waits for the dependencies to settle. It does not
run on the initial render.

```tsx
import { useState } from 'react';
import { useDebouncyEffect } from 'use-debouncy';

const Search = () => {
  const [value, setValue] = useState('');

  useDebouncyEffect(
    () => fetchData(value), // called once typing stops
    400, // milliseconds to wait
    [value], // dependencies, like useEffect
  );

  return (
    <input value={value} onChange={(event) => setValue(event.target.value)} />
  );
};
```

Like `useEffect`, the callback may return a destructor. It runs before the next
invocation and when the component unmounts:

```tsx
useDebouncyEffect(
  () => {
    const controller = new AbortController();
    fetchData(value, { signal: controller.signal });

    return () => controller.abort();
  },
  400,
  [value],
);
```

### Debounce a callback

Returns a function that delays the call until it stops being called. Handy for
event handlers, where there is no dependency array to speak of.

```tsx
import type { ChangeEvent } from 'react';
import { useDebouncyFn } from 'use-debouncy';

const Search = () => {
  const handleChange = useDebouncyFn(
    (event: ChangeEvent<HTMLInputElement>) => fetchData(event.target.value),
    400,
  );

  return <input onChange={handleChange} />;
};
```

The returned function keeps the same identity across renders, so it is safe to
hand to a memoized child or to put in a dependency array. It also carries two
controls for the call that is currently waiting:

```tsx
const save = useDebouncyFn(saveDraft, 1000);

save.flush(); // run the pending call now
save.cancel(); // drop it instead
```

### Debounce a value

The shortest path when the value already lives in state — you get a copy that
trails behind until things go quiet.

```tsx
import { useEffect, useState } from 'react';
import { useDebouncyValue } from 'use-debouncy';

const Search = () => {
  const [value, setValue] = useState('');
  const query = useDebouncyValue(value, 400);

  useEffect(() => {
    fetchData(query);
  }, [query]);

  return (
    <input value={value} onChange={(event) => setValue(event.target.value)} />
  );
};
```

## Recipes

### Autosave that survives navigation

Debounce the writes while typing, and flush the last one when the user leaves.

```tsx
const Editor = ({ id }: { id: string }) => {
  const [draft, setDraft] = useState('');
  const save = useDebouncyFn((text: string) => saveDraft(id, text), 1000);

  // Nothing is lost on unmount: the pending write goes out immediately
  useEffect(() => () => save.flush(), [save]);

  return (
    <textarea
      value={draft}
      onChange={(event) => {
        setDraft(event.target.value);
        save(event.target.value);
      }}
    />
  );
};
```

### Validation that stops when the field is cleared

```tsx
const Email = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validate = useDebouncyFn((value: string) => {
    setError(isEmail(value) ? null : 'Enter a valid email');
  }, 500);

  return (
    <input
      value={email}
      onChange={(event) => {
        const { value } = event.target;
        setEmail(value);
        setError(null);

        // No point validating an empty field, so drop the pending run
        if (value) validate(value);
        else validate.cancel();
      }}
    />
  );
};
```

## API

### `useDebouncyEffect(fn, wait?, deps?)`

```ts
function useDebouncyEffect(
  fn: EffectCallback,
  wait?: number,
  deps?: DependencyList,
): void;
```

| Argument | Required | Default | Description                                                   |
| -------- | -------- | ------- | ------------------------------------------------------------- |
| `fn`     | ✓        |         | Called once the dependencies settle. May return a destructor. |
| `wait`   |          | `0`     | Milliseconds to wait.                                         |
| `deps`   |          | `[]`    | Dependencies, as in `useEffect`.                              |

Skips the initial render, restarts the timer whenever the dependencies change,
and cancels a pending call on unmount.

### `useDebouncyFn(fn, wait?)`

```ts
function useDebouncyFn<Args extends unknown[]>(
  fn: (...args: Args) => unknown,
  wait?: number,
): DebouncyFn<Args>;
```

| Argument | Required | Default | Description                                       |
| -------- | -------- | ------- | ------------------------------------------------- |
| `fn`     | ✓        |         | Called with the arguments of the last invocation. |
| `wait`   |          | `0`     | Milliseconds to wait.                             |

Returns a function with a stable identity, which also exposes:

| Method     | Description                                |
| ---------- | ------------------------------------------ |
| `cancel()` | Drops the pending call, if any.            |
| `flush()`  | Runs the pending call immediately, if any. |

### `useDebouncyValue(value, wait?)`

```ts
function useDebouncyValue<Value>(value: Value, wait?: number): Value;
```

| Argument | Required | Default | Description           |
| -------- | -------- | ------- | --------------------- |
| `value`  | ✓        |         | Value to trail.       |
| `wait`   |          | `0`     | Milliseconds to wait. |

Returns the value unchanged on the first render, then updates once it has
stopped changing.

### Types

```ts
import type { DebouncyFn } from 'use-debouncy';

type DebouncyFn<Args extends unknown[]> = ((...args: Args) => void) & {
  cancel: () => void;
  flush: () => void;
};
```

## Good to know

**The timer follows frames, not the wall clock.** Waiting is driven by
`requestAnimationFrame`, so the callback lands right before a repaint, together
with the rest of the frame's work. The flip side: browsers pause frames for
hidden tabs, so a pending call resumes only when the tab becomes visible again.
Work that has to happen while the user is away belongs in `visibilitychange` or
`sendBeacon` instead.

**Server rendering works.** Nothing touches browser globals during render, so
`renderToString` is fine — the timer only ever starts in the browser.

**You may not need this package.** If the only goal is to keep a heavy render
from blocking typing, React's own `useDeferredValue` does that with no
dependency at all. Reach for these hooks when you want to delay a _side effect_:
a request, an autosave, a validation.

**Testing.** Fake timers have to mock `requestAnimationFrame` as well, or the
callback never fires. `jest.useFakeTimers()` and Playwright's
`page.clock.install()` both do.

## Development

```bash
yarn install
yarn hooks      # once per clone: installs the pre-commit hook

yarn dev        # story gallery at http://localhost:3100/playwright/gallery/index.html
yarn test       # component tests in Chromium, Firefox and WebKit
yarn test --ui  # same, in Playwright's UI mode
yarn lint       # oxlint + oxfmt
yarn typecheck  # tsc
yarn build      # bundle into lib/
```

Components under test live in `playwright/stories/*.story.tsx`, one export per
scenario, and the tests address them by id. The gallery is served by the
project's own Vite dev server and renders stories in `StrictMode`, so React's
development-only behaviour is covered too. Open the gallery URL in a browser to
eyeball every story by hand.

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org)
— they decide the released version.

## License

MIT © [Egor Avakumov](https://github.com/eavam)

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Feavam%2Fuse-debouncy.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Feavam%2Fuse-debouncy?ref=badge_large)
