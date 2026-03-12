/**
 * Transformers.js Local Fallback Service
 * 
 * Provides local AI inference when cloud APIs are unavailable.
 * Uses @xenova/transformers for text generation, summarization, and classification.
 * 
 * Models are downloaded on first use and cached in the browser.
 * This is a graceful degradation — quality will be lower than cloud models
 * but ensures the app remains functional offline.
 * 
 * The import is fully dynamic to prevent the 810KB library from loading
 * unless the fallback is actually needed.
 */

// --- Types ---

export interface LocalFallbackResult {
  text: string;
  model: string;
  provider: 'local';
  confidence?: number;
  fromFallback: true;
}

export interface LocalFallbackStatus {
  available: boolean;
  modelsLoaded: string[];
  loading: boolean;
  error?: string;
}

// --- Model Configuration ---

/** Compact models suitable for browser inference */
const MODELS = {
  textGeneration: 'Xenova/Phi-3-mini-4k-instruct',
  summarization: 'Xenova/distilbart-cnn-6-6',
  classification: 'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
} as const;

// --- Pipeline Cache ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let textGenPipeline: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let summaryPipeline: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let classificationPipeline: any = null;
let isLoading = false;
let loadError: string | undefined;
const loadedModels: Set<string> = new Set();

// Loading progress callbacks
type ProgressCallback = (progress: { status: string; progress?: number; model?: string }) => void;
let onProgress: ProgressCallback | null = null;

/**
 * Set a progress callback for model downloads
 */
export function setLoadProgress(cb: ProgressCallback | null): void {
  onProgress = cb;
}

