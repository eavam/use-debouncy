/* eslint-disable unicorn/prevent-abbreviations */
// eslint-disable-next-line no-undef
module.exports = {
  name: 'e2e',
  preset: 'jest-playwright-preset',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/e2e/browser.test.ts'],
};
