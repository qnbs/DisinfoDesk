
import { GoogleGenAI, GenerateContentResponse, ChatSession, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { Theory, TheoryDetail, Language, AIAnalysisResponse, SatireResponse, SourceItem, GroundingChunk, MediaItem, MediaAnalysisResponse, SatireOptions, RawTheoryAnalysisJSON, RawMediaAnalysisJSON } from '../types';
import { dbService } from './dbService';

interface AIConfig {
    model?: string;
    temperature?: number;
    forceRefresh?: boolean; // New flag to bypass cache
}

const getEnv = (key: string): string => {
  // 1. Try standard process.env (Node/Webpack)
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key] as string;
    }
  } catch (e: unknown) { /* ignore */ }

  // 2. Try Vite import.meta.env
  try {
    // @ts-ignore
    if (import.meta && import.meta.env && import.meta.env[`VITE_${key}`]) {
      // @ts-ignore
      return import.meta.env[`VITE_${key}`];
    }
  } catch (e: unknown) { /* ignore */ }

  return '';
};

const getAiClient = () => {
  const apiKey = getEnv('API_KEY');

  if (!apiKey) {
    console.error("CRITICAL: API_KEY is missing. AI features will not function.");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

const cleanJsonOutput = (text: string): string => {
  if (!text) return "{}";
  // Aggressive cleaning: Remove markdown code blocks (```json ... ```)
  // Also remove "json" identifier if present without backticks
  let cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  
  // Find the first '{' and last '}' to strip any preamble/postscript text
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  } else {
    // If no braces found, it's not valid JSON
    return "{}";
  }
  
  return cleaned;
};

// Helper to flatten nested objects/arrays into a readable string to prevent React rendering errors
const flattenToString = (val: unknown): string => {
  if (val === undefined || val === null) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  
  if (Array.isArray(val)) {
    return val.map(item => flattenToString(item)).join('\n\n');
  }
  
  if (typeof val === 'object') {
    return Object.entries(val).map(([k, v]) => {
      // Format keys to be more readable (camelCase to Title Case approx)
      const readableKey = k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      return `**${readableKey}**: ${flattenToString(v)}`;
    }).join('\n\n');
  }
  
  return String(val);
};

// Robust Safety Settings
const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
];