/** Dynamic import of Transformers.js — only loaded when fallback is triggered */
async function getTransformers() {
  const { pipeline, env } = await import('@xenova/transformers');
  env.allowLocalModels = false;
  env.useBrowserCache = true;
  return { pipeline };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function progressHandler(data: any) {
  if (onProgress && data) {
    onProgress({
      status: data.status ?? 'loading',
      progress: data.progress,
      model: data.file,
    });
  }
}

/**
 * Initialize text generation pipeline (lazy, cached)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getTextGenPipeline(): Promise<any> {
  if (textGenPipeline) return textGenPipeline;
  isLoading = true;
  try {
    const { pipeline } = await getTransformers();
    textGenPipeline = await pipeline('text-generation', MODELS.textGeneration, {
      progress_callback: progressHandler,
    });
    loadedModels.add(MODELS.textGeneration);
    return textGenPipeline;
  } catch (err) {
    loadError = (err as Error).message;
    throw err;
  } finally {
    isLoading = false;
  }
}

/**
 * Initialize summarization pipeline (lazy, cached)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getSummaryPipeline(): Promise<any> {
  if (summaryPipeline) return summaryPipeline;
  isLoading = true;
  try {
    const { pipeline } = await getTransformers();
    summaryPipeline = await pipeline('summarization', MODELS.summarization, {
      progress_callback: progressHandler,
    });
    loadedModels.add(MODELS.summarization);
    return summaryPipeline;
  } catch (err) {
    loadError = (err as Error).message;
    throw err;
  } finally {
    isLoading = false;
  }
}

/**
 * Initialize classification pipeline (lazy, cached)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getClassificationPipeline(): Promise<any> {
  if (classificationPipeline) return classificationPipeline;
  isLoading = true;
  try {
    const { pipeline } = await getTransformers();
    classificationPipeline = await pipeline('text-classification', MODELS.classification, {
      progress_callback: progressHandler,
    });
    loadedModels.add(MODELS.classification);
    return classificationPipeline;
  } catch (err) {
    loadError = (err as Error).message;
    throw err;
  } finally {
    isLoading = false;
  }
}

// --- Public API ---

/**
 * Generate text locally using Phi-3 mini.
 * Used as fallback for theory analysis, chat, satire, etc.
 */
export async function generateTextLocally(
  prompt: string,
  maxTokens = 512
): Promise<LocalFallbackResult> {
  const pipe = await getTextGenPipeline();
  const result = await pipe(prompt, {
    max_new_tokens: maxTokens,
    temperature: 0.7,
    do_sample: true,
    top_p: 0.9,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generated = Array.isArray(result) ? (result[0] as any)?.generated_text ?? '' : '';
  // Strip the prompt from the output if echoed
  const output = typeof generated === 'string' && generated.startsWith(prompt)
    ? generated.slice(prompt.length).trim()
    : String(generated).trim();

  return {
    text: output || 'Local model could not generate a response.',
    model: MODELS.textGeneration,
    provider: 'local',
    fromFallback: true,
  };
}

/**
 * Summarize text locally using DistilBART.
 * Used as fallback for theory analysis descriptions.
 */
export async function summarizeLocally(
  text: string,
  maxLength = 200,
  minLength = 50
): Promise<LocalFallbackResult> {
  const pipe = await getSummaryPipeline();
  const result = await pipe(text, {
    max_length: maxLength,
    min_length: minLength,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const summary = Array.isArray(result) ? (result[0] as any)?.summary_text ?? '' : '';

  return {
    text: String(summary) || text.substring(0, maxLength),
    model: MODELS.summarization,
    provider: 'local',
    fromFallback: true,
  };
}

/**
 * Classify text sentiment locally.
 * Used as a simple fallback for theory danger assessment.
 */
export async function classifyLocally(
  text: string
): Promise<LocalFallbackResult & { confidence: number }> {
  const pipe = await getClassificationPipeline();
  const result = await pipe(text);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const top = Array.isArray(result) ? (result[0] as any) : result;

  return {
    text: top?.label ?? 'UNKNOWN',
    model: MODELS.classification,
    provider: 'local',
    confidence: top?.score ?? 0,
    fromFallback: true,
  };
}

/**
 * Local fallback for theory analysis.
 * Produces a structured response similar to cloud AI but with reduced quality.
 */
export async function analyzeTheoryLocally(
  title: string,
  description: string,
  language: 'de' | 'en'
): Promise<{
  fullDescription: string;
  originStory: string;
  debunking: string;
  scientificConsensus: string;
  sources: string[];
  fromFallback: true;
}> {
  const langNote = language === 'de' ? 'Respond in German.' : 'Respond in English.';

  try {
    const pipe = await getTextGenPipeline();

    // Generate each section with a focused prompt
    const sections = await Promise.all([
      pipe(
        `Describe this conspiracy theory in detail: "${title}" — ${description}. ${langNote}`,
        { max_new_tokens: 256, temperature: 0.6, do_sample: true }
      ),
      pipe(
        `What is the origin story of the conspiracy theory "${title}"? ${langNote}`,
        { max_new_tokens: 128, temperature: 0.5, do_sample: true }
      ),
      pipe(
        `Debunk this claim with facts and logic: "${title}". ${langNote}`,
        { max_new_tokens: 192, temperature: 0.4, do_sample: true }
      ),
      pipe(
        `What does scientific consensus say about "${title}"? ${langNote}`,
        { max_new_tokens: 128, temperature: 0.4, do_sample: true }
      ),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const extract = (result: any, prompt: string) => {
      const text = Array.isArray(result) ? result[0]?.generated_text ?? '' : '';
      return typeof text === 'string' && text.startsWith(prompt) ? text.slice(prompt.length).trim() : String(text).trim();
    };

    return {
      fullDescription: extract(sections[0], '') || description,
      originStory: extract(sections[1], '') || 'Origin unknown (local fallback).',
      debunking: extract(sections[2], '') || 'Unable to generate debunking (offline mode).',
      scientificConsensus: extract(sections[3], '') || 'No consensus data available offline.',
      sources: ['[Generated locally — verify with online sources]'],
      fromFallback: true,
    };
  } catch {
    // If even local model fails, return a minimal structured response
    return {
      fullDescription: description || title,
      originStory: language === 'de' ? 'Nicht verfügbar (Offline-Modus)' : 'Not available (offline mode)',
      debunking: language === 'de' ? 'Keine Analyse möglich (Offline-Modus)' : 'Analysis not possible (offline mode)',
      scientificConsensus: language === 'de' ? 'Nicht verfügbar' : 'Not available',
      sources: [],
      fromFallback: true,
    };
  }
}

/**
 * Local fallback for chat responses.
 */
export async function chatLocally(
  message: string,
  language: 'de' | 'en'
): Promise<LocalFallbackResult> {
  const langNote = language === 'de' ? 'Respond in German.' : '';
  const prompt = `You are Dr. Veritas, a skeptical AI assistant. ${langNote}\nUser: ${message}\nAssistant:`;

  return generateTextLocally(prompt, 256);
}

/**
 * Local fallback for satire generation.
 */
export async function generateSatireLocally(
  topic: string,
  language: 'de' | 'en'
): Promise<{ title: string; content: string; fromFallback: true }> {
  const langNote = language === 'de' ? 'Respond in German.' : '';
  const prompt = `Write a funny satirical conspiracy theory about "${topic}". ${langNote} Format: Title followed by content.`;

  const result = await generateTextLocally(prompt, 384);
  const lines = result.text.split('\n').filter(Boolean);

  return {
    title: lines[0] || `The ${topic} Conspiracy`,
    content: lines.slice(1).join('\n') || result.text,
    fromFallback: true,
  };
}

/**
 * Check if the local fallback is available and report status.
 */
export function getLocalFallbackStatus(): LocalFallbackStatus {
  return {
    available: typeof Worker !== 'undefined' && typeof WebAssembly !== 'undefined',
    modelsLoaded: [...loadedModels],
    loading: isLoading,
    error: loadError,
  };
}

/**
 * Pre-warm a pipeline by triggering its initialization.
 * Call this proactively when the user goes offline.
 */
export async function preloadFallbackModels(): Promise<void> {
  try {
    await getTextGenPipeline();
  } catch {
    // Silent fail — models will be loaded on first use
  }
}

/**
 * Release cached pipelines to free memory.
 */
export function disposeFallbackModels(): void {
  textGenPipeline = null;
  summaryPipeline = null;
  classificationPipeline = null;
  loadedModels.clear();
  loadError = undefined;
}
