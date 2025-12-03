
import React, { useState, useCallback, createContext, useContext, useEffect } from 'react';
import { SatireOptions } from '../types';
import { 
    Sparkles, RefreshCw, Copy, Check, Database, Zap, 
    Cpu, Save, Activity, Lock, Skull,
    Sliders, Dna, MessageSquare, Newspaper
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SatireSubject, SatireArchetype } from '../types';
import { Card, Button, Badge, PageFrame, PageHeader } from './ui/Common';
import { GenerationHUD } from './ui/GenerationHUD';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { generateAndSaveSatire, saveSatireToVault, resetSatire } from '../store/slices/satireSlice';

// --- 1. Logic Hook ---

const useSatireGeneratorLogic = () => {
    const { t, language } = useLanguage();
    const dispatch = useAppDispatch();
    
    // Access Redux State
    const { data: result, status, error } = useAppSelector(state => state.satire);
    const loading = status === 'loading';

    // Dynamic Data based on Language
    const subjects: SatireSubject[] = [
        { id: 'CATS', label: t.satire.subjects.CATS, icon: '🐱' },
        { id: 'INTERNET', label: t.satire.subjects.INTERNET, icon: '🌐' },
        { id: 'FOOD', label: t.satire.subjects.FOOD, icon: '🍔' },
        { id: 'CLOUDS', label: t.satire.subjects.CLOUDS, icon: '☁️' },
        { id: 'OFFICE', label: t.satire.subjects.OFFICE, icon: '📎' },
        { id: 'SOCKS', label: t.satire.subjects.SOCKS, icon: '🧦' },
        { id: 'MATH', label: t.satire.subjects.MATH, icon: '➗' },
        { id: 'TIME', label: t.satire.subjects.TIME, icon: '⏰' }
    ];

    const archetypes: SatireArchetype[] = [
        { id: 'ANCIENT', label: t.satire.archetypes.ANCIENT.label, desc: t.satire.archetypes.ANCIENT.desc },
        { id: 'CYBER', label: t.satire.archetypes.CYBER.label, desc: t.satire.archetypes.CYBER.desc },
        { id: 'GOV', label: t.satire.archetypes.GOV.label, desc: t.satire.archetypes.GOV.desc },
        { id: 'BIO', label: t.satire.archetypes.BIO.label, desc: t.satire.archetypes.BIO.desc }
    ];

    const formats = [
        { id: 'LEAK', label: 'Leaked Memo', icon: <Lock size={12}/> },
        { id: 'FORUM', label: 'Forum Rant', icon: <MessageSquare size={12}/> },
        { id: 'ARTICLE', label: 'News Article', icon: <Newspaper size={12}/> },
    ];

    const tones = [
        { id: 'ANGRY', label: 'Angry' },
        { id: 'SCIENTIFIC', label: 'Pseudo-Scientific' },
        { id: 'MYSTICAL', label: 'Mystical' },
    ];

    const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0].id);
    const [selectedArchetype, setSelectedArchetype] = useState<string>(archetypes[0].id);
    const [selectedFormat, setSelectedFormat] = useState<string>('LEAK');
    const [selectedTone, setSelectedTone] = useState<string>('SCIENTIFIC');
    const [paranoiaLevel, setParanoiaLevel] = useState<number>(50);
    
    const [copied, setCopied] = useState(false);
    const [saved, setSaved] = useState(false);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            dispatch(resetSatire());
        }
    }, [dispatch]);

    const handleGenerate = useCallback(async () => {
        setSaved(false);
        
        const subjLabel = subjects.find(s => s.id === selectedSubject)?.label || 'Unknown';
        const archLabel = archetypes.find(a => a.id === selectedArchetype)?.label || 'General';

        // Enhance prompt with format and tone
        const enhancedArchetype = `${archLabel} (Format: ${selectedFormat}, Tone: ${selectedTone})`;

        const options: SatireOptions = {
            topic: subjLabel,
            archetype: enhancedArchetype,
            paranoiaLevel
        };

        dispatch(generateAndSaveSatire({ language, options }));
    }, [language, selectedSubject, selectedArchetype, paranoiaLevel, subjects, archetypes, selectedFormat, selectedTone, dispatch]);

    const handleCopy = () => {
        if (result) {
            navigator.clipboard.writeText(`${result.title}\n\n${result.content}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleSave = async () => {
        if (result && !saved) {
            const subjLabel = subjects.find(s => s.id === selectedSubject)?.label || 'Unknown';
            const archLabel = archetypes.find(a => a.id === selectedArchetype)?.label || 'General';
            
            await dispatch(saveSatireToVault({ 
                satire: result, 
                params: { subject: subjLabel, archetype: archLabel, paranoia: paranoiaLevel }
            }));
            setSaved(true);
        }
    };

    const handleReset = () => {
        dispatch(resetSatire());
        setSaved(false);
    };

    return {
        t,
        subjects,
        archetypes,
        formats,
        tones,
        selectedSubject, setSelectedSubject,
        selectedArchetype, setSelectedArchetype,
        selectedFormat, setSelectedFormat,
        selectedTone, setSelectedTone,
        paranoiaLevel, setParanoiaLevel,
        result,
        loading,
        error,
        handleGenerate,
        handleCopy,
        handleSave,
        handleReset,
        copied,
        saved
    };
};

// --- 2. Context ---

type SatireContextType = ReturnType<typeof useSatireGeneratorLogic>;
const SatireContext = createContext<SatireContextType | undefined>(undefined);

const useSatire = () => {
    const context = useContext(SatireContext);
    if (!context) throw new Error('useSatire must be used within a SatireProvider');
    return context;
};

// --- 3. UI Components ---

const ConfigPanel: React.FC = React.memo(() => {
    const { 
        subjects, archetypes, formats, tones,
        selectedSubject, setSelectedSubject,
        selectedArchetype, setSelectedArchetype,
        selectedFormat, setSelectedFormat,
        selectedTone, setSelectedTone,
        paranoiaLevel, setParanoiaLevel,
        handleGenerate, loading, t
    } = useSatire();

    if (loading) return null;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Subject Selection */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Database size={14} className="text-accent-cyan" /> {t.satire.params.subject}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {subjects.map((subj) => (
                        <button
                            key={subj.id}
                            onClick={() => setSelectedSubject(subj.id)}
                            className={`
                                p-3 rounded-lg border text-sm font-medium transition-all flex items-center gap-2
                                ${selectedSubject === subj.id 
                                    ? 'bg-accent-cyan/10 border-accent-cyan text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                                    : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'}
                            `}
                        >
                            <span className="text-lg">{subj.icon}</span>
                            <span>{subj.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Archetype Selection */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Dna size={14} className="text-accent-purple" /> {t.satire.params.archetype}
                </h3>
                <div className="space-y-3">
                    {archetypes.map((arch) => (
                        <button
                            key={arch.id}
                            onClick={() => setSelectedArchetype(arch.id)}
                            className={`
                                w-full text-left p-4 rounded-xl border transition-all group relative overflow-hidden
                                ${selectedArchetype === arch.id 
                                    ? 'bg-accent-purple/10 border-accent-purple text-white' 
                                    : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-900'}
                            `}
                        >
                            <div className="flex justify-between items-center relative z-10">
                                <div>
                                    <div className="font-bold text-sm mb-1">{arch.label}</div>
                                    <div className="text-xs opacity-70 font-mono">{arch.desc}</div>
                                </div>
                                {selectedArchetype === arch.id && <Check size={18} className="text-accent-purple" />}
                            </div>
                            {selectedArchetype === arch.id && (
                                <div className="absolute inset-0 bg-accent-purple/5 animate-scan pointer-events-none"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Style Controls (Format & Tone) */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Format</h3>
                    <div className="space-y-2">
                        {formats.map(fmt => (
                            <button
                                key={fmt.id}
                                onClick={() => setSelectedFormat(fmt.id)}
                                className={`w-full text-left px-3 py-2 rounded text-xs font-bold border transition-all flex items-center gap-2 ${selectedFormat === fmt.id ? 'bg-white text-black border-white' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                            >
                                {fmt.icon} {fmt.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Tone</h3>
                    <div className="space-y-2">
                        {tones.map(tone => (
                            <button
                                key={tone.id}
                                onClick={() => setSelectedTone(tone.id)}
                                className={`w-full text-left px-3 py-2 rounded text-xs font-bold border transition-all flex items-center gap-2 ${selectedTone === tone.id ? 'bg-white text-black border-white' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                            >
                                {tone.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Paranoia Slider */}
            <div className="bg-slate-900/30 p-5 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Sliders size={14} className="text-red-500" /> {t.satire.params.paranoia}
                    </h3>
                    <Badge 
                        label={`${paranoiaLevel}%`} 
                        className={paranoiaLevel > 80 ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-slate-800 text-slate-300'} 
                    />
                </div>
                <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={paranoiaLevel} 
                    onChange={(e) => setParanoiaLevel(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent-cyan hover:accent-cyan-400"
                />
                <div className="flex justify-between mt-2 text-[10px] text-slate-600 font-mono uppercase">
                    <span>Mild Suspicion</span>
                    <span>Total Delusion</span>
                </div>
            </div>

            {/* Generate Button */}
            <Button 
                onClick={handleGenerate} 
                variant="primary" 
                size="lg" 
                className="w-full py-5 text-base shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                icon={<Sparkles size={20} />}
            >
                {t.satire.buttonStart}
            </Button>
        </div>
    );
});

const ResultView: React.FC = React.memo(() => {
    const { result, copied, saved, handleCopy, handleSave, handleReset, t, selectedFormat, error } = useSatire();
    
    if (error) {
        return (
            <div className="p-8 text-center border border-red-900/50 bg-red-950/20 rounded-xl">
                <div className="text-red-500 font-bold mb-2">GENERATION FAILED</div>
                <div className="text-sm text-red-400 font-mono">{error}</div>
                <Button onClick={handleReset} variant="secondary" className="mt-4">Try Again</Button>
            </div>
        )
    }

    if (!result) return null;

    const bgTexture = selectedFormat === 'LEAK' 
        ? "bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')] opacity-50 mix-blend-multiply" 
        : "bg-[url('https://www.transparenttextures.com/patterns/white-paper.png')] opacity-30 mix-blend-multiply";

    return (
        <div className="animate-fade-in space-y-6">
            <div className={`text-slate-900 p-8 md:p-12 rounded-sm shadow-2xl relative overflow-hidden transform ${selectedFormat === 'LEAK' ? 'rotate-1 border border-slate-300 bg-[#fcfbf9]' : 'bg-white border-2 border-blue-200'}`}>
                {/* Visual Texture */}
                <div className={`absolute inset-0 ${bgTexture} pointer-events-none`}></div>
                
                {/* Stamps */}
                {selectedFormat === 'LEAK' && (
                    <div className="absolute top-4 right-4 border-4 border-red-700 text-red-700 font-black text-lg px-4 py-2 uppercase -rotate-12 opacity-70 mix-blend-multiply tracking-widest">
                        TOP SECRET
                    </div>
                )}
                {selectedFormat === 'ARTICLE' && (
                    <div className="absolute top-4 left-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                        The Daily Truth • {new Date().toLocaleDateString()}
                    </div>
                )}

                {/* Content */}
                <div className="relative z-10 font-serif">
                    <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight border-b-4 border-slate-900 pb-4">
                        {result.title}
                    </h2>
                    <p className="text-lg leading-relaxed whitespace-pre-wrap">
                        {result.content}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                    onClick={handleCopy} 
                    variant="secondary" 
                    icon={copied ? <Check size={16} /> : <Copy size={16} />}
                    className={copied ? "border-green-500 text-green-400" : ""}
                >
                    {copied ? t.satire.copied : t.satire.copy}
                </Button>
                <Button 
                    onClick={handleSave} 
                    variant="secondary"
                    disabled={saved}
                    icon={saved ? <Check size={16} /> : <Save size={16} />}
                    className={saved ? "border-green-500 text-green-400" : ""}
                >
                    {saved ? "Archived" : "Save to Vault"}
                </Button>
                <Button 
                    onClick={handleReset} 
                    variant="primary"
                    icon={<RefreshCw size={16} />}
                >
                    {t.satire.buttonNew}
                </Button>
            </div>
        </div>
    );
});

// --- 4. Main Component ---

export const SatireGenerator: React.FC = () => {
    const logic = useSatireGeneratorLogic();

    return (
        <SatireContext.Provider value={logic}>
            <PageFrame>
                <PageHeader 
                    title={logic.t.satire.title}
                    subtitle="PROBABILISTIC NARRATIVE ENGINE"
                    icon={Skull}
                    status="UNSTABLE"
                    statusColor="bg-yellow-500"
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
                    {/* Left Column: Input */}
                    <div className={`transition-all duration-500 ${logic.result ? 'opacity-50 hover:opacity-100 blur-[1px] hover:blur-0' : 'opacity-100'}`}>
                        <Card className="p-6 md:p-8 border-t-4 border-t-accent-cyan bg-slate-900/80">
                            <ConfigPanel />
                        </Card>
                    </div>

                    {/* Right Column: Output */}
                    <div className="min-h-[400px] relative">
                        {/* Empty State / Instruction */}
                        {!logic.result && !logic.loading && !logic.error && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
                                <div className="mb-6 p-6 bg-slate-900 rounded-full border border-slate-700 shadow-xl">
                                    <Zap size={48} className="text-slate-600" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">Awaiting Input</h3>
                                <p className="text-slate-500 max-w-xs text-sm">{logic.t.satire.subtitle}</p>
                                <div className="mt-8 flex items-center gap-2 text-xs text-slate-600 font-mono">
                                    <Activity size={12} className="animate-pulse" />
                                    System Standby
                                </div>
                            </div>
                        )}

                        {logic.loading && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
                                <GenerationHUD mode="CREATIVE" isVisible={true} className="w-full h-full" />
                            </div>
                        )}
                        
                        <ResultView />
                    </div>
                </div>
            </PageFrame>
        </SatireContext.Provider>
    );
};

export default SatireGenerator;
