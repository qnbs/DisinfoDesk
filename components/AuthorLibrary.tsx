import React, { useState, useMemo, createContext, useContext } from 'react';
import { AUTHORS_FULL } from '../data/enriched';
import { Author } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { PageFrame, PageHeader, Card, Badge, EmptyState } from './ui/Common';
import { 
    Feather, Search, Users, LayoutGrid, List, 
    Rocket, GlobeLock, Landmark, Ghost, Hash
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Types ---

type CategoryKey = 'ALL' | 'COSMIC' | 'SYSTEM' | 'HISTORY' | 'ESOTERIC';

const CATEGORY_CONFIG: Record<CategoryKey, { label: string, icon: React.ReactNode, keywords: string[] }> = {
    ALL: { 
        label: 'All Profiles', 
        icon: <Users size={14} />, 
        keywords: [] 
    },
    COSMIC: { 
        label: 'Cosmic & Origins', 
        icon: <Rocket size={14} />, 
        keywords: ['Aliens', 'UFOs', 'Ancient Aliens', 'Space', 'Mars', 'Nibiru', 'Anunnaki', 'Pyramids', 'Archaeology'] 
    },
    SYSTEM: { 
        label: 'System & Control', 
        icon: <GlobeLock size={14} />, 
        keywords: ['NWO', 'Deep State', 'Elite', 'Globalism', 'Politics', 'Media', 'Surveillance', 'Military'] 
    },
    HISTORY: { 
        label: 'History & Finance', 
        icon: <Landmark size={14} />, 
        keywords: ['History', 'Banking', 'Economics', 'Federal Reserve', 'Geopolitics', 'Oil', 'Wall Street'] 
    },
    ESOTERIC: { 
        label: 'Esoteric & Crypto', 
        icon: <Ghost size={14} />, 
        keywords: ['Occult', 'Spirituality', 'Cryptozoology', 'Paranormal', 'Secret Societies', 'Magic', 'Rituals'] 
    }
};

// --- 1. Logic Hook ---

const useAuthorLibraryLogic = () => {
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');
    const [activeCategory, setActiveCategory] = useState<CategoryKey>('ALL');

    const onNavigateToDetail = (id: string) => navigate(`/authors/${id}`);

    // Extract unique focus areas for the bottom index
    const allFocusAreas = useMemo(() => {
        const areas = new Set<string>();
        AUTHORS_FULL.forEach(a => a.focusAreas.forEach(area => areas.add(area)));
        return Array.from(areas).sort();
    }, []);

    // 1. Filter by Search Term first
    const searchFilteredAuthors = useMemo(() => {
        if (!searchTerm) return AUTHORS_FULL;
        const lowerTerm = searchTerm.toLowerCase();
        return AUTHORS_FULL.filter(author => 
            author.name.toLowerCase().includes(lowerTerm) || 
            author.keyWorks.some(work => work.toLowerCase().includes(lowerTerm)) ||
            author.focusAreas.some(area => area.toLowerCase().includes(lowerTerm))
        );
    }, [searchTerm]);

    // 2. Filter by Category
    const displayAuthors = useMemo(() => {
        if (activeCategory === 'ALL') return searchFilteredAuthors;

        const config = CATEGORY_CONFIG[activeCategory];
        return searchFilteredAuthors.filter(author => {
            // Check if author has any tags matching the category keywords
            return author.focusAreas.some(area => 
                config.keywords.some(kw => area.toLowerCase().includes(kw.toLowerCase()))
            );
        });
    }, [activeCategory, searchFilteredAuthors]);

    const handleTagClick = (tag: string) => {
        setSearchTerm(tag);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return {
        t,
        language,
        searchTerm,
        setSearchTerm,
        viewMode,
        setViewMode,
        activeCategory,
        setActiveCategory,
        displayAuthors,
        allFocusAreas,
        onNavigateToDetail,
        handleTagClick
    };
};

// --- 2. Context & Provider ---

type AuthorLibraryContextType = ReturnType<typeof useAuthorLibraryLogic>;
const AuthorLibraryContext = createContext<AuthorLibraryContextType | undefined>(undefined);

const useAuthorLibrary = () => {
    const context = useContext(AuthorLibraryContext);
    if (!context) throw new Error('useAuthorLibrary must be used within a AuthorLibraryProvider');
    return context;
};

const AuthorLibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const logic = useAuthorLibraryLogic();
    return <AuthorLibraryContext.Provider value={logic}>{children}</AuthorLibraryContext.Provider>;
};

// --- 3. Sub-Components ---

const AuthorCard: React.FC<{ author: Author }> = React.memo(({ author }) => {
    const { onNavigateToDetail, language } = useAuthorLibrary();
    return (
        <div 
            onClick={() => onNavigateToDetail(author.id)}
            className="group relative cursor-pointer bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-accent-cyan/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] active:scale-[0.98] h-full flex flex-col"
        >
            {/* Background Art */}
            <div className="absolute inset-0 z-0">
                <img src={author.imageUrl} alt="" className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity grayscale group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/80 to-slate-950"></div>
            </div>
            
            <div className="p-6 flex flex-col h-full relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-700 group-hover:border-accent-cyan transition-colors shadow-lg bg-slate-950">
                        <img src={author.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <Badge label={author.nationality} className="text-[9px] bg-slate-950/80 backdrop-blur-md border-slate-700" />
                </div>

                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-accent-cyan transition-colors line-clamp-1">{author.name}</h3>
                <div className="text-xs text-slate-500 font-mono mb-4 flex items-center gap-2">
                    <span>{author.lifespan}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                    <span className="text-accent-purple">INF: {author.influenceLevel}%</span>
                </div>

                <div className="flex-1 mb-4">
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {language === 'de' ? author.bioDe : author.bioEn}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                    {author.focusAreas.slice(0, 2).map(area => (
                        <span key={area} className="px-2 py-1 rounded bg-slate-950/80 border border-slate-800 text-[10px] text-slate-500 font-mono uppercase tracking-wider group-hover:border-slate-700 transition-colors">
                            {area}
                        </span>
                    ))}
                    {author.focusAreas.length > 2 && (
                        <span className="px-2 py-1 rounded bg-slate-950/30 border border-transparent text-[10px] text-slate-600 font-mono">
                            +{author.focusAreas.length - 2}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
});

const AuthorRow: React.FC<{ author: Author }> = React.memo(({ author }) => {
    const { onNavigateToDetail, language } = useAuthorLibrary();
    return (
        <div 
            onClick={() => onNavigateToDetail(author.id)}
            className="flex items-center gap-4 p-4 bg-slate-900/30 border border-slate-800 rounded-lg hover:bg-slate-800 hover:border-slate-600 cursor-pointer transition-all active:bg-slate-800 group relative overflow-hidden"
        >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity bg-accent-cyan/10"></div>
            <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-700 overflow-hidden shrink-0 group-hover:border-accent-cyan/50 relative z-10">
                <img src={author.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0 relative z-10">
                <h3 className="text-sm font-bold text-white group-hover:text-accent-cyan transition-colors flex items-center gap-2">
                    {author.name}
                    <span className="text-[9px] font-normal text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 hidden sm:inline-block">{author.nationality}</span>
                </h3>
                <div className="text-xs text-slate-500 line-clamp-1">{language === 'de' ? author.bioDe : author.bioEn}</div>
            </div>
            <div className="hidden md:flex flex-wrap gap-2 relative z-10 justify-end w-1/3">
                {author.focusAreas.slice(0, 3).map(area => (
                    <span key={area} className="text-[10px] text-slate-500 font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800">{area}</span>
                ))}
            </div>
        </div>
    );
});

const LibraryHeader: React.FC = () => {
    const { t, searchTerm, setSearchTerm, viewMode, setViewMode, activeCategory, setActiveCategory, displayAuthors } = useAuthorLibrary();
    
    return (
        <PageHeader 
            title={t.authors.title}
            subtitle="ARCHITECTS OF THE UNKNOWN"
            icon={Feather}
            status={`${displayAuthors.length} PROFILES INDEXED`} // Show filtered count
            actions={
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button 
                        onClick={() => setViewMode('GRID')}
                        className={`p-2 rounded transition-colors ${viewMode === 'GRID' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <LayoutGrid size={16} />
                    </button>
                    <button 
                        onClick={() => setViewMode('LIST')}
                        className={`p-2 rounded transition-colors ${viewMode === 'LIST' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <List size={16} />
                    </button>
                </div>
            }
        >
            {/* Search & Category Header */}
            <div className="flex flex-col gap-6">
                <div className="relative w-full max-w-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input 
                        type="text" 
                        placeholder={t.authors.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 text-white pl-12 pr-10 py-4 rounded-xl focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all text-sm font-mono shadow-inner"
                    />
                </div>
                
                {/* Category Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {(Object.entries(CATEGORY_CONFIG) as [CategoryKey, typeof CATEGORY_CONFIG[CategoryKey]][]).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => setActiveCategory(key)}
                            className={`
                                flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border whitespace-nowrap
                                ${activeCategory === key 
                                    ? 'bg-slate-800 text-white border-slate-600 shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                                    : 'bg-slate-900/50 text-slate-500 border-slate-800 hover:border-slate-700 hover:text-slate-300'}
                            `}
                        >
                            {config.icon}
                            {config.label}
                        </button>
                    ))}
                </div>
            </div>
        </PageHeader>
    );
};

const LibraryContent: React.FC = () => {
    const { displayAuthors, viewMode } = useAuthorLibrary();

    if (displayAuthors.length === 0) {
        return (
            <EmptyState 
                title="NO PROFILES FOUND" 
                description="The requested agents have been redacted or do not exist in this sector." 
                icon={Users} 
            />
        );
    }

    return (
        <div className={`
            animate-fade-in
            ${viewMode === 'GRID' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-3'}
        `}>
            {displayAuthors.map(author => (
                viewMode === 'GRID' 
                    ? <AuthorCard key={author.id} author={author} />
                    : <AuthorRow key={author.id} author={author} />
            ))}
        </div>
    );
};

const SemanticIndex: React.FC = () => {
    const { allFocusAreas, handleTagClick } = useAuthorLibrary();

    return (
        <div className="mt-16 pt-8 border-t border-slate-800 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
                <Hash size={16} className="text-accent-cyan" />
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Semantic Index</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent"></div>
            </div>
            
            <Card className="p-6 bg-slate-950/30 border-slate-800/50">
                <div className="flex flex-wrap gap-2">
                    {allFocusAreas.map(area => (
                        <button
                            key={area}
                            onClick={() => handleTagClick(area)}
                            className="px-3 py-1.5 rounded-md text-[10px] font-mono border border-slate-800 bg-slate-900/50 text-slate-500 hover:text-accent-cyan hover:border-accent-cyan/30 transition-all"
                        >
                            {area}
                        </button>
                    ))}
                </div>
                <div className="mt-4 text-center">
                    <span className="text-[9px] text-slate-600 font-mono uppercase">End of Index</span>
                </div>
            </Card>
        </div>
    );
};

// --- 4. Main Component ---

export const AuthorLibrary: React.FC = () => {
    return (
        <AuthorLibraryProvider>
            <PageFrame>
                <LibraryHeader />
                <LibraryContent />
                <SemanticIndex />
            </PageFrame>
        </AuthorLibraryProvider>
    );
};