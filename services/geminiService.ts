
import { GoogleGenAI, HarmCategory, HarmBlockThreshold, Schema, Type, Chat, LiveSession, LiveServerMessage, Modality } from "@google/genai";
import { Theory, TheoryDetail, Language, SatireResponse, SourceItem, GroundingChunk, MediaItem, MediaAnalysisResponse, SatireOptions, RawTheoryAnalysisJSON } from '../types';
import { dbService } from './dbService';

interface AIConfig {
    model?: string;
    temperature?: number;
    thinkingBudget?: number;
    forceRefresh?: boolean;
}

// Strictly use process.env.API_KEY as per best practices
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("CRITICAL: API_KEY is missing. AI features will not function.");
    throw new Error("API Key missing. Check .env configuration.");
  }
  return new GoogleGenAI({ apiKey });
};

// Robust helper for Theory Analysis (where Schema is not allowed due to Search)
const cleanJsonOutput = (text: string): string => {
  if (!text) return "{}";
  
  // 1. Remove Markdown code blocks if present (```json ... ```)
  let cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  
  // 2. Find the first '{' and last '}' to strip preamble/postscript
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  // 3. Remove control characters that break JSON.parse
  // Also handles potentially escaped newlines that confuse the parser
  cleaned = cleaned.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
  
  return cleaned;
};

// Helper to flatten response objects into displayable strings
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

const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
];

/**
 * Analyzes a theory using Google Search Grounding & Thinking Models.
 */
export const analyzeTheoryWithGemini = async (theory: Theory, language: Language, configOverride?: AIConfig): Promise<TheoryDetail> => {
  if (!configOverride?.forceRefresh) {
    try {
      const cached = await dbService.getAnalysis(theory.id);
      if (cached && cached.language === language) return cached.data;
    } catch (e) { /* ignore cache errors */ }
  }

  try {
    const ai = getAiClient();
    const model = configOverride?.model || 'gemini-2.5-flash'; 
    const isThinkingModel = model.includes('2.5') || model.includes('3-pro');
    
    // Dynamic thinking budget based on user settings, default to higher for deep debunking
    // IMPORTANT: thinkingBudget allows models to "reason" before answering.
    const thinkingConfig = isThinkingModel 
        ? { thinkingConfig: { thinkingBudget: configOverride?.thinkingBudget || 1024 } }
        : {};

    const prompt = `
      Analyze the conspiracy theory: "${theory.title}" (${theory.shortDescription}).
      Language: ${language === 'de' ? 'German' : 'English'}.
      
      You act as a skeptical fact-checking engine.
      Use Google Search to find real-world origins, facts, and scientific rebuttals.
      
      CRITICAL: You MUST return a VALID JSON object string. 
      DO NOT return Markdown formatting, code blocks, or introductory text. Just the JSON string.
      
      Required JSON Structure:
      {
        "fullDescription": "Comprehensive narrative (400+ words)",
        "originStory": "History, inventors, dates",
        "debunking": "Factual refutation using logic and evidence",
        "scientificConsensus": "What experts say",
        "sources": ["List of string titles of key books/articles"]
      }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: configOverride?.temperature ?? 0.4,
        safetySettings: SAFETY_SETTINGS,
        ...thinkingConfig
      }
    });

    const text = cleanJsonOutput(response.text || "{}");
    let rawData: RawTheoryAnalysisJSON;
    
    try {
        rawData = JSON.parse(text) as RawTheoryAnalysisJSON;
    } catch (e) {
        console.error("JSON Parse Error on:", text);
        // Fallback structure to prevent UI crash
        rawData = {
            fullDescription: response.text || "Analysis format error. Raw output received.",
            originStory: "Data parsing failed.",
            debunking: "Check source logs.",
            scientificConsensus: "Unknown",
            sources: []
        };
    }

    const groundingChunks = (response.candidates?.[0]?.groundingMetadata?.groundingChunks as unknown as GroundingChunk[]) || [];
    const groundedSources: SourceItem[] = groundingChunks
      .filter(chunk => chunk.web?.uri && chunk.web?.title)
      .map(chunk => ({
        title: chunk.web!.title!,
        url: chunk.web!.uri!,
        sourceType: 'WEB'
      }));

    if (rawData.sources && Array.isArray(rawData.sources)) {
        rawData.sources.forEach((s) => {
            const title = typeof s === 'string' ? s : s.title;
            if (title && !groundedSources.some(gs => gs.title === title)) {
               groundedSources.push({ title: title, sourceType: 'ACADEMIC' });
            }
        });
    }

    const result: TheoryDetail = {
      ...theory,
      fullDescription: flattenToString(rawData.fullDescription) || "No data.",
      originStory: flattenToString(rawData.originStory) || "-",
      debunking: flattenToString(rawData.debunking) || "-",
      scientificConsensus: flattenToString(rawData.scientificConsensus) || "-",
      sources: groundedSources
    };

    dbService.saveAnalysis({
      id: theory.id,
      title: theory.title,
      timestamp: Date.now(),
      data: result,
      language
    }).catch(console.error);

    return result;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const enhanceTheoryContent = async (
    currentTitle: string, 
    currentDesc: string, 
    mode: 'EXPAND' | 'RED_TEAM' | 'TAGS', 
    language: Language
): Promise<string | string[]> => {
    const ai = getAiClient();
    const langLabel = language === 'de' ? 'German' : 'English';

    let prompt = "";
    let schema: Schema | undefined;

    if (mode === 'EXPAND') {
        prompt = `Act as a creative writer. Expand this short conspiracy theory description into a compelling 3-paragraph narrative suitable for a dossier. 
        Title: "${currentTitle}". 
        Draft: "${currentDesc}". 
        Language: ${langLabel}.`;
    } else if (mode === 'RED_TEAM') {
        prompt = `Act as a ruthless logician. critique this conspiracy theory. List 3 major logical fallacies or gaps in the narrative. 
        Theory: "${currentTitle} - ${currentDesc}". 
        Language: ${langLabel}. Bullet points only.`;
    } else if (mode === 'TAGS') {
        prompt = `Analyze this theory and generate 8 relevant metadata tags.
        Theory: "${currentTitle} - ${currentDesc}".
        Language: ${langLabel}.`;
        
        schema = {
            type: Type.OBJECT,
            properties: {
                tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["tags"]
        };
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            temperature: 0.7,
            responseMimeType: schema ? "application/json" : "text/plain",
            responseSchema: schema
        }
    });

    if (mode === 'TAGS') {
        try {
            const json = JSON.parse(response.text!);
            return json.tags as string[];
        } catch { return []; }
    }

    return response.text || "";
};

export const draftTheoryContent = async (title: string, category: string, language: Language): Promise<{ description: string, tags: string[] }> => {
    const ai = getAiClient();
    
    const schema: Schema = {
        type: Type.OBJECT,
        properties: {
            description: { type: Type.STRING, description: "A concise 2-3 sentence summary." },
            tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5 relevant tags" }
        },
        required: ["description", "tags"]
    };

    const prompt = `Draft a summary for a conspiracy theory titled "${title}" in category "${category}". 
    Language: ${language === 'de' ? 'German' : 'English'}.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
            temperature: 0.7
        }
    });

    try {
        return JSON.parse(response.text!) as { description: string, tags: string[] };
    } catch (e) {
        console.error("Draft parsing failed", e);
        return { description: "Draft generation failed.", tags: [] };
    }
};

