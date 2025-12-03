
import { createListenerMiddleware, addListener, TypedStartListening, TypedAddListener } from '@reduxjs/toolkit';
import type { RootState, AppDispatch } from '../store';
import { toggleFavorite } from '../slices/theoriesSlice';
import { setParams } from '../slices/simulationSlice';
import { addLog } from '../slices/settingsSlice';
import { generateAndSaveSatire } from '../slices/satireSlice';

export const listenerMiddleware = createListenerMiddleware();

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;
export const startAppListening = listenerMiddleware.startListening as AppStartListening;

export const addAppListener = addListener as TypedAddListener<RootState, AppDispatch>;

// --- REACTION DEFINITIONS ---

// 1. Audit Trail for Favorites
startAppListening({
  actionCreator: toggleFavorite,
  effect: async (action, listenerApi) => {
    const theoryId = action.payload;
    // We can access the state to get the theory title for a better log
    const theory = listenerApi.getState().theories.entitiesDe[theoryId] || listenerApi.getState().theories.entitiesEn[theoryId];
    const title = theory ? theory.title : theoryId;
    const isFav = listenerApi.getState().theories.favorites.includes(theoryId);

    listenerApi.dispatch(addLog({ 
        message: `Archive: ${isFav ? 'Added to' : 'Removed from'} favorites [${title}]`, 
        type: 'info' 
    }));
  },
});

// 2. Simulation Safety Protocols
startAppListening({
  actionCreator: setParams,
  effect: async (action, listenerApi) => {
    const { echoChamberDensity, emotionalPayload } = action.payload;

    // Debounce logging for sliders using cancelActiveListeners if we had an async process,
    // but for simple dispatching, we check thresholds.
    
    if (echoChamberDensity > 90) {
        listenerApi.dispatch(addLog({
            message: `SIMULATION WARNING: Echo Chamber density critical (${echoChamberDensity}%). Reality distortion imminent.`,
            type: 'warning'
        }));
    }

    if (emotionalPayload > 95) {
        listenerApi.dispatch(addLog({
            message: `SIMULATION ERROR: Emotional Payload at max capacity. Logical discourse disabled.`,
            type: 'error'
        }));
    }
  }
});

// 3. Satire Generation Success Log
startAppListening({
  actionCreator: generateAndSaveSatire.fulfilled,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(addLog({
        message: `Generator: New narrative synthesized "${action.payload.title}"`,
        type: 'success'
    }));
  }
});
