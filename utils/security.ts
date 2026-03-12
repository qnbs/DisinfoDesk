/**
 * Security utilities and Content Security Policy helpers
 * Following OWASP best practices
 */

/**
 * Sanitize HTML to prevent XSS attacks
 * Uses DOMPurify-like approach without external dependency
 */
export function sanitizeHtml(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Validate URL for safe navigation
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    // Only allow http(s) protocols
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}

/**
 * Generate CSP nonce for inline scripts
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate API key format (basic check)
 */
export function isValidApiKey(key: string): boolean {
  // Gemini keys start with AIza and are 39 characters
  return /^AIza[0-9A-Za-z_-]{35}$/.test(key);
}

/**
 * Hash string using SubtleCrypto API
 */
export async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Check if running in secure context (HTTPS)
 */
export function isSecureContext(): boolean {
  return window.isSecureContext || window.location.protocol === 'https:';
}

/**
 * Sanitize filename for safe downloads
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9._-]/gi, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 255);
}

/**
 * Validate CORS origin
 */
export function isAllowedOrigin(origin: string, allowedOrigins: string[]): boolean {
  return allowedOrigins.some(allowed => {
    if (allowed === '*') return true;
    if (allowed.startsWith('*.')) {
      const domain = allowed.substring(2);
      return origin.endsWith(domain);
    }
    return origin === allowed;
  });
}

/**
 * Create safe download link
 */
export function createSafeDownloadLink(
  blob: Blob,
  _filename: string
): { url: string; cleanup: () => void } {
  const url = URL.createObjectURL(blob);
  const cleanup = () => URL.revokeObjectURL(url);
  
  return {
    url,
    cleanup
  };
}

/**
 * Escape HTML entities
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Rate limiter for API calls
 */
export class RateLimiter {
  private calls: number = 0;
  private resetTime: number = Date.now();
  
  constructor(
    private maxCalls: number,
    private windowMs: number
  ) {}

  canMakeRequest(): boolean {
    const now = Date.now();
    
    // Reset if window has passed
    if (now - this.resetTime > this.windowMs) {
      this.calls = 0;
      this.resetTime = now;
    }

    if (this.calls >= this.maxCalls) {
      return false;
    }

    this.calls++;
    return true;
  }

  getRemainingCalls(): number {
    return Math.max(0, this.maxCalls - this.calls);
  }

  getResetTimeMs(): number {
    return Math.max(0, this.windowMs - (Date.now() - this.resetTime));
  }
}

export default {
  sanitizeHtml,
  isValidUrl,
  generateNonce,
  isValidApiKey,
  hashString,
  isSecureContext,
  sanitizeFilename,
  isAllowedOrigin,
  createSafeDownloadLink,
  escapeHtml,
  RateLimiter
};
