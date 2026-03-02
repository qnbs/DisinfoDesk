
import { createSlice, createEntityAdapter, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { Theory, SortOption } from '../../types';
import { THEORIES_DE_FULL as THEORIES_DE, THEORIES_EN_FULL as THEORIES_EN } from '../../constants';

// 1. Setup Entity Adapter for Normalized State
const theoriesAdapter = createEntityAdapter<Theory>({
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
  dataVersion: string; // Used to track if static data needs hydration
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
  dataVersion: '1.0'
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
    },
    // Sync Static Data Logic: Merges new static content without overwriting user data
    syncStaticData: (state) => {
        const currentDe = theoriesAdapter.getSelectors().selectAll(state.entitiesDe);
        const currentEn = theoriesAdapter.getSelectors().selectAll(state.entitiesEn);

        // Keep user created theories
        const userCreatedDe = currentDe.filter(t => t.isUserCreated);
        const userCreatedEn = currentEn.filter(t => t.isUserCreated);

        // Reset state with fresh static data + preserved user data
        state.entitiesDe = theoriesAdapter.setAll(state.entitiesDe, [...THEORIES_DE, ...userCreatedDe]);
        state.entitiesEn = theoriesAdapter.setAll(state.entitiesEn, [...THEORIES_EN, ...userCreatedEn]);
    }
  }
});

export const { 
    setSearch, toggleCategory, toggleDanger, setTag, setSort, toggleFavorite, resetFilters,
    addTheory, updateTheory, deleteTheory, syncStaticData 
} = theoriesSlice.actions;

// --- MEMOIZED SELECTORS (Reselect) ---

// Define partial state interface to avoid circular dependency with store.ts
interface RootStateSubset {
  theories: TheoriesState;
  settings: {
    language: 'de' | 'en';
  };
}

// Base Selectors
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

const selectSearch = (state: RootStateSubset) => state.theories.filterSearch;
const selectCategories = (state: RootStateSubset) => state.theories.filterCategories;
const selectDanger = (state: RootStateSubset) => state.theories.filterDanger;
const selectTag = (state: RootStateSubset) => state.theories.filterTag;
const selectSort = (state: RootStateSubset) => state.theories.sortOption;

// Complex Filter Selector with Optimizations
export const selectFilteredTheories = createSelector(
  [selectAllTheories, selectSearch, selectCategories, selectDanger, selectTag, selectSort],
  (theories, search, cats, danger, tag, sort) => {
    // 1. Pre-computation for faster checks
    const term = search.toLowerCase();
    const hasSearch = term.length > 0;
    const hasCats = cats.length > 0;
    const hasDanger = danger.length > 0;
    const hasTag = tag !== null;

    // 2. Optimized Filtering Loop
    let result = theories;
    
    if (hasSearch || hasCats || hasDanger || hasTag) {
        result = theories.filter(t => {
            if (hasSearch) {
                // Check inclusion. Includes is faster than regex for simple substring.
                const inTitle = t.title.toLowerCase().includes(term);
                if (!inTitle) {
                    const inDesc = t.shortDescription.toLowerCase().includes(term);
                    if (!inDesc) {
                        const inTags = t.tags.some(tg => tg.toLowerCase().includes(term));
                        if (!inTags) return false;
                    }
                }
            }
            
            if (hasCats && !cats.includes(t.category)) return false;
            if (hasDanger && !danger.includes(t.dangerLevel)) return false;
            if (hasTag && !t.tags.includes(tag)) return false;
            
            return true;
        });
    }

    // 3. Sorting
    return result.sort((a, b) => {
      switch (sort) {
        case 'POPULARITY_DESC': return b.popularity - a.popularity;
        case 'POPULARITY_ASC': return a.popularity - b.popularity;
        case 'TITLE_ASC': return a.title.localeCompare(b.title);
        // Safely parse years with fallback
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
        for (const t of theories) {
            for (const tag of t.tags) {
                counts[tag] = (counts[tag] || 0) + 1;
            }
        }
        return { 
          counts, 
          uniqueTags: Object.keys(counts).sort((a,b) => counts[b] - counts[a]).slice(0, 20)
        };
    }
);

export default theoriesSlice.reducer;
