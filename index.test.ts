import { renderHook } from '@testing-library/react-hooks';
// eslint-disable-next-line unicorn/import-index
import useDebouncy from './index';

beforeAll(() => {
  jest.useFakeTimers('modern');
});

afterEach(() => {
  jest.resetAllMocks();
  jest.clearAllTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

const defaultDelay = 16;
const defaultDeps = [1];
const spy = jest.fn();

const getHook = () =>
  renderHook(({ delay, deps }) => useDebouncy(spy, delay, deps), {
    initialProps: { delay: defaultDelay, deps: defaultDeps },
  });

test('should call after change deps', () => {
  const hook = getHook();

  jest.runAllTimers();
  expect(spy).toBeCalledTimes(0);

  hook.rerender({ delay: defaultDelay, deps: [2] });
  jest.runAllTimers();

  expect(spy).toBeCalledTimes(1);
});

test('should call not triggered on first mount', () => {
  getHook();

  jest.runAllTimers();
  expect(spy).toBeCalledTimes(0);
});

test('should not calling callback if deps not changed', () => {
  const hook = getHook();

  jest.runAllTimers();
  expect(spy).toBeCalledTimes(0);

  hook.rerender();

  jest.runAllTimers();
  expect(spy).toBeCalledTimes(0);
});

test('should call with default args', () => {
  const hook = renderHook(() => useDebouncy(spy));

  jest.runAllTimers();
  expect(spy).toBeCalledTimes(0);

  hook.rerender();
  jest.runAllTimers();

  expect(spy).toBeCalledTimes(0);
});
