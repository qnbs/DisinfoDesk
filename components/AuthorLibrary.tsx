
import React, { useState, useMemo } from 'react';
import { AUTHORS_DATA } from '../data/authors';
import { Author } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { PageFrame, PageHeader, Card, Badge, EmptyState } from './ui/Common';
import { Feather, Search, Users, LayoutGrid, List, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AuthorLibrary: React.FC = () => {
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');
    const [selectedFocus, setSelectedFocus] = useState<string>('ALL');

    const onNavigateToDetail = (id: string) => navigate(`/authors/${id}`);

    // Extract unique focus areas for filter
    const focusAreas = useMemo(() => {
        const areas = new Set<string>();
        AUTHORS_DATA.forEach(a => a.focusAreas.forEach(area => areas.add(area)));
        return ['ALL', ...Array.from(areas).sort()];
    }, []);

    const filteredAuthors = useMemo(() => {
        return AUTHORS_DATA.filter(author => {
            const matchesSearch = author.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  author.keyWorks.some(work => work.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesFocus = selectedFocus === 'ALL' || author.focusAreas.includes(selectedFocus);
            return matchesSearch && matchesFocus;
        });
    }, [searchTerm, selectedFocus]);

    const AuthorCard: React.FC<{ author: Author }> = ({ author }) => (
        <div 
            onClick={() => onNavigateToDetail(author.id)}
            className="group relative cursor-pointer bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-accent-cyan/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] active:scale-[0.98]"
        >
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <User size={100} />
            </div>
            
            <div className="p-6 flex flex-col h-full relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700 flex items-center justify-center text-slate-400 font-serif font-bold text-lg shadow-inner group-hover:text-white group-hover:border-accent-cyan transition-colors">
                        {author.imagePlaceholder}
                    </div>
                    <Badge label={author.nationality} className="text-[9px] bg-slate-950/50" />
                </div>

                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-accent-cyan transition-colors line-clamp-1">{author.name}</h3>
                <div className="text-xs text-slate-500 font-mono mb-4">{author.lifespan}</div>

                <div className="flex-1 mb-4">
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {language === 'de' ? author.bioDe : author.bioEn}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                    {author.focusAreas.slice(0, 3).map(area => (
                        <span key={area} className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-500 font-mono uppercase tracking-wider group-hover:border-slate-700 transition-colors">
                            {area}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );

    const AuthorRow: React.FC<{ author: Author }> = ({ author }) => (
        <div 
            onClick={() => onNavigateToDetail(author.id)}
            className="flex items-center gap-4 p-4 bg-slate-900/30 border border-slate-800 rounded-lg hover:bg-slate-800 hover:border-slate-600 cursor-pointer transition-all active:bg-slate-800 group"
        >
            <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center text-slate-500 font-bold font-serif text-sm shrink-0 group-hover:text-accent-cyan group-hover:border-accent-cyan/50">
                {author.imagePlaceholder}
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white group-hover:text-accent-cyan transition-colors">{author.name}</h3>
                <div className="text-xs text-slate-500 line-clamp-1">{language === 'de' ? author.bioDe : author.bioEn}</div>
            </div>
            <div className="hidden md:flex flex-wrap gap-2">
                {author.focusAreas.slice(0, 2).map(area => (
                    <span key={area} className="text-[10px] text-slate-500 font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800">{area}</span>
                ))}
            </div>
            <div className="text-right shrink-0">
               <div className="text-[10px] text-slate-600 font-mono">{author.lifespan}</div>
            </div>
        </div>
    );

    return (
        <PageFrame>
            <PageHeader 
                title={t.authors.title}
                subtitle="ARCHITECTS OF THE UNKNOWN"
                icon={Feather}
                status={`${filteredAuthors.length} PROFILES`}
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
                <div className="flex flex-col gap-4">
                    <div className="relative w-full max-w-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input 
                            type="text" 
                            placeholder={t.authors.searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 text-white pl-12 pr-10 py-3 rounded-xl focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all text-sm font-mono shadow-inner"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {focusAreas.map(area => (
                            <button
                                key={area}
                                onClick={() => setSelectedFocus(area)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${selectedFocus === area ? 'bg-accent-purple text-white border-accent-purple' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600'}`}
                            >
                                {area}
                            </button>
                        ))}
                    </div>
                </div>
            </PageHeader>

            {filteredAuthors.length === 0 ? (
                <EmptyState 
                    title="NO PROFILES FOUND" 
                    description="The requested data has been redacted or does not exist." 
                    icon={Users} 
                />
            ) : (
                viewMode === 'GRID' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                        {filteredAuthors.map(author => <AuthorCard key={author.id} author={author} />)}
                    </div>
                ) : (
                    <div className="space-y-2 animate-fade-in">
                        {filteredAuthors.map(author => <AuthorRow key={author.id} author={author} />)}
                    </div>
                )
            )}
        </PageFrame>
    );
};