import { describe, it, expect } from 'vitest';

describe('DisinfoDesk App', () => {
  it('should pass a basic sanity check', () => {
    expect(true).toBe(true);
  });

  it('should have correct environment', () => {
    expect(typeof window).toBe('object');
  });

  it('should have IndexedDB mock available', () => {
    expect(window.indexedDB).toBeTruthy();
    expect(typeof window.indexedDB.open).toBe('function');
  });

  it('should have matchMedia mock', () => {
    expect(typeof window.matchMedia).toBe('function');
    const mq = window.matchMedia('(min-width: 768px)');
    expect(mq.matches).toBe(false);
    expect(mq.media).toBe('(min-width: 768px)');
  });

  it('should have ResizeObserver mock', () => {
    expect(typeof ResizeObserver).toBe('function');
    const observer = new ResizeObserver(() => {});
    expect(() => observer.observe(document.body)).not.toThrow();
    expect(() => observer.disconnect()).not.toThrow();
  });

  it('should have IntersectionObserver mock', () => {
    expect(typeof IntersectionObserver).toBe('function');
  });
});

describe('Data structures', () => {
  it('should have valid DE & EN theories', async () => {
    const { THEORIES_DE_FULL, THEORIES_EN_FULL } = await import('../constants');
    expect(Array.isArray(THEORIES_DE_FULL)).toBe(true);
    expect(Array.isArray(THEORIES_EN_FULL)).toBe(true);
    expect(THEORIES_DE_FULL.length).toBeGreaterThan(0);
    expect(THEORIES_EN_FULL.length).toBeGreaterThan(0);
  });

  it('should have valid media items', async () => {
    const { MEDIA_ITEMS } = await import('../constants');
    expect(Array.isArray(MEDIA_ITEMS)).toBe(true);
    expect(MEDIA_ITEMS.length).toBeGreaterThan(0);
  });

  it('theories have required fields', async () => {
    const { THEORIES_DE_FULL } = await import('../constants');
    for (const t of THEORIES_DE_FULL) {
      expect(t.id).toBeTruthy();
      expect(t.title).toBeTruthy();
      expect(t.shortDescription).toBeTruthy();
      expect(t.category).toBeTruthy();
      expect(t.dangerLevel).toBeTruthy();
      expect(typeof t.popularity).toBe('number');
      expect(t.popularity).toBeGreaterThanOrEqual(0);
      expect(t.popularity).toBeLessThanOrEqual(100);
      expect(Array.isArray(t.tags)).toBe(true);
    }
  });

  it('theory IDs are unique', async () => {
    const { THEORIES_DE_FULL } = await import('../constants');
    const ids = THEORIES_DE_FULL.map(t => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('DE and EN have matching theory counts', async () => {
    const { THEORIES_DE_FULL, THEORIES_EN_FULL } = await import('../constants');
    expect(THEORIES_DE_FULL.length).toBe(THEORIES_EN_FULL.length);
  });

  it('should have valid authors data', async () => {
    const { AUTHORS_FULL } = await import('../data/enriched');
    expect(Array.isArray(AUTHORS_FULL)).toBe(true);
    expect(AUTHORS_FULL.length).toBeGreaterThan(0);
    for (const a of AUTHORS_FULL) {
      expect(a.id).toBeTruthy();
      expect(a.name).toBeTruthy();
      expect(typeof a.influenceLevel).toBe('number');
    }
  });
});
