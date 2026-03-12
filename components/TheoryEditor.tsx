import React, {
  useState, useEffect, useMemo, createContext, useContext
} from 'react';
import {
  Theory, Category, CategoryEn, DangerLevel, DangerLevelEn
} from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addTheory, updateTheory, selectAllTheories } from '../store/slices/theoriesSlice';
import {
  PageFrame, PageHeader, Card, Button, Badge
} from './ui/Common';
import { GenerationHUD, HUDMode } from './ui/GenerationHUD';
import { enhanceTheoryContent, generateTheoryImage } from '../services/geminiService';
import { generateArt } from '../utils/artEngine';
import { MEDIA_ITEMS } from '../constants';
import { AUTHORS_FULL } from '../data/enriched';
import {
  Save, X, Edit3, Tag, Eye, Sparkles, RefreshCw, Wand2, Hash, Brain, ShieldAlert, FileText, ImagePlus, Play, User, Film
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

// --- 1. Logic Hook ---

const useTheoryEditorLogic = () => {
    const { t, language } = useLanguage();
    const { showToast } = useToast();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { theoryId } = useParams<{ theoryId: string }>();
    const allTheories = useAppSelector(selectAllTheories);
    
    const existingTheory = useMemo(() => 
        theoryId ? allTheories.find(t => t.id === theoryId) : null,
    [theoryId, allTheories]);

    // Initial State Setup
    const initialTheory: Theory = useMemo(() => ({
        id: `custom_${crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Date.now().toString(36)}`,
        title: '',
        shortDescription: '',
        category: language === 'de' ? Category.MODERN_MYTHS : CategoryEn.MODERN_MYTHS,
        dangerLevel: language === 'de' ? DangerLevel.LOW : DangerLevelEn.LOW,
        popularity: 50,
        originYear: new Date().getFullYear().toString(),
        tags: [],
        imageUrl: '',
        isUserCreated: true,
        lastEdited: Date.now()
    }), [language]);

    const [formState, setFormState] = useState<Theory>(existingTheory || initialTheory);
    const [tagInput, setTagInput] = useState('');
    const [touched, setTouched] = useState(false);
    
    // AI States
    const [aiMode, setAiMode] = useState<HUDMode | null>(null);
    const [aiAction, setAiAction] = useState<string | null>(null);
    const [redTeamAnalysis, setRedTeamAnalysis] = useState<string | null>(null);

    // Image Gen State
    const [imagePrompt, setImagePrompt] = useState('');

    const relatedMedia = useMemo(() => {
        const queryTokens = [formState.title, ...formState.tags]
            .join(' ')
            .toLowerCase()
            .split(/\s+/)
            .filter((token) => token.length > 2);

        if (!queryTokens.length) return [];

        return MEDIA_ITEMS.filter((item) => {
            const haystack = [
                item.title,
                language === 'de' ? item.descriptionDe : item.descriptionEn,
                ...(item.tags || []),
                ...(item.relatedTheoryTags || []),
            ].join(' ').toLowerCase();

            return queryTokens.some((token) => haystack.includes(token));
        }).slice(0, 6);
    }, [formState.title, formState.tags, language]);

    const relatedAuthors = useMemo(() => {
        const mediaAuthorIds = new Set(relatedMedia.flatMap((item) => item.linkedAuthorIds || []));
        const queryTokens = [formState.title, ...formState.tags]
            .join(' ')
            .toLowerCase()
            .split(/\s+/)
            .filter((token) => token.length > 2);

        return AUTHORS_FULL.filter((author) => {
            const authorText = [author.name, ...(author.focusAreas || []), ...(author.keyWorks || [])].join(' ').toLowerCase();
            const matchesQuery = queryTokens.some((token) => authorText.includes(token));
            const matchesMedia = mediaAuthorIds.has(author.id);
            return matchesQuery || matchesMedia;
        }).slice(0, 6);
    }, [formState.title, formState.tags, relatedMedia]);

    // Reset when theory changes
    useEffect(() => {
        if (existingTheory) {
            setFormState(existingTheory);
        } else {
            setFormState(initialTheory);
        }
        setTouched(false);
        setRedTeamAnalysis(null);
    }, [existingTheory, initialTheory]);

    // Auto-Generate Art if missing (Procedural Fallback)
    useEffect(() => {
        if (!formState.imageUrl && formState.title) {
            const art = generateArt(formState.id, formState.category, formState.title);
            setFormState(prev => ({ ...prev, imageUrl: art }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formState.title, formState.category, formState.id]);

    const categories = language === 'de' ? Object.values(Category) : Object.values(CategoryEn);
    const dangerLevels = language === 'de' ? Object.values(DangerLevel) : Object.values(DangerLevelEn);

    const handleChange = (field: keyof Theory, value: Theory[keyof Theory]) => {
        setFormState(prev => ({ ...prev, [field]: value }));
        setTouched(true);
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formState.tags.includes(tagInput.trim())) {
            setFormState(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
            setTagInput('');
            setTouched(true);
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormState(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
        setTouched(true);
    };

    // --- AI FUNCTIONS ---

    const handleAiEnhance = async (mode: 'EXPAND' | 'RED_TEAM' | 'TAGS') => {
        if (!formState.title || !formState.shortDescription) {
            showToast('Input vectors incomplete. Title and draft required.', 'warning');
            return;
        }

        setAiMode(mode === 'RED_TEAM' ? 'ANALYSIS' : 'CREATIVE');
        setAiAction(mode);

        try {
            const result = await enhanceTheoryContent(formState.title, formState.shortDescription, mode, language);
            
            if (mode === 'EXPAND' && typeof result === 'string') {
                setFormState(prev => ({ ...prev, shortDescription: result }));
                setTouched(true);
            } else if (mode === 'TAGS' && Array.isArray(result)) {
                setFormState(prev => ({ ...prev, tags: [...new Set([...prev.tags, ...result])] }));
                setTouched(true);
            } else if (mode === 'RED_TEAM' && typeof result === 'string') {
                setRedTeamAnalysis(result);
            }
            showToast(`Neural Operation [${mode}] Complete.`, 'success');
        } catch {
            showToast('Neural Uplink Failed.', 'error');
        } finally {
            setAiMode(null);
            setAiAction(null);
        }
    };

    // Art Function: Real Generative AI
    const handleGenerateImage = async () => {
        if (!formState.title) return;
        setAiMode('IMAGE');
        try {
            // Use custom prompt if typed, otherwise default
            const promptToUse = imagePrompt || undefined; 
            const art = await generateTheoryImage(formState, language, promptToUse);
            if (art) {
                setFormState(prev => ({ ...prev, imageUrl: art }));
                setTouched(true);
                showToast('Visual evidence synthesized.', 'success');
            } else {
                // Fallback
                const procArt = generateArt(formState.id, formState.category, formState.title);
                setFormState(prev => ({ ...prev, imageUrl: procArt }));
                showToast('GenAI busy. Fallback protocol engaged.', 'warning');
            }
        } catch {
            showToast('Image synthesis failed.', 'error');
        } finally {
            setAiMode(null);
        }
    };

    // Art Function: Procedural Reset
    const handleProceduralArt = () => {
        const seed = Math.random().toString(36).substring(7);
        const art = generateArt(formState.id, formState.category, formState.title + seed);
        setFormState(prev => ({ ...prev, imageUrl: art }));
        setTouched(true);
    };

    const handleSave = () => {
        if (!formState.title || !formState.shortDescription) {
            showToast(language === 'de' ? 'Titel und Beschreibung fehlen.' : 'Title and description required.', 'error');
            return;
        }

        const payload = { 
            ...formState, 
            lastEdited: Date.now(),
            imageUrl: formState.imageUrl || generateArt(formState.id, formState.category, formState.title)
        };

        if (existingTheory) {
            dispatch(updateTheory({ lang: language, theory: payload }));
            showToast('Dossier updated.', 'success');
        } else {
            dispatch(addTheory({ lang: language, theory: payload }));
            showToast('New file encrypted and archived.', 'success');
        }
        
        if (existingTheory) {
            navigate(`/archive/${existingTheory.id}`);
        } else {
            navigate('/archive');
        }
    };

    const handleCancel = () => {
        if (touched && !confirm('Discard uncommitted data?')) return;
        navigate(-1);
    };

    return {
        t,
        language,
        existingTheory,
        formState,
        categories,
        dangerLevels,
        tagInput,
        setTagInput,
        touched,
        aiMode,
        aiAction,
        redTeamAnalysis,
        imagePrompt, setImagePrompt,
        relatedAuthors,
        relatedMedia,
        onOpenAuthor: (authorId: string) => navigate(`/authors/${authorId}`),
        onOpenMedia: (mediaId: string) => navigate(`/media/${mediaId}`),
        handleChange,
        handleAddTag,
        handleRemoveTag,
        handleAiEnhance,
        handleGenerateImage,
        handleProceduralArt,
        handleSave,
        handleCancel
    };
};

// --- 2. Context & Provider ---

type TheoryEditorContextType = ReturnType<typeof useTheoryEditorLogic>;
const TheoryEditorContext = createContext<TheoryEditorContextType | undefined>(undefined);

const useTheoryEditor = () => {
    const context = useContext(TheoryEditorContext);
    if (!context) throw new Error('useTheoryEditor must be used within a TheoryEditorProvider');
    return context;
};

const TheoryEditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const logic = useTheoryEditorLogic();
    return <TheoryEditorContext.Provider value={logic}>{children}</TheoryEditorContext.Provider>;
};

// --- 3. Sub-Components ---

const PredictiveMetrics: React.FC = () => {
    const { formState } = useTheoryEditor();
    
    // Heuristic Calculation for Visual Feedback
    const wordCount = formState.shortDescription.split(' ').length;
    const keywords = ['UFO', 'Geheim', 'Secret', 'Alien', 'Government', 'Regierung', 'Plot', 'Verschwörung', 'Truth', 'Wahrheit'];
    const keywordMatches = keywords.filter(k => formState.shortDescription.toLowerCase().includes(k.toLowerCase())).length;
    
    const viralityScore = Math.min(100, Math.floor((wordCount / 2) + (keywordMatches * 10) + formState.popularity * 0.2));
    const dangerScore = formState.dangerLevel.includes('High') || formState.dangerLevel.includes('Extreme') ? 90 : 
                       formState.dangerLevel.includes('Medium') ? 50 : 20;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-lg flex items-center gap-3">
                <div className="relative w-10 h-10 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path className="text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                        <path className="text-accent-cyan transition-all duration-1000" strokeDasharray={`${viralityScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    </svg>
                    <div className="absolute text-[10px] font-bold text-accent-cyan">{viralityScore}%</div>
                </div>
                <div>
                    <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Virality Prediction</div>
                    <div className="text-xs text-slate-300">Based on heuristics</div>
                </div>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-lg flex items-center gap-3">
                <ShieldAlert size={24} className={dangerScore > 70 ? "text-red-500 animate-pulse" : "text-green-500"} />
                <div>
                    <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Threat Index</div>
                    <div className={`text-xs font-bold ${dangerScore > 70 ? 'text-red-400' : 'text-green-400'}`}>
                        {dangerScore > 70 ? 'CRITICAL' : 'STABLE'}
                    </div>
                </div>
            </div>
        </div>
    );
};

const EditorHeader: React.FC = () => {
    const { existingTheory, t, touched, handleCancel, handleSave } = useTheoryEditor();
    
    return (
        <PageHeader 
            title={existingTheory ? t.editor.titleEdit : t.editor.titleNew}
            subtitle="THEORY LABORATORY // SECURE ENVIRONMENT"
            icon={Edit3}
            status={touched ? "UNCOMMITTED CHANGES" : "READY"}
            statusColor={touched ? "bg-yellow-500" : "bg-green-500"}
            actions={
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={handleCancel} icon={<X size={16} />}>
                        {t.common.cancel}
                    </Button>
                    <Button variant="primary" onClick={handleSave} icon={<Save size={16} />} className="shadow-neon-cyan px-6">
                        {t.common.save}
                    </Button>
                </div>
            }
        />
    );
};

const MainInfoForm: React.FC = () => {
    const { formState, handleChange, handleAiEnhance, aiMode, aiAction, t } = useTheoryEditor();
    
    return (
        <Card className="p-6 space-y-6 bg-slate-900/50 border-slate-800 relative flex flex-col h-full">
            {aiMode && aiMode !== 'IMAGE' && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-xl animate-fade-in">
                    <GenerationHUD mode={aiMode} isVisible={true} className="w-3/4 max-w-sm" />
                    <div className="mt-4 text-xs font-mono text-accent-cyan animate-pulse">PROCESSING: {aiAction}</div>
                </div>
            )}

            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <FileText size={14} className="text-accent-cyan"/> {t.editor.labels.title}
                    </label>
                </div>
                <input 
                    type="text" 
                    value={formState.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-accent-cyan outline-none transition-all font-bold text-lg focus:ring-1 focus:ring-accent-cyan placeholder-slate-600"
                    placeholder={t.editor.placeholders.title}
                />
            </div>
            
            <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Brain size={14} className="text-accent-purple"/> {t.editor.labels.desc}
                    </label>
                    <div className="flex gap-1 flex-wrap">
                        <button 
                            onClick={() => handleAiEnhance('EXPAND')}
                            className="px-2.5 py-2 sm:px-2 sm:py-1 bg-accent-purple/10 hover:bg-accent-purple/20 text-accent-purple text-[10px] font-bold uppercase rounded border border-accent-purple/30 flex items-center gap-1 transition-all min-h-[44px] sm:min-h-0"
                            title="Expand short text into full narrative"
                        >
                            <Wand2 size={10} /> Expand
                        </button>
                        <button 
                            onClick={() => handleAiEnhance('TAGS')}
                            className="px-2.5 py-2 sm:px-2 sm:py-1 bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan text-[10px] font-bold uppercase rounded border border-accent-cyan/30 flex items-center gap-1 transition-all min-h-[44px] sm:min-h-0"
                            title="Auto-extract tags"
                        >
                            <Hash size={10} /> Tags
                        </button>
                    </div>
                </div>
                <div className="relative flex-1">
                    <textarea 
                        value={formState.shortDescription}
                        onChange={(e) => handleChange('shortDescription', e.target.value)}
                        className="w-full h-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-slate-300 focus:border-accent-cyan outline-none transition-all resize-none leading-relaxed text-sm font-sans focus:ring-1 focus:ring-accent-cyan min-h-[250px]"
                        placeholder={t.editor.placeholders.desc}
                    />
                    <div className="absolute bottom-2 right-2 text-[9px] text-slate-600 font-mono bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                        {formState.shortDescription.length} chars
                    </div>
                </div>
            </div>
        </Card>
    );
};

const VulnerabilityAssessment: React.FC = () => {
    const { redTeamAnalysis, handleAiEnhance } = useTheoryEditor();

    if (!redTeamAnalysis) {
        return (
            <div className="bg-slate-900/30 border border-dashed border-slate-700 rounded-xl p-6 text-center">
                <ShieldAlert size={32} className="mx-auto mb-3 text-slate-600" />
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Red Team Module Offline</h3>
                <p className="text-xs text-slate-500 mb-4">Run AI logic check to identify narrative gaps.</p>
                <Button variant="secondary" size="sm" onClick={() => handleAiEnhance('RED_TEAM')} icon={<Play size={12}/>} className="text-[10px]">
                    Run Logic Scan
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-red-950/10 border border-red-900/30 rounded-xl p-4 animate-fade-in">
            <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2 mb-3 border-b border-red-900/30 pb-2">
                <ShieldAlert size={14} /> Vulnerability Report
            </h3>
            <div className="prose prose-invert prose-sm max-w-none text-xs text-slate-300 leading-relaxed font-mono">
                <pre className="whitespace-pre-wrap font-sans">{redTeamAnalysis}</pre>
            </div>
            <div className="mt-3 text-right">
                <button onClick={() => handleAiEnhance('RED_TEAM')} className="text-[10px] text-red-400 hover:text-white underline">Re-Scan</button>
            </div>
        </div>
    );
};

const CrossLinkPanel: React.FC = () => {
    const { t, relatedAuthors, relatedMedia, onOpenAuthor, onOpenMedia } = useTheoryEditor();

    return (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 space-y-4">
            <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">{t.editor.crossLinks.title}</h3>
                <p className="text-[10px] text-slate-500 mt-1">{t.editor.crossLinks.subtitle}</p>
            </div>

            {relatedAuthors.length === 0 && relatedMedia.length === 0 ? (
                <div className="text-xs text-slate-500">{t.editor.crossLinks.none}</div>
            ) : (
                <>
                    <div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-2 flex items-center gap-2"><User size={12} /> {t.editor.crossLinks.relatedAuthors}</div>
                        <div className="flex flex-wrap gap-2">
                            {relatedAuthors.map((author) => (
                                <button key={author.id} onClick={() => onOpenAuthor(author.id)} className="px-2 py-1 text-[10px] border border-slate-700 rounded bg-slate-950 text-slate-300 hover:border-accent-cyan hover:text-accent-cyan transition-colors">
                                    {author.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-2 flex items-center gap-2"><Film size={12} /> {t.editor.crossLinks.relatedMedia}</div>
                        <div className="flex flex-wrap gap-2">
                            {relatedMedia.map((media) => (
                                <button key={media.id} onClick={() => onOpenMedia(media.id)} className="px-2 py-1 text-[10px] border border-slate-700 rounded bg-slate-950 text-slate-300 hover:border-accent-purple hover:text-accent-purple transition-colors">
                                    {media.title}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const MetadataPanel: React.FC = () => {
    const { formState, handleChange, categories, dangerLevels, tagInput, setTagInput, handleAddTag, handleRemoveTag, t } = useTheoryEditor();

    return (
        <div className="space-y-6">
            {/* Classifiers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t.editor.labels.category}</label>
                    <select 
                        value={formState.category}
                        onChange={(e) => handleChange('category', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:border-accent-cyan outline-none transition-all hover:bg-slate-800"
                    >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t.editor.labels.threat}</label>
                    <select 
                        value={formState.dangerLevel}
                        onChange={(e) => handleChange('dangerLevel', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:border-accent-cyan outline-none transition-all hover:bg-slate-800"
                    >
                        {dangerLevels.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                </div>
            </div>

            {/* Virality Slider */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex justify-between items-end">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t.editor.labels.virality}</label>
                    <span className="text-xs font-mono text-accent-cyan font-bold bg-accent-cyan/10 px-2 py-0.5 rounded">{formState.popularity}%</span>
                </div>
                <div className="relative h-2 w-full bg-slate-900 rounded-full border border-slate-700">
                    <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                        style={{ width: `${formState.popularity}%` }}
                    ></div>
                    <input 
                        type="range" 
                        min="0" max="100" 
                        value={formState.popularity}
                        onChange={(e) => handleChange('popularity', parseInt(e.target.value))}
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
            </div>

            {/* Tagging System */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Tag size={12} /> {t.editor.labels.tags}
                </label>
                <div className="flex gap-2 mb-2">
                    <input 
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:border-accent-purple outline-none"
                        placeholder="Add tag..."
                    />
                    <button onClick={handleAddTag} className="bg-slate-800 border border-slate-700 text-slate-400 hover:text-white px-3 rounded hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-accent-purple outline-none" aria-label="Add tag">+</button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[60px] content-start">
                    {formState.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider backdrop-blur-md font-mono whitespace-nowrap bg-slate-800 text-slate-300 border-slate-700 shadow-sm pr-1 flex items-center gap-1 group cursor-pointer hover:border-red-500/50 hover:bg-red-500/10">
                            {tag}
                            <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-400 p-0.5 rounded-full focus-visible:ring-2 focus-visible:ring-red-400 outline-none" aria-label={`Remove tag ${tag}`}><X size={10}/></button>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

const CoverArtTerminal: React.FC = () => {
    const { formState, handleGenerateImage, handleProceduralArt, imagePrompt, setImagePrompt, aiMode } = useTheoryEditor();

    return (
        <Card className="p-0 overflow-hidden border-slate-800 bg-black relative group">
            {/* Preview Area */}
            <div className="aspect-video relative overflow-hidden bg-slate-900">
                {formState.imageUrl ? (
                    <img src={formState.imageUrl} alt={formState.title || 'Theory cover image preview'} className="w-full h-full object-cover transition-all duration-700" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-600 flex-col gap-2">
                        <Sparkles size={32} opacity={0.5} className="animate-pulse" />
                        <span className="text-[10px] uppercase tracking-widest">No Visuals</span>
                    </div>
                )}
                
                {/* AI Overlay */}
                {aiMode === 'IMAGE' && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
                        <GenerationHUD mode="IMAGE" isVisible={true} variant="overlay" className="bg-transparent shadow-none border-none" />
                    </div>
                )}

                {/* Control Overlay (Hover) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 z-10">
                    <div className="space-y-3">
                        <div>
                            <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Generative Prompt</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={imagePrompt}
                                    onChange={(e) => setImagePrompt(e.target.value)}
                                    placeholder={formState.title || "Describe image..."}
                                    className="flex-1 bg-slate-800/80 border border-slate-600 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-accent-purple"
                                />
                                <button 
                                    onClick={handleGenerateImage}
                                    className="bg-accent-purple hover:bg-purple-400 text-white p-1.5 rounded"
                                    title="Generate with Gemini Imagen"
                                >
                                    <ImagePlus size={14} />
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center border-t border-white/10 pt-2">
                            <span className="text-[9px] text-slate-500">PROVIDER: GEMINI-2.5-FLASH-IMAGE</span>
                            <button onClick={handleProceduralArt} className="text-[9px] text-accent-cyan hover:underline flex items-center gap-1">
                                <RefreshCw size={10} /> Reset to Procedural
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

// --- 4. Main Component Layout ---

export const TheoryEditor: React.FC = () => {
    return (
        <TheoryEditorProvider>
            <PageFrame>
                <EditorHeader />
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[calc(100vh-220px)] lg:min-h-[600px] items-stretch">
                    
                    {/* LEFT COLUMN: Data Entry (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar pr-2 pb-10">
                        <MainInfoForm />
                        
                        <Card className="p-6 bg-slate-900/50 border-slate-800">
                            <MetadataPanel />
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: Simulation & Preview (7 cols) */}
                    <div className="lg:col-span-7 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar pr-2 pb-10">
                        {/* 1. Visuals & Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CoverArtTerminal />
                            <div className="flex flex-col justify-between">
                                <PredictiveMetrics />
                                <VulnerabilityAssessment />
                                <CrossLinkPanel />
                            </div>
                        </div>

                        {/* 2. Live Dossier Preview */}
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 mt-2">
                            <Eye size={14} className="text-accent-cyan" /> Live Dossier Preview
                        </div>
                        <Card variant="cyber" className="flex-1 p-8 border-t-4 border-t-accent-cyan bg-[#0B0F19] relative min-h-[300px]">
                            {/* Watermark */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                                <ShieldAlert size={200} />
                            </div>
                            
                            <TheoryEditorPreview />
                        </Card>
                    </div>
                </div>
            </PageFrame>
        </TheoryEditorProvider>
    );
};

// Extracted Preview Component for cleaner main file
const TheoryEditorPreview: React.FC = () => {
    const { formState } = useTheoryEditor();
    
    return (
        <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Badge label={formState.category} className="bg-slate-800 text-slate-300 border-slate-600" />
                        <span className="text-xs font-mono text-slate-500">ORIGIN: {formState.originYear}</span>
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight">{formState.title || "UNTITLED PROJECT"}</h1>
                </div>
                <div className="hidden md:block text-right">
                    <div className="text-[10px] font-mono text-slate-600">ID: {formState.id}</div>
                    <div className="text-[10px] font-mono text-slate-600">REF: {Date.now().toString().slice(-6)}</div>
                </div>
            </div>

            <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                {formState.shortDescription || <span className="text-slate-600 italic">Narrative data pending...</span>}
            </div>

            {formState.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                    {formState.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-bold text-accent-purple bg-accent-purple/10 px-2 py-1 rounded uppercase tracking-wider">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};