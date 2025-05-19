import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import commonjs from 'vite-plugin-commonjs';
import dts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  server: {
    port: 1234,
  },
  build: {
    lib: {
      // Entry point for the library build
      entry: resolve(__dirname, 'src/index.ts'),
      // Output formats: ES module and CommonJS
      formats: ['es', 'cjs'],
      // File naming convention based on the format
      fileName: (format) => `index.${format === 'es' ? 'es.js' : 'js'}`,
    },
    // Use Terser for minification to reduce bundle size
    minify: 'terser',
    terserOptions: {
      // Target ECMAScript 5 for compatibility with older environments
      ecma: 5,
      mangle: {
        properties: {
          // Preserve specific property names to avoid breaking React hooks
          reserved: ['useRef', 'useCallback', 'useEffect', 'current'],
        },
      },
    },
    // Generate source maps for easier debugging
    sourcemap: true,
    rollupOptions: {
      // Mark 'react' as an external dependency to avoid bundling it
      external: ['react'],
      output: {
        // Automatically determine the type of exports
        exports: 'auto',
        generatedCode: {
          // Use const bindings and shorthand object properties for cleaner output
          constBindings: true,
          objectShorthand: true,
        },
      },
    },
    // Output directory for the library build
    outDir: 'lib',
    // Clear the output directory before building
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
