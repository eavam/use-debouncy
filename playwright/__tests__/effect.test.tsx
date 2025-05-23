import { expect, test } from '@playwright/experimental-ct-react';
import React from 'react';
import { DebounceEffectTest } from '../stories/testing-stories';

test.beforeEach(async ({ page }) => {
  await page.clock.install();
});

test('should not call effect on initial render', async ({ mount }) => {
  const component = await mount(<DebounceEffectTest />);

  await expect(component.getByTestId('effect-calls')).toHaveText('0');
  await expect(component.getByTestId('effect-value')).toHaveText('');
});

test('should call effect after value change and delay', async ({
  mount,
  page,
}) => {
  const component = await mount(<DebounceEffectTest delay={100} />);

  const input = component.getByTestId('input');
  await input.fill('updated');

  await expect(component.getByTestId('effect-calls')).toHaveText('0');

  await page.clock.runFor(150);

  await expect(component.getByTestId('effect-calls')).toHaveText('1');
  await expect(component.getByTestId('effect-value')).toHaveText('updated');
});

test('should debounce multiple value changes', async ({ mount, page }) => {
  const component = await mount(<DebounceEffectTest delay={100} />);
  const input = component.getByTestId('input');

  await input.fill('first');
  await page.clock.runFor(20);

  await input.fill('second');
  await page.clock.runFor(20);

  await input.fill('third');
  await page.clock.runFor(20);

  await input.fill('final value');

  await expect(component.getByTestId('effect-calls')).toHaveText('0');

  await page.clock.runFor(150);

  await expect(component.getByTestId('effect-calls')).toHaveText('1');
  await expect(component.getByTestId('effect-value')).toHaveText('final value');
});

test('should work with user input', async ({ mount, page }) => {
  const component = await mount(<DebounceEffectTest delay={100} />);

  const input = component.getByTestId('input');

  await input.fill('Hello');

  await expect(component.getByTestId('current-value')).toHaveText('Hello');

  await expect(component.getByTestId('effect-calls')).toHaveText('0');

  await page.clock.runFor(150);

  await expect(component.getByTestId('effect-calls')).toHaveText('1');
  await expect(component.getByTestId('effect-value')).toHaveText('Hello');

  await input.clear();
  await input.fill('Test');

  await expect(component.getByTestId('current-value')).toHaveText('Test');

  await expect(component.getByTestId('effect-calls')).toHaveText('1');

  await page.clock.runFor(150);

  await expect(component.getByTestId('effect-calls')).toHaveText('2');
  await expect(component.getByTestId('effect-value')).toHaveText('Test');
});

test('should handle rapid successive input changes', async ({
  mount,
  page,
}) => {
  const component = await mount(<DebounceEffectTest delay={200} />);
  const input = component.getByTestId('input');

  // Simulate typing with pressSequentially
  await input.pressSequentially('abcd', { delay: 50 });

  await expect(component.getByTestId('effect-calls')).toHaveText('0');

  await page.clock.runFor(250);

  await expect(component.getByTestId('effect-calls')).toHaveText('1');
  await expect(component.getByTestId('effect-value')).toHaveText('abcd');
});

test('should cancel effect on component unmount', async ({ mount, page }) => {
  const component = await mount(<DebounceEffectTest delay={100} />);
  const input = component.getByTestId('input');

  await input.fill('test');

  await component.unmount();

  await page.clock.runFor(150);
});
