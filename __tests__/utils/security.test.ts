import { describe, it, expect } from 'vitest';
import {
  sanitizeHtml,
  isValidUrl,
  generateNonce,
  isValidApiKey,
  hashString,
  isSecureContext,
  sanitizeFilename,
  isAllowedOrigin,
  escapeHtml,
  RateLimiter,
} from '../../utils/security';

// ── sanitizeHtml ──
describe('sanitizeHtml', () => {
  it('strips HTML tags by encoding them', () => {
    const result = sanitizeHtml('<script>alert("xss")</script>');
    expect(result).not.toContain('<script>');
    expect(result).toContain('&lt;script&gt;');
  });

  it('passes plain text through', () => {
    expect(sanitizeHtml('Hello World')).toBe('Hello World');
  });

  it('encodes angle brackets', () => {
    expect(sanitizeHtml('<img onerror="hack()">')).toContain('&lt;img');
  });
});

// ── isValidUrl ──
describe('isValidUrl', () => {
  it('accepts http URLs', () => {
    expect(isValidUrl('http://example.com')).toBe(true);
  });

  it('accepts https URLs', () => {
    expect(isValidUrl('https://example.com/path')).toBe(true);
  });

  it('rejects javascript: protocol', () => {
    expect(isValidUrl('javascript:alert(1)')).toBe(false);
  });

  it('rejects data: URIs', () => {
    expect(isValidUrl('data:text/html,<h1>hi</h1>')).toBe(false);
  });

  it('rejects invalid URLs', () => {
    expect(isValidUrl('not a url')).toBe(false);
  });

  it('rejects ftp protocol', () => {
    expect(isValidUrl('ftp://files.example.com')).toBe(false);
  });
});

// ── generateNonce ──
describe('generateNonce', () => {
  it('returns a 32-character hex string', () => {
    const nonce = generateNonce();
    expect(nonce).toMatch(/^[0-9a-f]{32}$/);
  });

  it('generates unique values', () => {
    const nonces = new Set(Array.from({ length: 50 }, () => generateNonce()));
    expect(nonces.size).toBe(50);
  });
});

// ── isValidApiKey ──
describe('isValidApiKey', () => {
  it('accepts valid Gemini key format', () => {
    expect(isValidApiKey('AIza' + 'A'.repeat(35))).toBe(true);
  });

  it('rejects keys not starting with AIza', () => {
    expect(isValidApiKey('XXXX' + 'A'.repeat(35))).toBe(false);
  });

  it('rejects short keys', () => {
    expect(isValidApiKey('AIzaShort')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidApiKey('')).toBe(false);
  });
});

// ── hashString ──
describe('hashString', () => {
  it('returns a 64-character hex string (SHA-256)', async () => {
    const hash = await hashString('test');
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('produces consistent hashes', async () => {
    const hash1 = await hashString('hello');
    const hash2 = await hashString('hello');
    expect(hash1).toBe(hash2);
  });

  it('produces different hashes for different inputs', async () => {
    const hash1 = await hashString('abc');
    const hash2 = await hashString('xyz');
    expect(hash1).not.toBe(hash2);
  });
});

// ── isSecureContext ──
describe('isSecureContext', () => {
  it('returns a boolean', () => {
    expect(typeof isSecureContext()).toBe('boolean');
  });
});

// ── sanitizeFilename ──
describe('sanitizeFilename', () => {
  it('replaces special characters with underscores', () => {
    const result = sanitizeFilename('file name!@#$.txt');
    // Special chars replaced by _, then consecutive _ collapsed
    expect(result).not.toContain('!');
    expect(result).not.toContain('@');
    expect(result).not.toContain('#');
    expect(result).not.toContain('$');
  });

  it('collapses multiple underscores', () => {
    expect(sanitizeFilename('a   b   c')).toBe('a_b_c');
  });

  it('truncates to 255 characters', () => {
    const longName = 'a'.repeat(300);
    expect(sanitizeFilename(longName).length).toBe(255);
  });

  it('preserves alphanumeric chars and dots', () => {
    expect(sanitizeFilename('report-2024.pdf')).toBe('report-2024.pdf');
  });
});

// ── isAllowedOrigin ──
describe('isAllowedOrigin', () => {
  it('matches exact origin', () => {
    expect(isAllowedOrigin('https://example.com', ['https://example.com'])).toBe(true);
  });

  it('matches wildcard', () => {
    expect(isAllowedOrigin('https://any.com', ['*'])).toBe(true);
  });

  it('matches subdomain wildcard', () => {
    expect(isAllowedOrigin('https://sub.example.com', ['*.example.com'])).toBe(true);
  });

  it('rejects non-matching origin', () => {
    expect(isAllowedOrigin('https://evil.com', ['https://example.com'])).toBe(false);
  });
});

// ── escapeHtml ──
describe('escapeHtml', () => {
  it('escapes all dangerous characters', () => {
    const result = escapeHtml('<script>alert("xss" & \'stuff\')</script>');
    expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot; &amp; &#039;stuff&#039;)&lt;/script&gt;');
  });

  it('passes safe text through', () => {
    expect(escapeHtml('Hello World 123')).toBe('Hello World 123');
  });
});

// ── RateLimiter ──
describe('RateLimiter', () => {
  it('allows requests within limit', () => {
    const limiter = new RateLimiter(3, 60000);
    expect(limiter.canMakeRequest()).toBe(true);
    expect(limiter.canMakeRequest()).toBe(true);
    expect(limiter.canMakeRequest()).toBe(true);
  });

  it('blocks requests over limit', () => {
    const limiter = new RateLimiter(2, 60000);
    limiter.canMakeRequest();
    limiter.canMakeRequest();
    expect(limiter.canMakeRequest()).toBe(false);
  });

  it('reports remaining calls', () => {
    const limiter = new RateLimiter(5, 60000);
    limiter.canMakeRequest();
    limiter.canMakeRequest();
    expect(limiter.getRemainingCalls()).toBe(3);
  });

  it('resets after window expires', () => {
    const limiter = new RateLimiter(1, 100);
    limiter.canMakeRequest();
    expect(limiter.canMakeRequest()).toBe(false);

    // Simulate time passing by manipulating internal state
    // The window check uses Date.now() so we advance past window
    vi.useFakeTimers();
    vi.advanceTimersByTime(200);
    expect(limiter.canMakeRequest()).toBe(true);
    vi.useRealTimers();
  });
});
