import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

test('resolves from ESM', async () => {
  const pkg = await import('use-debouncy');

  assert.equal(typeof pkg.useDebouncyEffect, 'function');
  assert.equal(typeof pkg.useDebouncyFn, 'function');
  assert.equal(typeof pkg.useDebouncyValue, 'function');
});

test('serves ESM to import and CommonJS to require', async () => {
  const require = createRequire(import.meta.url);

  assert.match(import.meta.resolve('use-debouncy'), /index\.js$/);
  assert.match(require.resolve('use-debouncy'), /index\.cjs$/);
});
