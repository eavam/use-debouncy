import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDebouncyEffect, useDebouncyFn } from '../../src';

/** The effect callback may return a destructor, like useEffect. */
export const EffectDestructor = ({ delay = 50 }: { delay?: number }) => {
  const [value, setValue] = useState('');
  const [runs, setRuns] = useState(0);
  const [cleanups, setCleanups] = useState(0);

  useDebouncyEffect(
    () => {
      setRuns((prev) => prev + 1);
      return () => setCleanups((prev) => prev + 1);
    },
    delay,
    [value],
  );

  return (
    <div>
      <input
        data-testid="input"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <div data-testid="runs">{runs}</div>
      <div data-testid="cleanups">{cleanups}</div>
    </div>
  );
};

/** The returned callback must keep the same identity across renders. */
export const CallbackIdentity = () => {
  const [, setTick] = useState(0);
  const debounced = useDebouncyFn(() => {}, 50);
  const previous = useRef(debounced);
  const changes = useRef(0);

  if (previous.current !== debounced) {
    previous.current = debounced;
    changes.current += 1;
  }

  return (
    <div>
      <button
        type="button"
        data-testid="rerender"
        onClick={() => setTick((tick) => tick + 1)}
      >
        Rerender
      </button>
      <div data-testid="identity-changes">{changes.current}</div>
    </div>
  );
};

/** A pending call must run against the latest state, not a stale closure. */
export const LatestState = ({ delay = 200 }: { delay?: number }) => {
  const [text, setText] = useState('initial');
  const [seen, setSeen] = useState('none');

  const debounced = useDebouncyFn(() => setSeen(text), delay);

  return (
    <div>
      <button type="button" data-testid="start" onClick={() => debounced()}>
        Start
      </button>
      <button
        type="button"
        data-testid="change"
        onClick={() => setText('updated')}
      >
        Change
      </button>
      <div data-testid="text">{text}</div>
      <div data-testid="seen">{seen}</div>
    </div>
  );
};

/** The effect must stay silent on mount, including StrictMode's remount. */
export const SilentOnMount = ({ delay = 50 }: { delay?: number }) => {
  const [calls, setCalls] = useState(0);

  useDebouncyEffect(
    () => {
      setCalls((prev) => prev + 1);
    },
    delay,
    [],
  );

  return <div data-testid="calls">{calls}</div>;
};

/** Hands the debounced function to the test so it outlives the component. */
export const EscapingFn = ({ delay = 200 }: { delay?: number }) => {
  const debounced = useDebouncyFn(() => {
    window.escapedCalls = (window.escapedCalls ?? 0) + 1;
  }, delay);

  useEffect(() => {
    window.escapedCalls = 0;
    window.escapedFn = debounced;
  }, [debounced]);

  return (
    <button type="button" data-testid="schedule" onClick={() => debounced()}>
      Schedule
    </button>
  );
};

/**
 * Flushes from a layout effect, which React runs before passive effects — so
 * the refs have not been updated with this render's callback yet.
 */
export const LayoutFlush = () => {
  const [count, setCount] = useState(1);
  const [seen, setSeen] = useState(0);
  const shouldFlush = useRef(false);

  const debounced = useDebouncyFn(() => setSeen(count), 1000);

  useLayoutEffect(() => {
    if (shouldFlush.current) {
      shouldFlush.current = false;
      debounced.flush();
    }
  });

  return (
    <div>
      <button
        type="button"
        data-testid="bump"
        onClick={() => {
          debounced();
          shouldFlush.current = true;
          setCount(2);
        }}
      >
        Bump
      </button>
      <div data-testid="seen">{seen}</div>
    </div>
  );
};
