const assert = require('node:assert/strict');
const test = require('node:test');

test('resolves from CommonJS', () => {
  const pkg = require('use-debouncy');

  assert.equal(typeof pkg.useDebouncyEffect, 'function');
  assert.equal(typeof pkg.useDebouncyFn, 'function');
  assert.equal(typeof pkg.useDebouncyValue, 'function');
});
