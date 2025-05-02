import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'es.js' : 'js'}`,
    },
    minify: 'terser',
    terserOptions: {
      ecma: 5,
      mangle: {
        properties: {
          reserved: ['useRef', 'useCallback', 'useEffect', 'current'],
        },
      },
    },
    sourcemap: true,
    rollupOptions: {
      external: ['react'],
      output: {
        exports: 'auto',
        generatedCode: {
          constBindings: true,
          objectShorthand: true,
        },
      },
    },
    outDir: 'lib',
    emptyOutDir: true,
  },
  plugins: [
    dts({
      outDir: 'lib',
      exclude: ['**/__tests__/**'],
    }),
  ],
});
