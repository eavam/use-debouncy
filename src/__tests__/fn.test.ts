/**
 * @jest-environment @stryker-mutator/jest-runner/jest-env/jsdom
 */

import { renderHook } from '@testing-library/react-hooks';
import useDebouncyFn from '../fn';

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

const getHook = (...initArgs: Parameters<typeof useDebouncyFn>) =>
  renderHook(({ fn, wait }) => useDebouncyFn(fn, wait), {
    initialProps: { fn: initArgs[0], wait: initArgs[1] },
  });

const spy = jest.fn();

test('should hook returned function', () => {
  const hook = getHook(spy);

  expect(typeof hook.result.current).toBe('function');
});

test('should hook takes multiple args', () => {
  const hook = getHook(spy);

  hook.result.current(1, 2, [], { key: ['value', ''] });
  jest.runAllTimers();

  expect(spy.mock.calls[0][0]).toStrictEqual(1);
  expect(spy.mock.calls[0][1]).toStrictEqual(2);
  expect(spy.mock.calls[0][2]).toStrictEqual([]);
  expect(spy.mock.calls[0][3]).toStrictEqual({ key: ['value', ''] });
});

test('should update callback function', () => {
  const hook = getHook(spy);
  const newSpy = jest.fn();

  hook.rerender({ fn: newSpy, wait: 0 });
  hook.result.current();
  jest.runAllTimers();

  expect(spy).toBeCalledTimes(0);
  expect(newSpy).toBeCalledTimes(1);
});

const testSuite = ({
  firstCalls,
  secondCalls,
  wait,
  args,
  expected,
}: {
  firstCalls: number;
  secondCalls: number;
  wait?: number;
  args?: unknown;
  expected: number;
}) => {
  const hook = getHook(spy, wait);

  while (firstCalls--) {
    hook.result.current(args);
  }
  jest.runAllTimers();

  while (secondCalls--) {
    hook.result.current(args);
  }
  jest.runAllTimers();

  expect(spy).toBeCalledTimes(expected);
  while (expected--) {
    expect(spy.mock.calls[expected][0]).toStrictEqual(args);
  }
};

describe.each`
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
  'should hook call first $firstCalls times and second $secondCalls and real call is $expected',
  (props) => {
    test('with default props', () => {
      testSuite(props);
    });

    test.each([300, 0, 100, 10, 1000])('with %p wait', (wait) => {
      testSuite({ ...props, wait });
    });

    test.each([300, '0', '', [1, 2, 3], { key: 'obj', arr: [1, 2, 3] }])(
      'with %p argument',
      (args) => {
        testSuite({ ...props, args });
      },
    );
  },
);
