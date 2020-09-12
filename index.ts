import {
  useRef,
  useEffect,
  EffectCallback,
  DependencyList,
  useCallback,
} from 'react';

/**
 *
 * @param fn - Debounce callback.
 * @param wait - Number of milliseconds to delay.
 * @param deps - Array values that the debounce depends (like as useEffect).
 */
const useDebouncy = (
  fn: EffectCallback,
  wait?: number,
  deps?: DependencyList,
): void => {
  const raf = useRef(0);
  const timeNow = useRef(Date.now());
  const defaultWait = wait || 0;
  const defaultDeps = deps || [];
  const callback = useRef(fn);
  const isFirstRender = useRef(true);
  const renderFrame: FrameRequestCallback = useCallback((time) => {
    if (time - timeNow.current >= defaultWait) {
      callback.current();
    } else {
      raf.current = requestAnimationFrame(renderFrame);
    }
  }, []);

  // Set new callback if it updated
  useEffect(() => {
    callback.current = fn;
  }, [fn]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    timeNow.current = Date.now();
    raf.current = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(raf.current);
    };
  }, defaultDeps);
};

export default useDebouncy;
