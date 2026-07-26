import { useCallback, useState } from 'react';
import { useDebouncyEffect } from '../../src/effect';
import { useDebouncyFn } from '../../src/fn';

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

    setSearchResults([
      `Result 1 for "${searchQuery}"`,
      `Result 2 for "${searchQuery}"`,
      `Result 3 for "${searchQuery}"`,
    ]);
    setIsLoading(false);
  }, []);

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
        {searchResults.map((result, index) => (
          <div key={result} data-testid={`result-${index}`}>
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

  const handleClick = useDebouncyFn(() => {
    setClickCount((prev) => prev + 1);
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
