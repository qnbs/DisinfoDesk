import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  debounce,
  throttle,
  deepClone,
  formatBytes,
  formatRelativeTime,
  generateId,
  retryWithBackoff,
  safeJsonParse,
  isPlainObject,
  omit,
  pick,
} from '../../utils/helpers';

// ── debounce ──
describe('debounce', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('delays execution until after wait period', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledOnce();
  });

  it('resets timer on subsequent calls', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced();
    vi.advanceTimersByTime(100);
    debounced(); // reset
    vi.advanceTimersByTime(100);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledOnce();
  });

  it('passes arguments through', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 50);

    debounced('a', 'b');
    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledWith('a', 'b');
  });
});

// ── throttle ──
describe('throttle', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('executes immediately on first call', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 200);

    throttled();
    expect(fn).toHaveBeenCalledOnce();
  });

  it('blocks subsequent calls within the limit window', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 200);

    throttled();
    throttled();
    throttled();
    expect(fn).toHaveBeenCalledOnce();
  });

  it('allows call after limit window passes', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 200);

    throttled();
    vi.advanceTimersByTime(200);
    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

// ── deepClone ──
describe('deepClone', () => {
  it('creates a deep copy of nested objects', () => {
    const obj = { a: 1, b: { c: [1, 2, 3] } };
    const clone = deepClone(obj);

    expect(clone).toEqual(obj);
    expect(clone).not.toBe(obj);
    expect(clone.b).not.toBe(obj.b);
    expect(clone.b.c).not.toBe(obj.b.c);
  });

  it('handles primitives', () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone('hello')).toBe('hello');
    expect(deepClone(null)).toBe(null);
  });
});

// ── formatBytes ──
describe('formatBytes', () => {
  it('formats 0 bytes', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
  });

  it('formats bytes', () => {
    expect(formatBytes(500)).toBe('500 Bytes');
  });

  it('formats kilobytes', () => {
    expect(formatBytes(1024)).toBe('1 KB');
  });

  it('formats megabytes', () => {
    expect(formatBytes(1048576)).toBe('1 MB');
  });

  it('respects decimal places', () => {
    expect(formatBytes(1536, 1)).toBe('1.5 KB');
  });

  it('formats gigabytes', () => {
    expect(formatBytes(1073741824)).toBe('1 GB');
  });
});

// ── formatRelativeTime ──
describe('formatRelativeTime', () => {
  it('returns "just now" for recent timestamps', () => {
    expect(formatRelativeTime(Date.now() - 5000)).toBe('just now');
  });

  it('formats minutes', () => {
    expect(formatRelativeTime(Date.now() - 120000)).toBe('2 minutes ago');
  });

  it('formats hours', () => {
    expect(formatRelativeTime(Date.now() - 7200000)).toBe('2 hours ago');
  });

  it('formats days', () => {
    expect(formatRelativeTime(Date.now() - 172800000)).toBe('2 days ago');
  });

  it('singular forms', () => {
    expect(formatRelativeTime(Date.now() - 60000)).toBe('1 minute ago');
    expect(formatRelativeTime(Date.now() - 3600000)).toBe('1 hour ago');
    expect(formatRelativeTime(Date.now() - 86400000)).toBe('1 day ago');
  });
});

// ── generateId ──
describe('generateId', () => {
  it('returns a non-empty string', () => {
    const id = generateId();
    expect(id).toBeTruthy();
    expect(typeof id).toBe('string');
  });

  it('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

// ── retryWithBackoff ──
describe('retryWithBackoff', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns on first success', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    const promise = retryWithBackoff(fn, 3, 10);
    const result = await promise;
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledOnce();
  });

  it('retries on failure and succeeds', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail1'))
      .mockResolvedValue('ok');

    vi.useRealTimers(); // need real timers for async delays
    const result = await retryWithBackoff(fn, 3, 10);
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('throws after max retries', async () => {
    vi.useRealTimers();
    const fn = vi.fn().mockRejectedValue(new Error('always fails'));

    await expect(retryWithBackoff(fn, 2, 10)).rejects.toThrow('always fails');
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

// ── safeJsonParse ──
describe('safeJsonParse', () => {
  it('parses valid JSON', () => {
    expect(safeJsonParse('{"a":1}', {})).toEqual({ a: 1 });
  });

  it('returns fallback on invalid JSON', () => {
    expect(safeJsonParse('not json', { fallback: true })).toEqual({ fallback: true });
  });

  it('returns fallback on empty string', () => {
    expect(safeJsonParse('', [])).toEqual([]);
  });
});

// ── isPlainObject ──
describe('isPlainObject', () => {
  it('returns true for plain objects', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1 })).toBe(true);
  });

  it('returns false for arrays', () => {
    expect(isPlainObject([])).toBe(false);
  });

  it('returns false for primitives', () => {
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject(42)).toBe(false);
    expect(isPlainObject('str')).toBe(false);
  });
});

// ── omit ──
describe('omit', () => {
  it('removes specified keys', () => {
    expect(omit({ a: 1, b: 2, c: 3 }, ['b'])).toEqual({ a: 1, c: 3 });
  });

  it('returns copy when no keys match', () => {
    const original = { a: 1 };
    const result = omit(original, ['b' as keyof typeof original]);
    expect(result).toEqual({ a: 1 });
    expect(result).not.toBe(original);
  });
});

// ── pick ──
describe('pick', () => {
  it('picks specified keys', () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });

  it('ignores missing keys', () => {
    expect(pick({ a: 1 }, ['a', 'b' as keyof { a: number }])).toEqual({ a: 1 });
  });
});
