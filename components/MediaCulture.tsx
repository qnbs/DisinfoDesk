
import React, { useState, useMemo, useCallback, createContext, useContext } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { MEDIA_ITEMS } from '../constants';
import { MediaItem, MediaType } from '../types';
import { 
  Film, Book, Gamepad2, Tv, LayoutGrid, 
  Search, ExternalLink, Zap, BarChart2,
  PieChart, Activity, Sliders, 
  X, Clapperboard, FilterX
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

    const filteredMedia = useMemo(() => {
        return MEDIA_ITEMS.filter(item => {
            const matchesType = filter === 'ALL' || item.type === filter;
            const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  (language === 'de' ? item.descriptionDe : item.descriptionEn).toLowerCase().includes(searchTerm.toLowerCase());
            return matchesType && matchesSearch;
        });
    }, [filter, searchTerm, language]);

    const handleClearFilters = useCallback(() => {
        setFilter('ALL');
        setSearchTerm('');
    }, []);

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
        className={`
            flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border
            ${active 
                ? 'bg-white text-slate-900 border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] transform scale-105' 
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200'}
        `}
    >
        {icon}
        {label}
    </button>
);

const MediaGridCard: React.FC<{ item: MediaItem, onTagClick: (tag: string) => void, onOpen: () => void }> = React.memo(({ item, onTagClick, onOpen }) => {
    const { language } = useMediaCulture();
    return (
        <div 
            onClick={onOpen}
            className="group relative h-[380px] perspective-1000 cursor-pointer"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 rounded-xl border border-slate-800 overflow-hidden transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] group-hover:-translate-y-2 group-hover:rotate-x-2">
                <div className="h-1/2 p-6 flex flex-col justify-between relative bg-slate-900/50">
                     <div className="absolute inset-0 bg-slate-900/80 group-hover:bg-slate-900/40 transition-colors duration-500"></div>
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <MediaTypeIcon type={item.type} />
                     </div>
                     <div className="relative z-10 flex justify-between items-start">
                        <Badge label={item.type} className="bg-slate-950/50 text-slate-400 border-slate-800" />
                        <span className="font-mono text-xs text-slate-500">{item.year}</span>
                     </div>
                     <div className="relative z-10">
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-accent-cyan transition-colors leading-tight">{item.title}</h3>
                        <div className="text-xs text-slate-500 font-mono truncate">{item.creator}</div>
                     </div>
                </div>
                <div className="h-1 w-full flex">
                    <div className="h-full bg-red-500 opacity-50" style={{ width: '20%' }}></div>
                    <div className="h-full bg-blue-500 opacity-50" style={{ width: '30%' }}></div>
                    <div className="h-full bg-green-500 opacity-50" style={{ width: '10%' }}></div>
                    <div className="h-full bg-yellow-500 opacity-50" style={{ width: '40%' }}></div>
                </div>
                <div className="h-1/2 p-6 flex flex-col bg-slate-950">
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4 flex-1 group-hover:text-slate-300 transition-colors">
                        {language === 'de' ? item.descriptionDe : item.descriptionEn}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                        {item.relatedTheoryTags.slice(0, 3).map(tag => (
                            <button
                                key={tag}
                                onClick={(e) => { e.stopPropagation(); onTagClick(tag); }}
                                className="text-[9px] flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-accent-cyan border border-slate-800 hover:border-accent-cyan/30 px-2 py-1 rounded transition-colors uppercase font-bold tracking-wider"
                            >
                                <ExternalLink size={8} />
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="absolute inset-0 bg-slate-900/95 p-6 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                    <div className="text-center mb-6">
                        <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">Reality Index</div>
                        <div className="text-5xl font-black text-white mb-2">{item.realityScore}</div>
                        <div className="w-16 h-1 bg-accent-cyan mx-auto rounded-full"></div>
                    </div>
                    <div className="w-full space-y-3 mb-6">
                        <div className="flex justify-between text-xs font-mono text-slate-400">
                            <span>Complexity</span>
                            <span className={`font-bold text-${getComplexityColor(item.complexity)}-400`}>{item.complexity}</span>
                        </div>
                    </div>
                    <Button variant="primary" size="sm" onClick={onOpen} className="w-full">
                        Access File
                    </Button>
                </div>
            </div>
        </div>
    );
});

const MediaAnalytics: React.FC = () => {
    const { filteredMedia } = useMediaCulture();
    
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
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
    );
};

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
                        className={`p-2 rounded transition-colors ${viewMode === 'GRID' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <LayoutGrid size={16} />
                    </button>
                    <button 
                        onClick={() => setViewMode('ANALYTICS')}
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
                        placeholder="Search movies, books, games..." 
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
                        <Sliders size={12} /> Filter:
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
                            <FilterX size={12} /> Clear
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
    const { viewMode, filteredMedia, onNavigateToArchive, onNavigateToDetail } = useMediaCulture();

    if (filteredMedia.length === 0) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <EmptyState 
                    title="ARCHIVE EMPTY" 
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredMedia.map(item => (
                <MediaGridCard 
                    key={item.id} 
                    item={item} 
                    onTagClick={onNavigateToArchive} 
                    onOpen={() => onNavigateToDetail(item.id)} 
                />
            ))}
        </div>
    );
};

export default MediaCulture;
