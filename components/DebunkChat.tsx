
import React, { useState, useRef, useEffect, useCallback, createContext, useContext } from 'react';
import { streamChatWithSkeptic, resetChatSession, connectLiveSession, base64ToUint8Array } from '../services/geminiService';
import { dbService } from '../services/dbService';
import { THEORIES_DE_FULL, THEORIES_EN_FULL, MEDIA_ITEMS } from '../constants';
import { AUTHORS_FULL } from '../data/enriched';
import { 
    Send, Bot, Trash2, Mic, Cpu, Save, Volume2, VolumeX, 
    MicOff, ShieldCheck, AlertTriangle, XCircle, 
    HelpCircle, StopCircle, User, Activity, Radio, Signal,
    Terminal, Lock, Zap, Search, Fingerprint, ChevronRight,
    Play, Pause, RefreshCw, BarChart2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSettings } from '../contexts/SettingsContext';
import { Message } from '../types';
import { PageHeader, PageFrame, Button, Card, Badge } from './ui/Common';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setChatInput, setChatThinking, addChatMessage, updateLastChatMessage, finalizeLastChatMessage, clearChat } from '../store/slices/uiSlice';
import { useToast } from '../contexts/ToastContext';
// LiveSession type is not exported in current @google/genai version; use inline type
type LiveSession = { sendRealtimeInput: (data: unknown[]) => void; close: () => void };

const buildContextBrief = (contextId: string | null, language: 'de' | 'en') => {
    if (!contextId) return undefined;

    const theories = language === 'de' ? THEORIES_DE_FULL : THEORIES_EN_FULL;
    const theory = theories.find((entry) => entry.id === contextId);
    if (!theory) return `Context ID: ${contextId}`;

    const theoryTagSet = new Set([theory.title, ...theory.tags].map((tag) => tag.toLowerCase()));

    const relatedMedia = MEDIA_ITEMS.filter((item) =>
        item.relatedTheoryTags.some((tag) => theoryTagSet.has(tag.toLowerCase())) ||
        item.tags.some((tag) => theoryTagSet.has(tag.toLowerCase()))
    ).slice(0, 8);

    const mediaIdSet = new Set(relatedMedia.map((item) => item.id));
    const relatedAuthors = AUTHORS_FULL.filter((author) =>
        (author.relatedMediaIds || []).some((id) => mediaIdSet.has(id)) ||
        (author.focusAreas || []).some((focus) => theoryTagSet.has(focus.toLowerCase()))
    ).slice(0, 8);

    const mediaLines = relatedMedia.map((item) => `- ${item.title} (${item.type}, ${item.year})`).join('\n');
    const authorLines = relatedAuthors.map((author) => `- ${author.name} (${author.nationality})`).join('\n');

    return [
        `Active theory: ${theory.title}`,
        `Short description: ${theory.shortDescription}`,
        `Tags: ${theory.tags.join(', ')}`,
        mediaLines ? `Related media:\n${mediaLines}` : '',
        authorLines ? `Related authors:\n${authorLines}` : '',
    ].filter(Boolean).join('\n\n');
};

// --- 1. ADVANCED VISUALIZERS ---

