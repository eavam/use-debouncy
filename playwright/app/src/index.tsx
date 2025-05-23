import React from 'react';

import { SearchPeoplesWithEffect } from './searchPeoplesWithEffect';
import { SearchPeoplesWithFn } from './searchPeoplesWithFn';

export const App = () => {
  return (
    <>
      <SearchPeoplesWithEffect />
      <div style={{ height: 30 }} />
      <SearchPeoplesWithFn />
    </>
  );
};
