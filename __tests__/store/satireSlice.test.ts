import { describe, it, expect } from 'vitest';
import satireReducer, { resetSatire } from '../../store/slices/satireSlice';

const getInitialState = () => satireReducer(undefined, { type: '@@INIT' });

describe('satireSlice', () => {
  describe('initial state', () => {
    it('starts with idle status', () => {
      const state = getInitialState();
      expect(state.status).toBe('idle');
      expect(state.data).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe('resetSatire', () => {
    it('resets to initial state', () => {
      // Simulate a state with data
      const stateWithData = {
        data: { title: 'Test', content: 'Content' },
        status: 'succeeded' as const,
        error: null,
      };
      const next = satireReducer(stateWithData, resetSatire());
      expect(next.data).toBeNull();
      expect(next.status).toBe('idle');
      expect(next.error).toBeNull();
    });
  });

  describe('generateAndSaveSatire lifecycle', () => {
    it('sets loading on pending', () => {
      const state = getInitialState();
      const next = satireReducer(state, { type: 'satire/generate/pending' });
      expect(next.status).toBe('loading');
      expect(next.error).toBeNull();
    });

    it('sets data on fulfilled', () => {
      const state = getInitialState();
      const next = satireReducer(state, {
        type: 'satire/generate/fulfilled',
        payload: { title: 'Generated Title', content: 'Generated Content' },
      });
      expect(next.status).toBe('succeeded');
      expect(next.data?.title).toBe('Generated Title');
    });

    it('sets error on rejected', () => {
      const state = getInitialState();
      const next = satireReducer(state, {
        type: 'satire/generate/rejected',
        payload: 'API error occurred',
      });
      expect(next.status).toBe('failed');
      expect(next.error).toBe('API error occurred');
    });
  });
});
