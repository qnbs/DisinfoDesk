import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('PWA Manifest', () => {
  let manifest: Record<string, unknown>;

  beforeEach(() => {
    const raw = readFileSync(resolve(__dirname, '../../manifest.json'), 'utf-8');
    manifest = JSON.parse(raw);
  });

  it('has required PWA fields', () => {
    expect(manifest.name).toBeTruthy();
    expect(manifest.short_name).toBeTruthy();
    expect(manifest.start_url).toBeTruthy();
    expect(manifest.display).toBe('standalone');
    expect(manifest.theme_color).toBeTruthy();
    expect(manifest.background_color).toBeTruthy();
  });

  it('has valid icons with required sizes', () => {
    const icons = manifest.icons as Array<{ src: string; type: string; sizes: string; purpose?: string }>;
    expect(icons.length).toBeGreaterThan(0);

    // Must have "any" and "maskable" purpose icons
    const purposes = icons.map(i => i.purpose).filter(Boolean);
    expect(purposes.some(p => p!.includes('any'))).toBe(true);
    expect(purposes.some(p => p!.includes('maskable'))).toBe(true);
  });

  it('icons use local paths (no CDN)', () => {
    const icons = manifest.icons as Array<{ src: string }>;
    for (const icon of icons) {
      expect(icon.src).not.toContain('http');
      expect(icon.src).not.toContain('flaticon');
      expect(icon.src).not.toContain('cdn');
    }
  });

  it('has valid start_url for GitHub Pages', () => {
    expect(manifest.start_url).toBe('/DisinfoDesk/');
  });

  it('has scope set', () => {
    expect(manifest.scope).toBeTruthy();
  });

  it('has description', () => {
    expect(manifest.description).toBeTruthy();
    expect((manifest.description as string).length).toBeGreaterThan(10);
  });

  it('shortcuts use local icons', () => {
    const shortcuts = manifest.shortcuts as Array<{ icons?: Array<{ src: string }> }>;
    if (shortcuts) {
      for (const shortcut of shortcuts) {
        if (shortcut.icons) {
          for (const icon of shortcut.icons) {
            expect(icon.src).not.toContain('http');
          }
        }
      }
    }
  });
});

describe('Service Worker configuration', () => {
  let swContent: string;

  beforeEach(() => {
    swContent = readFileSync(resolve(__dirname, '../../sw.js'), 'utf-8');
  });

  it('registers precache routes', () => {
    expect(swContent).toContain('precacheAndRoute');
    expect(swContent).toContain('index.html');
    expect(swContent).toContain('manifest.json');
  });

  it('precaches all icon variants', () => {
    expect(swContent).toContain('icon.svg');
    expect(swContent).toContain('icon-maskable.svg');
    expect(swContent).toContain('favicon.svg');
  });

  it('has CACHE_SUFFIX for versioning', () => {
    expect(swContent).toMatch(/CACHE_SUFFIX\s*=/);
  });

  it('implements skip waiting', () => {
    expect(swContent).toContain('skipWaiting');
  });

  it('has caching strategies defined', () => {
    // Should have image caching, font caching, and stale-while-revalidate
    expect(swContent).toContain('CacheFirst');
    expect(swContent).toContain('StaleWhileRevalidate');
  });
});

describe('Offline readiness', () => {
  it('navigator.onLine is available', () => {
    expect(typeof navigator.onLine).toBe('boolean');
  });

  it('online/offline events can be dispatched', () => {
    const handler = vi.fn();
    window.addEventListener('offline', handler);
    window.dispatchEvent(new Event('offline'));
    expect(handler).toHaveBeenCalledOnce();
    window.removeEventListener('offline', handler);
  });

  it('online event fires correctly', () => {
    const handler = vi.fn();
    window.addEventListener('online', handler);
    window.dispatchEvent(new Event('online'));
    expect(handler).toHaveBeenCalledOnce();
    window.removeEventListener('online', handler);
  });
});

describe('index.html meta tags', () => {
  let html: string;

  beforeEach(() => {
    html = readFileSync(resolve(__dirname, '../../index.html'), 'utf-8');
  });

  it('has manifest link', () => {
    expect(html).toContain('rel="manifest"');
  });

  it('has no CDN icon references', () => {
    expect(html).not.toContain('flaticon');
    expect(html).not.toContain('cdn-icons-png');
  });

  it('has apple-touch-icon', () => {
    expect(html).toContain('apple-touch-icon');
  });

  it('has theme-color meta', () => {
    expect(html).toContain('theme-color');
  });

  it('has og:title meta', () => {
    expect(html).toContain('og:title');
  });

  it('has viewport meta for mobile', () => {
    expect(html).toContain('viewport');
    expect(html).toContain('width=device-width');
  });
});
