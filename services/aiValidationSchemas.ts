/**
 * Zod Schemas for all AI Responses
 * 
 * Provides runtime validation for every AI response shape.
 * Ensures type safety even when the AI returns malformed data.
 * Each schema has a safe parse function that returns validated data or a fallback.
 */
import { z } from 'zod';
import { sanitizeAIOutput, sanitizeToPlainText } from './aiGuardService';

// --- Theory Analysis Schema ---

export const TheoryAnalysisSchema = z.object({
  fullDescription: z.string().default('No description available.'),
  originStory: z.string().default('Origin unknown.'),
  debunking: z.string().default('No debunking data.'),
  scientificConsensus: z.string().default('No consensus data.'),
  sources: z.array(
    z.union([
      z.string(),
      z.object({
        title: z.string(),
        url: z.string().url().optional(),
      }),
    ])
  ).default([]),
});

export type ValidatedTheoryAnalysis = z.infer<typeof TheoryAnalysisSchema>;

/**
 * Validate and sanitize theory analysis response
 */
export function validateTheoryAnalysis(data: unknown): ValidatedTheoryAnalysis {
  const result = TheoryAnalysisSchema.safeParse(data);
  if (result.success) {
    return {
      ...result.data,
      fullDescription: sanitizeAIOutput(result.data.fullDescription),
      originStory: sanitizeAIOutput(result.data.originStory),
      debunking: sanitizeAIOutput(result.data.debunking),
      scientificConsensus: sanitizeAIOutput(result.data.scientificConsensus),
    };
  }
  // Return safe defaults on validation failure
  return {
    fullDescription: 'Analysis format error — data could not be validated.',
    originStory: '-',
    debunking: '-',
    scientificConsensus: '-',
    sources: [],
  };
}

// --- Media Analysis Schema ---

export const MediaAnalysisSchema = z.object({
  plotSummary: z.string().default('No plot summary.'),
  hiddenSymbolism: z.string().default('No symbolism analysis.'),
  predictiveProgramming: z.string().default('No predictive programming data.'),
  realWorldParallels: z.string().default('No parallels identified.'),
});

export type ValidatedMediaAnalysis = z.infer<typeof MediaAnalysisSchema>;

export function validateMediaAnalysis(data: unknown): ValidatedMediaAnalysis {
  const result = MediaAnalysisSchema.safeParse(data);
  if (result.success) {
    return {
      plotSummary: sanitizeAIOutput(result.data.plotSummary),
      hiddenSymbolism: sanitizeAIOutput(result.data.hiddenSymbolism),
      predictiveProgramming: sanitizeAIOutput(result.data.predictiveProgramming),
      realWorldParallels: sanitizeAIOutput(result.data.realWorldParallels),
    };
  }
  return {
    plotSummary: 'Analysis format error.',
    hiddenSymbolism: '-',
    predictiveProgramming: '-',
    realWorldParallels: '-',
  };
}

// --- Satire Response Schema ---

export const SatireResponseSchema = z.object({
  title: z.string().min(1).default('Untitled Satire'),
  content: z.string().min(1).default('Content generation failed.'),
});

export type ValidatedSatireResponse = z.infer<typeof SatireResponseSchema>;

export function validateSatireResponse(data: unknown): ValidatedSatireResponse {
  const result = SatireResponseSchema.safeParse(data);
  if (result.success) {
    return {
      title: sanitizeToPlainText(result.data.title),
      content: sanitizeAIOutput(result.data.content),
    };
  }
  return { title: 'Generation Error', content: 'Satire could not be validated.' };
}

// --- Chat Message Schema ---

export const ChatResponseSchema = z.object({
  text: z.string().min(1),
});

export function validateChatResponse(text: unknown): string {
  if (typeof text !== 'string' || !text.trim()) {
    return 'No response received.';
  }
  return sanitizeAIOutput(text);
}

// --- Enhance Theory Schema ---

export const EnhanceTagsSchema = z.object({
  tags: z.array(z.string().max(100)).max(20).default([]),
});

export function validateEnhanceTags(data: unknown): string[] {
  const result = EnhanceTagsSchema.safeParse(data);
  if (result.success) {
    return result.data.tags.map(t => sanitizeToPlainText(t));
  }
  return [];
}

export function validateEnhanceText(text: unknown): string {
  if (typeof text !== 'string') return '';
  return sanitizeAIOutput(text);
}

// --- Provider Response Schema ---

export const ProviderResponseSchema = z.object({
  text: z.string(),
  provider: z.enum(['gemini', 'xai', 'anthropic', 'ollama']),
  model: z.string(),
});

export function validateProviderResponse(data: unknown): z.infer<typeof ProviderResponseSchema> | null {
  const result = ProviderResponseSchema.safeParse(data);
  if (result.success) {
    return {
      ...result.data,
      text: sanitizeAIOutput(result.data.text),
    };
  }
  return null;
}

// --- Generic JSON Response Validator ---

/**
 * Attempt to parse and validate arbitrary JSON from AI against a Zod schema.
 * Returns the validated object or null.
 */
export function validateAIJson<T>(
  rawText: string,
  schema: z.ZodType<T>,
  cleanFn?: (text: string) => string
): T | null {
  try {
    const cleaned = cleanFn ? cleanFn(rawText) : rawText;
    const parsed = JSON.parse(cleaned);
    const result = schema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
