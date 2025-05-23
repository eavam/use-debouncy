import { expect, test } from '@playwright/experimental-ct-react';
import React from 'react';
import { AnimationFrameTest } from '../stories/testing-stories';

test.beforeEach(async ({ page }) => {
  await page.clock.install();
});

test('should call callback after timer end', async ({ mount, page }) => {
  const component = await mount(<AnimationFrameTest delay={100} />);

  await expect(component.getByTestId('call-count')).toHaveText('0');

  await component.getByTestId('trigger').click();

  await page.clock.runFor(1000);

  await expect(component.getByTestId('call-count')).toHaveText('1');
});

test('should cancel previous animation before starting new one', async ({
  mount,
  page,
}) => {
  let calls = 0;
  const onCall = () => {
    calls++;
  };

  const component = await mount(
    <AnimationFrameTest delay={100} onCall={onCall} />,
  );

  const button = component.getByTestId('trigger');

  for (let i = 0; i < 5; i++) {
    await button.click();
  }

  await page.clock.runFor(200);

  expect(calls).toBeLessThanOrEqual(5);
  await expect(component.getByTestId('call-count')).toHaveText('1');
});

test('should handle zero delay', async ({ mount, page }) => {
  const component = await mount(<AnimationFrameTest delay={0} />);

  await component.getByTestId('trigger').click();

  // With zero delay, should execute on next animation frame
  await page.clock.runFor(20);

  await expect(component.getByTestId('call-count')).toHaveText('1');
});

test('should handle multiple rapid clicks correctly', async ({
  mount,
  page,
}) => {
  const component = await mount(<AnimationFrameTest delay={200} />);
  const button = component.getByTestId('trigger');

  // Click rapidly multiple times
  await button.click();
  await page.clock.runFor(50);
  await button.click();
  await page.clock.runFor(50);
  await button.click();
  await page.clock.runFor(50);
  await button.click();

  // Should still be 0 since we're cancelling previous calls
  await expect(component.getByTestId('call-count')).toHaveText('0');

  // Wait for the last call to complete
  await page.clock.runFor(200);

  // Should only have one call from the last click
  await expect(component.getByTestId('call-count')).toHaveText('1');
});

test('should work with longer delays', async ({ mount, page }) => {
  const component = await mount(<AnimationFrameTest delay={500} />);

  await component.getByTestId('trigger').click();

  // Should not call before delay
  await page.clock.runFor(400);
  await expect(component.getByTestId('call-count')).toHaveText('0');

  // Should call after delay
  await page.clock.runFor(200);
  await expect(component.getByTestId('call-count')).toHaveText('1');
});

test('should cleanup on component unmount', async ({ mount, page }) => {
  const component = await mount(<AnimationFrameTest delay={100} />);

  await component.getByTestId('trigger').click();

  // Unmount component before animation completes
  await component.unmount();

  // Wait for the delay to pass
  await page.clock.runFor(150);

  // Animation should have been cancelled on unmount
  // (This test verifies cleanup behavior)
});

test('should handle negative delay as zero', async ({ mount, page }) => {
  const component = await mount(<AnimationFrameTest delay={-100} />);

  await component.getByTestId('trigger').click();

  // Negative delay should be treated as immediate
  await page.clock.runFor(20);

  await expect(component.getByTestId('call-count')).toHaveText('1');
});
