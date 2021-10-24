import React from 'react';

import { usePeoples } from './usePeoples';
import useDebounceFn from '../../../lib/fn';

export const SearchPeoplesWithFn = (): JSX.Element => {
  const { fetchPeoples, peoples } = usePeoples();

  const onChange = (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    fetchPeoples(event.target.value);
  };

  const search = useDebounceFn(onChange, 400);

  return (
    <div>
      <input data-cy="input/search/fn" onChange={search('searchTestId')} />
      {peoples.map(({ name }) => (
        <div key={name}>{name}</div>
      ))}
    </div>
  );
};
