import { describe, it, expect } from 'vitest';
import authorsReducer from '../../store/slices/authorsSlice';

const getInitialState = () => authorsReducer(undefined, { type: '@@INIT' });

describe('authorsSlice', () => {
  describe('initial state', () => {
    it('loads authors from static data', () => {
      const state = getInitialState();
      expect(state.entities.ids.length).toBeGreaterThan(0);
    });

    it('authors have required fields', () => {
      const state = getInitialState();
      const firstId = state.entities.ids[0];
      const author = state.entities.entities[firstId];
      expect(author).toBeTruthy();
      expect(author!.id).toBeTruthy();
      expect(typeof author!.influenceLevel).toBe('number');
    });

    it('sorts by influence level descending', () => {
      const state = getInitialState();
      const ids = state.entities.ids;
      if (ids.length >= 2) {
        const first = state.entities.entities[ids[0]]!;
        const second = state.entities.entities[ids[1]]!;
        expect(first.influenceLevel).toBeGreaterThanOrEqual(second.influenceLevel);
      }
    });
  });
});
