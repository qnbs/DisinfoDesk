
import { AppSettings } from '../types';

export const APP_CONFIG = {
    NAME: "DisinfoDesk",
    CODENAME: "Project Disinfo",
    VERSION: "2.7.0-modular",
    BUILD: "2024.11.10",
    API: {
        TIMEOUT_MS: 15000,
        RETRY_ATTEMPTS: 3,
        DEFAULT_MODEL: 'gemini-3.1-flash',
        VISION_MODEL: 'gemini-3.1-flash-image'
    },
    UI: {
        ANIMATION_DURATION: 300,
        MAX_HISTORY: 50,
        TOAST_DURATION: 3000
    }
} as const;

export const DEFAULT_SETTINGS: AppSettings = {
    // Core Neural Config
    aiProvider: 'gemini',
    aiTemperature: 0.7,
    aiModelVersion: 'gemini-3.1-flash',
    ollamaEndpoint: 'http://localhost:11434',
    thinkingBudget: 1024,
    safetyLevel: 'standard',
    
    // Advanced AI Parameters
    maxOutputTokens: 2048,
    topK: 40,
    topP: 0.95,
    presencePenalty: 0.0,
    frequencyPenalty: 0.0,
    responseFormat: 'text',
    enableGrounding: false,
    
    // Interface
    highContrast: false,
    reducedMotion: false,
    fontSize: 'medium',
    accentColor: 'cyan',
    uiDensity: 'comfortable',
    soundEnabled: true,
    compactMode: false,
    showTutorialHints: true,
    
    // Performance
    cacheStrategy: 'balanced',
    prefetchEnabled: true,
    dataSaverMode: false,
    offlineFirst: false,
    maxCacheSize: 100,
    autoClearCache: false,
    
    // Privacy & System
    incognitoMode: false,
    developerMode: false,
    hasSeenOnboarding: false,
    autoArchive: true,
    telemetryEnabled: false,
    experimentalFeatures: false,
    
    // Backup & Restore
    autoBackup: false,
    backupInterval: 24,
    backupLocation: 'local',
    lastBackupTimestamp: 0,
    
    // Advanced Developer Tools
    keyboardShortcuts: true,
    debugMode: false,
    verboseLogging: false,
    networkMonitor: false,
    cacheInspector: false
};
