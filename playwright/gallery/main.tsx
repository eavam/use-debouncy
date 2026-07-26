import type { ComponentType } from 'react';
import { flushSync } from 'react-dom';
import { type Root, createRoot } from 'react-dom/client';

type StoryProps = Record<string, unknown>;
type StoryModule = Record<string, ComponentType<StoryProps>>;

// Vite analyzes this statically and relative to this file, so it has to stay inline
const stories = import.meta.glob<StoryModule>('../stories/**/*.story.tsx');

const idOf = (file: string) =>
  file.replace(/^(\.\.\/)+stories\//, '').replace(/\.story\.\w+$/, '');

const resolve = async (storyId: string) => {
  const separator = storyId.lastIndexOf('/');
  const path = storyId.slice(0, separator);
  const name = storyId.slice(separator + 1);

  const file = Object.keys(stories).find(
    (candidate) =>
      idOf(candidate) === path || idOf(candidate).endsWith(`/${path}`),
  );

  const module = file ? await stories[file]() : undefined;

  return module?.[name] ?? module?.default;
};

const rootElement = document.getElementById('root');
let root: Root | undefined;

window.mount = async ({ story, props }) => {
  const Story = await resolve(story);

  if (!Story) {
    throw new Error(`Unknown story: ${story}`);
  }

  if (!rootElement) {
    throw new Error('Gallery root element is missing');
  }

  // Reuse the root so update() reconciles instead of remounting, which is
  // what preserves component state between mount() calls
  root ??= createRoot(rootElement);

  // flushSync so a render error rejects this promise rather than being swallowed
  flushSync(() => {
    root?.render(<Story {...props} />);
  });
};

window.unmount = async () => {
  root?.unmount();
  root = undefined;
};
