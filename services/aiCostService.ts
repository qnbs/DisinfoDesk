/**
 * AI Rate Limiter & Cost Tracker
 * 
 * Features:
 * - Per-provider sliding-window rate limiting
 * - Token cost estimation per model
 * - Session & lifetime cost tracking (persisted to IndexedDB)
 * - Budget alerts when thresholds are exceeded
 */
import { AIProvider } from '../types';

// --- Cost Tables (USD per 1M tokens, approximate as of 2025) ---

const COST_PER_MILLION_INPUT: Record<string, number> = {
  // Gemini
  'gemini-3.1-flash': 0.10,
  'gemini-3.1-pro': 1.25,
  'gemini-3.1-flash-image': 0.04,
  // xAI
  'grok-3-mini': 0.30,
  'grok-3': 3.00,
  // Anthropic
  'claude-sonnet-4-20250514': 3.00,
  'claude-opus-4-20250514': 15.00,
  // Ollama (local, free)
  'llama3.2': 0,
  'mistral': 0,
  'gemma2': 0,
  'phi3': 0,
  // Fallback (local)
  'local-fallback': 0,
};

const COST_PER_MILLION_OUTPUT: Record<string, number> = {
  'gemini-3.1-flash': 0.40,
  'gemini-3.1-pro': 5.00,
  'gemini-3.1-flash-image': 0.04,
  'grok-3-mini': 0.50,
  'grok-3': 15.00,
  'claude-sonnet-4-20250514': 15.00,
  'claude-opus-4-20250514': 75.00,
  'llama3.2': 0,
  'mistral': 0,
  'gemma2': 0,
  'phi3': 0,
  'local-fallback': 0,
};

// --- Rate Limiter ---

interface RateBucket {
  calls: number;
  windowStart: number;
}

/** Per-provider rate limits (calls per window) */
const RATE_LIMITS: Record<AIProvider | 'local', { maxCalls: number; windowMs: number }> = {
  gemini: { maxCalls: 60, windowMs: 3600000 },    // 60/hour
  xai: { maxCalls: 40, windowMs: 3600000 },        // 40/hour
  anthropic: { maxCalls: 40, windowMs: 3600000 },  // 40/hour
  ollama: { maxCalls: 200, windowMs: 3600000 },    // 200/hour (local, generous)
  local: { maxCalls: 300, windowMs: 3600000 },     // 300/hour (transformers.js, very generous)
};

const buckets: Record<string, RateBucket> = {};

/**
 * Check rate limit for a provider. Throws if exceeded.
 */
export function checkRateLimit(provider: AIProvider | 'local'): void {
  const limit = RATE_LIMITS[provider];
  if (!limit) return;

  const key = provider;
  if (!buckets[key]) {
    buckets[key] = { calls: 0, windowStart: Date.now() };
  }

  const bucket = buckets[key];
  const now = Date.now();

  // Reset window if expired
  if (now - bucket.windowStart > limit.windowMs) {
    bucket.calls = 0;
    bucket.windowStart = now;
  }

  if (bucket.calls >= limit.maxCalls) {
    const resetIn = Math.ceil((limit.windowMs - (now - bucket.windowStart)) / 60000);
    throw new Error(
      `RATE_LIMIT_EXCEEDED: ${provider} limit (${limit.maxCalls}/hr) reached. Resets in ~${resetIn}min.`
    );
  }

  bucket.calls++;
}

/**
 * Get remaining calls for a provider in the current window
 */
export function getRemainingCalls(provider: AIProvider | 'local'): number {
  const limit = RATE_LIMITS[provider];
  if (!limit) return Infinity;
  const bucket = buckets[provider];
  if (!bucket) return limit.maxCalls;
  const now = Date.now();
  if (now - bucket.windowStart > limit.windowMs) return limit.maxCalls;
  return Math.max(0, limit.maxCalls - bucket.calls);
}

// --- Cost Tracker ---

export interface CostEntry {
  timestamp: number;
  provider: AIProvider | 'local';
  model: string;
  inputTokens: number;
  outputTokens: number;
  costUSD: number;
  endpoint: string;
}

