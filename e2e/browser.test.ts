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

const getViewText = () =>
  page.$eval(viewSelector, (element) => element.textContent);
const getInputValue = () =>
  page.$eval(inputSelector, (element) => element.value);

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

  await page.type(inputSelector, 'first text');
  await page.waitForTimeout(1000);

  expect(await getViewText()).toBe('first text');
  expect(await getInputValue()).toBe('first text');

  await page.fill(inputSelector, '');
  await page.type(inputSelector, 'second text', { delay: 100 });
  await page.waitForTimeout(1000);

  expect(await getViewText()).toBe('first text, second text');
  expect(await getInputValue()).toBe('second text');
}, 30000);
