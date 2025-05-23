import { expect, test } from '@playwright/experimental-ct-react';
import React from 'react';
import { DebounceEffectTest } from '../stories/testing-stories';

test.beforeEach(async ({ page }) => {
  await page.clock.install();
});

/**
 * Test that useDebouncyEffect doesn't trigger on initial component render
 * This is important behavior to prevent unwanted side effects on mount
 */
test('should not call effect on initial render', async ({ mount }) => {
  const component = await mount(<DebounceEffectTest />);

  await expect(component.getByTestId('effect-calls')).toHaveText('0');
  await expect(component.getByTestId('effect-value')).toHaveText('');
});

/**
 * Test basic debouncing functionality - effect should only fire after delay
 */
test('should call effect after value change and delay', async ({
  mount,
  page,
}) => {
  const component = await mount(<DebounceEffectTest delay={100} />);

  const input = component.getByTestId('input');
  await input.fill('updated');

  // Effect should not trigger immediately
  await expect(component.getByTestId('effect-calls')).toHaveText('0');

  await page.clock.runFor(150);

  // Effect should trigger after delay
  await expect(component.getByTestId('effect-calls')).toHaveText('1');
  await expect(component.getByTestId('effect-value')).toHaveText('updated');
});

/**
 * Test debouncing behavior with rapid successive changes
 * Only the final value should trigger the effect, not intermediate values
 */
test('should debounce multiple value changes', async ({ mount, page }) => {
  const component = await mount(<DebounceEffectTest delay={100} />);
  const input = component.getByTestId('input');

  // Make multiple rapid changes
  await input.fill('first');
  await page.clock.runFor(20);

  await input.fill('second');
  await page.clock.runFor(20);

  await input.fill('third');
  await page.clock.runFor(20);

  await input.fill('final value');

  // No effect should have triggered yet
  await expect(component.getByTestId('effect-calls')).toHaveText('0');

  await page.clock.runFor(150);

  // Effect should trigger only once with the final value
  await expect(component.getByTestId('effect-calls')).toHaveText('1');
  await expect(component.getByTestId('effect-value')).toHaveText('final value');
});

/**
 * Test realistic user input scenarios with multiple edits
 */
test('should work with user input', async ({ mount, page }) => {
  const component = await mount(<DebounceEffectTest delay={100} />);

  const input = component.getByTestId('input');

  await input.fill('Hello');

  // Current value should update immediately
  await expect(component.getByTestId('current-value')).toHaveText('Hello');

  // Effect should not trigger immediately
  await expect(component.getByTestId('effect-calls')).toHaveText('0');

  await page.clock.runFor(150);

  // Effect should trigger after delay
  await expect(component.getByTestId('effect-calls')).toHaveText('1');
  await expect(component.getByTestId('effect-value')).toHaveText('Hello');

  // Test second input change
  await input.clear();
  await input.fill('Test');

  await expect(component.getByTestId('current-value')).toHaveText('Test');

  // Effect count should remain the same until delay passes
  await expect(component.getByTestId('effect-calls')).toHaveText('1');

  await page.clock.runFor(150);

  // Effect should trigger again with new value
  await expect(component.getByTestId('effect-calls')).toHaveText('2');
  await expect(component.getByTestId('effect-value')).toHaveText('Test');
});

/**
 * Test rapid typing simulation using modern pressSequentially API
 * This simulates more realistic user typing behavior
 */
test('should handle rapid successive input changes', async ({
  mount,
  page,
}) => {
  const component = await mount(<DebounceEffectTest delay={200} />);
  const input = component.getByTestId('input');

  // Simulate realistic typing with pressSequentially
  await input.pressSequentially('abcd', { delay: 50 });

  // Effect should not trigger during typing
  await expect(component.getByTestId('effect-calls')).toHaveText('0');

  await page.clock.runFor(250);

  // Effect should trigger once with final typed value
  await expect(component.getByTestId('effect-calls')).toHaveText('1');
  await expect(component.getByTestId('effect-value')).toHaveText('abcd');
});

/**
 * Test cleanup behavior when component unmounts
 * This ensures no memory leaks or unwanted effects after unmount
 */
test('should cancel effect on component unmount', async ({ mount, page }) => {
  const component = await mount(<DebounceEffectTest delay={100} />);
  const input = component.getByTestId('input');

  await input.fill('test');

  // Unmount before effect triggers
  await component.unmount();

  // Wait past the delay - effect should not trigger
  await page.clock.runFor(150);

  // Test passes if no errors occur (effect was properly cancelled)
});
