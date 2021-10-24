import { useCallback, useEffect, useRef } from 'react';

interface RenderFrameFn<Fn> {
  (cb: Fn | (() => void), timeStart?: number): FrameRequestCallback;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Args = any[];

export const useAnimationFrame = <Fn extends (...args: Args) => void>(
  callback: Fn,
  wait = 0,
): ((...args: Parameters<Fn>) => void) => {
  const rafId = useRef(0);

  const renderFrame = useCallback<RenderFrameFn<Fn>>(
    (cb, timeStart = 0) =>
      (timeNow) => {
        const timeFirstStart = timeStart || timeNow;
        // Call next rAF if time is not up
        if (timeNow - timeFirstStart < wait) {
          rafId.current = requestAnimationFrame(
            renderFrame(cb, timeFirstStart),
          );
          return;
        }

        cb();
      },
    [wait],
  );

  const render = useCallback(
    (...args: Parameters<Fn>) => {
      // Reset previous animation before start new animation
      cancelAnimationFrame(rafId.current);

      rafId.current = requestAnimationFrame(
        renderFrame(() => {
          callback(...args);
        }),
      );
    },
    [callback, renderFrame],
  );

  // Call cancel animation after umount
  useEffect(() => () => cancelAnimationFrame(rafId.current), []);

  return render;
};
