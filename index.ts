import {
  useRef,
  useEffect,
  EffectCallback,
  DependencyList,
  useCallback,
} from 'react';

const effect = useEffect;
const reference = useRef;
const clear = (timeout?: NodeJS.Timeout) => {
  timeout && clearTimeout(timeout);
};

const useDebouncy = (
  fn: EffectCallback,
  wait = 0,
  deps: DependencyList = [],
): void => {
  const timeout = reference<NodeJS.Timeout>();
  const callback = reference(fn);

  const updater = useCallback(() => {
    clear(timeout.current);

    // Init setTimeout
    timeout.current = setTimeout(() => {
      callback.current();
    }, wait);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wait]);

  // Set new callback if it updated
  effect(() => {
    callback.current = fn;
  }, [fn]);

  // Call update if deps changes
  effect(() => {
    updater();
  }, deps);

  // Clear timer on first render
  effect(() => {
    clear(timeout.current);
  }, []);
};

export default useDebouncy;