export const analyzeMediaWithGemini = async (item: MediaItem, language: Language, configOverride?: AIConfig): Promise<MediaAnalysisResponse> => {
  if (!configOverride?.forceRefresh) {
    try {
      const cached = await dbService.getMediaAnalysis(item.id);
      if (cached && cached.language === language) return cached.data;
    } catch (e) { /* ignore */ }
  }

  try {
    const ai = getAiClient();
    const model = configOverride?.model || 'gemini-3-pro-preview';

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        plotSummary: { type: Type.STRING },
        hiddenSymbolism: { type: Type.STRING },
        predictiveProgramming: { type: Type.STRING },
        realWorldParallels: { type: Type.STRING },
      },
      required: ["plotSummary", "hiddenSymbolism", "predictiveProgramming", "realWorldParallels"],
    };

    const prompt = `Analyze "${item.title}" (${item.type}, ${item.year}) regarding conspiracy theories. Language: ${language === 'de' ? 'German' : 'English'}.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: { 
        temperature: 0.5,
        safetySettings: SAFETY_SETTINGS,
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const rawData = JSON.parse(response.text!) as MediaAnalysisResponse;

    dbService.saveMediaAnalysis({
        id: item.id,
        title: item.title,
        timestamp: Date.now(),
        data: rawData,
        language,
        mediaType: item.type
    }).catch(console.error);

    return rawData;

  } catch (error) {
    console.error("Media Analysis Error", error);
    throw error;
  }
};

export const generateSatireTheory = async (language: Language, options?: SatireOptions): Promise<SatireResponse> => {
  try {
    const ai = getAiClient();
    const topic = options?.topic || 'Office Supplies';
    const level = options?.paranoiaLevel || 50;
    const archetype = options?.archetype || 'General';

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        content: { type: Type.STRING },
      },
      required: ["title", "content"],
    };

    const prompt = `Invent a satirical conspiracy theory about "${topic}".
      Archetype: "${archetype}". Paranoia Level: ${level}/100.
      Language: ${language === 'de' ? 'German' : 'English'}.
      Format as a funny, pseudoscientific narrative.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { 
          temperature: 0.8 + (level / 500), 
          safetySettings: SAFETY_SETTINGS,
          responseMimeType: "application/json",
          responseSchema: schema
      }
    });
    
    return JSON.parse(response.text!) as SatireResponse;
  } catch (e) {
    console.error("Satire Gen Error:", e);
    throw e;
  }
}

