
import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { Message } from '../../types';
import type { RootState } from '../store';

interface UIState {
  chat: {
    messages: Message[];
    input: string;
    isThinking: boolean; 
  };
  theoryDetails: {
    [id: string]: {
      activeTab: 'ANALYSIS' | 'NETWORK' | 'TIMELINE';
    };
  };
  scrollPositions: {
    [path: string]: number;
  };
}

const initialState: UIState = {
  chat: {
    messages: [],
    input: '',
    isThinking: false,
  },
  theoryDetails: {},
  scrollPositions: {},
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // --- Chat Logic ---
    setChatMessages: (state, action: PayloadAction<Message[]>) => {
      state.chat.messages = action.payload;
    },
    addChatMessage: (state, action: PayloadAction<Message>) => {
      state.chat.messages.push(action.payload);
    },
    updateLastChatMessage: (state, action: PayloadAction<string>) => {
      const lastMsg = state.chat.messages[state.chat.messages.length - 1];
      if (lastMsg) {
        lastMsg.text = action.payload;
      }
    },
    finalizeLastChatMessage: (state, action: PayloadAction<{ text: string, verdict: Message['verdict'] }>) => {
       const lastMsg = state.chat.messages[state.chat.messages.length - 1];
       if (lastMsg) {
         lastMsg.text = action.payload.text;
         lastMsg.verdict = action.payload.verdict;
         lastMsg.isStreaming = false;
         // Auto-timestamp if missing
         if (!lastMsg.timestamp) lastMsg.timestamp = Date.now();
       }
    },
    setChatInput: (state, action: PayloadAction<string>) => {
      state.chat.input = action.payload;
    },
    setChatThinking: (state, action: PayloadAction<boolean>) => {
      state.chat.isThinking = action.payload;
    },
    clearChat: (state) => {
      state.chat.messages = [];
      state.chat.input = '';
      state.chat.isThinking = false;
    },

    // --- Tab Persistence ---
    setTheoryTab: (state, action: PayloadAction<{ id: string; tab: 'ANALYSIS' | 'NETWORK' | 'TIMELINE' }>) => {
      const { id, tab } = action.payload;
      if (!state.theoryDetails[id]) {
        state.theoryDetails[id] = { activeTab: 'ANALYSIS' };
      }
      state.theoryDetails[id].activeTab = tab;
    },

    // --- Scroll Restoration ---
    saveScrollPosition: (state, action: PayloadAction<{ path: string; position: number }>) => {
      state.scrollPositions[action.payload.path] = action.payload.position;
    }
  },
});

// --- Optimized Selectors ---

const selectUI = (state: RootState) => state.ui;

export const selectChatState = createSelector(
  [selectUI],
  (ui) => ui.chat
);

// Returns active tab for a specific theory, defaulting to ANALYSIS if undefined
export const selectActiveTheoryTab = (id: string) => createSelector(
  [selectUI],
  (ui) => ui.theoryDetails[id]?.activeTab || 'ANALYSIS'
);

export const { 
  setChatMessages, addChatMessage, updateLastChatMessage, finalizeLastChatMessage,
  setChatInput, setChatThinking, clearChat,
  setTheoryTab, saveScrollPosition 
} = uiSlice.actions;

export default uiSlice.reducer;
