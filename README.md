# useDebouncy

🚦React effect hook for debounce.

![status](https://badgen.net/github/status/egorAva/use-debouncy/master)
![minzip](https://badgen.net/bundlephobia/minzip/use-debouncy)
![license](https://badgen.net/npm/license/use-debouncy)
![dependents](https://badgen.net/npm/dependents/use-debouncy)
![types](https://badgen.net/npm/types/use-debouncy)

## Features

👌 Zero dependencies

🏋️‍♀️ Size <0.5kb

📖 Typescript support

🎣 React hook effect

## Installation

```bash
# NPM
npm install use-debouncy

# YARN
yarn add use-debouncy
```

## Examples

```tsx
import React, { useState } from 'react';
import useDebouncy from 'use-debouncy';

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
