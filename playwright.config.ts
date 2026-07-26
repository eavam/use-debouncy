import { defineConfig, devices } from '@playwright/test';

/**
 * Component tests run against the story gallery served by the project's own
 * Vite dev server. See https://playwright.dev/docs/test-components
 */
const GALLERY_URL = 'http://localhost:3100/playwright/gallery/index.html';

export default defineConfig({
  testDir: './playwright/tests',
  /* Maximum time one test can run for. */
  timeout: 10 * 1000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',

  use: {
    /* mount() navigates here, so it must point at the gallery page. */
    baseURL: GALLERY_URL,
    /* Keep a service worker from shadowing page.route() mocks. */
    serviceWorkers: 'block',
    /* Reuse the browser context across tests in a worker, as the component
     * testing runtime used to do. */
    reuseContext: true,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'yarn vite',
    url: GALLERY_URL,
    reuseExistingServer: !process.env.CI,
  },
});
