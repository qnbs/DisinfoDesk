
import React, { useState, useRef, useEffect, useCallback, createContext, useContext } from 'react';
import { streamChatWithSkeptic, resetChatSession } from '../services/geminiService';
import { dbService } from '../services/dbService';
import { 
    Send, Bot, Trash2, Mic, Activity, 
    ShieldCheck, AlertTriangle, XCircle, HelpCircle,
    Cpu, Signal, Save, Volume2, VolumeX, MicOff,
    Loader2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSettings } from '../contexts/SettingsContext';
import { Message, IWindow, ISpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from '../types';
import { PageHeader, PageFrame } from './ui/Common';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  setChatInput, 
  setChatThinking, 
  addChatMessage, 
  updateLastChatMessage, 
  finalizeLastChatMessage,
  clearChat
} from '../store/slices/uiSlice';

// --- 1. Logic Hook ---

const useDebunkChatLogic = () => {
  const { t, language } = useLanguage();
  const { settings } = useSettings();
  const dispatch = useAppDispatch();
  
  // Connect to Global Redux State for Persistence
  const messages = useAppSelector(state => state.ui.chat.messages);
  const input = useAppSelector(state => state.ui.chat.input);
  const loading = useAppSelector(state => state.ui.chat.isThinking);

  const [thinkingStep, setThinkingStep] = useState<string>('');
  
  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const isMounted = useRef(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mount/Unmount tracking
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const win = window as unknown as IWindow;
    if ('webkitSpeechRecognition' in win || 'SpeechRecognition' in win) {
        const SpeechRecognitionConstructor = win.SpeechRecognition || win.webkitSpeechRecognition;
        if (SpeechRecognitionConstructor) {
            recognitionRef.current = new SpeechRecognitionConstructor();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = language === 'de' ? 'de-DE' : 'en-US';

            recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
                if (!isMounted.current) return;
                const transcript = event.results[0][0].transcript;
                dispatch(setChatInput(transcript));
                setIsListening(false);
                setTimeout(() => {
                    if (isMounted.current) handleSend(transcript);
                }, 500);
            };

            recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error("Speech recognition error", event.error);
                if (isMounted.current) setIsListening(false);
            };
            
            recognitionRef.current.onend = () => {
                if (isMounted.current) setIsListening(false);
            };
        }
    }
  }, [language, dispatch]);

  // Thinking Sim
  useEffect(() => {
      let interval: ReturnType<typeof setInterval>;
      if (loading) {
          const steps = [
              "Parsing logic...",
              "Checking facts...",
              "Cross-referencing...",
              "Formulating...",
              "Streaming..."
          ];
          let i = 0;
          setThinkingStep(steps[0]);
          interval = setInterval(() => {
              if (isMounted.current) {
                  i = (i + 1) % steps.length;
                  setThinkingStep(steps[i]);
              }
          }, 500);
      } else {
          setThinkingStep('');
      }
      return () => clearInterval(interval);
  }, [loading]);

  const toggleListening = () => {
      if (!recognitionRef.current) return;
      if (isListening) {
          recognitionRef.current.stop();
      } else {
          recognitionRef.current.start();
          setIsListening(true);
      }
  };

  const speak = (text: string) => {
      if (!voiceEnabled || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'de' ? 'de-DE' : 'en-US';
      utterance.pitch = 0.8; 
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
  };

  // Initialize welcome message if empty
  useEffect(() => {
      if (messages.length === 0) {
          const welcome = t.chat.welcome;
          // Only dispatch if really empty to avoid re-adding on every mount
          dispatch(addChatMessage({ role: 'model', text: welcome, verdict: null }));
      }
  }, [t.chat.welcome, messages.length, dispatch]);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
        if (isMounted.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    });
  };

  useEffect(scrollToBottom, [messages]);

  const extractVerdict = (text: string): { cleanText: string, verdict: Message['verdict'] } => {
      const regex = /\[VERDICT:\s*(WAHR|FALSCH|IRREFÜHREND|UNBELEGT|TRUE|FALSE|MISLEADING|UNVERIFIED)\]/i;
      const match = text.match(regex);
      
      let verdict: Message['verdict'] = null;
      if (match) {
          const v = match[1].toUpperCase();
          if (v.includes('WAHR') || v.includes('TRUE')) verdict = 'TRUE';
          else if (v.includes('FALSCH') || v.includes('FALSE')) verdict = 'FALSE';
          else if (v.includes('IRRE') || v.includes('MISLEAD')) verdict = 'MISLEADING';
          else verdict = 'UNVERIFIED';
      }

      const cleanText = text.replace(regex, '').trim();
      return { cleanText, verdict };
  };

  const handleSend = useCallback(async (manualMsg?: string) => {
    const textToSend = manualMsg || input;
    if (!textToSend.trim() || loading) return;

    // 1. Add User Message
    dispatch(setChatInput(''));
    dispatch(addChatMessage({ role: 'user', text: textToSend }));
    dispatch(setChatThinking(true));
    
    // 2. Add Model Placeholder
    dispatch(addChatMessage({ role: 'model', text: '', isStreaming: true }));

    const history = messages.map(m => m.text);
    let fullResponse = "";
    
    try {
        const stream = streamChatWithSkeptic(
          history, 
          textToSend, 
          language, 
          { 
            model: settings.aiModelVersion, 
            temperature: settings.aiTemperature 
          }
        );
        
        for await (const chunk of stream) {
            if (!isMounted.current) {
               // Even if unmounted, we should probably update Redux so the chat finishes in background
               // But usually the generator stops if consumer stops.
               // For true background persistence, we'd need this logic in a middleware.
               // For now, we rely on the loop running at least until completion if the component stays alive or Redux updates fast enough.
            }
            fullResponse += chunk;
            dispatch(updateLastChatMessage(fullResponse));
        }
    } catch (e) {
        console.error(e);
    } finally {
        const { cleanText, verdict } = extractVerdict(fullResponse);
        dispatch(finalizeLastChatMessage({ text: cleanText, verdict }));
        dispatch(setChatThinking(false));
        
        if (isMounted.current) {
            speak(cleanText);
        }
    }
  }, [input, loading, messages, language, voiceEnabled, settings.aiModelVersion, settings.aiTemperature, dispatch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = useCallback(() => {
      dispatch(clearChat());
      dispatch(addChatMessage({ role: 'model', text: t.chat.welcome, verdict: null }));
      resetChatSession();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
  }, [t.chat.welcome, dispatch]);

  const handleSaveSession = async () => {
    if (messages.length <= 1) return;
    const title = messages.find(m => m.role === 'user')?.text.substring(0, 30) + '...' || 'Dr. Veritas Session';
    try {
        await dbService.saveChat({
            id: 'chat_' + Date.now(),
            title,
            timestamp: Date.now(),
            messages
        });
        alert("Session encrypted and archived in Vault.");
    } catch (e) {
        console.error("Failed to save chat", e);
    }
  };

  const handleInputChange = (val: string) => dispatch(setChatInput(val));

  return {
    messages,
    input,
    handleInputChange,
    loading,
    thinkingStep,
    handleSend,
    handleKeyDown,
    handleReset,
    handleSaveSession,
    messagesEndRef,
    t,
    isListening,
    toggleListening,
    voiceEnabled,
    setVoiceEnabled
  };
};

// --- 2. Context & Provider ---

type ChatContextType = ReturnType<typeof useDebunkChatLogic>;
const ChatContext = createContext<ChatContextType | undefined>(undefined);

const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
};

