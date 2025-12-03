import React, { useRef, useEffect, createContext, useContext, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext'; 
import { 
  Settings as SettingsIcon, Globe, Info, 
  Cpu, Layout, Terminal, 
  Volume2, VolumeX, Eye, 
  Trash2, Download, Smartphone, 
  Shield, Bot, Check, Skull
} from 'lucide-react';
import { Card, Button, Badge, PageHeader } from './ui/Common';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateSetting, setLanguage as setReduxLanguage, setActiveTab } from '../store/slices/settingsSlice';
import { AppSettings, Language } from '../types';
import { useSettings } from '../contexts/SettingsContext';

// --- 1. Logic Hook ---

const useSettingsPageLogic = () => {
    const { activeTab, settings, logs, updateSetting: contextUpdate, clearData, exportData, setActiveTab: contextSetActiveTab } = useSettings();
    const { language, setLanguage, t } = useLanguage();
    const dispatch = useAppDispatch();

    const handleUpdate = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
        contextUpdate(key, value);
    }, [contextUpdate]);

    const handleSetLanguage = useCallback((lang: Language) => {
        setLanguage(lang);
        dispatch(setReduxLanguage(lang));
    }, [setLanguage, dispatch]);

    const handleSystemPurge = useCallback(() => {
        if (confirm('CRITICAL WARNING: This will factory reset the entire application state and clear all local databases. This action cannot be undone.')) {
            clearData();
            // Dispatch the global reset action caught by rootReducer
            dispatch({ type: 'settings/systemPurge' });
        }
    }, [dispatch, clearData]);

    return {
        activeTab,
        settings,
        logs,
        language,
        t,
        handleUpdate,
        handleClearData: clearData,
        handleExportData: exportData,
        handleSetLanguage,
        handleSetActiveTab: contextSetActiveTab,
        handleSystemPurge
    };
};

// --- 2. Context & Provider ---

type SettingsPageContextType = ReturnType<typeof useSettingsPageLogic>;
const SettingsPageContext = createContext<SettingsPageContextType | undefined>(undefined);

const useSettingsPage = () => {
    const context = useContext(SettingsPageContext);
    if (!context) throw new Error('useSettingsPage must be used within a SettingsPageProvider');
    return context;
};

const SettingsPageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const logic = useSettingsPageLogic();
    return <SettingsPageContext.Provider value={logic}>{children}</SettingsPageContext.Provider>;
};

// --- 3. Sub-Components ---

// Reusable Inputs (kept as pure functional components)
const Toggle: React.FC<{ label: string; description?: string; checked: boolean; onChange: (checked: boolean) => void; icon?: React.ReactNode }> = React.memo(({ label, description, checked, onChange, icon }) => (
  <div 
    role="switch"
    aria-checked={checked}
    tabIndex={0}
    onClick={() => onChange(!checked)}
    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(!checked); }}}
    className={`
      flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group select-none outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan
      ${checked ? 'bg-accent-cyan/5 border-accent-cyan/40 shadow-[inset_0_0_10px_rgba(6,182,212,0.05)]' : 'bg-slate-950/50 border-slate-800 hover:border-slate-600 hover:bg-slate-900'}
    `}
  >
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-lg transition-colors ${checked ? 'text-accent-cyan bg-accent-cyan/10' : 'text-slate-500 bg-slate-900'}`}>
        {icon}
      </div>
      <div>
        <div className={`font-bold text-sm transition-colors ${checked ? 'text-white' : 'text-slate-400'}`}>{label}</div>
        {description && <div className="text-xs text-slate-500 mt-0.5">{description}</div>}
      </div>
    </div>
    
    <div className={`
      w-12 h-6 rounded-sm p-1 transition-all relative border
      ${checked ? 'bg-accent-cyan/20 border-accent-cyan' : 'bg-slate-900 border-slate-700'}
    `}>
      <div className={`
        w-4 h-3.5 rounded-sm bg-current shadow-sm transition-all duration-300
        ${checked ? 'translate-x-6 text-accent-cyan shadow-[0_0_10px_cyan]' : 'translate-x-0 text-slate-500'}
      `}></div>
    </div>
  </div>
));

const Slider: React.FC<{ label: string; value: number; min: number; max: number; step: number; onChange: (val: number) => void; formatValue?: (val: number) => string }> = React.memo(({ label, value, min, max, step, onChange, formatValue }) => (
  <div className="p-6 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
    <div className="flex justify-between mb-4">
      <span className="font-bold text-sm text-slate-300" id={`slider-label-${label.replace(/\s/g, '')}`}>{label}</span>
      <span className="font-mono text-accent-cyan text-xs bg-accent-cyan/10 px-2 py-1 rounded border border-accent-cyan/20 min-w-[3rem] text-center">
        {formatValue ? formatValue(value) : value}
      </span>
    </div>
    <div className="relative h-2 bg-slate-900 rounded-full border border-slate-800">
        <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full opacity-80 pointer-events-none"
            style={{ width: `${(value / max) * 100}%` }}
        ></div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            aria-labelledby={`slider-label-${label.replace(/\s/g, '')}`}
        />
    </div>
  </div>
));

const SettingsSidebar: React.FC = () => {
  const { activeTab, t, handleSetActiveTab } = useSettingsPage();
  
  const tabs: { id: string; label: string; icon: React.ReactNode }[] = [
    { id: 'GENERAL', label: t.settings.tabs.GENERAL, icon: <Globe size={16} /> },
    { id: 'INTELLIGENCE', label: t.settings.tabs.INTELLIGENCE, icon: <Cpu size={16} /> },
    { id: 'INTERFACE', label: t.settings.tabs.INTERFACE, icon: <Layout size={16} /> },
    { id: 'PRIVACY', label: t.settings.tabs.PRIVACY, icon: <Shield size={16} /> },
    { id: 'SYSTEM', label: t.settings.tabs.SYSTEM, icon: <Info size={16} /> },
  ];

  return (
    <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible gap-2 pb-4 md:pb-0 md:pr-6 md:w-64 flex-shrink-0 scrollbar-hide">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => handleSetActiveTab(tab.id)}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan
            ${activeTab === tab.id 
              ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
              : 'bg-slate-900/20 text-slate-500 border border-transparent hover:bg-slate-800 hover:text-slate-300'}
          `}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

