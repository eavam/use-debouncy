import React from 'react';
import { render } from 'react-dom';
import { SearchPeoplesWithEffect } from './src/searchPeoplesWithEffect';
import { SearchPeoplesWithFn } from './src/searchPeoplesWithFn';

const App = () => {
  return (
    <>
      <SearchPeoplesWithEffect />
      <div style={{ height: 30 }} />
      <SearchPeoplesWithFn />
    </>
  );
};

const rootElement = document.querySelector('#root');

render(<App />, rootElement);
