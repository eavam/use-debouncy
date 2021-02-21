import { useRef } from 'react';
import { useAnimationFrame, useUserCallback } from './core';

interface UseDebouncyFnReturn<T> {
  (...args: T[]): void;
}

/**
 *
 * @param fn - Debounce callback.
 * @param wait - Number of milliseconds to delay.
 */
const useDebouncyFn = <T, R>(
  fn: (...args: T[]) => R,
  wait = 0,
): UseDebouncyFnReturn<T> => {
  const callback = useUserCallback(fn);
  const callbackArgs = useRef<T[]>([]);
  const render = useAnimationFrame(() => {
    callback.current(...callbackArgs.current);
  }, wait);

  return (...args: T[]) => {
    // Update arguments before render
    callbackArgs.current = args;
    render();
  };
};

export default useDebouncyFn;
