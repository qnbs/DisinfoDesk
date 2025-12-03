
import { Message, MediaType, TheoryDetail, MediaAnalysisResponse } from './index';

// --- Settings ---

export interface AppSettings {
  aiTemperature: number; // 0.0 to 1.0
  aiModelVersion: string;
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  soundEnabled: boolean;
  incognitoMode: boolean;
  developerMode: boolean;
  hasSeenOnboarding: boolean;
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
