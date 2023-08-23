import type { Config } from 'jest';

const config: Config = {
  displayName: 'unit',
  preset: 'ts-jest',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  testEnvironment: 'jsdom',
};

export default config;
