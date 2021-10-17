import { useCallback, useEffect, useRef } from 'react';

interface RenderFn<T> {
  (...args: T[]): void;
}

interface RenderFrameFn<T> {
  (cb: RenderFn<T>, timeStart?: number): FrameRequestCallback;
}

export const useAnimationFrame = <T>(
  callback: RenderFn<T>,
  wait: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ((...args: T[]) => any) => {
  const rafId = useRef(0);

  const renderFrame = useCallback<RenderFrameFn<T>>(
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const render: (...args: T[]) => any = useCallback(
    (...args) => {
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