const SettingsContent: React.FC = () => {
  const { activeTab, settings, t, language, handleUpdate, handleSetLanguage, handleClearData, handleExportData, handleSystemPurge } = useSettingsPage();

  switch (activeTab) {
      case 'GENERAL':
        return (
          <div className="space-y-6 animate-fade-in">
             <div className="mb-8 border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-white mb-2">{t.settings.sections.localization.title}</h3>
                <p className="text-sm text-slate-400">{t.settings.sections.localization.desc}</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <button 
                 onClick={() => handleSetLanguage('de')}
                 className={`p-6 rounded-xl border flex items-center justify-between transition-all group relative overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan ${
                   language === 'de' ? 'bg-accent-cyan/10 border-accent-cyan ring-1 ring-accent-cyan/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'bg-slate-950/50 border-slate-800 hover:border-slate-600'
                 }`}
                 aria-pressed={language === 'de'}
               >
                 <div className="flex items-center gap-4 relative z-10">
                   <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">🇩🇪</div>
                   <div className="text-left">
                     <div className={`font-bold ${language === 'de' ? 'text-white' : 'text-slate-300'}`}>Deutsch</div>
                     <div className="text-xs text-slate-500 font-mono">GERMAN / DE-DE</div>
                   </div>
                 </div>
                 {language === 'de' && <Check className="text-accent-cyan relative z-10" size={20} />}
                 {language === 'de' && <div className="absolute inset-0 bg-accent-cyan/5 pointer-events-none"></div>}
               </button>

               <button 
                  onClick={() => handleSetLanguage('en')}
                  className={`p-6 rounded-xl border flex items-center justify-between transition-all group relative overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan ${
                    language === 'en' ? 'bg-accent-cyan/10 border-accent-cyan ring-1 ring-accent-cyan/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'bg-slate-950/50 border-slate-800 hover:border-slate-600'
                  }`}
                  aria-pressed={language === 'en'}
               >
                 <div className="flex items-center gap-4 relative z-10">
                   <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">🇺🇸</div>
                   <div className="text-left">
                     <div className={`font-bold ${language === 'en' ? 'text-white' : 'text-slate-300'}`}>English</div>
                     <div className="text-xs text-slate-500 font-mono">US / EN-US</div>
                   </div>
                 </div>
                 {language === 'en' && <Check className="text-accent-cyan relative z-10" size={20} />}
                 {language === 'en' && <div className="absolute inset-0 bg-accent-cyan/5 pointer-events-none"></div>}
               </button>
             </div>
          </div>
        );

      case 'INTELLIGENCE':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white mb-2">{t.settings.sections.neural.title}</h3>
              <p className="text-sm text-slate-400">{t.settings.sections.neural.desc}</p>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-slate-950/50 rounded-xl border border-slate-800 relative overflow-hidden backdrop-blur-sm">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                      <Bot size={120} />
                  </div>
                  <div className="flex items-center justify-between mb-6 relative z-10">
                      <div className="flex items-center gap-3">
                          <div className="p-2 rounded bg-slate-900 border border-slate-800 text-accent-purple">
                              <Cpu size={20} />
                          </div>
                          <div>
                              <div className="text-slate-200 font-bold text-sm">{t.settings.labels.modelSelect}</div>
                              <div className="text-xs text-slate-500">Active Neural Network Architecture</div>
                          </div>
                      </div>
                      <Badge label={settings.aiModelVersion} color="purple" />
                  </div>
                  <div className="grid grid-cols-1 gap-3 relative z-10">
                       <button 
                          onClick={() => handleUpdate('aiModelVersion', 'gemini-2.5-flash')}
                          className={`text-left px-4 py-4 rounded-lg text-sm transition-all border flex justify-between items-center group outline-none focus-visible:ring-2 focus-visible:ring-accent-purple ${
                              settings.aiModelVersion === 'gemini-2.5-flash' 
                              ? 'bg-accent-purple/10 border-accent-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
                              : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-600 hover:bg-slate-900'
                          }`}
                          aria-pressed={settings.aiModelVersion === 'gemini-2.5-flash'}
                       >
                           <div>
                               <div className="font-bold font-mono group-hover:text-accent-purple transition-colors">Gemini 2.5 Flash</div>
                               <div className="text-xs opacity-70">Balanced performance. Ideal for general tasks.</div>
                           </div>
                           {settings.aiModelVersion === 'gemini-2.5-flash' && <div className="w-2 h-2 bg-accent-purple rounded-full animate-pulse shadow-[0_0_10px_purple]"></div>}
                       </button>
                       <button 
                          onClick={() => handleUpdate('aiModelVersion', 'gemini-3-pro-preview')}
                          className={`text-left px-4 py-4 rounded-lg text-sm transition-all border flex justify-between items-center group outline-none focus-visible:ring-2 focus-visible:ring-accent-purple ${
                              settings.aiModelVersion === 'gemini-3-pro-preview' 
                              ? 'bg-accent-purple/10 border-accent-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
                              : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-600 hover:bg-slate-900'
                          }`}
                          aria-pressed={settings.aiModelVersion === 'gemini-3-pro-preview'}
                       >
                           <div>
                               <div className="font-bold font-mono group-hover:text-accent-purple transition-colors">Gemini 3.0 Pro (Preview)</div>
                               <div className="text-xs opacity-70">Enhanced reasoning capabilities.</div>
                           </div>
                           {settings.aiModelVersion === 'gemini-3-pro-preview' && <div className="w-2 h-2 bg-accent-purple rounded-full animate-pulse shadow-[0_0_10px_purple]"></div>}
                       </button>
                  </div>
              </div>

              <Slider 
                label={t.settings.labels.temp}
                value={settings.aiTemperature} 
                min={0} 
                max={1} 
                step={0.1} 
                onChange={(v) => handleUpdate('aiTemperature', v)}
                formatValue={(v) => `${(v * 100).toFixed(0)}%`}
              />
            </div>
          </div>
        );

      case 'INTERFACE':
        return (
          <div className="space-y-6 animate-fade-in">
             <div className="border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white mb-2">{t.settings.sections.visual.title}</h3>
              <p className="text-sm text-slate-400">{t.settings.sections.visual.desc}</p>
            </div>

            <div className="space-y-4">
              <Toggle 
                label={t.settings.labels.contrast}
                description="Increases border visibility and reduces transparency."
                checked={settings.highContrast} 
                onChange={(v) => handleUpdate('highContrast', v)}
                icon={<Eye size={18} />}
              />
               <Toggle 
                label={t.settings.labels.motion}
                description="Disables complex animations and transitions."
                checked={settings.reducedMotion} 
                onChange={(v) => handleUpdate('reducedMotion', v)}
                icon={<Layout size={18} />}
              />
               <Toggle 
                label={t.settings.labels.sound}
                description="Play subtle cues on interaction."
                checked={settings.soundEnabled} 
                onChange={(v) => handleUpdate('soundEnabled', v)}
                icon={settings.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              />
              
              <div className="pt-6 border-t border-slate-800">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block">{t.settings.labels.typography}</label>
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => handleUpdate('fontSize', size)}
                      className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan ${
                        settings.fontSize === size 
                          ? 'bg-slate-800 text-white shadow-sm border border-slate-700' 
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                      aria-pressed={settings.fontSize === size}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'PRIVACY':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white mb-2">{t.settings.sections.privacy.title}</h3>
              <p className="text-sm text-slate-400">{t.settings.sections.privacy.desc}</p>
            </div>

            <Toggle 
                label={t.settings.labels.incognito}
                description="Prevents logging of queries to local history (simulated)."
                checked={settings.incognitoMode} 
                onChange={(v) => handleUpdate('incognitoMode', v)}
                icon={<Smartphone size={18} />}
              />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <Button onClick={handleExportData} variant="secondary" icon={<Download size={14} />} className="text-sm border-slate-700 hover:border-slate-500 bg-slate-900/50">
                {t.settings.labels.export}
              </Button>
              <Button onClick={handleSystemPurge} variant="danger" icon={<Skull size={14} />} className="text-sm bg-red-950/20 border-red-900 hover:bg-red-900/40">
                System Purge (Reset)
              </Button>
            </div>
            
            <div className="bg-blue-950/10 border border-blue-900/30 p-4 rounded-xl flex gap-3">
               <Shield className="text-blue-400 flex-shrink-0" size={20} />
               <div className="text-xs text-blue-200/70 leading-relaxed">
                 DisinfoDesk operates on a client-side architecture. Your search history is stored in your browser's IndexedDB (Vault) and is not sent to our servers, except for necessary API calls to Google Gemini.
               </div>
            </div>
          </div>
        );

      case 'SYSTEM':
        return (
           <div className="space-y-6 animate-fade-in">
             <div className="border-b border-slate-800 pb-4">
               <h3 className="text-xl font-bold text-white mb-2">{t.settings.sections.system.title}</h3>
               <p className="text-sm text-slate-400">{t.settings.sections.system.desc}</p>
             </div>
             
             <div className="bg-slate-950/50 rounded-xl border border-slate-800 overflow-hidden backdrop-blur-sm">
                {[
                    { label: 'Kernel Version', val: 'v2.6.5-IDB-Enhanced' },
                    { label: 'State Engine', val: 'Redux + IndexedDB Persist' },
                    { label: 'API Layer', val: 'RTK Query (fakeBase)' },
                    { label: 'Environment', val: 'Production', color: 'text-green-400' },
                    { label: 'React Core', val: 'v19.2.0', color: 'text-blue-400' },
                    { label: 'Gemini SDK', val: '@google/genai v1.30.0', color: 'text-purple-400' },
                ].map((row, i) => (
                    <div key={i} className="flex justify-between p-4 border-b border-slate-800 last:border-0 font-mono text-xs">
                        <span className="text-slate-500 uppercase">{row.label}</span>
                        <span className={row.color || 'text-slate-300'}>{row.val}</span>
                    </div>
                ))}
             </div>
             
             <div className="text-center pt-4">
               <Badge label="All Systems Nominal" color="green" />
             </div>
           </div>
        );
        
      default:
        return null;
    }
};

