import { defineConfig } from 'tsup';

export default defineConfig({
  format: ['cjs', 'esm'],
  entry: ['src/index.ts'],
  dts: true,
  outDir: 'lib',
  minify: 'terser',
  clean: true,
  treeshake: true,
  terserOptions: {
    ecma: 5,
    compress: {
      booleans_as_integers: true,
    },
    mangle: {
      properties: {
        reserved: ['useRef', 'useCallback', 'useEffect', 'current'],
      },
    },
  },
});
