/** @type {import('jest').Config} */
const config = {
  displayName: 'unit',
  preset: 'ts-jest',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  testEnvironment: 'jsdom',
};

module.exports = config;
