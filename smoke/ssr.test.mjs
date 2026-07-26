import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import {
  useDebouncyEffect,
  useDebouncyFn,
  useDebouncyValue,
} from 'use-debouncy';

// No JSX here on purpose: the smoke package has no build step, so this file
// runs exactly as written against the published artifact.
const App = () => {
  const debounced = useDebouncyFn(() => {}, 100);
  const value = useDebouncyValue('server', 100);

  useDebouncyEffect(() => {}, 100, []);

  return createElement('input', { onChange: debounced, defaultValue: value });
};

test('renders on the server without touching browser globals', () => {
  const html = renderToString(createElement(App));

  assert.match(html, /^<input/);
  assert.match(html, /value="server"/);
});
