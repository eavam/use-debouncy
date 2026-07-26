import { type ChangeEvent, useState } from 'react';
import { useDebouncyEffect } from '../../src';
import { useDebouncyFn } from '../../src';

type Person = { name: string };

const usePeoples = () => {
  const [peoples, setPeoples] = useState<Person[]>([]);

  const fetchPeoples = async (search: string) => {
    try {
      const response = await fetch(
        `https://swapi.dev/api/people/?search=${search}`,
      );
      const data = await response.json();
      setPeoples(data.results ?? []);
    } catch {
      setPeoples([]);
    }
  };

  return { fetchPeoples, peoples };
};

export const SearchPeoplesWithEffect = () => {
  const [value, setValue] = useState('');
  const { fetchPeoples, peoples } = usePeoples();

  useDebouncyEffect(
    () => {
      fetchPeoples(value);
    },
    400,
    [value],
  );

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
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

export const SearchPeoplesWithFn = () => {
  const { fetchPeoples, peoples } = usePeoples();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
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
