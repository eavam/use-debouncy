# useDebouncy

🌀 Small (~0.2kb) debounce effect hook for React with TypeScript support

![license](https://badgen.net/npm/license/use-debouncy)
![dependents](https://badgen.net/npm/dependents/use-debouncy)
![minified](https://badgen.net/bundlephobia/min/use-debouncy)
![minified + gzip](https://badgen.net/bundlephobia/minzip/use-debouncy)
![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/use-debouncy)
![downloads](https://badgen.net/npm/dm/use-debouncy)
![types](https://badgen.net/npm/types/use-debouncy)
[![codecov](https://codecov.io/gh/eavam/use-debouncy/branch/main/graph/badge.svg)](https://codecov.io/gh/eavam/use-debouncy)

![](assets/example.gif)

## Features

- 👌 **No dependencies.**
- 🏋️‍ **Tiny.** ~0.2kb. [Size Limit](https://github.com/ai/size-limit) controls the size.
- 🦾 **Performance.** Used by requestAnimationFrame.
- 📖 **Types.** Support TypeScript.
- 🎣 **Easy.** Use like React effect or function.

## Installation

```bash
# NPM
npm install use-debouncy

# YARN
yarn add use-debouncy
```

### [Check bit component here](https://bit.dev/eavam/use-debouncy/use-debounce)

```bash
# Import bit component
bit import eavam.use-debouncy/use-debounce
```

## Usage

### [Demo codesandbox](https://codesandbox.io/s/example-use-debouncy-ynfuq?expanddevtools=1&fontsize=14&theme=dark)

### Use as effect hook

```tsx
import React, { useState } from 'react';
import useDebouncy from 'use-debouncy/effect'; // <== importing from effect

const App = () => {
  const [value, setValue] = useState('');

  useDebouncy(
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
import React, { useState } from 'react';
import useDebouncy from 'use-debouncy/fn'; // <== importing from fn

const App = () => {
  const handleChange = useDebouncy(
    (event) => fetchData(event.target.value), // function debounce
    400, // number of milliseconds to delay
  );

  return <input value={value} onChange={handleChange} />;
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
function useDebouncyFn(
  fn: (...args: any[]) => void,
  wait?: number,
): (...args: any[]) => void;
```

| Prop | Required | Default | Description                      |
| ---- | -------- | ------- | -------------------------------- |
| fn   | ✓        |         | Debounce handler.                |
| wait |          | `0`     | Number of milliseconds to delay. |
