
import React, { useEffect, useState, createContext, useContext } from 'react';
import { MediaItem, MediaAnalysisResponse, MediaType } from '../types';
import { analyzeMediaWithGemini } from '../services/geminiService';
import { MEDIA_ITEMS } from '../constants';
import { AUTHORS_FULL } from '../data/enriched';
import { 
  ArrowLeft, Film, Book, Gamepad2, Tv, LayoutGrid, 
  Clapperboard, Eye, Calendar, User, Zap, Brain, 
    ExternalLink, Search, Download
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSettings } from '../contexts/SettingsContext';
import { Button, Card, Badge, PageFrame, PageHeader } from './ui/Common';
import { GenerationHUD } from './ui/GenerationHUD';
import { ReferencesModal } from './ui/ReferencesModal';
import { useNavigate, useParams } from 'react-router-dom';
import { downloadFactCheckReport } from '../utils/factCheckReport';

// --- 1. Logic Hook ---

const useMediaDetailLogic = () => {
    const { mediaId } = useParams<{ mediaId: string }>();
    const navigate = useNavigate();
    const { language, t } = useLanguage();
    const { settings } = useSettings();
    
    const [item, setItem] = useState<MediaItem | null>(null);
    const [analysis, setAnalysis] = useState<MediaAnalysisResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [isReferencesOpen, setIsReferencesOpen] = useState(false);

    useEffect(() => {
        const found = MEDIA_ITEMS.find(i => i.id === mediaId);
        if (found) {
            setItem(found);
            // Start Analysis
            const loadAnalysis = async () => {
                setLoading(true);
                const res = await analyzeMediaWithGemini(found, language, { 
                    model: settings.aiModelVersion,
                    temperature: 0.7 
                });
                setAnalysis(res);
                setLoading(false);
            };
            loadAnalysis();
        } else {
            setLoading(false);
        }
    }, [mediaId, language, settings.aiModelVersion]);

    const onBack = () => navigate('/media');
    const onNavigateToArchive = (tag: string) => navigate(`/archive?filter=${encodeURIComponent(tag)}`);
    const onNavigateToAuthor = (authorId: string) => navigate(`/authors/${authorId}`);

    const onExportReport = () => {
        if (!item) return;

        const findings = [
            analysis?.predictiveProgramming,
            language === 'de' ? item.factCheckNoteDe : item.factCheckNoteEn,
            language === 'de' ? item.whyItSpreadsDe : item.whyItSpreadsEn,
        ].filter((entry): entry is string => Boolean(entry));

        const references = [
            item.sourceUrl
                ? {
                    title: `${item.title} ${t.mediaPage.detail.sourceLabel}`,
                    url: item.sourceUrl,
                    sourceType: 'WEB',
                }
                : null,
            ...item.relatedTheoryTags.map((tag) => ({
                title: `${t.mediaPage.detail.archiveTag}: ${tag}`,
                sourceType: 'INTERNAL',
            })),
        ].filter((entry): entry is { title: string; url?: string; sourceType?: string } => Boolean(entry));

        downloadFactCheckReport({
            generatedAt: new Date().toISOString(),
            reportType: 'MEDIA',
            id: item.id,
            title: item.title,
            language,
            summary: language === 'de' ? item.descriptionDe : item.descriptionEn,
            findings,
            references,
            disclaimer: language === 'de' ? item.disclaimerDe : item.disclaimerEn,
            metadata: {
                mediaType: item.type,
                year: item.year,
                creator: item.creator,
                verdict: item.factCheckVerdict,
            },
        });
    };

    return {
        item,
        analysis,
        loading,
        language,
        t,
        isReferencesOpen,
        setIsReferencesOpen,
        onExportReport,
        onBack,
        onNavigateToArchive,
        onNavigateToAuthor
    };
};

// --- 2. Context & Provider ---

type MediaDetailContextType = ReturnType<typeof useMediaDetailLogic>;
const MediaDetailContext = createContext<MediaDetailContextType | undefined>(undefined);

const useMediaDetail = () => {
    const context = useContext(MediaDetailContext);
    if (!context) throw new Error('useMediaDetail must be used within a MediaDetailProvider');
    return context;
};

const MediaDetailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const logic = useMediaDetailLogic();
    return <MediaDetailContext.Provider value={logic}>{children}</MediaDetailContext.Provider>;
};

// --- 3. Sub-Components ---

const MediaTypeIcon: React.FC<{ type: MediaType, size?: number }> = ({ type, size=24 }) => {
    switch(type) {
        case 'MOVIE': return <Film size={size} />;
        case 'BOOK': return <Book size={size} />;
        case 'GAME': return <Gamepad2 size={size} />;
        case 'SERIES': return <Tv size={size} />;
        case 'VIDEO': return <Film size={size} />;
        case 'ARTICLE': return <Book size={size} />;
        case 'IMAGE': return <Eye size={size} />;
        case 'COMIC': return <LayoutGrid size={size} />;
        default: return <LayoutGrid size={size} />;
    }
};

