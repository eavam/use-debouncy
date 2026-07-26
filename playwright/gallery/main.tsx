import { type ComponentType, StrictMode } from 'react';
import { flushSync } from 'react-dom';
import { type Root, createRoot } from 'react-dom/client';

type StoryProps = Record<string, unknown>;
type StoryModule = Record<string, ComponentType<StoryProps>>;

// Vite analyzes this statically and relative to this file, so it has to stay inline
const stories = import.meta.glob<StoryModule>('../stories/**/*.story.tsx');

// Index the glob once at module load, so mount() is a map lookup rather than a
// scan: '../stories/effect.story.tsx' -> 'effect'
const loaders = new Map(
  Object.entries(stories).map(([file, load]) => [
    file.replace('../stories/', '').replace(/\.story\.\w+$/, ''),
    load,
  ]),
);

const resolve = async (storyId: string) => {
  const separator = storyId.lastIndexOf('/');
  const path = storyId.slice(0, separator);
  const name = storyId.slice(separator + 1);

  const load = loaders.get(path);

  // Two distinct errors: a wrong file and a wrong export fail in different
  // places and are fixed differently
  if (!load) {
    throw new Error(
      `Unknown story file "${path}". Known: ${[...loaders.keys()].join(', ')}`,
    );
  }

  const Story = (await load())[name];

  if (!Story) {
    throw new Error(`Story file "${path}" has no export named "${name}"`);
  }

  return Story;
};

const rootElement = document.getElementById('root');
let root: Root | undefined;

window.mount = async ({ story, props }) => {
  const Story = await resolve(story);

  if (!rootElement) {
    throw new Error('Gallery root element is missing');
  }

  // Reuse the root so update() reconciles instead of remounting, which is
  // what preserves component state between mount() calls
  const target = (root ??= createRoot(rootElement));

  // StrictMode matches how apps render and, in this dev server build, makes
  // React's double-invoked effects observable to the tests
  // flushSync so a render error rejects this promise rather than being swallowed
  flushSync(() => {
    target.render(
      <StrictMode>
        <Story {...props} />
      </StrictMode>,
    );
  });
};

window.unmount = async () => {
  root?.unmount();
  root = undefined;
};
