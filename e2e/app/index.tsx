import React, { useState } from 'react';
import { render } from 'react-dom';
import useDebouncy from '../../lib';

const App = () => {
  const [value, setValue] = useState('');
  const [view, setView] = useState([]);

  useDebouncy(
    () => {
      setView((array) => [...array, value]);
    },
    400,
    [value],
  );

  return (
    <div>
      <input value={value} onChange={(event) => setValue(event.target.value)} />
      <div id="view">{view.join(', ')}</div>
    </div>
  );
};

const rootElement = document.querySelector('#root');

render(<App />, rootElement);
