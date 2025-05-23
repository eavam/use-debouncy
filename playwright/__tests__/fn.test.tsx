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

  await new Promise((resolve) => setTimeout(resolve, 150));

  await expect(component.getByTestId('debounced-value')).toHaveText('Testing');
  await expect(component.getByTestId('call-count')).toHaveText('2');
});
