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
- 🦾 **Performance.** Used by requestAnimationFrame.
- 📖 **Types.** Support TypeScript.
- 🎣 **Easy.** Use like React effect or function.

## Installation

#### NPM

```sh
npm install use-debouncy
```

#### Yarn

```sh
yarn add use-debouncy
```

## Usage

### Use as effect hook

```tsx
import React, { useState } from 'react';
import { useDebouncyEffect } from 'use-debouncy';

const App = () => {
  const [value, setValue] = useState('');

  useDebouncyEffect(
    () => fetchData(value), // function debounce
    400, // number of milliseconds to delay
    [value], // array values that the debounce depends (like as useEffect)
  );

  return (
    <input value={value} onChange={(event) => setValue(event.target.value)} />
  );
};
```

### Use as callback function

```tsx
import React, { type ChangeEvent } from 'react';
import { useDebouncyFn } from 'use-debouncy';

const App = () => {
  const handleChange = useDebouncyFn(
    (event: ChangeEvent<HTMLInputElement>) => fetchData(event.target.value), // function debounce
    400, // number of milliseconds to delay
  );

  return <input onChange={handleChange} />;
};
```

The returned function keeps the same identity across renders, so it is safe to
pass to memoized children or to a dependency array. It also carries two
controls for the call that is currently waiting:

```tsx
const save = useDebouncyFn(saveDraft, 1000);

save.flush(); // run the pending call right away
save.cancel(); // drop it instead
```

### Use as value

```tsx
import React, { useEffect, useState } from 'react';
import { useDebouncyValue } from 'use-debouncy';

const App = () => {
  const [value, setValue] = useState('');
  const search = useDebouncyValue(value, 400); // updates once typing stops

  useEffect(() => {
    fetchData(search);
  }, [search]);

  return (
    <input value={value} onChange={(event) => setValue(event.target.value)} />
  );
};
```

## API Reference

### useDebouncy/effect

```typescript
function useDebouncyEffect(fn: () => void, wait?: number, deps?: any[]): void;
```

| Prop | Required | Default | Description                                                 |
| ---- | -------- | ------- | ----------------------------------------------------------- |
| fn   | ✓        |         | Debounce callback.                                          |
| wait |          | `0`     | Number of milliseconds to delay.                            |
| deps |          | `[]`    | Array values that the debounce depends (like as useEffect). |

### useDebouncy/fn

```typescript
function useDebouncyFn<Args extends unknown[]>(
  fn: (...args: Args) => unknown,
  wait?: number,
): DebouncyFn<Args>;

type DebouncyFn<Args extends unknown[]> = ((...args: Args) => void) & {
  cancel: () => void;
  flush: () => void;
};
```

| Prop | Required | Default | Description                      |
| ---- | -------- | ------- | -------------------------------- |
| fn   | ✓        |         | Debounce handler.                |
| wait |          | `0`     | Number of milliseconds to delay. |

### useDebouncy/value

```typescript
function useDebouncyValue<Value>(value: Value, wait?: number): Value;
```

| Prop  | Required | Default | Description                      |
| ----- | -------- | ------- | -------------------------------- |
| value | ✓        |         | Value to debounce.               |
| wait  |          | `0`     | Number of milliseconds to delay. |

## Good to know

- **Effects wait for a frame.** The timer is driven by `requestAnimationFrame`,
  which browsers pause for hidden tabs. A pending call resumes when the tab
  becomes visible again, so avoid this package for work that has to happen
  while the user is away, such as a last-chance autosave.
- **Server rendering works.** The hooks touch no browser globals during render,
  so `renderToString` is fine; the timer only ever starts in the browser.
- **You may not need it.** If the goal is only to keep a heavy render from
  blocking typing, React's own `useDeferredValue` does that without a
  dependency. Reach for this package when you want to delay a _side effect_ —
  a request, an autosave, a validation.

## Development

```bash
yarn dev        # story gallery at http://localhost:3100/playwright/gallery/index.html
yarn test       # component tests in Chromium, Firefox and WebKit
yarn test --ui  # same, in Playwright's UI mode
yarn lint       # oxlint + oxfmt
yarn typecheck  # tsc --noEmit
yarn build      # bundle into lib/
```

Components under test live in `playwright/stories/*.story.tsx`, one export per
scenario, and the tests address them by id. The gallery is served by the
project's own Vite dev server and renders stories in `StrictMode`, so React's
development-only behaviour is covered too. Open the gallery URL in a browser to
eyeball every story by hand.

## License

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Feavam%2Fuse-debouncy.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Feavam%2Fuse-debouncy?ref=badge_large)
