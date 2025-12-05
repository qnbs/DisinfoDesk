
import React, { useMemo, createContext, useContext, useState } from 'react';
import { AUTHORS_FULL } from '../data/enriched';
import { Author } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { PageFrame, PageHeader, Card, Button, Badge } from './ui/Common';
import { 
    ArrowLeft, User, Book, Globe, Zap, Calendar, MapPin, Search, 
    Brain, Fingerprint, History, BarChart2, Activity, Lock
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { GenerationHUD } from './ui/GenerationHUD';

// --- 1. Logic Hook ---

const useAuthorDetailLogic = () => {
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    const { authorId } = useParams<{ authorId: string }>();
    
    // UI State
    const [activeTab, setActiveTab] = useState<'BIO' | 'PSYCH' | 'NETWORK'>('BIO');
    const [profiling, setProfiling] = useState(false);
    const [profileData, setProfileData] = useState<any | null>(null);

    const author = useMemo(() => AUTHORS_FULL.find(a => a.id === authorId), [authorId]);

    const onBack = () => navigate('/authors');
    const onSearchRelated = () => navigate('/archive');

    const runPsychProfile = () => {
        setProfiling(true);
        // Simulate AI Processing
        setTimeout(() => {
            setProfileData({
                rhetoric: Math.floor(Math.random() * 30) + 70, // High rhetoric
                logic: Math.floor(Math.random() * 40) + 30,
                emotion: Math.floor(Math.random() * 50) + 40,
                trait: ['Paranoid Ideation', 'Authority Challenge', 'Pattern Seeking'],
                verdict: 'HIGH COGNITIVE HAZARD'
            });
            setProfiling(false);
        }, 2500);
    };

    return { t, language, author, onBack, onSearchRelated, activeTab, setActiveTab, runPsychProfile, profiling, profileData };
};

const AuthorDetailContext = createContext<ReturnType<typeof useAuthorDetailLogic> | undefined>(undefined);
const useAuthorDetail = () => {
    const ctx = useContext(AuthorDetailContext);
    if (!ctx) throw new Error('useAuthorDetail missing provider');
    return ctx;
};

// --- 2. Advanced Sub-Components ---

const TimelineVisualizer: React.FC<{ lifespan: string }> = ({ lifespan }) => {
    const [start, end] = lifespan.split('–').map(s => s === 'Present' ? new Date().getFullYear() : parseInt(s));
    const duration = (end || new Date().getFullYear()) - start;
    const activeStart = start + 20; // Assume active from 20yo
    
    return (
        <div className="mt-6 border-t border-slate-800 pt-6">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <History size={12} /> Temporal Activity
            </h4>
            <div className="relative h-12 w-full bg-slate-900/50 rounded-lg border border-slate-800 flex items-center px-4 overflow-hidden">
                {/* Base Line */}
                <div className="w-full h-0.5 bg-slate-700 relative">
                    <div 
                        className="absolute top-1/2 -translate-y-1/2 h-1 bg-accent-cyan shadow-[0_0_10px_cyan]"
                        style={{ left: '20%', width: `${Math.min(80, (duration / 100) * 80)}%` }} // Simplified visual approx
                    ></div>
                    {/* Markers */}
                    <div className="absolute top-2 left-[20%] text-[9px] font-mono text-slate-400">{start}</div>
                    <div className="absolute top-2 right-[20%] text-[9px] font-mono text-slate-400">{end || 'NOW'}</div>
                </div>
            </div>
        </div>
    );
};

const PsychProfileView: React.FC = () => {
    const { profiling, profileData, runPsychProfile } = useAuthorDetail();

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
                <h3 className="text-lg font-bold text-white mb-2">NEURAL PROFILING REQUIRED</h3>
                <p className="text-slate-400 text-sm mb-6 max-w-sm">
                    Activate Gemini 2.5 forensic algorithms to analyze rhetorical patterns and cognitive biases.
                </p>
                <Button onClick={runPsychProfile} icon={<Fingerprint size={16} />} className="shadow-neon-cyan">
                    INITIATE SCAN
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 md:p-8 animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><Fingerprint size={120} /></div>
            
            <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                <h3 className="text-sm font-bold text-accent-purple uppercase tracking-widest flex items-center gap-2">
                    <Activity size={16} /> Cognitive Forensics
                </h3>
                <Badge label={profileData.verdict} className="bg-red-950/50 text-red-500 border-red-900 animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Stats */}
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">RHETORIC INTENSITY</div>
                        <div className="h-2 bg-slate-900 rounded-full overflow-hidden"><div className="h-full bg-purple-500" style={{width: `${profileData.rhetoric}%`}}></div></div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">LOGICAL CONSISTENCY</div>
                        <div className="h-2 bg-slate-900 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{width: `${profileData.logic}%`}}></div></div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">EMOTIONAL MANIPULATION</div>
                        <div className="h-2 bg-slate-900 rounded-full overflow-hidden"><div className="h-full bg-red-500" style={{width: `${profileData.emotion}%`}}></div></div>
                    </div>
                </div>

                {/* Traits */}
                <div className="md:col-span-2 bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-3">Detected Patterns</h4>
                    <div className="flex flex-wrap gap-2">
                        {profileData.trait.map((t: string, i: number) => (
                            <div key={i} className="px-3 py-2 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-slate-300 flex items-center gap-2">
                                <Lock size={10} className="text-red-400" /> {t}
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-xs text-slate-400 font-mono leading-relaxed p-3 bg-black/40 rounded border-l-2 border-accent-purple">
                        "Subject demonstrates high capability in narrative weaving. Suggests localized reality distortion field active around key works."
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 3. Main Sections ---

const DetailHeader: React.FC = () => {
    const { author, t, onBack } = useAuthorDetail();
    if (!author) return null;
    return (
        <PageHeader 
            title={author.name}
            subtitle={`DOSSIER: ${author.id.toUpperCase()}`}
            icon={User}
            status="CLASSIFIED LEVEL 3"
            statusColor="bg-purple-500"
            visualizerState="BUSY"
            actions={<Button variant="ghost" onClick={onBack} size="sm" icon={<ArrowLeft size={16} />}>{t.detail.back}</Button>}
        />
    );
};

const DetailContent: React.FC = () => {
    const { author, activeTab, setActiveTab, t, language } = useAuthorDetail();
    if (!author) return <div className="text-center p-20 text-red-500 font-mono">FILE CORRUPTED OR MISSING</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Left Column: Bio Card */}
            <div className="lg:col-span-4 space-y-6">
                <Card className="p-0 bg-slate-900 border-slate-800 overflow-hidden relative group">
                    <div className="h-64 overflow-hidden relative">
                        <img src={author.imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
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
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2"><Zap size={14} className="text-yellow-500"/> Influence</span>
                            <div className="text-2xl font-black text-white font-display">{author.influenceLevel} <span className="text-sm text-slate-600 font-mono">/100</span></div>
                        </div>
                        
                        <div>
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Book size={12}/> {t.authors.works}</h4>
                            <ul className="space-y-2">
                                {author.keyWorks.map((work, i) => (
                                    <li key={i} className="text-sm text-slate-300 pl-3 border-l-2 border-slate-700 hover:border-accent-cyan hover:text-white transition-colors cursor-default py-1">
                                        {work}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <TimelineVisualizer lifespan={author.lifespan} />
                    </div>
                </Card>
            </div>

            {/* Right Column: Tabs & Content */}
            <div className="lg:col-span-8">
                <div className="flex gap-1 mb-6 border-b border-slate-800">
                    <button onClick={() => setActiveTab('BIO')} className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'BIO' ? 'border-accent-cyan text-accent-cyan' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Biography</button>
                    <button onClick={() => setActiveTab('PSYCH')} className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'PSYCH' ? 'border-accent-purple text-accent-purple' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Psych Profile</button>
                </div>

                {activeTab === 'BIO' && (
                    <div className="space-y-6 animate-fade-in">
                        <Card variant="glass" className="p-8">
                            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none"><Globe size={120} /></div>
                            <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-4 flex items-center gap-2"><User size={20} className="text-accent-cyan"/> Profile Summary</h3>
                            <div className="prose prose-invert max-w-none text-slate-300 leading-loose font-sans text-base">
                                <p>{language === 'de' ? author.bioDe : author.bioEn}</p>
                            </div>
                        </Card>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="p-6 border-slate-800 bg-slate-900/50">
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-3">Focus Areas</h4>
                                <div className="flex flex-wrap gap-2">
                                    {author.focusAreas.map(area => <Badge key={area} label={area} className="bg-slate-800 border-slate-700 text-slate-400" />)}
                                </div>
                            </Card>
                            <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 flex items-center justify-center">
                                <Button variant="secondary" size="sm" icon={<Search size={14} />} className="text-xs">Search Database for Author</Button>
                            </Card>
                        </div>
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
