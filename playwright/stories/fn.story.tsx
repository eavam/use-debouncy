import { type ChangeEvent, useCallback, useState } from 'react';
import { useDebouncyFn } from '../../src/fn';

export const DebounceFnTest = ({ delay = 100 }: { delay?: number }) => {
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [callCount, setCallCount] = useState(0);

  const debouncedSetValue = useDebouncyFn((value: string) => {
    setDebouncedValue(value);
    setCallCount((prev) => prev + 1);
  }, delay);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      debouncedSetValue(value);
    },
    [debouncedSetValue],
  );

  return (
    <div>
      <input
        type="text"
        data-testid="input"
        value={inputValue}
        onChange={handleInputChange}
      />
      <div data-testid="input-value">{inputValue}</div>
      <div data-testid="debounced-value">{debouncedValue}</div>
      <div data-testid="call-count">{callCount}</div>
    </div>
  );
};

export const FunctionParameterComponent = () => {
  const [results, setResults] = useState<string[]>([]);
  const [callCount, setCallCount] = useState(0);

  const debouncedFunction = useDebouncyFn(
    (str: string, num: number, obj: { key: string }, arr: number[]) => {
      setCallCount((prev) => prev + 1);
      setResults((prev) => [
        ...prev,
        `${str}-${num}-${obj.key}-${arr.join(',')}`,
      ]);
    },
    100,
  );

  const triggerCall = () => {
    debouncedFunction('test', 42, { key: 'value' }, [1, 2, 3]);
  };

  return (
    <div>
      <button type="button" data-testid="trigger-params" onClick={triggerCall}>
        Trigger with params
      </button>
      <div data-testid="param-call-count">{callCount}</div>
      <div data-testid="param-results">
        {results.map((result, index) => (
          <div key={result} data-testid={`param-result-${index}`}>
            {result}
          </div>
        ))}
      </div>
    </div>
  );
};
