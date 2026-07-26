/// <reference types="vite/client" />

// No imports or exports here on purpose: this file stays a global script, so
// the interface below merges into the ambient Window type.
interface Window {
  mount: (params: {
    story: string;
    props?: Record<string, unknown>;
  }) => Promise<void>;
  unmount: () => Promise<void>;
  // Set by regression stories that hand their callback to the test
  escapedFn?: { flush: () => void; cancel: () => void };
  escapedCalls?: number;
}
