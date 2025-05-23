import { expect, test } from '@playwright/experimental-ct-react';
import React from 'react';
import { DebounceFnTest } from '../stories/testing-stories';

test.beforeEach(async ({ page }) => {
  await page.clock.install();
});

/**
 * Test basic functionality of useDebouncyFn hook
 * Verifies that function calls are properly debounced and state updates correctly
 */
test('should work with input changes', async ({ mount, page }) => {
  const component = await mount(<DebounceFnTest />);

  const input = component.getByTestId('input');

  await input.fill('Hello');

  // Input state should update immediately
  await expect(component.getByTestId('input-value')).toHaveText('Hello');

  // Debounced function should not be called yet
  await expect(component.getByTestId('debounced-value')).toHaveText('');
  await expect(component.getByTestId('call-count')).toHaveText('0');

  await page.clock.runFor(150);

  // After delay, debounced function should be called
  await expect(component.getByTestId('debounced-value')).toHaveText('Hello');
  await expect(component.getByTestId('call-count')).toHaveText('1');

  // Test second input change
  await input.clear();
  await input.fill('Testing');

  await expect(component.getByTestId('input-value')).toHaveText('Testing');

  // Previous debounced value should remain until new call
  await expect(component.getByTestId('debounced-value')).toHaveText('Hello');

  await page.clock.runFor(150);

  // Function should be called again with new value
  await expect(component.getByTestId('debounced-value')).toHaveText('Testing');
  await expect(component.getByTestId('call-count')).toHaveText('2');
});

/**
 * Test rapid input handling with pressSequentially API
 * Ensures only the final value triggers the debounced function
 */
test('should debounce rapid input changes', async ({ mount, page }) => {
  const component = await mount(<DebounceFnTest delay={200} />);
  const input = component.getByTestId('input');

  // Simulate rapid realistic typing
  await input.pressSequentially('abcde', { delay: 50 });

  // Function should not be called during rapid typing
  await expect(component.getByTestId('call-count')).toHaveText('0');
  await expect(component.getByTestId('debounced-value')).toHaveText('');

  // Wait for debounce delay
  await page.clock.runFor(250);

  // Function should be called only once with final value
  await expect(component.getByTestId('call-count')).toHaveText('1');
  await expect(component.getByTestId('debounced-value')).toHaveText('abcde');
});

/**
 * Test edge case handling with empty input values
 * Verifies that empty strings are handled correctly by the debounced function
 */
test('should handle empty input correctly', async ({ mount, page }) => {
  const component = await mount(<DebounceFnTest />);
  const input = component.getByTestId('input');

  // Start with some text
  await input.fill('Hello');
  await page.clock.runFor(150);

  await expect(component.getByTestId('debounced-value')).toHaveText('Hello');
  await expect(component.getByTestId('call-count')).toHaveText('1');

  // Clear the input
  await input.clear();
  await page.clock.runFor(150);

  // Should handle empty string correctly
  await expect(component.getByTestId('debounced-value')).toHaveText('');
  await expect(component.getByTestId('call-count')).toHaveText('2');
});

/**
 * Test different delay values to ensure flexibility
 */
test('should work with different delay values', async ({ mount, page }) => {
  const component = await mount(<DebounceFnTest delay={300} />);
  const input = component.getByTestId('input');

  await input.fill('Test');

  // Should not call before delay period
  await page.clock.runFor(200);
  await expect(component.getByTestId('call-count')).toHaveText('0');

  // Should call after full delay period
  await page.clock.runFor(150);
  await expect(component.getByTestId('call-count')).toHaveText('1');
  await expect(component.getByTestId('debounced-value')).toHaveText('Test');
});

/**
 * Test that function arguments are preserved correctly
 * Important for ensuring data integrity in debounced operations
 */
test('should preserve function arguments', async ({ mount, page }) => {
  const component = await mount(<DebounceFnTest />);
  const input = component.getByTestId('input');

  // Test with special characters and spaces
  const testValue = 'Test with spaces & symbols!';
  await input.fill(testValue);
  await page.clock.runFor(150);

  await expect(component.getByTestId('debounced-value')).toHaveText(testValue);
  await expect(component.getByTestId('call-count')).toHaveText('1');
});
