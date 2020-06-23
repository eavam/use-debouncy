# useDebouncy

🚦React effect hook for debounce.

![license](https://badgen.net/npm/license/use-debouncy)
![dependents](https://badgen.net/npm/dependents/use-debouncy)
![types](https://badgen.net/npm/types/use-debouncy)

## Features

- 👌 **No dependencies.**
- 🏋️‍♀️ **Small.** <200 bytes. [Size Limit](https://github.com/ai/size-limit) controls the size.
- 📖 **Types.** Support typescript.
- 🎣 **Easy.** Like useEffect hook.

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

### Try in [codesandbox](https://codesandbox.io/s/example-use-debouncy-ynfuq?expanddevtools=1&fontsize=14&theme=dark)