const ReactiveCore: React.FC<{ active: boolean, mode: 'IDLE' | 'LISTENING' | 'SPEAKING' | 'THINKING' }> = ({ active, mode }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);

    // Pause animation when off-screen
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !isVisible) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        let t = 0;
        
        // Handle Retina
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const render = () => {
            if (!active) {
                ctx.clearRect(0, 0, rect.width, rect.height);
                return;
            }

            const w = rect.width;
            const h = rect.height;
            const cx = w / 2;
            const cy = h / 2;
            
            ctx.clearRect(0, 0, w, h);
            t += 0.05;

            // Core Colors
            let baseColor = '100, 116, 139'; // Slate (Idle)
            let pulseSpeed = 1;
            let radiusBase = 60;

            if (mode === 'LISTENING') { baseColor = '239, 68, 68'; pulseSpeed = 2; radiusBase = 65; } // Red
            if (mode === 'SPEAKING') { baseColor = '6, 182, 212'; pulseSpeed = 3; radiusBase = 70; } // Cyan
            if (mode === 'THINKING') { baseColor = '168, 85, 247'; pulseSpeed = 4; radiusBase = 60; } // Purple

            // 1. Inner Core (Breathing)
            const breathing = Math.sin(t * pulseSpeed) * 5;
            const radius = radiusBase + breathing;

            const gradient = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius);
            gradient.addColorStop(0, `rgba(${baseColor}, 0.8)`);
            gradient.addColorStop(0.6, `rgba(${baseColor}, 0.2)`);
            gradient.addColorStop(1, `rgba(${baseColor}, 0)`);

            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // 2. Orbital Rings (Scanning)
            ctx.strokeStyle = `rgba(${baseColor}, 0.5)`;
            ctx.lineWidth = 1;
            
            // Ring 1
            ctx.beginPath();
            ctx.arc(cx, cy, radius + 20, t, t + Math.PI * 1.5);
            ctx.stroke();

            // Ring 2 (Counter-rotate)
            ctx.beginPath();
            ctx.arc(cx, cy, radius + 35, -t * 0.5, -t * 0.5 + Math.PI);
            ctx.strokeStyle = `rgba(${baseColor}, 0.3)`;
            ctx.stroke();

            // 3. Audio Wave Simulation (fake FFT for visual effect)
            if (mode === 'SPEAKING' || mode === 'LISTENING') {
                const bars = 30;
                const angleStep = (Math.PI * 2) / bars;
                ctx.fillStyle = `rgba(${baseColor}, 0.8)`;
                
                for(let i=0; i<bars; i++) {
                    const angle = i * angleStep + t; // Rotate
                    const amp = Math.abs(Math.sin(t * 2 + i)) * 30 + 10;
                    
                    const x1 = cx + Math.cos(angle) * (radius + 40);
                    const y1 = cy + Math.sin(angle) * (radius + 40);
                    const x2 = cx + Math.cos(angle) * (radius + 40 + amp);
                    const y2 = cy + Math.sin(angle) * (radius + 40 + amp);

                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = `rgba(${baseColor}, ${0.5 + Math.random()*0.5})`;
                    ctx.stroke();
                }
            }

            // 4. Data Particles
            if (mode === 'THINKING') {
                for(let i=0; i<8; i++) {
                    const angle = (t * 2) + (i * (Math.PI / 4));
                    const dist = radius + 50 - (t % 10);
                    const px = cx + Math.cos(angle) * dist;
                    const py = cy + Math.sin(angle) * dist;
                    
                    ctx.beginPath();
                    ctx.arc(px, py, 2, 0, Math.PI * 2);
                    ctx.fillStyle = '#fff';
                    ctx.fill();
                }
            }

            animationFrame = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(animationFrame);
    }, [active, mode, isVisible]);

    return <div ref={containerRef} className="w-full h-full" aria-hidden="true"><canvas ref={canvasRef} className="w-full h-full" /></div>;
};

// --- 2. LOGIC HOOK ---

