
import React, { useState, useMemo, createContext, useContext } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  HelpCircle, Book, AlertTriangle, Cpu, Search, 
  ChevronRight, ChevronDown, Shield, Activity, 
  Zap, Brain, Network, Eye, FileText, Info,
  FileCode, Layers, Database, LayoutDashboard,
  Terminal, Lock, Radio
} from 'lucide-react';
import { DangerLevel, DangerLevelEn } from '../types';
import { Card, Button, Badge, PageHeader } from './ui/Common';

// --- Types & Data ---

type HelpTab = 'GUIDE' | 'DANGER_LEVELS' | 'GLOSSARY' | 'FAQ' | 'DOCS';

interface GlossaryTerm {
  term: string;
  definition: string;
  category: 'Psychology' | 'Disinformation' | 'Tech';
}

interface FAQItem {
  q: string;
  a: string;
}

interface DocSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: {
    subtitle: string;
    text: string;
    details?: string[];
  }[];
}

// Localized Content Data
const HELP_DATA = {
  de: {
    tabs: {
      GUIDE: 'Anleitung',
      DANGER_LEVELS: 'Gefahrenstufen',
      GLOSSARY: 'Glossar',
      FAQ: 'FAQ',
      DOCS: 'System-Handbuch'
    },
    guide: {
      steps: [
        { title: 'Theorie wählen', desc: 'Navigieren Sie zum Archiv oder Dashboard und wählen Sie eine Akte aus.', icon: <Search size={20} /> },
        { title: 'KI-Analyse', desc: 'Gemini 2.5 zerlegt das Narrativ in Ursprung, Fakten und Konsens.', icon: <Cpu size={20} /> },
        { title: 'Skeptiker-Chat', desc: 'Nutzen Sie Dr. Veritas, um spezifische Fragen zu stellen oder Widersprüche zu prüfen.', icon: <Brain size={20} /> },
        { title: 'Visualisierung', desc: 'Generieren Sie visuelle Repräsentationen, um den Kontext besser zu verstehen.', icon: <Eye size={20} /> }
      ]
    },
    dangerProtocols: {
      LOW: { label: 'Harmlos', desc: 'Unterhaltsame Mythen ohne gesellschaftliches Schadenspotenzial.', protocol: 'Genießen Sie die Kreativität. Keine Intervention nötig.' },
      MEDIUM: { label: 'Bedenklich', desc: 'Falschinformationen, die Misstrauen säen oder Gesundheit gefährden können.', protocol: 'Faktenprüfung empfohlen. Quellen verifizieren.' },
      HIGH: { label: 'Gefährlich', desc: 'Narrative, die zu Radikalisierung oder realer Gewalt führen können.', protocol: 'Aktive Aufklärung nötig. Verbreitung stoppen.' },
      EXTREME: { label: 'Systemkritisch', desc: 'Direkte Bedrohung für demokratische Prozesse oder Menschenleben.', protocol: 'Maximale Vorsicht. Melden und isolieren.' }
    },
    glossary: [
      { term: 'Echokammer', definition: 'Ein metaphorischer Raum, in dem eine Person nur Informationen begegnet, die ihre eigene Meinung widerspiegeln.', category: 'Psychology' },
      { term: 'Confirmation Bias', definition: 'Die Neigung, Informationen so auszuwählen und zu interpretieren, dass sie die eigenen Erwartungen erfüllen.', category: 'Psychology' },
      { term: 'False Flag', definition: 'Eine verdeckte Operation, die so gestaltet ist, dass sie aussieht, als wäre sie von einer anderen Gruppe durchgeführt worden.', category: 'Disinformation' },
      { term: 'Deepfake', definition: 'Realistisch wirkende Medieninhalte, die durch künstliche Intelligenz verfälscht oder generiert wurden.', category: 'Tech' },
      { term: 'Whataboutism', definition: 'Eine Technik der Manipulation, bei der einer kritischen Frage oder einem Argument mit einer Gegenfrage ausgewichen wird.', category: 'Disinformation' },
      { term: 'Gish Gallop', definition: 'Eine Debattiertechnik, bei der der Gegner mit einer Flut von halbwahren Argumenten überschüttet wird.', category: 'Disinformation' }
    ] as GlossaryTerm[],
    faq: [
      { q: 'Ist die KI immer korrekt?', a: 'Nein. KI-Modelle können "halluzinieren". Nutzen Sie die bereitgestellten Quellen zur Verifikation.' },
      { q: 'Werden meine Chats gespeichert?', a: 'Chats werden nur lokal in Ihrem Browser gespeichert. Es erfolgt keine dauerhafte Speicherung auf unseren Servern.' },
      { q: 'Wie wird die Gefahrenstufe berechnet?', a: 'Basierend auf historischen Daten, Gewaltpotenzial und der Einschätzung von Extremismus-Experten (simuliert).' }
    ] as FAQItem[],
    docs: [
      {
        id: 'CORE',
        title: 'Core System & Navigation',
        icon: <LayoutDashboard size={18}/>,
        content: [
          {
            subtitle: 'Dashboard (Lagezentrum)',
            text: 'Das Dashboard aggregiert Echtzeit-Datenströme aller Module. Es zeigt den "System Load" (simulierte Netzwerkauslastung) und visualisiert die Verteilung der Datenbank.',
            details: ['Temporal Scatter: Zeigt das Verhältnis von Ursprungsjahr zu Viralität.', 'Radar Chart: Thematische Verteilung der Narrative.', 'Geo-Map: Simulierte globale Hotspots.']
          },
          {
            subtitle: 'OmniSearch (⌘K)',
            text: 'Das globale Such-Interface. Kann von überall mit STRG+K oder CMD+K aufgerufen werden. Indiziert Theorien, Autoren, Medien und Navigationspunkte.',
          }
        ]
      },
      {
        id: 'ARCHIVE',
        title: 'Archiv & Datenbank',
        icon: <Database size={18}/>,
        content: [
          {
            subtitle: 'Datenstruktur',
            text: 'Jede Theorie wird als normalisiertes Entity-Objekt gespeichert. Metadaten umfassen ID, Kategorie, Gefahrenstufe (Danger Level) und Popularitäts-Index.',
          },
          {
            subtitle: 'Procedural Art Engine',
            text: 'DisinfoDesk generiert Cover-Bilder dynamisch mittels SVG-Code basierend auf der Theorie-ID. Dies spart Bandbreite und sorgt für einen konsistenten, abstrakten "Tech-Noir" Look.',
          },
          {
            subtitle: 'Filter & Sortierung',
            text: 'Redux-gesteuerte Filterlogik erlaubt die Kombination von Volltextsuche, Kategorie-Tags und Gefahrenstufen in Echtzeit.',
          }
        ]
      },
      {
        id: 'INTELLIGENCE',
        title: 'KI & Intelligence Layer',
        icon: <Brain size={18}/>,
        content: [
          {
            subtitle: 'Gemini 2.5 Integration',
            text: 'Die App nutzt die Google Gemini API direkt über das @google/genai SDK. Anfragen werden client-seitig authentifiziert.',
            details: ['Model: gemini-2.5-flash (Standard) & gemini-3-pro (Deep Dive).', 'Grounding: Google Search Toolintegration für Faktenchecks.', 'Safety: HarmBlockThreshold.BLOCK_ONLY_HIGH für maximale Analysefreiheit bei sensiblen Themen.']
          },
          {
            subtitle: 'Dr. Veritas (Skeptiker-Bot)',
            text: 'Ein spezialisierter System-Prompt zwingt die KI in die Persona eines wissenschaftlichen Skeptikers. Antworten werden gestreamt und können per TTS (Text-to-Speech) vorgelesen werden.',
          },
          {
            subtitle: 'Satire Generator',
            text: 'Nutzt hohe Temperatur-Werte (Kreativität), um harmlose Verschwörungstheorien zu halluzinieren. Parameter wie "Paranoia-Level" steuern die Absurdität.'
          }
        ]
      },
      {
        id: 'SIMULATION',
        title: 'Virale Simulation',
        icon: <Activity size={18}/>,
        content: [
          {
            subtitle: 'Agenten-basiertes Modell',
            text: 'Der Simulator nutzt HTML5 Canvas, um ~120 unabhängige "Nodes" (Individuen) zu rendern. Die Infektionslogik basiert auf physikalischer Nähe und Parametern.',
          },
          {
            subtitle: 'Knoten-Typen',
            text: 'Das Netzwerk besteht aus drei Akteuren:',
            details: ['Normal (Blau): Standard-Resistenz.', 'Influencer (Lila): Hohe Reichweite (Radius x2), schwer zu "heilen".', 'Bot (Rot): Hohe Geschwindigkeit, ignoriert Echokammer-Grenzen.']
          },
          {
            subtitle: 'R-Wert Berechnung',
            text: 'Der Reproduktionswert wird dynamisch aus "Emotional Payload", "Novelty" und "Visual Proof" berechnet.'
          }
        ]
      },
      {
        id: 'VAULT',
        title: 'The Vault (Speicher)',
        icon: <Lock size={18}/>,
        content: [
          {
            subtitle: 'IndexedDB Wrapper',
            text: 'Der "dbService" ist eine Abstraktionsschicht über der Browser-Datenbank IndexedDB. Er ermöglicht das asynchrone Speichern großer Textmengen (KI-Analysen, Chat-Logs) ohne Blockierung des Main-Threads.',
          },
          {
            subtitle: 'Privacy & Sicherheit',
            text: 'Die App folgt einer "Local-First"-Architektur. Keine Nutzerdaten werden an unsere Server gesendet. Der Vault existiert nur auf dem Endgerät.',
          },
          {
            subtitle: 'JSON Editor',
            text: 'Ein integrierter Editor erlaubt die direkte Manipulation von Datensätzen im RAW-Format für Power-User.'
          }
        ]
      }
    ] as DocSection[]
  },
  en: {
    tabs: {
      GUIDE: 'User Guide',
      DANGER_LEVELS: 'Threat Matrix',
      GLOSSARY: 'Glossary',
      FAQ: 'FAQ',
      DOCS: 'System Manual'
    },
    guide: {
      steps: [
        { title: 'Select Target', desc: 'Navigate to the Archive or Dashboard and select a file.', icon: <Search size={20} /> },
        { title: 'AI Analysis', desc: 'Gemini 2.5 deconstructs the narrative into origin, facts, and consensus.', icon: <Cpu size={20} /> },
        { title: 'Skeptic Link', desc: 'Use Dr. Veritas to ask specific questions or check for contradictions.', icon: <Brain size={20} /> },
        { title: 'Visual Intel', desc: 'Generate visual representations to better grasp the context.', icon: <Eye size={20} /> }
      ]
    },
    dangerProtocols: {
      LOW: { label: 'Harmless', desc: 'Entertaining myths with no potential for societal harm.', protocol: 'Enjoy the creativity. No intervention needed.' },
      MEDIUM: { label: 'Concerning', desc: 'Misinformation that sows distrust or endangers health.', protocol: 'Fact-checking recommended. Verify sources.' },
      HIGH: { label: 'Dangerous', desc: 'Narratives that can lead to radicalization or real-world violence.', protocol: 'Active education needed. Stop spread.' },
      EXTREME: { label: 'Critical Threat', desc: 'Direct threat to democratic processes or human lives.', protocol: 'Maximum caution. Report and isolate.' }
    },
    glossary: [
      { term: 'Echo Chamber', definition: 'An environment where a person only encounters information or opinions that reflect their own.', category: 'Psychology' },
      { term: 'Confirmation Bias', definition: 'The tendency to search for, interpret, favor, and recall information in a way that confirms one\'s prior beliefs.', category: 'Psychology' },
      { term: 'False Flag', definition: 'A covert operation designed to deceive; the deception creates the appearance of a particular party being responsible.', category: 'Disinformation' },
      { term: 'Deepfake', definition: 'Synthetic media in which a person in an existing image or video is replaced with someone else\'s likeness using AI.', category: 'Tech' },
      { term: 'Whataboutism', definition: 'A variant of the tu quoque logical fallacy that attempts to discredit an opponent\'s position by charging them with hypocrisy without directly refuting or disproving their argument.', category: 'Disinformation' },
      { term: 'Gish Gallop', definition: 'A rhetorical technique in which a debater attempts to overwhelm an opponent with an excessive number of arguments, regardless of their accuracy.', category: 'Disinformation' }
    ] as GlossaryTerm[],
    faq: [
      { q: 'Is the AI always correct?', a: 'No. AI models can "hallucinate". Always use the provided sources for verification.' },
      { q: 'Are my chats saved?', a: 'Chats are stored locally in your browser only. No permanent storage on our servers.' },
      { q: 'How is the danger level calculated?', a: 'Based on historical data, potential for violence, and assessments by extremism experts (simulated).' }
    ] as FAQItem[],
    docs: [
      {
        id: 'CORE',
        title: 'Core System & Navigation',
        icon: <LayoutDashboard size={18}/>,
        content: [
          {
            subtitle: 'Dashboard (Command Center)',
            text: 'The dashboard aggregates real-time data streams from all modules. It displays "System Load" (simulated network activity) and visualizes database distribution.',
            details: ['Temporal Scatter: Shows relation between origin year and virality.', 'Radar Chart: Thematic distribution of narratives.', 'Geo-Map: Simulated global hotspots.']
          },
          {
            subtitle: 'OmniSearch (⌘K)',
            text: 'The global search interface. Accessible from anywhere via CTRL+K or CMD+K. Indexes theories, authors, media, and navigation nodes.',
          }
        ]
      },
      {
        id: 'ARCHIVE',
        title: 'Archive & Database',
        icon: <Database size={18}/>,
        content: [
          {
            subtitle: 'Data Structure',
            text: 'Each theory is stored as a normalized entity object. Metadata includes ID, category, danger level, and popularity index.',
          },
          {
            subtitle: 'Procedural Art Engine',
            text: 'DisinfoDesk generates cover images dynamically using SVG code based on the theory ID. This saves bandwidth and ensures a consistent, abstract "Tech-Noir" look.',
          },
          {
            subtitle: 'Filter & Sort',
            text: 'Redux-controlled filtering logic allows combining full-text search, category tags, and danger levels in real-time.',
          }
        ]
      },
      {
        id: 'INTELLIGENCE',
        title: 'AI & Intelligence Layer',
        icon: <Brain size={18}/>,
        content: [
          {
            subtitle: 'Gemini 2.5 Integration',
            text: 'The app uses the Google Gemini API directly via the @google/genai SDK. Requests are authenticated client-side.',
            details: ['Model: gemini-2.5-flash (Default) & gemini-3-pro (Deep Dive).', 'Grounding: Google Search Tool integration for fact checks.', 'Safety: HarmBlockThreshold.BLOCK_ONLY_HIGH for maximum analysis freedom on sensitive topics.']
          },
          {
            subtitle: 'Dr. Veritas (Skeptic Bot)',
            text: 'A specialized system prompt forces the AI into the persona of a scientific skeptic. Responses are streamed and can be read aloud via TTS (Text-to-Speech).',
          },
          {
            subtitle: 'Satire Generator',
            text: 'Uses high temperature values (creativity) to hallucinate harmless conspiracy theories. Parameters like "Paranoia Level" control absurdity.'
          }
        ]
      },
      {
        id: 'SIMULATION',
        title: 'Viral Simulation',
        icon: <Activity size={18}/>,
        content: [
          {
            subtitle: 'Agent-Based Model',
            text: 'The simulator uses HTML5 Canvas to render ~120 independent "Nodes" (individuals). Infection logic is based on physical proximity and parameters.',
          },
          {
            subtitle: 'Node Types',
            text: 'The network consists of three actors:',
            details: ['Normal (Blue): Standard resistance.', 'Influencer (Purple): High reach (Radius x2), hard to "cure".', 'Bot (Red): High velocity, ignores echo chamber boundaries.']
          },
          {
            subtitle: 'R-Value Calculation',
            text: 'The reproduction number is dynamically calculated from "Emotional Payload", "Novelty", and "Visual Proof".'
          }
        ]
      },
      {
        id: 'VAULT',
        title: 'The Vault (Storage)',
        icon: <Lock size={18}/>,
        content: [
          {
            subtitle: 'IndexedDB Wrapper',
            text: 'The "dbService" is an abstraction layer over the browser database IndexedDB. It enables asynchronous storage of large text amounts (AI analyses, chat logs) without blocking the main thread.',
          },
          {
            subtitle: 'Privacy & Security',
            text: 'The app follows a "Local-First" architecture. No user data is sent to our servers. The Vault exists only on the device.',
          },
          {
            subtitle: 'JSON Editor',
            text: 'An integrated editor allows direct manipulation of records in RAW format for power users.'
          }
        ]
      }
    ] as DocSection[]
  }
};

