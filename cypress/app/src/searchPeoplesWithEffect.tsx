import React, { useState } from 'react';
import { usePeoples } from './usePeoples';
import useDebounceEffect from '../../../lib/effect';

export const SearchPeoplesWithEffect = (): JSX.Element => {
  const [value, setValue] = useState('');
  const { fetchPeoples, peoples } = usePeoples();

  useDebounceEffect(
    () => {
      fetchPeoples(value);
    },
    400,
    [value],
  );

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return (
    <div>
      <input data-cy="input/search/effect" value={value} onChange={onChange} />
      {peoples.map(({ name }) => (
        <div key={name}>{name}</div>
      ))}
    </div>
  );
};
