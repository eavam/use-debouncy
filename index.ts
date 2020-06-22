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

  const updater = useCallback(() => {
    if (timeout.current !== undefined) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => {
      callback.current();
    }, wait);
  }, [wait]);

  useEffect(() => {
    callback.current = fn;
  }, [fn]);

  useEffect(() => updater(), deps);
};

export default useDebouncy;
