
import React, {
  useRef, useEffect, createContext, useContext, useCallback, useState
} from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Settings as SettingsIcon, Cpu, Layout, Terminal, Volume2, VolumeX, Eye, EyeOff, Trash2, Download, Smartphone, Shield, Zap, Brain, AlertOctagon, HardDrive, Activity, Lock, Palette, Grid, CheckCircle2, Server, Wifi
} from 'lucide-react';
import {
  Card, Button, Badge, PageHeader
} from './ui/Common';
import { useAppDispatch } from '../store/hooks';
import { setLanguage as setReduxLanguage } from '../store/slices/settingsSlice';
import { AppSettings, Language, AccentColor, AIProvider } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { secureApiKeyService } from '../services/secureApiKeyService';
import { PROVIDER_MODEL_OPTIONS, getDefaultModel, testProviderConnection } from '../services/aiProviderService';

// --- 1. Logic Hook ---

const useSettingsPageLogic = () => {
    const { activeTab, settings, logs, updateSetting: contextUpdate, clearData, exportData, setActiveTab: contextSetActiveTab } = useSettings();
    const { language, setLanguage, t } = useLanguage();
    const dispatch = useAppDispatch();

    // Simulated Real-time Metrics
    const [systemMetrics, setSystemMetrics] = useState<{time: number, cpu: number, mem: number, net: number}[]>([]);
    const [apiKeyInput, setApiKeyInput] = useState('');
    const [apiKeySaved, setApiKeySaved] = useState(false);
    const [apiKeyStatus, setApiKeyStatus] = useState('');
    const [apiKeyVisible, setApiKeyVisible] = useState(false);
    const [apiKeyTesting, setApiKeyTesting] = useState(false);
    const [apiKeyFormatHint, setApiKeyFormatHint] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setSystemMetrics(prev => {
                const next = [...prev, {
                    time: Date.now(),
                    cpu: Math.random() * 30 + 10 + (Math.random() > 0.9 ? 40 : 0), // Occasional spikes
                    mem: Math.random() * 10 + 40,
                    net: Math.random() * 50 + 20
                }];
                return next.slice(-20); // Keep last 20 ticks
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        secureApiKeyService.hasApiKey()
            .then((hasKey) => setApiKeySaved(hasKey))
            .catch(() => setApiKeySaved(false));
    }, []);

    const handleUpdate = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
        contextUpdate(key, value);
    }, [contextUpdate]);

    const handleSetLanguage = useCallback((lang: Language) => {
        setLanguage(lang);
        dispatch(setReduxLanguage(lang));
    }, [setLanguage, dispatch]);

    const handleSystemPurge = useCallback(async () => {
        await clearData();
        dispatch({ type: 'settings/systemPurge' });
    }, [dispatch, clearData]);

    const handleApiKeyInputChange = useCallback((value: string) => {
        setApiKeyInput(value);
        if (value.trim()) {
            const { valid, error } = secureApiKeyService.validateKeyFormat(value);
            if (!valid) {
                const hints: Record<string, [string, string]> = {
                    KEY_TOO_SHORT: ['Key zu kurz (min. 30 Zeichen)', 'Key too short (min. 30 characters)'],
                    INVALID_KEY_FORMAT: ['Ungültiges Format – erwartet: AIza...', 'Invalid format – expected: AIza...'],
                };
                const [de, en] = hints[error ?? ''] ?? ['', ''];
                setApiKeyFormatHint(language === 'de' ? de : en);
            } else {
                setApiKeyFormatHint('');
            }
        } else {
            setApiKeyFormatHint('');
        }
    }, [language]);

    const saveGeminiKey = useCallback(async () => {
        const { valid } = secureApiKeyService.validateKeyFormat(apiKeyInput);
        if (!valid) {
            setApiKeyStatus(language === 'de' ? 'Ungültiges Key-Format. Bitte prüfen.' : 'Invalid key format. Please check.');
            return;
        }
        setApiKeyTesting(true);
        try {
            const testResult = await secureApiKeyService.testApiKey(apiKeyInput);
            if (!testResult.ok) {
                const msg = testResult.error === 'INVALID_KEY'
                    ? (language === 'de' ? 'API-Key ungültig – Zugriff verweigert.' : 'API key invalid – access denied.')
                    : (language === 'de' ? 'Verbindungstest fehlgeschlagen. Key wird trotzdem gespeichert.' : 'Connection test failed. Key saved anyway.');
                if (testResult.error === 'INVALID_KEY') {
                    setApiKeyStatus(msg);
                    setApiKeyTesting(false);
                    return;
                }
                setApiKeyStatus(msg);
            }
            await secureApiKeyService.setApiKey(apiKeyInput);
            setApiKeySaved(true);
            setApiKeyInput('');
            setApiKeyFormatHint('');
            setApiKeyVisible(false);
            setApiKeyStatus(language === 'de' ? '✓ API-Key validiert & verschlüsselt gespeichert (AES-256-GCM).' : '✓ API key validated & stored encrypted (AES-256-GCM).');
        } catch {
            setApiKeyStatus(language === 'de' ? 'Speichern fehlgeschlagen. Bitte API-Key prüfen.' : 'Save failed. Please verify API key.');
        } finally {
            setApiKeyTesting(false);
        }
    }, [apiKeyInput, language]);

    const clearGeminiKey = useCallback(async () => {
        await secureApiKeyService.clearApiKey();
        setApiKeySaved(false);
        setApiKeyStatus(language === 'de' ? 'API-Key aus KeyVault entfernt.' : 'API key removed from KeyVault.');
    }, [language]);

    return {
        activeTab,
        settings,
        logs,
        language,
        t,
        systemMetrics,
        handleUpdate,
        handleExportData: exportData,
        handleSetLanguage,
        handleSetActiveTab: contextSetActiveTab,
        handleSystemPurge,
        apiKeyInput,
        setApiKeyInput: handleApiKeyInputChange,
        apiKeySaved,
        apiKeyStatus,
        apiKeyVisible,
        setApiKeyVisible,
        apiKeyTesting,
        apiKeyFormatHint,
        saveGeminiKey,
        clearGeminiKey
    };
};