export const generateTheoryImage = async (theory: Theory, language: Language, customPrompt?: string): Promise<string | null> => {
  try {
    const ai = getAiClient();
    // Allow custom prompting for the editor, fallback to automatic for viewing
    const prompt = customPrompt || (language === 'de'
        ? `Düstere, cineastische Illustration für Verschwörungstheorie: "${theory.title}". Stil: Akte X, 8k, fotorealistisch.`
        : `Dark, cinematic illustration for conspiracy theory: "${theory.title}". Style: X-Files, 8k, photorealistic.`);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
      config: { safetySettings: SAFETY_SETTINGS }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};

// --- LIVE API IMPLEMENTATION ---

export const connectLiveSession = async (
    onAudioData: (base64: string) => void,
    onClose: () => void,
    language: Language
): Promise<LiveSession> => {
    const ai = getAiClient();
    
    const config = {
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
            },
            systemInstruction: language === 'de' 
                ? "Du bist 'Dr. Veritas', eine skeptische KI. Antworte kurz, prägnant und wissenschaftlich fundiert." 
                : "You are 'Dr. Veritas', a skeptical AI. Respond concisely and scientifically."
        }
    };

    const session = await ai.live.connect({
        ...config,
        callbacks: {
            onopen: () => console.log('[Live] Session Connected'),
            onmessage: (msg: LiveServerMessage) => {
                const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                if (audioData) onAudioData(audioData);
            },
            onclose: () => {
                console.log('[Live] Session Closed');
                onClose();
            },
            onerror: (err) => {
                console.error('[Live] Error', err);
                onClose();
            }
        }
    });

    return session;
};

// --- AUDIO UTILITIES ---

export const blobToB64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export function base64ToUint8Array(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// --- STANDARD CHAT ---

let chatSession: Chat | null = null; 
let currentChatModel: string | null = null;

/**
 * Streams chat response. Handles session reset if model changes.
 */
export const streamChatWithSkeptic = async function* (history: string[], message: string, language: Language, configOverride?: AIConfig) {
  try {
    const ai = getAiClient();
    const modelName = configOverride?.model || 'gemini-2.5-flash';
    
    const isThinkingModel = modelName.includes('2.5') || modelName.includes('3-pro');
    const thinkingConfig = isThinkingModel 
        ? { thinkingConfig: { thinkingBudget: configOverride?.thinkingBudget || 1024 } } 
        : {};

    const systemInstruction = language === 'de' 
        ? "Du bist 'Dr. Veritas', eine skeptische KI. Bewerte Behauptungen mit [VERDICT: WAHR/FALSCH/UNBELEGT] am Anfang." 
        : "You are 'Dr. Veritas', a skeptical AI. Rate claims with [VERDICT: TRUE/FALSE/UNVERIFIED] at the start.";

    // IMPORTANT: If model changes, we MUST recreate the chat to apply new config/model
    if (chatSession && currentChatModel !== modelName) {
        chatSession = null;
    }

    if (!chatSession) {
        currentChatModel = modelName;
        // Map simplified string history back to Content objects
        const historyContent = history.map((msg, i) => ({
            role: i % 2 === 0 ? 'user' : 'model',
            parts: [{ text: msg }],
        }));

        chatSession = ai.chats.create({
            model: modelName,
            config: { 
                systemInstruction: systemInstruction,
                temperature: configOverride?.temperature ?? 0.7,
                safetySettings: SAFETY_SETTINGS,
                ...thinkingConfig
            },
            history: historyContent
        });
    }

    const result = await chatSession.sendMessageStream({ message });
    for await (const chunk of result) {
        yield chunk.text;
    }
  } catch (error) {
    console.error("Stream Error:", error);
    throw error;
  }
};

export const resetChatSession = () => {
    chatSession = null;
    currentChatModel = null;
};
