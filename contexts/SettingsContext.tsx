import React, {
  createContext, useContext, useEffect, useCallback
} from 'react';
import { AppSettings, SystemLog } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateSetting, addLog as reduxAddLog, setActiveTab as reduxSetActiveTab } from '../store/slices/settingsSlice';
import { dbService } from '../services/dbService';

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  logs: SystemLog[];
  addLog: (message: string, type?: SystemLog['type']) => void;
  clearData: () => Promise<void>;
  exportData: () => Promise<void>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  
  // Directly access state from Redux (SSOT)
  const settings = useAppSelector(state => state.settings.config);
  const logs = useAppSelector(state => state.settings.logs);
  const activeTab = useAppSelector(state => state.settings.activeTab);

  // Apply Side Effects (DOM updates) when settings change
  useEffect(() => {
    document.documentElement.style.fontSize = 
      settings.fontSize === 'small' ? '14px' : 
      settings.fontSize === 'large' ? '18px' : '16px';
      
    if (settings.highContrast) document.documentElement.classList.add('contrast-more');
    else document.documentElement.classList.remove('contrast-more');
  }, [settings]);

  const addLog = useCallback((message: string, type: SystemLog['type'] = 'info') => {
    dispatch(reduxAddLog({ message, type }));
  }, [dispatch]);

  const handleUpdateSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    dispatch(updateSetting({ key, value }));
    addLog(`Configuration updated: [${key}] -> ${value}`, 'info');
  }, [dispatch, addLog]);

  const handleSetActiveTab = useCallback((tab: string) => {
    dispatch(reduxSetActiveTab(tab));
  }, [dispatch]);

  const clearData = useCallback(async () => {
    if (window.confirm('WARNING: This will wipe the ENTIRE Vault (IndexedDB). All saved chats, analyses, and settings will be lost. Proceed?')) {
      // Clear data stores
      await dbService.clear('analyses');
      await dbService.clear('chats');
      await dbService.clear('satires');
      
      // Clear Redux Persist store
      await dbService.clear('app_state');
      
      // Force reload to reset memory state
      window.location.reload();
    }
  }, []);

  const exportData = useCallback(async () => {
    const blob = await dbService.exportFullDatabase();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `disinfodesk_vault_export_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    addLog('Vault encrypted export generated successfully.', 'success');
  }, [addLog]);

  const value = {
    settings,
    updateSetting: handleUpdateSetting,
    logs,
    addLog,
    clearData,
    exportData,
    activeTab,
    setActiveTab: handleSetActiveTab
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};