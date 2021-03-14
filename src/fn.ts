import { useAnimationFrame } from './core';

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
  return useAnimationFrame(fn, wait);
};

export default useDebouncyFn;
