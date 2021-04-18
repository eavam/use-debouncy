import { useCallback, useEffect, useRef } from 'react';

interface BlankFn {
  (): void;
}

interface RenderFrameFn {
  (cb: BlankFn, timeStart?: number): FrameRequestCallback;
}

export const useAnimationFrame = <T>(
  callback: (...args: T[]) => void,
  wait: number,
): BlankFn => {
  const rafId = useRef(0);

  const renderFrame = useCallback<RenderFrameFn>(
    (cb, timeStart = Date.now()) => (timeNow) => {
      // Call next rAF if time is not up
      if (timeNow - timeStart < wait) {
        rafId.current = requestAnimationFrame(renderFrame(cb, timeStart));
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
      // Reset previous animation before strart new animation
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
