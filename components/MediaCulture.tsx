
import React, { useState, useMemo, useCallback, createContext, useContext, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { MEDIA_ITEMS } from '../constants';
import { MediaItem, MediaType } from '../types';
import { 
  Film, Book, Gamepad2, Tv, LayoutGrid, 
  Search, ExternalLink, Zap, BarChart2,
  PieChart, Activity, Sliders, 
  X, Clapperboard, FilterX, Star, Trophy, Clock, ArrowDownCircle,
  Play
} from 'lucide-react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, 
  Tooltip, ResponsiveContainer, Cell, 
  BarChart, Bar, CartesianGrid
} from 'recharts';
import { Card, Button, Badge, PageFrame, PageHeader, EmptyState } from './ui/Common';
import { useNavigate } from 'react-router-dom';

// --- 1. Logic Hook ---

const useMediaCultureLogic = () => {
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<'GRID' | 'ANALYTICS'>('GRID');
    const [filter, setFilter] = useState<MediaType | 'ALL'>('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    
    // Pagination
    const [visibleCount, setVisibleCount] = useState(12);

    // Debounce Effect
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Reset pagination on filter change
    useEffect(() => {
        setVisibleCount(12);
    }, [filter, debouncedSearch]);

    const filteredMedia = useMemo(() => {
        return MEDIA_ITEMS.filter(item => {
            const matchesType = filter === 'ALL' || item.type === filter;
            const matchesSearch = item.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                                  (language === 'de' ? item.descriptionDe : item.descriptionEn).toLowerCase().includes(debouncedSearch.toLowerCase());
            return matchesType && matchesSearch;
        });
    }, [filter, debouncedSearch, language]);

    const displayedMedia = useMemo(() => {
        return filteredMedia.slice(0, visibleCount);
    }, [filteredMedia, visibleCount]);

    const spotlightItem = useMemo(() => {
        if (filteredMedia.length === 0) return null;
        // Deterministic pseudo-random based on length to prevent jitter on re-renders, but changes on filter
        const index = filteredMedia.length % filteredMedia.length; 
        return filteredMedia[index];
    }, [filteredMedia]);

    const stats = useMemo(() => {
        if (filteredMedia.length === 0) return null;
        const total = filteredMedia.length;
        const avgReality = Math.round(filteredMedia.reduce((acc, i) => acc + i.realityScore, 0) / total);
        
        // Find most common complexity
        const complexityCounts: Record<string, number> = {};
        filteredMedia.forEach(i => { complexityCounts[i.complexity] = (complexityCounts[i.complexity] || 0) + 1; });
        const topComplexity = Object.entries(complexityCounts).sort((a,b) => b[1] - a[1])[0][0];

        return { total, avgReality, topComplexity };
    }, [filteredMedia]);

    const handleClearFilters = useCallback(() => {
        setFilter('ALL');
        setSearchTerm('');
    }, []);

    const handleLoadMore = () => setVisibleCount(prev => prev + 12);

    const filters: { id: MediaType | 'ALL', label: string, icon: React.ReactNode }[] = [
        { id: 'ALL', label: t.mediaPage.filter.all, icon: <LayoutGrid size={14} /> },
        { id: 'MOVIE', label: t.mediaPage.filter.movie, icon: <Film size={14} /> },
        { id: 'SERIES', label: t.mediaPage.filter.series, icon: <Tv size={14} /> },
        { id: 'BOOK', label: t.mediaPage.filter.book, icon: <Book size={14} /> },
        { id: 'GAME', label: t.mediaPage.filter.game, icon: <Gamepad2 size={14} /> },
    ];

    const onNavigateToArchive = (tag: string) => navigate(`/archive?filter=${encodeURIComponent(tag)}`);
    const onNavigateToDetail = (id: string) => navigate(`/media/${id}`);

    return {
        t,
        language,
        viewMode,
        setViewMode,
        filter,
        setFilter,
        searchTerm,
        setSearchTerm,
        filteredMedia,
        displayedMedia,
        spotlightItem,
        stats,
        hasMore: visibleCount < filteredMedia.length,
        handleLoadMore,
        handleClearFilters,
        filters,
        onNavigateToArchive,
        onNavigateToDetail
    };
};

// --- 2. Context & Provider ---

type MediaCultureContextType = ReturnType<typeof useMediaCultureLogic>;
const MediaCultureContext = createContext<MediaCultureContextType | undefined>(undefined);

const useMediaCulture = () => {
  const context = useContext(MediaCultureContext);
  if (!context) throw new Error('useMediaCulture must be used within a MediaCultureProvider');
  return context;
};

const MediaCultureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const logic = useMediaCultureLogic();
  return <MediaCultureContext.Provider value={logic}>{children}</MediaCultureContext.Provider>;
};

