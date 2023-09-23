import { useAnimationFrame } from './core';

/**
 *
 * The hook returns a function, and when that function is called,
 * the provided function will be invoked after N milliseconds,
 * unless the function is called again.
 *
 * @param fn - Function that will be called after the timer expires.
 * @param wait - Number of milliseconds to delay.
 * @example
 * ```ts
 *  const App = () => {
 *    const debounceFn = useDebouncyFn(onChange, 300);
 *
 *    return <input onChange={debounceFn} />
 * }
 * ```
 */
export const useDebouncyFn = useAnimationFrame;
