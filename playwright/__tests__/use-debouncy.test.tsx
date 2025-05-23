import { expect, test } from '@playwright/experimental-ct-react';
import type { Page } from '@playwright/test';
import React from 'react';
import { App } from '../app/src';

const API_URL = '*/**/swapi.dev/**/*';
const SEARCH_INPUT_EFFECT = 'input/search/effect';
const SEARCH_INPUT_FN = 'input/search/fn';

async function performInputTest(page: Page, testId: string) {
  // Wait for the input element based on the provided selector.
  const input = page.getByTestId(testId);

  // Wait for the first request and start typing 'Dar'.
  const firstResponsePromise = page.waitForRequest(API_URL);
  await input.type('Dar', { delay: 100 });
  const firstResponse = await firstResponsePromise;

  // Wait for the second request and type 'Dart Vader'.
  const secondResponsePromise = page.waitForRequest(API_URL);
  await input.type('Dart Vader', { delay: 300 });
  const secondResponse = await secondResponsePromise;

  // Wait for the third request and clear the input field by filling it with an empty value.
  const thirdResponsePromise = page.waitForRequest(API_URL);
  await input.fill('');
  const thirdResponse = await thirdResponsePromise;

  // Check that request URLs match the expected values.
  expect(firstResponse.url()).toContain(encodeURIComponent('Dar'));
  expect(secondResponse.url()).toContain(encodeURIComponent('Dart Vader'));
  expect(thirdResponse.url()).toMatch(/search=$/);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');

  // Intercept requests to API_URL and respond with an empty body.
  await page.route(API_URL, async (route) => {
    await route.fulfill({ body: '' });
  });
});

test('input with effect', async ({ mount, page }) => {
  await mount(<App />);
  await performInputTest(page, SEARCH_INPUT_EFFECT);
});

test('input with fn', async ({ mount, page }) => {
  await mount(<App />);
  await performInputTest(page, SEARCH_INPUT_FN);
});