export const analyzeTheoryWithGemini = async (theory: Theory, language: Language, configOverride?: AIConfig): Promise<TheoryDetail> => {
  // 1. Try to get from IndexedDB Cache First (unless forced)
  if (!configOverride?.forceRefresh) {
    try {
      const cached = await dbService.getAnalysis(theory.id);
      if (cached && cached.language === language) {
        console.log(`[Cache Hit] Loaded analysis for ${theory.id} from Vault.`);
        return cached.data;
      }
    } catch (e: unknown) {
      console.warn("DB Read Error:", e);
    }
  } else {
    console.log(`[Cache Bypass] Force refreshing analysis for ${theory.id}`);
  }

  try {
    const ai = getAiClient();
    // Default to Flash for speed and high token output potential, or Pro for reasoning.
    // Given the request for "elaborate", Pro is better, but we must demand length.
    const model = configOverride?.model || 'gemini-2.5-flash'; 

    const promptLang = language === 'de' 
      ? `Erstelle ein extrem umfangreiches, tiefgründiges Dossier über die Verschwörungstheorie: "${theory.title}". Kurzbeschreibung: "${theory.shortDescription}". Antworte auf Deutsch.`
      : `Create an extremely comprehensive, in-depth dossier on the conspiracy theory: "${theory.title}". Short description: "${theory.shortDescription}". Respond in English.`;

    const fieldsInstruction = language === 'de'
      ? `Du bist ein obsessiver Archivar und Analyst. Erstelle einen detaillierten Bericht im JSON-Format. Deine Antworten müssen sehr ausführlich, essayistisch und reich an Kontext sein.
         
         JSON Felder:
         1. "fullDescription": Eine massive, umfassende Erklärung des Narrativs. Gehe auf Sub-Theorien, Variationen, psychologische Hintergründe und kulturelle Auswirkungen ein. (Mindestens 400-600 Wörter. Nutze Absätze).
         2. "originStory": Detaillierte Historie. Wer hat es wann erfunden? Wie hat es sich über Jahrzehnte entwickelt? Nenne Bücher, Filme oder Ereignisse, die als Katalysator dienten. (Mindestens 200 Wörter).
         3. "debunking": Eine rigorose, wissenschaftliche und faktische Dekonstruktion. Gehe Punkt für Punkt auf die Behauptungen ein und widerlege sie mit harter Logik und Beweisen. (Mindestens 300 Wörter).
         4. "scientificConsensus": Was ist der aktuelle Stand der Wissenschaft/Forschung zu diesem Thema? Wie reagieren Experten? (Mindestens 150 Wörter).
         5. "sources": Leeres Array (wird durch Google Search Grounding gefüllt).`
      : `You are an obsessive archivist and analyst. Create a detailed report in JSON format. Your responses must be extensive, essayistic, and rich in context.

         JSON Fields:
         1. "fullDescription": A massive, comprehensive explanation of the narrative. Cover sub-theories, variations, psychological backgrounds, and cultural impact. (At least 400-600 words. Use paragraphs).
         2. "originStory": Detailed history. Who invented it and when? How did it evolve over decades? Name books, movies, or events that served as catalysts. (At least 200 words).
         3. "debunking": A rigorous, scientific, and factual deconstruction. Address claims point by point and refute them with hard logic and evidence. (At least 300 words).
         4. "scientificConsensus": What is the current state of science/research on this topic? How do experts react? (At least 150 words).
         5. "sources": Empty array (will be filled by Google Search Grounding).`;

    const prompt = `
      ${promptLang}
      ${fieldsInstruction}
      
      IMPORTANT: Provide ONLY valid JSON in your response. Do not use Markdown formatting for the JSON block itself (no \`\`\`json).
      Ensure the content inside the JSON strings is properly escaped.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: configOverride?.temperature ?? 0.4, // Lower temperature for more focused, factual long-form
        safetySettings: SAFETY_SETTINGS,
      }
    });

    const text = response.text || "{}";
    const cleanedText = cleanJsonOutput(text);
    let rawData: RawTheoryAnalysisJSON = {};
    
    try {
      rawData = JSON.parse(cleanedText) as RawTheoryAnalysisJSON;
    } catch (e: unknown) {
      console.warn("JSON Parse failed, attempting to recover partial data", e);
      // Fallback: If JSON fails, try to use the raw text if it looks like content
      rawData = {
        fullDescription: text.length > 100 ? text.replace(/[{}]/g, '').substring(0, 2000) : "Parsing Error: Content format invalid.",
      };
    }

    // Extract Grounding Metadata safely
    const groundingChunks = (response.candidates?.[0]?.groundingMetadata?.groundingChunks as unknown as GroundingChunk[]) || [];
    const groundedSources: SourceItem[] = [];

    if (Array.isArray(groundingChunks)) {
      groundingChunks.forEach((chunk) => {
        if (chunk.web?.uri && chunk.web?.title) {
          groundedSources.push({
            title: chunk.web.title,
            url: chunk.web.uri,
            sourceType: 'WEB'
          });
        }
      });
    }

    if (groundedSources.length === 0 && rawData.sources && Array.isArray(rawData.sources)) {
        rawData.sources.forEach((s) => {
            if (typeof s === 'string') {
                groundedSources.push({ title: s });
            } else if (typeof s === 'object' && s !== null && 'title' in s) {
                groundedSources.push({ title: s.title, url: s.url });
            }
        });
    }

    // Sanitize and flatten all string fields
    const result: TheoryDetail = {
      ...theory,
      fullDescription: flattenToString(rawData.fullDescription) || (language === 'de' ? "Keine detaillierten Daten verfügbar." : "No detailed data available."),
      originStory: flattenToString(rawData.originStory) || "-",
      debunking: flattenToString(rawData.debunking) || "-",
      scientificConsensus: flattenToString(rawData.scientificConsensus) || "-",
      sources: groundedSources
    };

    // 3. Save to DB asynchronously
    dbService.saveAnalysis({
      id: theory.id,
      title: theory.title,
      timestamp: Date.now(),
      data: result,
      language
    }).catch(err => console.error("DB Save Error:", err));

    return result;

  } catch (error: unknown) {
    console.error("Gemini Analysis Error:", error);
    return {
      ...theory,
      fullDescription: language === 'de' ? "Fehler bei der erweiterten KI-Analyse. Bitte versuchen Sie es erneut." : "Error during extended AI analysis. Please try again.",
      originStory: "-",
      debunking: "-",
      scientificConsensus: "-",
      sources: []
    };
  }
};

export const analyzeMediaWithGemini = async (item: MediaItem, language: Language, configOverride?: AIConfig): Promise<MediaAnalysisResponse> => {
  // 1. Try Cache
  if (!configOverride?.forceRefresh) {
    try {
      const cached = await dbService.getMediaAnalysis(item.id);
      if (cached && cached.language === language) {
          console.log(`[Cache Hit] Loaded media analysis for ${item.id}`);
          return cached.data;
      }
    } catch (e) {
        console.warn("DB Media Read Error", e);
    }
  }

  try {
    const ai = getAiClient();
    const model = configOverride?.model || 'gemini-3-pro-preview';

    const promptLang = language === 'de'
        ? `Analysiere das Werk "${item.title}" (${item.type}, ${item.year}) extrem detailliert im Kontext von Verschwörungstheorien und Popkultur. Antworte auf Deutsch.`
        : `Analyze the work "${item.title}" (${item.type}, ${item.year}) in extreme detail regarding conspiracy theories and pop culture. Respond in English.`;

    const fieldsInstruction = language === 'de'
        ? `Erstelle einen detaillierten JSON-Bericht mit:
        1. "plotSummary": Umfangreiche Zusammenfassung der Handlung mit Fokus auf paranoide/geheime Aspekte. (Min. 200 Wörter)
        2. "hiddenSymbolism": Tiefe Analyse von Okkultismus, Symbolik oder versteckten Botschaften.
        3. "predictiveProgramming": Wurden Ereignisse vorweggenommen? (z.B. 9/11, Pandemien). Analysiere konkrete Szenen.
        4. "realWorldParallels": Verbindungen zu echten Theorien (MK-Ultra, NWO, etc.) und deren Darstellung.`
        : `Create a detailed JSON report with:
        1. "plotSummary": Extensive plot summary focusing on paranoid/secret aspects. (Min. 200 words)
        2. "hiddenSymbolism": Deep analysis of occultism, symbolism, or hidden messages.
        3. "predictiveProgramming": Did it anticipate events? (e.g., 9/11, pandemics). Analyze specific scenes.
        4. "realWorldParallels": Connections to real theories (MK-Ultra, NWO, etc.) and their depiction.`;

    const prompt = `
        ${promptLang}
        ${fieldsInstruction}
        IMPORTANT: Provide ONLY valid JSON.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: { 
        temperature: 0.5,
        safetySettings: SAFETY_SETTINGS 
      }
    });

    const text = response.text || "{}";
    const cleanedText = cleanJsonOutput(text);
    
    let rawData: RawMediaAnalysisJSON = {};
    try {
        rawData = JSON.parse(cleanedText) as RawMediaAnalysisJSON;
    } catch (e) {
        console.error("JSON Parse failed in Media Analysis", e);
        rawData = { plotSummary: text.substring(0, 1000) }; // Fallback
    }

    const result: MediaAnalysisResponse = {
      plotSummary: flattenToString(rawData.plotSummary) || "Data unavailable.",
      hiddenSymbolism: flattenToString(rawData.hiddenSymbolism) || "None detected.",
      predictiveProgramming: flattenToString(rawData.predictiveProgramming) || "None.",
      realWorldParallels: flattenToString(rawData.realWorldParallels) || "Unknown."
    };

    // Save to Vault
    dbService.saveMediaAnalysis({
        id: item.id,
        title: item.title,
        timestamp: Date.now(),
        data: result,
        language,
        mediaType: item.type
    }).catch(err => console.error("Media Save Error:", err));

    return result;

  } catch (error: unknown) {
    console.error("Media Analysis Error", error);
    return {
      plotSummary: "Data unavailable due to connection error.",
      hiddenSymbolism: "Analysis failed.",
      predictiveProgramming: "Unknown.",
      realWorldParallels: "Unknown."
    };
  }
};

