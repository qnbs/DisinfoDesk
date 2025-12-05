import React, { useState, useEffect, useMemo, useRef, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, FileText, User, Film, ArrowRight, Hash, 
  Settings, Database, HelpCircle, ShieldAlert, Activity, 
  MessageSquare, Skull, Globe, Eye, RefreshCw, Download,
  Terminal, Command, ChevronRight, Cpu
} from 'lucide-react';
import { THEORIES_DE_FULL as THEORIES_DE, MEDIA_ITEMS } from '../constants';
import { AUTHORS_FULL } from '../data/enriched';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateSetting, setLanguage as setReduxLanguage } from '../store/slices/settingsSlice';
import { dbService } from '../services/dbService';
import { Badge } from './ui/Common';

interface SearchResult {
  id: string;
  type: 'THEORY' | 'AUTHOR' | 'MEDIA' | 'NAV' | 'ACTION';
  title: string;
  subtitle: string;
  link?: string;
  action?: () => void;
  icon: React.ReactNode;
}

// --- 1. Logic Hook ---

const useOmniSearchLogic = (isOpen: boolean, onClose: () => void) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const dispatch = useAppDispatch();
  const settings = useAppSelector(state => state.settings.config);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (window.innerWidth >= 768) {
            inputRef.current?.focus();
        }
      }, 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Actions Logic
  const handleToggleLanguage = () => {
    const newLang = language === 'de' ? 'en' : 'de';
    setLanguage(newLang);
    dispatch(setReduxLanguage(newLang));
    onClose();
  };

  const handleToggleContrast = () => {
    dispatch(updateSetting({ key: 'highContrast', value: !settings.highContrast }));
    onClose();
  };

  const handleExport = async () => {
    const blob = await dbService.exportFullDatabase();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `disinfodesk_quick_export.json`;
    a.click();
    onClose();
  };

  const handleReload = () => {
    window.location.reload();
  };

  // Data Aggregation
  const flatResults: SearchResult[] = useMemo(() => {
    // SYSTEM NAVIGATION
    const navItems: SearchResult[] = [
        { id: 'nav-dash', type: 'NAV', title: t.nav.dashboard, subtitle: 'Command Center', link: '/', icon: <Activity size={14}/> },
        { id: 'nav-arch', type: 'NAV', title: t.nav.archive, subtitle: 'Main Database', link: '/archive', icon: <FileText size={14}/> },
        { id: 'nav-dang', type: 'NAV', title: t.nav.dangerous, subtitle: 'Threat Matrix', link: '/dangerous', icon: <ShieldAlert size={14}/> },
        { id: 'nav-vir', type: 'NAV', title: t.nav.virality, subtitle: 'Simulation Engine', link: '/virality', icon: <Globe size={14}/> },
        { id: 'nav-chat', type: 'NAV', title: t.nav.chat, subtitle: 'AI Interrogation', link: '/chat', icon: <MessageSquare size={14}/> },
        { id: 'nav-vault', type: 'NAV', title: t.nav.database, subtitle: 'Secure Vault', link: '/database', icon: <Database size={14}/> },
        { id: 'nav-set', type: 'NAV', title: t.nav.settings, subtitle: 'System Config', link: '/settings', icon: <Settings size={14}/> },
    ];

    // SYSTEM ACTIONS
    const actionItems: SearchResult[] = [
        { id: 'act-lang', type: 'ACTION', title: language === 'de' ? 'Switch Language (EN)' : 'Sprache wechseln (DE)', subtitle: 'Localization', action: handleToggleLanguage, icon: <Globe size={14}/> },
        { id: 'act-cont', type: 'ACTION', title: settings.highContrast ? 'Disable High Contrast' : 'Enable High Contrast', subtitle: 'Visual Mode', action: handleToggleContrast, icon: <Eye size={14}/> },
        { id: 'act-rel', type: 'ACTION', title: 'System Reboot', subtitle: 'Flush Cache', action: handleReload, icon: <RefreshCw size={14}/> },
        { id: 'act-exp', type: 'ACTION', title: 'Data Dump', subtitle: 'Export Vault', action: handleExport, icon: <Download size={14}/> },
    ];

    // Handle Slash Commands
    if (query.startsWith('/')) {
        return actionItems.filter(item => 
            item.title.toLowerCase().includes(query.substring(1).toLowerCase()) ||
            item.subtitle.toLowerCase().includes(query.substring(1).toLowerCase())
        );
    }

    // Default View (Empty Query) - Show Nav
    if (!query.trim()) {
        return navItems;
    }

    const lowerQ = query.toLowerCase();
    const res: SearchResult[] = [];

    // Filter Nav & Actions
    [...navItems, ...actionItems].forEach(item => {
        if (item.title.toLowerCase().includes(lowerQ) || item.subtitle.toLowerCase().includes(lowerQ)) {
            res.push(item);
        }
    });

    // Filter Theories
    THEORIES_DE.forEach(t => {
      if (t.title.toLowerCase().includes(lowerQ) || t.tags.some(tag => tag.toLowerCase().includes(lowerQ))) {
        res.push({
          id: t.id,
          type: 'THEORY',
          title: t.title,
          subtitle: t.category,
          link: `/archive/${t.id}`,
          icon: <FileText size={14} />
        });
      }
    });

    // Filter Authors
    AUTHORS_FULL.forEach(a => {
      if (a.name.toLowerCase().includes(lowerQ)) {
        res.push({
          id: a.id,
          type: 'AUTHOR',
          title: a.name,
          subtitle: a.nationality,
          link: `/authors/${a.id}`,
          icon: <User size={14} />
        });
      }
    });

    // Filter Media
    MEDIA_ITEMS.forEach(m => {
      if (m.title.toLowerCase().includes(lowerQ)) {
        res.push({
          id: m.id,
          type: 'MEDIA',
          title: m.title,
          subtitle: `${m.type} (${m.year})`,
          link: `/media/${m.id}`,
          icon: <Film size={14} />
        });
      }
    });

    return res.slice(0, 15); // Limit results
  }, [query, t, language, settings.highContrast, handleToggleLanguage, handleToggleContrast, handleExport]);

  // Group Results for Display
  const groupedResults = useMemo((): Record<string, SearchResult[]> => {
      if (query.startsWith('/')) {
          return { 'COMMANDS': flatResults };
      }

      const system = flatResults.filter(r => r.type === 'NAV' || r.type === 'ACTION');
      const database = flatResults.filter(r => r.type === 'THEORY' || r.type === 'MEDIA' || r.type === 'AUTHOR');

      const groups: Record<string, SearchResult[]> = {};
      
      if (system.length > 0) groups['SYSTEM'] = system;
      if (database.length > 0) groups['DATABASE'] = database;
      
      return groups;
  }, [flatResults, query]);

  const handleSelect = (result: SearchResult) => {
    if (result.type === 'ACTION' && result.action) {
        result.action();
    } else if (result.link) {
        navigate(result.link);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % flatResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + flatResults.length) % flatResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatResults[selectedIndex]) handleSelect(flatResults[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return {
    query,
    setQuery,
    selectedIndex,
    setSelectedIndex,
    inputRef,
    flatResults,
    groupedResults,
    handleSelect,
    handleKeyDown,
    t,
    onClose
  };
};

// --- 2. Context & Provider ---

type OmniSearchContextType = ReturnType<typeof useOmniSearchLogic>;
const OmniSearchContext = createContext<OmniSearchContextType | undefined>(undefined);

const useOmniSearch = () => {
    const context = useContext(OmniSearchContext);
    if (!context) throw new Error('useOmniSearch must be used within a OmniSearchProvider');
    return context;
};

const OmniSearchProvider: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ isOpen, onClose, children }) => {
    const logic = useOmniSearchLogic(isOpen, onClose);
    return <OmniSearchContext.Provider value={logic}>{children}</OmniSearchContext.Provider>;
};

