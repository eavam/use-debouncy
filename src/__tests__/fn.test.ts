import { renderHook } from '@testing-library/react-hooks';
import useDebouncyFn from '../fn';

beforeAll(() => {
  jest.useFakeTimers('modern');
});

test('should hook returned function', () => {
  const fn = jest.fn();
  const hook = renderHook(() => useDebouncyFn(fn, 300));

  expect(typeof hook.result.current).toBe('function');
});

test('should call not triggered on initial hook', () => {
  const fn = jest.fn();
  renderHook(() => useDebouncyFn(fn, 300));

  jest.runAllTimers();
  expect(fn).toBeCalledTimes(0);
});

test('should call only once', () => {
  const fn = jest.fn();
  const hook = renderHook(() => useDebouncyFn(fn, 300));

  hook.result.current();
  hook.result.current();
  hook.result.current();

  jest.runAllTimers();
  expect(fn).toBeCalledTimes(1);
});

test('should call only twice', () => {
  const fn = jest.fn();
  const hook = renderHook(() => useDebouncyFn(fn, 300));

  hook.result.current();
  jest.runAllTimers();
  hook.result.current();
  hook.result.current();
  jest.runAllTimers();

  expect(fn).toBeCalledTimes(2);
});

test('should call with args', () => {
  const fn = jest.fn();
  const hook = renderHook(() => useDebouncyFn(fn, 300));
  const args = { firstArg: 1, secondArg: [6, 7, 8], other: 'last arg' };

  hook.result.current(args);
  jest.runAllTimers();

  expect(fn).toBeCalledTimes(1);
  expect(fn.mock.calls[0][0]).toStrictEqual(args);
});
