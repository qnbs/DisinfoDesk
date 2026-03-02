import React, { useState, useMemo, useEffect, createContext, useContext, useCallback } from 'react';
import { Theory, Category, CategoryEn, DangerLevel, DangerLevelEn, SortOption } from '../types';
import { 
  Search, Filter, AlertTriangle, Cloud, Heart, X, 
  ArrowUpDown, ShieldAlert, Check, LayoutGrid, List, 
  Table as TableIcon, SlidersHorizontal, ChevronDown, ChevronUp,
  Hash, Eye, RefreshCw, ArrowDownCircle, Loader2,
  Database, Activity, Zap, Terminal, FileText, ChevronRight,
  TrendingUp, Globe, Lock
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, Button, Badge, PageFrame, PageHeader, EmptyState, Skeleton } from './ui/Common';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
    setSearch, toggleCategory, toggleDanger, setTag, setSort, toggleFavorite, resetFilters,
    selectFilteredTheories, selectTagStats
} from '../store/slices/theoriesSlice';
import { useNavigate, useSearchParams } from 'react-router-dom';

type ViewMode = 'GRID' | 'LIST' | 'COMPACT';

// --- 0. Helper Components ---

const TheoryImage: React.FC<{ src: string; alt: string; className?: string }> = React.memo(({ src, alt, className = "" }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {!isLoaded && <Skeleton className="absolute inset-0 w-full h-full z-10 bg-slate-800 animate-pulse" />}
            <img 
                src={src} 
                alt={alt}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
            />
            {/* Holographic Scanline Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
        </div>
    );
});

// --- 1. Logic Hook ---

const useTheoryListLogic = () => {
  const dispatch = useAppDispatch();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Local State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('GRID');
  const [visibleCount, setVisibleCount] = useState(12);
  const [localSearch, setLocalSearch] = useState('');

  // Redux State
  const processedTheories = useAppSelector(selectFilteredTheories);
  const totalCount = processedTheories.length;
  const reduxSearchTerm = useAppSelector(state => state.theories.filterSearch);
  const sortOption = useAppSelector(state => state.theories.sortOption);
  const selectedCategories = useAppSelector(state => state.theories.filterCategories);
  const selectedDanger = useAppSelector(state => state.theories.filterDanger);
  const selectedTag = useAppSelector(state => state.theories.filterTag);
  const favorites = useAppSelector(state => state.theories.favorites);
  const tagData = useAppSelector(selectTagStats);

  // Statistics Calculation
  const stats = useMemo(() => {
      const avgViral = Math.round(processedTheories.reduce((acc, t) => acc + t.popularity, 0) / (totalCount || 1));
      const criticalCount = processedTheories.filter(t => t.dangerLevel.includes('High') || t.dangerLevel.includes('Extreme')).length;
      return { avgViral, criticalCount };
  }, [processedTheories, totalCount]);

  // Init from URL
  useEffect(() => {
      const filter = searchParams.get('filter');
      const sort = searchParams.get('sort');
      if (filter === 'CRITICAL') setIsFilterOpen(true);
      else if (filter) { dispatch(setTag(filter)); setIsFilterOpen(true); }
      if (sort) dispatch(setSort(sort as SortOption));
      setLocalSearch(reduxSearchTerm);
  }, [searchParams, dispatch]);

  // Debounce Search
  useEffect(() => {
      const handler = setTimeout(() => {
          if (localSearch !== reduxSearchTerm) dispatch(setSearch(localSearch));
      }, 300);
      return () => clearTimeout(handler);
  }, [localSearch, reduxSearchTerm, dispatch]);

  // Reset pagination
  useEffect(() => { setVisibleCount(12); }, [reduxSearchTerm, selectedCategories, selectedDanger, selectedTag, sortOption]);

  const onSelect = (theory: Theory) => navigate(`/archive/${theory.id}`);
  const handleLoadMore = () => setVisibleCount(prev => Math.min(prev + 12, totalCount));
  const visibleTheories = useMemo(() => processedTheories.slice(0, visibleCount), [processedTheories, visibleCount]);

  return {
    t, language, isFilterOpen, setIsFilterOpen, viewMode, setViewMode,
    visibleTheories, totalCount, hasMore: visibleCount < totalCount, handleLoadMore,
    localSearch, setLocalSearch, sortOption, selectedCategories, selectedDanger, selectedTag,
    favorites, tagData, stats, onSelect,
    handleToggleFavorite: (id: string) => dispatch(toggleFavorite(id)),
    handleResetFilters: () => { setLocalSearch(''); dispatch(resetFilters()); },
    handleSetSort: (val: SortOption) => dispatch(setSort(val)),
    handleToggleCategory: (cat: string) => dispatch(toggleCategory(cat)),
    handleToggleDanger: (lvl: string) => dispatch(toggleDanger(lvl)),
    handleSetTag: (tag: string | null) => dispatch(setTag(tag))
  };
};

type TheoryListContextType = ReturnType<typeof useTheoryListLogic>;
const TheoryListContext = createContext<TheoryListContextType | undefined>(undefined);
const useTheoryList = () => {
  const context = useContext(TheoryListContext);
  if (!context) throw new Error('useTheoryList must be used within a TheoryListProvider');
  return context;
};

// --- 2. Components ---

const DataTelemetryRibbon: React.FC = React.memo(() => {
    const { totalCount, stats, t } = useTheoryList();
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg flex items-center justify-between shadow-inner">
                <div className="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-wider">{t.list.telemetry.totalRecords}</div>
                <div className="text-xl font-display font-bold text-white flex items-center gap-2">
                    <Database size={14} className="text-accent-cyan" /> {totalCount}
                </div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg flex items-center justify-between shadow-inner">
                <div className="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-wider">{t.list.telemetry.avgVirality}</div>
                <div className="text-xl font-display font-bold text-white flex items-center gap-2">
                    <Activity size={14} className="text-accent-purple" /> {stats.avgViral}%
                </div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg flex items-center justify-between shadow-inner">
                <div className="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-wider">{t.list.telemetry.activeThreats}</div>
                <div className="text-xl font-display font-bold text-white flex items-center gap-2">
                    <ShieldAlert size={14} className={stats.criticalCount > 0 ? "text-red-500 animate-pulse" : "text-green-500"} /> {stats.criticalCount}
                </div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg flex items-center justify-between shadow-inner">
                <div className="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-wider">{t.list.telemetry.systemStatus}</div>
                <div className="text-xs font-mono font-bold text-accent-cyan animate-pulse">
                    {t.list.telemetry.online}
                </div>
            </div>
        </div>
    );
});

const ArchiveGridCard: React.FC<{ theory: Theory, index: number }> = React.memo(({ theory, index }) => {
    const { onSelect, handleToggleFavorite, favorites, t } = useTheoryList();
  const isFav = favorites.includes(theory.id);
  const isDanger = theory.dangerLevel.includes('High') || theory.dangerLevel.includes('Extreme');

  return (
    <div 
      onClick={() => onSelect(theory)}
      className="group relative h-[340px] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:border-accent-cyan/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-300 animate-fade-in-up active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
      style={{ animationDelay: `${index * 50}ms` }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(theory)}
    >
      {/* Dynamic Border Glow */}
      <div className="absolute inset-0 bg-accent-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-0"></div>
      
      {/* Image Section */}
      <div className="h-[160px] relative overflow-hidden bg-black">
        <TheoryImage src={theory.imageUrl || ''} alt={theory.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700" />
        
        {/* Holographic Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-black/80 to-transparent opacity-50"></div>
        
        {/* Floating Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
           <Badge label={theory.category.split(' ')[0]} className="bg-slate-950/90 text-white border-slate-700 backdrop-blur-md shadow-lg" />
           {theory.isUserCreated && <Badge label={t.list.localBadge} className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50" />}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); handleToggleFavorite(theory.id); }}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-white text-white hover:text-red-600 transition-colors backdrop-blur-md border border-white/10 z-20 group/btn focus-visible:ring-2 focus-visible:ring-white outline-none"
          aria-label={isFav ? t.list.favorites.remove : t.list.favorites.add}
        >
          <Heart size={14} className={isFav ? "fill-red-600 text-red-600" : ""} />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col h-[180px] relative z-10 bg-slate-900/95 backdrop-blur-sm">
        {/* Header Line */}
        <div className="flex justify-between items-center mb-2">
           <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
              <Globe size={10} /> {theory.originYear}
           </span>
           <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${isDanger ? 'text-red-400 border-red-900/50 bg-red-950/30' : 'text-green-400 border-green-900/50 bg-green-950/30'}`}>
              {theory.dangerLevel.split(' ')[0]}
           </span>
        </div>

        {/* Title & Desc - Improved Line Height & Padding for Descenders */}
        <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 leading-normal py-0.5 group-hover:text-accent-cyan transition-colors font-display tracking-wide uppercase">
          {theory.title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 mb-auto leading-relaxed">
          {theory.shortDescription}
        </p>
        
        {/* Footer Metrics */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="flex flex-col gap-0.5 w-full mr-4">
                <div className="flex justify-between text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                    <span>{t.list.viralLoad}</span>
                    <span className="text-accent-purple">{theory.popularity}%</span>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-accent-purple to-accent-cyan" style={{ width: `${theory.popularity}%` }}></div>
                </div>
            </div>
            <div className="p-1.5 rounded-lg border border-slate-700 text-slate-500 group-hover:text-white group-hover:bg-slate-800 transition-colors">
                <ChevronRight size={14} />
            </div>
        </div>
      </div>
    </div>
  );
});

const ArchiveListRow: React.FC<{ theory: Theory, index: number }> = React.memo(({ theory, index }) => {
    const { onSelect, favorites, t } = useTheoryList();
  return (
    <div 
      onClick={() => onSelect(theory)}
      className="group flex flex-col md:flex-row items-center gap-4 p-4 bg-slate-950/50 border border-slate-800 hover:border-slate-600 rounded-lg cursor-pointer transition-all active:bg-slate-900 animate-fade-in-up outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
      style={{ animationDelay: `${index * 30}ms` }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(theory)}
    >
      <div className="w-full md:w-32 h-32 md:h-20 rounded-md overflow-hidden flex-shrink-0 bg-black relative border border-slate-800">
         <TheoryImage src={theory.imageUrl || ''} alt={theory.title} className="w-full h-full opacity-80 group-hover:opacity-100 transition-all duration-500" />
         <div className="absolute inset-0 bg-accent-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      
      <div className="flex-1 min-w-0 w-full grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
         <div className="md:col-span-6">
            <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-white text-base truncate group-hover:text-accent-cyan transition-colors font-display uppercase tracking-wide py-1 leading-normal">
                    {theory.title}
                </h3>
                {favorites.includes(theory.id) && <Heart size={12} className="fill-red-500 text-red-500 animate-pulse" />}
            </div>
            <p className="text-xs text-slate-400 line-clamp-1">{theory.shortDescription}</p>
         </div>
         
         <div className="md:col-span-2 flex flex-col md:items-start">
            <span className="text-[9px] text-slate-600 uppercase font-mono font-bold tracking-wider">{t.list.labels.category}</span>
            <span className="text-xs text-slate-300 truncate w-full bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{theory.category.split(' ')[0]}</span>
         </div>
         
         <div className="md:col-span-2 flex flex-col md:items-start">
            <span className="text-[9px] text-slate-600 uppercase font-mono font-bold tracking-wider">{t.list.labels.origin}</span>
            <span className="text-xs text-slate-300 font-mono">{theory.originYear}</span>
         </div>

         <div className="md:col-span-2 flex flex-col md:items-end">
            <span className="text-[9px] text-slate-600 uppercase font-mono font-bold tracking-wider">{t.list.labels.virality}</span>
            <div className="flex items-center gap-2">
                <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-purple" style={{ width: `${theory.popularity}%` }}></div>
                </div>
                <span className="text-xs text-accent-purple font-mono font-bold">{theory.popularity}%</span>
            </div>
         </div>
      </div>
    </div>
  );
});

const ArchiveTerminalRow: React.FC<{ theory: Theory, index: number }> = React.memo(({ theory, index }) => {
    const { onSelect, t } = useTheoryList();
  const isDanger = theory.dangerLevel.includes('High') || theory.dangerLevel.includes('Extreme');
  
  return (
    <div 
      onClick={() => onSelect(theory)}
      className="grid grid-cols-12 gap-2 p-2 border-b border-slate-800/50 hover:bg-accent-cyan/5 cursor-pointer text-[11px] items-center font-mono animate-fade-in group outline-none focus-visible:bg-slate-900 focus-visible:text-white"
      style={{ animationDelay: `${index * 10}ms` }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(theory)}
    >
       <div className="col-span-2 md:col-span-1 text-slate-600">#{theory.id.substring(0,6).toUpperCase()}</div>
       <div className="col-span-6 md:col-span-5 font-bold text-slate-300 truncate group-hover:text-accent-cyan transition-colors uppercase py-1 leading-normal">{theory.title}</div>
       <div className="col-span-4 md:col-span-2 text-slate-500 truncate">{theory.category.split(' ')[0]}</div>
       <div className="col-span-3 md:col-span-2 text-right md:text-left">
           <span className={`${isDanger ? 'text-red-500' : 'text-green-500'}`}>{isDanger ? t.list.status.critical : t.list.status.stable}</span>
       </div>
       <div className="hidden md:block col-span-2 text-right text-slate-500">
          [{Array.from({length: Math.ceil(theory.popularity/10)}).map(() => '|').join('')}]
       </div>
    </div>
  );
});

const FilterHUD: React.FC = React.memo(() => {
  const { 
      isFilterOpen, setIsFilterOpen, language, t, 
      selectedCategories, handleToggleCategory, 
      selectedDanger, handleToggleDanger, 
      selectedTag, handleSetTag, tagData, handleResetFilters
  } = useTheoryList();

  const categories = language === 'de' ? Object.values(Category) : Object.values(CategoryEn);
  const dangerLevels = language === 'de' ? Object.values(DangerLevel) : Object.values(DangerLevelEn);

  if (!isFilterOpen) return null;

  return (
    <div className="bg-[#0B0F19] border-y border-slate-800 mb-6 animate-fade-in relative overflow-hidden shadow-2xl">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-5 pointer-events-none"></div>
      
      <div className="p-6 md:p-8 relative z-10">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-accent-cyan uppercase tracking-widest flex items-center gap-2">
                  <SlidersHorizontal size={16} /> {t.list.filterHud.parameterConfiguration}
              </h3>
              <button onClick={handleResetFilters} className="text-[10px] flex items-center gap-1 text-red-400 hover:text-red-300 uppercase tracking-wider font-bold">
                  <RefreshCw size={10} /> {t.list.filterHud.resetAll}
              </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Column 1: Category Vector */}
            <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                    <Database size={10} /> {t.list.filterHud.sectorAnalysis}
                </h4>
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => handleToggleCategory(cat)}
                            className={`
                                px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide rounded-md border transition-all
                                ${selectedCategories.includes(cat)
                                    ? 'bg-accent-purple/20 border-accent-purple text-accent-purple shadow-[0_0_10px_rgba(139,92,246,0.2)]'
                                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'}
                            `}
                        >
                            {cat.split(' ')[0]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Column 2: Threat Matrix */}
            <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                    <ShieldAlert size={10} /> {t.list.filterHud.threatMatrix}
                </h4>
                <div className="flex flex-col gap-2">
                    {dangerLevels.map(lvl => {
                        const isSelected = selectedDanger.includes(lvl);
                        let colorClass = 'hover:border-slate-600 text-slate-400';
                        if(lvl.includes('High') || lvl.includes('Extrem')) colorClass = isSelected ? 'text-red-400 border-red-500 bg-red-950/30' : 'text-slate-500 hover:text-red-400';
                        else colorClass = isSelected ? 'text-green-400 border-green-500 bg-green-950/30' : 'text-slate-500 hover:text-green-400';

                        return (
                            <button
                                key={lvl}
                                onClick={() => handleToggleDanger(lvl)}
                                className={`
                                    w-full flex items-center justify-between px-4 py-2 rounded-md border text-xs font-mono transition-all
                                    ${isSelected ? 'border-opacity-100 bg-opacity-20' : 'bg-slate-900 border-slate-800'}
                                    ${colorClass}
                                `}
                            >
                                <span className="uppercase font-bold">{lvl}</span>
                                {isSelected && <div className={`w-2 h-2 rounded-full ${lvl.includes('High') ? 'bg-red-500' : 'bg-green-500'} shadow-[0_0_5px_currentColor]`}></div>}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Column 3: Semantic Tags */}
            <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                    <Hash size={10} /> {t.list.filterHud.metadataIndex}
                </h4>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar p-2">
                    {tagData.uniqueTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => handleSetTag(selectedTag === tag ? null : tag)}
                            className={`
                                px-2 py-1 text-[9px] font-mono border rounded transition-all
                                ${selectedTag === tag
                                    ? 'bg-accent-cyan text-slate-900 border-accent-cyan font-bold'
                                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-white'}
                            `}
                        >
                            #{tag}
                        </button>
                    ))}
                </div>
            </div>
          </div>
      </div>
      
      {/* Close Handle */}
      <div 
        onClick={() => setIsFilterOpen(false)}
        className="h-4 bg-slate-900 border-t border-slate-800 flex items-center justify-center cursor-pointer hover:bg-slate-800 transition-colors"
        role="button"
                aria-label={t.list.closeFilter}
      >
          <ChevronUp size={12} className="text-slate-500" />
      </div>
    </div>
  );
});

const HeaderSection: React.FC = React.memo(() => {
    const { t, localSearch, setLocalSearch, isFilterOpen, setIsFilterOpen, viewMode, setViewMode, sortOption, handleSetSort } = useTheoryList();

    return (
        <div className="mb-6">
            <PageHeader 
                title={t.list.title}
                subtitle={t.list.secureAccessSubtitle}
                icon={Cloud}
                visualizerState="BUSY"
            >
                <div className="flex flex-col gap-4 mt-2">
                    <div className="flex flex-col md:flex-row gap-4 items-stretch">
                        {/* Search Input */}
                        <div className="relative flex-1 group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="text-slate-500 group-focus-within:text-accent-cyan transition-colors" size={18} />
                            </div>
                            <input 
                                type="text" 
                                placeholder={t.list.searchPlaceholder}
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                                className="block w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all font-mono tracking-wide shadow-inner"
                            />
                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                                <button 
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className={`p-2 rounded-md transition-all ${isFilterOpen ? 'text-accent-cyan bg-accent-cyan/10' : 'text-slate-500 hover:text-white'}`}
                                    aria-label={t.list.toggleFilters}
                                >
                                    {isFilterOpen ? <ChevronUp size={18} /> : <SlidersHorizontal size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-2 shrink-0">
                            {/* View Switcher */}
                            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-700">
                                {(['GRID', 'LIST', 'COMPACT'] as const).map(mode => (
                                    <button
                                        key={mode}
                                        onClick={() => setViewMode(mode)}
                                        className={`p-2 rounded-md transition-all ${viewMode === mode ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                                        title={mode === 'GRID' ? t.list.view.grid : mode === 'LIST' ? t.list.view.list : t.list.view.compact}
                                        aria-label={`${t.list.viewModePrefix}: ${mode === 'GRID' ? t.list.view.grid : mode === 'LIST' ? t.list.view.list : t.list.view.compact}`}
                                    >
                                        {mode === 'GRID' && <LayoutGrid size={16} />}
                                        {mode === 'LIST' && <List size={16} />}
                                        {mode === 'COMPACT' && <TableIcon size={16} />}
                                    </button>
                                ))}
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative min-w-[140px]">
                                <select 
                                    value={sortOption}
                                    onChange={(e) => handleSetSort(e.target.value as SortOption)}
                                    className="w-full h-full appearance-none bg-slate-950/50 border border-slate-700 text-slate-400 pl-3 pr-8 rounded-lg text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-accent-cyan cursor-pointer hover:bg-slate-900 transition-colors"
                                >
                                    <option value="POPULARITY_DESC">{t.list.sort.viralHigh}</option>
                                    <option value="POPULARITY_ASC">{t.list.sort.viralLow}</option>
                                    <option value="YEAR_DESC">{t.list.sort.newest}</option>
                                    <option value="YEAR_ASC">{t.list.sort.oldest}</option>
                                    <option value="TITLE_ASC">{t.list.sort.az}</option>
                                </select>
                                <ArrowUpDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </PageHeader>
            <FilterHUD />
            <DataTelemetryRibbon />
        </div>
    );
});

