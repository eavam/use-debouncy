import { useRef, useEffect, EffectCallback, DependencyList } from 'react';
import { useAnimationFrame, useUserCallback } from './core';

const defaultDeps: DependencyList = [];

/**
 *
 * @param fn - Debounce callback.
 * @param wait - Number of milliseconds to delay.
 * @param deps - Array values that the debounce depends (like as useEffect).
 */
const useDebouncy = (
  fn: EffectCallback,
  wait = 0,
  deps = defaultDeps,
): void => {
  const callback = useUserCallback(fn);
  const isFirstRender = useRef(true);
  const render = useAnimationFrame(() => {
    callback.current();
  }, wait);

  // Call update if deps changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    render();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useDebouncy;
