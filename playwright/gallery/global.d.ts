/// <reference types="vite/client" />

declare global {
  interface Window {
    mount: (params: {
      story: string;
      props?: Record<string, unknown>;
    }) => Promise<void>;
    unmount: () => Promise<void>;
  }
}

export {};
