import { describe, it, expect } from 'vitest';
import uiReducer, {
  setSearchOpen,
  setActiveFile,
  setChatMessages,
  addChatMessage,
  updateLastChatMessage,
  finalizeLastChatMessage,
  setChatInput,
  setChatThinking,
  clearChat,
  injectChatContext,
  setTheoryTab,
  resetTransientState,
  showUpdateModal,
  hideUpdateModal,
  dismissUpdateModal,
} from '../../store/slices/uiSlice';
import type { Message } from '../../types';

const getInitialState = () => uiReducer(undefined, { type: '@@INIT' });

const makeMessage = (overrides: Partial<Message> = {}): Message => ({
  role: 'user',
  text: 'Hello',
  timestamp: Date.now(),
  ...overrides,
});

describe('uiSlice', () => {
  describe('initial state', () => {
    it('has empty chat', () => {
      const state = getInitialState();
      expect(state.chat.messages).toEqual([]);
      expect(state.chat.input).toBe('');
      expect(state.chat.isThinking).toBe(false);
      expect(state.chat.activeContextId).toBeNull();
    });

    it('has no active file', () => {
      const state = getInitialState();
      expect(state.activeFileId).toBeNull();
    });

    it('search is closed', () => {
      const state = getInitialState();
      expect(state.isSearchOpen).toBe(false);
    });
  });

  describe('search', () => {
    it('opens and closes global search', () => {
      let state = getInitialState();
      state = uiReducer(state, setSearchOpen(true));
      expect(state.isSearchOpen).toBe(true);

      state = uiReducer(state, setSearchOpen(false));
      expect(state.isSearchOpen).toBe(false);
    });
  });

  describe('active file', () => {
    it('sets and clears active file', () => {
      let state = getInitialState();
      state = uiReducer(state, setActiveFile('theory-123'));
      expect(state.activeFileId).toBe('theory-123');

      state = uiReducer(state, setActiveFile(null));
      expect(state.activeFileId).toBeNull();
    });
  });

  describe('chat', () => {
    it('setChatMessages replaces all messages', () => {
      const state = getInitialState();
      const msgs = [makeMessage({ text: 'a' }), makeMessage({ text: 'b' })];
      const next = uiReducer(state, setChatMessages(msgs));
      expect(next.chat.messages).toHaveLength(2);
    });

    it('addChatMessage appends a message', () => {
      let state = getInitialState();
      state = uiReducer(state, addChatMessage(makeMessage({ text: 'first' })));
      state = uiReducer(state, addChatMessage(makeMessage({ text: 'second' })));
      expect(state.chat.messages).toHaveLength(2);
      expect(state.chat.messages[1].text).toBe('second');
    });

    it('updateLastChatMessage updates last message text', () => {
      let state = getInitialState();
      state = uiReducer(state, addChatMessage(makeMessage({ text: 'original' })));
      state = uiReducer(state, updateLastChatMessage('updated'));
      expect(state.chat.messages[0].text).toBe('updated');
    });

    it('finalizeLastChatMessage sets text, verdict, and isStreaming=false', () => {
      let state = getInitialState();
      state = uiReducer(state, addChatMessage(makeMessage({ text: 'streaming...', isStreaming: true })));
      state = uiReducer(state, finalizeLastChatMessage({ text: 'final', verdict: 'MISLEADING' }));

      const lastMsg = state.chat.messages[0];
      expect(lastMsg.text).toBe('final');
      expect(lastMsg.verdict).toBe('MISLEADING');
      expect(lastMsg.isStreaming).toBe(false);
    });

    it('setChatInput updates input value', () => {
      const state = getInitialState();
      const next = uiReducer(state, setChatInput('test query'));
      expect(next.chat.input).toBe('test query');
    });

    it('setChatThinking toggles thinking state', () => {
      let state = getInitialState();
      state = uiReducer(state, setChatThinking(true));
      expect(state.chat.isThinking).toBe(true);

      state = uiReducer(state, setChatThinking(false));
      expect(state.chat.isThinking).toBe(false);
    });

    it('clearChat resets all chat state', () => {
      let state = getInitialState();
      state = uiReducer(state, addChatMessage(makeMessage()));
      state = uiReducer(state, setChatInput('hello'));
      state = uiReducer(state, setChatThinking(true));
      state = uiReducer(state, injectChatContext({ contextId: 'ctx-1' }));

      state = uiReducer(state, clearChat());
      expect(state.chat.messages).toEqual([]);
      expect(state.chat.input).toBe('');
      expect(state.chat.isThinking).toBe(false);
      expect(state.chat.activeContextId).toBeNull();
    });

    it('injectChatContext sets context and optional input', () => {
      const state = getInitialState();
      const next = uiReducer(state, injectChatContext({
        contextId: 'theory-1',
        initialMessage: 'Analyze this',
      }));
      expect(next.chat.activeContextId).toBe('theory-1');
      expect(next.chat.input).toBe('Analyze this');
    });

    it('injectChatContext clears messages when context changes', () => {
      let state = getInitialState();
      state = uiReducer(state, injectChatContext({ contextId: 'ctx-1' }));
      state = uiReducer(state, addChatMessage(makeMessage()));
      expect(state.chat.messages).toHaveLength(1);

      // Change context — should wipe messages
      state = uiReducer(state, injectChatContext({ contextId: 'ctx-2' }));
      expect(state.chat.messages).toEqual([]);
      expect(state.chat.activeContextId).toBe('ctx-2');
    });

    it('injectChatContext keeps messages when same context re-injected', () => {
      let state = getInitialState();
      state = uiReducer(state, injectChatContext({ contextId: 'ctx-1' }));
      state = uiReducer(state, addChatMessage(makeMessage()));

      state = uiReducer(state, injectChatContext({ contextId: 'ctx-1' }));
      expect(state.chat.messages).toHaveLength(1);
    });
  });

  describe('theory detail tabs', () => {
    it('sets a theory tab', () => {
      const state = getInitialState();
      const next = uiReducer(state, setTheoryTab({ id: 't-1', tab: 'NETWORK' }));
      expect(next.theoryDetails['t-1'].activeTab).toBe('NETWORK');
    });

    it('overwrites existing tab', () => {
      let state = getInitialState();
      state = uiReducer(state, setTheoryTab({ id: 't-1', tab: 'ANALYSIS' }));
      state = uiReducer(state, setTheoryTab({ id: 't-1', tab: 'TIMELINE' }));
      expect(state.theoryDetails['t-1'].activeTab).toBe('TIMELINE');
    });
  });

  describe('resetTransientState', () => {
    it('resets thinking and search flags', () => {
      let state = getInitialState();
      state = uiReducer(state, setChatThinking(true));
      state = uiReducer(state, setSearchOpen(true));

      state = uiReducer(state, resetTransientState());
      expect(state.chat.isThinking).toBe(false);
      expect(state.isSearchOpen).toBe(false);
    });

    it('clears streaming flags on messages', () => {
      let state = getInitialState();
      state = uiReducer(state, addChatMessage(makeMessage({ isStreaming: true })));
      state = uiReducer(state, resetTransientState());
      expect(state.chat.messages[0].isStreaming).toBe(false);
    });
  });

  describe('update modal', () => {
    it('shows and hides modal', () => {
      let state = getInitialState();
      state = uiReducer(state, showUpdateModal());
      expect(state.updateModal.isOpen).toBe(true);

      state = uiReducer(state, hideUpdateModal());
      expect(state.updateModal.isOpen).toBe(false);
    });

    it('dismissUpdateModal hides and saves version', () => {
      let state = getInitialState();
      state = uiReducer(state, showUpdateModal());
      state = uiReducer(state, dismissUpdateModal('2.0.0'));
      expect(state.updateModal.isOpen).toBe(false);
      expect(state.updateModal.lastSeenVersion).toBe('2.0.0');
    });
  });
});
