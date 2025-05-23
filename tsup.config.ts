import { defineConfig } from 'tsup';

export default defineConfig({
  format: ['cjs', 'esm'],
  entry: ['src/index.ts'],
  dts: true,
  outDir: 'lib',
  minify: 'terser',
  terserOptions: {
    ecma: 5,
    mangle: {
      properties: {
        // Preserve specific property names to avoid breaking React hooks
        reserved: ['useRef', 'useCallback', 'useEffect', 'current'],
      },
    },
  },
  clean: true,
});
