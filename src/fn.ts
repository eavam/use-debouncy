import { useAnimationFrame } from './core';

/**
 *
 * @param fn - Debounce callback.
 * @param wait - Number of milliseconds to delay.
 */
const useDebouncyFn = <T, R>(
  fn: (...args: T[]) => R,
  wait = 0,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ((...args: T[]) => any) => {
  return useAnimationFrame(fn, wait);
};

export default useDebouncyFn;
