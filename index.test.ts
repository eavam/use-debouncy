import { renderHook } from '@testing-library/react-hooks';
import useDebouncy from '.';

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
const spy = jest.fn();

test('should call after change deps', () => {
  const hook = renderHook(({ delay, deps }) => useDebouncy(spy, delay, deps), {
    initialProps: { delay: defaultDelay, deps: [1] },
  });

  expect(spy).toBeCalledTimes(0);

  hook.rerender({ delay: defaultDelay, deps: [2] });
  jest.runAllTimers();

  expect(spy).toBeCalledTimes(1);
});
