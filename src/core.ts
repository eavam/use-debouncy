import { useCallback, useEffect, useRef } from 'react';

type Args = unknown[];

export const useAnimationFrame = <Fn extends (...args: Args) => void>(
  fn: Fn,
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

        fn(...args);
      };

      rafId.current = requestAnimationFrame(renderFrame);
    },
    [fn, wait],
  );

  // Call cancel animation after umount
  useEffect(() => () => cancelAnimationFrame(rafId.current), []);

  return render;
};
