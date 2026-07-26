import { type ChangeEvent, useCallback, useState } from 'react';
import { useDebouncyEffect } from '../../src';

export const DebounceEffectTest = ({ delay = 100 }: { delay?: number }) => {
  const [inputValue, setInputValue] = useState('');
  const [effectCalls, setEffectCalls] = useState(0);
  const [effectValue, setEffectValue] = useState('');

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  useDebouncyEffect(
    () => {
      setEffectCalls((prev) => prev + 1);
      setEffectValue(inputValue);
    },
    delay,
    [inputValue],
  );

  return (
    <div>
      <input
        type="text"
        data-testid="input"
        value={inputValue}
        onChange={handleInputChange}
      />
      <div data-testid="effect-calls">{effectCalls}</div>
      <div data-testid="effect-value">{effectValue}</div>
      <div data-testid="current-value">{inputValue}</div>
    </div>
  );
};
