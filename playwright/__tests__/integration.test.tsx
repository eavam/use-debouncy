import { expect, test } from '@playwright/experimental-ct-react';
import React from 'react';
import {
  ButtonClickComponent,
  FormValidationComponent,
  SearchComponent,
} from '../stories/testing-stories';

test.beforeEach(async ({ page }) => {
  await page.clock.install();
});

test.describe('Search functionality', () => {
  test('should debounce search requests correctly', async ({ mount, page }) => {
    const component = await mount(<SearchComponent searchDelay={300} />);
    const input = component.getByTestId('search-input');

    // Type search query
    await input.fill('React');

    // Should not search immediately
    await expect(component.getByTestId('search-count')).toHaveText('0');

    // Wait for debounce
    await page.clock.runFor(350);

    // Should have searched once
    await expect(component.getByTestId('search-count')).toHaveText('1');
    await expect(component.getByTestId('result-0')).toHaveText(
      'Result 1 for "React"',
    );
  });

  test('should handle rapid typing without excessive API calls', async ({
    mount,
    page,
  }) => {
    const component = await mount(<SearchComponent searchDelay={200} />);
    const input = component.getByTestId('search-input');

    // Simulate rapid typing with pressSequentially
    await input.pressSequentially('React', { delay: 50 });

    // Should not have made any searches yet
    await expect(component.getByTestId('search-count')).toHaveText('0');

    // Wait for debounce
    await page.clock.runFor(250);

    // Should have made only one search for final value
    await expect(component.getByTestId('search-count')).toHaveText('1');
    await expect(component.getByTestId('result-0')).toHaveText(
      'Result 1 for "React"',
    );
  });

  test('should clear results when search is cleared', async ({
    mount,
    page,
  }) => {
    const component = await mount(<SearchComponent />);
    const input = component.getByTestId('search-input');

    // Search for something
    await input.fill('Test');
    await page.clock.runFor(350);

    await expect(component.getByTestId('search-count')).toHaveText('1');
    await expect(component.getByTestId('result-0')).toBeVisible();

    // Clear search
    await input.clear();
    await page.clock.runFor(350);

    // Should have made another search call but results should be empty
    await expect(component.getByTestId('search-count')).toHaveText('2');
    await expect(component.getByTestId('result-0')).not.toBeVisible();
  });
});

test.describe('Button debouncing', () => {
  test('should prevent multiple rapid clicks', async ({ mount, page }) => {
    const component = await mount(<ButtonClickComponent clickDelay={500} />);
    const button = component.getByTestId('debounced-button');

    // Click rapidly multiple times
    await button.click();
    await page.clock.runFor(100);
    await button.click();
    await page.clock.runFor(100);
    await button.click();
    await page.clock.runFor(100);

    // Should not have incremented count yet
    await expect(component.getByTestId('click-count')).toHaveText('0');

    // Wait for debounce
    await page.clock.runFor(600);

    // Should have clicked only once
    await expect(component.getByTestId('click-count')).toHaveText('1');
  });

  test('should allow separate clicks after delay', async ({ mount, page }) => {
    const component = await mount(<ButtonClickComponent clickDelay={200} />);
    const button = component.getByTestId('debounced-button');

    // First click
    await button.click();
    await page.clock.runFor(250);

    await expect(component.getByTestId('click-count')).toHaveText('1');

    // Second click after delay
    await button.click();
    await page.clock.runFor(250);

    await expect(component.getByTestId('click-count')).toHaveText('2');
  });
});

test.describe('Form validation', () => {
  test('should debounce email validation', async ({ mount, page }) => {
    const component = await mount(<FormValidationComponent />);
    const input = component.getByTestId('email-input');

    // Type invalid email
    await input.fill('test@');

    // Should not validate immediately
    await expect(component.getByTestId('validation-count')).toHaveText('0');
    await expect(component.getByTestId('email-status')).toHaveText('none');

    // Wait for debounce
    await page.clock.runFor(550);

    // Should validate as invalid
    await expect(component.getByTestId('validation-count')).toHaveText('1');
    await expect(component.getByTestId('email-status')).toHaveText('invalid');

    // Complete valid email
    await input.fill('test@example.com');
    await page.clock.runFor(550);

    // Should validate as valid
    await expect(component.getByTestId('validation-count')).toHaveText('2');
    await expect(component.getByTestId('email-status')).toHaveText('valid');
  });

  test('should not validate while user is actively typing', async ({
    mount,
    page,
  }) => {
    const component = await mount(<FormValidationComponent />);
    const input = component.getByTestId('email-input');

    // Simulate continuous typing with pressSequentially
    await input.pressSequentially('test@ex', { delay: 100 });

    // Should not have validated during typing
    await expect(component.getByTestId('validation-count')).toHaveText('0');

    // Wait for typing to stop test
    await page.clock.runFor(550);

    // Now should validate
    await expect(component.getByTestId('validation-count')).toHaveText('1');
  });
});
