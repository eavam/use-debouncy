import { renderHook } from '@testing-library/react-hooks';
import { useAnimationFrame } from '../core';

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

const fnSpy = jest.fn();
const defaultDelay = 100;

const getAnimationFrameProps = ({ fn = fnSpy, delay = defaultDelay } = {}) => ({
  fn,
  delay,
});

const getAnimationFrame = (
  props?: Parameters<typeof getAnimationFrameProps>[0],
) =>
  renderHook(({ fn, delay }) => useAnimationFrame(fn, delay), {
    initialProps: getAnimationFrameProps(props),
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

test('should function have auto curry', () => {
  const newSpy = jest.fn(
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    (_a: number, _b: number, _c: number, _d: number, _e: number) => {},
  );
  const hook = getAnimationFrame({ fn: newSpy, delay: 300 });

  const curry1 = hook.result.current(1, 2);
  jest.runAllTimers();

  const curry2 = curry1(3)(4);
  jest.runAllTimers();

  const curry3 = curry2(5);
  jest.runAllTimers();

  expect(newSpy).toBeCalledTimes(1);
  expect(newSpy.mock.calls[0]).toEqual([1, 2, 3, 4, 5]);
});
