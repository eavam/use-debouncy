import { useCallback, useEffect, useRef } from 'react';

interface BlankFn {
  (): void;
}

interface RenderFrameFn {
  (cb: BlankFn): FrameRequestCallback;
}

// 16 ms its time on 1 frame
const FRAME_MS = 16;

export const useAnimationFrame = <T>(
  callback: (...args: T[]) => void,
  wait: number,
): BlankFn => {
  const rafId = useRef(0);
  const timeStart = useRef(0);

  const renderFrame = useCallback<RenderFrameFn>(
    (cb) => (timeNow) => {
      // Call next rAF if time is not up
      if (timeNow - timeStart.current < wait) {
        rafId.current = requestAnimationFrame(renderFrame(cb));
        return;
      }

      cb();
    },
    [wait],
  );

  // Call cancel animation after umount
  useEffect(() => () => cancelAnimationFrame(rafId.current), []);

  return useCallback(
    (...args: T[]) => {
      // Reset timer and previous animation before new animation frame
      timeStart.current = Date.now();
      cancelAnimationFrame(rafId.current);

      rafId.current = requestAnimationFrame(
        renderFrame(() => {
          callback(...args);
        }),
      );
    },
    [callback, renderFrame],
  );
};
