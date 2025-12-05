
import React, { useRef, useEffect, createContext, useContext, useCallback, useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext'; 
import { 
  Settings as SettingsIcon, Globe, Info, 
  Cpu, Layout, Terminal, 
  Volume2, VolumeX, Eye, 
  Trash2, Download, Smartphone, 
  Shield, Zap, Brain, AlertOctagon,
  HardDrive, Activity, Layers, Lock,
  Palette, Grid, Radio, Speaker, CheckCircle2,
  BarChart3, Wifi, Server
} from 'lucide-react';
import { Card, Button, Badge, PageHeader } from './ui/Common';
import { useAppDispatch } from '../store/hooks';
import { setLanguage as setReduxLanguage } from '../store/slices/settingsSlice';
import { AppSettings, Language, AccentColor } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

// --- 1. Logic Hook ---

const useSettingsPageLogic = () => {
    const { activeTab, settings, logs, updateSetting: contextUpdate, clearData, exportData, setActiveTab: contextSetActiveTab } = useSettings();
    const { language, setLanguage, t } = useLanguage();
    const dispatch = useAppDispatch();

    // Simulated Real-time Metrics
    const [systemMetrics, setSystemMetrics] = useState<{time: number, cpu: number, mem: number, net: number}[]>([]);

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
        handleSystemPurge
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
                        {isComplete ? "PROTOCOL EXECUTED" : (progress > 0 ? `CONFIRMING... ${progress}%` : label)}
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
  <div 
    onClick={() => onChange(!checked)}
    className={`
      flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group select-none relative overflow-hidden
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
  </div>
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
    const isPro = settings.aiModelVersion.includes('pro');

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Model Selector Cards */}
                <button 
                    onClick={() => handleUpdate('aiModelVersion', 'gemini-2.5-flash')}
                    className={`relative p-5 rounded-xl border text-left overflow-hidden transition-all group ${settings.aiModelVersion === 'gemini-2.5-flash' ? 'bg-slate-900 border-accent-cyan/60 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'bg-slate-950/50 border-slate-800 hover:border-slate-600'}`}
                >
                    <div className="flex justify-between items-start mb-2 relative z-10">
                        <Zap size={24} className={settings.aiModelVersion.includes('flash') ? 'text-accent-cyan' : 'text-slate-600'} />
                        {settings.aiModelVersion.includes('flash') && <div className="px-2 py-0.5 bg-accent-cyan/10 border border-accent-cyan/30 rounded text-[9px] font-bold text-accent-cyan uppercase">Active Core</div>}
                    </div>
                    <div className="relative z-10">
                        <div className="font-bold text-white text-sm mb-1">Gemini 2.5 Flash</div>
                        <div className="text-[10px] text-slate-400 font-mono leading-relaxed">High-velocity inference engine. Optimized for rapid debunking and low-latency chat interactions.</div>
                    </div>
                    {settings.aiModelVersion.includes('flash') && <div className="absolute inset-0 bg-accent-cyan/5 pointer-events-none animate-pulse-slow"></div>}
                </button>

                <button 
                    onClick={() => handleUpdate('aiModelVersion', 'gemini-3-pro-preview')}
                    className={`relative p-5 rounded-xl border text-left overflow-hidden transition-all group ${settings.aiModelVersion.includes('pro') ? 'bg-slate-900 border-accent-purple/60 shadow-[0_0_20px_rgba(139,92,246,0.15)]' : 'bg-slate-950/50 border-slate-800 hover:border-slate-600'}`}
                >
                    <div className="flex justify-between items-start mb-2 relative z-10">
                        <Brain size={24} className={settings.aiModelVersion.includes('pro') ? 'text-accent-purple' : 'text-slate-600'} />
                        {settings.aiModelVersion.includes('pro') && <div className="px-2 py-0.5 bg-accent-purple/10 border border-accent-purple/30 rounded text-[9px] font-bold text-accent-purple uppercase">Active Core</div>}
                    </div>
                    <div className="relative z-10">
                        <div className="font-bold text-white text-sm mb-1">Gemini 3.0 Pro</div>
                        <div className="text-[10px] text-slate-400 font-mono leading-relaxed">Advanced reasoning capabilities. Unlocks deep-logic chains and complex pattern recognition.</div>
                    </div>
                    {settings.aiModelVersion.includes('pro') && <div className="absolute inset-0 bg-accent-purple/5 pointer-events-none animate-pulse-slow"></div>}
                </button>
            </div>

            {/* Neural Parameters */}
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Cpu size={120} /></div>
                
                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Activity size={14} className="text-accent-cyan" /> Synaptic Configuration
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
                            label="Reasoning Budget (Tokens)"
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
                                    py-2 px-3 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all
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
                        Current Safety Protocol: {settings.safetyLevel}
                    </div>
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
                
                {/* Density Switcher */}
                <div className="flex flex-col justify-center p-4 rounded-xl border bg-slate-950/30 border-slate-800">
                    <div className="flex items-center gap-2 mb-3 text-slate-400 font-bold text-xs uppercase tracking-wide">
                        <Grid size={16} /> UI Density
                    </div>
                    <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                        {(['comfortable', 'compact'] as const).map(d => (
                            <button
                                key={d}
                                onClick={() => handleUpdate('uiDensity', d)}
                                className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${settings.uiDensity === d ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Language */}
            <div className="pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Localization</h4>
                <div className="flex gap-4">
                    <button onClick={() => handleSetLanguage('de')} className={`flex-1 p-4 border rounded-xl flex items-center justify-between transition-all ${language === 'de' ? 'bg-accent-cyan/10 border-accent-cyan text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                        <div className="flex items-center gap-3"><span className="text-2xl">🇩🇪</span> <span className="font-mono font-bold text-sm">DEUTSCH</span></div>
                        {language === 'de' && <div className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_8px_cyan]"></div>}
                    </button>
                    <button onClick={() => handleSetLanguage('en')} className={`flex-1 p-4 border rounded-xl flex items-center justify-between transition-all ${language === 'en' ? 'bg-accent-cyan/10 border-accent-cyan text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                        <div className="flex items-center gap-3"><span className="text-2xl">🇺🇸</span> <span className="font-mono font-bold text-sm">ENGLISH</span></div>
                        {language === 'en' && <div className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_8px_cyan]"></div>}
                    </button>
                </div>
            </div>
        </div>
    );
};

const DataSovereignty: React.FC = () => {
    const { settings, handleUpdate, handleExportData, handleSystemPurge, t } = useSettingsPage();

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Usage Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent pointer-events-none"></div>
                    <HardDrive size={48} className="text-blue-500 mb-4 opacity-80" />
                    <div className="text-2xl font-black text-white font-display">LOCAL VAULT</div>
                    <div className="text-xs text-blue-400 font-mono mt-2">INDEXED_DB ENCRYPTED</div>
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
                        label="Auto-Archive Chats"
                        description="Automatically save sessions to Vault."
                        checked={settings.autoArchive}
                        onChange={(v) => handleUpdate('autoArchive', v)}
                        icon={<Server size={18}/>}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
                <Button onClick={handleExportData} variant="secondary" icon={<Download size={16}/>} className="w-full h-12 bg-slate-900 hover:border-accent-cyan text-sm tracking-widest">
                    EXPORT ENCRYPTED SHARD (JSON)
                </Button>
                
                <div className="pt-4">
                    <label className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4 block flex items-center gap-2">
                        <AlertOctagon size={12} /> Danger Zone
                    </label>
                    <HoldButton 
                        label="INITIATE SYSTEM PURGE" 
                        sub="Irreversible. Wipes all local data."
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
                        <Activity size={14} className="text-green-500 animate-pulse" /> Live Telemetry
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
                    <span className="text-slate-500">KERNEL</span>
                    <span className="text-white">v2.7.0</span>
                </div>
                <div className="bg-slate-900/50 p-3 rounded border border-slate-800 flex justify-between">
                    <span className="text-slate-500">REACT</span>
                    <span className="text-blue-400">v19.2.0</span>
                </div>
                <div className="bg-slate-900/50 p-3 rounded border border-slate-800 flex justify-between">
                    <span className="text-slate-500">GEMINI SDK</span>
                    <span className="text-purple-400">v1.30.0</span>
                </div>
                <div className="bg-slate-900/50 p-3 rounded border border-slate-800 flex justify-between">
                    <span className="text-slate-500">UPTIME</span>
                    <span className="text-green-400">99.9%</span>
                </div>
            </div>
        </div>
    );
};

// --- 4. Main Components ---

const SettingsSidebar: React.FC = () => {
  const { activeTab, handleSetActiveTab } = useSettingsPage();
  
  const tabs = [
    { id: 'GENERAL', label: 'System Core', icon: <Cpu size={16} />, color: 'text-blue-400' },
    { id: 'INTELLIGENCE', label: 'Neural Engine', icon: <Brain size={16} />, color: 'text-purple-400' },
    { id: 'INTERFACE', label: 'Interface Matrix', icon: <Layout size={16} />, color: 'text-cyan-400' },
    { id: 'PRIVACY', label: 'Data Sovereignty', icon: <Shield size={16} />, color: 'text-green-400' },
    { id: 'SYSTEM', label: 'Diagnostics', icon: <Activity size={16} />, color: 'text-red-400' },
  ];

  return (
    <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible gap-2 pb-4 md:pb-0 md:pr-6 md:w-64 flex-shrink-0 scrollbar-hide">
      <div className="hidden md:block mb-4 pl-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
        Configuration
      </div>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => handleSetActiveTab(tab.id)}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan
            ${activeTab === tab.id 
              ? 'bg-slate-800 text-white shadow-lg border-l-4 border-accent-cyan' 
              : 'bg-transparent text-slate-500 border-l-4 border-transparent hover:bg-slate-900/50 hover:text-slate-300'}
          `}
        >
          <span className={activeTab === tab.id ? tab.color : 'text-slate-600'}>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
};

const SettingsContent: React.FC = () => {
    const { activeTab } = useSettingsPage();
    switch (activeTab) {
        case 'GENERAL': return <div className="p-2"><h3 className="text-xl font-bold text-white mb-6">System Core Parameters</h3><div className="space-y-6"><InterfaceMatrix /><DataSovereignty /></div></div>; // Combined for "General" feel
        case 'INTELLIGENCE': return <NeuralEngineConfig />;
        case 'INTERFACE': return <InterfaceMatrix />;
        case 'PRIVACY': return <DataSovereignty />;
        case 'SYSTEM': return <SystemDiagnostics />;
        default: return null;
    }
};

const LogTerminal: React.FC = () => {
    const { logs } = useSettingsPage();
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
                    <Terminal size={12} /> System Output Stream
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
    return (
        <SettingsPageProvider>
            <div className="max-w-6xl mx-auto animate-fade-in pb-20">
                <PageHeader 
                    title="SYSTEM CONFIG" 
                    subtitle="CENTRAL CONTROL DECK // LEVEL 5" 
                    icon={SettingsIcon}
                    status="EDITABLE"
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