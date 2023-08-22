/** @type {import('jest').Config} */
module.exports = {
  displayName: 'unit',
  preset: 'ts-jest',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  testEnvironment: 'jsdom',
};
