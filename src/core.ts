import type { F } from 'ts-toolbelt';
import { useCallback, useEffect, useRef } from 'react';

interface RenderFrameFn {
  (cb: F.Function, timeStart?: number): FrameRequestCallback;
}

const curry = <T extends F.Function>(fn: T, cbLength: number) => {
  const curringFn: F.Curry<T> = (...args) => {
    const cbArgs = <F.Parameters<T>>[];
    cbArgs.push(...args);

    return cbArgs.length < cbLength ? curringFn : fn(cbArgs);
  };

  return curringFn;
};

export const useAnimationFrame = <Fn extends F.Function>(
  callback: Fn,
  wait = 0,
): F.Curry<Fn> => {
  const rafId = useRef(0);

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

  const render = useCallback(
    (args) => {
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

  return curry(render, callback.length);
};
