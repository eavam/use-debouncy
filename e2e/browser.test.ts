import { webkit, chromium, firefox } from 'playwright';
import expect from 'expect';
import cases from 'jest-in-case';

cases(
  'should work',
  async ({ browserType }) => {
    const browser = await browserType.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:1234/');
    const view = '#view';
    const input = 'input';
    const getViewText = async () => await page.textContent(view);
    const getInputValue = async () =>
      await page.$eval(input, (element) => element.value);

    expect(await getViewText()).toBe('');
    expect(await getInputValue()).toBe('');

    await page.type(input, 'first text');
    await page.waitForTimeout(500);

    expect(await getViewText()).toBe('first text');
    expect(await getInputValue()).toBe('first text');

    await page.fill(input, '');
    await page.type(input, 'second text', { delay: 200 });
    await page.waitForTimeout(500);

    expect(await getViewText()).toBe('first text, second text');
    expect(await getInputValue()).toBe('second text');

    await page.close();
    await browser.close();
  },
  [
    { name: 'webkit', browserType: webkit },
    { name: 'chromium', browserType: chromium },
    { name: 'firefox', browserType: firefox },
  ],
);