// --- 3. Sub-Components ---

const SearchHeader: React.FC = () => {
    const { inputRef, query, setQuery, handleKeyDown, t, onClose } = useOmniSearch();
    return (
        <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-slate-950/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-accent-cyan/5 animate-pulse-slow pointer-events-none"></div>
            <div className="text-accent-cyan animate-pulse hidden md:block font-mono">{'>'}</div>
            <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-transparent text-lg text-white placeholder-slate-600 outline-none font-mono tracking-wide"
                placeholder={t.search.placeholder}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
            />
            <div className="flex gap-2 items-center">
                {!query && (
                    <div className="hidden md:flex items-center gap-1 text-[10px] text-slate-500 font-mono bg-slate-900 border border-slate-700 px-2 py-1 rounded">
                        <span>Try</span>
                        <span className="text-accent-purple font-bold">/</span>
                        <span>for commands</span>
                    </div>
                )}
                <button onClick={onClose} className="p-1 text-slate-500 hover:text-white rounded hover:bg-slate-800 transition-colors">
                    <span className="sr-only">Close</span>
                    <kbd className="hidden md:inline font-mono text-[10px] border border-slate-700 rounded px-1.5 py-0.5">ESC</kbd>
                    <span className="md:hidden"><Command size={16}/></span>
                </button>
            </div>
        </div>
    );
};

