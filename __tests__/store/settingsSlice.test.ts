import { describe, it, expect } from 'vitest';
import settingsReducer, {
  updateSetting,
  setLanguage,
  addLog,
  setActiveTab,
  clearLogs,
  completeOnboarding,
  setAgeConsent,
  setPrivacyAccepted,
} from '../../store/slices/settingsSlice';

const getInitialState = () => settingsReducer(undefined, { type: '@@INIT' });

describe('settingsSlice', () => {
  describe('initial state', () => {
    it('has default language set to "de"', () => {
      const state = getInitialState();
      expect(state.language).toBe('de');
    });

    it('has empty logs', () => {
      const state = getInitialState();
      expect(state.logs).toHaveLength(0);
    });

    it('has default active tab', () => {
      const state = getInitialState();
      expect(state.activeTab).toBe('GENERAL');
    });

    it('has onboarding not completed by default', () => {
      const state = getInitialState();
      expect(state.config.hasSeenOnboarding).toBe(false);
    });
  });

  describe('updateSetting', () => {
    it('updates a single setting', () => {
      const state = getInitialState();
      const next = settingsReducer(state, updateSetting({ key: 'highContrast', value: true }));
      expect(next.config.highContrast).toBe(true);
    });

    it('updates numeric settings', () => {
      const state = getInitialState();
      const next = settingsReducer(state, updateSetting({ key: 'aiTemperature', value: 0.8 }));
      expect(next.config.aiTemperature).toBe(0.8);
    });
  });

  describe('setLanguage', () => {
    it('sets language to en', () => {
      const state = getInitialState();
      const next = settingsReducer(state, setLanguage('en'));
      expect(next.language).toBe('en');
    });

    it('sets language to de', () => {
      let state = getInitialState();
      state = settingsReducer(state, setLanguage('en'));
      state = settingsReducer(state, setLanguage('de'));
      expect(state.language).toBe('de');
    });
  });

  describe('addLog', () => {
    it('adds a log entry', () => {
      const state = getInitialState();
      const next = settingsReducer(state, addLog({ message: 'test log', type: 'info' }));
      expect(next.logs).toHaveLength(1);
      expect(next.logs[0].message).toBe('test log');
      expect(next.logs[0].type).toBe('info');
    });

    it('includes timestamp and id', () => {
      const state = getInitialState();
      const next = settingsReducer(state, addLog({ message: 'test', type: 'success' }));
      expect(next.logs[0].id).toBeTruthy();
      expect(next.logs[0].timestamp).toBeTruthy();
    });

    it('caps at 50 entries', () => {
      let state = getInitialState();
      for (let i = 0; i < 55; i++) {
        state = settingsReducer(state, addLog({ message: `log-${i}`, type: 'info' }));
      }
      expect(state.logs.length).toBeLessThanOrEqual(50);
      // The oldest should be shifted out
      expect(state.logs[0].message).toBe('log-5');
    });

    it('supports all log types', () => {
      let state = getInitialState();
      const types = ['info', 'success', 'warning', 'error'] as const;
      for (const type of types) {
        state = settingsReducer(state, addLog({ message: type, type }));
      }
      expect(state.logs.map(l => l.type)).toEqual(['info', 'success', 'warning', 'error']);
    });
  });

  describe('setActiveTab', () => {
    it('sets the active tab', () => {
      const state = getInitialState();
      const next = settingsReducer(state, setActiveTab('PRIVACY'));
      expect(next.activeTab).toBe('PRIVACY');
    });
  });

  describe('clearLogs', () => {
    it('clears all logs', () => {
      let state = getInitialState();
      state = settingsReducer(state, addLog({ message: 'test', type: 'info' }));
      state = settingsReducer(state, clearLogs());
      expect(state.logs).toHaveLength(0);
    });
  });

  describe('completeOnboarding', () => {
    it('sets hasSeenOnboarding to true', () => {
      const state = getInitialState();
      const next = settingsReducer(state, completeOnboarding());
      expect(next.config.hasSeenOnboarding).toBe(true);
    });
  });

  describe('setAgeConsent', () => {
    it('defaults to false', () => {
      const state = getInitialState();
      expect(state.config.hasAgeConsent).toBe(false);
    });

    it('sets hasAgeConsent to true', () => {
      const state = getInitialState();
      const next = settingsReducer(state, setAgeConsent());
      expect(next.config.hasAgeConsent).toBe(true);
    });
  });

  describe('setPrivacyAccepted', () => {
    it('defaults to false', () => {
      const state = getInitialState();
      expect(state.config.hasAcceptedPrivacy).toBe(false);
    });

    it('sets hasAcceptedPrivacy to true', () => {
      const state = getInitialState();
      const next = settingsReducer(state, setPrivacyAccepted());
      expect(next.config.hasAcceptedPrivacy).toBe(true);
    });
  });

  describe('updateSetting for consent fields', () => {
    it('can set hasAgeConsent via updateSetting', () => {
      const state = getInitialState();
      const next = settingsReducer(state, updateSetting({ key: 'hasAgeConsent', value: true }));
      expect(next.config.hasAgeConsent).toBe(true);
    });

    it('can set hasAcceptedPrivacy via updateSetting', () => {
      const state = getInitialState();
      const next = settingsReducer(state, updateSetting({ key: 'hasAcceptedPrivacy', value: true }));
      expect(next.config.hasAcceptedPrivacy).toBe(true);
    });
  });
});