// --- 3. Main List Renderer ---

const TheoryListContent: React.FC = () => {
    const { visibleTheories, viewMode, t, handleResetFilters, hasMore, handleLoadMore } = useTheoryList();

    if (visibleTheories.length === 0) {
        return (
            <div className="py-20">
                <EmptyState 
                    title={t.list.databaseQueryNull}
                    description={t.list.noResultsSub}
                    icon={Database}
                    action={<Button variant="secondary" onClick={handleResetFilters} icon={<RefreshCw size={14}/>}>{t.list.resetQueryParameters}</Button>}
                />
            </div>
        );
    }

    return (
        <div className="pb-20 min-h-[500px]">
            {viewMode === 'GRID' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {visibleTheories.map((t, i) => <ArchiveGridCard key={t.id} theory={t} index={i} />)}
                </div>
            )}
            
            {viewMode === 'LIST' && (
                <div className="space-y-4">
                    {visibleTheories.map((t, i) => <ArchiveListRow key={t.id} theory={t} index={i} />)}
                </div>
            )}

            {viewMode === 'COMPACT' && (
                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950 shadow-2xl">
                    <div className="grid grid-cols-12 gap-2 p-3 bg-slate-900 border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                        <div className="col-span-2 md:col-span-1">{t.list.compact.id}</div>
                        <div className="col-span-6 md:col-span-5">{t.list.compact.subject}</div>
                        <div className="col-span-4 md:col-span-2">{t.list.compact.class}</div>
                        <div className="col-span-3 md:col-span-2 text-right md:text-left">{t.list.compact.status}</div>
                        <div className="hidden md:block col-span-2 text-right">{t.list.compact.integrity}</div>
                    </div>
                    <div className="divide-y divide-slate-800/50">
                        {visibleTheories.map((t, i) => <ArchiveTerminalRow key={t.id} theory={t} index={i} />)}
                    </div>
                </div>
            )}

            {hasMore && (
                <div className="flex justify-center mt-12">
                    <Button 
                        variant="secondary" 
                        onClick={handleLoadMore} 
                        className="w-full md:w-auto min-w-[200px] py-4 border-slate-700 hover:border-accent-cyan bg-slate-900"
                        icon={<ArrowDownCircle size={16} />}
                    >
                        {t.list.loadAdditionalRecords}
                    </Button>
                </div>
            )}
        </div>
    );
};

// --- 4. Main Export ---

export const TheoryList: React.FC = () => {
  return (
      <TheoryListContext.Provider value={useTheoryListLogic()}>
        <PageFrame>
           <HeaderSection />
           <TheoryListContent />
        </PageFrame>
      </TheoryListContext.Provider>
  );
};

export default TheoryList;