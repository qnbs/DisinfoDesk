
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppSettings, SystemLog, Language } from '../../types';
import { DEFAULT_SETTINGS } from '../../constants';

interface SettingsState {
  config: AppSettings;
  language: Language;
  logs: SystemLog[];
  activeTab: string;
}

const initialState: SettingsState = {
  config: DEFAULT_SETTINGS,
  language: 'de',
  logs: [],
  activeTab: 'GENERAL'
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSetting: <K extends keyof AppSettings>(state: SettingsState, action: PayloadAction<{ key: K; value: AppSettings[K] }>) => {
      state.config[action.payload.key] = action.payload.value;
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
    addLog: (state, action: PayloadAction<{ message: string; type: SystemLog['type'] }>) => {
      const newLog: SystemLog = {
        id: Date.now().toString() + Math.random(),
        timestamp: new Date().toLocaleTimeString(),
        message: action.payload.message,
        type: action.payload.type
      };
      state.logs.push(newLog);
      if (state.logs.length > 50) state.logs.shift(); // Keep last 50
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    clearLogs: (state) => {
      state.logs = [];
    },
    completeOnboarding: (state) => {
      state.config.hasSeenOnboarding = true;
    }
  },
});

export const { updateSetting, setLanguage, addLog, setActiveTab, clearLogs, completeOnboarding } = settingsSlice.actions;
export default settingsSlice.reducer;
