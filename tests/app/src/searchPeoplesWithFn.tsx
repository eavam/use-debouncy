import React from 'react';

import { useDebouncyFn } from '../../../lib';
import { usePeoples } from './usePeoples';

export const SearchPeoplesWithFn = (): JSX.Element => {
  const { fetchPeoples, peoples } = usePeoples();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    fetchPeoples(event.target.value);
  };

  const search = useDebouncyFn(onChange, 400);

  return (
    <div>
      <input data-testid="input/search/fn" onChange={search} />
      {peoples.map(({ name }) => (
        <div key={name}>{name}</div>
      ))}
    </div>
  );
};
