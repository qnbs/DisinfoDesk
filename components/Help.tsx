
import React, { useState, useMemo, createContext, useContext, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  HelpCircle, Book, AlertTriangle, Cpu, Search, 
  ChevronRight, ChevronDown, Shield, Activity, 
  Zap, Brain, Network, Eye, FileText, Info,
  FileCode, Layers, Database, LayoutDashboard,
  Terminal, Lock, Radio, CheckCircle2, ArrowUpRight, PlayCircle,
  Server, Wifi, RefreshCw, BarChart3, Binary, HardDrive, 
  MousePointer2, ExternalLink
} from 'lucide-react';
import { DangerLevel, DangerLevelEn } from '../types';
import { Card, Button, Badge, PageHeader, TechIconBox } from './ui/Common';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';

// --- Types & Data ---

type HelpTab = 'GUIDE' | 'DANGER_LEVELS' | 'GLOSSARY' | 'FAQ' | 'DOCS' | 'DIAGNOSTICS';

interface GlossaryTerm {
  term: string;
  definition: string;
  category: 'Psychology' | 'Disinformation' | 'Tech' | 'Protocol';
  relatedRoute?: string;
}

interface FAQItem {
  q: string;
  a: string;
  complexity: 'LOW' | 'MED' | 'HIGH';
}

interface DocSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: {
    subtitle: string;
    text: string;
    details?: string[];
    codeSnippet?: string;
  }[];
}