const SettingsTerminal: React.FC = () => {
  const { logs } = useSettingsPage();
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);
  
  if (logs.length === 0) return null;

  return (
    <div className="mt-8 bg-black rounded-xl border border-slate-800 overflow-hidden font-mono text-xs shadow-2xl">
      <div className="bg-slate-900/80 backdrop-blur px-4 py-2 flex items-center gap-2 border-b border-slate-800">
        <Terminal size={12} className="text-slate-500" />
        <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">System Output</span>
        <div className="ml-auto flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-slate-700"></div>
          <div className="w-2 h-2 rounded-full bg-slate-700"></div>
        </div>
      </div>
      <div 
        ref={logContainerRef}
        className="h-32 overflow-y-auto p-4 space-y-1 text-slate-300 scrollbar-thin scrollbar-thumb-slate-700"
      >
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 animate-fade-in">
            <span className="text-slate-600 flex-shrink-0 opacity-50">[{log.timestamp}]</span>
            <span className={`
              ${log.type === 'error' ? 'text-red-400' : ''}
              ${log.type === 'warning' ? 'text-yellow-400' : ''}
              ${log.type === 'success' ? 'text-green-400' : ''}
              ${log.type === 'info' ? 'text-blue-300' : ''}
            `}>
              {log.type === 'info' && 'ℹ'}
              {log.type === 'success' && '✔'}
              {log.type === 'warning' && '⚠'}
              {log.type === 'error' && '✖'}
            </span>
            <span className="break-all">{log.message}</span>
          </div>
        ))}
        <div className="animate-pulse text-accent-cyan">_</div>
      </div>
    </div>
  );
};

const SettingsHeader: React.FC = () => {
    return (
        <PageHeader 
            title="SYSTEM CONFIGURATION"
            subtitle="CONTROL PANEL // ACCESS LEVEL 5"
            icon={SettingsIcon}
            status="CONFIG MODE"
        />
    );
};

// --- 4. Main Component ---

export const Settings: React.FC = () => {
  return (
      <SettingsPageProvider>
        <div className="max-w-5xl mx-auto animate-fade-in pb-12">
            <SettingsHeader />
            <Card className="min-h-[500px] flex flex-col p-0 overflow-hidden bg-slate-950/80 backdrop-blur border-slate-800 shadow-2xl">
                <div className="flex flex-col md:flex-row flex-1">
                    <div className="border-b md:border-b-0 md:border-r border-slate-800 p-6 bg-slate-900/20">
                        <SettingsSidebar />
                    </div>
                    <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-[#0a0f18]/50">
                        <SettingsContent />
                    </div>
                </div>
            </Card>
            <SettingsTerminal />
        </div>
      </SettingsPageProvider>
  );
};

export default Settings;