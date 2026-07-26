import { test as base } from '@playwright/test';

/**
 * Every spec that advances time drives `requestAnimationFrame` and
 * `performance.now` through Playwright's fake clock, so it has to be installed
 * before `mount()` navigates. An auto fixture does that once for all of them.
 *
 * `search.test.ts` types at a real speed against a routed API and deliberately
 * imports from `@playwright/test` instead.
 */
export const test = base.extend<{ fakeClock: void }>({
  fakeClock: [
    async ({ page }, use) => {
      await page.clock.install();
      await use();
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