const SearchResults: React.FC = () => {
    const { groupedResults, flatResults, selectedIndex, setSelectedIndex, handleSelect, t } = useOmniSearch();

    let globalIndex = 0;

    return (
        <div className="flex-1 overflow-y-auto bg-[#050b14] scrollbar-thin scrollbar-thumb-slate-800 relative">
          {flatResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500 opacity-50">
              <Search size={32} className="mb-2" />
              <div className="font-mono text-xs uppercase tracking-widest">{t.search.noResults}</div>
            </div>
          ) : (
            <div className="p-2 space-y-4">
                {Object.entries(groupedResults).map(([group, items]) => (
                    <div key={group}>
                        <div className="px-2 mb-1 text-[10px] font-bold text-slate-600 uppercase tracking-widest font-mono flex items-center gap-2">
                            {group === 'SYSTEM' && <Terminal size={10} />}
                            {group === 'DATABASE' && <Database size={10} />}
                            {group}
                        </div>
                        <div className="space-y-1">
                            {(items as SearchResult[]).map((res) => {
                                const currentIndex = globalIndex++;
                                const isSelected = currentIndex === selectedIndex;
                                
                                return (
                                    <button
                                        key={`${res.type}-${res.id}`}
                                        onClick={() => handleSelect(res)}
                                        onMouseEnter={() => setSelectedIndex(currentIndex)}
                                        className={`
                                            w-full flex items-center justify-between p-3 rounded-md text-left transition-all group relative overflow-hidden font-mono
                                            ${isSelected 
                                                ? 'bg-slate-900 border-l-2 border-l-accent-cyan text-white shadow-lg' 
                                                : 'border-l-2 border-l-transparent text-slate-400 hover:bg-slate-900/50'}
                                        `}
                                    >
                                        {/* Highlight Scanline */}
                                        {isSelected && <div className="absolute inset-0 bg-accent-cyan/5 pointer-events-none animate-scan"></div>}
                                        
                                        <div className="flex items-center gap-4 relative z-10">
                                            <div className={`p-1.5 rounded transition-colors ${isSelected ? 'text-accent-cyan bg-accent-cyan/10' : 'text-slate-600 bg-slate-950'}`}>
                                                {res.icon}
                                            </div>
                                            <div>
                                                <div className="font-bold text-xs flex items-center gap-2 tracking-wide">
                                                    {res.title}
                                                    {res.type === 'ACTION' && <Badge label="CMD" className="text-[8px] py-0 px-1 border-slate-700 text-slate-500"/>}
                                                </div>
                                                <div className={`text-[10px] ${isSelected ? 'text-cyan-200/70' : 'text-slate-600'}`}>
                                                    {res.subtitle}
                                                </div>
                                            </div>
                                        </div>
                                        {isSelected && <ChevronRight size={14} className="text-accent-cyan animate-pulse mr-1" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
          )}
        </div>
    );
};

const SearchFooter: React.FC = () => {
    const { flatResults, t, selectedIndex } = useOmniSearch();
    const currentItem = flatResults[selectedIndex];

    return (
        <div className="p-2 border-t border-slate-800 bg-slate-950 text-[10px] text-slate-500 flex justify-between font-mono px-4 h-8 items-center">
            <div className="flex gap-4">
                <span className="flex items-center gap-1"><Cpu size={10} className="text-accent-cyan"/> {t.search.footerLeft}</span>
                <span className="hidden md:inline opacity-50">PID: {Math.floor(Math.random() * 9000) + 1000}</span>
            </div>
            <div className="flex items-center gap-4">
                {currentItem && (
                    <span className="text-slate-400 uppercase hidden md:inline truncate max-w-[150px]">
                        Target: {currentItem.id}
                    </span>
                )}
                <span className="font-bold text-slate-300">{flatResults.length} NODES</span>
            </div>
        </div>
    );
};

const OmniSearchLayout: React.FC = () => {
    const { onClose } = useOmniSearch();
    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-safe-top md:pt-[15vh] px-2 md:px-4 animate-fade-in" onClick={onClose}>
            <div 
                className="w-full max-w-2xl bg-[#0B0F19] border border-slate-700 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[70vh] ring-1 ring-white/10"
                onClick={e => e.stopPropagation()}
            >
                <SearchHeader />
                <SearchResults />
                <SearchFooter />
            </div>
        </div>
    );
};

// --- 4. Main Component ---

export const OmniSearch: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
      <OmniSearchProvider isOpen={isOpen} onClose={onClose}>
          <OmniSearchLayout />
      </OmniSearchProvider>
  );
};