// --- 1. Logic Hook ---

const useHelpLogic = () => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<HelpTab>('GUIDE');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  
  // Doc View State
  const [activeDocSection, setActiveDocSection] = useState<string>('CORE');

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
    setActiveDocSection
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

// --- 4. Sub-components ---

const HelpNavigation: React.FC = () => {
  const { activeTab, setActiveTab, data } = useHelp();
  
  const tabs: { id: HelpTab; icon: React.ReactNode }[] = [
    { id: 'GUIDE', icon: <Book size={16} /> },
    { id: 'DANGER_LEVELS', icon: <Shield size={16} /> },
    { id: 'GLOSSARY', icon: <FileText size={16} /> },
    { id: 'DOCS', icon: <FileCode size={16} /> },
    { id: 'FAQ', icon: <HelpCircle size={16} /> },
  ];

  return (
    <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide border-b border-slate-800/50">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-t-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap
            ${activeTab === tab.id 
              ? 'bg-slate-900/50 text-accent-cyan border-b-2 border-accent-cyan shadow-[0_4px_20px_rgba(6,182,212,0.1)]' 
              : 'text-slate-500 hover:text-white hover:bg-slate-800/30'}
          `}
        >
          {tab.icon}
          {data.tabs[tab.id]}
        </button>
      ))}
    </div>
  );
};

// --- DOCS VIEW ---

const DocumentationView: React.FC = () => {
  const { data, activeDocSection, setActiveDocSection } = useHelp();
  
  const currentSection = data.docs.find(d => d.id === activeDocSection);

  return (
    <div className="flex flex-col md:flex-row gap-8 animate-fade-in min-h-[600px]">
      {/* Sidebar / TOC */}
      <div className="md:w-64 shrink-0 space-y-2">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 pl-2">
          Module Index
        </div>
        {data.docs.map(doc => (
          <button
            key={doc.id}
            onClick={() => setActiveDocSection(doc.id)}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-left transition-all
              ${activeDocSection === doc.id 
                ? 'bg-slate-800 text-white border-l-4 border-accent-cyan' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}
            `}
          >
            <span className={activeDocSection === doc.id ? 'text-accent-cyan' : 'text-slate-600'}>
              {doc.icon}
            </span>
            {doc.title}
          </button>
        ))}
        
        <div className="mt-8 p-4 bg-slate-950/50 rounded-xl border border-slate-800 text-[10px] text-slate-500 font-mono">
          <div className="font-bold text-slate-400 mb-2">SYSTEM SPECS</div>
          <div>Version: 2.6.2-stable</div>
          <div>Build: 2024.11.07</div>
          <div>React: v19.2.0</div>
          <div>Gemini SDK: v1.30.0</div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-slate-900/30 rounded-xl border border-slate-800 p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-slate-500">
           {currentSection?.icon && React.cloneElement(currentSection.icon as React.ReactElement, { size: 200 })}
        </div>
        
        {currentSection && (
          <div className="relative z-10 animate-fade-in">
            <h2 className="text-2xl font-black text-white mb-8 border-b border-slate-800 pb-4 flex items-center gap-3">
              <span className="text-accent-cyan">{currentSection.icon}</span>
              {currentSection.title}
            </h2>
            
            <div className="space-y-8">
              {currentSection.content.map((block, idx) => (
                <div key={idx} className="group">
                  <h3 className="text-sm font-bold text-slate-200 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent-purple rounded-full"></div>
                    {block.subtitle}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-3xl mb-4 font-sans">
                    {block.text}
                  </p>
                  {block.details && (
                    <ul className="grid gap-2 pl-4 border-l-2 border-slate-800 ml-1">
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
  const { data } = useHelp();
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-slate-800 md:left-[50%] md:-ml-px"></div>
        {data.guide.steps.map((step, idx) => (
          <div key={idx} className={`relative flex items-center mb-12 last:mb-0 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
            {/* Icon Bubble */}
            <div className="absolute left-0 md:left-1/2 md:-ml-6 w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center z-10 text-accent-cyan shadow-[0_0_20px_rgba(6,182,212,0.2)] group-hover:scale-110 transition-transform">
              {step.icon}
            </div>
            
            {/* Content Card */}
            <div className={`ml-16 md:ml-0 md:w-1/2 ${idx % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
              <Card className="p-6 relative overflow-hidden group border border-slate-800 hover:border-accent-cyan/30 transition-colors bg-slate-950/50 backdrop-blur-md">
                <div className="text-accent-cyan text-[10px] font-mono font-bold mb-2 uppercase tracking-widest opacity-70">STEP 0{idx + 1}</div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                <div className="absolute top-0 right-0 w-16 h-16 bg-accent-cyan/5 rounded-bl-full pointer-events-none group-hover:bg-accent-cyan/10 transition-colors"></div>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DangerMatrixView: React.FC = () => {
  const { data } = useHelp();
  
  const levels = [
    { key: 'LOW', color: 'bg-green-500', text: 'text-green-400', border: 'border-green-500/30' },
    { key: 'MEDIUM', color: 'bg-yellow-500', text: 'text-yellow-400', border: 'border-yellow-500/30' },
    { key: 'HIGH', color: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500/30' },
    { key: 'EXTREME', color: 'bg-red-500', text: 'text-red-400', border: 'border-red-500/30' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
      {levels.map((lvl) => {
        const protocolKey = lvl.key as keyof typeof data.dangerProtocols;
        const info = data.dangerProtocols[protocolKey];
        return (
          <div key={lvl.key} className={`bg-slate-950/50 rounded-xl border ${lvl.border} overflow-hidden relative group backdrop-blur-sm transition-all hover:translate-x-1`}>
             <div className={`absolute top-0 left-0 w-1 h-full ${lvl.color}`}></div>
             <div className="p-6">
               <div className="flex justify-between items-start mb-4">
                 <h3 className={`text-lg font-bold ${lvl.text} uppercase tracking-wider font-mono`}>{info.label}</h3>
                 <Badge label={`Lvl ${lvl.key}`} className={`${lvl.color}/10 ${lvl.text} border-none`} />
               </div>
               
               <p className="text-slate-300 text-sm mb-6 min-h-[40px] leading-relaxed">{info.desc}</p>
               
               <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                 <div className="text-[10px] text-slate-500 uppercase font-bold mb-1 flex items-center gap-1 font-mono">
                   <Activity size={10} /> Protocol
                 </div>
                 <div className="text-xs text-slate-400 font-mono">
                   {info.protocol}
                 </div>
               </div>
             </div>
          </div>
        )
      })}
    </div>
  );
};

const GlossaryView: React.FC = () => {
  const { searchTerm, setSearchTerm, filteredGlossary, t } = useHelp();
  
  return (
    <div className="animate-fade-in space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-slate-500" size={16} />
        <input 
          type="text" 
          placeholder="Filter terminology..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-950/50 border border-slate-700 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all text-sm font-mono shadow-inner"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredGlossary.length > 0 ? (
          filteredGlossary.map((item, idx) => (
            <div key={idx} className="bg-slate-950/50 border border-slate-800 rounded-lg p-5 hover:border-slate-600 transition-all hover:shadow-lg group">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-base font-bold text-accent-cyan group-hover:text-white transition-colors font-mono">{item.term}</h4>
                <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-1 rounded uppercase tracking-wider font-bold">
                  {item.category}
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                {item.definition}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-500">
             <Search size={32} className="mx-auto mb-2 opacity-50" />
             <p className="font-mono text-xs uppercase tracking-widest">NO_MATCHES_FOUND</p>
          </div>
        )}
      </div>
    </div>
  );
};

const FAQView: React.FC = () => {
  const { data, expandedFAQ, toggleFAQ } = useHelp();
  
  return (
    <div className="animate-fade-in space-y-3">
      {data.faq.map((item, idx) => (
        <div key={idx} className={`bg-slate-950/50 border rounded-lg overflow-hidden transition-all duration-300 ${expandedFAQ === idx ? 'border-accent-cyan/30 bg-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.05)]' : 'border-slate-800'}`}>
          <button 
            onClick={() => toggleFAQ(idx)}
            className="w-full flex justify-between items-center p-5 text-left focus:outline-none hover:bg-slate-800/30 transition-colors"
          >
            <span className={`font-bold text-sm ${expandedFAQ === idx ? 'text-accent-cyan' : 'text-slate-200'}`}>{item.q}</span>
            <ChevronDown 
              size={16} 
              className={`text-slate-500 transition-transform duration-300 ${expandedFAQ === idx ? 'rotate-180 text-accent-cyan' : ''}`} 
            />
          </button>
          
          <div className={`
            overflow-hidden transition-all duration-300 ease-in-out
            ${expandedFAQ === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}
          `}>
             <div className="p-5 pt-0 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 mt-2 font-medium">
               {item.a}
             </div>
          </div>
        </div>
      ))}

      <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
         <div className="flex items-center gap-4">
           <div className="p-3 bg-slate-900 rounded-full border border-slate-800">
              <Brain size={24} className="text-accent-purple" />
           </div>
           <div>
             <h4 className="font-bold text-white mb-1 text-sm">Need deep analysis?</h4>
             <p className="text-xs text-slate-400">Our AI Skeptic is available 24/7 for direct interrogation.</p>
           </div>
         </div>
         <Button variant="secondary" icon={<Brain size={16} />} className="text-xs border-slate-700 hover:border-accent-purple hover:text-white">
           Open Debunk-Bot
         </Button>
      </div>
    </div>
  );
};

// --- 5. Main Component ---

export const Help: React.FC = () => {
  return (
    <HelpProvider>
      <div className="max-w-7xl mx-auto pb-20 pt-4">
        <PageHeader 
            title="KNOWLEDGE BASE"
            subtitle="GUIDE FOR TRUTH SEEKERS"
            icon={Network}
            status="MANUAL LOADED"
        />
        
        <HelpNavigation />
        
        <div className="min-h-[400px]">
          <ContentSwitcher />
        </div>
        
        <div className="mt-16 text-center border-t border-slate-800 pt-8">
           <p className="text-xs text-slate-600 font-mono">
             "The truth is rarely pure and never simple." — Oscar Wilde
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
    default: return <GuideView />;
  }
};

export default Help;