const getComplexityColor = (c: MediaItem['complexity']) => {
    switch(c) {
        case 'LOW': return 'bg-green-500/20 text-green-400 border-green-500/50';
        case 'MEDIUM': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50';
        case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
        case 'MINDBENDING': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
    }
};

const MediaDetailHeader: React.FC = () => {
    const { item, loading, onBack, onExportReport, t } = useMediaDetail();
    if (!item) return null;

    return (
        <PageHeader 
            title={t.mediaPage.detail.databaseTitle}
            subtitle={`${t.mediaPage.detail.filePrefix}: ${item.id.toUpperCase()}`}
            icon={Clapperboard}
            status={t.mediaPage.detail.decoding}
            statusColor={loading ? "bg-yellow-500" : "bg-green-500"}
            actions={
                <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={onExportReport} size="sm" icon={<Download size={14} />}>
                        {t.detail.report}
                    </Button>
                    <Button variant="ghost" onClick={onBack} size="sm" icon={<ArrowLeft size={16} />}>
                        {t.detail.backToLibrary}
                    </Button>
                </div>
            }
        />
    );
};

const MediaDetailHero: React.FC = () => {
    const { item, language, t } = useMediaDetail();
    if (!item) return <div className="p-8 text-center text-red-500">{t.mediaPage.detail.itemNotFound}</div>;

    return (
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl mb-8 min-h-[400px] flex flex-col md:flex-row group">
            {/* Backdrop / Poster Area */}
            <div className="md:w-1/3 lg:w-1/4 relative min-h-[300px] bg-black">
                 {item.imageUrl ? (
                    <img src={item.imageUrl} alt={`Titelbild: ${item.title}`} className="absolute inset-0 w-full h-full object-cover opacity-80" />
                 ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
                        <div className="opacity-20 transform scale-150 mb-4">
                            <MediaTypeIcon type={item.type} size={80} />
                        </div>
                        <div className="font-mono text-xs text-slate-600 uppercase tracking-widest border border-slate-700 px-2 py-1 rounded">{t.mediaPage.noSignal}</div>
                    </div>
                 )}
                 {/* Scanline Overlay */}
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay pointer-events-none"></div>
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r pointer-events-none"></div>
            </div>

            {/* Info Area */}
            <div className="flex-1 p-6 md:p-10 relative z-10 flex flex-col justify-end md:justify-center">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge label={item.type} className="bg-slate-800 text-slate-300 border-slate-700" />
                    {item.factCheckVerdict && (
                        <Badge label={`VERDICT: ${item.factCheckVerdict}`} className="bg-yellow-950/40 text-yellow-300 border-yellow-700/40" />
                    )}
                    <span className="flex items-center gap-1 text-slate-400 font-mono text-xs">
                        <Calendar size={12} /> {item.year}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400 font-mono text-xs border-l border-slate-700 pl-3 ml-1">
                        <User size={12} /> {item.creator}
                    </span>
                </div>

                <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-none drop-shadow-lg">
                    {item.title}
                </h1>

                <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl mb-6">
                    {language === 'de' ? item.descriptionDe : item.descriptionEn}
                </p>

                {(item.satiricalCounterpartTitle || item.satiricalPreviewDe || item.satiricalPreviewEn) && (
                    <div className="mb-5 p-3 rounded border border-accent-purple/30 bg-accent-purple/5 max-w-2xl">
                        <div className="text-[10px] uppercase font-bold tracking-widest text-accent-purple mb-1">{t.mediaPage.detail.satiricalCounterpart}</div>
                        {item.satiricalCounterpartTitle && <div className="text-sm text-white mb-1">{item.satiricalCounterpartTitle}</div>}
                        <div className="text-xs text-slate-300">
                            {language === 'de' ? item.satiricalPreviewDe : item.satiricalPreviewEn}
                        </div>
                    </div>
                )}

                {/* Metrics */}
                <div className="flex flex-col sm:flex-row gap-6 mt-4 border-t border-slate-800/50 pt-6">
                    <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">{t.mediaPage.labels.realityScore}</div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-24 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-accent-cyan shadow-[0_0_10px_cyan]" style={{ width: `${item.realityScore}%` }}></div>
                            </div>
                            <span className="font-mono text-accent-cyan font-bold">{item.realityScore}%</span>
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">{t.mediaPage.labels.complexity}</div>
                        <div className={`px-2 py-0.5 rounded border text-[10px] font-bold inline-block ${getComplexityColor(item.complexity)}`}>
                            {item.complexity} {t.mediaPage.detail.levelSuffix}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MediaDetailAnalysis: React.FC = () => {
    const { analysis, loading, t } = useMediaDetail();

    if (loading) {
        return (
            <div className="lg:col-span-2 min-h-[300px] flex items-center justify-center">
                <GenerationHUD mode="ANALYSIS" isVisible={true} className="w-full" />
            </div>
        );
    }

    return (
        <div className="lg:col-span-2 space-y-6">
            {/* Plot / Narrative */}
            <Card className="p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                    <Book size={100} />
                </div>
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                    <Search size={16} className="text-accent-cyan" /> {t.mediaPage.labels.narrative}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                    {analysis?.plotSummary || t.mediaPage.detail.analysisUnavailable}
                </p>
            </Card>

            {/* Hidden Symbolism */}
            <Card className="p-6 bg-slate-900/80 border-purple-500/20">
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                    <Eye size={16} className="text-accent-purple" /> {t.mediaPage.labels.symbolism}
                </h3>
                <div className="prose prose-invert prose-sm">
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {analysis?.hiddenSymbolism}
                    </p>
                </div>
            </Card>

            {/* Predictive Programming */}
            <Card className="p-6 border-red-500/20 bg-gradient-to-br from-slate-900 to-red-950/10">
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                    <Zap size={16} className="text-red-500" /> {t.mediaPage.labels.predictive}
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                    {analysis?.predictiveProgramming}
                </p>
            </Card>
        </div>
    );
};

const MediaDetailConnections: React.FC = () => {
    const { analysis, loading, item, onNavigateToArchive, onNavigateToAuthor, language, setIsReferencesOpen, t } = useMediaDetail();
    if (!item) return null;

    if (loading) return null; // Let the HUD take space

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Real World Parallels */}
            <Card className="p-6 bg-slate-950 border-slate-800">
                <h3 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <Brain size={14} /> {t.mediaPage.labels.parallels}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-mono whitespace-pre-wrap">
                    {analysis?.realWorldParallels}
                </p>
            </Card>

            {/* Tags / Links */}
            <Card className="p-6">
                <h3 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <ExternalLink size={14} /> {t.mediaPage.labels.related}
                </h3>
                <div className="flex flex-wrap gap-2">
                    {item.relatedTheoryTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => onNavigateToArchive(tag)}
                            className="px-3 py-2 rounded bg-slate-900 hover:bg-accent-cyan/10 border border-slate-800 hover:border-accent-cyan text-xs text-slate-400 hover:text-accent-cyan transition-all flex items-center gap-2 group"
                        >
                            <Search size={12} className="group-hover:scale-110 transition-transform" />
                            {tag}
                        </button>
                    ))}
                </div>
            </Card>

            {item.linkedAuthorIds && item.linkedAuthorIds.length > 0 && (
                <Card className="p-6">
                    <h3 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                        <User size={14} /> {t.mediaPage.detail.linkedAuthors}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {item.linkedAuthorIds.map((authorId) => {
                            const author = AUTHORS_FULL.find((a) => a.id === authorId);
                            return (
                                <button
                                    key={authorId}
                                    onClick={() => onNavigateToAuthor(authorId)}
                                    className="px-3 py-2 rounded bg-slate-900 hover:bg-accent-cyan/10 border border-slate-800 hover:border-accent-cyan text-xs text-slate-400 hover:text-accent-cyan transition-all"
                                >
                                    {author?.name || authorId}
                                </button>
                            );
                        })}
                    </div>
                </Card>
            )}

            <Card className="p-6 bg-slate-950 border-slate-800">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Search size={14} /> {t.mediaPage.detail.factCheckLearning}
                    </h3>
                    <Button size="sm" variant="secondary" onClick={() => setIsReferencesOpen(true)}>
                        {t.detail.references}
                    </Button>
                </div>
                {item.sourceUrl && (
                    <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="text-xs text-accent-cyan underline break-all">
                        {item.sourceUrl}
                    </a>
                )}
                <p className="text-xs text-slate-300 mt-3">{language === 'de' ? item.factCheckNoteDe : item.factCheckNoteEn}</p>
                <p className="text-xs text-slate-400 mt-2">{language === 'de' ? item.whyItSpreadsDe : item.whyItSpreadsEn}</p>
                <p className="text-xs text-accent-cyan mt-2">{language === 'de' ? item.learningPromptDe : item.learningPromptEn}</p>
                <p className="text-[11px] text-yellow-300/90 mt-3">{language === 'de' ? item.disclaimerDe : item.disclaimerEn}</p>
            </Card>
        </div>
    );
};

// --- 4. Main Component ---

export const MediaDetail: React.FC = () => {
  const references = useMediaDetailLogic();

  return (
    <MediaDetailContext.Provider value={references}>
        <PageFrame>
            <MediaDetailHeader />
            <MediaDetailHero />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <MediaDetailAnalysis />
                <MediaDetailConnections />
            </div>

            <ReferencesModal
                isOpen={references.isReferencesOpen}
                onClose={() => references.setIsReferencesOpen(false)}
                title={references.item?.title || references.t.detail.mediaReferences}
                references={[
                    references.item?.sourceUrl
                        ? {
                            title: `${references.item.title} ${references.t.mediaPage.detail.sourceLabel}`,
                            url: references.item.sourceUrl,
                            sourceType: 'WEB',
                        }
                        : null,
                    ...(references.item?.relatedTheoryTags || []).map((tag) => ({
                        title: `${references.t.mediaPage.detail.archiveTag}: ${tag}`,
                        sourceType: 'INTERNAL',
                    })),
                ].filter((entry): entry is { title: string; url?: string; sourceType?: string } => Boolean(entry))}
            />
        </PageFrame>
    </MediaDetailContext.Provider>
  );
};

export default MediaDetail;
