import { useRef, useEffect, EffectCallback, DependencyList } from 'react';

/**
 *
 * @param fn - Debounce callback.
 * @param wait - Number of milliseconds to delay.
 * @param deps - Array values that the debounce depends (like as useEffect).
 */
const useDebouncy = (
  fn: EffectCallback,
  wait?: number,
  deps?: DependencyList,
): void => {
  const defaultWait = wait || 0;
  const defaultDeps = deps || [];
  const callback = useRef(fn);
  const isFirstRender = useRef(true);

  // Set new callback if it updated
  useEffect(() => {
    callback.current = fn;
  }, [fn]);

  // Call update if deps changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Init setTimeout
    const timeout = setTimeout(() => {
      callback.current();
    }, defaultWait);

    // Clear on update or unmount
    return () => {
      clearTimeout(timeout);
    };
  }, defaultDeps);
};

export default useDebouncy;
