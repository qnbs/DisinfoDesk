
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, FileText, User, Film, ArrowRight, Hash } from 'lucide-react';
import { THEORIES_DE_FULL as THEORIES_DE, MEDIA_ITEMS } from '../constants';
import { AUTHORS_DATA } from '../data/authors';
import { useLanguage } from '../contexts/LanguageContext';

interface SearchResult {
  id: string;
  type: 'THEORY' | 'AUTHOR' | 'MEDIA' | 'NAV';
  title: string;
  subtitle: string;
  link: string;
  icon: React.ReactNode;
}

export const OmniSearch: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Data Aggregation
  const results: SearchResult[] = useMemo(() => {
    if (!query.trim()) return [
        { id: 'nav-dash', type: 'NAV', title: 'Dashboard', subtitle: 'Go to Overview', link: '/', icon: <Hash size={14}/> },
        { id: 'nav-arch', type: 'NAV', title: 'Archive', subtitle: 'Browse Theories', link: '/archive', icon: <Hash size={14}/> },
        { id: 'nav-chat', type: 'NAV', title: 'Dr. Veritas', subtitle: 'AI Debunk Bot', link: '/chat', icon: <Hash size={14}/> },
    ];

    const lowerQ = query.toLowerCase();
    const res: SearchResult[] = [];

    // Theories
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

    // Authors
    AUTHORS_DATA.forEach(a => {
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

    // Media
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

    return res.slice(0, 8); // Limit results
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    navigate(result.link);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4 animate-fade-in" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Input Header */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-800">
          <Search className="text-accent-cyan" size={20} />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent text-lg text-white placeholder-slate-500 outline-none font-mono"
            placeholder="Search database, commands, or entities..."
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

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 bg-slate-950/50">
          {results.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-mono text-xs">
              NO_MATCHES_FOUND_IN_ARCHIVE
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
                        {res.type !== 'NAV' && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-500 font-mono">
                                {res.type}
                            </span>
                        )}
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
        
        {/* Footer */}
        <div className="p-2 border-t border-slate-800 bg-slate-900 text-[10px] text-slate-500 flex justify-between font-mono px-4">
            <span>DISINFODESK OS v2.6</span>
            <span>INDEXING COMPLETE</span>
        </div>
      </div>
    </div>
  );
};
