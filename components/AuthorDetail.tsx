
import React, {
  useMemo, useCallback, createContext, useContext, useState
} from 'react';
import { MEDIA_ITEMS } from '../constants';
import { Author } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import {
  PageFrame, PageHeader, Card, Button, Badge
} from './ui/Common';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip
} from 'recharts';
import {
  ArrowLeft, User, Book, Globe, Zap, Search, Brain, Fingerprint, History, Activity, Lock
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { GenerationHUD } from './ui/GenerationHUD';
import { useAppSelector } from '../store/hooks';
import { selectAuthorById } from '../store/slices/authorsSlice';
import { RootState } from '../store/store';

// --- 1. Logic Hook ---

const useAuthorDetailLogic = () => {
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    const { authorId } = useParams<{ authorId: string }>();
    
    // UI State
    const [activeTab, setActiveTab] = useState<'BIO' | 'PSYCH' | 'NETWORK'>('BIO');
    const [profiling, setProfiling] = useState(false);
    const [profileData, setProfileData] = useState<{
        rhetoric: number;
        logic: number;
        emotion: number;
        trait: string[];
        verdict: string;
    } | null>(null);

    const author = useAppSelector((state: RootState) => selectAuthorById(state, authorId || ''));
    const relatedMedia = useMemo(() => {
        const mediaIds = author?.affiliatedMedia?.length ? author.affiliatedMedia : (author?.relatedMediaIds || []);
        if (!mediaIds.length) return [];
        return MEDIA_ITEMS.filter(item => mediaIds.includes(item.id));
    }, [author]);

    const onBack = () => navigate('/authors');
    const onSearchRelated = () => navigate('/archive');

    const runPsychProfile = useCallback(() => {
        setProfiling(true);
        // Simulate AI Processing
        setTimeout(() => {
            setProfileData({
                rhetoric: Math.floor(Math.random() * 30) + 70, // High rhetoric
                logic: Math.floor(Math.random() * 40) + 30,
                emotion: Math.floor(Math.random() * 50) + 40,
                trait: language === 'de'
                    ? ['Paranoide Ideation', 'Autoritätskonflikt', 'Mustersuche']
                    : ['Paranoid Ideation', 'Authority Challenge', 'Pattern Seeking'],
                verdict: language === 'de' ? 'HOHES KOGNITIVES RISIKO' : 'HIGH COGNITIVE HAZARD'
            });
            setProfiling(false);
        }, 2500);
    }, [language]);

    return { t, language, author, relatedMedia, onBack, onSearchRelated, activeTab, setActiveTab, runPsychProfile, profiling, profileData };
};

const AuthorDetailContext = createContext<ReturnType<typeof useAuthorDetailLogic> | undefined>(undefined);
const useAuthorDetail = () => {
    const ctx = useContext(AuthorDetailContext);
    if (!ctx) throw new Error('useAuthorDetail missing provider');
    return ctx;
};

// --- 2. Advanced Sub-Components ---

const TimelineVisualizer: React.FC<{ timeline: Author['timeline'] }> = ({ timeline }) => {
    const { t } = useAuthorDetail();
    if (!timeline?.length) return null;
    
    return (
        <div className="mt-6 border-t border-slate-800 pt-6">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <History size={12} /> {t.authors.detail.temporalActivity}
            </h4>
            <div className="space-y-2">
                {timeline.map((entry, index) => (
                    <div key={`${entry.year}-${index}`} className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                        <div className="text-[10px] font-mono text-accent-cyan mb-1">{entry.year}</div>
                        <div className="text-sm text-slate-200 mb-1">{entry.event}</div>
                        <div className="text-xs text-slate-400">{entry.significance}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PsychProfileView: React.FC = () => {
    const { profiling, profileData, runPsychProfile, t } = useAuthorDetail();

    if (profiling) {
        return (
            <div className="h-[400px] flex items-center justify-center bg-slate-950 border border-slate-800 rounded-xl relative overflow-hidden">
                <GenerationHUD mode="ANALYSIS" isVisible={true} variant="overlay" />
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="h-[400px] flex flex-col items-center justify-center bg-slate-900/30 border border-slate-800 rounded-xl text-center p-8">
                <Brain size={48} className="text-slate-700 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{t.authors.detail.neuralRequired}</h3>
                <p className="text-slate-400 text-sm mb-6 max-w-sm">
                    {t.authors.detail.neuralRequiredDesc}
                </p>
                <Button onClick={runPsychProfile} icon={<Fingerprint size={16} />} className="shadow-neon-cyan">
                    {t.authors.detail.initiateScan}
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 md:p-8 animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><Fingerprint size={120} /></div>
            
            <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                <h3 className="text-sm font-bold text-accent-purple uppercase tracking-widest flex items-center gap-2">
                    <Activity size={16} /> {t.authors.detail.cognitiveForensics}
                </h3>
                <Badge label={profileData.verdict} className="bg-red-950/50 text-red-500 border-red-900 animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Stats */}
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">{t.authors.detail.rhetoricIntensity}</div>
                        <div className="h-2 bg-slate-900 rounded-full overflow-hidden"><div className="h-full bg-purple-500" style={{width: `${profileData.rhetoric}%`}}></div></div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">{t.authors.detail.logicalConsistency}</div>
                        <div className="h-2 bg-slate-900 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{width: `${profileData.logic}%`}}></div></div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">{t.authors.detail.emotionalManipulation}</div>
                        <div className="h-2 bg-slate-900 rounded-full overflow-hidden"><div className="h-full bg-red-500" style={{width: `${profileData.emotion}%`}}></div></div>
                    </div>
                </div>

                {/* Traits */}
                <div className="md:col-span-2 bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-3">{t.authors.detail.detectedPatterns}</h4>
                    <div className="flex flex-wrap gap-2">
                        {profileData.trait.map((t: string, i: number) => (
                            <div key={i} className="px-3 py-2 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-slate-300 flex items-center gap-2">
                                <Lock size={10} className="text-red-400" /> {t}
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-xs text-slate-400 font-mono leading-relaxed p-3 bg-black/40 rounded border-l-2 border-accent-purple">
                        "{t.authors.detail.profileInsightQuote}"
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfluenceRadar: React.FC<{ author: Author }> = ({ author }) => {
    const { t } = useAuthorDetail();
    const rhetoric = Math.min(100, Math.max(20, author.influenceScore ?? author.influenceLevel));
    const reach = Math.min(100, Math.max(20, Math.round((author.influenceMetrics.mainPlatforms.length / 5) * 100)));
    const persistence = Math.min(100, Math.max(20, Math.round((author.notableWorks.length / 6) * 100)));
    const controversy = Math.min(100, Math.max(20, Math.round(author.controversiesAndDebunkings.length * 25)));

    const radarData = useMemo(() => [
        { subject: t.authors.detail.rhetoric, value: rhetoric },
        { subject: t.authors.detail.reach, value: reach },
        { subject: t.authors.detail.persistence, value: persistence },
        { subject: t.authors.detail.controversy, value: controversy },
    ], [t, rhetoric, reach, persistence, controversy]);

    return (
        <Card className="p-6 border-slate-800 bg-slate-900/50">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-3">{t.authors.detail.influenceRadar}</h4>
            <div className="flex items-center gap-6">
                <div className="w-44 h-44 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                            <PolarGrid stroke="#334155" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.25} strokeWidth={2} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', fontSize: '11px' }}
                                itemStyle={{ color: '#e2e8f0' }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
                <div className="text-xs text-slate-400 space-y-2 font-mono">
                    <div>{t.authors.detail.rhetoric}: {rhetoric}</div>
                    <div>{t.authors.detail.reach}: {reach}</div>
                    <div>{t.authors.detail.persistence}: {persistence}</div>
                    <div>{t.authors.detail.controversy}: {controversy}</div>
                </div>
            </div>
        </Card>
    );
};

const RelatedMediaCarousel: React.FC = () => {
    const { relatedMedia, language, t } = useAuthorDetail();
    const navigate = useNavigate();

    if (!relatedMedia.length) return null;

    return (
        <Card className="p-6 border-slate-800 bg-slate-900/50">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-4">{t.authors.detail.relatedMedia}</h4>
            <div className="flex gap-3 overflow-x-auto pb-2">
                {relatedMedia.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => navigate(`/media/${item.id}`)}
                        className="min-w-[240px] max-w-[240px] rounded-lg border border-slate-800 bg-slate-950 overflow-hidden text-left hover:border-accent-purple/50 transition-colors"
                    >
                        <img src={item.imageUrl} alt={`Medienbezug: ${item.title}`} className="h-28 w-full object-cover opacity-80" />
                        <div className="p-3">
                            <div className="text-sm font-bold text-white line-clamp-1">{item.title}</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-1">{item.type} · {item.year}</div>
                            <p className="text-xs text-slate-400 line-clamp-2 mt-2">
                                {language === 'de' ? item.satiricalPreviewDe || item.descriptionDe : item.satiricalPreviewEn || item.descriptionEn}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </Card>
    );
};

// --- 3. Main Sections ---

const DetailHeader: React.FC = () => {
    const { author, t, onBack } = useAuthorDetail();
    if (!author) return null;
    return (
        <PageHeader 
            title={author.name}
            subtitle={`${t.authors.detail.dossierPrefix}: ${author.id.toUpperCase()}`}
            icon={User}
            status={t.authors.detail.classifiedStatus}
            statusColor="bg-purple-500"
            visualizerState="BUSY"
            actions={<Button variant="ghost" onClick={onBack} size="sm" icon={<ArrowLeft size={16} />}>{t.detail.back}</Button>}
        />
    );
};

const DetailContent: React.FC = () => {
    const { author, activeTab, setActiveTab, t, language, onSearchRelated } = useAuthorDetail();
    if (!author) return <div className="text-center p-20 text-red-500 font-mono">{t.authors.detail.fileMissing}</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Left Column: Bio Card */}
            <div className="lg:col-span-4 space-y-6">
                <Card className="p-0 bg-slate-900 border-slate-800 overflow-hidden relative group">
                    <div className="h-64 overflow-hidden relative">
                        <img src={author.imageUrl} alt={`Porträt von ${author.name}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center justify-between">
                                <Badge label={author.nationality} className="bg-black/60 backdrop-blur border-white/20 text-white" />
                                <div className="text-white font-mono font-bold text-shadow-lg">{author.lifespan}</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 space-y-6 relative bg-slate-900">
                        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2"><Zap size={14} className="text-yellow-500"/> {t.authors.detail.influence}</span>
                            <div className="text-2xl font-black text-white font-display">{author.influenceLevel} <span className="text-sm text-slate-600 font-mono">/100</span></div>
                        </div>
                        
                        <div>
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Book size={12}/> {t.authors.works}</h4>
                            <ul className="space-y-2">
                                {author.notableWorks.map((work, i) => (
                                    <li key={i} className="text-sm text-slate-300 pl-3 border-l-2 border-slate-700 hover:border-accent-cyan hover:text-white transition-colors cursor-default py-1">
                                        {work}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <TimelineVisualizer timeline={author.timeline} />
                    </div>
                </Card>
                <InfluenceRadar author={author} />
            </div>

            {/* Right Column: Tabs & Content */}
            <div className="lg:col-span-8">
                <div className="flex gap-1 mb-6 border-b border-slate-800">
                    <button onClick={() => setActiveTab('BIO')} className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${activeTab === 'BIO' ? 'border-accent-cyan text-accent-cyan' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>{t.authors.detail.tabBiography}</button>
                    <button onClick={() => setActiveTab('PSYCH')} className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all outline-none focus-visible:ring-2 focus-visible:ring-accent-purple focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${activeTab === 'PSYCH' ? 'border-accent-purple text-accent-purple' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>{t.authors.detail.tabPsych}</button>
                </div>

                {activeTab === 'BIO' && (
                    <div className="space-y-6 animate-fade-in">
                        <Card className="p-4 border-yellow-700/40 bg-yellow-950/20">
                            <p className="text-xs text-yellow-200">{language === 'de' ? author.disclaimerDe : author.disclaimerEn}</p>
                        </Card>
                        <Card variant="glass" className="p-8">
                            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none"><Globe size={120} /></div>
                            <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-4 flex items-center gap-2"><User size={20} className="text-accent-cyan"/> {t.authors.detail.profileSummary}</h3>
                            <div className="prose prose-invert max-w-none text-slate-300 leading-loose font-sans text-base">
                                <p className="whitespace-pre-line">{language === 'de' ? (author.fullBioDe || author.fullBio) : (author.fullBioEn || author.fullBio)}</p>
                            </div>
                        </Card>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="p-6 border-slate-800 bg-slate-900/50">
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-3">{t.authors.detail.focusAreas}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {author.focusAreas.map(area => <Badge key={area} label={area} className="bg-slate-800 border-slate-700 text-slate-400" />)}
                                </div>
                            </Card>
                            <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 flex items-center justify-center">
                                <Button variant="secondary" size="sm" icon={<Search size={14} />} className="text-xs" onClick={onSearchRelated}>{t.authors.detail.searchDatabaseForAuthor}</Button>
                            </Card>
                        </div>
                        <Card className="p-6 border-slate-800 bg-slate-900/50">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-3">{language === 'de' ? 'Kern-Claims' : 'Core Claims'}</h4>
                            <ul className="space-y-2 text-sm text-slate-300">
                                {author.keyClaims.map((claim, index) => <li key={index} className="pl-3 border-l border-slate-700">{claim}</li>)}
                            </ul>
                        </Card>
                        <Card className="p-6 border-slate-800 bg-slate-900/50">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-3">{language === 'de' ? 'Wirkung & Kontroversen' : 'Impact & Controversies'}</h4>
                            <ul className="space-y-2 text-sm text-slate-300">
                                {author.controversiesAndDebunkings.map((item, index) => <li key={index} className="pl-3 border-l border-slate-700">{item}</li>)}
                            </ul>
                        </Card>
                        <Card className="p-6 border-slate-800 bg-slate-900/50">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-3">{language === 'de' ? 'Lern-Insights' : 'Educational Insights'}</h4>
                            <p className="text-sm text-slate-300 leading-relaxed">{author.educationalInsights}</p>
                        </Card>
                        <Card className="p-6 border-slate-800 bg-slate-900/50">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-3">{language === 'de' ? 'Einflussmetriken' : 'Influence Metrics'}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-300">
                                <div><span className="text-slate-500">{language === 'de' ? 'Plattformen:' : 'Platforms:'}</span> {author.influenceMetrics.mainPlatforms.join(', ')}</div>
                                <div><span className="text-slate-500">{language === 'de' ? 'Peak-Reichweite:' : 'Peak Reach:'}</span> {author.influenceMetrics.peakReach}</div>
                                <div><span className="text-slate-500">{language === 'de' ? 'Publikum:' : 'Audience:'}</span> {author.influenceMetrics.estimatedAudience}</div>
                                <div><span className="text-slate-500">{language === 'de' ? 'Peak-Jahr:' : 'Peak Year:'}</span> {author.influenceMetrics.peakYear || (language === 'de' ? 'k. A.' : 'n/a')}</div>
                            </div>
                        </Card>
                        <Card className="p-6 border-slate-800 bg-slate-900/50">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-3">{t.authors.detail.factCheckLearning}</h4>
                            <p className="text-sm text-slate-300 mb-3">{language === 'de' ? author.factCheckNoteDe : author.factCheckNoteEn}</p>
                            <p className="text-xs text-slate-400 mb-2">{language === 'de' ? author.whyItSpreadsDe : author.whyItSpreadsEn}</p>
                            <p className="text-xs text-accent-cyan">{language === 'de' ? author.learningPromptDe : author.learningPromptEn}</p>
                        </Card>
                        <Card className="p-6 border-slate-800 bg-slate-900/50">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-3">{language === 'de' ? 'Quellen' : 'Sources'}</h4>
                            <ul className="space-y-2 text-sm text-slate-300">
                                {author.sources.map((source, index) => <li key={index} className="pl-3 border-l border-slate-700">{source}</li>)}
                            </ul>
                        </Card>
                        <RelatedMediaCarousel />
                    </div>
                )}

                {activeTab === 'PSYCH' && <PsychProfileView />}
            </div>
        </div>
    );
};

export const AuthorDetail: React.FC = () => (
    <AuthorDetailContext.Provider value={useAuthorDetailLogic()}>
        <PageFrame>
            <DetailHeader />
            <DetailContent />
        </PageFrame>
    </AuthorDetailContext.Provider>
);
