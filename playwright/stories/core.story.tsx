import { useCallback, useState } from 'react';
import { useAnimationFrame } from '../../src/core';

export const AnimationFrameTest = ({ delay = 100 }: { delay?: number }) => {
  const [callCount, setCallCount] = useState(0);

  const callback = useCallback(() => {
    setCallCount((prev) => prev + 1);
  }, []);

  const cb = useAnimationFrame(callback, delay);

  return (
    <>
      <div data-testid="call-count">{callCount}</div>
      <button type="button" data-testid="trigger" onClick={() => cb()}>
        Trigger
      </button>
    </>
  );
};
