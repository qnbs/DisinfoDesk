
import React, { useMemo } from 'react';
import { AUTHORS_DATA } from '../data/authors';
import { useLanguage } from '../contexts/LanguageContext';
import { PageFrame, PageHeader, Card, Button, Badge } from './ui/Common';
import { ArrowLeft, User, Book, Globe, Zap, Calendar, MapPin, Search } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export const AuthorDetail: React.FC = () => {
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    const { authorId } = useParams<{ authorId: string }>();
    
    const author = useMemo(() => {
        return AUTHORS_DATA.find(a => a.id === authorId);
    }, [authorId]);

    const onBack = () => navigate('/authors');

    if (!author) {
        return (
            <PageFrame>
                <div className="text-center p-10 text-red-500">PROFILE_NOT_FOUND</div>
                <Button onClick={onBack}>Return to Index</Button>
            </PageFrame>
        );
    }

    return (
        <PageFrame>
            <PageHeader 
                title={author.name}
                subtitle={`FILE: ${author.id.toUpperCase()}`}
                icon={User}
                status="CLASSIFIED"
                statusColor="bg-purple-500"
                actions={
                    <Button variant="ghost" onClick={onBack} size="sm" icon={<ArrowLeft size={16} />}>
                        {t.detail.back}
                    </Button>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar */}
                <div className="space-y-6">
                    <Card className="p-6 bg-slate-900 border-slate-800 flex flex-col items-center text-center">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-slate-800 to-slate-950 border-4 border-slate-800 flex items-center justify-center text-4xl font-serif font-bold text-slate-500 shadow-2xl mb-6">
                            {author.imagePlaceholder}
                        </div>
                        <div className="w-full space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                <span className="text-xs text-slate-500 uppercase font-bold flex items-center gap-2"><Calendar size={12}/> Lifespan</span>
                                <span className="text-sm font-mono text-white">{author.lifespan}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                <span className="text-xs text-slate-500 uppercase font-bold flex items-center gap-2"><MapPin size={12}/> Origin</span>
                                <span className="text-sm font-mono text-white">{author.nationality}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2">
                                <span className="text-xs text-slate-500 uppercase font-bold flex items-center gap-2"><Zap size={12}/> Influence</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-accent-purple" style={{ width: `${author.influenceLevel}%` }}></div>
                                    </div>
                                    <span className="text-xs font-mono text-accent-purple font-bold">{author.influenceLevel}</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Book size={14} /> {t.authors.works}
                        </h3>
                        <ul className="space-y-3">
                            {author.keyWorks.map((work, i) => (
                                <li key={i} className="text-sm text-slate-300 pl-4 border-l-2 border-slate-700 hover:border-accent-cyan hover:text-white transition-colors cursor-default">
                                    {work}
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                            <Globe size={120} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-700 pb-4 flex items-center gap-2">
                            <User size={20} className="text-accent-cyan"/> {t.authors.bio}
                        </h3>
                        <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed font-sans">
                            <p>{language === 'de' ? author.bioDe : author.bioEn}</p>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6 bg-slate-900/50 border-slate-800">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                                {t.authors.focus}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {author.focusAreas.map(area => (
                                    <Badge key={area} label={area} className="bg-slate-800 text-slate-300 border-slate-700" />
                                ))}
                            </div>
                        </Card>
                        
                        <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 flex items-center justify-center text-center">
                            <div>
                                <div className="mb-2 text-slate-500 text-xs font-bold uppercase tracking-widest">Database Search</div>
                                <Button variant="secondary" size="sm" icon={<Search size={14} />} className="text-xs">
                                    Find Related Theories
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </PageFrame>
    );
};