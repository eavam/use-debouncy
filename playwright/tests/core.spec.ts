import { expect, test } from '@playwright/test';
import type { AnimationFrameTest } from '../stories/core.story';

test.beforeEach(async ({ page }) => {
  await page.clock.install();
});

/**
 * Test basic functionality of useAnimationFrame hook
 */
test('should call callback after timer end', async ({ mount, page }) => {
  const component = await mount<typeof AnimationFrameTest>(
    'core/AnimationFrameTest',
    { delay: 100 },
  );

  await expect(component.getByTestId('call-count')).toHaveText('0');

  await component.getByTestId('trigger').click();

  await page.clock.runFor(1000);

  await expect(component.getByTestId('call-count')).toHaveText('1');
});

/**
 * Test cancellation behavior - rapid triggers should cancel previous ones
 */
test('should cancel previous animation before starting new one', async ({
  mount,
  page,
}) => {
  const component = await mount<typeof AnimationFrameTest>(
    'core/AnimationFrameTest',
    { delay: 100 },
  );

  const button = component.getByTestId('trigger');

  // Trigger multiple times rapidly
  for (let i = 0; i < 5; i++) {
    await button.click();
  }

  await page.clock.runFor(200);

  // Only the last trigger survives
  await expect(component.getByTestId('call-count')).toHaveText('1');
});

/**
 * Test zero delay edge case
 */
test('should handle zero delay', async ({ mount, page }) => {
  const component = await mount<typeof AnimationFrameTest>(
    'core/AnimationFrameTest',
    { delay: 0 },
  );

  await component.getByTestId('trigger').click();

  // With zero delay, should execute on next animation frame
  await page.clock.runFor(20);

  await expect(component.getByTestId('call-count')).toHaveText('1');
});

/**
 * Test rapid clicking behavior
 */
test('should handle multiple rapid clicks correctly', async ({
  mount,
  page,
}) => {
  const component = await mount<typeof AnimationFrameTest>(
    'core/AnimationFrameTest',
    { delay: 200 },
  );
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

/**
 * Test longer delay values
 */
test('should work with longer delays', async ({ mount, page }) => {
  const component = await mount<typeof AnimationFrameTest>(
    'core/AnimationFrameTest',
    { delay: 500 },
  );

  await component.getByTestId('trigger').click();

  // Should not call before delay
  await page.clock.runFor(400);
  await expect(component.getByTestId('call-count')).toHaveText('0');

  // Should call after delay
  await page.clock.runFor(200);
  await expect(component.getByTestId('call-count')).toHaveText('1');
});

/**
 * Test cleanup on unmount to prevent memory leaks
 */
test('should cleanup on component unmount', async ({ mount, page }) => {
  const component = await mount<typeof AnimationFrameTest>(
    'core/AnimationFrameTest',
    { delay: 100 },
  );

  await component.getByTestId('trigger').click();

  // Unmount component before animation completes
  await component.unmount();

  // Wait for the delay to pass - the pending frame must not fire
  await page.clock.runFor(150);
});

/**
 * Test negative delay edge case
 */
test('should handle negative delay as zero', async ({ mount, page }) => {
  const component = await mount<typeof AnimationFrameTest>(
    'core/AnimationFrameTest',
    { delay: -100 },
  );

  await component.getByTestId('trigger').click();

  // Negative delay should be treated as immediate
  await page.clock.runFor(20);

  await expect(component.getByTestId('call-count')).toHaveText('1');
});
