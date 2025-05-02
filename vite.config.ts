import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react';
import commonjs from 'vite-plugin-commonjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: './tests/app',
  server: {
    port: 1234,
  },
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
    react(),
    commonjs(),
    dts({
      outDir: 'lib',
      exclude: ['**/__tests__/**'],
    }),
  ],
});
