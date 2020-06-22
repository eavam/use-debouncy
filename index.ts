import debounce from 'lodash.debounce';
import { useRef, useEffect, EffectCallback, DependencyList } from 'react';

const useDebouncy = (
  fn: EffectCallback,
  wait = 0,
  deps: DependencyList = [],
): void => {
  const callback = useRef(fn);
  const updater = useRef(debounce(() => callback.current(), wait));

  useEffect(() => {
    callback.current = fn;
  }, [fn]);
  useEffect(() => updater.current(), deps);
};

export default useDebouncy;
