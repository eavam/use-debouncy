import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { gzipSync } from 'node:zlib';

// Size is the reason people pick this package, so guard it against drift.
// Raise this deliberately, never to make a build pass.
const MAX_GZIP_BYTES = 700;

test('stays small', () => {
  const require = createRequire(import.meta.url);
  const packageRoot = dirname(require.resolve('use-debouncy/package.json'));
  const bundle = readFileSync(join(packageRoot, 'lib/index.js'));
  const gzipped = gzipSync(bundle).byteLength;

  assert.ok(
    gzipped <= MAX_GZIP_BYTES,
    `lib/index.js is ${gzipped} B gzipped, over the ${MAX_GZIP_BYTES} B budget`,
  );
});
