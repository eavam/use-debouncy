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
