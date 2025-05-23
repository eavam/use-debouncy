import { type ChangeEvent, useState } from 'react';
import React from 'react';
import { useDebouncyEffect } from '../../../lib';
import { usePeoples } from './usePeoples';

export const SearchPeoplesWithEffect = (): JSX.Element => {
  const [value, setValue] = useState('');
  const { fetchPeoples, peoples } = usePeoples();

  useDebouncyEffect(
    () => {
      fetchPeoples(value);
    },
    400,
    [value],
  );

  const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return (
    <div>
      <input
        data-testid="input/search/effect"
        value={value}
        onChange={onChange}
      />
      {peoples.map(({ name }) => (
        <div key={name}>{name}</div>
      ))}
    </div>
  );
};