export interface CostSummary {
  sessionCostUSD: number;
  lifetimeCostUSD: number;
  totalCalls: number;
  byProvider: Record<string, { calls: number; costUSD: number }>;
  recentEntries: CostEntry[];
}

const SESSION_KEY = 'dd_cost_session';
const LIFETIME_KEY = 'dd_cost_lifetime';

/** Rough token estimation: ~4 chars per token for English, ~3 for other */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 3.5);
}

/**
 * Calculate cost for a single API call
 */
export function calculateCost(model: string, inputTokens: number, outputTokens: number): number {
  const inputRate = COST_PER_MILLION_INPUT[model] ?? COST_PER_MILLION_INPUT['gemini-3.1-flash'];
  const outputRate = COST_PER_MILLION_OUTPUT[model] ?? COST_PER_MILLION_OUTPUT['gemini-3.1-flash'];
  return (inputTokens * inputRate + outputTokens * outputRate) / 1_000_000;
}

/**
 * Record a completed API call's cost
 */
export function trackCost(
  provider: AIProvider | 'local',
  model: string,
  inputText: string,
  outputText: string,
  endpoint = ''
): CostEntry {
  const inputTokens = estimateTokens(inputText);
  const outputTokens = estimateTokens(outputText);
  const costUSD = calculateCost(model, inputTokens, outputTokens);

  const entry: CostEntry = {
    timestamp: Date.now(),
    provider,
    model,
    inputTokens,
    outputTokens,
    costUSD,
    endpoint,
  };

  // Update session totals
  try {
    const session = getSessionCosts();
    session.push(entry);
    // Keep last 500 entries per session
    if (session.length > 500) session.splice(0, session.length - 500);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch { /* sessionStorage may be unavailable */ }

  // Update lifetime total
  try {
    const lifetime = getLifetimeCost();
    localStorage.setItem(LIFETIME_KEY, JSON.stringify({
      totalCostUSD: lifetime + costUSD,
      lastUpdated: Date.now(),
    }));
  } catch { /* localStorage may be unavailable */ }

  return entry;
}

function getSessionCosts(): CostEntry[] {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function getLifetimeCost(): number {
  try {
    const raw = localStorage.getItem(LIFETIME_KEY);
    if (!raw) return 0;
    const data = JSON.parse(raw);
    return data.totalCostUSD ?? 0;
  } catch { return 0; }
}

/**
 * Get full cost summary
 */
export function getCostSummary(): CostSummary {
  const session = getSessionCosts();
  const sessionCost = session.reduce((sum, e) => sum + e.costUSD, 0);
  const lifetimeCost = getLifetimeCost();

  const byProvider: Record<string, { calls: number; costUSD: number }> = {};
  for (const entry of session) {
    const key = entry.provider;
    if (!byProvider[key]) byProvider[key] = { calls: 0, costUSD: 0 };
    byProvider[key].calls++;
    byProvider[key].costUSD += entry.costUSD;
  }

  return {
    sessionCostUSD: sessionCost,
    lifetimeCostUSD: lifetimeCost,
    totalCalls: session.length,
    byProvider,
    recentEntries: session.slice(-20),
  };
}

/**
 * Check if session cost exceeds budget. Returns warning if near limit.
 */
export function checkBudget(budgetUSD: number): { ok: boolean; warning?: string; spent: number } {
  const session = getSessionCosts();
  const spent = session.reduce((sum, e) => sum + e.costUSD, 0);
  
  if (spent >= budgetUSD) {
    return { ok: false, warning: `BUDGET_EXCEEDED: Session cost $${spent.toFixed(4)} exceeds budget $${budgetUSD.toFixed(2)}`, spent };
  }
  if (spent >= budgetUSD * 0.8) {
    return { ok: true, warning: `BUDGET_WARNING: Session cost $${spent.toFixed(4)} is at ${((spent / budgetUSD) * 100).toFixed(0)}% of budget`, spent };
  }
  return { ok: true, spent };
}

/**
 * Reset session cost tracking
 */
export function resetSessionCosts(): void {
  try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
}
