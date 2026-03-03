import { configureStore, combineReducers, UnknownAction, Reducer } from '@reduxjs/toolkit';
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
import authorsReducer from './slices/authorsSlice';
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

const rootPersistConfig = {
  key: 'root_settings',
  version: 1,
  storage: dbService.reduxStorage,
  whitelist: ['config', 'language', 'logs'], 
  timeout: 5000, 
};

const theoriesPersistConfig = {
  key: 'theory_data',
  version: 4, 
  storage: dbService.reduxStorage,
  whitelist: ['favorites', 'entitiesDe', 'entitiesEn'], 
  timeout: 10000,
};

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
  authors: authorsReducer,
    ui: persistReducer(uiPersistConfig, uiReducer),
    simulation: undoable(simulationReducer, {
        limit: 50, 
        filter: excludeAction(resetParams.type),
        syncFilter: true 
    }),
    satire: satireReducer,
    [aiApi.reducerPath]: aiApi.reducer,
});

const rootReducer: Reducer = (state: ReturnType<typeof appReducer> | undefined, action: UnknownAction) => {
  if (action.type === 'settings/systemPurge') {
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
        // Ignored actions for redux-persist to avoid non-serializable checks on register/persist functions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Warn only if serialization check takes too long (dev mode perf optimization)
        warnAfter: 128, 
      },
      // Increase warning threshold for immutable state checks in dev mode
      immutableCheck: { warnAfter: 128 }
    })
    .prepend(listenerMiddleware.middleware)
    .concat(aiApi.middleware)
    .concat(rtkQueryErrorLogger),
  devTools: (import.meta as unknown as { env: { DEV: boolean } }).env.DEV ? {
    name: 'DisinfoDesk OS',
    trace: true,
    traceLimit: 25,
  } : false,
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

// --- Type Definitions ---
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;