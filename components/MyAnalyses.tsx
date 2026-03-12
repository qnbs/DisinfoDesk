
import React, {
  useState, useEffect, useCallback, useMemo, createContext, useContext
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Search, Trash2, Download, SortAsc, SortDesc, ShieldCheck, BarChart3, Clock
} from 'lucide-react';
import {
  Button, Card, Badge, PageHeader, PageFrame, EmptyState
} from './ui/Common';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppSelector } from '../store/hooks';
import { dbService } from '../services/dbService';
import { StoredAnalysis, StoredMediaAnalysis } from '../types';
import { playSound, haptic } from '../utils/microInteractions';
import { downloadFactCheckReport, FactCheckReport } from '../utils/factCheckReport';

// --- Types ---
type SortField = 'timestamp' | 'title';
type SortDir = 'asc' | 'desc';
type FilterType = 'all' | 'theory' | 'media';

interface AnalysisItem {
  id: string;
  title: string;
  timestamp: number;
  type: 'theory' | 'media';
  verdict?: string;
  language: 'de' | 'en';
  score?: number;
  raw: StoredAnalysis | StoredMediaAnalysis;
}

// --- 1. Logic Hook ---

const useAnalysesLogic = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const settings = useAppSelector(state => state.settings.config);

  const [items, setItems] = useState<AnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [filterType, setFilterType] = useState<FilterType>('all');

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const [analyses, mediaAnalyses] = await Promise.all([
        dbService.getAll<StoredAnalysis>('analyses'),
        dbService.getAll<StoredMediaAnalysis>('media_analyses'),
      ]);

      const mapped: AnalysisItem[] = [
        ...analyses.map(a => ({
          id: a.id,
          title: a.title,
          timestamp: a.timestamp,
          type: 'theory' as const,
          verdict: undefined,
          language: a.language,
          score: undefined,
          raw: a,
        })),
        ...mediaAnalyses.map(m => ({
          id: m.id,
          title: m.title,
          timestamp: m.timestamp,
          type: 'media' as const,
          verdict: undefined,
          language: m.language,
          score: undefined,
          raw: m,
        })),
      ];

      setItems(mapped);
    } catch (e) {
      console.error('Failed to load analyses', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const filteredItems = useMemo(() => {
    let result = items;

    // Filter by type
    if (filterType !== 'all') {
      result = result.filter(i => i.type === filterType);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i =>
        i.title.toLowerCase().includes(q) ||
        (i.verdict || '').toLowerCase().includes(q)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      const valA = sortField === 'timestamp' ? a.timestamp : a.title.toLowerCase();
      const valB = sortField === 'timestamp' ? b.timestamp : b.title.toLowerCase();
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [items, filterType, searchQuery, sortField, sortDir]);

  const handleDelete = useCallback(async (item: AnalysisItem) => {
    const store = item.type === 'theory' ? 'analyses' : 'media_analyses';
    await dbService.delete(store, item.id);
    setItems(prev => prev.filter(i => i.id !== item.id));
    playSound('click', settings.soundEnabled);
  }, [settings.soundEnabled]);

  const handleExport = useCallback((item: AnalysisItem) => {
    if (item.type === 'theory') {
      const stored = item.raw as StoredAnalysis;
      const report: FactCheckReport = {
        generatedAt: new Date(item.timestamp).toISOString(),
        reportType: 'THEORY',
        id: item.id,
        title: item.title,
        language: item.language,
        summary: stored.data?.debunking || stored.data?.fullDescription,
        findings: [stored.data?.originStory, stored.data?.scientificConsensus].filter(Boolean),
        references: (stored.data?.sources || []).map(s => ({ title: s.title, url: s.url })),
      };
      downloadFactCheckReport(report);
    } else {
      // Media analysis - export as JSON
      const blob = new Blob([JSON.stringify(item.raw, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analysis-${item.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
    playSound('success', settings.soundEnabled);
  }, [settings.soundEnabled]);

  const handleOpen = useCallback((item: AnalysisItem) => {
    if (item.type === 'theory') {
      // Navigate to theory detail; the stored analysis should load from cache
      const theoryId = item.id.replace(/^fc_/, '').replace(/_\d+$/, '');
      navigate(`/archive/${theoryId}`);
    } else {
      const mediaId = item.id.replace(/^ma_/, '').replace(/_\d+$/, '');
      navigate(`/media/${mediaId}`);
    }
    playSound('navigate', settings.soundEnabled);
    haptic('light');
  }, [navigate, settings.soundEnabled]);

  const toggleSort = useCallback(() => {
    if (sortDir === 'desc') setSortDir('asc');
    else setSortDir('desc');
  }, [sortDir]);

  return {
    items, filteredItems, loading, searchQuery, setSearchQuery,
    sortField, setSortField, sortDir, toggleSort,
    filterType, setFilterType, handleDelete, handleExport, handleOpen,
    loadItems, navigate, t, language, settings
  };
};

// --- 2. Context ---
type AnalysesContextType = ReturnType<typeof useAnalysesLogic>;
const AnalysesContext = createContext<AnalysesContextType | undefined>(undefined);
const useAnalyses = () => {
  const ctx = useContext(AnalysesContext);
  if (!ctx) throw new Error('useAnalyses must be within provider');
  return ctx;
};

// --- 3. Sub-Components ---

const Toolbar: React.FC = () => {
  const { searchQuery, setSearchQuery, filterType, setFilterType, sortDir, toggleSort, sortField, setSortField, language } = useAnalyses();

  return (
    <div className="flex flex-col md:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={language === 'de' ? 'Analysen durchsuchen...' : 'Search analyses...'}
          className="w-full bg-slate-900/70 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-accent-cyan transition-all font-mono"
        />
      </div>

      <div className="flex gap-2">
        {/* Filter type */}
        <div className="flex bg-slate-900/70 border border-slate-700 rounded-lg overflow-hidden">
          {(['all', 'theory', 'media'] as FilterType[]).map(ft => (
            <button
              key={ft}
              onClick={() => setFilterType(ft)}
              className={`px-3 py-2 text-[10px] font-mono uppercase tracking-widest transition-all ${
                filterType === ft ? 'bg-accent-cyan/10 text-accent-cyan' : 'text-slate-500 hover:text-white'
              }`}
            >
              {ft === 'all' ? (language === 'de' ? 'Alle' : 'All') : ft === 'theory' ? (language === 'de' ? 'Theorien' : 'Theories') : 'Media'}
            </button>
          ))}
        </div>

        {/* Sort */}
        <button
          onClick={toggleSort}
          className="flex items-center gap-1 px-3 py-2 bg-slate-900/70 border border-slate-700 rounded-lg text-[10px] font-mono text-slate-400 hover:text-white transition-all"
          title={sortDir === 'desc' ? 'Newest first' : 'Oldest first'}
        >
          {sortDir === 'desc' ? <SortDesc size={12} /> : <SortAsc size={12} />}
        </button>

        <select
          value={sortField}
          onChange={e => setSortField(e.target.value as SortField)}
          className="bg-slate-900/70 border border-slate-700 rounded-lg px-2 py-2 text-[10px] font-mono text-slate-400 outline-none"
        >
          <option value="timestamp">{language === 'de' ? 'Datum' : 'Date'}</option>
          <option value="title">{language === 'de' ? 'Titel' : 'Title'}</option>
        </select>
      </div>
    </div>
  );
};

const AnalysisCard: React.FC<{ item: AnalysisItem }> = ({ item }) => {
  const { handleOpen, handleExport, handleDelete, language } = useAnalyses();

  const verdictColor = !item.verdict ? 'text-slate-500' :
    item.verdict === 'DEBUNKED' ? 'text-green-400' :
    item.verdict === 'PARTLY_TRUE' ? 'text-yellow-400' :
    item.verdict === 'UNVERIFIED' ? 'text-orange-400' : 'text-red-400';

  const timeAgo = useMemo(() => {
    const diff = Date.now() - item.timestamp;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 60) return `${mins}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  }, [item.timestamp]);

  return (
    <Card variant="glass" className="p-4 group hover:border-slate-600 transition-all">
      <div className="flex items-start justify-between gap-3">
        <button onClick={() => handleOpen(item)} className="flex-1 text-left min-w-0 group/link">
          <div className="flex items-center gap-2 mb-1">
            <Badge 
              label={item.type === 'theory' ? 'THEORY' : 'MEDIA'} 
              className={`text-[8px] py-0 px-1.5 ${item.type === 'theory' ? 'border-accent-cyan/30 text-accent-cyan' : 'border-accent-purple/30 text-accent-purple'}`} 
            />
            {item.verdict && (
              <span className={`text-[9px] font-mono font-bold ${verdictColor}`}>{item.verdict}</span>
            )}
            <span className="text-[9px] font-mono text-slate-600 ml-auto flex items-center gap-1">
              <Clock size={9} /> {timeAgo}
            </span>
          </div>
          <div className="text-sm font-bold text-white truncate group-hover/link:text-accent-cyan transition-colors">{item.title}</div>
          <div className="flex items-center gap-3 mt-2">
            {item.score !== undefined && (
              <div className="flex items-center gap-1.5">
                <div className="h-1 w-12 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 to-green-500 rounded-full" style={{ width: `${item.score}%` }} />
                </div>
                <span className="text-[9px] font-mono text-slate-500">{item.score}</span>
              </div>
            )}
            <span className="text-[9px] font-mono text-slate-600 uppercase">{item.language}</span>
          </div>
        </button>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => handleExport(item)} 
            className="p-2 rounded-lg text-slate-500 hover:text-accent-cyan hover:bg-slate-800 transition-all"
            title={language === 'de' ? 'Exportieren' : 'Export'}
          >
            <Download size={14} />
          </button>
          <button 
            onClick={() => handleDelete(item)} 
            className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-all"
            title={language === 'de' ? 'Löschen' : 'Delete'}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </Card>
  );
};

const AnalysesList: React.FC = () => {
  const { filteredItems, loading, language, navigate } = useAnalyses();

  if (loading) {
    return (
      <div className="space-y-3">
        {[1,2,3].map(i => (
          <Card key={i} className="p-4">
            <div className="space-y-3">
              <div className="h-3 w-1/4 rounded shimmer-loading" />
              <div className="h-4 w-3/4 rounded shimmer-loading" style={{ animationDelay: '100ms' }} />
              <div className="h-2 w-1/2 rounded shimmer-loading" style={{ animationDelay: '200ms' }} />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title={language === 'de' ? 'Keine Analysen gefunden' : 'No analyses found'}
        description={language === 'de' 
          ? 'Starten Sie einen Faktencheck oder analysieren Sie eine Theorie.' 
          : 'Start a fact-check or analyze a theory.'}
        action={
          <Button variant="primary" onClick={() => navigate('/factcheck')} icon={<ShieldCheck size={16} />}>
            {language === 'de' ? 'Faktencheck starten' : 'Start Fact-Check'}
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      {filteredItems.map(item => (
        <AnalysisCard key={item.id} item={item} />
      ))}
    </div>
  );
};

const StatsBar: React.FC = () => {
  const { items, language } = useAnalyses();

  const stats = useMemo(() => {
    const total = items.length;
    const debunked = items.filter(i => i.verdict === 'DEBUNKED').length;
    const avgScore = items.filter(i => i.score !== undefined).reduce((sum, i) => sum + (i.score || 0), 0) / (items.filter(i => i.score !== undefined).length || 1);
    return { total, debunked, avgScore: Math.round(avgScore) };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
      <Card variant="glass" className="p-3 text-center">
        <div className="text-lg font-black text-white">{stats.total}</div>
        <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
          {language === 'de' ? 'Gesamt' : 'Total'}
        </div>
      </Card>
      <Card variant="glass" className="p-3 text-center">
        <div className="text-lg font-black text-green-400">{stats.debunked}</div>
        <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
          {language === 'de' ? 'Widerlegt' : 'Debunked'}
        </div>
      </Card>
      <Card variant="glass" className="p-3 text-center">
        <div className="text-lg font-black text-accent-cyan">{stats.avgScore}</div>
        <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
          {language === 'de' ? 'Ø Score' : 'Avg Score'}
        </div>
      </Card>
    </div>
  );
};

// --- 4. Main Component ---

export const MyAnalyses: React.FC = () => {
  const logic = useAnalysesLogic();

  return (
    <AnalysesContext.Provider value={logic}>
      <PageFrame>
        <PageHeader
            icon={BarChart3}
          title={logic.language === 'de' ? 'Meine Analysen' : 'My Analyses'}
          subtitle={logic.language === 'de' ? 'Gespeicherte Faktenchecks und Analysen' : 'Saved fact-checks and analyses'}
            actions={
            <Button variant="primary" size="sm" onClick={() => logic.navigate('/factcheck')} icon={<ShieldCheck size={14} />}>
              {logic.language === 'de' ? 'Neuer Check' : 'New Check'}
            </Button>
          }
        />

        <StatsBar />
        <Toolbar />
        <AnalysesList />
      </PageFrame>
    </AnalysesContext.Provider>
  );
};
