import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateShareLink, parseShareLink, isSharedView, exportShareJSON } from '../../services/shareService';
import type { SharePayload } from '../../services/shareService';

// Mock window.location for hash-based routing tests
const mockLocation = (hash: string) => {
  Object.defineProperty(window, 'location', {
    value: {
      origin: 'https://qnbs.github.io',
      pathname: '/DisinfoDesk/',
      hash,
      href: `https://qnbs.github.io/DisinfoDesk/${hash}`,
      protocol: 'https:',
    },
    writable: true,
    configurable: true,
  });
};

describe('shareService', () => {
  beforeEach(() => {
    mockLocation('');
  });

  describe('generateShareLink', () => {
    it('generates a valid share link with encoded data', () => {
      const link = generateShareLink({
        type: 'theory',
        id: 'test-1',
        title: 'Test Theory',
        lang: 'de',
        summary: 'A test summary',
      });

      expect(link).toContain('#/shared?data=');
      expect(link).toContain('https://qnbs.github.io/DisinfoDesk/');
    });

    it('does not include API keys or user data', () => {
      const link = generateShareLink({
        type: 'theory',
        id: 'test-1',
        title: 'Test Theory',
        lang: 'en',
      });

      // Decode the base64 portion and verify no sensitive fields
      const match = link.match(/data=(.+)$/);
      expect(match).toBeTruthy();
      const decoded = atob(match![1].replace(/-/g, '+').replace(/_/g, '/'));
      expect(decoded).not.toContain('apiKey');
      expect(decoded).not.toContain('password');
    });

    it('includes version and timestamp', () => {
      const link = generateShareLink({
        type: 'report',
        id: 'rpt-1',
        title: 'Report Title',
        lang: 'de',
      });

      const match = link.match(/data=(.+)$/);
      const base64 = match![1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
      const decoded = JSON.parse(atob(padded));
      expect(decoded.version).toBe(1);
      expect(decoded.sharedAt).toBeTruthy();
    });
  });

  describe('parseShareLink', () => {
    it('parses a valid share link from window hash', () => {
      // First generate a link to get valid encoded data
      const link = generateShareLink({
        type: 'theory',
        id: 'parse-test',
        title: 'Parse Test',
        lang: 'de',
        summary: 'Summary',
      });

      // Extract hash part and set location
      const hash = link.split('#')[1];
      mockLocation('#' + hash);

      const payload = parseShareLink();
      expect(payload).not.toBeNull();
      expect(payload!.id).toBe('parse-test');
      expect(payload!.title).toBe('Parse Test');
      expect(payload!.type).toBe('theory');
      expect(payload!.lang).toBe('de');
    });

    it('returns null for invalid hash', () => {
      mockLocation('#/archive');
      expect(parseShareLink()).toBeNull();
    });

    it('returns null for corrupted data', () => {
      mockLocation('#/shared?data=!!!invalid!!!');
      expect(parseShareLink()).toBeNull();
    });
  });

  describe('isSharedView', () => {
    it('returns true for shared URLs', () => {
      mockLocation('#/shared?data=abc123');
      expect(isSharedView()).toBe(true);
    });

    it('returns false for non-shared URLs', () => {
      mockLocation('#/archive');
      expect(isSharedView()).toBe(false);
    });
  });

  describe('exportShareJSON', () => {
    it('creates a JSON blob download', () => {
      // Mock URL methods for jsdom
      const originalCreateObjectURL = URL.createObjectURL;
      const originalRevokeObjectURL = URL.revokeObjectURL;
      URL.createObjectURL = vi.fn().mockReturnValue('blob:test');
      URL.revokeObjectURL = vi.fn();

      const clickMock = vi.fn();
      const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue({
        click: clickMock,
        href: '',
        download: '',
      } as unknown as HTMLAnchorElement);

      const payload: SharePayload = {
        type: 'theory',
        id: 'export-test',
        title: 'Export Test',
        lang: 'de',
        sharedAt: new Date().toISOString(),
        version: 1,
      };

      exportShareJSON(payload);

      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(clickMock).toHaveBeenCalled();
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test');

      createElementSpy.mockRestore();
      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
    });
  });
});
