import { useRef, useEffect, EffectCallback, DependencyList } from 'react';

const enum DC {
  timeout,
  callback,
}
type TimerRefType = [NodeJS.Timeout | undefined, EffectCallback];

const effect = useEffect;
const clear = (timeout?: NodeJS.Timeout) => {
  timeout && clearTimeout(timeout);
};

/**
 *
 * @param fn - Callback called on debounce.
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
  const timer = useRef<TimerRefType>([undefined, fn]);

  // Set new callback if it updated
  effect(() => {
    timer.current[DC.callback] = fn;
  }, [fn]);

  // Call update if deps changes
  effect(() => {
    const reference = timer.current;
    clear(reference[DC.timeout]);

    // Init setTimeout
    reference[DC.timeout] = setTimeout(() => {
      reference[DC.callback]();
    }, defaultWait);
  }, defaultDeps);

  // Clear timer on first render
  effect(() => {
    const reference = timer.current;
    clear(reference[DC.timeout]);

    return () => {
      clear(reference[DC.timeout]);
    };
  }, []);
};

export default useDebouncy;
