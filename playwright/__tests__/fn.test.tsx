import { expect, test } from '@playwright/experimental-ct-react';
import React from 'react';
import { DebounceFnTest } from '../stories/testing-stories';

test.beforeEach(async ({ page }) => {
  await page.clock.install();
});

test('should work with input changes', async ({ mount, page }) => {
  const component = await mount(<DebounceFnTest />);

  const input = component.getByTestId('input');

  await input.fill('Hello');

  await expect(component.getByTestId('input-value')).toHaveText('Hello');

  await expect(component.getByTestId('debounced-value')).toHaveText('');
  await expect(component.getByTestId('call-count')).toHaveText('0');

  await page.clock.runFor(150);

  await expect(component.getByTestId('debounced-value')).toHaveText('Hello');
  await expect(component.getByTestId('call-count')).toHaveText('1');

  await input.clear();
  await input.fill('Testing');

  await expect(component.getByTestId('input-value')).toHaveText('Testing');

  await expect(component.getByTestId('debounced-value')).toHaveText('Hello');

  await page.clock.runFor(150);

  await expect(component.getByTestId('debounced-value')).toHaveText('Testing');
  await expect(component.getByTestId('call-count')).toHaveText('2');
});

test('should debounce rapid input changes', async ({ mount, page }) => {
  const component = await mount(<DebounceFnTest delay={200} />);
  const input = component.getByTestId('input');

  // Simulate rapid typing with pressSequentially
  await input.pressSequentially('abcde', { delay: 50 });

  // Should not have called yet
  await expect(component.getByTestId('call-count')).toHaveText('0');
  await expect(component.getByTestId('debounced-value')).toHaveText('');

  // Wait for debounce
  await page.clock.runFor(250);

  // Should have called once with final value
  await expect(component.getByTestId('call-count')).toHaveText('1');
  await expect(component.getByTestId('debounced-value')).toHaveText('abcde');
});

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

  // Should handle empty string
  await expect(component.getByTestId('debounced-value')).toHaveText('');
  await expect(component.getByTestId('call-count')).toHaveText('2');
});

test('should work with different delay values', async ({ mount, page }) => {
  const component = await mount(<DebounceFnTest delay={300} />);
  const input = component.getByTestId('input');

  await input.fill('Test');

  // Should not call before delay
  await page.clock.runFor(200);
  await expect(component.getByTestId('call-count')).toHaveText('0');

  // Should call after delay
  await page.clock.runFor(150);
  await expect(component.getByTestId('call-count')).toHaveText('1');
  await expect(component.getByTestId('debounced-value')).toHaveText('Test');
});

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
