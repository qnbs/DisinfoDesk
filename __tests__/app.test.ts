import { describe, it, expect } from 'vitest';

describe('DisinfoDesk App', () => {
  it('should pass a basic sanity check', () => {
    expect(true).toBe(true);
  });

  it('should have correct environment', () => {
    expect(typeof window).toBe('object');
  });
});

describe('Data structures', () => {
  it('should have valid constants file', async () => {
    const { THEORIES_DE_FULL, THEORIES_EN_FULL } = await import('../constants');
    expect(Array.isArray(THEORIES_DE_FULL)).toBe(true);
    expect(Array.isArray(THEORIES_EN_FULL)).toBe(true);
    expect(THEORIES_DE_FULL.length).toBeGreaterThan(0);
  });

  it('should have valid media items', async () => {
    const { MEDIA_ITEMS } = await import('../constants');
    expect(Array.isArray(MEDIA_ITEMS)).toBe(true);
    expect(MEDIA_ITEMS.length).toBeGreaterThan(0);
  });
});
