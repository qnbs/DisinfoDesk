import { describe, it, expect, vi, beforeEach } from 'vitest';
import { secureApiKeyService } from '../../services/secureApiKeyService';

// The IndexedDB mock in vitest.setup.ts provides basic operations.
// For secureApiKeyService we need a more complete mock since it uses
// real DB transactions. We'll test the validateKeyFormat method directly
// and mock the crypto/DB operations for the others.

describe('secureApiKeyService', () => {
  describe('validateKeyFormat', () => {
    it('rejects empty keys', () => {
      const result = secureApiKeyService.validateKeyFormat('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('EMPTY_API_KEY');
    });

    it('rejects short keys', () => {
      const result = secureApiKeyService.validateKeyFormat('AIzaShort');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('KEY_TOO_SHORT');
    });

    it('rejects keys not matching Gemini format', () => {
      const result = secureApiKeyService.validateKeyFormat('XXXX' + 'A'.repeat(35));
      expect(result.valid).toBe(false);
      expect(result.error).toBe('INVALID_KEY_FORMAT');
    });

    it('accepts valid Gemini key format', () => {
      const key = 'AIza' + 'A'.repeat(35);
      const result = secureApiKeyService.validateKeyFormat(key);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('trims whitespace before validation', () => {
      const key = '  AIza' + 'A'.repeat(35) + '  ';
      const result = secureApiKeyService.validateKeyFormat(key);
      // validateKeyFormat trims the input before checking
      expect(result.valid).toBe(true);
    });
  });

  describe('testApiKey', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('returns ok:true for valid API key response', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response('{}', { status: 200 })
      );

      const result = await secureApiKeyService.testApiKey('AIza' + 'A'.repeat(35));
      expect(result.ok).toBe(true);
    });

    it('returns INVALID_KEY for 403 response', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response('', { status: 403 })
      );

      const result = await secureApiKeyService.testApiKey('bad-key');
      expect(result.ok).toBe(false);
      expect(result.error).toBe('INVALID_KEY');
    });

    it('returns NETWORK_ERROR on fetch failure', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network'));

      const result = await secureApiKeyService.testApiKey('any-key');
      expect(result.ok).toBe(false);
      expect(result.error).toBe('NETWORK_ERROR');
    });

    it('returns HTTP status for other errors', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response('', { status: 500 })
      );

      const result = await secureApiKeyService.testApiKey('any-key');
      expect(result.ok).toBe(false);
      expect(result.error).toBe('HTTP_500');
    });
  });
});
