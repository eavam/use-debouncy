import { defineConfig } from 'vite';

// Serves the story gallery at /playwright/gallery/index.html for the
// component tests. Vite serves any .html under the project root, so the
// gallery needs no dedicated server or plugin.
export default defineConfig({
  server: {
    port: 3100,
    strictPort: true,
  },
});