const SettingsPageContext = createContext<ReturnType<typeof useSettingsPageLogic> | undefined>(undefined);
const useSettingsPage = () => {
    const context = useContext(SettingsPageContext);
    if (!context) throw new Error('useSettingsPage must be used within a SettingsPageProvider');
    return context;
};

// --- 2. Advanced UI Primitives ---

const HoldButton: React.FC<{ onComplete: () => void, label: string, icon?: React.ReactNode, color?: string, sub?: string }> = ({ onComplete, label, icon, color = "bg-red-600", sub }) => {
    const { t } = useLanguage();
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<number | null>(null);
    const [isComplete, setIsComplete] = useState(false);

    const start = () => {
        if (isComplete) return;
        intervalRef.current = window.setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    setIsComplete(true);
                    onComplete();
                    return 100;
                }
                return prev + 2; 
            });
        }, 20); 
    };

    const stop = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (!isComplete) setProgress(0);
    };

    return (
        <button
            onMouseDown={start}
            onMouseUp={stop}
            onMouseLeave={stop}
            onTouchStart={start}
            onTouchEnd={stop}
            className={`relative w-full overflow-hidden rounded-xl border border-red-900/50 bg-red-950/10 py-4 px-6 text-left transition-all hover:bg-red-900/20 active:scale-[0.99] select-none group`}
        >
            <div className={`absolute top-0 left-0 h-full ${color} transition-all duration-75 opacity-20`} style={{ width: `${progress}%` }}></div>
            <div className="relative z-10 flex items-center justify-between">
                <div>
                    <div className="text-red-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                        {isComplete ? <CheckCircle2 size={14} /> : (icon || <AlertOctagon size={14} />)}
                        {isComplete ? t.settings.labels.protocolExecuted : (progress > 0 ? `${t.settings.labels.confirming} ${progress}%` : label)}
                    </div>
                    {sub && <div className="text-[10px] text-red-400/60 mt-1 font-mono">{sub}</div>}
                </div>
                <div className="h-1.5 w-24 bg-red-900/30 rounded-full overflow-hidden">
                    <div className={`h-full ${color}`} style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        </button>
    );
};

const ControlToggle: React.FC<{ label: string; description?: string; checked: boolean; onChange: (c: boolean) => void; icon: React.ReactNode }> = React.memo(({ label, description, checked, onChange, icon }) => (
  <button 
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`
      w-full flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group select-none relative overflow-hidden text-left
      ${checked ? 'bg-slate-900 border-accent-cyan/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'bg-slate-950/30 border-slate-800 hover:border-slate-600 hover:bg-slate-900/50'}
    `}
  >
    <div className="flex items-center gap-4 relative z-10">
      <div className={`p-2.5 rounded-lg transition-all duration-300 ${checked ? 'text-accent-cyan bg-accent-cyan/10 scale-110' : 'text-slate-500 bg-slate-900'}`}>
        {icon}
      </div>
      <div>
        <div className={`font-bold text-xs uppercase tracking-wide transition-colors ${checked ? 'text-white' : 'text-slate-400'}`}>{label}</div>
        {description && <div className="text-[10px] text-slate-500 mt-0.5 font-mono">{description}</div>}
      </div>
    </div>
    <div className={`w-10 h-5 rounded-full p-0.5 transition-all duration-300 border ${checked ? 'bg-accent-cyan/20 border-accent-cyan' : 'bg-slate-900 border-slate-700'}`}>
      <div className={`w-3.5 h-3.5 rounded-full bg-current shadow-sm transition-all duration-300 ${checked ? 'translate-x-5 text-accent-cyan shadow-[0_0_8px_cyan]' : 'translate-x-0 text-slate-500'}`} />
    </div>
    {checked && <div className="absolute inset-0 bg-accent-cyan/5 pointer-events-none" />}
  </button>
));

const RangeSlider: React.FC<{ label: string; value: number; min: number; max: number; step: number; onChange: (val: number) => void; format?: (v: number) => string; color?: string }> = ({ label, value, min, max, step, onChange, format, color = "bg-accent-cyan" }) => (
  <div className="p-5 bg-slate-900/40 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
    <div className="flex justify-between mb-3">
      <span className="font-bold text-xs text-slate-400 uppercase tracking-wider">{label}</span>
      <span className="font-mono text-accent-cyan text-xs font-bold">{format ? format(value) : value}</span>
    </div>
    <div className="relative h-2 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
        <div className={`absolute top-0 left-0 h-full ${color} opacity-80 pointer-events-none transition-all duration-300`} style={{ width: `${((value - min) / (max - min)) * 100}%` }}></div>
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" />
    </div>
  </div>
);

// --- 3. Section Modules ---

