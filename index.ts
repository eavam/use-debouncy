import {
  useRef,
  useEffect,
  EffectCallback,
  DependencyList,
  useCallback,
} from 'react';

const effect = useEffect;
const reference = useRef;

const useDebouncy = (
  fn: EffectCallback,
  wait = 0,
  deps: DependencyList = [],
): void => {
  const timeout = reference<NodeJS.Timeout>();
  const callback = reference(fn);
  const clear = reference(() => {
    const timeoutId = timeout.current;
    timeoutId && clearTimeout(timeoutId);
  });

  const updater = useCallback(() => {
    clear.current();

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
    clear.current();
  }, []);
};

export default useDebouncy;