// --- Data Definition (Expanded) ---
const HELP_DATA = {
  de: {
    tabs: {
      GUIDE: 'Agenten-Training',
      DANGER_LEVELS: 'Bedrohungs-Matrix',
      GLOSSARY: 'Neuronaler Index',
      FAQ: 'FAQ / Uplink',
      DOCS: 'System-Handbuch',
      DIAGNOSTICS: 'System-Diagnose'
    },
    guide: {
      intro: 'Initialisierung des Agenten-Protokolls. Befolgen Sie die Sequenz zur vollständigen System-Synchronisation.',
      steps: [
        { id: 1, title: 'Zielerfassung', desc: 'Navigieren Sie zum Archiv. Identifizieren Sie ein Narrativ zur forensischen Untersuchung.', icon: <Search size={20} /> },
        { id: 2, title: 'KI-Forensik', desc: 'Aktivieren Sie die Gemini 2.5 Engine. Extrahieren Sie Ursprung, Faktenlage und Anomalien.', icon: <Cpu size={20} /> },
        { id: 3, title: 'Verhör & Uplink', desc: 'Initiieren Sie einen Uplink zu Dr. Veritas. Nutzen Sie die sokratische Methode zur Dekonstruktion.', icon: <Brain size={20} /> },
        { id: 4, title: 'Visuelle Synthese', desc: 'Generieren Sie im Editor visuelle Beweismittel. Speichern Sie die Akte im Vault.', icon: <Eye size={20} /> }
      ]
    },
    dangerProtocols: {
      LOW: { label: 'Stufe I: Harmlos', desc: 'Unterhaltsame Mythen ohne kinetisches Schadenspotenzial. Passive Beobachtung.', protocol: 'OBSERVE_ONLY', color: 'text-green-400', border: 'border-green-500/30', bg: 'bg-green-500/10' },
      MEDIUM: { label: 'Stufe II: Bedenklich', desc: 'Falschinformationen, die Misstrauen säen oder Gesundheit gefährden. Faktencheck zwingend.', protocol: 'ANALYZE_TAG', color: 'text-yellow-400', border: 'border-yellow-500/30', bg: 'bg-yellow-500/10' },
      HIGH: { label: 'Stufe III: Gefährlich', desc: 'Narrative mit Radikalisierungspotenzial. Aktive Eindämmung erforderlich.', protocol: 'ACTIVE_COUNTER', color: 'text-orange-400', border: 'border-orange-500/30', bg: 'bg-orange-500/10' },
      EXTREME: { label: 'Stufe IV: Systemkritisch', desc: 'Unmittelbare Bedrohung für Demokratie oder Menschenleben. Maximale Alarmstufe.', protocol: 'TOTAL_LOCKDOWN', color: 'text-red-500', border: 'border-red-500/50', bg: 'bg-red-500/10' }
    },
    glossary: [
      { term: 'Echokammer', definition: 'Ein geschlossenes Informations-Ökosystem, in dem Überzeugungen durch algorithmische Rückkopplung verstärkt werden.', category: 'Psychology', relatedRoute: '/virality' },
      { term: 'Confirmation Bias', definition: 'Kognitive Verzerrung: Die selektive Wahrnehmung von Informationen, die eigene Hypothesen stützen.', category: 'Psychology' },
      { term: 'False Flag', definition: 'Verdeckte Operationen, die so gestaltet sind, dass sie einer anderen Partei zugeschrieben werden.', category: 'Disinformation', relatedRoute: '/dangerous' },
      { term: 'Deepfake', definition: 'Synthetische Medieninhalte, generiert durch GANs (Generative Adversarial Networks), zur Identitätstäuschung.', category: 'Tech', relatedRoute: '/media' },
      { term: 'Whataboutism', definition: 'Rhetorische Ablenkungstaktik durch Gegenbeschuldigungen, um kritischen Diskurs zu sabotieren.', category: 'Disinformation', relatedRoute: '/chat' },
      { term: 'Gish Gallop', definition: 'Überflutung des Gegners mit einer Masse an halbwahren Argumenten, um eine Widerlegung unmöglich zu machen.', category: 'Disinformation' },
      { term: 'R-Wert', definition: 'Viraler Reproduktionsfaktor eines Memes. Bestimmt die Geschwindigkeit der narrativen Infektion.', category: 'Tech', relatedRoute: '/virality' },
      { term: 'Gaslighting', definition: 'Psychologische Manipulation, die das Opfer an der eigenen Wahrnehmung der Realität zweifeln lässt.', category: 'Psychology' }
    ] as GlossaryTerm[],
    faq: [
      { q: 'Ist die KI-Analyse deterministisch?', a: 'Nein. Gemini 2.5 operiert probabilistisch. Halluzinationen sind möglich. Primärquellen-Verifikation ist obligatorisch.', complexity: 'MED' },
      { q: 'Sicherheitsstatus der Daten?', a: 'DisinfoDesk nutzt eine "Local-First" Architektur. Alle Chats und Analysen verbleiben im IndexedDB Vault.', complexity: 'HIGH' },
      { q: 'Berechnung der Gefahrenstufe?', a: 'Multifaktorielle Analyse basierend auf historischer Gewaltbereitschaft, Verbreitungsgeschwindigkeit und gesellschaftlichem Erosionspotenzial.', complexity: 'HIGH' }
    ] as FAQItem[],
    docs: [
      {
        id: 'CORE',
        title: 'Kernel & Architektur',
        icon: <Cpu size={18}/>,
        content: [
          {
            subtitle: 'React 19 Concurrent Mode',
            text: 'Das System nutzt die neuesten React-Features für nicht-blockierendes Rendering komplexer Datenvisualisierungen.',
            codeSnippet: 'Suspense boundaries wrap all lazy-loaded modules for seamless transitions.'
          },
          {
            subtitle: 'Redux State Management',
            text: 'Ein normalisierter State-Tree mit Time-Travel Debugging (Redux-Undo) für Simulationsparameter.',
          }
        ]
      },
      {
        id: 'INTELLIGENCE',
        title: 'Neuronale Module',
        icon: <Brain size={18}/>,
        content: [
          {
            subtitle: 'Gemini 2.5 Pipeline',
            text: 'Direkte Integration via @google/genai SDK. Die "Thinking Budget" Konfiguration ermöglicht tiefere logische Ketten.',
            details: ['Model: gemini-2.5-flash (Speed)', 'Model: gemini-3-pro (Reasoning)', 'Safety: BLOCK_ONLY_HIGH']
          },
          {
            subtitle: 'Dr. Veritas Persona',
            text: 'System-Prompt Injektion zwingt das Modell in die Rolle eines wissenschaftlichen Skeptikers. Antworten werden in Echtzeit gestreamt.',
          }
        ]
      },
      {
        id: 'VAULT',
        title: 'Verschlüsselte Speicherung',
        icon: <Lock size={18}/>,
        content: [
          {
            subtitle: 'IndexedDB Abstraktion',
            text: 'Der dbService agiert als asynchroner Wrapper um die Browser-Datenbank. Ermöglicht Speicherung von Blobs und großen Textmengen.',
            codeSnippet: 'await dbService.put("analyses", { id, data, timestamp });'
          }
        ]
      }
    ] as DocSection[]
  },
  en: {
    tabs: {
      GUIDE: 'Agent Training',
      DANGER_LEVELS: 'Threat Matrix',
      GLOSSARY: 'Neural Index',
      FAQ: 'FAQ / Uplink',
      DOCS: 'System Manual',
      DIAGNOSTICS: 'Diagnostics'
    },
    guide: {
      intro: 'Initializing Agent Protocol. Follow the sequence for full system synchronization.',
      steps: [
        { id: 1, title: 'Target Acquisition', desc: 'Navigate to Archive. Identify a narrative for forensic investigation.', icon: <Search size={20} /> },
        { id: 2, title: 'AI Forensics', desc: 'Activate Gemini 2.5 Engine. Extract origin, facts, and anomalies.', icon: <Cpu size={20} /> },
        { id: 3, title: 'Interrogation', desc: 'Initiate uplink to Dr. Veritas. Use Socratic methods for deconstruction.', icon: <Brain size={20} /> },
        { id: 4, title: 'Visual Synthesis', desc: 'Generate visual evidence in Editor. Commit file to Vault.', icon: <Eye size={20} /> }
      ]
    },
    dangerProtocols: {
      LOW: { label: 'Level I: Harmless', desc: 'Entertaining myths with no kinetic damage potential. Passive observation.', protocol: 'OBSERVE_ONLY', color: 'text-green-400', border: 'border-green-500/30', bg: 'bg-green-500/10' },
      MEDIUM: { label: 'Level II: Concerning', desc: 'Misinformation sowing distrust or endangering health. Fact-check mandatory.', protocol: 'ANALYZE_TAG', color: 'text-yellow-400', border: 'border-yellow-500/30', bg: 'bg-yellow-500/10' },
      HIGH: { label: 'Level III: Dangerous', desc: 'Narratives with radicalization potential. Active containment required.', protocol: 'ACTIVE_COUNTER', color: 'text-orange-400', border: 'border-orange-500/30', bg: 'bg-orange-500/10' },
      EXTREME: { label: 'Level IV: Critical', desc: 'Immediate threat to democracy or human life. Maximum alert level.', protocol: 'TOTAL_LOCKDOWN', color: 'text-red-500', border: 'border-red-500/50', bg: 'bg-red-500/10' }
    },
    glossary: [
      { term: 'Echo Chamber', definition: 'A closed information ecosystem where beliefs are reinforced by algorithmic feedback loops.', category: 'Psychology', relatedRoute: '/virality' },
      { term: 'Confirmation Bias', definition: 'Cognitive bias: The selective perception of information that supports one\'s own hypotheses.', category: 'Psychology' },
      { term: 'False Flag', definition: 'Covert operations designed to appear as if they were carried out by another party.', category: 'Disinformation', relatedRoute: '/dangerous' },
      { term: 'Deepfake', definition: 'Synthetic media generated by GANs (Generative Adversarial Networks) for identity deception.', category: 'Tech', relatedRoute: '/media' },
      { term: 'Whataboutism', definition: 'Rhetorical diversion tactic using counter-accusations to sabotage critical discourse.', category: 'Disinformation', relatedRoute: '/chat' },
      { term: 'Gish Gallop', definition: 'Overwhelming an opponent with a mass of half-true arguments to make refutation impossible.', category: 'Disinformation' },
      { term: 'R-Value', definition: 'Viral reproduction factor of a meme. Determines the speed of narrative infection.', category: 'Tech', relatedRoute: '/virality' },
      { term: 'Gaslighting', definition: 'Psychological manipulation making the victim doubt their own perception of reality.', category: 'Psychology' }
    ] as GlossaryTerm[],
    faq: [
      { q: 'Is AI analysis deterministic?', a: 'No. Gemini 2.5 operates probabilistically. Hallucinations are possible. Primary source verification is mandatory.', complexity: 'MED' },
      { q: 'Data security status?', a: 'DisinfoDesk uses a "Local-First" architecture. All chats and analyses remain in your browser\'s IndexedDB Vault.', complexity: 'HIGH' },
      { q: 'Danger level calculation?', a: 'Multifactorial analysis based on historical violence, spread velocity, and societal erosion potential.', complexity: 'HIGH' }
    ] as FAQItem[],
    docs: [
      {
        id: 'CORE',
        title: 'Kernel & Architecture',
        icon: <Cpu size={18}/>,
        content: [
          {
            subtitle: 'React 19 Concurrent Mode',
            text: 'The system leverages latest React features for non-blocking rendering of complex data visualizations.',
            codeSnippet: 'Suspense boundaries wrap all lazy-loaded modules for seamless transitions.'
          },
          {
            subtitle: 'Redux State Management',
            text: 'A normalized state tree with Time-Travel Debugging (Redux-Undo) for simulation parameters.',
          }
        ]
      },
      {
        id: 'INTELLIGENCE',
        title: 'Neural Modules',
        icon: <Brain size={18}/>,
        content: [
          {
            subtitle: 'Gemini 2.5 Pipeline',
            text: 'Direct integration via @google/genai SDK. The "Thinking Budget" config allows for deeper logic chains.',
            details: ['Model: gemini-2.5-flash (Speed)', 'Model: gemini-3-pro (Reasoning)', 'Safety: BLOCK_ONLY_HIGH']
          },
          {
            subtitle: 'Dr. Veritas Persona',
            text: 'System prompt injection forces the model into the role of a scientific skeptic. Responses are streamed in real-time.',
          }
        ]
      },
      {
        id: 'VAULT',
        title: 'Encrypted Storage',
        icon: <Lock size={18}/>,
        content: [
          {
            subtitle: 'IndexedDB Abstraction',
            text: 'The dbService acts as an asynchronous wrapper around the browser database. Enables storage of blobs and large text payloads.',
            codeSnippet: 'await dbService.put("analyses", { id, data, timestamp });'
          }
        ]
      }
    ] as DocSection[]
  }
};

