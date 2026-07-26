import { type Page, expect, test } from '@playwright/test';

// A regexp, not a glob: glob URL matching does not match this URL shape, which
// would silently disable the interception and let the tests hit the real API
const API_URL = /swapi\.dev/;
const SEARCH_INPUT_EFFECT = 'input/search/effect';
const SEARCH_INPUT_FN = 'input/search/fn';

/**
 * Integration test helper to verify debounced input behavior with API calls
 * Tests that inputs are properly debounced and API requests are made correctly
 */
async function performInputTest(page: Page, testId: string) {
  const input = page.getByTestId(testId);

  // Wait for the first request and start typing 'Dar' with realistic typing speed
  const firstResponsePromise = page.waitForRequest(API_URL);
  await input.pressSequentially('Dar', { delay: 100 });
  const firstResponse = await firstResponsePromise;

  // Wait for the second request and type 'Dart Vader' with realistic typing
  const secondResponsePromise = page.waitForRequest(API_URL);
  await input.pressSequentially('t Vader', { delay: 100 });
  const secondResponse = await secondResponsePromise;

  // Wait for the third request and clear the input field
  const thirdResponsePromise = page.waitForRequest(API_URL);
  await input.fill('');
  const thirdResponse = await thirdResponsePromise;

  expect(firstResponse.url()).toContain(encodeURIComponent('Dar'));
  expect(secondResponse.url()).toContain(encodeURIComponent('Dart Vader'));
  expect(thirdResponse.url()).toMatch(/search=$/);
}

test.beforeEach(async ({ page }) => {
  // Routes must be registered before mount(), which navigates
  await page.route(API_URL, async (route) => {
    await route.fulfill({ body: JSON.stringify({ results: [] }) });
  });
});

/**
 * Integration test for useDebouncyEffect hook
 */
test('input with effect', async ({ mount, page }) => {
  await mount('search/SearchPeoplesWithEffect');
  await performInputTest(page, SEARCH_INPUT_EFFECT);
});

/**
 * Integration test for useDebouncyFn hook
 */
test('input with fn', async ({ mount, page }) => {
  await mount('search/SearchPeoplesWithFn');
  await performInputTest(page, SEARCH_INPUT_FN);
});
