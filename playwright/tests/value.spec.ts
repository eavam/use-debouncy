import { expect, test } from '@playwright/test';
import type { DebouncyValue, FnControls } from '../stories/value.story';

test.beforeEach(async ({ page }) => {
  await page.clock.install();
});

test.describe('useDebouncyValue', () => {
  test('should return the value as is on the first render', async ({
    mount,
  }) => {
    const component = await mount<typeof DebouncyValue>('value/DebouncyValue');

    await expect(component.getByTestId('debounced')).toHaveText('');
  });

  test('should update only after the value stops changing', async ({
    mount,
    page,
  }) => {
    const component = await mount<typeof DebouncyValue>('value/DebouncyValue', {
      delay: 100,
    });
    const input = component.getByTestId('input');

    await input.fill('re');
    await page.clock.runFor(50);
    await input.fill('react');

    // The source value updates immediately, the debounced copy does not
    await expect(component.getByTestId('value')).toHaveText('react');
    await expect(component.getByTestId('debounced')).toHaveText('');

    await page.clock.runFor(150);

    await expect(component.getByTestId('debounced')).toHaveText('react');
  });
});

test.describe('cancel and flush', () => {
  test('should drop the pending call on cancel', async ({ mount, page }) => {
    const component = await mount<typeof FnControls>('value/FnControls', {
      delay: 200,
    });

    await component.getByTestId('schedule').click();
    await component.getByTestId('cancel').click();

    await page.clock.runFor(400);

    await expect(component.getByTestId('calls')).toHaveText('0');
    await expect(component.getByTestId('last-value')).toHaveText('none');
  });

  test('should run the pending call immediately on flush', async ({
    mount,
    page,
  }) => {
    const component = await mount<typeof FnControls>('value/FnControls', {
      delay: 200,
    });

    await component.getByTestId('schedule').click();
    await component.getByTestId('flush').click();

    // No clock advance: flush does not wait for the timer
    await expect(component.getByTestId('calls')).toHaveText('1');
    await expect(component.getByTestId('last-value')).toHaveText('scheduled');

    // And the flushed call must not fire a second time
    await page.clock.runFor(400);
    await expect(component.getByTestId('calls')).toHaveText('1');
  });

  test('should do nothing when there is no pending call', async ({
    mount,
    page,
  }) => {
    const component = await mount<typeof FnControls>('value/FnControls');

    await component.getByTestId('flush').click();
    await component.getByTestId('cancel').click();

    await page.clock.runFor(400);

    await expect(component.getByTestId('calls')).toHaveText('0');
  });
});
