
import { MediaType, TheoryDetail } from './models';
import { MediaAnalysisResponse } from './api';
import { Message } from './ui';

// --- Settings ---

export type AccentColor = 'cyan' | 'purple' | 'green' | 'amber' | 'red';
export type SafetyLevel = 'strict' | 'standard' | 'unrestricted';
export type UIDensity = 'comfortable' | 'compact';
export type AIProvider = 'gemini' | 'xai' | 'anthropic' | 'ollama' | 'local';

export interface AppSettings {
  // Neural — Advanced AI Configuration
  aiProvider: AIProvider;
  aiTemperature: number; // 0.0 to 1.0
  aiModelVersion: string;
  ollamaEndpoint: string; // Custom Ollama base URL
  thinkingBudget: number; // Token budget for reasoning (Gemini 2.5+)
  safetyLevel: SafetyLevel; // AI Safety Filter
  maxOutputTokens: number; // Max response length
  topK: number; // Sampling parameter (1-40)
  topP: number; // Nucleus sampling (0.0-1.0)
  presencePenalty: number; // Repetition penalty (-2.0 to 2.0)
  frequencyPenalty: number; // Frequency penalty (-2.0 to 2.0)
  responseFormat: 'text' | 'json' | 'markdown';
  enableGrounding: boolean; // Google Search grounding
  
  // Interface — UX & Theming
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  soundEnabled: boolean;
  accentColor: AccentColor;
  uiDensity: UIDensity;
  compactMode: boolean; // Hide secondary info
  showTutorialHints: boolean;
  
  // Performance — Cache & Optimization
  cacheStrategy: 'aggressive' | 'balanced' | 'minimal';
  prefetchEnabled: boolean; // Preload theory details
  dataSaverMode: boolean; // Reduce image quality
  offlineFirst: boolean; // Prioritize cache over network
  maxCacheSize: number; // MB
  autoClearCache: boolean;
  
  // Privacy & System
  incognitoMode: boolean;
  developerMode: boolean;
  hasSeenOnboarding: boolean;
  hasAgeConsent: boolean; // User confirmed 16+ age
  hasAcceptedPrivacy: boolean; // User accepted privacy policy
  autoArchive: boolean; // Chat automation
  telemetryEnabled: boolean; // Anonymous usage stats
  experimentalFeatures: boolean; // Beta features
  
  // Backup & Restore
  autoBackup: boolean;
  backupInterval: number; // hours
  backupLocation: 'local' | 'cloud' | 'disabled';
  lastBackupTimestamp: number;
  
  // Advanced
  keyboardShortcuts: boolean;
  debugMode: boolean;
  verboseLogging: boolean;
  networkMonitor: boolean;
  cacheInspector: boolean;
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
