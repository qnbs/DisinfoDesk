
import { Message, MediaType, TheoryDetail, MediaAnalysisResponse } from './index';

// --- Settings ---

export type AccentColor = 'cyan' | 'purple' | 'green' | 'amber' | 'red';
export type SafetyLevel = 'strict' | 'standard' | 'unrestricted';
export type UIDensity = 'comfortable' | 'compact';

export interface AppSettings {
  // Neural
  aiTemperature: number; // 0.0 to 1.0
  aiModelVersion: string;
  thinkingBudget: number; // Token budget for reasoning (Gemini 2.5+)
  safetyLevel: SafetyLevel; // New: AI Safety Filter
  
  // Interface
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  soundEnabled: boolean;
  accentColor: AccentColor; // New: Theming
  uiDensity: UIDensity; // New: Spacing
  
  // Privacy & System
  incognitoMode: boolean;
  developerMode: boolean;
  hasSeenOnboarding: boolean;
  autoArchive: boolean; // New: Chat automation
}

export interface SystemLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

// --- Storage / Vault ---

export interface StoredAnalysis {
  id: string;
  title: string;
  timestamp: number;
  data: TheoryDetail;
  language: 'de' | 'en';
}

export interface StoredMediaAnalysis {
  id: string;
  title: string;
  timestamp: number;
  data: MediaAnalysisResponse;
  language: 'de' | 'en';
  mediaType: MediaType;
}

export interface StoredChat {
  id: string;
  title: string;
  timestamp: number;
  messages: Message[];
}

export interface SatireParams {
  subject: string; 
  archetype: string; 
  paranoia: number;
}

export interface StoredSatire {
  id: string;
  title: string;
  timestamp: number;
  content: string;
  params: SatireParams;
}

export interface VaultBackup {
  analyses: StoredAnalysis[];
  media_analyses: StoredMediaAnalysis[];
  chats: StoredChat[];
  satires: StoredSatire[];
  settings: { key: string; value: string }[];
  meta: {
    timestamp: number;
    version: number;
    app: string;
    schema: string;
  };
}
