import {
  type DependencyList,
  type EffectCallback,
  useEffect,
  useRef,
} from 'react';
import { useAnimationFrame } from './core';

const defaultDeps: DependencyList = [];

/**
 *
 * Simulates the standard behavior of the useEffect hook.
 * It does not get called on the initial render.
 * If the hook hasn't been called for N milliseconds, it invokes the provided function.
 *
 * @param fn - Function that will be called after the timer expires.
 * @param wait - Number of milliseconds to delay.
 * @param deps - Array values that the debounce depends (like as useEffect).
 * @example
 * ```ts
 *  const App = () => {
 *    const [value, setValue] = useState('');
 *    const debounceFn = useDebouncyFn(onChange, 300);
 *
 *     useDebouncyEffect(
 *      () => { onChange(value) },
 *      400,
 *      [value]
 *     );
 *
 *    return <input value={value} onChange={(event) => setValue(event.target.value)} />
 * }
 * ```
 */
export const useDebouncyEffect = (
  fn: EffectCallback,
  wait = 0,
  deps = defaultDeps,
): void => {
  const isFirstRender = useRef(true);
  const render = useAnimationFrame(fn, wait);
  // Call update if deps changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    render();
  }, deps);
};
