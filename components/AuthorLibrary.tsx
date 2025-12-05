
import React, { useState, useMemo, createContext, useContext, useEffect, useRef } from 'react';
import { AUTHORS_FULL } from '../data/enriched';
import { Author } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { PageFrame, PageHeader, Card, Badge, EmptyState, Button } from './ui/Common';
import { 
    Feather, Search, Users, LayoutGrid, List, 
    Rocket, GlobeLock, Landmark, Ghost, Hash,
    ArrowRight, Star, Zap, X, ArrowDownCircle, Network,
    Cpu, Activity, Fingerprint
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Types & Constants ---

type ViewMode = 'GRID' | 'LIST' | 'NETWORK';
type CategoryKey = 'ALL' | 'COSMIC' | 'SYSTEM' | 'HISTORY' | 'ESOTERIC';

const CATEGORY_CONFIG: Record<CategoryKey, { label: string, icon: React.ReactNode, keywords: string[], color: string }> = {
    ALL: { label: 'Global Index', icon: <Users size={14} />, keywords: [], color: 'text-slate-400' },
    COSMIC: { label: 'Cosmic Origins', icon: <Rocket size={14} />, keywords: ['Aliens', 'UFOs', 'Space', 'Mars', 'Nibiru'], color: 'text-purple-400' },
    SYSTEM: { label: 'System Control', icon: <GlobeLock size={14} />, keywords: ['NWO', 'Deep State', 'Elite', 'Globalism'], color: 'text-red-400' },
    HISTORY: { label: 'Revisionism', icon: <Landmark size={14} />, keywords: ['History', 'Banking', 'Economics', 'Wall Street'], color: 'text-yellow-400' },
    ESOTERIC: { label: 'Occult Knowledge', icon: <Ghost size={14} />, keywords: ['Occult', 'Spirituality', 'Cryptozoology', 'Magic'], color: 'text-cyan-400' }
};

// --- 0. Advanced UI Components ---

// 3D Tilt Card Effect
const HolographicCard: React.FC<{ author: Author, onClick: () => void }> = ({ author, onClick }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const { language } = useLanguage();

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cardRef.current.style.setProperty('--x', `${x}px`);
        cardRef.current.style.setProperty('--y', `${y}px`);
        
        const rotateX = (y / rect.height - 0.5) * -10; // Max 10deg rotation
        const rotateY = (x / rect.width - 0.5) * 10;
        cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        cardRef.current.style.setProperty('--x', `-100%`);
        cardRef.current.style.setProperty('--y', `-100%`);
    };

    return (
        <div 
            ref={cardRef}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group relative h-[420px] rounded-xl bg-slate-900 border border-slate-800 cursor-pointer overflow-hidden transition-all duration-200 ease-out shadow-lg hover:shadow-2xl hover:border-accent-cyan/50 select-none"
            style={{ transformStyle: 'preserve-3d' }}
        >
            {/* Holographic Sheen Layer */}
            <div 
                className="absolute inset-0 z-20 opacity-0 group-hover:opacity-10 pointer-events-none mix-blend-overlay transition-opacity duration-500"
                style={{
                    background: `radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255,255,255,0.8) 0%, transparent 60%)`
                }}
            />

            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img src={author.imageUrl} alt="" className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-700 grayscale group-hover:grayscale-0 scale-105" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/0 via-slate-950/80 to-slate-950" />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 p-6 h-full flex flex-col transform translate-z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-600 shadow-xl overflow-hidden group-hover:border-accent-cyan transition-colors">
                        <img src={author.imageUrl} alt={author.name} className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <div className="text-[9px] font-mono text-slate-500 border border-slate-800 px-1.5 rounded bg-black/40 backdrop-blur">
                            ID: {author.id.toUpperCase()}
                        </div>
                        {author.influenceLevel >= 85 && (
                            <div className="text-[9px] font-bold text-red-400 border border-red-500/30 px-2 py-0.5 rounded bg-red-950/20 animate-pulse">
                                HIGH IMPACT
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-accent-cyan transition-colors leading-tight font-display tracking-wide">
                        {author.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                        <span className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-accent-cyan transition-colors" />
                        {author.nationality}
                    </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-6 font-medium group-hover:text-slate-300 transition-colors border-l-2 border-slate-800 pl-3 group-hover:border-accent-cyan/30">
                    {language === 'de' ? author.bioDe : author.bioEn}
                </p>

                <div className="mt-auto space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                        {author.focusAreas.slice(0, 3).map(area => (
                            <span key={area} className="px-2 py-1 rounded bg-slate-950/80 border border-slate-700 text-[10px] text-slate-400 font-mono uppercase tracking-wider group-hover:border-slate-600">
                                {area}
                            </span>
                        ))}
                    </div>
                    
                    <div className="pt-3 border-t border-slate-800/50 flex justify-between items-center text-[10px] font-mono text-slate-500">
                        <span className="flex items-center gap-1">
                            <Activity size={10} className="text-accent-purple" />
                            INF-INDEX
                        </span>
                        <div className="flex items-center gap-2">
                            <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-accent-purple to-accent-cyan" 
                                    style={{ width: `${author.influenceLevel}%` }} 
                                />
                            </div>
                            <span className="text-white font-bold">{author.influenceLevel}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Network Graph Component
const NetworkGraph: React.FC<{ authors: Author[], onSelect: (id: string) => void }> = ({ authors, onSelect }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = container.clientWidth;
        let height = container.clientHeight;
        const dpr = window.devicePixelRatio || 1;
        
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);

        // Physics Simulation Data
        const nodes = authors.map(a => ({
            id: a.id,
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.max(3, (a.influenceLevel / 100) * 8),
            color: a.influenceLevel > 80 ? '#ef4444' : '#06b6d4',
            data: a
        }));

        // Create Links based on shared focus areas
        const links: { source: typeof nodes[0], target: typeof nodes[0], strength: number }[] = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a1 = nodes[i].data;
                const a2 = nodes[j].data;
                const sharedTags = a1.focusAreas.filter(tag => a2.focusAreas.includes(tag));
                if (sharedTags.length > 0) {
                    links.push({ source: nodes[i], target: nodes[j], strength: sharedTags.length * 0.02 });
                }
            }
        }

        let animationFrame: number;

        const render = () => {
            ctx.clearRect(0, 0, width, height);
            
            // Draw Connections
            ctx.lineWidth = 0.5;
            links.forEach(link => {
                const dx = link.target.x - link.source.x;
                const dy = link.target.y - link.source.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < 200) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(100, 116, 139, ${0.2 * (1 - dist/200)})`;
                    ctx.moveTo(link.source.x, link.source.y);
                    ctx.lineTo(link.target.x, link.target.y);
                    ctx.stroke();
                    
                    // Attraction
                    const fx = (dx / dist) * link.strength;
                    const fy = (dy / dist) * link.strength;
                    link.source.vx += fx; link.source.vy += fy;
                    link.target.vx -= fx; link.target.vy -= fy;
                }
            });

            // Update & Draw Nodes
            nodes.forEach(node => {
                // Physics
                node.x += node.vx;
                node.y += node.vy;
                node.vx *= 0.95; // Friction
                node.vy *= 0.95;

                // Bounds
                if (node.x < 20) { node.x = 20; node.vx *= -1; }
                if (node.x > width - 20) { node.x = width - 20; node.vx *= -1; }
                if (node.y < 20) { node.y = 20; node.vy *= -1; }
                if (node.y > height - 20) { node.y = height - 20; node.vy *= -1; }

                // Draw
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = node.color;
                ctx.fill();
                
                // Glow
                ctx.shadowColor = node.color;
                ctx.shadowBlur = 10;
                ctx.shadowBlur = 0;

                // Label (if high influence or hovered - simple distance check for mouse could be added)
                if (node.data.influenceLevel > 80) {
                    ctx.fillStyle = '#fff';
                    ctx.font = '10px monospace';
                    ctx.fillText(node.data.name.split(' ')[1], node.x + 10, node.y + 3);
                }
            });

            animationFrame = requestAnimationFrame(render);
        };

        render();

        const handleClick = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const hit = nodes.find(n => {
                const dx = n.x - x;
                const dy = n.y - y;
                return Math.sqrt(dx*dx + dy*dy) < 20; // Hit radius
            });

            if (hit) onSelect(hit.id);
        };

        canvas.addEventListener('click', handleClick);

        return () => {
            cancelAnimationFrame(animationFrame);
            canvas.removeEventListener('click', handleClick);
        };
    }, [authors, onSelect]);

    return (
        <div ref={containerRef} className="w-full h-[600px] bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden shadow-inner group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
            <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair relative z-10" />
            <div className="absolute bottom-4 left-4 p-3 bg-slate-900/80 backdrop-blur rounded border border-slate-700 text-[10px] font-mono text-slate-400 pointer-events-none z-20">
                <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-cyan-500"></div> STANDARD NODE</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> HIGH INFLUENCE</div>
            </div>
        </div>
    );
};

// --- 1. Logic Hook ---

const useAuthorLibraryLogic = () => {
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('GRID');
    const [activeCategory, setActiveCategory] = useState<CategoryKey>('ALL');
    const [visibleCount, setVisibleCount] = useState(12);

    const onNavigateToDetail = (id: string) => navigate(`/authors/${id}`);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        setVisibleCount(12);
    }, [debouncedSearch, activeCategory]);

    const allFocusAreas = useMemo(() => {
        const areas = new Set<string>();
        AUTHORS_FULL.forEach(a => a.focusAreas.forEach(area => areas.add(area)));
        return Array.from(areas).sort();
    }, []);

    const filteredAuthors = useMemo(() => {
        let result = AUTHORS_FULL;
        if (debouncedSearch) {
            const lowerTerm = debouncedSearch.toLowerCase();
            result = result.filter(author => 
                author.name.toLowerCase().includes(lowerTerm) || 
                author.keyWorks.some(work => work.toLowerCase().includes(lowerTerm)) ||
                author.focusAreas.some(area => area.toLowerCase().includes(lowerTerm))
            );
        }
        if (activeCategory !== 'ALL') {
            const config = CATEGORY_CONFIG[activeCategory];
            result = result.filter(author => 
                author.focusAreas.some(area => config.keywords.some(kw => area.toLowerCase().includes(kw.toLowerCase())))
            );
        }
        return result;
    }, [debouncedSearch, activeCategory]);

    const displayAuthors = useMemo(() => filteredAuthors.slice(0, visibleCount), [filteredAuthors, visibleCount]);

    const featuredAuthor = useMemo(() => {
        const elite = AUTHORS_FULL.filter(a => a.influenceLevel >= 85);
        return elite.length > 0 ? elite[new Date().getHours() % elite.length] : AUTHORS_FULL[0];
    }, []);

    return {
        t, language, searchTerm, setSearchTerm, viewMode, setViewMode, activeCategory, setActiveCategory,
        displayAuthors, filteredAuthors, totalCount: filteredAuthors.length, hasMore: visibleCount < filteredAuthors.length,
        handleLoadMore: () => setVisibleCount(p => p + 12),
        allFocusAreas, onNavigateToDetail,
        handleTagClick: (tag: string) => { setSearchTerm(tag); window.scrollTo({top:0, behavior:'smooth'}); },
        featuredAuthor
    };
};

const AuthorLibraryContext = createContext<ReturnType<typeof useAuthorLibraryLogic> | undefined>(undefined);
const useAuthorLibrary = () => {
    const ctx = useContext(AuthorLibraryContext);
    if (!ctx) throw new Error('useAuthorLibrary must be used within AuthorLibraryProvider');
    return ctx;
};

const AuthorLibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const logic = useAuthorLibraryLogic();
    return <AuthorLibraryContext.Provider value={logic}>{children}</AuthorLibraryContext.Provider>;
};

// --- 3. Main Sections ---

const LibraryHeader: React.FC = () => {
    const { t, searchTerm, setSearchTerm, viewMode, setViewMode, activeCategory, setActiveCategory, totalCount } = useAuthorLibrary();
    
    return (
        <PageHeader 
            title={t.authors.title}
            subtitle="ARCHITECTS OF THE UNKNOWN"
            icon={Feather}
            status={`${totalCount} PROFILES`}
            visualizerState="IDLE"
            actions={
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button onClick={() => setViewMode('GRID')} className={`p-2 rounded transition-colors ${viewMode === 'GRID' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}><LayoutGrid size={16} /></button>
                    <button onClick={() => setViewMode('LIST')} className={`p-2 rounded transition-colors ${viewMode === 'LIST' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}><List size={16} /></button>
                    <button onClick={() => setViewMode('NETWORK')} className={`p-2 rounded transition-colors ${viewMode === 'NETWORK' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}><Network size={16} /></button>
                </div>
            }
        >
            <div className="flex flex-col gap-6">
                <div className="relative w-full max-w-2xl group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-cyan transition-colors" size={16} />
                    <input 
                        type="text" 
                        placeholder={t.authors.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 text-white pl-12 pr-10 py-4 rounded-xl focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all text-sm font-mono shadow-inner placeholder-slate-600"
                    />
                    {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white rounded-full hover:bg-slate-800"><X size={14} /></button>}
                </div>
                
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {(Object.entries(CATEGORY_CONFIG) as [CategoryKey, typeof CATEGORY_CONFIG[CategoryKey]][]).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => setActiveCategory(key)}
                            className={`
                                flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border whitespace-nowrap outline-none
                                ${activeCategory === key 
                                    ? `bg-slate-800 text-white border-slate-600 shadow-[0_0_15px_rgba(255,255,255,0.05)]` 
                                    : 'bg-slate-900/50 text-slate-500 border-slate-800 hover:border-slate-700 hover:text-slate-300'}
                            `}
                        >
                            <span className={activeCategory === key ? config.color : 'text-slate-600'}>{config.icon}</span>
                            {config.label}
                        </button>
                    ))}
                </div>
            </div>
        </PageHeader>
    );
};

