import { useRef, useEffect, EffectCallback, DependencyList } from 'react';

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
  const defaultWait = wait || 0;
  const defaultDeps = deps || [];
  const rafId = useRef(0);
  const timeStart = useRef(0);
  const callback = useRef(fn);
  const isFirstRender = useRef(true);
  const renderFrame = useRef<FrameRequestCallback>((timeNow) => {
    if (timeStart.current === 0) {
      /**
       * Call will be after the first frame.
       * Requires subtracting 16 ms for more accurate timing.
       */
      timeStart.current = timeNow - 16; // 16 ms its time on 1 frame
    }

    // Call callback if times up
    if (timeNow - timeStart.current >= defaultWait) {
      callback.current();
    } else {
      // Or call rAF
      rafId.current = requestAnimationFrame(renderFrame.current);
    }
  });

  // Set new callback if it updated
  useEffect(() => {
    callback.current = fn;
  }, [fn]);

  // Call update if deps changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    timeStart.current = 0;
    rafId.current = requestAnimationFrame(renderFrame.current);

    return () => {
      cancelAnimationFrame(rafId.current);
    };
  }, defaultDeps);
};

export default useDebouncy;
