import { expect, test } from '@playwright/experimental-ct-react';
import React from 'react';
import {
  EdgeCaseDelayComponent,
  FunctionParameterComponent,
  HighFrequencyComponent,
  MemoryLeakTestComponent,
} from '../stories/testing-stories';

test.beforeEach(async ({ page }) => {
  await page.clock.install();
});

test.describe('Performance and Memory', () => {
  test('should handle component unmounting without memory leaks', async ({
    mount,
    page,
  }) => {
    const component = await mount(<MemoryLeakTestComponent delay={200} />);
    const input = component.getByTestId('memory-input');

    // Create some state that needs cleanup
    await input.fill('test');
    await page.clock.runFor(100);

    // Unmount before effect completes
    await component.unmount();

    // Wait longer than the delay to ensure cleanup happened
    await page.clock.runFor(300);

    // Test passes if no memory leak errors occur
  });

  test('should handle high frequency updates efficiently', async ({
    mount,
    page,
  }) => {
    const component = await mount(<HighFrequencyComponent delay={100} />);
    const input = component.getByTestId('high-freq-input');

    // Simulate very rapid typing with pressSequentially
    await input.pressSequentially('rapid-0123456789', { delay: 20 });

    // Should not have processed any yet
    await expect(component.getByTestId('processed-count')).toHaveText('0');

    // Wait for debounce to complete
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
    const component = await mount(<HighFrequencyComponent delay={200} />);
    const input = component.getByTestId('high-freq-input');

    // Simulate typing a long string with very fast delays
    await input.pressSequentially(
      'change-0123456789012345678901234567890123456789012345678',
      { delay: 5 },
    );

    await expect(component.getByTestId('processed-count')).toHaveText('0');

    // Wait for final debounce
    await page.clock.runFor(250);

    // Should still only process once
    await expect(component.getByTestId('processed-count')).toHaveText('1');
    await expect(component.getByTestId('last-processed')).toHaveText(
      'change-0123456789012345678901234567890123456789012345678',
    );
  });
});

test.describe('Edge Cases', () => {
  test('should handle zero delay correctly', async ({ mount, page }) => {
    const component = await mount(<EdgeCaseDelayComponent delay={0} />);
    const input = component.getByTestId('edge-input');

    await input.fill('zero-delay');

    // With zero delay, should execute on next animation frame
    await page.clock.runFor(20);

    await expect(component.getByTestId('call-count')).toHaveText('1');
  });

  test('should handle negative delay as zero', async ({ mount, page }) => {
    const component = await mount(<EdgeCaseDelayComponent delay={-100} />);
    const input = component.getByTestId('edge-input');

    await input.fill('negative-delay');

    // Negative delay should be treated as zero/immediate
    await page.clock.runFor(20);

    await expect(component.getByTestId('call-count')).toHaveText('1');
  });

  test('should handle very large delays', async ({ mount, page }) => {
    const component = await mount(<EdgeCaseDelayComponent delay={5000} />);
    const input = component.getByTestId('edge-input');

    await input.fill('large-delay');

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
    const component = await mount(<FunctionParameterComponent />);
    const button = component.getByTestId('trigger-params');

    // Trigger function with complex parameters
    await button.click();
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
    const component = await mount(<FunctionParameterComponent />);
    const button = component.getByTestId('trigger-params');

    // Multiple rapid clicks
    await button.click();
    await page.clock.runFor(20);
    await button.click();
    await page.clock.runFor(20);
    await button.click();

    // Should not have called yet
    await expect(component.getByTestId('param-call-count')).toHaveText('0');

    // Wait for debounce
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
    const component = await mount(<EdgeCaseDelayComponent delay={100} />);
    const input = component.getByTestId('edge-input');

    // Start with empty
    await expect(component.getByTestId('call-count')).toHaveText('0');

    // Type and clear using pressSequentially
    await input.pressSequentially('test', { delay: 50 });
    // Clear by selecting all and typing empty
    await input.selectText();
    await input.pressSequentially('', { delay: 50 });

    await page.clock.runFor(150);

    // Should handle empty values without errors
    await expect(component.getByTestId('call-count')).toHaveText('1');
  });
});
