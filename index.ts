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

const useDebouncy = (
  fn: EffectCallback,
  wait = 0,
  deps: DependencyList = [],
): void => {
  const timer = useRef<TimerRefType>([undefined, fn]);

  // Set new callback if it updated
  effect(() => {
    timer.current[DC.callback] = fn;
  }, [fn]);

  // Call update if deps changes
  effect(() => {
    clear(timer.current[DC.timeout]);

    // Init setTimeout
    timer.current[DC.timeout] = setTimeout(() => {
      timer.current[DC.callback]();
    }, wait);
  }, deps);

  // Clear timer on first render
  effect(() => {
    clear(timer.current[DC.timeout]);

    return () => {
      clear(timer.current[DC.timeout]);
    };
  }, []);
};

export default useDebouncy;
