import { renderHook } from '@testing-library/react-hooks';
import { useUserCallback, useAnimationFrame } from '../core';

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

const getUserCallbackProps = ({ fn = fnSpy } = {}) => ({
  fn,
});

const getUserCallback = () =>
  renderHook(({ fn }) => useUserCallback(fn), {
    initialProps: getUserCallbackProps(),
  });

test('should call user callback', () => {
  const hook = getUserCallback();

  expect(fnSpy).toBeCalledTimes(0);

  hook.result.current.current();

  expect(fnSpy).toBeCalledTimes(1);
});

test('should update user callback function', () => {
  const newSpy = jest.fn();

  const hook = getUserCallback();

  hook.rerender(getUserCallbackProps({ fn: newSpy }));

  hook.result.current.current();

  expect(fnSpy).toBeCalledTimes(0);
  expect(newSpy).toBeCalledTimes(1);
});

/* -------------------------------- */

const getAnimationFrameProps = ({ fn = fnSpy, delay = defaultDelay } = {}) => ({
  fn,
  delay,
});

const getAnimationFrame = () =>
  renderHook(({ fn, delay }) => useAnimationFrame(fn, delay), {
    initialProps: getAnimationFrameProps(),
  });

test('should call animation frame', () => {
  const hook = getAnimationFrame();

  expect(fnSpy).toBeCalledTimes(0);

  hook.result.current();
  jest.runAllTimers();

  expect(fnSpy).toBeCalledTimes(1);
});

test('should call animation frame once', () => {
  const hook = getAnimationFrame();

  expect(fnSpy).toBeCalledTimes(0);

  hook.result.current();
  hook.result.current();
  hook.result.current();
  jest.runAllTimers();

  expect(fnSpy).toBeCalledTimes(1);
});

test('should update animation callback function', () => {
  const newSpy = jest.fn();

  const hook = getAnimationFrame();

  hook.rerender(getAnimationFrameProps({ fn: newSpy }));

  hook.result.current();
  jest.runAllTimers();

  expect(fnSpy).toBeCalledTimes(0);
  expect(newSpy).toBeCalledTimes(1);
});
