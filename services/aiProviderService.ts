/**
 * AI Provider Abstraction Layer
 * Routes AI calls to the correct backend: Gemini SDK, xAI, Anthropic Claude, or local Ollama.
 * Hardened with prompt injection guard, rate limiting, cost tracking, Zod validation, and DOMPurify.
 */
import { AIProvider } from '../types';
import { secureApiKeyService } from './secureApiKeyService';
import { guardPromptInput, sanitizeAIOutput } from './aiGuardService';
import { checkRateLimit, trackCost } from './aiCostService';
import { validateProviderResponse } from './aiValidationSchemas';
import { generateTextLocally, getLocalFallbackStatus } from './localFallbackService';

export interface ProviderChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ProviderConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  responseFormat?: 'text' | 'json';
}

export interface ProviderResponse {
  text: string;
  provider: AIProvider;
  model: string;
}

// --- Provider Endpoint Configs ---

const PROVIDER_ENDPOINTS: Record<Exclude<AIProvider, 'gemini' | 'local'>, string> = {
  xai: 'https://api.x.ai/v1/chat/completions',
  anthropic: 'https://api.anthropic.com/v1/messages',
  ollama: '' // Set dynamically from settings
};

const DEFAULT_MODELS: Record<AIProvider, string> = {
  gemini: 'gemini-3.1-flash',
  xai: 'grok-3-mini',
  anthropic: 'claude-sonnet-4-20250514',
  ollama: 'llama3.2',
  local: 'local-phi3'
};

export const PROVIDER_MODEL_OPTIONS: Record<AIProvider, { id: string; label: string; desc: string }[]> = {
  gemini: [
    { id: 'gemini-3.1-flash', label: 'Gemini 3.1 Flash', desc: 'Fast & efficient' },
    { id: 'gemini-3.1-pro', label: 'Gemini 3.1 Pro', desc: 'Advanced reasoning' },
  ],
  xai: [
    { id: 'grok-3-mini', label: 'Grok 3 Mini', desc: 'Fast & affordable' },
    { id: 'grok-3', label: 'Grok 3', desc: 'Full power' },
  ],
  anthropic: [
    { id: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4', desc: 'Balanced' },
    { id: 'claude-opus-4-20250514', label: 'Claude Opus 4', desc: 'Most capable' },
  ],
  ollama: [
    { id: 'llama3.2', label: 'LLaMA 3.2', desc: 'Meta open-source' },
    { id: 'mistral', label: 'Mistral', desc: 'European open-source' },
    { id: 'gemma2', label: 'Gemma 2', desc: 'Google open-source' },
    { id: 'phi3', label: 'Phi-3', desc: 'Microsoft compact' },
  ],
  local: [
    { id: 'local-phi3', label: 'Phi-3 Mini (Browser)', desc: 'No API key needed — runs in browser via WebAssembly' },
    { id: 'local-distilbart', label: 'DistilBART (Browser)', desc: 'Optimized for summaries — no API key needed' },
  ]
};

// --- OpenAI-Compatible API Call (xAI & Ollama) ---

async function callOpenAICompatible(
  endpoint: string,
  apiKey: string | null,
  messages: ProviderChatMessage[],
  config: ProviderConfig,
  model: string
): Promise<string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const body: Record<string, unknown> = {
    model,
    messages,
    temperature: config.temperature ?? 0.7,
    max_tokens: config.maxTokens ?? 2048,
  };

  if (config.responseFormat === 'json') {
    body.response_format = { type: 'json_object' };
  }

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60000),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    throw new Error(`Provider API error ${resp.status}: ${errText.substring(0, 200)}`);
  }

  const data = await resp.json();
  return data.choices?.[0]?.message?.content ?? '';
}

// --- Anthropic Messages API ---

async function callAnthropic(
  apiKey: string,
  messages: ProviderChatMessage[],
  config: ProviderConfig,
  model: string
): Promise<string> {
  const systemMsg = messages.find(m => m.role === 'system');
  const chatMessages = messages.filter(m => m.role !== 'system').map(m => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  const body: Record<string, unknown> = {
    model,
    max_tokens: config.maxTokens ?? 2048,
    messages: chatMessages,
  };

  if (systemMsg) {
    body.system = systemMsg.content;
  }

  if (config.temperature !== undefined) {
    body.temperature = config.temperature;
  }

  const resp = await fetch(PROVIDER_ENDPOINTS.anthropic, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60000),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    throw new Error(`Anthropic API error ${resp.status}: ${errText.substring(0, 200)}`);
  }

  const data = await resp.json();
  const textBlocks = data.content?.filter((b: { type: string }) => b.type === 'text') ?? [];
  return textBlocks.map((b: { text: string }) => b.text).join('');
}