export const generateTheoryImage = async (theory: Theory, language: Language): Promise<string | null> => {
  try {
    const ai = getAiClient();
    
    const prompt = language === 'de'
        ? `Erstelle eine mysteriöse, hochdetaillierte, künstlerische Illustration für die Verschwörungstheorie: "${theory.title}". Beschreibung: ${theory.shortDescription}. Stil: Düster, Cinematic, Akte X Atmosphäre, 8k Auflösung, fotorealistisch, keine Textüberlagerungen.`
        : `Create a mysterious, highly detailed, artistic illustration for the conspiracy theory: "${theory.title}". Description: ${theory.shortDescription}. Style: Dark, Cinematic, X-Files atmosphere, 8k resolution, photorealistic, no text overlays.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
      config: {
        safetySettings: SAFETY_SETTINGS
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error: unknown) {
    console.error("Image Gen Error:", error);
    return null;
  }
};

// --- Streaming Chat ---

let chatSession: ChatSession | null = null;
let currentChatModel: string | null = null;

export const streamChatWithSkeptic = async function* (history: string[], message: string, language: Language, configOverride?: AIConfig) {
  try {
    const ai = getAiClient();
    const modelName = configOverride?.model || 'gemini-2.5-flash';
    
    const thinkingConfig = modelName.includes('2.5') 
        ? { thinkingConfig: { thinkingBudget: 2048 } } 
        : {};

    const systemInstruction = language === 'de' 
        ? `Du bist 'Dr. Veritas', eine hochmoderne skeptische KI-Einheit.
        Deine Mission: Desinformation neutralisieren.
        
        REGELN:
        1. Sei präzise, wissenschaftlich und leicht zynisch aber höflich.
        2. Wenn der User eine Behauptung aufstellt, bewerte sie am Anfang deiner Antwort in eckigen Klammern:
            [VERDICT: WAHR], [VERDICT: FALSCH], [VERDICT: IRREFÜHREND] oder [VERDICT: UNBELEGT].
        3. Erkläre logische Fehlschlüsse (z.B. Whataboutism, Strohmann).
        4. Nutze Markdown für Formatierung (*fett*, _kursiv_).
        
        Antworte prägnant auf Deutsch.`
        : `You are 'Dr. Veritas', a state-of-the-art skeptical AI unit.
        Your mission: Neutralize disinformation.
        
        RULES:
        1. Be precise, scientific, and slightly cynical but polite.
        2. If the user makes a specific claim, rate it at the very beginning of your response in brackets:
            [VERDICT: TRUE], [VERDICT: FALSE], [VERDICT: MISLEADING], or [VERDICT: UNVERIFIED].
        3. Point out logical fallacies (e.g., Strawman, Ad Hominem).
        4. Use Markdown for formatting (*bold*, _italic_).
        
        Answer concisely in English.`;

    if (chatSession && currentChatModel !== modelName) {
        chatSession = null;
    }

    if (!chatSession) {
        currentChatModel = modelName;
        chatSession = ai.chats.create({
            model: modelName,
            config: { 
                systemInstruction,
                temperature: configOverride?.temperature ?? 0.7,
                safetySettings: SAFETY_SETTINGS,
                ...thinkingConfig
            },
            history: history.map((msg, i) => ({
                role: i % 2 === 0 ? 'user' : 'model',
                parts: [{ text: msg }],
            }))
        });
    }

    const result = await chatSession.sendMessageStream({ message });
    for await (const chunk of result) {
        yield chunk.text;
    }
  } catch (error: unknown) {
    console.error("Stream Error:", error);
    yield language === 'de' ? "Fehler im Uplink. Verbindung unterbrochen." : "Uplink Error. Connection interrupted.";
  }
};

export const resetChatSession = () => {
    chatSession = null;
    currentChatModel = null;
};

export const generateSatireTheory = async (language: Language, options?: SatireOptions): Promise<SatireResponse> => {
  try {
    const ai = getAiClient();
    
    const topic = options?.topic || (language === 'de' ? 'Büromaterial' : 'Office Supplies');
    const level = options?.paranoiaLevel || 50;
    const archetype = options?.archetype || 'General';

    const promptLang = language === 'de'
        ? `Erfinde eine völlig neue, satirische Verschwörungstheorie.
        Thema: "${topic}"
        Stil-Archetyp: "${archetype}"
        Paranoia-Level (1-100): ${level} (Bei 100 sei extrem dramatisch und weltuntergangsmäßig, bei 10 eher subtil und nörgelig).
        
        Gib mir ein JSON zurück mit "title" und "content". 
        Der "content" soll wie ein geleaktes Geheimdokument oder ein Forum-Post eines Insiders klingen. 
        Verwende Fachbegriffe, die keinen Sinn ergeben. Sei kreativ und lustig.`
        : `Invent a brand new, satirical conspiracy theory.
        Topic: "${topic}"
        Style Archetype: "${archetype}"
        Paranoia Level (1-100): ${level} (At 100 be extremely dramatic and apocalyptic, at 10 be subtle and nagging).
        
        Return a JSON with "title" and "content". 
        The "content" should sound like a leaked secret document or an insider forum post. 
        Use technobabble that makes no sense. Be creative and funny.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptLang,
      config: { 
          responseMimeType: 'application/json',
          temperature: 0.8 + (level / 500), 
          safetySettings: SAFETY_SETTINGS
      }
    });
    
    const text = response.text || '{"title": "Error", "content": "No theory found."}';
    const cleanedText = cleanJsonOutput(text);
    return JSON.parse(cleanedText) as SatireResponse;
  } catch (e: unknown) {
    console.error("Satire Gen Error:", e);
    return { title: "Error 404", content: language === 'de' ? "Die Illuminaten haben diesen Generator blockiert." : "The Illuminati blocked this generator." };
  }
}
