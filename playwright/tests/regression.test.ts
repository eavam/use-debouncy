import { expect, test } from './fixtures';
import type {
  EffectDestructor,
  EscapingFn,
  LatestState,
  SilentOnMount,
} from '../stories/regression.story';

/**
 * The gallery renders stories in StrictMode, so React mounts, unmounts and
 * remounts every story in development. The remount must not look like a
 * dependency change.
 */
test('should stay silent on mount under StrictMode', async ({
  mount,
  page,
}) => {
  const component = await mount<typeof SilentOnMount>(
    'regression/SilentOnMount',
    { delay: 50 },
  );

  await page.clock.runFor(500);

  await expect(component.getByTestId('calls')).toHaveText('0');
});

/**
 * useDebouncyEffect takes an EffectCallback, so a returned destructor has to
 * run before the next invocation, exactly like useEffect.
 */
test('should run the destructor before the next effect run', async ({
  mount,
  page,
}) => {
  const component = await mount<typeof EffectDestructor>(
    'regression/EffectDestructor',
    { delay: 50 },
  );
  const input = component.getByTestId('input');

  await input.fill('a');
  await page.clock.runFor(100);

  await expect(component.getByTestId('runs')).toHaveText('1');
  await expect(component.getByTestId('cleanups')).toHaveText('0');

  await input.fill('ab');
  await page.clock.runFor(100);

  await expect(component.getByTestId('runs')).toHaveText('2');
  await expect(component.getByTestId('cleanups')).toHaveText('1');
});

/**
 * A new function identity on every render breaks React.memo and any
 * dependency array the callback is passed to.
 */
test('should keep a stable callback identity across renders', async ({
  mount,
}) => {
  const component = await mount('regression/CallbackIdentity');

  await component.getByTestId('rerender').click();
  await component.getByTestId('rerender').click();

  await expect(component.getByTestId('identity-changes')).toHaveText('0');
});

/**
 * A call scheduled before a state update must still observe the latest state
 * when it finally runs.
 */
test('should run a pending call against the latest state', async ({
  mount,
  page,
}) => {
  const component = await mount<typeof LatestState>('regression/LatestState', {
    delay: 200,
  });

  await component.getByTestId('start').click();
  await component.getByTestId('change').click();
  await expect(component.getByTestId('text')).toHaveText('updated');

  await page.clock.runFor(400);

  await expect(component.getByTestId('seen')).toHaveText('updated');
});

/**
 * Codex review, P2: the refs are written from a passive effect, which React
 * flushes after layout effects. A flush() issued from a consumer's layout
 * effect therefore runs the callback from the previous render.
 */
test('should flush the latest callback from a layout effect', async ({
  mount,
}) => {
  const component = await mount('regression/LayoutFlush');

  await component.getByTestId('bump').click();

  await expect(component.getByTestId('seen')).toHaveText('2');
});

/**
 * Codex review, P2: a reference to the debounced function can outlive the
 * component, and flushing it afterwards must not resurrect the cancelled call.
 */
test('should not run a flush issued after unmount', async ({ mount, page }) => {
  const component = await mount<typeof EscapingFn>('regression/EscapingFn', {
    delay: 200,
  });

  await component.getByTestId('schedule').click();
  await component.unmount();

  await page.evaluate(() => window.escapedFn?.flush());

  expect(await page.evaluate(() => window.escapedCalls)).toBe(0);
});
