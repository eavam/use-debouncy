import { expect, test } from './fixtures';
import type {
  EdgeCaseDelayComponent,
  HighFrequencyComponent,
  MemoryLeakTestComponent,
} from '../stories/performance.story';

test.describe('Performance and Memory', () => {
  test('should handle component unmounting without memory leaks', async ({
    mount,
    page,
  }) => {
    const component = await mount<typeof MemoryLeakTestComponent>(
      'performance/MemoryLeakTestComponent',
      { delay: 200 },
    );

    // Create some state that needs cleanup
    await component.getByTestId('memory-input').fill('test');
    await page.clock.runFor(100);

    // Unmount before effect completes
    await component.unmount();

    // Wait longer than the delay to ensure cleanup happened
    await page.clock.runFor(300);
  });

  test('should handle high frequency updates efficiently', async ({
    mount,
    page,
  }) => {
    const component = await mount<typeof HighFrequencyComponent>(
      'performance/HighFrequencyComponent',
      { delay: 100 },
    );

    // Simulate very rapid typing with pressSequentially
    await component
      .getByTestId('high-freq-input')
      .pressSequentially('rapid-0123456789', { delay: 20 });

    // Should not have processed any yet
    await expect(component.getByTestId('processed-count')).toHaveText('0');

    await page.clock.runFor(150);

    // Should have processed only once with final value
    await expect(component.getByTestId('processed-count')).toHaveText('1');
    await expect(component.getByTestId('last-processed')).toHaveText(
      'rapid-0123456789',
    );
  });

  test('should handle many rapid state changes without performance issues', async ({
    mount,
    page,
  }) => {
    const component = await mount<typeof HighFrequencyComponent>(
      'performance/HighFrequencyComponent',
      { delay: 200 },
    );
    const value = 'change-0123456789012345678901234567890123456789012345678';

    await component
      .getByTestId('high-freq-input')
      .pressSequentially(value, { delay: 5 });

    await expect(component.getByTestId('processed-count')).toHaveText('0');

    await page.clock.runFor(250);

    // Should still only process once
    await expect(component.getByTestId('processed-count')).toHaveText('1');
    await expect(component.getByTestId('last-processed')).toHaveText(value);
  });
});

test.describe('Edge Cases', () => {
  test('should handle zero delay correctly', async ({ mount, page }) => {
    const component = await mount<typeof EdgeCaseDelayComponent>(
      'performance/EdgeCaseDelayComponent',
      { delay: 0 },
    );

    await component.getByTestId('edge-input').fill('zero-delay');

    // With zero delay, should execute on next animation frame
    await page.clock.runFor(20);

    await expect(component.getByTestId('call-count')).toHaveText('1');
  });

  test('should handle negative delay as zero', async ({ mount, page }) => {
    const component = await mount<typeof EdgeCaseDelayComponent>(
      'performance/EdgeCaseDelayComponent',
      { delay: -100 },
    );

    await component.getByTestId('edge-input').fill('negative-delay');

    // Negative delay should be treated as zero/immediate
    await page.clock.runFor(20);

    await expect(component.getByTestId('call-count')).toHaveText('1');
  });

  test('should handle very large delays', async ({ mount, page }) => {
    const component = await mount<typeof EdgeCaseDelayComponent>(
      'performance/EdgeCaseDelayComponent',
      { delay: 5000 },
    );

    await component.getByTestId('edge-input').fill('large-delay');

    // Should not execute before delay
    await page.clock.runFor(4000);
    await expect(component.getByTestId('call-count')).toHaveText('0');

    // Should execute after delay
    await page.clock.runFor(1500);
    await expect(component.getByTestId('call-count')).toHaveText('1');
  });

  test('should preserve function parameters correctly', async ({
    mount,
    page,
  }) => {
    const component = await mount('fn/FunctionParameterComponent');

    // Trigger function with complex parameters
    await component.getByTestId('trigger-params').click();
    await page.clock.runFor(150);

    await expect(component.getByTestId('param-call-count')).toHaveText('1');
    await expect(component.getByTestId('param-result-0')).toHaveText(
      'test-42-value-1,2,3',
    );
  });

  test('should handle multiple rapid parameter calls', async ({
    mount,
    page,
  }) => {
    const component = await mount('fn/FunctionParameterComponent');
    const button = component.getByTestId('trigger-params');

    // Multiple rapid clicks
    await button.click();
    await page.clock.runFor(20);
    await button.click();
    await page.clock.runFor(20);
    await button.click();

    // Should not have called yet
    await expect(component.getByTestId('param-call-count')).toHaveText('0');

    await page.clock.runFor(150);

    // Should have called only once
    await expect(component.getByTestId('param-call-count')).toHaveText('1');
    await expect(component.getByTestId('param-result-0')).toHaveText(
      'test-42-value-1,2,3',
    );
  });

  test('should handle empty and null inputs gracefully', async ({
    mount,
    page,
  }) => {
    const component = await mount<typeof EdgeCaseDelayComponent>(
      'performance/EdgeCaseDelayComponent',
      { delay: 100 },
    );
    const input = component.getByTestId('edge-input');

    // Start with empty
    await expect(component.getByTestId('call-count')).toHaveText('0');

    // Type and clear using pressSequentially
    await input.pressSequentially('test', { delay: 50 });
    await input.selectText();
    await input.pressSequentially('', { delay: 50 });

    await page.clock.runFor(150);

    // Should handle empty values without errors
    await expect(component.getByTestId('call-count')).toHaveText('1');
  });
});