// --- Unified Provider Call ---

export async function callProvider(
  provider: AIProvider,
  messages: ProviderChatMessage[],
  config: ProviderConfig & { ollamaEndpoint?: string } = {}
): Promise<ProviderResponse> {
  // Rate limit check
  checkRateLimit(provider);

  // Guard all user messages against prompt injection
  const guardedMessages = messages.map(m => {
    if (m.role === 'user') {
      const guarded = guardPromptInput(m.content, 8000);
      return { ...m, content: guarded.sanitized };
    }
    return m;
  });

  const model = config.model || DEFAULT_MODELS[provider];
  const inputText = guardedMessages.map(m => m.content).join('\n');

  if (provider === 'gemini') {
    throw new Error('GEMINI_USE_NATIVE_SDK: Use geminiService.ts for Gemini calls.');
  }

  if (provider === 'local') {
    const result = await generateTextLocally(
      guardedMessages.map(m => `${m.role}: ${m.content}`).join('\n'),
      config.maxTokens ?? 512
    );
    return {
      text: sanitizeAIOutput(result.text),
      provider: 'local',
      model: result.model,
    };
  }

  let text: string;

  if (provider === 'ollama') {
    const baseUrl = config.ollamaEndpoint || 'http://localhost:11434';
    const endpoint = `${baseUrl}/v1/chat/completions`;
    text = await callOpenAICompatible(endpoint, null, guardedMessages, config, model);
  } else {
    // xAI and Anthropic need API keys
    const keyId = provider === 'xai' ? 'xai' : 'anthropic';
    const apiKey = await secureApiKeyService.getProviderKey(keyId);
    if (!apiKey) {
      const name = provider === 'xai' ? 'xAI' : 'Anthropic';
      throw new Error(`MISSING_${provider.toUpperCase()}_API_KEY: Please add your ${name} API key in Settings.`);
    }

    if (provider === 'anthropic') {
      text = await callAnthropic(apiKey, guardedMessages, config, model);
    } else {
      text = await callOpenAICompatible(PROVIDER_ENDPOINTS.xai, apiKey, guardedMessages, config, model);
    }
  }

  // Track cost
  trackCost(provider, model, inputText, text, 'callProvider');

  // Sanitize output with DOMPurify
  const sanitizedText = sanitizeAIOutput(text);

  // Validate response structure with Zod
  const response: ProviderResponse = { text: sanitizedText, provider, model };
  const validated = validateProviderResponse(response);

  return validated || response;
}

// --- Provider Test Endpoints ---

export async function testProviderConnection(
  provider: AIProvider,
  apiKey?: string,
  ollamaEndpoint?: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    if (provider === 'gemini') {
      if (!apiKey) return { ok: false, error: 'NO_KEY' };
      return secureApiKeyService.testApiKey(apiKey);
    }

    if (provider === 'ollama') {
      const baseUrl = ollamaEndpoint || 'http://localhost:11434';
      const resp = await fetch(`${baseUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      return resp.ok ? { ok: true } : { ok: false, error: `HTTP_${resp.status}` };
    }

    if (provider === 'xai') {
      if (!apiKey) return { ok: false, error: 'NO_KEY' };
      const resp = await fetch('https://api.x.ai/v1/models', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${apiKey}` },
        signal: AbortSignal.timeout(10000),
      });
      return resp.ok ? { ok: true } : { ok: false, error: resp.status === 401 ? 'INVALID_KEY' : `HTTP_${resp.status}` };
    }

    if (provider === 'anthropic') {
      if (!apiKey) return { ok: false, error: 'NO_KEY' };
      // Anthropic doesn't have a pure /models endpoint that works with just an API key easily,
      // so we send a minimal request to validate the key
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1,
          messages: [{ role: 'user', content: 'Hi' }],
        }),
        signal: AbortSignal.timeout(10000),
      });
      if (resp.ok || resp.status === 200) return { ok: true };
      if (resp.status === 401) return { ok: false, error: 'INVALID_KEY' };
      return { ok: false, error: `HTTP_${resp.status}` };
    }

    if (provider === 'local') {
      const status = getLocalFallbackStatus();
      return status.available ? { ok: true } : { ok: false, error: 'WEBASSEMBLY_NOT_SUPPORTED' };
    }

    return { ok: false, error: 'UNKNOWN_PROVIDER' };
  } catch {
    return { ok: false, error: 'NETWORK_ERROR' };
  }
}

export const getDefaultModel = (provider: AIProvider): string => DEFAULT_MODELS[provider];
