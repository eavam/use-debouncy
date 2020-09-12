import { renderHook } from '@testing-library/react-hooks';
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

const defaultDelay = 100;
const defaultDeps = [1];
const spy = jest.fn();

const getProperties = ({ deps = defaultDeps, fn = spy } = {}) => ({
  delay: defaultDelay,
  deps,
  fn,
});

const getHook = () =>
  renderHook(({ delay, deps, fn }) => useDebouncy(fn, delay, deps), {
    initialProps: getProperties(),
  });

test('should call once after change deps', () => {
  const hook = getHook();

  hook.rerender(getProperties({ deps: [2] }));
  jest.runAllTimers();

  expect(spy).toBeCalledTimes(1);
});

test('should call once after many change deps', () => {
  const hook = getHook();

  for (let i = 0; i < 4; i++) {
    hook.rerender(getProperties({ deps: [i] }));
  }

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

  hook.rerender();

  jest.runAllTimers();
  expect(spy).toBeCalledTimes(0);
});

test('should call with default args', () => {
  const hook = renderHook(() => useDebouncy(spy));

  hook.rerender();
  jest.runAllTimers();

  expect(spy).toBeCalledTimes(0);
});

test('should clear timers on unmount', () => {
  const hook = getHook();

  hook.rerender(getProperties({ deps: [2] }));
  hook.unmount();

  jest.runAllTimers();
  expect(spy).toBeCalledTimes(0);
});

test('should call callback after timer end', () => {
  const hook = getHook();

  hook.rerender(getProperties({ deps: [2] }));

  jest.runTimersToTime(defaultDelay - 10);
  expect(spy).toBeCalledTimes(0);

  jest.runTimersToTime(22);
  expect(spy).toBeCalledTimes(1);
});

test('should update callback function', () => {
  const hook = getHook();
  const newSpy = jest.fn();

  hook.rerender(getProperties({ deps: [2], fn: newSpy }));
  jest.runAllTimers();

  expect(newSpy).toBeCalledTimes(1);
  expect(spy).toBeCalledTimes(0);
});
