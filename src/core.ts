import { useCallback, useEffect, useRef } from 'react';

interface BlankFn {
  (...args: any[]): any;
}

interface RenderFrameFn {
  (cb: BlankFn, timeStart?: number): FrameRequestCallback;
}

export const useAnimationFrame = <T>(
  callback: (...args: T[]) => void,
  wait: number,
): BlankFn => {
  const rafId = useRef(0);
  const callbackArgsLen = callback.length;
  const curryArgs: T[] = [];

  const renderFrame = useCallback<RenderFrameFn>(
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

  // Call cancel animation after umount
  useEffect(() => () => cancelAnimationFrame(rafId.current), []);

  const render = useCallback(
    (...args: T[]) => {
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

  const next: (...args: any[]) => any = useCallback(
    (...args) => {
      curryArgs.push(...args);
      return curryArgs.length < callbackArgsLen ? next : render(...curryArgs);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callbackArgsLen, render],
  );

  return next;
};
