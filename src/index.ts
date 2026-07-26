import {
  type DependencyList,
  type EffectCallback,
  useCallback,
  useEffect,
  useRef,
} from 'react';

const defaultDeps: DependencyList = [];

const useAnimationFrame = <Fn extends (...args: Parameters<Fn>) => void>(
  fn: Fn,
  wait = 0,
): ((...args: Parameters<Fn>) => void) => {
  const rafId = useRef(0);
  // Read through refs so a pending call runs the latest callback and the
  // returned function keeps a stable identity across renders
  const fnRef = useRef(fn);
  const waitRef = useRef(wait);

  useEffect(() => {
    fnRef.current = fn;
    waitRef.current = wait;
  });

  // Call cancel animation after unmount
  useEffect(() => () => cancelAnimationFrame(rafId.current), []);

  return useCallback((...args: Parameters<Fn>) => {
    // Reset previous animation before start new animation
    cancelAnimationFrame(rafId.current);

    const timeStart = performance.now();

    const renderFrame = (timeNow: number) => {
      // Call next rAF if time is not up
      if (timeNow - timeStart < waitRef.current) {
        rafId.current = requestAnimationFrame(renderFrame);
        return;
      }

      fnRef.current(...args);
    };

    rafId.current = requestAnimationFrame(renderFrame);
  }, []);
};

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
  const destructor = useRef<ReturnType<EffectCallback>>(undefined);

  const render = useAnimationFrame(() => {
    // Mirror useEffect: tear down the previous run before starting a new one
    destructor.current?.();
    destructor.current = fn();
  }, wait);

  useEffect(
    () => () => {
      // StrictMode remounts in development: without this the second mount
      // would look like an update and fire the effect on the initial render
      isFirstRender.current = true;
      destructor.current?.();
      destructor.current = undefined;
    },
    [],
  );

  // Call update if deps changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: the hook mirrors useEffect, deps come from the caller
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    render();
  }, deps);
};

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
