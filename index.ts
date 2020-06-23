import {
  useRef,
  useEffect,
  EffectCallback,
  DependencyList,
  useCallback,
} from 'react';

type DebounceInstance = [
  NodeJS.Timeout | undefined,
  EffectCallback,
  () => void,
];

const useDebouncy = (
  fn: EffectCallback,
  wait = 0,
  deps: DependencyList = [],
): void => {
  const effect = useEffect;
  const debounced = useRef<DebounceInstance>([
    // setTimeout instance
    undefined,

    // user callback
    fn,

    // clear timeout callback
    () => {
      const [timeoutId] = debounced.current;
      timeoutId && clearTimeout(timeoutId);
    },
  ]);

  const updater = useCallback(() => {
    const [, callback, clear] = debounced.current;
    clear();

    // Init setTimeout
    debounced.current[0] = setTimeout(() => {
      callback();
    }, wait);
  }, [wait]);

  // Set new callback if it updated
  effect(() => {
    debounced.current[1] = fn;
  }, [fn]);

  // Call update if deps changes
  effect(() => {
    updater();
  }, deps);

  // Clear timer on first render
  effect(() => {
    debounced.current[2]();
  }, []);
};

export default useDebouncy;
