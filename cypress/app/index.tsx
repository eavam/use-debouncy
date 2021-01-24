import React, { useState } from 'react';
import { render } from 'react-dom';
import useDebouncy from '../../lib';

const App = () => {
  const [value, setValue] = useState('');
  const [peoples, setPeoples] = useState([]);

  const fetchPeoples = async (search: string) => {
    try {
      const searchedPeoples = await fetch(
        `https://swapi.dev/api/people/?search=${search}`,
      );

      const data = await searchedPeoples.json();
      setPeoples(data.results);
    } catch (error) {
      console.log(error);
    }
  };

  useDebouncy(
    () => {
      fetchPeoples(value);
    },
    400,
    [value],
  );

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void =>
    setValue(event.target.value);

  return (
    <div>
      <input data-qa="input/search" value={value} onChange={onChange} />
      {peoples.map(({ name }) => (
        <div key={name}>{name}</div>
      ))}
    </div>
  );
};

const rootElement = document.querySelector('#root');

render(<App />, rootElement);
