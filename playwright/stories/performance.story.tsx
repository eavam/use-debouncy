import { useCallback, useRef, useState } from 'react';
import { useDebouncyEffect } from '../../src';

export const MemoryLeakTestComponent = ({
  delay = 100,
}: { delay?: number }) => {
  const [value, setValue] = useState('');
  const [effectCalls, setEffectCalls] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useDebouncyEffect(
    () => {
      setEffectCalls((prev) => prev + 1);

      // Simulate creating resources that need cleanup
      intervalRef.current = setInterval(() => {}, 100);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    },
    delay,
    [value],
  );

  return (
    <div>
      <input
        data-testid="memory-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div data-testid="effect-calls">{effectCalls}</div>
      <div data-testid="current-value">{value}</div>
    </div>
  );
};

export const HighFrequencyComponent = ({ delay = 50 }: { delay?: number }) => {
  const [inputValue, setInputValue] = useState('');
  const [processedCount, setProcessedCount] = useState(0);
  const [lastProcessedValue, setLastProcessedValue] = useState('');

  const heavyComputation = useCallback((value: string) => {
    // Simulate expensive operation
    let result = value;
    for (let i = 0; i < 1000; i++) {
      result = result + String(i % 10);
    }
    setProcessedCount((prev) => prev + 1);
    setLastProcessedValue(value);
  }, []);

  useDebouncyEffect(
    () => {
      if (inputValue) {
        heavyComputation(inputValue);
      }
    },
    delay,
    [inputValue],
  );

  return (
    <div>
      <input
        data-testid="high-freq-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div data-testid="processed-count">{processedCount}</div>
      <div data-testid="last-processed">{lastProcessedValue}</div>
    </div>
  );
};

export const EdgeCaseDelayComponent = ({ delay = 0 }: { delay?: number }) => {
  const [value, setValue] = useState('');
  const [calls, setCalls] = useState(0);

  useDebouncyEffect(
    () => {
      setCalls((prev) => prev + 1);
    },
    delay,
    [value],
  );

  return (
    <div>
      <input
        data-testid="edge-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div data-testid="call-count">{calls}</div>
      <div data-testid="delay-value">{delay}</div>
    </div>
  );
};
