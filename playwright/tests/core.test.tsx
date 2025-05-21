import { expect, test } from '@playwright/experimental-ct-react';
import React from 'react';
import { AnimationFrameTest } from '../stories/animation-frame-test';

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