// --- 1. Logic Hook ---

const useHelpLogic = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<HelpTab>('GUIDE');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  
  // Doc View State
  const [activeDocSection, setActiveDocSection] = useState<string>('CORE');
  
  // Guide State
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Threat Matrix State
  const [hoveredThreat, setHoveredThreat] = useState<string | null>(null);

  // Diagnostics State
  const [metrics, setMetrics] = useState<{time: number, ping: number, load: number}[]>([]);

  // Simulation loop for metrics
  useEffect(() => {
      const interval = setInterval(() => {
          setMetrics(prev => {
              const next = [...prev, {
                  time: Date.now(),
                  ping: Math.floor(Math.random() * 40) + 10,
                  load: Math.floor(Math.random() * 30) + 20
              }];
              return next.slice(-20);
          });
      }, 1000);
      return () => clearInterval(interval);
  }, []);

  const data = language === 'de' ? HELP_DATA.de : HELP_DATA.en;

  const filteredGlossary = useMemo(() => {
    return data.glossary.filter(item => 
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.definition.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data.glossary, searchTerm]);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const toggleStep = (id: number) => {
      setCompletedSteps(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const navigateTo = (path: string) => navigate(path);

  return {
    language,
    t,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    expandedFAQ,
    toggleFAQ,
    data,
    filteredGlossary,
    activeDocSection, 
    setActiveDocSection,
    completedSteps,
    toggleStep,
    hoveredThreat, 
    setHoveredThreat,
    navigateTo,
    metrics
  };
};

// --- 2. Context ---

type HelpContextType = ReturnType<typeof useHelpLogic>;
const HelpContext = createContext<HelpContextType | undefined>(undefined);

const useHelp = () => {
  const context = useContext(HelpContext);
  if (!context) throw new Error('useHelp must be used within a HelpProvider');
  return context;
};

// --- 3. Provider ---

const HelpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useHelpLogic();
  return <HelpContext.Provider value={value}>{children}</HelpContext.Provider>;
};

// --- 4. Sub-Components ---

const HelpNavigation: React.FC = () => {
  const { activeTab, setActiveTab, data } = useHelp();
  
  const tabs: { id: HelpTab; icon: React.ReactNode }[] = [
    { id: 'GUIDE', icon: <Book size={16} /> },
    { id: 'DANGER_LEVELS', icon: <Shield size={16} /> },
    { id: 'GLOSSARY', icon: <FileText size={16} /> },
    { id: 'DOCS', icon: <FileCode size={16} /> },
    { id: 'DIAGNOSTICS', icon: <Activity size={16} /> },
    { id: 'FAQ', icon: <HelpCircle size={16} /> },
  ];

  return (
    <div className="flex gap-2 mb-8 overflow-x-auto pb-1 scrollbar-hide border-b border-slate-800/50">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`
            flex items-center gap-2 px-5 py-3 rounded-t-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan relative overflow-hidden group
            ${activeTab === tab.id 
              ? 'bg-slate-900/80 text-accent-cyan border-b-2 border-accent-cyan' 
              : 'text-slate-500 hover:text-white hover:bg-slate-800/30'}
          `}
        >
          <span className={`relative z-10 ${activeTab === tab.id ? 'scale-110' : ''} transition-transform`}>{tab.icon}</span>
          <span className="relative z-10">{data.tabs[tab.id]}</span>
          {activeTab === tab.id && <div className="absolute inset-0 bg-accent-cyan/5 animate-pulse-slow"></div>}
        </button>
      ))}
    </div>
  );
};

