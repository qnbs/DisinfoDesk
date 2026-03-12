
import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { Message } from '../../types';
import type { RootState } from '../store';

interface UIState {
  chat: {
    messages: Message[];
    input: string;
    isThinking: boolean; 
    activeContextId: string | null; // ID of the theory currently being discussed
  };
  theoryDetails: {
    [id: string]: {
      activeTab: 'ANALYSIS' | 'NETWORK' | 'TIMELINE';
    };
  };
  activeFileId: string | null; // Globally tracks the currently "open" investigation
  isSearchOpen: boolean;
  updateModal: {
    isOpen: boolean;
    lastSeenVersion: string;
  };
}

const initialState: UIState = {
  chat: {
    messages: [],
    input: '',
    isThinking: false,
    activeContextId: null,
  },
  theoryDetails: {},
  activeFileId: null,
  isSearchOpen: false,
  updateModal: {
    isOpen: false,
    lastSeenVersion: '0.0.0',
  },
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // --- Global Search ---
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.isSearchOpen = action.payload;
    },

    // --- Active File Tracking (Workflow Continuity) ---
    setActiveFile: (state, action: PayloadAction<string | null>) => {
        state.activeFileId = action.payload;
    },

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
         if (!lastMsg.timestamp) lastMsg.timestamp = Date.now();
       }
    },
    setChatInput: (state, action: PayloadAction<string>) => {
      state.chat.input = action.payload;
    },
    setChatThinking: (state, action: PayloadAction<boolean>) => {
      state.chat.isThinking = action.payload;
    },
    // Enhanced: Inject Context
    injectChatContext: (state, action: PayloadAction<{ contextId: string; initialMessage?: string }>) => {
        // Critical: If context changes, we MUST wipe the previous conversation to prevent context bleeding
        if (state.chat.activeContextId !== action.payload.contextId) {
            state.chat.messages = [];
        }
        
        state.chat.activeContextId = action.payload.contextId;
        if (action.payload.initialMessage) {
            state.chat.input = action.payload.initialMessage;
        }
    },
    clearChat: (state) => {
      state.chat.messages = [];
      state.chat.input = '';
      state.chat.isThinking = false;
      state.chat.activeContextId = null;
    },

    // --- Tab Persistence ---
    setTheoryTab: (state, action: PayloadAction<{ id: string; tab: 'ANALYSIS' | 'NETWORK' | 'TIMELINE' }>) => {
      const { id, tab } = action.payload;
      // Guard against prototype pollution: reject dangerous property names
      if (id === '__proto__' || id === 'constructor' || id === 'prototype') return;
      if (!Object.prototype.hasOwnProperty.call(state.theoryDetails, id)) {
        state.theoryDetails[id] = { activeTab: 'ANALYSIS' };
      }
      state.theoryDetails[id].activeTab = tab;
    },

    // --- System Repair ---
    // Resets transient states (like loading spinners) that might get stuck in Redux Persist
    resetTransientState: (state) => {
      state.chat.isThinking = false;
      state.isSearchOpen = false;
      
      // Clean up any streaming flags in messages
      state.chat.messages.forEach(msg => {
        if (msg.isStreaming) msg.isStreaming = false;
      });
    },
    // --- Update Modal Management ---
    showUpdateModal: (state) => {
      state.updateModal.isOpen = true;
    },
    
    hideUpdateModal: (state) => {
      state.updateModal.isOpen = false;
    },

    dismissUpdateModal: (state, action: PayloadAction<string>) => {
      state.updateModal.isOpen = false;
      state.updateModal.lastSeenVersion = action.payload;
    },  },
});

// --- Optimized Selectors ---

const selectUI = (state: RootState) => state.ui;

export const selectChatState = createSelector(
  [selectUI],
  (ui) => ui.chat
);

export const selectActiveFile = (state: RootState) => state.ui.activeFileId;

// Returns active tab for a specific theory, defaulting to ANALYSIS if undefined
export const selectActiveTheoryTab = (id: string) => createSelector(
  [selectUI],
  (ui) => ui.theoryDetails[id]?.activeTab || 'ANALYSIS'
);

export const { 
  setSearchOpen, setActiveFile,
  setChatMessages, addChatMessage, updateLastChatMessage, finalizeLastChatMessage,
  setChatInput, setChatThinking, clearChat, injectChatContext,
  setTheoryTab, resetTransientState,
  showUpdateModal, hideUpdateModal, dismissUpdateModal
} = uiSlice.actions;

export default uiSlice.reducer;
