import {
  webkit,
  chromium,
  firefox,
  Page,
  FirefoxBrowser,
  WebKitBrowser,
  ChromiumBrowser,
} from 'playwright';
import expect from 'expect';

let browser: FirefoxBrowser | WebKitBrowser | ChromiumBrowser;
let page: Page;
const urlBase = 'http://localhost:1234/';
const viewSelector = '#view';
const inputSelector = 'input';
const browserEnv = process.env.BROWSER;
const browsers = {
  webkit,
  chromium,
  firefox,
};

const isBrowser = (str: unknown): str is keyof typeof browsers =>
  Object.prototype.hasOwnProperty.call(browsers, str);

const browserType = isBrowser(browserEnv)
  ? browsers[browserEnv]
  : browsers.chromium;

const getValues = () =>
  page.evaluate(
    ({ viewSelector, inputSelector }) => {
      return {
        view: document.querySelector(viewSelector)?.textContent,
        input: document.querySelector<HTMLInputElement>(inputSelector)?.value,
      };
    },
    {
      viewSelector,
      inputSelector,
    },
  );

beforeAll(async () => {
  browser = await browserType.launch();
});

afterAll(async () => {
  await browser.close();
});

beforeEach(async () => {
  page = await browser.newPage();
});

afterEach(async () => {
  await page.close();
});

test('should work', async () => {
  await page.goto(urlBase);

  await page.type(inputSelector, 'first text', { delay: 50 });
  await page.waitForTimeout(500);

  const firstCheck = await getValues();
  expect(firstCheck.view).toBe('first text');
  expect(firstCheck.input).toBe('first text');

  await page.fill(inputSelector, '');
  await page.type(inputSelector, 'second text', { delay: 50 });
  await page.waitForTimeout(500);

  const secondCheck = await getValues();
  expect(secondCheck.view).toBe('first text, second text');
  expect(secondCheck.input).toBe('second text');
}, 30000);
