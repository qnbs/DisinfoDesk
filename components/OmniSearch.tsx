import React, { useState, useEffect, useMemo, useRef, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, FileText, User, Film, ArrowRight, Hash, 
  Settings, Database, HelpCircle, ShieldAlert, Activity, 
  MessageSquare, Skull, Globe, Eye, RefreshCw, Download
} from 'lucide-react';
import { THEORIES_DE_FULL as THEORIES_DE, MEDIA_ITEMS } from '../constants';
import { AUTHORS_FULL } from '../data/enriched';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateSetting, setLanguage as setReduxLanguage } from '../store/slices/settingsSlice';
import { dbService } from '../services/dbService';

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
      // Small delay to ensure render
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
  const results: SearchResult[] = useMemo(() => {
    // SYSTEM NAVIGATION
    const navItems: SearchResult[] = [
        { id: 'nav-dash', type: 'NAV', title: t.nav.dashboard, subtitle: 'Overview', link: '/', icon: <Hash size={14}/> },
        { id: 'nav-arch', type: 'NAV', title: t.nav.archive, subtitle: 'Database', link: '/archive', icon: <FileText size={14}/> },
        { id: 'nav-media', type: 'NAV', title: t.nav.media, subtitle: 'Pop Culture', link: '/media', icon: <Film size={14}/> },
        { id: 'nav-auth', type: 'NAV', title: t.nav.authors, subtitle: 'Profiles', link: '/authors', icon: <User size={14}/> },
        { id: 'nav-dang', type: 'NAV', title: t.nav.dangerous, subtitle: 'Threat Matrix', link: '/dangerous', icon: <ShieldAlert size={14}/> },
        { id: 'nav-vir', type: 'NAV', title: t.nav.virality, subtitle: 'Simulation', link: '/virality', icon: <Activity size={14}/> },
        { id: 'nav-chat', type: 'NAV', title: t.nav.chat, subtitle: 'AI Uplink', link: '/chat', icon: <MessageSquare size={14}/> },
        { id: 'nav-sat', type: 'NAV', title: t.nav.generator, subtitle: 'Satire Gen', link: '/satire', icon: <Skull size={14}/> },
        { id: 'nav-vault', type: 'NAV', title: t.nav.database, subtitle: 'Vault Manager', link: '/database', icon: <Database size={14}/> },
        { id: 'nav-set', type: 'NAV', title: t.nav.settings, subtitle: 'Config', link: '/settings', icon: <Settings size={14}/> },
        { id: 'nav-help', type: 'NAV', title: t.nav.help, subtitle: 'Manual', link: '/help', icon: <HelpCircle size={14}/> },
    ];

    // SYSTEM ACTIONS
    const actionItems: SearchResult[] = [
        { id: 'act-lang', type: 'ACTION', title: language === 'de' ? 'Switch to English' : 'Wechsel zu Deutsch', subtitle: 'System Language', action: handleToggleLanguage, icon: <Globe size={14}/> },
        { id: 'act-cont', type: 'ACTION', title: settings.highContrast ? 'Disable High Contrast' : 'Enable High Contrast', subtitle: 'Visual Accessibility', action: handleToggleContrast, icon: <Eye size={14}/> },
        { id: 'act-rel', type: 'ACTION', title: 'System Reload', subtitle: 'Flush Interface', action: handleReload, icon: <RefreshCw size={14}/> },
        { id: 'act-exp', type: 'ACTION', title: 'Quick Dump', subtitle: 'Export Vault', action: handleExport, icon: <Download size={14}/> },
    ];

    // Default View (Empty Query)
    if (!query.trim()) {
        return [...navItems, ...actionItems];
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

    return res.slice(0, 12); // Limit results
  }, [query, t, language, settings.highContrast, handleToggleLanguage, handleToggleContrast, handleExport]);

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
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) handleSelect(results[selectedIndex]);
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
    results,
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
        <>
            {/* Input Header - HIDDEN ON MOBILE */}
            <div className="hidden md:flex items-center gap-3 p-4 border-b border-slate-800">
                <Search className="text-accent-cyan" size={20} />
                <input
                    ref={inputRef}
                    type="text"
                    className="flex-1 bg-transparent text-lg text-white placeholder-slate-500 outline-none font-mono"
                    placeholder={t.search.placeholder}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <div className="flex gap-2">
                    <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-400 font-mono">
                    ESC
                    </kbd>
                </div>
            </div>

            {/* Mobile Header (Static) */}
            <div className="md:hidden p-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">System Command</span>
                <button onClick={onClose} className="text-slate-500"><Hash size={16}/></button>
            </div>
        </>
    );
};

const SearchResults: React.FC = () => {
    const { results, selectedIndex, setSelectedIndex, handleSelect, t } = useOmniSearch();

    return (
        <div className="flex-1 overflow-y-auto p-2 bg-slate-950/50 scrollbar-thin scrollbar-thumb-slate-800">
          {results.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-mono text-xs">
              {t.search.noResults}
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((res, idx) => (
                <button
                  key={`${res.type}-${res.id}`}
                  onClick={() => handleSelect(res)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`
                    w-full flex items-center justify-between p-3 rounded-lg text-left transition-all group
                    ${idx === selectedIndex 
                      ? 'bg-accent-cyan/10 border border-accent-cyan/30 text-white' 
                      : 'border border-transparent text-slate-400 hover:bg-slate-900'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-md ${idx === selectedIndex ? 'bg-accent-cyan text-slate-900' : 'bg-slate-800 text-slate-500'}`}>
                      {res.icon}
                    </div>
                    <div>
                      <div className="font-bold text-sm flex items-center gap-2">
                        {res.title}
                        {/* Type Badge */}
                        <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono ${
                            res.type === 'ACTION' ? 'bg-purple-900/50 border-purple-500/30 text-purple-300' :
                            res.type === 'NAV' ? 'bg-slate-800 border-slate-700 text-slate-500' :
                            'bg-slate-900 border-slate-700 text-slate-500'
                        }`}>
                            {res.type}
                        </span>
                      </div>
                      <div className={`text-xs ${idx === selectedIndex ? 'text-cyan-200' : 'text-slate-600'}`}>
                        {res.subtitle}
                      </div>
                    </div>
                  </div>
                  {idx === selectedIndex && <ArrowRight size={16} className="text-accent-cyan animate-pulse mr-2" />}
                </button>
              ))}
            </div>
          )}
        </div>
    );
};

const SearchFooter: React.FC = () => {
    const { results, t } = useOmniSearch();
    return (
        <div className="p-2 border-t border-slate-800 bg-slate-900 text-[10px] text-slate-500 flex justify-between font-mono px-4">
            <span>{t.search.footerLeft}</span>
            <span>{results.length} NODES FOUND</span>
        </div>
    );
};

const OmniSearchLayout: React.FC = () => {
    const { onClose } = useOmniSearch();
    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-start justify-center pt-safe-top md:pt-[15vh] px-2 md:px-4 animate-fade-in" onClick={onClose}>
            <div 
                className="w-full max-w-2xl bg-slate-900/90 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
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