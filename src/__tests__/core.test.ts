/**
 * @jest-environment @stryker-mutator/jest-runner/jest-env/jsdom
 */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { renderHook } from '@testing-library/react';
import fc from 'fast-check';
import { useAnimationFrame } from '../core';

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

const fnSpy = jest.fn();
const defaultDelay = 100;

const getAnimationFrameProps = ({ fn = fnSpy, delay = defaultDelay } = {}) => ({
  fn,
  delay,
});

const getAnimationFrame = () =>
  renderHook(({ fn, delay }) => useAnimationFrame(fn, delay), {
    initialProps: getAnimationFrameProps(),
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
    const hook = getAnimationFrame();

    expect(fnSpy).toBeCalledTimes(0);

    while (firstCalls--) {
      hook.result.current();
    }
    jest.runAllTimers();

    while (secondCalls--) {
      hook.result.current();
    }
    jest.runAllTimers();

    expect(fnSpy).toBeCalledTimes(expected);
  },
);

test('should update animation callback function', () => {
  const newSpy = jest.fn();

  const hook = getAnimationFrame();

  hook.rerender(getAnimationFrameProps({ fn: newSpy }));

  hook.result.current();
  jest.runAllTimers();

  expect(fnSpy).toBeCalledTimes(0);
  expect(newSpy).toBeCalledTimes(1);
});

describe('with mocked requestAnimationFrame', () => {
  let count = 0;
  let rafSpy: jest.SpyInstance<number, [callback: FrameRequestCallback]>;

  beforeEach(() => {
    rafSpy = jest
      .spyOn(window, 'requestAnimationFrame')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .mockImplementation((cb) => {
        count += 100;
        return cb(count);
      });

    jest.spyOn(window.performance, 'now').mockImplementation(() => 100);
  });

  afterEach(() => {
    count = 0;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.requestAnimationFrame.mockRestore();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.performance.now.mockRestore();
  });

  test('should renderFrame function calls', () => {
    const hook = getAnimationFrame();

    hook.result.current();
    jest.runAllTimers();

    expect(rafSpy).toBeCalledTimes(2);
    expect(fnSpy).toBeCalledTimes(1);
  });

  test('should update renderFrame function after changed delay', () => {
    const hook = getAnimationFrame();

    hook.rerender(getAnimationFrameProps({ delay: 200 }));
    hook.result.current();
    jest.runAllTimers();

    expect(rafSpy).toBeCalledTimes(3);
    expect(fnSpy).toBeCalledTimes(1);
  });
});

test('fast check', () => {
  fc.assert(
    fc.property(
      fc.func(fc.nat()),
      fc.nat(),
      fc.nat(10_000),
      (fn, arg, time) => {
        const newSpy = jest.fn((args) => fn(args));
        const hook = renderHook(() => useAnimationFrame(newSpy, time));

        hook.result.current(arg);
        jest.runAllTimers();

        expect(newSpy.mock.calls[0][0]).toEqual(arg);
        expect(newSpy.mock.results[0].value).toEqual(fn(arg));
      },
    ),
  );
});