const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const logic = useDebunkChatLogic();
  return <ChatContext.Provider value={logic}>{children}</ChatContext.Provider>;
};

// --- 3. Sub-Components ---

const VerdictBadge: React.FC<{ verdict: Message['verdict'] }> = ({ verdict }) => {
    if (!verdict) return null;
    const config = {
        TRUE: { color: 'bg-green-500/10 text-green-400 border-green-500/50', icon: <ShieldCheck size={16} />, label: 'VERIFIED TRUTH' },
        FALSE: { color: 'bg-red-500/10 text-red-400 border-red-500/50', icon: <XCircle size={16} />, label: 'DEBUNKED' },
        MISLEADING: { color: 'bg-orange-500/10 text-orange-400 border-orange-500/50', icon: <AlertTriangle size={16} />, label: 'MISLEADING' },
        UNVERIFIED: { color: 'bg-slate-500/10 text-slate-400 border-slate-500/50', icon: <HelpCircle size={16} />, label: 'UNVERIFIED' },
    }[verdict];
    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border w-full mb-4 ${config.color} animate-fade-in shadow-lg`}>
            <div className="p-2 bg-black/20 rounded-full">{config.icon}</div>
            <div className="flex-1">
                <div className="text-[10px] uppercase font-bold tracking-widest opacity-70">Analysis Verdict</div>
                <div className="font-black text-sm tracking-wide">{config.label}</div>
            </div>
        </div>
    );
};

const FormattedText: React.FC<{ text: string }> = React.memo(({ text }) => {
    // Simple Markdown parsing for Bold and Italic
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return (
        <div className="whitespace-pre-wrap leading-relaxed">
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
                }
                if (part.startsWith('*') && part.endsWith('*')) {
                    return <em key={i} className="text-slate-300 italic">{part.slice(1, -1)}</em>;
                }
                return part;
            })}
        </div>
    );
});

const Suggestions: React.FC = () => {
    const { handleSend } = useChat();
    const suggestions = [
        "Is the Earth flat?",
        "Explain 'Strawman' fallacy",
        "Are birds real?",
        "What is Occam's Razor?"
    ];
    return (
        <div className="flex gap-2 overflow-x-auto pb-2 px-4 scrollbar-hide shrink-0 touch-pan-x">
            {suggestions.map((s, i) => (
                <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="whitespace-nowrap px-3 py-2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs hover:border-accent-cyan hover:text-accent-cyan transition-colors active:scale-95"
                >
                    {s}
                </button>
            ))}
        </div>
    );
};

const ChatHeader: React.FC = () => {
  const { isListening, loading, thinkingStep, voiceEnabled, setVoiceEnabled, handleSaveSession, handleReset } = useChat();
  
  return (
    <PageHeader 
        title="DR. VERITAS"
        subtitle="SKEPTICAL AI UNIT"
        icon={Bot}
        status={isListening ? "LISTENING..." : loading ? "PROCESSING..." : "SYSTEM ONLINE"}
        statusColor={isListening ? "bg-red-500" : loading ? "bg-purple-500" : "bg-green-500"}
        visualizerState={isListening ? 'LISTENING' : loading ? 'BUSY' : 'IDLE'}
        actions={
            <>
                {loading && (
                    <div className="hidden md:flex items-center gap-2 mr-4 text-xs font-mono text-accent-cyan bg-accent-cyan/10 px-3 py-1 rounded-full border border-accent-cyan/20 animate-pulse">
                        <Cpu size={12} />
                        {thinkingStep}
                    </div>
                )}
                <button
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className={`${voiceEnabled ? 'text-accent-cyan' : 'text-slate-500'} hover:bg-slate-800 p-2 rounded-lg transition-colors`}
                    title="Toggle Voice Output"
                >
                    {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
                <button
                    onClick={handleSaveSession}
                    className="text-slate-400 hover:text-green-400 transition-colors p-2 hover:bg-slate-800 rounded-lg touch-manipulation"
                    title="Archive Session to Vault"
                    aria-label="Archive Session"
                >
                    <Save size={20} />
                </button>
                <button 
                    onClick={handleReset} 
                    className="text-slate-500 hover:text-red-400 transition-colors p-2 hover:bg-slate-800 rounded-lg touch-manipulation"
                    title="Reset Uplink"
                    aria-label="Reset Chat"
                >
                    <Trash2 size={20} />
                </button>
            </>
        }
    />
  );
};

const ChatMessages: React.FC = () => {
  const { messages, messagesEndRef } = useChat();
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6" role="log" aria-live="polite">
      {messages.map((msg, index) => (
        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`
            max-w-[90%] md:max-w-[80%] rounded-xl px-4 py-3 md:px-5 md:py-4 text-sm shadow-lg relative
            ${msg.role === 'user' 
              ? 'bg-accent-purple/20 border border-accent-purple/30 text-slate-100 rounded-br-none' 
              : 'bg-slate-900 border border-slate-700 text-slate-300 rounded-bl-none'}
          `}>
            {msg.role === 'model' && (
                <Cpu size={14} className="absolute top-3 right-3 text-slate-700" />
            )}
            
            {msg.role === 'model' && msg.verdict && <VerdictBadge verdict={msg.verdict} />}
            
            <FormattedText text={msg.text} />
            
            {msg.isStreaming && <span className="inline-block w-2 h-4 bg-accent-cyan ml-1 animate-pulse align-middle"></span>}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

const ChatInputArea: React.FC = () => {
  const { messages, loading, input, handleInputChange, handleKeyDown, isListening, toggleListening, handleSend, t } = useChat();
  return (
    <div className="p-4 bg-slate-900/80 border-t border-slate-800 shrink-0 pb-safe backdrop-blur-xl relative z-10">
        {!loading && messages.length < 3 && <Suggestions />}
        <div className="flex gap-2 mt-2">
            <div className="relative flex-1">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isListening ? "Listening..." : t.chat.placeholder}
                    aria-label="Chat input"
                    disabled={isListening}
                    className={`w-full bg-slate-950 border text-white rounded-lg pl-4 pr-10 py-3 text-base md:text-sm focus:outline-none focus:ring-1 transition-all font-mono shadow-inner
                        ${isListening ? 'border-red-500 ring-red-500 placeholder-red-400' : 'border-slate-700 focus:border-accent-cyan focus:ring-accent-cyan'}
                    `}
                />
                <button 
                    onClick={toggleListening}
                    className={`absolute right-2 top-2 p-1 rounded-md transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-500 hover:text-white'}`}
                    aria-label={isListening ? "Stop Listening" : "Start Voice Input"}
                >
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
            </div>
            <button
                onClick={() => handleSend()}
                disabled={loading || (!input.trim() && !isListening)}
                aria-label="Send message"
                className="bg-accent-cyan hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold px-5 rounded-lg transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-200 active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.3)] touch-manipulation"
            >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
        </div>
    </div>
  );
};

// --- 4. Main Component ---

export const DebunkChat: React.FC = () => {
  return (
      <ChatProvider>
        <PageFrame>
            <ChatHeader />
            {/* Optimized container height for mobile (dvh) vs desktop */}
            <div className="h-[65dvh] md:h-[calc(100dvh-280px)] min-h-[400px] flex flex-col bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative backdrop-blur-md">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
                <ChatMessages />
                <ChatInputArea />
            </div>
        </PageFrame>
      </ChatProvider>
  );
};

export default DebunkChat;
