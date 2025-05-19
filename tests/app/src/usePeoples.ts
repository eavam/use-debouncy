import { useState } from 'react';

type UsePeoplesHook = () => {
  fetchPeoples: (search: string) => Promise<void>;
  peoples: { name: string }[];
};

export const usePeoples: UsePeoplesHook = () => {
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

  return { fetchPeoples, peoples };
};
