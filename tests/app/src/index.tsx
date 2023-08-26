import React from 'react';
import { createRoot } from 'react-dom/client';
import { SearchPeoplesWithEffect } from './searchPeoplesWithEffect';
import { SearchPeoplesWithFn } from './searchPeoplesWithFn';

const App = () => {
  return (
    <>
      <SearchPeoplesWithEffect />
      <div style={{ height: 30 }} />
      <SearchPeoplesWithFn />
    </>
  );
};

const container = document.querySelector('#root');
const root = createRoot(container!);
root.render(<App />);
