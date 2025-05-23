import React, { useState, useCallback } from 'react';
import { useAnimationFrame } from '../../src/core';
import { useDebouncyEffect } from '../../src/effect';
import { useDebouncyFn } from '../../src/fn';

export const AnimationFrameTest = ({
  delay = 100,
  onCall,
}: { delay?: number; onCall?: () => void }) => {
  const [callCount, setCallCount] = useState(0);

  const callback = useCallback(() => {
    setCallCount((prev) => prev + 1);
    if (onCall) onCall();
  }, [onCall]);

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

export const DebounceEffectTest = ({ delay = 100 }: { delay?: number }) => {
  const [inputValue, setInputValue] = useState('');
  const [effectCalls, setEffectCalls] = useState(0);
  const [effectValue, setEffectValue] = useState('');

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    [],
  );

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

export const DebounceFnTest = ({ delay = 100 }: { delay?: number }) => {
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [callCount, setCallCount] = useState(0);

  const debouncedSetValue = useDebouncyFn((value: string) => {
    setDebouncedValue(value);
    setCallCount((prev) => prev + 1);
  }, delay);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
