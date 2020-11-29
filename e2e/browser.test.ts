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
const inputSelector = '[data-qa="input/search"]';
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
  const fetchMock = jest.fn();

  await page.route('**/*', (route) => {
    const request = route.request();
    const url = request.url();

    if (url.includes('swapi.dev')) {
      fetchMock(url);
      route.abort();
    } else {
      route.continue();
    }
  });

  await page.goto(urlBase);

  await page.type(inputSelector, 'Dar');
  await page.waitForTimeout(1000);
  expect(fetchMock).toBeCalledTimes(1);
  expect(fetchMock.mock.calls[0][0]).toContain('Dar');

  await page.fill(inputSelector, 'Dart');
  await page.type(inputSelector, ' Vader');
  await page.waitForTimeout(1000);
  expect(fetchMock).toBeCalledTimes(2);
  expect(fetchMock.mock.calls[1][0]).toContain(
    encodeURIComponent('Dart Vader'),
  );

  await page.fill(inputSelector, '');
  await page.waitForTimeout(1000);
  expect(fetchMock).toBeCalledTimes(3);
  expect(fetchMock.mock.calls[2][0]).toContain('search=');
}, 30000);
