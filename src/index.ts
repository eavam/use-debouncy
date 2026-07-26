import {
  type DependencyList,
  type EffectCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const defaultDeps: DependencyList = [];

/**
 * The debounced function returned by `useDebouncyFn`, with controls for the
 * call that is currently waiting.
 */
export type DebouncyFn<Args extends unknown[]> = ((...args: Args) => void) & {
  /** Drop the pending call, if any. */
  cancel: () => void;
  /** Run the pending call right away, if any. */
  flush: () => void;
};

const useAnimationFrame = <Args extends unknown[]>(
  fn: (...args: Args) => unknown,
  wait = 0,
): DebouncyFn<Args> => {
  const rafId = useRef(0);
  // Read through refs so a pending call runs the latest callback and the
  // returned function keeps a stable identity across renders
  const fnRef = useRef(fn);
  const waitRef = useRef(wait);
  const pendingArgs = useRef<Args>(undefined);

  useEffect(() => {
    fnRef.current = fn;
    waitRef.current = wait;
  });

  // Call cancel animation after unmount
  useEffect(() => () => cancelAnimationFrame(rafId.current), []);

  return useMemo(() => {
    const render = (...args: Args) => {
      // Reset previous animation before start new animation
      cancelAnimationFrame(rafId.current);
      pendingArgs.current = args;

      const timeStart = performance.now();

      const renderFrame = (timeNow: number) => {
        // Call next rAF if time is not up
        if (timeNow - timeStart < waitRef.current) {
          rafId.current = requestAnimationFrame(renderFrame);
          return;
        }

        pendingArgs.current = undefined;
        fnRef.current(...args);
      };

      rafId.current = requestAnimationFrame(renderFrame);
    };

    render.cancel = () => {
      cancelAnimationFrame(rafId.current);
      pendingArgs.current = undefined;
    };

    render.flush = () => {
      const args = pendingArgs.current;

      if (args) {
        render.cancel();
        fnRef.current(...args);
      }
    };

    return render;
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
  // The hook mirrors useEffect: deps come from the caller, so exhaustive-deps
  // is disabled for this file in .oxlintrc.json
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
 * The returned function keeps a stable identity across renders and carries
 * `cancel()` to drop the pending call and `flush()` to run it right away.
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

/**
 *
 * Returns a copy of the value that only updates once the value has stopped
 * changing for N milliseconds. The first render returns the value as is.
 *
 * @param value - Value to debounce.
 * @param wait - Number of milliseconds to delay.
 * @example
 * ```ts
 *  const App = () => {
 *    const [value, setValue] = useState('');
 *    const search = useDebouncyValue(value, 400);
 *
 *    useEffect(() => { fetchData(search) }, [search]);
 *
 *    return <input value={value} onChange={(event) => setValue(event.target.value)} />
 * }
 * ```
 */
export const useDebouncyValue = <Value>(value: Value, wait = 0): Value => {
  const [debounced, setDebounced] = useState(value);

  useDebouncyEffect(() => setDebounced(value), wait, [value]);

  return debounced;
};