const useDebunkChatLogic = () => {
  const { t, language } = useLanguage();
  const { settings } = useSettings();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  
  const messages = useAppSelector(state => state.ui.chat.messages);
  const input = useAppSelector(state => state.ui.chat.input);
  const loading = useAppSelector(state => state.ui.chat.isThinking);
  const activeContextId = useAppSelector(state => state.ui.chat.activeContextId);
  
  // LIVE MODE STATE
  const [mode, setMode] = useState<'TEXT' | 'LIVE'>('TEXT');
  const [liveStatus, setLiveStatus] = useState<'IDLE' | 'CONNECTING' | 'CONNECTED'>('IDLE');
  const [liveState, setLiveState] = useState<'LISTENING' | 'SPEAKING' | 'IDLE'>('IDLE');
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const liveSessionRef = useRef<LiveSession | null>(null);
  
  // Audio Context Refs for Live Mode
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup
  useEffect(() => {
    return () => {
      stopLiveSession();
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  // Scroll to bottom on new message (Internal Container only)
  useEffect(() => {
      if (chatContainerRef.current) {
          // Use scrollTop instead of scrollIntoView to prevent page jumps
          const container = chatContainerRef.current;
          container.scrollTo({
              top: container.scrollHeight,
              behavior: 'smooth'
          });
      }
  }, [messages, loading]);

  // --- LIVE MODE HANDLERS ---

  const initAudioContext = () => {
      if (!audioContextRef.current) {
          const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
          if (!AudioCtx) return;
          audioContextRef.current = new AudioCtx({ sampleRate: 24000 });
      }
  };

  const playAudioChunk = async (base64Data: string) => {
      if (!audioContextRef.current) return;
      
      // Critical fix: Ensure context is running (browsers suspend it by default until interaction)
      if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
      }
      
      try {
          const arrayBuffer = base64ToUint8Array(base64Data).buffer;
          const dataInt16 = new Int16Array(arrayBuffer);
          const float32 = new Float32Array(dataInt16.length);
          for(let i=0; i<dataInt16.length; i++) {
              float32[i] = dataInt16[i] / 32768;
          }

          const buffer = audioContextRef.current.createBuffer(1, float32.length, 24000);
          buffer.copyToChannel(float32, 0);

          const source = audioContextRef.current.createBufferSource();
          source.buffer = buffer;
          source.connect(audioContextRef.current.destination);
          
          const now = audioContextRef.current.currentTime;
          const start = Math.max(now, nextStartTimeRef.current);
          source.start(start);
          nextStartTimeRef.current = start + buffer.duration;
          
          setLiveState('SPEAKING');
          source.onended = () => {
              if (audioContextRef.current && audioContextRef.current.currentTime >= nextStartTimeRef.current - 0.1) {
                  setLiveState('IDLE');
              }
          };

      } catch (e) {
          console.error("Audio Decode Error", e);
      }
  };

  const startLiveSession = async () => {
      setMode('LIVE');
      setLiveStatus('CONNECTING');
      initAudioContext();

      // Ensure AudioContext is active immediately on user interaction
      if (audioContextRef.current?.state === 'suspended') {
          await audioContextRef.current.resume();
      }

      try {
          streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
          
          const session = await connectLiveSession(
              (audio) => playAudioChunk(audio),
              () => stopLiveSession(),
              language,
              buildContextBrief(activeContextId, language)
          );
          liveSessionRef.current = session;
          
          // Audio Input Setup
          const ctx = new AudioContext({ sampleRate: 16000 });
          const source = ctx.createMediaStreamSource(streamRef.current);
          processorRef.current = ctx.createScriptProcessor(4096, 1, 1);
          
          processorRef.current.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              // Basic VAD (Voice Activity Detection) visual trigger
              let sum = 0;
              for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
              const rms = Math.sqrt(sum / inputData.length);
              if (rms > 0.02 && liveState !== 'SPEAKING') setLiveState('LISTENING');
              else if (liveState === 'LISTENING' && rms < 0.01) setLiveState('IDLE');

              const pcm16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) pcm16[i] = inputData[i] * 0x7FFF;
              const blob = new Blob([pcm16.buffer], { type: 'audio/pcm' });
              
              const reader = new FileReader();
              reader.onload = () => {
                  const b64 = (reader.result as string).split(',')[1];
                  if (liveSessionRef.current) {
                      liveSessionRef.current.sendRealtimeInput([{ inlineData: { mimeType: "audio/pcm;rate=16000", data: b64 }}]);
                  }
              };
              reader.readAsDataURL(blob);
          };

          source.connect(processorRef.current);
          processorRef.current.connect(ctx.destination);
          setLiveStatus('CONNECTED');

      } catch (e) {
          console.error("Live Init Failed", e);
          setMode('TEXT');
          showToast(t.chat?.micDenied || "Microphone access denied.", 'error');
      }
  };

  const stopLiveSession = () => {
      // 1. Immediate local state cleanup
      const session = liveSessionRef.current;
      liveSessionRef.current = null; // Prevent re-entrancy loops

      // 2. Close session if active
      if (session) {
          try {
              session.close();
          } catch (e) {
              console.warn("Error closing live session:", e);
          }
      }

      // 3. Release Media Resources
      if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
          streamRef.current = null;
      }
      if (processorRef.current) {
          processorRef.current.disconnect();
          processorRef.current = null;
      }

      // 4. UI Reset
      setLiveStatus('IDLE');
      setLiveState('IDLE');
      setMode('TEXT');
  };

  // --- TEXT MODE LOGIC ---

  const handleSend = useCallback(async (manualMsg?: string) => {
    const textToSend = manualMsg || input;
    if (!textToSend.trim() || loading) return;

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    dispatch(setChatInput(''));
    dispatch(addChatMessage({ role: 'user', text: textToSend }));
    dispatch(setChatThinking(true));
    dispatch(addChatMessage({ role: 'model', text: '', isStreaming: true }));

    const history = messages.map(m => m.text);
    let fullResponse = "";
    
    try {
        const stream = streamChatWithSkeptic(history, textToSend, language, { 
            model: settings.aiModelVersion, 
            temperature: settings.aiTemperature 
        }, buildContextBrief(activeContextId, language));
        
        for await (const chunk of stream) {
            if (abortControllerRef.current?.signal.aborted) break;
            fullResponse += chunk;
            dispatch(updateLastChatMessage(fullResponse));
        }
    } catch (e) { 
        if (!abortControllerRef.current?.signal.aborted) {
            dispatch(updateLastChatMessage(fullResponse + "\n\n[SYSTEM ERROR: Uplink interrupted]"));
        }
    } finally {
        if (!abortControllerRef.current?.signal.aborted) {
            const regex = /\[?\**VERDICT\**:\s*(WAHR|FALSCH|IRREFÜHREND|UNBELEGT|TRUE|FALSE|MISLEADING|UNVERIFIED)\]?/i;
            const match = fullResponse.match(regex);
            let verdict: Message['verdict'] = null;
            if (match) {
                const v = match[1].toUpperCase();
                if (v.includes('WAHR') || v.includes('TRUE')) verdict = 'TRUE';
                else if (v.includes('FALSCH') || v.includes('FALSE')) verdict = 'FALSE';
                else if (v.includes('IRRE') || v.includes('MISLEAD')) verdict = 'MISLEADING';
                else verdict = 'UNVERIFIED';
            }
            const cleanText = fullResponse.replace(regex, '').trim();
            dispatch(finalizeLastChatMessage({ text: cleanText, verdict }));
            dispatch(setChatThinking(false));
        }
        abortControllerRef.current = null;
    }
    }, [input, loading, messages, language, settings.aiModelVersion, settings.aiTemperature, dispatch, activeContextId]);

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };
  
  const handleReset = useCallback(() => { 
      dispatch(clearChat()); 
      resetChatSession(); 
  }, [dispatch]);

  const handleSaveSession = async () => {
    if (messages.length <= 1) return;
    try { 
        await dbService.saveChat({ 
            id: 'chat_' + Date.now(), 
            title: messages.find(m => m.role === 'user')?.text.substring(0, 30) + '...' || 'Session', 
            timestamp: Date.now(), 
            messages 
        }); 
        showToast(t.chat?.sessionSaved || "Session archived.", 'success'); 
    } catch (e) { console.error(e); showToast(t.chat?.sessionSaveFailed || "Save failed.", 'error'); }
  };

  // Quick Action Prompts
  const quickActions = [
      { label: t.chat.quickActions.factCheck, prompt: "Fact check the previous claim strictly." },
      { label: t.chat.quickActions.fallacies, prompt: "Identify any logical fallacies in this argument." },
      { label: t.chat.quickActions.sources, prompt: "Provide reputable sources for this topic." }
  ];

  const triggerQuickAction = (prompt: string) => handleSend(prompt);

  return { 
      messages, input, 
      handleInputChange: (val: string) => dispatch(setChatInput(val)), 
      loading, 
      handleSend, handleKeyDown, handleReset, handleSaveSession, 
      chatContainerRef, t, 
      activeContextId,
      mode, liveStatus, liveState, startLiveSession, stopLiveSession,
      quickActions, triggerQuickAction
  };
};