const LibraryContent: React.FC = () => {
    const { displayAuthors, filteredAuthors, viewMode, hasMore, handleLoadMore, activeCategory, searchTerm, featuredAuthor, onNavigateToDetail } = useAuthorLibrary();

    if (displayAuthors.length === 0) {
        return <div className="py-20"><EmptyState title="NO PROFILES FOUND" description="The requested agents have been redacted or do not exist in this sector." icon={Users} /></div>;
    }

    return (
        <div className="animate-fade-in pb-12">
            {/* Conditional Spotlight */}
            {viewMode !== 'NETWORK' && activeCategory === 'ALL' && !searchTerm && (
                <div className="relative w-full rounded-2xl overflow-hidden mb-12 border border-slate-800 shadow-2xl group cursor-pointer animate-fade-in bg-slate-950" onClick={() => onNavigateToDetail(featuredAuthor.id)}>
                    <div className="absolute inset-0 bg-slate-900 opacity-50"><img src={featuredAuthor.imageUrl} alt="" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0" /></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur border border-accent-purple/30 px-3 py-1 rounded text-[10px] font-mono uppercase tracking-widest text-accent-purple flex items-center gap-2"><Star size={12} className="fill-accent-purple" /> Archivist Choice</div>
                    <div className="relative z-10 p-8 md:p-12 max-w-3xl">
                        <div className="flex items-center gap-3 mb-4"><Badge label={featuredAuthor.nationality} className="bg-accent-cyan/10 text-accent-cyan border-accent-cyan/30" /><span className="text-slate-400 font-mono text-xs flex items-center gap-1"><Zap size={12} className="text-yellow-500" /> INF: {featuredAuthor.influenceLevel}%</span></div>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter drop-shadow-md">{featuredAuthor.name}</h2>
                        <Button variant="secondary" icon={<ArrowRight size={16} />}>Open Dossier</Button>
                    </div>
                </div>
            )}

            {viewMode === 'NETWORK' ? (
                <NetworkGraph authors={filteredAuthors} onSelect={onNavigateToDetail} />
            ) : (
                <div className={viewMode === 'GRID' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-3'}>
                    {displayAuthors.map(author => (
                        viewMode === 'GRID' 
                            ? <HolographicCard key={author.id} author={author} onClick={() => onNavigateToDetail(author.id)} />
                            : (
                                <div key={author.id} onClick={() => onNavigateToDetail(author.id)} className="flex items-center gap-4 p-4 bg-slate-900/30 border border-slate-800 rounded-lg hover:bg-slate-800 hover:border-slate-600 cursor-pointer transition-all active:scale-[0.99] group">
                                    <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-700 overflow-hidden shrink-0 group-hover:border-accent-cyan/50"><img src={author.imageUrl} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" /></div>
                                    <div className="flex-1 min-w-0"><h3 className="text-sm font-bold text-white group-hover:text-accent-cyan transition-colors">{author.name}</h3><div className="text-[10px] text-slate-500 font-mono">{author.lifespan} • {author.nationality}</div></div>
                                    <div className="text-[9px] font-mono text-slate-600 group-hover:text-accent-purple">{author.influenceLevel}% INF</div>
                                </div>
                            )
                    ))}
                </div>
            )}

            {hasMore && viewMode !== 'NETWORK' && (
                <div className="flex justify-center mt-12"><Button variant="secondary" onClick={handleLoadMore} className="w-full md:w-auto min-w-[200px]" icon={<ArrowDownCircle size={16} />}>Load More Profiles</Button></div>
            )}
        </div>
    );
};

const SemanticIndex: React.FC = () => {
    const { allFocusAreas, handleTagClick } = useAuthorLibrary();
    return (
        <div className="mt-8 pt-8 border-t border-slate-800 animate-fade-in">
            <div className="flex items-center gap-3 mb-6"><Hash size={16} className="text-accent-cyan" /><h3 className="text-sm font-bold text-white uppercase tracking-widest">Semantic Index</h3><div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent"></div></div>
            <Card className="p-6 bg-slate-950/30 border-slate-800/50"><div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto custom-scrollbar">{allFocusAreas.map(area => <button key={area} onClick={() => handleTagClick(area)} className="px-3 py-1.5 rounded-md text-[10px] font-mono border border-slate-800 bg-slate-900/50 text-slate-500 hover:text-accent-cyan hover:border-accent-cyan/30 transition-all hover:-translate-y-0.5">{area}</button>)}</div></Card>
        </div>
    );
};

export const AuthorLibrary: React.FC = () => (
    <AuthorLibraryProvider>
        <PageFrame>
            <LibraryHeader />
            <LibraryContent />
            <SemanticIndex />
        </PageFrame>
    </AuthorLibraryProvider>
);
