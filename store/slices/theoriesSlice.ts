
import { createSlice, createEntityAdapter, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { Theory, SortOption } from '../../types';
import { THEORIES_DE_FULL as THEORIES_DE, THEORIES_EN_FULL as THEORIES_EN } from '../../constants';

// 1. Setup Entity Adapter for Normalized State
const theoriesAdapter = createEntityAdapter<Theory>({
  selectId: (theory) => theory.id,
  sortComparer: (a, b) => b.popularity - a.popularity,
});

interface TheoriesState {
  filterSearch: string;
  filterCategories: string[];
  filterDanger: string[];
  filterTag: string | null;
  sortOption: SortOption;
  favorites: string[];
  // We store both languages normalized, but switch usage based on settings
  entitiesDe: ReturnType<typeof theoriesAdapter.getInitialState>;
  entitiesEn: ReturnType<typeof theoriesAdapter.getInitialState>;
}

const initialState: TheoriesState = {
  filterSearch: '',
  filterCategories: [],
  filterDanger: [],
  filterTag: null,
  sortOption: 'POPULARITY_DESC',
  favorites: [],
  entitiesDe: theoriesAdapter.setAll(theoriesAdapter.getInitialState(), THEORIES_DE),
  entitiesEn: theoriesAdapter.setAll(theoriesAdapter.getInitialState(), THEORIES_EN),
};

export const theoriesSlice = createSlice({
  name: 'theories',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => { state.filterSearch = action.payload; },
    toggleCategory: (state, action: PayloadAction<string>) => {
      const cat = action.payload;
      if (state.filterCategories.includes(cat)) state.filterCategories = state.filterCategories.filter(c => c !== cat);
      else state.filterCategories.push(cat);
    },
    toggleDanger: (state, action: PayloadAction<string>) => {
      const lvl = action.payload;
      if (state.filterDanger.includes(lvl)) state.filterDanger = state.filterDanger.filter(l => l !== lvl);
      else state.filterDanger.push(lvl);
    },
    setTag: (state, action: PayloadAction<string | null>) => { state.filterTag = action.payload; },
    setSort: (state, action: PayloadAction<SortOption>) => { state.sortOption = action.payload; },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.favorites.includes(id)) state.favorites = state.favorites.filter(f => f !== id);
      else state.favorites.push(id);
    },
    resetFilters: (state) => {
        state.filterSearch = '';
        state.filterCategories = [];
        state.filterDanger = [];
        state.filterTag = null;
    },
    // CRUD Operations for User Created Theories
    addTheory: (state, action: PayloadAction<{ lang: 'de' | 'en'; theory: Theory }>) => {
        const { lang, theory } = action.payload;
        if (lang === 'de') theoriesAdapter.addOne(state.entitiesDe, theory);
        else theoriesAdapter.addOne(state.entitiesEn, theory);
    },
    updateTheory: (state, action: PayloadAction<{ lang: 'de' | 'en'; theory: Theory }>) => {
        const { lang, theory } = action.payload;
        if (lang === 'de') theoriesAdapter.upsertOne(state.entitiesDe, theory);
        else theoriesAdapter.upsertOne(state.entitiesEn, theory);
    },
    deleteTheory: (state, action: PayloadAction<{ lang: 'de' | 'en'; id: string }>) => {
        const { lang, id } = action.payload;
        if (lang === 'de') theoriesAdapter.removeOne(state.entitiesDe, id);
        else theoriesAdapter.removeOne(state.entitiesEn, id);
    }
  }
});

export const { 
    setSearch, toggleCategory, toggleDanger, setTag, setSort, toggleFavorite, resetFilters,
    addTheory, updateTheory, deleteTheory 
} = theoriesSlice.actions;

// --- MEMOIZED SELECTORS (Reselect) ---

// Define partial state interface to avoid circular dependency with store.ts
interface RootStateSubset {
  theories: TheoriesState;
  settings: {
    language: 'de' | 'en';
  };
}

// Base Selectors - Using typed subset
const selectTheoriesState = (state: RootStateSubset) => state.theories;
const selectLanguage = (state: RootStateSubset) => state.settings.language;

// Select correct entity set based on language
export const selectAllTheories = createSelector(
  [selectTheoriesState, selectLanguage],
  (state, language) => {
    const targetState = language === 'de' ? state.entitiesDe : state.entitiesEn;
    return theoriesAdapter.getSelectors().selectAll(targetState);
  }
);

// Complex Filter Selector
export const selectFilteredTheories = createSelector(
  [
    selectAllTheories,
    (state: RootStateSubset) => state.theories.filterSearch,
    (state: RootStateSubset) => state.theories.filterCategories,
    (state: RootStateSubset) => state.theories.filterDanger,
    (state: RootStateSubset) => state.theories.filterTag,
    (state: RootStateSubset) => state.theories.sortOption,
  ],
  (theories, search, cats, danger, tag, sort) => {
    let result = theories.filter(t => {
      const term = (search as string).toLowerCase();
      const matchesSearch = t.title.toLowerCase().includes(term) || t.shortDescription.toLowerCase().includes(term) || t.tags.some(tg => tg.toLowerCase().includes(term));
      const matchesCat = (cats as string[]).length === 0 || (cats as string[]).includes(t.category);
      const matchesDanger = (danger as string[]).length === 0 || (danger as string[]).includes(t.dangerLevel);
      const matchesTag = tag === null || t.tags.includes(tag as string);
      return matchesSearch && matchesCat && matchesDanger && matchesTag;
    });

    return result.sort((a, b) => {
      switch (sort) {
        case 'POPULARITY_DESC': return b.popularity - a.popularity;
        case 'POPULARITY_ASC': return a.popularity - b.popularity;
        case 'TITLE_ASC': return a.title.localeCompare(b.title);
        case 'YEAR_DESC': return (parseInt(b.originYear?.match(/\d{4}/)?.[0] || '0') - parseInt(a.originYear?.match(/\d{4}/)?.[0] || '0'));
        case 'YEAR_ASC': return (parseInt(a.originYear?.match(/\d{4}/)?.[0] || '0') - parseInt(b.originYear?.match(/\d{4}/)?.[0] || '0'));
        default: return 0;
      }
    });
  }
);

export const selectTagStats = createSelector(
    [selectAllTheories],
    (theories) => {
        const counts: Record<string, number> = {};
        theories.forEach(t => t.tags.forEach(tag => { counts[tag] = (counts[tag] || 0) + 1; }));
        return { 
          counts, 
          uniqueTags: Object.keys(counts).sort((a,b) => counts[b] - counts[a]).slice(0, 20)
        };
    }
);

export default theoriesSlice.reducer;