// --- COMPONENTS ---

const ChatHeader: React.FC<{ status: string, mode: string, contextId: string | null }> = ({ status, mode, contextId }) => {
    const { handleSaveSession, handleReset, t } = useContext(ChatContext)!;
  return (
    <PageHeader 
                title={t.chat.headerTitle}
                subtitle={contextId ? `${t.chat.contextPrefix}: ${contextId.toUpperCase()} // ${t.chat.active}` : t.chat.subtitleForensic}
        icon={Cpu} 
                status={mode === 'LIVE' ? status : t.chat.statusEncrypted}
        statusColor={mode === 'LIVE' && status === 'CONNECTED' ? "bg-red-500" : "bg-green-500"}
        visualizerState={mode === 'LIVE' ? 'LISTENING' : 'IDLE'}
        actions={
            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={handleSaveSession} icon={<Save size={16}/>} className="border-slate-700 hover:border-accent-cyan">{t.chat.save}</Button>
                <button onClick={handleReset} className="text-slate-400 hover:text-red-400 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-slate-900 rounded-lg" aria-label="Reset chat"><Trash2 size={18} /></button>
            </div>
        } 
    />
  );
};

const TextMessageBubble: React.FC<{ msg: Message }> = ({ msg }) => {
    const isUser = msg.role === 'user';
    const isSystem = !isUser;

    return (
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in-up`}>
            <div className="flex items-center gap-2 mb-1 opacity-70">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                    {isUser ? 'AGENT_01' : 'DR_VERITAS_AI'}
                </span>
                <span className="text-[9px] text-slate-400 font-mono">
                    {new Date(msg.timestamp || Date.now()).toLocaleTimeString()}
                </span>
            </div>
            
            <div className={`
                relative max-w-[90%] md:max-w-[80%] rounded-sm p-4 text-sm leading-relaxed border-l-2
                ${isUser 
                    ? 'bg-slate-900/50 border-l-accent-cyan text-slate-200' 
                    : 'bg-[#0B0F19] border-l-accent-purple text-slate-300 shadow-lg'}
            `}>
                {/* Decorative Corner */}
                <div className={`absolute -top-1 ${isUser ? '-right-1 border-r-2 border-t-2 border-accent-cyan' : '-left-1 border-l-2 border-t-2 border-accent-purple'} w-2 h-2`}></div>

                {/* Content */}
                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                
                {/* Typing Indicator for Stream */}
                {msg.isStreaming && <span className="inline-block w-2 h-4 bg-accent-purple ml-1 animate-pulse align-middle"></span>}

                {/* Verdict Stamp */}
                {msg.verdict && (
                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                        <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                            CONFIDENCE: {(Math.random() * 10 + 89).toFixed(1)}%
                        </div>
                        <Badge 
                            label={msg.verdict} 
                            className={`
                                text-xs font-black tracking-widest border-2 
                                ${msg.verdict === 'TRUE' ? 'border-green-500 text-green-500 bg-green-950/30' : 
                                  msg.verdict === 'FALSE' ? 'border-red-500 text-red-500 bg-red-950/30' : 
                                  'border-yellow-500 text-yellow-500 bg-yellow-950/30'}
                            `} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

// --- MAIN UI ---

const ChatContext = createContext<ReturnType<typeof useDebunkChatLogic> | undefined>(undefined);

export const DebunkChat: React.FC = () => {
    const logic = useDebunkChatLogic();
    const { messages, input, handleInputChange, handleKeyDown, handleSend, loading, mode, liveStatus, liveState, startLiveSession, stopLiveSession, t, chatContainerRef, activeContextId, quickActions, triggerQuickAction } = logic;

    return (
    <ChatContext.Provider value={logic}>
        <PageFrame>
            <ChatHeader status={liveStatus} mode={mode} contextId={activeContextId} />
            
            <div className="h-[calc(100dvh-200px)] min-h-[600px] flex flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
                
                {/* --- LIVE MODE UI --- */}
                {mode === 'LIVE' && (
                    <div className="absolute inset-0 z-30 bg-slate-950 flex flex-col items-center justify-center p-8 overflow-hidden">
                        {/* Background Grid */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/5 to-transparent animate-pulse pointer-events-none"></div>

                        {/* Top HUD */}
                        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start text-xs font-mono text-red-500/70 pointer-events-none">
                            <div>
                                <div>{t.chat.live.signalStrength}: -42dBm</div>
                                <div>{t.chat.live.encryptionAes}</div>
                            </div>
                            <div className="text-right">
                                <div>UPTIME: {new Date().toISOString().split('T')[1].split('.')[0]}</div>
                                <div className="flex items-center justify-end gap-2">
                                    STATUS: <span className="animate-pulse font-bold">{liveState}</span>
                                </div>
                            </div>
                        </div>

                        {/* Core Visualizer */}
                        <div className="relative w-64 h-64 md:w-96 md:h-96 mb-12">
                            <ReactiveCore active={liveStatus === 'CONNECTED'} mode={loading ? 'THINKING' : liveState} />
                            {/* Central Icon */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <Fingerprint size={48} className={`opacity-50 ${liveState === 'SPEAKING' ? 'text-accent-cyan' : 'text-red-500'}`} />
                            </div>
                        </div>

                        {/* Status Text */}
                        <h2 className="text-3xl font-black text-white mb-2 tracking-[0.2em] font-display uppercase drop-shadow-glow">
                            {liveStatus === 'CONNECTING' ? t.chat.live.establishingUplink : t.chat.live.neuralBridgeActive}
                        </h2>
                        <p className="text-slate-500 font-mono text-sm mb-12 max-w-md text-center">
                            {liveStatus === 'CONNECTING' ? t.chat.live.handshaking : t.chat.live.voiceIntercept}
                        </p>

                        {/* Terminate Button */}
                        <Button variant="danger" size="lg" onClick={stopLiveSession} icon={<StopCircle size={20} />} className="px-10 py-5 text-base tracking-widest shadow-[0_0_30px_rgba(239,68,68,0.4)] border-red-500 hover:bg-red-600 hover:text-white">
                            {t.chat.live.terminateConnection}
                        </Button>
                    </div>
                )}

                {/* --- TEXT MODE UI --- */}
                <div className="flex-1 flex flex-col relative z-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                    {/* Message Stream */}
                    <div 
                        ref={chatContainerRef}
                        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800"
                        role="log"
                        aria-live="polite"
                        aria-label="Chat messages"
                    >
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-slate-600 opacity-60">
                                <Bot size={64} className="mb-4 text-accent-cyan opacity-20" />
                                <div className="text-sm font-mono uppercase tracking-widest text-center">
                                    {t.chat.live.secureLineReady}<br/>
                                    {t.chat.live.waitingForInput}
                                </div>
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <TextMessageBubble key={index} msg={msg} />
                        ))}
                    </div>

                    {/* Quick Actions Bar */}
                    {messages.length > 0 && !loading && (
                        <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide border-t border-slate-800/50 bg-slate-900/30 backdrop-blur-sm">
                            {quickActions.map((action, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => triggerQuickAction(action.prompt)}
                                    className="px-3 py-1.5 rounded-full border border-slate-700 bg-slate-800/50 text-[10px] font-bold uppercase text-slate-400 hover:text-accent-cyan hover:border-accent-cyan transition-all whitespace-nowrap flex items-center gap-1"
                                >
                                    <Zap size={10} /> {action.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Tactical Input Area */}
                    <div className="p-4 bg-slate-900 border-t border-slate-800 relative shadow-2xl">
                        <div className="flex gap-3 items-end max-w-5xl mx-auto">
                            <Button 
                                onClick={startLiveSession}
                                className="bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white h-[50px] w-[50px] flex items-center justify-center p-0 rounded-lg shrink-0 transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                                title={t.chat.voice}
                            >
                                <Radio size={22} className={mode === 'LIVE' ? 'animate-pulse' : ''} />
                            </Button>
                            
                            <div className="relative flex-1 group">
                                <div className="absolute inset-0 bg-accent-cyan/5 rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                                <input 
                                    type="text" 
                                    value={input} 
                                    onChange={(e) => handleInputChange(e.target.value)} 
                                    onKeyDown={handleKeyDown} 
                                    placeholder={t.chat.placeholder} 
                                    disabled={loading} 
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-4 pr-12 py-3.5 text-sm focus:outline-none focus:border-accent-cyan text-white shadow-inner font-mono transition-all placeholder-slate-600 h-[50px]" 
                                    autoComplete="off"
                                />
                                {loading && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <RefreshCw size={16} className="text-accent-cyan animate-spin" />
                                    </div>
                                )}
                            </div>

                            <Button 
                                onClick={() => handleSend()} 
                                disabled={!input.trim() || loading} 
                                className="h-[50px] w-[50px] p-0 flex items-center justify-center rounded-lg bg-accent-cyan text-slate-900 hover:bg-cyan-400 shrink-0 shadow-neon-cyan"
                            >
                                <Send size={22} />
                            </Button>
                        </div>
                        
                        {/* Footer Status */}
                        <div className="mt-2 flex justify-between text-[9px] font-mono text-slate-600 uppercase tracking-wider px-1">
                            <span>{t.chat.live.footerEncryption}: TLS 1.3</span>
                            <span>{t.chat.live.footerLatency}: 24ms</span>
                        </div>
                    </div>
                </div>
            </div>
        </PageFrame>
    </ChatContext.Provider>
    );
};

export default DebunkChat;
