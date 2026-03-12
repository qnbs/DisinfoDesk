import { describe, it, expect } from 'vitest';
import theoriesReducer, {
  setSearch,
  toggleCategory,
  toggleDanger,
  setTag,
  setSort,
  toggleFavorite,
  resetFilters,
  addTheory,
  updateTheory,
  deleteTheory,
  syncStaticData,
} from '../../store/slices/theoriesSlice';
import type { Theory } from '../../types';

const getInitialState = () => theoriesReducer(undefined, { type: '@@INIT' });

const makeTheory = (overrides: Partial<Theory> = {}): Theory => ({
  id: 'test-' + Math.random().toString(36).slice(2),
  title: 'Test Theory',
  shortDescription: 'A test',
  category: 'Test',
  dangerLevel: 'Harmlos',
  popularity: 50,
  originYear: '2020',
  tags: ['test'],
  isUserCreated: true,
  ...overrides,
});

describe('theoriesSlice', () => {
  describe('initial state', () => {
    it('has empty filters', () => {
      const state = getInitialState();
      expect(state.filterSearch).toBe('');
      expect(state.filterCategories).toEqual([]);
      expect(state.filterDanger).toEqual([]);
      expect(state.filterTag).toBeNull();
    });

    it('has default sort option', () => {
      const state = getInitialState();
      expect(state.sortOption).toBe('POPULARITY_DESC');
    });

    it('has empty favorites', () => {
      const state = getInitialState();
      expect(state.favorites).toEqual([]);
    });

    it('has pre-populated German and English theories', () => {
      const state = getInitialState();
      expect(Object.keys(state.entitiesDe.entities).length).toBeGreaterThan(0);
      expect(Object.keys(state.entitiesEn.entities).length).toBeGreaterThan(0);
    });
  });

  describe('filter actions', () => {
    it('setSearch updates search term', () => {
      const state = getInitialState();
      const next = theoriesReducer(state, setSearch('illuminati'));
      expect(next.filterSearch).toBe('illuminati');
    });

    it('toggleCategory adds and removes categories', () => {
      let state = getInitialState();
      state = theoriesReducer(state, toggleCategory('Science'));
      expect(state.filterCategories).toContain('Science');

      state = theoriesReducer(state, toggleCategory('Science'));
      expect(state.filterCategories).not.toContain('Science');
    });

    it('toggleDanger adds and removes danger levels', () => {
      let state = getInitialState();
      state = theoriesReducer(state, toggleDanger('Gefährlich'));
      expect(state.filterDanger).toContain('Gefährlich');

      state = theoriesReducer(state, toggleDanger('Gefährlich'));
      expect(state.filterDanger).not.toContain('Gefährlich');
    });

    it('setTag sets and clears tag filter', () => {
      let state = getInitialState();
      state = theoriesReducer(state, setTag('politik'));
      expect(state.filterTag).toBe('politik');

      state = theoriesReducer(state, setTag(null));
      expect(state.filterTag).toBeNull();
    });

    it('setSort changes sort option', () => {
      const state = getInitialState();
      const next = theoriesReducer(state, setSort('TITLE_ASC'));
      expect(next.sortOption).toBe('TITLE_ASC');
    });

    it('resetFilters clears all filters', () => {
      let state = getInitialState();
      state = theoriesReducer(state, setSearch('test'));
      state = theoriesReducer(state, toggleCategory('cat'));
      state = theoriesReducer(state, toggleDanger('high'));
      state = theoriesReducer(state, setTag('tag'));

      state = theoriesReducer(state, resetFilters());
      expect(state.filterSearch).toBe('');
      expect(state.filterCategories).toEqual([]);
      expect(state.filterDanger).toEqual([]);
      expect(state.filterTag).toBeNull();
    });
  });

  describe('favorites', () => {
    it('toggleFavorite adds an ID', () => {
      const state = getInitialState();
      const next = theoriesReducer(state, toggleFavorite('theory-1'));
      expect(next.favorites).toContain('theory-1');
    });

    it('toggleFavorite removes an existing ID', () => {
      let state = getInitialState();
      state = theoriesReducer(state, toggleFavorite('theory-1'));
      state = theoriesReducer(state, toggleFavorite('theory-1'));
      expect(state.favorites).not.toContain('theory-1');
    });

    it('supports multiple favorites', () => {
      let state = getInitialState();
      state = theoriesReducer(state, toggleFavorite('a'));
      state = theoriesReducer(state, toggleFavorite('b'));
      state = theoriesReducer(state, toggleFavorite('c'));
      expect(state.favorites).toEqual(['a', 'b', 'c']);
    });
  });

  describe('CRUD operations', () => {
    it('addTheory adds to German collection', () => {
      const state = getInitialState();
      const theory = makeTheory({ id: 'custom-de' });
      const next = theoriesReducer(state, addTheory({ lang: 'de', theory }));
      expect(next.entitiesDe.entities['custom-de']).toBeTruthy();
      expect(next.entitiesDe.entities['custom-de']!.title).toBe('Test Theory');
    });

    it('addTheory adds to English collection', () => {
      const state = getInitialState();
      const theory = makeTheory({ id: 'custom-en' });
      const next = theoriesReducer(state, addTheory({ lang: 'en', theory }));
      expect(next.entitiesEn.entities['custom-en']).toBeTruthy();
    });

    it('updateTheory upserts a theory', () => {
      let state = getInitialState();
      const theory = makeTheory({ id: 'upd-1', title: 'Original' });
      state = theoriesReducer(state, addTheory({ lang: 'de', theory }));

      const updated = { ...theory, title: 'Updated' };
      state = theoriesReducer(state, updateTheory({ lang: 'de', theory: updated }));
      expect(state.entitiesDe.entities['upd-1']!.title).toBe('Updated');
    });

    it('deleteTheory removes a theory', () => {
      let state = getInitialState();
      const theory = makeTheory({ id: 'del-1' });
      state = theoriesReducer(state, addTheory({ lang: 'de', theory }));
      expect(state.entitiesDe.entities['del-1']).toBeTruthy();

      state = theoriesReducer(state, deleteTheory({ lang: 'de', id: 'del-1' }));
      expect(state.entitiesDe.entities['del-1']).toBeUndefined();
    });
  });

  describe('syncStaticData', () => {
    it('preserves user-created theories', () => {
      let state = getInitialState();
      const userTheory = makeTheory({ id: 'user-custom', isUserCreated: true });
      state = theoriesReducer(state, addTheory({ lang: 'de', theory: userTheory }));

      state = theoriesReducer(state, syncStaticData());
      expect(state.entitiesDe.entities['user-custom']).toBeTruthy();
      expect(state.entitiesDe.entities['user-custom']!.isUserCreated).toBe(true);
    });

    it('refreshes static data', () => {
      const state = getInitialState();
      const staticCount = state.entitiesDe.ids.length;

      // After sync, should still have at least all static theories
      const next = theoriesReducer(state, syncStaticData());
      expect(next.entitiesDe.ids.length).toBeGreaterThanOrEqual(staticCount);
    });
  });
});