// --- DIAGNOSTICS VIEW ---

const DiagnosticsView: React.FC = () => {
  const { metrics, t } = useHelp();
    const [scanProgress, setScanProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setScanProgress(p => p >= 100 ? 0 : p + 5);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Live Metrics */}
                <Card className="bg-slate-950/50 border-slate-800 p-6 flex flex-col h-[300px]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-bold text-accent-cyan uppercase tracking-widest flex items-center gap-2">
                            <Activity size={16} /> Real-Time Telemetry
                        </h3>
                        <Badge label="LIVE" className="bg-green-500/10 text-green-500 border-green-500/30 animate-pulse" />
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <AreaChart data={metrics}>
                                <defs>
                                    <linearGradient id="gradPing" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" hide />
                                <YAxis hide domain={[0, 60]} />
                                <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155'}} />
                                <Area type="monotone" dataKey="ping" stroke="#06b6d4" strokeWidth={2} fill="url(#gradPing)" isAnimationActive={false} />
                                <Area type="monotone" dataKey="load" stroke="#8b5cf6" strokeWidth={1} fill="transparent" isAnimationActive={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-2">
                      <span>{t.help.diagnostics.latency}: {metrics[metrics.length-1]?.ping}ms</span>
                      <span>{t.help.diagnostics.load}: {metrics[metrics.length-1]?.load}%</span>
                    </div>
                </Card>

                {/* System Status */}
                <Card className="bg-slate-900 border-slate-800 p-6 space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                        <div className="p-2 bg-green-500/10 rounded-lg text-green-500 border border-green-500/30"><Server size={20} /></div>
                        <div>
                          <div className="text-xs font-bold text-white uppercase">{t.help.diagnostics.vaultIntegrity}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{t.help.diagnostics.indexedDbConnected}</div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                        <div className="p-2 bg-accent-purple/10 rounded-lg text-accent-purple border border-accent-purple/30"><Wifi size={20} /></div>
                        <div>
                          <div className="text-xs font-bold text-white uppercase">{t.help.diagnostics.geminiNeuralLink}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{t.help.diagnostics.apiAuthenticated}</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 uppercase">
                          <span>{t.help.diagnostics.deepScanProgress}</span>
                            <span>{scanProgress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                            <div className="h-full bg-accent-cyan shadow-[0_0_10px_cyan]" style={{ width: `${scanProgress}%` }}></div>
                        </div>
                        <div className="text-[9px] text-slate-600 font-mono">{t.help.diagnostics.checkingLogicGates}</div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

// --- DOCS VIEW ---

const DocumentationView: React.FC = () => {
  const { data, activeDocSection, setActiveDocSection, t } = useHelp();
  
  const currentSection = data.docs.find(d => d.id === activeDocSection);

  return (
    <div className="flex flex-col md:flex-row gap-8 animate-fade-in min-h-[600px]">
      {/* Sidebar / TOC */}
      <div className="md:w-64 shrink-0 space-y-2">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 pl-2 flex items-center gap-2">
          <Layers size={12} /> {t.help.moduleIndex}
        </div>
        {data.docs.map(doc => (
          <button
            key={doc.id}
            onClick={() => setActiveDocSection(doc.id)}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-left transition-all
              ${activeDocSection === doc.id 
                ? 'bg-slate-800 text-white border-l-4 border-accent-cyan shadow-lg' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}
            `}
          >
            <span className={activeDocSection === doc.id ? 'text-accent-cyan scale-110' : 'text-slate-600'}>
              {doc.icon}
            </span>
            {doc.title}
          </button>
        ))}
        
        <div className="mt-8 p-4 bg-black/40 rounded-xl border border-slate-800 text-[10px] text-slate-500 font-mono">
          <div className="font-bold text-slate-400 mb-2 flex justify-between items-center">
              {t.help.buildInfo}
              <Binary size={10} />
          </div>
          <div>Ver: 2.7.0-modular</div>
          <div>Rev: 2024.11.10</div>
          <div>Env: Production</div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-slate-900/40 rounded-xl border border-slate-800 p-6 md:p-8 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-slate-500">
           {currentSection?.icon && React.cloneElement(currentSection.icon as React.ReactElement, { size: 200 })}
        </div>
        
        {currentSection && (
          <div className="relative z-10 animate-fade-in">
            <h2 className="text-2xl font-black text-white mb-8 border-b border-slate-800 pb-4 flex items-center gap-3">
              <span className="text-accent-cyan p-2 bg-accent-cyan/10 rounded-lg border border-accent-cyan/20">{currentSection.icon}</span>
              {currentSection.title}
            </h2>
            
            <div className="space-y-10">
              {currentSection.content.map((block, idx) => (
                <div key={idx} className="group">
                  <h3 className="text-sm font-bold text-slate-200 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent-purple rounded-full shadow-[0_0_5px_purple]"></div>
                    {block.subtitle}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-3xl mb-4 font-sans border-l-2 border-slate-800 pl-4 group-hover:border-accent-cyan/50 transition-colors">
                    {block.text}
                  </p>
                  {block.codeSnippet && (
                      <div className="bg-black/60 rounded-lg p-4 font-mono text-xs text-green-400 border border-slate-800 relative group-hover:border-slate-700 transition-colors">
                          <div className="absolute top-2 right-2 text-[9px] text-slate-600">TSX</div>
                          <code>{block.codeSnippet}</code>
                      </div>
                  )}
                  {block.details && (
                    <ul className="grid gap-2 pl-4 ml-1">
                      {block.details.map((detail, dIdx) => (
                        <li key={dIdx} className="text-xs text-slate-500 font-mono flex items-start gap-2">
                          <span className="text-accent-cyan mt-0.5">{'>'}</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const GuideView: React.FC = () => {
  const { data, completedSteps, toggleStep, t } = useHelp();
  
  const allComplete = completedSteps.length === data.guide.steps.length;

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="text-center mb-10">
          <p className="text-slate-400 max-w-lg mx-auto font-mono text-sm leading-relaxed bg-slate-900/50 p-4 rounded-lg border border-slate-800">
            <span className="text-accent-cyan font-bold">{'>'} SYSTEM_MESSAGE:</span> {data.guide.intro}
          </p>
          <div className="mt-6 flex justify-center">
              <Badge label={`${completedSteps.length} / ${data.guide.steps.length} SYNCED`} className={allComplete ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-slate-800 text-slate-400'} />
          </div>
      </div>

      <div className="grid gap-4">
        {data.guide.steps.map((step) => {
          const isComplete = completedSteps.includes(step.id);
          return (
            <div 
                key={step.id} 
                onClick={() => toggleStep(step.id)}
                className={`
                    relative flex items-center gap-6 p-6 rounded-xl border transition-all duration-300 cursor-pointer group select-none overflow-hidden
                    ${isComplete 
                        ? 'bg-green-950/10 border-green-500/30' 
                        : 'bg-slate-900/60 border-slate-800 hover:border-accent-cyan/50 hover:bg-slate-900 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]'}
                `}
            >
                <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center border shrink-0 transition-all
                    ${isComplete 
                        ? 'bg-green-500 text-black border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' 
                        : 'bg-slate-950 border-slate-700 text-slate-500 group-hover:text-accent-cyan group-hover:border-accent-cyan'}
                `}>
                    {isComplete ? <CheckCircle2 size={24} /> : step.icon}
                </div>
                
                <div className="flex-1 relative z-10">
                    <h3 className={`text-lg font-bold mb-1 transition-colors ${isComplete ? 'text-green-400 line-through decoration-green-500/50' : 'text-white group-hover:text-accent-cyan'}`}>
                        {step.title}
                    </h3>
                    <p className={`text-sm leading-relaxed transition-opacity ${isComplete ? 'text-green-500/50' : 'text-slate-400'}`}>
                        {step.desc}
                    </p>
                </div>

                <div className={`text-xs font-bold uppercase tracking-widest font-mono ${isComplete ? 'text-green-500' : 'text-slate-600 group-hover:text-slate-400'}`}>
                  {isComplete ? t.help.guide.verified : `STEP_0${step.id}`}
                </div>
                
                {/* Progress bar line for uncompleted */}
                {!isComplete && (
                    <div className="absolute bottom-0 left-0 h-0.5 bg-accent-cyan/50 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                )}
            </div>
          )
        })}
      </div>

      {allComplete && (
          <div className="text-center p-8 border border-green-500/30 bg-green-500/5 rounded-xl animate-fade-in-up backdrop-blur-sm">
              <h3 className="text-green-400 font-bold text-lg mb-2 flex items-center justify-center gap-2"><CheckCircle2/> {t.help.guide.trainingComplete}</h3>
              <p className="text-slate-400 text-sm font-mono">{t.help.guide.trainingCompleteDesc}</p>
          </div>
      )}
    </div>
  );
};

const DangerMatrixView: React.FC = () => {
  const { data, hoveredThreat, setHoveredThreat, t } = useHelp();
  
  // Logic to get the description of the currently hovered item (or null)
  const activeProtocol = hoveredThreat ? data.dangerProtocols[hoveredThreat as keyof typeof data.dangerProtocols] : null;

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.keys(data.dangerProtocols) as Array<keyof typeof data.dangerProtocols>).map((key) => {
            const info = data.dangerProtocols[key];
            const isHovered = hoveredThreat === key;
            
            return (
            <div 
                key={key} 
                onMouseEnter={() => setHoveredThreat(key)}
                onMouseLeave={() => setHoveredThreat(null)}
                className={`
                    p-6 rounded-xl border transition-all cursor-crosshair relative overflow-hidden group
                    ${isHovered ? `${info.border} ${info.bg} scale-105 z-10 shadow-2xl` : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'}
                `}
            >
                <div className={`text-xs font-bold mb-2 uppercase tracking-widest ${info.color} flex items-center gap-2`}>
                    <Shield size={14} className={isHovered ? 'animate-pulse' : ''} /> {key}
                </div>
                <h3 className="text-xl font-black text-white mb-4">{info.label}</h3>
                <div className={`h-1 w-full rounded-full bg-current opacity-20 ${info.color}`}>
                    <div className={`h-full bg-current ${isHovered ? 'w-full' : 'w-1/2'} transition-all duration-500`}></div>
                </div>
                
                {isHovered && <div className="absolute inset-0 bg-white/5 animate-pulse-slow pointer-events-none"></div>}
            </div>
            )
        })}
        </div>

        {/* Dynamic Protocol Monitor */}
        <Card className="min-h-[140px] flex items-center justify-center p-8 border-t-4 transition-all duration-300 relative overflow-hidden bg-slate-950" style={{ borderColor: hoveredThreat ? '#3b82f6' : '#1e293b' }}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-5"></div>
            {activeProtocol ? (
                <div className="relative z-10 text-center animate-fade-in max-w-2xl">
                    <div className={`text-xs font-mono uppercase tracking-[0.2em] mb-3 ${activeProtocol.color} border border-current px-2 py-1 inline-block rounded`}>
                      {t.help.protocol.activeProtocol}: {activeProtocol.protocol}
                    </div>
                    <p className="text-lg text-slate-200 font-medium leading-relaxed">{activeProtocol.desc}</p>
                </div>
            ) : (
                <div className="relative z-10 text-slate-600 font-mono text-xs uppercase tracking-widest flex items-center gap-2 animate-pulse">
                  <Activity size={16} /> {t.help.protocol.awaitingInput}
                </div>
            )}
        </Card>
    </div>
  );
};

