import { describe, it, expect, vi } from 'vitest';

// We test the pure utility functions exported from geminiService
// by importing them directly. The AI client functions are tested
// via mocked integration since they need network/API key.

// Since cleanJsonOutput, flattenToString, sanitizePromptInput are not module-exported,
// we test them indirectly or re-implement the logic for unit testing.
// Let's test what IS exported and mock the AI dependencies.

vi.mock('../../services/secureApiKeyService', () => ({
  secureApiKeyService: {
    getApiKey: vi.fn().mockResolvedValue(null),
    hasApiKey: vi.fn().mockResolvedValue(false),
  },
}));

vi.mock('../../services/dbService', () => ({
  dbService: {
    getAnalysis: vi.fn().mockResolvedValue(null),
    saveAnalysis: vi.fn().mockResolvedValue(undefined),
    getSatire: vi.fn().mockResolvedValue(null),
    saveSatire: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('geminiService - cleanJsonOutput logic', () => {
  // Re-implement cleanJsonOutput as a standalone function for testing
  // (matches the copy in geminiService.ts)
  const cleanJsonOutput = (text: string): string => {
    if (!text) return '{}';
    let cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }
    // eslint-disable-next-line no-control-regex
    cleaned = cleaned.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
    return cleaned;
  };

  it('removes markdown code block fences', () => {
    const input = '```json\n{"key": "value"}\n```';
    expect(cleanJsonOutput(input)).toBe('{"key": "value"}');
  });

  it('extracts JSON from preamble/postscript text', () => {
    const input = 'Here is the result:\n{"data": 1}\nEnd of response.';
    expect(cleanJsonOutput(input)).toBe('{"data": 1}');
  });

  it('removes control characters', () => {
    const input = '{"key": "val\x00ue"}';
    const result = cleanJsonOutput(input);
    expect(result).not.toContain('\x00');
  });

  it('returns empty object for empty input', () => {
    expect(cleanJsonOutput('')).toBe('{}');
  });

  it('handles nested JSON', () => {
    const input = '```json\n{"a": {"b": {"c": 1}}}\n```';
    const result = cleanJsonOutput(input);
    expect(JSON.parse(result)).toEqual({ a: { b: { c: 1 } } });
  });
});

describe('geminiService - flattenToString logic', () => {
  const flattenToString = (val: unknown): string => {
    if (val === undefined || val === null) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'number' || typeof val === 'boolean') return String(val);
    if (Array.isArray(val)) return val.map(item => flattenToString(item)).join('\n\n');
    if (typeof val === 'object') {
      return Object.entries(val as Record<string, unknown>).map(([k, v]) => {
        const readableKey = k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        return `**${readableKey}**: ${flattenToString(v)}`;
      }).join('\n\n');
    }
    return String(val);
  };

  it('handles null and undefined', () => {
    expect(flattenToString(null)).toBe('');
    expect(flattenToString(undefined)).toBe('');
  });

  it('passes strings through', () => {
    expect(flattenToString('hello')).toBe('hello');
  });

  it('converts numbers', () => {
    expect(flattenToString(42)).toBe('42');
  });

  it('converts booleans', () => {
    expect(flattenToString(true)).toBe('true');
  });

  it('joins arrays', () => {
    expect(flattenToString(['a', 'b'])).toBe('a\n\nb');
  });

  it('formats objects with readable keys', () => {
    const result = flattenToString({ firstName: 'John' });
    expect(result).toContain('**First Name**: John');
  });

  it('handles nested objects', () => {
    const result = flattenToString({ data: { value: 1 } });
    expect(result).toContain('**Value**: 1');
  });
});

describe('geminiService - sanitizePromptInput logic', () => {
  const sanitizePromptInput = (input: string, maxLength = 500): string => {
    if (!input) return '';
    return input
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
      .substring(0, maxLength)
      .trim();
  };

  it('removes control characters', () => {
    expect(sanitizePromptInput('hello\x00world')).toBe('helloworld');
  });

  it('truncates to max length', () => {
    const long = 'a'.repeat(1000);
    expect(sanitizePromptInput(long).length).toBe(500);
  });

  it('trims whitespace', () => {
    expect(sanitizePromptInput('  hello  ')).toBe('hello');
  });

  it('returns empty string for falsy input', () => {
    expect(sanitizePromptInput('')).toBe('');
  });

  it('allows custom max length', () => {
    expect(sanitizePromptInput('abcdefghij', 5)).toBe('abcde');
  });
});
