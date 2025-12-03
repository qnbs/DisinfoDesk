
import { configureStore, combineReducers, AnyAction, Reducer } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { 
  persistStore, 
  persistReducer, 
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER 
} from 'redux-persist';
import undoable, { excludeAction } from 'redux-undo';

// Slices
import settingsReducer from './slices/settingsSlice';
import theoriesReducer from './slices/theoriesSlice';
import simulationReducer, { resetParams } from './slices/simulationSlice';
import satireReducer from './slices/satireSlice';
import uiReducer from './slices/uiSlice';

// API & Services
import { aiApi } from './api/aiApi';
import { dbService } from '../services/dbService';

// Middleware
import { listenerMiddleware } from './middleware/appListeners';
import { rtkQueryErrorLogger } from './middleware/errorLogger';

// --- Persistence Strategies ---

/**
 * Strategy 1: Critical Config
 * Uses IndexedDB (via dbService adapter) but is treated as "Root" config.
 */
const rootPersistConfig = {
  key: 'root_settings',
  version: 1,
  storage: dbService.reduxStorage,
  whitelist: ['config', 'language', 'logs'], 
  timeout: 5000, // Fail fast if DB is locked
};

/**
 * Strategy 2: Heavy Data
 * Separated to ensure editing one theory doesn't re-serialize the entire settings tree.
 */
const theoriesPersistConfig = {
  key: 'theory_data',
  version: 1,
  storage: dbService.reduxStorage,
  whitelist: ['favorites', 'entitiesDe', 'entitiesEn'], 
  timeout: 10000,
};

/**
 * Strategy 3: UI Continuity
 * Keeps chat and tabs alive.
 */
const uiPersistConfig = {
  key: 'ui_state',
  version: 1,
  storage: dbService.reduxStorage,
  whitelist: ['chat', 'theoryDetails'], 
  timeout: 5000,
};

// --- Reducer Composition ---

const appReducer = combineReducers({
    settings: persistReducer(rootPersistConfig, settingsReducer),
    theories: persistReducer(theoriesPersistConfig, theoriesReducer),
    ui: persistReducer(uiPersistConfig, uiReducer),
    // Undoable wrapper handles its own history state, no need to persist full history usually
    simulation: undoable(simulationReducer, {
        limit: 50, // Increased history limit for deeper analysis
        filter: excludeAction(resetParams.type),
        syncFilter: true // Ensure state consistency
    }),
    satire: satireReducer,
    [aiApi.reducerPath]: aiApi.reducer,
});

/**
 * Meta-Reducer for System Purge
 * Allows completely resetting the store state to undefined (initial) 
 * when the user triggers a factory reset.
 */
const rootReducer: Reducer = (state: ReturnType<typeof appReducer>, action: AnyAction) => {
  if (action.type === 'settings/systemPurge') {
    // Clear storage is handled in the thunk/component, 
    // here we just wipe memory state.
    state = undefined;
  }
  return appReducer(state, action);
};

// --- Store Instantiation ---

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore Redux Persist actions which contain non-serializable functions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Large data structures in simulation might trigger warnings in Dev, 
        // we relax the check slightly for performance in Dev mode.
        warnAfter: 128, 
      },
      immutableCheck: { warnAfter: 128 }
    })
    .prepend(listenerMiddleware.middleware)
    .concat(aiApi.middleware)
    .concat(rtkQueryErrorLogger),
  devTools: process.env.NODE_ENV !== 'production' ? {
    name: 'DisinfoDesk OS',
    trace: true,
    traceLimit: 25,
  } : false,
});

export const persistor = persistStore(store);

// Setup RTK Query listeners (focus refetching, online status)
setupListeners(store.dispatch);

// --- Type Definitions ---
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
