import React, { useState, useCallback, useRef } from 'react';
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

// Integration test components
export const SearchComponent = ({
  searchDelay = 300,
}: { searchDelay?: number }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [searchCount, setSearchCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate API search function
  const performSearch = useCallback(async (searchQuery: string) => {
    setSearchCount((prev) => prev + 1);

    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Mock search results
    const results = [
      `Result 1 for "${searchQuery}"`,
      `Result 2 for "${searchQuery}"`,
      `Result 3 for "${searchQuery}"`,
    ];

    setSearchResults(results);
    setIsLoading(false);
  }, []);

  // Use debounced effect for search
  useDebouncyEffect(
    () => {
      performSearch(query);
    },
    searchDelay,
    [query],
  );

  return (
    <div>
      <input
        data-testid="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <div data-testid="search-count">{searchCount}</div>
      <div data-testid="is-loading">{isLoading ? 'loading' : 'idle'}</div>
      <div data-testid="results-container">
        {searchResults.map((result) => (
          <div
            key={result}
            data-testid={`result-${searchResults.indexOf(result)}`}
          >
            {result}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ButtonClickComponent = ({
  clickDelay = 1000,
}: { clickDelay?: number }) => {
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState<string>('');

  const handleClick = useDebouncyFn(() => {
    setClickCount((prev) => prev + 1);
    setLastClickTime(new Date().toISOString());
  }, clickDelay);

  return (
    <div>
      <button
        type="button"
        data-testid="debounced-button"
        onClick={handleClick}
      >
        Click me
      </button>
      <div data-testid="click-count">{clickCount}</div>
      <div data-testid="last-click-time">{lastClickTime}</div>
    </div>
  );
};

export const FormValidationComponent = () => {
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [validationCount, setValidationCount] = useState(0);

  const validateEmail = useCallback((emailValue: string) => {
    setValidationCount((prev) => prev + 1);
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
    setEmailValid(emailValue ? isValid : null);
  }, []);

  useDebouncyEffect(
    () => {
      validateEmail(email);
    },
    500,
    [email],
  );

  return (
    <div>
      <input
        data-testid="email-input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
      />
      <div data-testid="validation-count">{validationCount}</div>
      <div data-testid="email-status">
        {emailValid === null ? 'none' : emailValid ? 'valid' : 'invalid'}
      </div>
    </div>
  );
};

// Performance test components
export const MemoryLeakTestComponent = ({
  delay = 100,
}: { delay?: number }) => {
  const [value, setValue] = useState('');
  const [effectCalls, setEffectCalls] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  useDebouncyEffect(
    () => {
      setEffectCalls((prev) => prev + 1);

      // Simulate creating resources that need cleanup
      intervalRef.current = setInterval(() => {
        // This would cause memory leak if not cleaned up
      }, 100);

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
        {results.map((result) => (
          <div
            key={result}
            data-testid={`param-result-${results.indexOf(result)}`}
          >
            {result}
          </div>
        ))}
      </div>
    </div>
  );
};
