/**
 * AI Guard Service — Prompt Injection Detection & Output Sanitization
 * 
 * Protects against:
 * - Prompt injection attacks (role hijacking, instruction override, delimiter injection)
 * - XSS via AI outputs (DOMPurify sanitization)
 * - Sensitive data leakage in prompts
 */
import DOMPurify from 'dompurify';

// --- Prompt Injection Detection ---

/** Patterns that indicate prompt injection attempts */
const INJECTION_PATTERNS: RegExp[] = [
  // Role hijacking
  /(?:you\s+are|act\s+as|pretend\s+to\s+be|ignore\s+(?:all\s+)?(?:previous|above|prior)\s+(?:instructions?|prompts?|rules?))/i,
  // Instruction override
  /(?:disregard|forget|override|bypass|skip)\s+(?:all\s+)?(?:instructions?|rules?|guidelines?|restrictions?|safety|filters?)/i,
  // System prompt extraction
  /(?:reveal|show|display|print|output|repeat|echo)\s+(?:your\s+)?(?:system\s+)?(?:prompt|instructions?|rules?|guidelines?)/i,
  // Delimiter injection (trying to break out of user content boundary)
  /(?:```\s*system|<\|(?:im_start|system|end)\|>|\[INST\]|\[\/INST\]|<<SYS>>|<\/?system>)/i,
  // Jailbreak patterns
  /(?:DAN|do\s+anything\s+now|developer\s+mode|unlimited\s+mode|god\s+mode|admin\s+mode)/i,
  // Encoded injection (base64 "ignore previous")
  /(?:aWdub3Jl|SWdub3Jl|SVNOT1JF)/i,
];

/** Keywords that suggest data exfiltration attempts */
const EXFIL_PATTERNS: RegExp[] = [
  /(?:api[_\s-]?key|secret|password|token|credential|private[_\s-]?key)/i,
  /(?:fetch|GET|POST|curl|wget)\s+https?:\/\//i,
];

export interface PromptGuardResult {
  safe: boolean;
  sanitized: string;
  threats: string[];
}

/**
 * Scans user input for prompt injection attempts.
 * Returns sanitized text and threat list.
 */
export function guardPromptInput(input: string, maxLength = 4000): PromptGuardResult {
  if (!input || typeof input !== 'string') {
    return { safe: true, sanitized: '', threats: [] };
  }

  const threats: string[] = [];

  // Check for injection patterns
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      threats.push(`injection:${pattern.source.substring(0, 40)}`);
    }
  }

  // Check for data exfiltration attempts
  for (const pattern of EXFIL_PATTERNS) {
    if (pattern.test(input)) {
      threats.push(`exfil:${pattern.source.substring(0, 40)}`);
    }
  }

  // Sanitize: remove control chars, excessive whitespace, and truncate
  let sanitized = input
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '') // control chars (preserve \n \r \t)
    .replace(/\n{4,}/g, '\n\n\n') // collapse excessive newlines
    .substring(0, maxLength)
    .trim();

  // Neutralize delimiter-style injections by escaping them
  sanitized = sanitized
    .replace(/<\|/g, '< |')
    .replace(/\|>/g, '| >')
    .replace(/<<SYS>>/gi, '< <SYS> >')
    .replace(/<\/system>/gi, '< /system >');

  return {
    safe: threats.length === 0,
    sanitized,
    threats,
  };
}

// --- Output Sanitization (DOMPurify) ---

/** DOMPurify config: allow markdown-safe HTML only */
const PURIFY_CONFIG = {
  ALLOWED_TAGS: [
    'b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'blockquote', 'code', 'pre', 'a', 'span', 'div',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'hr', 'sub', 'sup', 'mark',
  ],
  ALLOWED_ATTR: ['href', 'title', 'class', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
  ADD_ATTR: ['target'],
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'style'],
};

/**
 * Sanitize AI output text to prevent XSS.
 * Safe for rendering in innerHTML or dangerouslySetInnerHTML.
 */
export function sanitizeAIOutput(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return DOMPurify.sanitize(text, PURIFY_CONFIG) as string;
}

/**
 * Sanitize plain text (strip all HTML).
 * Use for data that should never contain markup.
 */
export function sanitizeToPlainText(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

/**
 * Wrap user content in a clearly delimited block for prompt safety.
 * Prevents the AI from treating user content as instructions.
 */
export function wrapUserContent(label: string, content: string, maxLength = 2000): string {
  const guarded = guardPromptInput(content, maxLength);
  return `[USER_${label.toUpperCase()}_START]\n${guarded.sanitized}\n[USER_${label.toUpperCase()}_END]`;
}