// --- 3. Sub-Components ---

const MediaTypeIcon: React.FC<{ type: MediaType }> = ({ type }) => {
    switch(type) {
        case 'MOVIE': return <Film size={16} />;
        case 'BOOK': return <Book size={16} />;
        case 'GAME': return <Gamepad2 size={16} />;
        case 'SERIES': return <Tv size={16} />;
        case 'COMIC': return <LayoutGrid size={16} />;
        default: return <LayoutGrid size={16} />;
    }
};

const getComplexityColor = (c: MediaItem['complexity']) => {
    switch(c) {
        case 'LOW': return 'green';
        case 'MEDIUM': return 'cyan';
        case 'HIGH': return 'orange';
        case 'MINDBENDING': return 'purple';
    }
};

const FilterChip: React.FC<{ label: string, active: boolean, onClick: () => void, icon?: React.ReactNode }> = ({ label, active, onClick, icon }) => (
    <button
        onClick={onClick}
        aria-pressed={active}
        className={`
            flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan
            ${active 
                ? 'bg-white text-slate-900 border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] transform scale-105' 
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200'}
        `}
    >
        {icon}
        {label}
    </button>
);

const SpotlightHero: React.FC = () => {
    const { spotlightItem, language, onNavigateToDetail, t } = useMediaCulture();
    if (!spotlightItem) return null;

    return (
        <div className="relative w-full h-[350px] md:h-[400px] rounded-2xl overflow-hidden mb-12 group border border-slate-800 shadow-2xl animate-fade-in cursor-pointer" onClick={() => onNavigateToDetail(spotlightItem.id)}>
            <div className="absolute inset-0">
                <img src={spotlightItem.imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/60 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-transparent to-transparent"></div>
            </div>

            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur border border-white/10 px-3 py-1 rounded text-[10px] font-mono uppercase tracking-widest text-accent-cyan flex items-center gap-2">
                <Star size={12} className="fill-accent-cyan" /> Featured Selection
            </div>

            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-2/3 lg:w-1/2 z-10">
                <div className="flex items-center gap-3 mb-3 animate-fade-in-up">
                    <Badge label={spotlightItem.type} className="bg-accent-purple/20 text-accent-purple border-accent-purple/30" />
                    <span className="text-slate-300 font-mono text-xs">{spotlightItem.year}</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-none tracking-tight drop-shadow-lg animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    {spotlightItem.title}
                </h2>
                <p className="text-sm text-slate-300 mb-6 line-clamp-3 leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    {language === 'de' ? spotlightItem.descriptionDe : spotlightItem.descriptionEn}
                </p>
                <div className="flex gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <Button variant="primary" icon={<Play size={16} fill="currentColor" />} onClick={() => onNavigateToDetail(spotlightItem.id)}>
                        Analyze File
                    </Button>
                </div>
            </div>
        </div>
    );
};

const MediaGridCard: React.FC<{ item: MediaItem, onTagClick: (tag: string) => void, onOpen: () => void }> = React.memo(({ item, onTagClick, onOpen }) => {
    const { language, t } = useMediaCulture();
    return (
        <div 
            onClick={onOpen}
            className="group relative h-[380px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden flex flex-col"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') onOpen(); }}
        >
            <div className="h-48 relative overflow-hidden shrink-0">
                 {item.imageUrl && (
                    <img src={item.imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                 <div className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur rounded-lg border border-white/10 text-slate-300">
                    <MediaTypeIcon type={item.type} />
                 </div>
                 <div className="absolute bottom-2 left-4 right-4">
                    <h3 className="text-lg font-bold text-white leading-tight drop-shadow-md truncate">{item.title}</h3>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.year} // {item.creator}</div>
                 </div>
            </div>
            
            <div className="flex-1 p-4 flex flex-col relative bg-slate-900">
                <div className="flex justify-between items-center mb-3 text-[10px] font-mono text-slate-500 border-b border-slate-800 pb-2">
                    <span className="flex items-center gap-1"><Activity size={12} className="text-accent-cyan"/> REALITY: {item.realityScore}%</span>
                    <span className={`px-1.5 py-0.5 rounded border ${getComplexityColor(item.complexity)}`}>{item.complexity}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4 flex-1">
                    {language === 'de' ? item.descriptionDe : item.descriptionEn}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                    {item.relatedTheoryTags.slice(0, 2).map(tag => (
                        <button
                            key={tag}
                            onClick={(e) => { e.stopPropagation(); onTagClick(tag); }}
                            className="text-[9px] flex items-center gap-1 bg-slate-800 hover:bg-accent-cyan/10 text-slate-500 hover:text-accent-cyan border border-slate-700 hover:border-accent-cyan/30 px-2 py-1 rounded transition-colors uppercase font-bold tracking-wider"
                        >
                            <ExternalLink size={8} />
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
});

const StatsCard: React.FC<{ label: string, value: string | number, icon: React.ReactNode, color: string }> = ({ label, value, icon, color }) => (
    <Card className="p-4 flex items-center gap-4 bg-slate-900/50 border-slate-800">
        <div className={`p-3 rounded-xl bg-slate-900 border border-slate-800 ${color}`}>
            {icon}
        </div>
        <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{label}</div>
            <div className="text-2xl font-black text-white font-display">{value}</div>
        </div>
    </Card>
);

const MediaAnalytics: React.FC = () => {
    const { filteredMedia, stats } = useMediaCulture();
    
    // Prepare Data
    const scatterData = useMemo(() => filteredMedia.map(m => ({
        x: m.year,
        y: m.realityScore,
        z: m.complexity === 'MINDBENDING' ? 20 : 10,
        title: m.title,
        type: m.type
    })), [filteredMedia]);

    const typeDistribution = useMemo(() => {
        const dist: Record<string, number> = {};
        filteredMedia.forEach(m => dist[m.type] = (dist[m.type] || 0) + 1);
        return Object.entries(dist).map(([name, value]) => ({ name, value }));
    }, [filteredMedia]);

    return (
        <div className="animate-fade-in space-y-6">
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatsCard label="Items Indexed" value={stats.total} icon={<DatabaseIcon size={20} />} color="text-slate-300" />
                    <StatsCard label="Avg Reality" value={`${stats.avgReality}%`} icon={<Activity size={20} />} color="text-accent-cyan" />
                    <StatsCard label="Top Complexity" value={stats.topComplexity} icon={<BrainIcon size={20} />} color="text-accent-purple" />
                    <StatsCard label="Avg Year" value={Math.round(filteredMedia.reduce((acc, i) => acc + i.year, 0) / stats.total) || '-'} icon={<Clock size={20} />} color="text-yellow-500" />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="min-h-[400px] flex flex-col">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        <Activity size={16} className="text-accent-cyan" /> Fiction vs. Reality Index
                    </h3>
                    <div className="flex-1 w-full" style={{ minHeight: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%" debounce={200} minWidth={0}>
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis type="number" dataKey="x" name="Year" domain={['auto', 'auto']} stroke="#64748b" tick={{fontSize: 10}} />
                                <YAxis type="number" dataKey="y" name="Reality Score" unit="%" stroke="#64748b" tick={{fontSize: 10}} />
                                <ZAxis type="number" dataKey="z" range={[50, 400]} />
                                <Tooltip 
                                    cursor={{ strokeDasharray: '3 3' }}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px' }}
                                />
                                <Scatter name="Media" data={scatterData} fill="#8884d8">
                                    {scatterData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.type === 'MOVIE' ? '#06b6d4' : entry.type === 'BOOK' ? '#8b5cf6' : '#ef4444'} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="min-h-[400px] flex flex-col">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        <PieChart size={16} className="text-accent-purple" /> Media Distribution
                    </h3>
                    <div className="flex-1 w-full" style={{ minHeight: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%" debounce={200} minWidth={0}>
                            <BarChart data={typeDistribution}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 10}} />
                                <YAxis stroke="#64748b" tick={{fontSize: 10}} />
                                <Tooltip 
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px' }}
                                />
                                <Bar dataKey="value" fill="#8b5cf6" barSize={40} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};

// Icons for stats (Helper)
const DatabaseIcon = ({ size }: { size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s 9-1.34 9-3V5"></path></svg>;
const BrainIcon = ({ size }: { size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path></svg>;

const MediaHeader: React.FC = () => {
    const { t, filters, filter, setFilter, searchTerm, setSearchTerm, handleClearFilters, viewMode, setViewMode } = useMediaCulture();

    return (
        <PageHeader 
            title={t.mediaPage.title}
            subtitle="POP CULTURE ARCHIVE"
            icon={Clapperboard}
            actions={
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button 
                        onClick={() => setViewMode('GRID')}
                        aria-pressed={viewMode === 'GRID'}
                        className={`p-2 rounded transition-colors ${viewMode === 'GRID' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <LayoutGrid size={16} />
                    </button>
                    <button 
                        onClick={() => setViewMode('ANALYTICS')}
                        aria-pressed={viewMode === 'ANALYTICS'}
                        className={`p-2 rounded transition-colors ${viewMode === 'ANALYTICS' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <BarChart2 size={16} />
                    </button>
                </div>
            }
        >
            <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div className="relative w-full max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input 
                        type="text" 
                        placeholder={t.authors.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 text-white pl-12 pr-10 py-3 rounded-xl focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all text-sm font-mono shadow-inner"
                    />
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                    <div className="mr-2 text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <Sliders size={12} /> {t.common.filter}:
                    </div>
                    {filters.map(f => (
                        <FilterChip 
                            key={f.id} 
                            label={f.label} 
                            icon={f.icon} 
                            active={filter === f.id} 
                            onClick={() => setFilter(f.id as MediaType | 'ALL')} 
                        />
                    ))}
                    {(filter !== 'ALL' || searchTerm) && (
                        <button 
                            onClick={handleClearFilters}
                            className="ml-auto text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-bold uppercase tracking-wide px-3 py-2 hover:bg-red-950/30 rounded transition-colors"
                        >
                            <FilterX size={12} /> {t.common.clear}
                        </button>
                    )}
                </div>
            </div>
        </PageHeader>
    );
};

// --- 4. Main Component ---

export const MediaCulture: React.FC = () => {
  return (
      <MediaCultureProvider>
        <PageFrame>
            <MediaHeader />
            <ContentSwitcher />
        </PageFrame>
      </MediaCultureProvider>
  );
};

const ContentSwitcher: React.FC = () => {
    const { viewMode, filteredMedia, displayedMedia, onNavigateToArchive, onNavigateToDetail, t, hasMore, handleLoadMore, filter, searchTerm } = useMediaCulture();

    if (filteredMedia.length === 0) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <EmptyState 
                    title={t.list.noResults}
                    description="No media records found matching your query." 
                    icon={Search} 
                />
            </div>
        );
    }

    if (viewMode === 'ANALYTICS') {
        return <MediaAnalytics />;
    }

    return (
        <div className="animate-fade-in pb-12">
            {/* Show Spotlight only if no search filters active */}
            {filter === 'ALL' && !searchTerm && <SpotlightHero />}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedMedia.map(item => (
                    <MediaGridCard 
                        key={item.id} 
                        item={item} 
                        onTagClick={onNavigateToArchive} 
                        onOpen={() => onNavigateToDetail(item.id)} 
                    />
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center mt-12">
                    <Button 
                        variant="secondary" 
                        onClick={handleLoadMore} 
                        className="w-full md:w-auto min-w-[200px] py-4 border-slate-700 hover:border-accent-cyan"
                        icon={<ArrowDownCircle size={16} />}
                    >
                        Load More Entries
                    </Button>
                </div>
            )}
        </div>
    );
};

export default MediaCulture;