const GlossaryView: React.FC = () => {
  const { searchTerm, setSearchTerm, filteredGlossary, navigateTo, t } = useHelp();
  
  return (
    <div className="animate-fade-in space-y-6">
      <div className="relative max-w-2xl mx-auto group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-xl opacity-30 group-hover:opacity-70 blur transition duration-500"></div>
        <div className="relative">
            <Search className="absolute left-4 top-3.5 text-slate-500" size={16} />
            <input 
            type="text" 
            placeholder={t.help.glossary.filterTerminology}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-0 transition-all text-sm font-mono shadow-xl placeholder-slate-600"
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGlossary.length > 0 ? (
          filteredGlossary.map((item, idx) => (
            <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-accent-cyan/30 transition-all hover:shadow-lg group flex flex-col h-full hover:-translate-y-1 duration-300">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-base font-bold text-accent-cyan group-hover:text-white transition-colors font-mono">{item.term}</h4>
                <span className="text-[9px] bg-slate-950 border border-slate-800 text-slate-400 px-2 py-1 rounded uppercase tracking-wider font-bold">
                  {item.category}
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed mb-4 flex-1 border-t border-slate-800/50 pt-2">
                {item.definition}
              </p>
              
              {item.relatedRoute && (
                  <button 
                    onClick={() => navigateTo(item.relatedRoute!)}
                    className="mt-auto w-full py-2 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-slate-950 hover:bg-accent-cyan/10 border border-slate-800 hover:border-accent-cyan/30 text-slate-500 hover:text-accent-cyan rounded-lg transition-all"
                  >
                        {t.help.glossary.jumpToModule} <ArrowUpRight size={12} />
                  </button>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-500">
             <div className="bg-slate-900/50 inline-block p-4 rounded-full mb-4 border border-slate-800">
                <Search size={32} className="opacity-50" />
             </div>
             <p className="font-mono text-xs uppercase tracking-widest">{t.help.glossary.noMatchesFound}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const FAQView: React.FC = () => {
  const { data, expandedFAQ, toggleFAQ, navigateTo, t } = useHelp();
  
  return (
    <div className="animate-fade-in space-y-3 max-w-3xl mx-auto">
      {data.faq.map((item, idx) => (
        <div key={idx} className={`bg-slate-900/50 border rounded-xl overflow-hidden transition-all duration-300 ${expandedFAQ === idx ? 'border-accent-cyan/50 bg-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'border-slate-800 hover:border-slate-700'}`}>
          <button 
            onClick={() => toggleFAQ(idx)}
            className="w-full flex justify-between items-center p-5 text-left focus:outline-none group"
          >
            <div className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full ${expandedFAQ === idx ? 'bg-accent-cyan shadow-[0_0_5px_cyan]' : 'bg-slate-600'}`}></div>
                <span className={`font-bold text-sm ${expandedFAQ === idx ? 'text-white' : 'text-slate-300 group-hover:text-white'} transition-colors`}>{item.q}</span>
            </div>
            <div className="flex items-center gap-3">
                <Badge label={item.complexity} className="text-[8px] bg-slate-950 border-slate-800 text-slate-500" />
                <ChevronDown 
                size={16} 
                className={`text-slate-500 transition-transform duration-300 ${expandedFAQ === idx ? 'rotate-180 text-accent-cyan' : ''}`} 
                />
            </div>
          </button>
          
          <div className={`
            overflow-hidden transition-all duration-300 ease-in-out
            ${expandedFAQ === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}
          `}>
             <div className="p-5 pt-0 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 mt-2 font-medium pl-9">
               {item.a}
             </div>
          </div>
        </div>
      ))}

      <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg group">
         <div className="flex items-center gap-4">
           <div className="p-3 bg-slate-900 rounded-full border border-slate-800 group-hover:border-accent-purple/50 transition-colors">
              <Brain size={24} className="text-accent-purple" />
           </div>
           <div>
             <h4 className="font-bold text-white mb-1 text-sm">{t.help.faq.requireAdvancedAnalysis}</h4>
             <p className="text-xs text-slate-400">{t.help.faq.drVeritasReady}</p>
           </div>
         </div>
         <Button 
            variant="secondary" 
            icon={<Brain size={16} />} 
            onClick={() => navigateTo('/chat')}
            className="text-xs border-slate-700 hover:border-accent-purple hover:text-white"
        >
           {t.help.faq.initiateUplink}
         </Button>
      </div>
    </div>
  );
};

// --- 5. Main Component ---

export const Help: React.FC = () => {
  const { t } = useLanguage();
  return (
    <HelpProvider>
      <div className="max-w-7xl mx-auto pb-20 pt-4">
        <PageHeader 
            title={t.help.pageTitle}
            subtitle={t.help.pageSubtitle}
            icon={Network}
            status={t.help.pageStatus}
            visualizerState="IDLE"
        />
        
        <HelpNavigation />
        
        <div className="min-h-[500px]">
          <ContentSwitcher />
        </div>
        
        <div className="mt-16 text-center border-t border-slate-800 pt-8 opacity-50 hover:opacity-100 transition-opacity">
           <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.2em]">
             {t.help.quote}
           </p>
        </div>
      </div>
    </HelpProvider>
  );
};

const ContentSwitcher: React.FC = () => {
  const { activeTab } = useHelp();
  switch (activeTab) {
    case 'GUIDE': return <GuideView />;
    case 'DANGER_LEVELS': return <DangerMatrixView />;
    case 'GLOSSARY': return <GlossaryView />;
    case 'FAQ': return <FAQView />;
    case 'DOCS': return <DocumentationView />;
    case 'DIAGNOSTICS': return <DiagnosticsView />;
    default: return <GuideView />;
  }
};

export default Help;
