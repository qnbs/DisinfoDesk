import { createApi, fakeBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import { Theory, Language, AppError, SatireOptions } from '../../types';
import { analyzeTheoryWithGemini, generateSatireTheory, generateTheoryImage } from '../../services/geminiService';
import { sanitizeAIOutput } from '../../services/aiGuardService';

// Retry wrapper with exponential backoff (max 3 attempts)
const retryingBaseQuery = retry(fakeBaseQuery<AppError>(), { maxRetries: 2 });

// Define Tag Types
export const TAGS = {
  ANALYSIS: 'Analysis' as const,
  IMAGE: 'Image' as const,
  SATIRE: 'Satire' as const
};

export const aiApi = createApi({
  reducerPath: 'aiApi',
  baseQuery: retryingBaseQuery,
  tagTypes: [TAGS.ANALYSIS, TAGS.IMAGE, TAGS.SATIRE],
  refetchOnMountOrArgChange: 300, // Re-fetch if components remount after 5 mins to ensure fresh but cached data
  
  endpoints: (builder) => ({
    // 1. Analyze Theory
    // Uses sophisticated tagging to cache by ID. If we invalidate 'Analysis', we can target specific IDs.
    analyzeTheory: builder.query({
      queryFn: async ({ theory, language, model, temp, budget }: { theory: Theory; language: Language; model: string; temp: number, budget?: number }) => {
        try {
          const data = await analyzeTheoryWithGemini(theory, language, { model, temperature: temp, thinkingBudget: budget });
          // Sanitize all text fields with DOMPurify before returning to store
          return { 
            data: {
              ...data,
              fullDescription: sanitizeAIOutput(data.fullDescription || ''),
              originStory: sanitizeAIOutput(data.originStory || ''),
              debunking: sanitizeAIOutput(data.debunking || ''),
              scientificConsensus: sanitizeAIOutput(data.scientificConsensus || ''),
            }
          };
        } catch (error) {
          const err = error as Error;
          // Don't retry on auth/config errors
          if (err.message?.includes('API key') || err.message?.includes('permission')) {
            retry.fail({ message: err.message, stack: err.stack, code: err.name });
          }
          return { error: { message: err.message, stack: err.stack, code: err.name } };
        }
      },
      // Cache Key: Theory ID + Language (User switches lang, gets new cache)
      providesTags: (result, error, { theory, language }) => 
        result 
          ? [{ type: TAGS.ANALYSIS, id: `${theory.id}_${language}` }] 
          : [{ type: TAGS.ANALYSIS, id: 'LIST' }],
      keepUnusedDataFor: 600, // 10 minutes cache
    }),
    
    // 2. Generate Image
    generateImage: builder.mutation({
      queryFn: async ({ theory, language }: { theory: Theory; language: Language }) => {
        try {
          const data = await generateTheoryImage(theory, language);
          return { data };
        } catch (error) {
          const err = error as Error;
          if (err.message?.includes('API key') || err.message?.includes('permission')) {
            retry.fail({ message: err.message, stack: err.stack, code: err.name });
          }
          return { error: { message: err.message, stack: err.stack, code: err.name } };
        }
      },
      // Invalidate the specific analysis tag if an image generation somehow updates metadata (future proofing)
      invalidatesTags: (result, error, { theory, language }) => [
        { type: TAGS.IMAGE, id: `${theory.id}_${language}` }
      ]
    }),

    // 3. Generate Satire
    generateSatire: builder.mutation({
      queryFn: async ({ language, options }: { language: Language; options: SatireOptions }) => {
        try {
          const data = await generateSatireTheory(language, options);
          return { 
            data: {
              ...data,
              title: sanitizeAIOutput(data.title),
              content: sanitizeAIOutput(data.content),
            }
          };
        } catch (error) {
          const err = error as Error;
          if (err.message?.includes('API key') || err.message?.includes('permission')) {
            retry.fail({ message: err.message, stack: err.stack, code: err.name });
          }
          return { error: { message: err.message, stack: err.stack, code: err.name } };
        }
      },
      // Satire is ephemeral, invalidating LIST is a safe default
      invalidatesTags: [{ type: TAGS.SATIRE, id: 'LIST' }]
    }),
  }),
});

export const { 
  useAnalyzeTheoryQuery, 
  useGenerateImageMutation, 
  useGenerateSatireMutation 
} = aiApi;