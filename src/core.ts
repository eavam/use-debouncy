import { useCallback, useEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Args = any[];

export const useAnimationFrame = <Fn extends (...args: Args) => void>(
  callback: Fn,
  wait = 0,
): ((...args: Parameters<Fn>) => void) => {
  const rafId = useRef(0);

  const render = useCallback(
    (...args: Parameters<Fn>) => {
      // Reset previous animation before start new animation
      cancelAnimationFrame(rafId.current);

      const timeStart = performance.now();

      const renderFrame = (timeNow: number) => {
        // Call next rAF if time is not up
        if (timeNow - timeStart < wait) {
          rafId.current = requestAnimationFrame(renderFrame);
          return;
        }

        // eslint-disable-next-line n/no-callback-literal
        callback(...args);
      };

      rafId.current = requestAnimationFrame(renderFrame);
    },
    [callback, wait],
  );

  // Call cancel animation after umount
  useEffect(() => () => cancelAnimationFrame(rafId.current), []);

  return render;
};