const NeuralEngineConfig: React.FC = () => {
    const { settings, handleUpdate, t } = useSettingsPage();
    const isPro = settings.aiModelVersion.includes('pro') || settings.aiModelVersion.includes('opus');

    const providerMeta: Record<AIProvider, { icon: React.ReactNode; color: string; label: string; border: string; bg: string }> = {
      gemini: { icon: <Zap size={18} />, color: 'text-accent-cyan', label: 'Google Gemini', border: 'border-accent-cyan/60', bg: 'bg-accent-cyan/5' },
      xai: { icon: <Brain size={18} />, color: 'text-orange-400', label: 'xAI Grok', border: 'border-orange-400/60', bg: 'bg-orange-400/5' },
      anthropic: { icon: <Shield size={18} />, color: 'text-amber-400', label: 'Anthropic Claude', border: 'border-amber-400/60', bg: 'bg-amber-400/5' },
      ollama: { icon: <Server size={18} />, color: 'text-green-400', label: 'Ollama (Local)', border: 'border-green-400/60', bg: 'bg-green-400/5' },
    };

    const currentProvider = settings.aiProvider || 'gemini';
    const models = PROVIDER_MODEL_OPTIONS[currentProvider] || [];
    const meta = providerMeta[currentProvider];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Provider Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(Object.keys(providerMeta) as AIProvider[]).map((p) => {
                  const pm = providerMeta[p];
                  const isActive = currentProvider === p;
                  return (
                    <button key={p}
                      onClick={() => {
                        handleUpdate('aiProvider', p);
                        handleUpdate('aiModelVersion', getDefaultModel(p));
                      }}
                      className={`relative p-4 rounded-xl border text-left transition-all group ${isActive ? `bg-slate-900 ${pm.border} shadow-[0_0_15px_rgba(255,255,255,0.05)]` : 'bg-slate-950/50 border-slate-800 hover:border-slate-600'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={isActive ? pm.color : 'text-slate-600'}>{pm.icon}</span>
                        {isActive && <div className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] font-bold text-white/60 uppercase">{t.settings.labels.activeCore}</div>}
                      </div>
                      <div className="text-xs font-bold text-white">{pm.label}</div>
                      {isActive && <div className={`absolute inset-0 ${pm.bg} pointer-events-none animate-pulse-slow rounded-xl`}></div>}
                    </button>
                  );
                })}
            </div>

            {/* Model Cards for Selected Provider */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {models.map((m) => {
                  const isActive = settings.aiModelVersion === m.id;
                  return (
                    <button key={m.id}
                      onClick={() => handleUpdate('aiModelVersion', m.id)}
                      className={`relative p-5 rounded-xl border text-left overflow-hidden transition-all group ${isActive ? `bg-slate-900 ${meta.border} shadow-[0_0_20px_rgba(255,255,255,0.05)]` : 'bg-slate-950/50 border-slate-800 hover:border-slate-600'}`}
                    >
                      <div className="flex justify-between items-start mb-2 relative z-10">
                        <span className={isActive ? meta.color : 'text-slate-600'}>{meta.icon}</span>
                        {isActive && <div className={`px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-bold uppercase ${meta.color}`}>{t.settings.labels.activeCore}</div>}
                      </div>
                      <div className="relative z-10">
                        <div className="font-bold text-white text-sm mb-1">{m.label}</div>
                        <div className="text-[10px] text-slate-400 font-mono leading-relaxed">{m.desc}</div>
                      </div>
                      {isActive && <div className={`absolute inset-0 ${meta.bg} pointer-events-none animate-pulse-slow`}></div>}
                    </button>
                  );
                })}
            </div>

            {/* Ollama Endpoint Config */}
            {currentProvider === 'ollama' && (
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <label className="text-xs font-bold text-green-400 uppercase tracking-widest mb-2 block flex items-center gap-2">
                  <Server size={14} /> Ollama Endpoint
                </label>
                <input
                  type="url"
                  value={settings.ollamaEndpoint || 'http://localhost:11434'}
                  onChange={(e) => handleUpdate('ollamaEndpoint', e.target.value)}
                  placeholder="http://localhost:11434"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white placeholder:text-slate-500 font-mono focus:border-green-400 focus:ring-1 focus:ring-green-400/30 transition-colors"
                />
              </div>
            )}

            {/* Neural Parameters */}
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Cpu size={120} /></div>
                
                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Activity size={14} className="text-accent-cyan" /> {t.settings.labels.synapticConfiguration}
                </h4>

                <div className="space-y-6 relative z-10">
                    <RangeSlider 
                        label={t.settings.labels.temp}
                        value={settings.aiTemperature} 
                        min={0} max={1} step={0.1} 
                        onChange={(v) => handleUpdate('aiTemperature', v)}
                        format={(v) => `${(v * 100).toFixed(0)}% Entropy`}
                    />

                    <div className={`transition-all duration-500 ${isPro ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
                        <RangeSlider 
                            label={t.settings.labels.reasoningBudget}
                            value={settings.thinkingBudget} 
                            min={0} max={8192} step={128} 
                            onChange={(v) => handleUpdate('thinkingBudget', v)}
                            format={(v) => `${v} T`}
                            color="bg-accent-purple"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2">
                        {(['strict', 'standard', 'unrestricted'] as const).map(level => (
                            <button
                                key={level}
                                onClick={() => handleUpdate('safetyLevel', level)}
                                className={`
                                    py-2.5 px-2 sm:px-3 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all
                                    ${settings.safetyLevel === level 
                                        ? level === 'strict' ? 'bg-green-500/20 border-green-500 text-green-400' 
                                        : level === 'standard' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' 
                                        : 'bg-red-500/20 border-red-500 text-red-400'
                                        : 'bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800'}
                                `}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                    <div className="text-[9px] text-center font-mono text-slate-500 uppercase">
                        {t.settings.labels.currentSafetyProtocol}: {settings.safetyLevel}
                    </div>
                </div>
            </div>

            {/* Advanced AI Parameters */}
            <div className="bg-gradient-to-br from-purple-950/30 to-slate-950/30 border border-purple-900/50 rounded-xl p-6">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Brain size={14} className="text-purple-400" /> Advanced AI Parameters
                </h4>
                <div className="space-y-6">
                    <RangeSlider 
                        label={t.settings.labels.maxOutputTokens}
                        value={settings.maxOutputTokens} 
                        min={512} max={8192} step={128} 
                        onChange={(v) => handleUpdate('maxOutputTokens', v)}
                        format={(v) => `${v} T`}
                        color="bg-purple-500"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <RangeSlider 
                            label={t.settings.labels.topK}
                            value={settings.topK} 
                            min={1} max={40} step={1} 
                            onChange={(v) => handleUpdate('topK', v)}
                            color="bg-purple-500"
                        />
                        <RangeSlider 
                            label={t.settings.labels.topP}
                            value={settings.topP} 
                            min={0} max={1} step={0.05} 
                            onChange={(v) => handleUpdate('topP', v)}
                            format={(v) => v.toFixed(2)}
                            color="bg-purple-500"
                        />
                        <RangeSlider 
                            label={t.settings.labels.presencePenalty}
                            value={settings.presencePenalty} 
                            min={-2} max={2} step={0.1} 
                            onChange={(v) => handleUpdate('presencePenalty', v)}
                            format={(v) => v.toFixed(1)}
                            color="bg-purple-500"
                        />
                        <RangeSlider 
                            label={t.settings.labels.frequencyPenalty}
                            value={settings.frequencyPenalty} 
                            min={-2} max={2} step={0.1} 
                            onChange={(v) => handleUpdate('frequencyPenalty', v)}
                            format={(v) => v.toFixed(1)}
                            color="bg-purple-500"
                        />
                    </div>

                    {/* Response Format Selector */}
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{t.settings.labels.responseFormat}</div>
                        <div className="grid grid-cols-3 gap-3">
                            {(['text', 'json', 'markdown'] as const).map(format => (
                                <button
                                    key={format}
                                    onClick={() => handleUpdate('responseFormat', format)}
                                    className={`py-2 px-3 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all ${
                                        settings.responseFormat === format 
                                            ? 'bg-purple-500/20 border-purple-500 text-purple-300' 
                                            : 'bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800'
                                    }`}
                                >
                                    {format}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Google Search Grounding */}
                    <ControlToggle 
                        label={t.settings.labels.enableGrounding}
                        description={t.settings.labels.enableGroundingDesc}
                        checked={settings.enableGrounding}
                        onChange={(v) => handleUpdate('enableGrounding', v)}
                        icon={<Shield size={18}/>}
                    />
                </div>
            </div>
        </div>
    );
};

const InterfaceMatrix: React.FC = () => {
    const { settings, handleUpdate, t, handleSetLanguage, language } = useSettingsPage();
    const colors: AccentColor[] = ['cyan', 'purple', 'green', 'amber', 'red'];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Theming */}
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Palette size={14} className="text-accent-purple" /> Visual Signature
                </h4>
                <div className="flex gap-4">
                    {colors.map(c => (
                        <button
                            key={c}
                            onClick={() => handleUpdate('accentColor', c)}
                            className={`
                                w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110
                                ${settings.accentColor === c ? 'border-white shadow-[0_0_15px_currentColor]' : 'border-transparent opacity-50 hover:opacity-100'}
                            `}
                            style={{ backgroundColor: `var(--color-${c}-500)`, color: `var(--color-${c}-500)` }}
                        >
                            {settings.accentColor === c && <div className="w-3 h-3 bg-white rounded-full" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Layout & Sound */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ControlToggle 
                    label={t.settings.labels.sound}
                    description={t.settings.labels.soundDesc}
                    checked={settings.soundEnabled}
                    onChange={(v) => handleUpdate('soundEnabled', v)}
                    icon={settings.soundEnabled ? <Volume2 size={18}/> : <VolumeX size={18}/>}
                />
                <ControlToggle 
                    label={t.settings.labels.motion}
                    description={t.settings.labels.motionDesc}
                    checked={settings.reducedMotion}
                    onChange={(v) => handleUpdate('reducedMotion', v)}
                    icon={<Layout size={18}/>}
                />
                <ControlToggle 
                    label={t.settings.labels.contrast}
                    description={t.settings.labels.contrastDesc}
                    checked={settings.highContrast}
                    onChange={(v) => handleUpdate('highContrast', v)}
                    icon={<Eye size={18}/>}
                />
                <ControlToggle 
                    label={t.settings.labels.compactMode}
                    description={t.settings.labels.compactModeDesc}
                    checked={settings.compactMode}
                    onChange={(v) => handleUpdate('compactMode', v)}
                    icon={<Grid size={18}/>}
                />
                <ControlToggle 
                    label={t.settings.labels.showTutorialHints}
                    description={t.settings.labels.showTutorialHintsDesc}
                    checked={settings.showTutorialHints}
                    onChange={(v) => handleUpdate('showTutorialHints', v)}
                    icon={<Eye size={18}/>}
                />
                
                {/* Density Switcher */}
                <div className="flex flex-col justify-center p-4 rounded-xl border bg-slate-950/30 border-slate-800">
                    <div className="flex items-center gap-2 mb-3 text-slate-400 font-bold text-xs uppercase tracking-wide">
                        <Grid size={16} /> {t.settings.labels.uiDensity}
                    </div>
                    <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                        {(['comfortable', 'compact'] as const).map(d => (
                            <button
                                key={d}
                                onClick={() => handleUpdate('uiDensity', d)}
                                className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${settings.uiDensity === d ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                {d === 'comfortable' ? t.settings.labels.densityComfortable : t.settings.labels.densityCompact}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Language */}
            <div className="pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{t.settings.labels.localization}</h4>
                <div className="flex gap-4">
                    <button onClick={() => handleSetLanguage('de')} className={`flex-1 p-4 border rounded-xl flex items-center justify-between transition-all ${language === 'de' ? 'bg-accent-cyan/10 border-accent-cyan text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                        <div className="flex items-center gap-3"><span className="text-2xl">🇩🇪</span> <span className="font-mono font-bold text-sm">{t.settings.labels.languageGerman}</span></div>
                        {language === 'de' && <div className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_8px_cyan]"></div>}
                    </button>
                    <button onClick={() => handleSetLanguage('en')} className={`flex-1 p-4 border rounded-xl flex items-center justify-between transition-all ${language === 'en' ? 'bg-accent-cyan/10 border-accent-cyan text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                        <div className="flex items-center gap-3"><span className="text-2xl">🇺🇸</span> <span className="font-mono font-bold text-sm">{t.settings.labels.languageEnglish}</span></div>
                        {language === 'en' && <div className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_8px_cyan]"></div>}
                    </button>
                </div>
            </div>
        </div>
    );
};

const DataSovereignty: React.FC = () => {
    const { settings, handleUpdate, handleExportData, handleSystemPurge, t, language, apiKeyInput, setApiKeyInput, apiKeySaved, apiKeyStatus, apiKeyVisible, setApiKeyVisible, apiKeyTesting, apiKeyFormatHint, saveGeminiKey, clearGeminiKey } = useSettingsPage();

    // Multi-provider key state
    const [xaiKeyInput, setXaiKeyInput] = useState('');
    const [xaiKeySaved, setXaiKeySaved] = useState(false);
    const [anthropicKeyInput, setAnthropicKeyInput] = useState('');
    const [anthropicKeySaved, setAnthropicKeySaved] = useState(false);
    const [providerKeyTesting, setProviderKeyTesting] = useState<string | null>(null);
    const [providerKeyStatus, setProviderKeyStatus] = useState<Record<string, string>>({});

    useEffect(() => {
      secureApiKeyService.hasProviderKey('xai').then(setXaiKeySaved).catch(() => setXaiKeySaved(false));
      secureApiKeyService.hasProviderKey('anthropic').then(setAnthropicKeySaved).catch(() => setAnthropicKeySaved(false));
    }, []);

    const saveProviderKey = useCallback(async (provider: 'xai' | 'anthropic', key: string) => {
      const { valid } = secureApiKeyService.validateKeyFormat(key, provider);
      if (!valid) {
        setProviderKeyStatus(prev => ({ ...prev, [provider]: language === 'de' ? 'Ungültiges Format.' : 'Invalid format.' }));
        return;
      }
      setProviderKeyTesting(provider);
      try {
        const testResult = await testProviderConnection(provider, key);
        if (!testResult.ok && testResult.error === 'INVALID_KEY') {
          setProviderKeyStatus(prev => ({ ...prev, [provider]: language === 'de' ? 'Key ungültig.' : 'Key invalid.' }));
          setProviderKeyTesting(null);
          return;
        }
        await secureApiKeyService.setProviderKey(provider, key);
        if (provider === 'xai') { setXaiKeySaved(true); setXaiKeyInput(''); }
        else { setAnthropicKeySaved(true); setAnthropicKeyInput(''); }
        setProviderKeyStatus(prev => ({ ...prev, [provider]: language === 'de' ? '✓ Verschlüsselt gespeichert.' : '✓ Encrypted & saved.' }));
      } catch {
        setProviderKeyStatus(prev => ({ ...prev, [provider]: language === 'de' ? 'Fehler beim Speichern.' : 'Save failed.' }));
      } finally {
        setProviderKeyTesting(null);
      }
    }, [language]);

    const clearProviderKey = useCallback(async (provider: 'xai' | 'anthropic') => {
      await secureApiKeyService.clearProviderKey(provider);
      if (provider === 'xai') setXaiKeySaved(false);
      else setAnthropicKeySaved(false);
      setProviderKeyStatus(prev => ({ ...prev, [provider]: language === 'de' ? 'Key entfernt.' : 'Key removed.' }));
    }, [language]);

    const ProviderKeyInput: React.FC<{ provider: 'xai' | 'anthropic'; label: string; placeholder: string; value: string; onChange: (v: string) => void; saved: boolean }> = 
      ({ provider, label, placeholder, value, onChange, saved }) => (
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-2 block flex items-center gap-2">
            <Shield size={14} className={provider === 'xai' ? 'text-orange-400' : 'text-amber-400'} /> {label}
          </label>
          <input type="password" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoComplete="off" spellCheck={false}
            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white placeholder:text-slate-500 font-mono focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/30 transition-colors" />
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Button variant="secondary" size="sm" onClick={() => saveProviderKey(provider, value)} disabled={providerKeyTesting === provider || !value.trim()} icon={providerKeyTesting === provider ? <Wifi size={14} className="animate-pulse" /> : <Lock size={14} />}>
              {providerKeyTesting === provider ? (language === 'de' ? 'Validiere...' : 'Validating...') : (language === 'de' ? 'Key speichern' : 'Save key')}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => clearProviderKey(provider)} disabled={!saved} icon={<Trash2 size={14} />}>
              {language === 'de' ? 'Key löschen' : 'Delete key'}
            </Button>
            <Badge label={saved ? '🔐 KeyVault' : (language === 'de' ? 'Nicht konfiguriert' : 'Not configured')} className={saved ? 'bg-green-900/30 text-green-400 border-green-700/40' : 'bg-slate-900 text-slate-400 border-slate-700'} />
          </div>
          {providerKeyStatus[provider] && <p className={`text-[11px] mt-2 ${providerKeyStatus[provider].startsWith('✓') ? 'text-green-400' : 'text-slate-400'}`}>{providerKeyStatus[provider]}</p>}
        </div>
      );

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Usage Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent pointer-events-none"></div>
                    <HardDrive size={48} className="text-blue-500 mb-4 opacity-80" />
                    <div className="text-2xl font-black text-white font-display">{t.settings.labels.localVault}</div>
                    <div className="text-xs text-blue-400 font-mono mt-2">{t.settings.labels.indexedDbEncrypted}</div>
                </div>
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6 space-y-4">
                    <ControlToggle 
                        label={t.settings.labels.incognito}
                        description={t.settings.labels.incognitoDesc}
                        checked={settings.incognitoMode}
                        onChange={(v) => handleUpdate('incognitoMode', v)}
                        icon={<Smartphone size={18}/>}
                    />
                    <ControlToggle 
                        label={t.settings.labels.autoArchiveChats}
                        description={t.settings.labels.autoArchiveDesc}
                        checked={settings.autoArchive}
                        onChange={(v) => handleUpdate('autoArchive', v)}
                        icon={<Server size={18}/>}
                    />
                    <ControlToggle 
                        label={t.settings.labels.telemetryEnabled}
                        description={t.settings.labels.telemetryEnabledDesc}
                        checked={settings.telemetryEnabled}
                        onChange={(v) => handleUpdate('telemetryEnabled', v)}
                        icon={<Activity size={18}/>}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-2 block flex items-center gap-2">
                        <Shield size={14} className="text-accent-cyan" /> Gemini API Key (BYOK)
                    </label>
                    <p className="text-[11px] text-yellow-300 mb-3 leading-relaxed">
                        {language === 'de'
                            ? '🔒 Sicherheitshinweis: Der API-Key wird ausschließlich lokal in einem dedizierten IndexedDB-KeyVault gespeichert und mit AES-256-GCM verschlüsselt. Niemals im Quellcode, in .env oder in localStorage.'
                            : '🔒 Security notice: The API key is stored exclusively in a dedicated IndexedDB KeyVault, encrypted with AES-256-GCM. Never in source code, .env, or localStorage.'}
                    </p>
                    <div className="relative">
                        <input
                            type={apiKeyVisible ? 'text' : 'password'}
                            value={apiKeyInput}
                            onChange={(e) => setApiKeyInput(e.target.value)}
                            placeholder="AIza..."
                            aria-label="Gemini API Key"
                            autoComplete="off"
                            spellCheck={false}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 pr-10 text-sm text-white placeholder:text-slate-500 font-mono focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/30 transition-colors"
                        />
                        <button
                            type="button"
                            onClick={() => setApiKeyVisible(!apiKeyVisible)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                            aria-label={apiKeyVisible ? 'Hide API key' : 'Show API key'}
                        >
                            {apiKeyVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {apiKeyFormatHint && (
                        <p className="text-[11px] text-amber-400 mt-1.5 font-mono">{apiKeyFormatHint}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        <Button variant="secondary" size="sm" onClick={saveGeminiKey} disabled={apiKeyTesting || !apiKeyInput.trim()} icon={apiKeyTesting ? <Wifi size={14} className="animate-pulse" /> : <Lock size={14} />}>
                            {apiKeyTesting
                                ? (language === 'de' ? 'Validiere...' : 'Validating...')
                                : (language === 'de' ? 'Key speichern' : 'Save key')}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={clearGeminiKey} disabled={!apiKeySaved} icon={<Trash2 size={14} />}>
                            {language === 'de' ? 'Key löschen' : 'Delete key'}
                        </Button>
                        <Badge label={apiKeySaved ? (language === 'de' ? '🔐 Verschlüsselt im KeyVault' : '🔐 Encrypted in KeyVault') : (language === 'de' ? 'Nicht konfiguriert' : 'Not configured')} className={apiKeySaved ? 'bg-green-900/30 text-green-400 border-green-700/40' : 'bg-slate-900 text-slate-400 border-slate-700'} />
                    </div>
                    {apiKeyStatus && <p className={`text-[11px] mt-2 ${apiKeyStatus.startsWith('✓') ? 'text-green-400' : 'text-slate-400'}`}>{apiKeyStatus}</p>}
                    <div className="mt-3 p-2.5 bg-slate-900/50 border border-slate-800/50 rounded-lg">
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                            {language === 'de'
                                ? '💡 Empfehlung: Erstelle einen dedizierten API-Key in Google AI Studio, beschränke ihn auf deine Domain (*.github.io) und aktiviere Rate-Limits.'
                                : '💡 Recommendation: Create a dedicated API key in Google AI Studio, restrict it to your domain (*.github.io) and enable rate limits.'}
                        </p>
                    </div>
                </div>

                {/* xAI Grok API Key */}
                <ProviderKeyInput provider="xai" label="xAI Grok API Key" placeholder="xai-..." value={xaiKeyInput} onChange={setXaiKeyInput} saved={xaiKeySaved} />

                {/* Anthropic Claude API Key */}
                <ProviderKeyInput provider="anthropic" label="Anthropic Claude API Key" placeholder="sk-ant-..." value={anthropicKeyInput} onChange={setAnthropicKeyInput} saved={anthropicKeySaved} />

                <Button onClick={handleExportData} variant="secondary" icon={<Download size={16}/>} className="w-full h-12 bg-slate-900 hover:border-accent-cyan text-sm tracking-widest">
                    {t.settings.labels.exportEncryptedShard}
                </Button>
                
                <div className="pt-4">
                    <label className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4 block flex items-center gap-2">
                        <AlertOctagon size={12} /> {t.settings.labels.dangerZone}
                    </label>
                    <HoldButton 
                        label={t.settings.labels.initiateSystemPurge}
                        sub={t.settings.labels.purgeIrreversibleSub}
                        onComplete={handleSystemPurge} 
                        icon={<Trash2 size={16} />} 
                    />
                </div>
            </div>
        </div>
    );
};

const SystemDiagnostics: React.FC = () => {
    const { systemMetrics, t } = useSettingsPage();

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Real-time Charts */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 h-64 flex flex-col">
                <div className="flex justify-between items-center mb-4 px-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Activity size={14} className="text-green-500 animate-pulse" /> {t.settings.labels.liveTelemetry}
                    </h4>
                    <div className="flex gap-2">
                        <span className="text-[9px] font-mono text-blue-400">CPU</span>
                        <span className="text-[9px] font-mono text-purple-400">MEM</span>
                    </div>
                </div>
                <div className="flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <AreaChart data={systemMetrics}>
                            <defs>
                                <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="time" hide />
                            <YAxis hide domain={[0, 100]} />
                            <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155', fontSize: '10px'}} />
                            <Area type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} fill="url(#cpuGrad)" isAnimationActive={false} />
                            <Area type="monotone" dataKey="mem" stroke="#a855f7" strokeWidth={2} fill="url(#memGrad)" isAnimationActive={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Spec Sheet */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-slate-900/50 p-3 rounded border border-slate-800 flex justify-between">
                    <span className="text-slate-500">{t.settings.labels.kernel}</span>
                    <span className="text-white">v2.7.0</span>
                </div>
                <div className="bg-slate-900/50 p-3 rounded border border-slate-800 flex justify-between">
                    <span className="text-slate-500">{t.settings.labels.react}</span>
                    <span className="text-blue-400">v19.2.0</span>
                </div>
                <div className="bg-slate-900/50 p-3 rounded border border-slate-800 flex justify-between">
                    <span className="text-slate-500">{t.settings.labels.geminiSdk}</span>
                    <span className="text-purple-400">v1.30.0</span>
                </div>
                <div className="bg-slate-900/50 p-3 rounded border border-slate-800 flex justify-between">
                    <span className="text-slate-500">{t.settings.labels.uptime}</span>
                    <span className="text-green-400">99.9%</span>
                </div>
            </div>
        </div>
    );
};

const PerformanceControls: React.FC = () => {
    const { settings, handleUpdate, t } = useSettingsPage();

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Cache Strategy */}
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Zap size={14} className="text-yellow-400" /> {t.settings.labels.cacheStrategy}
                </h4>
                <p className="text-[10px] text-slate-400 mb-4">{t.settings.labels.cacheStrategyDesc}</p>
                <div className="grid grid-cols-3 gap-3">
                    {(['aggressive', 'balanced', 'minimal'] as const).map(strategy => (
                        <button
                            key={strategy}
                            onClick={() => handleUpdate('cacheStrategy', strategy)}
                            className={`py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                                settings.cacheStrategy === strategy 
                                    ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.2)]' 
                                    : 'bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800 hover:border-slate-600'
                            }`}
                        >
                            {t.settings.labels[`cacheStrategy${strategy.charAt(0).toUpperCase() + strategy.slice(1)}` as keyof typeof t.settings.labels]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Performance Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ControlToggle 
                    label={t.settings.labels.prefetchEnabled}
                    description={t.settings.labels.prefetchEnabledDesc}
                    checked={settings.prefetchEnabled}
                    onChange={(v) => handleUpdate('prefetchEnabled', v)}
                    icon={<Zap size={18}/>}
                />
                <ControlToggle 
                    label={t.settings.labels.dataSaverMode}
                    description={t.settings.labels.dataSaverModeDesc}
                    checked={settings.dataSaverMode}
                    onChange={(v) => handleUpdate('dataSaverMode', v)}
                    icon={<Smartphone size={18}/>}
                />
                <ControlToggle 
                    label={t.settings.labels.offlineFirst}
                    description={t.settings.labels.offlineFirstDesc}
                    checked={settings.offlineFirst}
                    onChange={(v) => handleUpdate('offlineFirst', v)}
                    icon={<HardDrive size={18}/>}
                />
                <ControlToggle 
                    label={t.settings.labels.autoClearCache}
                    description={t.settings.labels.autoClearCacheDesc}
                    checked={settings.autoClearCache}
                    onChange={(v) => handleUpdate('autoClearCache', v)}
                    icon={<Trash2 size={18}/>}
                />
            </div>

            {/* Cache Size Slider */}
            <RangeSlider 
                label={t.settings.labels.maxCacheSize}
                value={settings.maxCacheSize} 
                min={10} max={500} step={10} 
                onChange={(v) => handleUpdate('maxCacheSize', v)}
                format={(v) => `${v} MB`}
                color="bg-yellow-500"
            />
        </div>
    );
};

const BackupManager: React.FC = () => {
    const { settings, handleUpdate, t, language } = useSettingsPage();
    const lastBackup = settings.lastBackupTimestamp > 0 
        ? new Date(settings.lastBackupTimestamp).toLocaleString(language === 'de' ? 'de-DE' : 'en-US')
        : (language === 'de' ? 'Nie' : 'Never');

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Auto-Backup Toggle */}
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6">
                <ControlToggle 
                    label={t.settings.labels.autoBackup}
                    description={t.settings.labels.autoBackupDesc}
                    checked={settings.autoBackup}
                    onChange={(v) => handleUpdate('autoBackup', v)}
                    icon={<HardDrive size={18}/>}
                />
            </div>

            {/* Backup Configuration */}
            <div className={`space-y-6 transition-opacity duration-300 ${settings.autoBackup ? 'opacity-100' : 'opacity-40 pointer-events-none grayscale'}`}>
                {/* Interval Slider */}
                <RangeSlider 
                    label={t.settings.labels.backupInterval}
                    value={settings.backupInterval} 
                    min={6} max={168} step={6} 
                    onChange={(v) => handleUpdate('backupInterval', v)}
                    format={(v) => `${v}h`}
                    color="bg-orange-500"
                />

                {/* Backup Location */}
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6">
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                        <HardDrive size={14} className="text-orange-400" /> {t.settings.labels.backupLocation}
                    </h4>
                    <p className="text-[10px] text-slate-400 mb-4">{t.settings.labels.backupLocationDesc}</p>
                    <div className="grid grid-cols-3 gap-3">
                        {(['local', 'cloud', 'disabled'] as const).map(location => (
                            <button
                                key={location}
                                onClick={() => handleUpdate('backupLocation', location)}
                                className={`py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                                    settings.backupLocation === location 
                                        ? 'bg-orange-500/20 border-orange-500 text-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.2)]' 
                                        : 'bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800 hover:border-slate-600'
                                }`}
                            >
                                {t.settings.labels[`backupLocation${location.charAt(0).toUpperCase() + location.slice(1)}` as keyof typeof t.settings.labels]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Last Backup Info */}
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.settings.labels.lastBackupTimestamp}</div>
                        <div className="text-sm text-white font-mono mt-1">{lastBackup}</div>
                    </div>
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => handleUpdate('lastBackupTimestamp', Date.now())}
                        icon={<Download size={14}/>}
                    >
                        {language === 'de' ? 'Jetzt sichern' : 'Backup Now'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

const AdvancedTools: React.FC = () => {
    const { settings, handleUpdate, t } = useSettingsPage();

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Developer Tools */}
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Terminal size={14} className="text-pink-400" /> Developer Tools
                </h4>
                <div className="space-y-4">
                    <ControlToggle 
                        label={t.settings.labels.keyboardShortcuts}
                        description={t.settings.labels.keyboardShortcutsDesc}
                        checked={settings.keyboardShortcuts}
                        onChange={(v) => handleUpdate('keyboardShortcuts', v)}
                        icon={<Layout size={18}/>}
                    />
                    <ControlToggle 
                        label={t.settings.labels.debugMode}
                        description={t.settings.labels.debugModeDesc}
                        checked={settings.debugMode}
                        onChange={(v) => handleUpdate('debugMode', v)}
                        icon={<Terminal size={18}/>}
                    />
                    <ControlToggle 
                        label={t.settings.labels.verboseLogging}
                        description={t.settings.labels.verboseLoggingDesc}
                        checked={settings.verboseLogging}
                        onChange={(v) => handleUpdate('verboseLogging', v)}
                        icon={<Activity size={18}/>}
                    />
                </div>
            </div>

            {/* Monitoring Tools */}
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Activity size={14} className="text-green-400" /> Monitoring
                </h4>
                <div className="space-y-4">
                    <ControlToggle 
                        label={t.settings.labels.networkMonitor}
                        description={t.settings.labels.networkMonitorDesc}
                        checked={settings.networkMonitor}
                        onChange={(v) => handleUpdate('networkMonitor', v)}
                        icon={<Activity size={18}/>}
                    />
                    <ControlToggle 
                        label={t.settings.labels.cacheInspector}
                        description={t.settings.labels.cacheInspectorDesc}
                        checked={settings.cacheInspector}
                        onChange={(v) => handleUpdate('cacheInspector', v)}
                        icon={<HardDrive size={18}/>}
                    />
                </div>
            </div>

            {/* Experimental Features */}
            <div className="bg-gradient-to-br from-pink-950/30 to-slate-950/30 border border-pink-900/50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <AlertOctagon size={14} className="text-pink-400" />
                    <h4 className="text-xs font-bold text-pink-300 uppercase tracking-widest">Experimental</h4>
                </div>
                <ControlToggle 
                    label={t.settings.labels.experimentalFeatures}
                    description={t.settings.labels.experimentalFeaturesDesc}
                    checked={settings.experimentalFeatures}
                    onChange={(v) => handleUpdate('experimentalFeatures', v)}
                    icon={<Zap size={18}/>}
                />
            </div>
        </div>
    );
};

// --- 4. Main Components ---

const SettingsSidebar: React.FC = () => {
    const { activeTab, handleSetActiveTab, t } = useSettingsPage();
  
  const tabs = [
        { id: 'GENERAL', label: t.settings.tabs.GENERAL, icon: <Cpu size={16} />, color: 'text-blue-400' },
        { id: 'INTELLIGENCE', label: t.settings.tabs.INTELLIGENCE, icon: <Brain size={16} />, color: 'text-purple-400' },
        { id: 'INTERFACE', label: t.settings.tabs.INTERFACE, icon: <Layout size={16} />, color: 'text-cyan-400' },
        { id: 'PRIVACY', label: t.settings.tabs.PRIVACY, icon: <Shield size={16} />, color: 'text-green-400' },
        { id: 'PERFORMANCE', label: 'Performance', icon: <Zap size={16} />, color: 'text-yellow-400' },
        { id: 'BACKUP', label: 'Backup', icon: <HardDrive size={16} />, color: 'text-orange-400' },
        { id: 'ADVANCED', label: 'Advanced', icon: <Terminal size={16} />, color: 'text-pink-400' },
        { id: 'SYSTEM', label: t.settings.tabs.SYSTEM, icon: <Activity size={16} />, color: 'text-red-400' },
  ];

  return (
    <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible gap-2 pb-4 md:pb-0 md:pr-6 md:w-64 flex-shrink-0 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
      <div className="hidden md:block mb-4 pl-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
        {t.settings.sidebarConfig}
      </div>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => handleSetActiveTab(tab.id)}
          className={`
            flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wide md:tracking-wider transition-all whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan shrink-0 min-w-max
            ${activeTab === tab.id 
              ? 'bg-slate-800 text-white shadow-lg border-l-4 border-accent-cyan' 
              : 'bg-transparent text-slate-500 border-l-4 border-transparent hover:bg-slate-900/50 hover:text-slate-300'}
          `}
        >
          <span className={activeTab === tab.id ? tab.color : 'text-slate-600'}>{tab.icon}</span>
          <span className="block">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

const SettingsContent: React.FC = () => {
    const { activeTab, t } = useSettingsPage();
    switch (activeTab) {
        case 'GENERAL': return <div className="p-2"><h3 className="text-xl font-bold text-white mb-6">{t.settings.generalTitle}</h3><div className="space-y-6"><InterfaceMatrix /><DataSovereignty /></div></div>; // Combined for "General" feel
        case 'INTELLIGENCE': return <NeuralEngineConfig />;
        case 'INTERFACE': return <InterfaceMatrix />;
        case 'PRIVACY': return <DataSovereignty />;
        case 'PERFORMANCE': return <PerformanceControls />;
        case 'BACKUP': return <BackupManager />;
        case 'ADVANCED': return <AdvancedTools />;
        case 'SYSTEM': return <SystemDiagnostics />;
        default: return null;
    }
};

const LogTerminal: React.FC = () => {
    const { logs, t } = useSettingsPage();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [logs]);

    if (logs.length === 0) return null;

    return (
        <div className="mt-8 bg-black rounded-xl border border-slate-800/80 overflow-hidden font-mono text-[10px] shadow-2xl relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
            <div className="flex items-center justify-between bg-slate-900/90 px-4 py-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest">
                    <Terminal size={12} /> {t.settings.labels.systemOutputStream}
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                </div>
            </div>
            <div ref={scrollRef} className="h-32 overflow-y-auto p-4 space-y-1 text-slate-400 scrollbar-thin scrollbar-thumb-slate-800 relative z-10">
                {logs.map(log => (
                    <div key={log.id} className="flex gap-3 hover:bg-white/5 px-1 rounded">
                        <span className="text-slate-600 opacity-60">[{log.timestamp}]</span>
                        <span className={log.type === 'error' ? 'text-red-500 font-bold' : log.type === 'success' ? 'text-green-500' : 'text-blue-400'}>
                            {log.type.toUpperCase()}
                        </span>
                        <span className="text-slate-300 break-all">{log.message}</span>
                    </div>
                ))}
                <div className="text-accent-cyan animate-pulse">_</div>
            </div>
        </div>
    );
};

const SettingsPageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const logic = useSettingsPageLogic();
    return <SettingsPageContext.Provider value={logic}>{children}</SettingsPageContext.Provider>;
};

export const Settings: React.FC = () => {
    const { t } = useLanguage();

    return (
        <SettingsPageProvider>
            <div className="max-w-6xl mx-auto animate-fade-in pb-20">
                <PageHeader 
                    title={t.settings.headerTitle}
                    subtitle={t.settings.headerSubtitle}
                    icon={SettingsIcon}
                    status={t.settings.headerStatus}
                    visualizerState="IDLE"
                />
                
                <Card className="min-h-[600px] flex flex-col md:flex-row p-0 overflow-hidden bg-slate-950/80 backdrop-blur-xl border-slate-800 shadow-2xl relative mt-6">
                    {/* Background Noise */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-5 pointer-events-none"></div>
                    
                    <div className="border-b md:border-b-0 md:border-r border-slate-800 p-6 bg-slate-900/30 w-full md:w-64 shrink-0 relative z-10">
                        <SettingsSidebar />
                    </div>
                    
                    <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-[#0a0f18]/60 relative z-10">
                        <SettingsContent />
                    </div>
                </Card>

                <LogTerminal />
            </div>
        </SettingsPageProvider>
    );
};

export default Settings;