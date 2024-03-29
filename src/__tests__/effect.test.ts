import { renderHook } from '@testing-library/react';
import { useDebouncyEffect } from '../index';

beforeAll(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.resetAllMocks();
  jest.clearAllTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

const defaultDelay = 300;
const defaultDeps = [1];
const spy = jest.fn();

const getProperties = ({
  fn = spy,
  deps = defaultDeps,
  delay = defaultDelay,
} = {}) => ({
  delay,
  deps,
  fn,
});

const getHook = () =>
  renderHook(({ delay, deps, fn }) => useDebouncyEffect(fn, delay, deps), {
    initialProps: getProperties(),
  });

test.each`
  firstCalls | secondCalls | expected
  ${0}       | ${0}        | ${0}
  ${2}       | ${0}        | ${1}
  ${20}      | ${0}        | ${1}
  ${5}       | ${0}        | ${1}
  ${0}       | ${3}        | ${1}
  ${0}       | ${6}        | ${1}
  ${0}       | ${25}       | ${1}
  ${5}       | ${3}        | ${2}
  ${2}       | ${6}        | ${2}
  ${15}      | ${25}       | ${2}
`(
  'should changed deps $firstCalls and $secondCalls times and real call is $expected',
  ({ firstCalls, secondCalls, expected }) => {
    const hook = getHook();

    // Photom rerender without changed deps
    hook.rerender(getProperties());
    jest.runAllTimers();

    while (firstCalls--) {
      hook.rerender(getProperties({ deps: [firstCalls] }));
    }
    jest.runAllTimers();

    while (secondCalls--) {
      hook.rerender(getProperties({ deps: [secondCalls] }));
    }
    jest.runAllTimers();

    expect(spy).toBeCalledTimes(expected);
  },
);

test('should call with default args', () => {
  const hook = renderHook(() => useDebouncyEffect(spy));

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

  jest.advanceTimersByTime(100); // 100 ms
  expect(spy).toBeCalledTimes(0);

  jest.advanceTimersByTime(300); // next big tick
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
