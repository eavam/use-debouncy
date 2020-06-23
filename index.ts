import {
  useRef,
  useEffect,
  EffectCallback,
  DependencyList,
  useCallback,
} from 'react';

const useDebouncy = (
  fn: EffectCallback,
  wait = 0,
  deps: DependencyList = [],
): void => {
  const timeout = useRef<NodeJS.Timeout>();
  const callback = useRef(fn);
  const clear = useRef(() => timeout.current && clearTimeout(timeout.current));

  const updater = useCallback(() => {
    clear.current();

    timeout.current = setTimeout(() => {
      callback.current();
    }, wait);
  }, [wait]);

  // Set new callback if it updated
  useEffect(() => {
    callback.current = fn;
  }, [fn]);

  // Call update if deps changes
  useEffect(() => {
    updater();
  }, deps);

  // Clear timer on first render
  useEffect(() => {
    clear.current();
  }, []);
};

export default useDebouncy;
