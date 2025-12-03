
import { AppSettings } from '../types';

export const APP_CONFIG = {
    NAME: "DisinfoDesk",
    CODENAME: "Project Disinfo",
    VERSION: "2.7.0-modular",
    BUILD: "2024.11.10",
    API: {
        TIMEOUT_MS: 15000,
        RETRY_ATTEMPTS: 3,
        DEFAULT_MODEL: 'gemini-2.5-flash',
        VISION_MODEL: 'gemini-2.5-flash-image'
    },
    UI: {
        ANIMATION_DURATION: 300,
        MAX_HISTORY: 50,
        TOAST_DURATION: 3000
    }
} as const;

export const DEFAULT_SETTINGS: AppSettings = {
    aiTemperature: 0.7,
    aiModelVersion: 'gemini-2.5-flash',
    highContrast: false,
    reducedMotion: false,
    fontSize: 'medium',
    soundEnabled: true,
    incognitoMode: false,
    developerMode: false,
    hasSeenOnboarding: false,
};
