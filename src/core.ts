import { useCallback, useEffect, useRef } from 'react';

export const useUserCallback = <T>(fn: T): React.MutableRefObject<T> => {
  const callback = useRef(fn);

  useEffect(() => {
    callback.current = fn;
  }, [fn]);

  return callback;
};

// 16 ms its time on 1 frame
const FRAME_MS = 16;

export const useAnimationFrame = <T, R>(
  callback: (...args: T[]) => R,
  wait: number,
): (() => void) => {
  const rafId = useRef(0);
  const timeStart = useRef(0);

  const renderFrame = useCallback<FrameRequestCallback>(
    (timeNow) => {
      //Call will be after the first frame.
      // Requires subtracting 16 ms for more accurate timing.
      timeStart.current = timeStart.current || timeNow - FRAME_MS;

      // Call next rAF if time is not up
      if (timeNow - timeStart.current < wait) {
        rafId.current = requestAnimationFrame(renderFrame);
        return;
      }

      callback();
    },
    [callback, wait],
  );

  // Call cancel animation after umount
  useEffect(() => () => cancelAnimationFrame(rafId.current), []);

  return useCallback(() => {
    // Reset timer and previous animation before new animation frame
    timeStart.current = 0;
    cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(renderFrame);
  }, [renderFrame]);
};
