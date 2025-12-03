
// --- API Interactions ---

export interface AppError {
  message: string;
  code?: string;
  stack?: string;
}

export interface AIAnalysisResponse {
  fullDescription?: string;
  originStory?: string;
  debunking?: string;
  scientificConsensus?: string;
  sources?: string[];
}

// Interfaces for Raw JSON from AI
export interface RawTheoryAnalysisJSON {
  fullDescription?: string;
  originStory?: string;
  debunking?: string;
  scientificConsensus?: string;
  sources?: (string | { title: string; url?: string })[];
}

export interface RawMediaAnalysisJSON {
  plotSummary?: string;
  hiddenSymbolism?: string;
  predictiveProgramming?: string;
  realWorldParallels?: string;
}

export interface MediaAnalysisResponse {
  plotSummary?: string;
  hiddenSymbolism?: string;
  predictiveProgramming?: string;
  realWorldParallels?: string;
}

export interface SatireResponse {
  title: string;
  content: string;
}

export interface SatireOptions {
  topic?: string;
  paranoiaLevel?: number;
  archetype?: string;
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}
