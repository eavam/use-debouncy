import { useState } from 'react';
import { useDebouncyFn, useDebouncyValue } from '../../src';

export const DebouncyValue = ({ delay = 100 }: { delay?: number }) => {
  const [value, setValue] = useState('');
  const debounced = useDebouncyValue(value, delay);

  return (
    <div>
      <input
        data-testid="input"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <div data-testid="value">{value}</div>
      <div data-testid="debounced">{debounced}</div>
    </div>
  );
};

export const FnControls = ({ delay = 200 }: { delay?: number }) => {
  const [calls, setCalls] = useState(0);
  const [lastValue, setLastValue] = useState('none');

  const debounced = useDebouncyFn((value: string) => {
    setCalls((prev) => prev + 1);
    setLastValue(value);
  }, delay);

  return (
    <div>
      <button
        type="button"
        data-testid="schedule"
        onClick={() => debounced('scheduled')}
      >
        Schedule
      </button>
      <button
        type="button"
        data-testid="cancel"
        onClick={() => debounced.cancel()}
      >
        Cancel
      </button>
      <button
        type="button"
        data-testid="flush"
        onClick={() => debounced.flush()}
      >
        Flush
      </button>
      <div data-testid="calls">{calls}</div>
      <div data-testid="last-value">{lastValue}</div>
    </div>
  );
};
