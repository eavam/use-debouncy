import Dts from 'unplugin-dts/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  // Serves the story gallery at /playwright/gallery/index.html for the
  // component tests. Vite serves any .html under the project root, so the
  // gallery needs no dedicated server or plugin.
  server: {
    port: 3100,
    strictPort: true,
  },
  plugins: [Dts({ include: ['src'], bundleTypes: true })],
  build: {
    outDir: 'lib',
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: ['react'],
    },
  },
});
