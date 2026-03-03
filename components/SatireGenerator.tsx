
import React, { useState, useCallback, createContext, useContext, useEffect, useRef, useMemo } from 'react';
import { SatireOptions } from '../types';
import { 
    Sparkles, RefreshCw, Copy, Check, Database, Zap, 
    Cpu, Save, Activity, Lock, Skull,
    Sliders, Dna, MessageSquare, Newspaper, FileText, ArrowDownCircle,
    Printer, Share2, History, AlertTriangle, Fingerprint, MousePointer2,
    Eye, X, Terminal, ShieldAlert, Globe
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SatireSubject, SatireArchetype } from '../types';
import { Card, Button, Badge, PageFrame, PageHeader } from './ui/Common';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { generateAndSaveSatire, saveSatireToVault, resetSatire } from '../store/slices/satireSlice';

// --- 0. ASSETS & UTILS ---

const NOISE_TEXTURE = "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E";
const PAPER_TEXTURE = "data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E";

const ScrambleText: React.FC<{ text: string, className?: string, onComplete?: () => void }> = React.memo(({ text, className, onComplete }) => {
    const [display, setDisplay] = useState('');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+<>';
    
    useEffect(() => {
        let iterations = 0;
        const interval = setInterval(() => {
            setDisplay(prev => {
                return text.split('').map((char, index) => {
                    if (index < iterations) return char;
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('');
            });
            
            if (iterations >= text.length) {
                clearInterval(interval);
                if (onComplete) onComplete();
            }
            iterations += 1;
        }, 20);
        return () => clearInterval(interval);
    }, [text, onComplete]);

    return <span className={className}>{display}</span>;
});

// --- 1. ENTROPY ENGINE ---

const EntropyCanvas: React.FC<{ onEntropyFull: () => void, active: boolean }> = ({ onEntropyFull, active }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [entropy, setEntropy] = useState(0);
    const particles = useRef<{x: number, y: number, vx: number, vy: number, life: number}[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let frame = 0;
        const render = () => {
            const w = canvas.width = canvas.offsetWidth;
            const h = canvas.height = canvas.offsetHeight;
            ctx.clearRect(0, 0, w, h);

            // Draw entropy bar
            const barHeight = 4;
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(0, h - barHeight, w, barHeight);
            
            const gradient = ctx.createLinearGradient(0, 0, w, 0);
            gradient.addColorStop(0, '#06b6d4');
            gradient.addColorStop(1, '#8b5cf6');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, h - barHeight, w * (entropy / 100), barHeight);

            // Particles - Optimized Loop
            for (let i = particles.current.length - 1; i >= 0; i--) {
                const p = particles.current[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.02;
                
                if (p.life <= 0) {
                    particles.current.splice(i, 1);
                    continue;
                }
                
                ctx.beginPath();
                // Ensure radius is never negative
                ctx.arc(p.x, p.y, Math.max(0, p.life * 3), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${p.life})`;
                ctx.fill();
            }

            if (entropy < 100) frame = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(frame);
    }, [entropy]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!active || entropy >= 100) return;
        
        const rect = canvasRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Spawn particles
        for(let i=0; i<2; i++) {
            particles.current.push({
                x, y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 1.0
            });
        }

        const newEntropy = Math.min(100, entropy + 0.8);
        setEntropy(newEntropy);
        if (newEntropy >= 100) onEntropyFull();
    };

    return (
        <div className="relative w-full h-32 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden group cursor-crosshair">
            <canvas 
                ref={canvasRef} 
                role="img"
                aria-label="Entropy harvesting visualization collecting mouse randomness"
                onMouseMove={handleMouseMove}
                className="w-full h-full block"
            />
            {entropy < 100 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-xs font-mono text-cyan-500 bg-slate-900/80 px-3 py-1 rounded border border-cyan-500/30 animate-pulse flex items-center gap-2">
                        <MousePointer2 size={12} /> HARVESTING RANDOMNESS... {Math.floor(entropy)}%
                    </div>
                </div>
            )}
            {entropy >= 100 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-accent-cyan/10 backdrop-blur-sm">
                    <div className="text-lg font-black text-white tracking-widest font-display animate-bounce">
                        ENTROPY LOCKED
                    </div>
                </div>
            )}
        </div>
    );
};

// --- 2. LOGIC HOOK ---

const useSatireLogic = () => {
    const { t, language } = useLanguage();
    const dispatch = useAppDispatch();
    const { data: result, status, error } = useAppSelector(state => state.satire);
    
    // State
    const [entropyReady, setEntropyReady] = useState(false);
    const [fabricationStep, setFabricationStep] = useState(0);
    const [isFabricating, setIsFabricating] = useState(false);
    
    // Inputs
    const [subject, setSubject] = useState('CATS');
    const [archetype, setArchetype] = useState('CYBER');
    const [format, setFormat] = useState('LEAK');
    const [paranoia, setParanoia] = useState(75);

    // Data Maps (memoized to avoid re-creating on every render)
    const subjects: SatireSubject[] = useMemo(() => [
        { id: 'CATS', label: t.satire.subjects.CATS, icon: '🐈' },
        { id: 'INTERNET', label: t.satire.subjects.INTERNET, icon: '🌐' },
        { id: 'FOOD', label: t.satire.subjects.FOOD, icon: '🍔' },
        { id: 'CLOUDS', label: t.satire.subjects.CLOUDS, icon: '☁️' },
        { id: 'OFFICE', label: t.satire.subjects.OFFICE, icon: '📎' },
        { id: 'SOCKS', label: t.satire.subjects.SOCKS, icon: '🧦' },
        { id: 'MATH', label: t.satire.subjects.MATH, icon: '➗' },
        { id: 'TIME', label: t.satire.subjects.TIME, icon: '⏰' }
    ], [t]);

    const archetypes: SatireArchetype[] = useMemo(() => [
        { id: 'ANCIENT', label: t.satire.archetypes.ANCIENT.label, desc: t.satire.archetypes.ANCIENT.desc },
        { id: 'CYBER', label: t.satire.archetypes.CYBER.label, desc: t.satire.archetypes.CYBER.desc },
        { id: 'GOV', label: t.satire.archetypes.GOV.label, desc: t.satire.archetypes.GOV.desc },
        { id: 'BIO', label: t.satire.archetypes.BIO.label, desc: t.satire.archetypes.BIO.desc }
    ], [t]);

    // Fabrication Sequence (stable reference)
    const LOG_STEPS = useMemo(() => [
        "Initializing Narrative Vectors...",
        "Scraping Akasha Records...",
        "Injecting Cognitive Dissonance...",
        "Forging Classified Stamps...",
        "Bribing Digital Witnesses...",
        "Compiling Reality Distortion...",
        "Finalizing Payload..."
    ], []);

    useEffect(() => {
        if (isFabricating) {
            const interval = setInterval(() => {
                setFabricationStep(prev => {
                    if (prev >= LOG_STEPS.length - 1) {
                        clearInterval(interval);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 800);
            return () => clearInterval(interval);
        }
    }, [isFabricating]);

    const handleGenerate = async () => {
        if (!entropyReady) return;
        setIsFabricating(true);
        setFabricationStep(0);

        const subjItem = subjects.find(s => s.id === subject);
        const archItem = archetypes.find(a => a.id === archetype);

        const options = {
            topic: subjItem?.label,
            archetype: `${archItem?.label} (Style: ${format})`,
            paranoiaLevel: paranoia
        };

        await dispatch(generateAndSaveSatire({ language, options }));
        setIsFabricating(false);
    };

    const handleSave = () => {
        if (result) {
            dispatch(saveSatireToVault({
                satire: result,
                params: { subject, archetype, paranoia }
            }));
        }
    };

    const handleReset = () => {
        dispatch(resetSatire());
        setEntropyReady(false);
        setFabricationStep(0);
        setIsFabricating(false);
    };

    return {
        t, language,
        subjects, archetypes,
        subject, setSubject,
        archetype, setArchetype,
        format, setFormat,
        paranoia, setParanoia,
        entropyReady, setEntropyReady,
        isFabricating, fabricationStep, LOG_STEPS,
        result, error,
        handleGenerate, handleSave, handleReset
    };
};

// --- 3. CONTEXT ---

const SatireContext = createContext<ReturnType<typeof useSatireLogic> | undefined>(undefined);
const useSatire = () => {
    const ctx = useContext(SatireContext);
    if (!ctx) throw new Error("Missing SatireProvider");
    return ctx;
};

// --- 4. UI COMPONENTS ---

const ModuleSelector: React.FC<{ 
    options: { id: string, label: string, icon?: any, desc?: string }[], 
    selected: string, 
    onChange: (id: string) => void,
    title: string,
    icon: React.ElementType
}> = ({ options, selected, onChange, title, icon: Icon }) => (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <Icon size={12} className="text-accent-cyan" /> {title}
        </div>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
            {options.map(opt => (
                <button
                    key={opt.id}
                    onClick={() => onChange(opt.id)}
                    className={`
                        text-left p-2 rounded-lg border text-xs transition-all relative overflow-hidden group
                        ${selected === opt.id 
                            ? 'bg-accent-cyan/10 border-accent-cyan text-white' 
                            : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-500'}
                    `}
                >
                    <div className="flex items-center justify-between relative z-10">
                        <span className="font-bold flex items-center gap-2">
                            {opt.icon && <span className="opacity-80">{opt.icon}</span>}
                            {opt.label}
                        </span>
                        {selected === opt.id && <Check size={10} className="text-accent-cyan" />}
                    </div>
                    {opt.desc && <div className="text-[9px] opacity-60 mt-1 line-clamp-1">{opt.desc}</div>}
                    {selected === opt.id && <div className="absolute inset-0 bg-accent-cyan/5 animate-pulse"></div>}
                </button>
            ))}
        </div>
    </div>
);

const ParanoiaSlider: React.FC = () => {
    const { paranoia, setParanoia, t } = useSatire();
    
    // Glitch effect based on level
    const glitchIntensity = (paranoia / 100) * 5; 

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={12} className={paranoia > 80 ? "text-red-500 animate-pulse" : "text-slate-400"} />
                    {t.satire.params.paranoia}
                </div>
                <div 
                    className={`font-mono font-black text-xl ${paranoia > 80 ? 'text-red-500' : 'text-accent-cyan'}`}
                    style={{ textShadow: `${Math.random()*glitchIntensity}px ${Math.random()*glitchIntensity}px 0px rgba(255,0,255,0.5)` }}
                >
                    {paranoia}%
                </div>
            </div>
            
            <input 
                type="range" 
                min="1" max="100" 
                value={paranoia} 
                onChange={(e) => setParanoia(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent-cyan"
            />
            
            <div className="flex justify-between mt-2 text-[9px] font-mono text-slate-600 uppercase">
                <span>{t.satire.ui.rational}</span>
                <span>{t.satire.ui.skeptical}</span>
                <span className="text-red-500 font-bold">{t.satire.ui.unhinged}</span>
            </div>
        </div>
    );
};

// --- 5. ARTIFACT RENDERERS ---

const ClassifiedArtifact: React.FC<{ title: string, content: string }> = ({ title, content }) => {
    const { t } = useLanguage();

    return (
    <div className="relative bg-[#e5e5e5] text-black p-8 md:p-12 font-mono shadow-2xl transform rotate-1 rounded-sm border border-slate-400 min-h-[600px] overflow-hidden">
        {/* Paper Texture */}
        <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply" style={{ backgroundImage: `url("${PAPER_TEXTURE}")` }}></div>
        
        {/* Header */}
        <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-end relative z-10">
            <div>
                <div className="text-xs uppercase font-bold tracking-widest mb-1">Department of [REDACTED]</div>
                <div className="text-3xl font-black uppercase tracking-tighter leading-none"><ScrambleText text={title} /></div>
            </div>
            <div className="border-2 border-red-600 text-red-600 px-2 py-1 text-xs font-bold uppercase transform -rotate-12 opacity-80">
                TOP SECRET
            </div>
        </div>

        {/* Content */}
        <div className="text-sm leading-relaxed font-bold opacity-90 whitespace-pre-wrap relative z-10 columns-1 md:columns-2 gap-8">
            <span className="float-left text-4xl mr-2 font-black">"{content.charAt(0)}</span>
            <ScrambleText text={content.substring(1)} />
        </div>

        {/* Footer */}
        <div className="mt-12 pt-4 border-t border-black flex justify-between text-[10px] uppercase font-bold tracking-widest relative z-10">
            <span>{t.satire.ui.authOmega}</span>
            <span>{t.satire.ui.destructionProtocol}</span>
        </div>

        {/* Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-black text-black opacity-[0.03] -rotate-45 pointer-events-none whitespace-nowrap">
            CONFIDENTIAL
        </div>
    </div>
    );
};

const DarkNetArtifact: React.FC<{ title: string, content: string }> = ({ title, content }) => (
    <div className="relative bg-[#1a1b1e] text-[#b0b3b8] p-6 rounded-md shadow-2xl font-sans min-h-[600px] border-l-4 border-accent-purple">
        <div className="flex gap-3 mb-4 border-b border-white/10 pb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center font-bold text-white">
                <Skull size={20} />
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">TruthSeeker_99</span>
                    <span className="text-xs bg-accent-purple/20 text-accent-purple px-1.5 rounded">OP</span>
                </div>
                <div className="text-[10px] text-slate-500">{new Date().toLocaleString()} • ID: X7z99A</div>
            </div>
        </div>

        <h2 className="text-xl font-bold text-white mb-4"><ScrambleText text={title} /></h2>
        
        <div className="bg-[#2a2b2e] p-4 rounded text-sm leading-relaxed border border-white/5 whitespace-pre-wrap font-mono text-green-400/90 shadow-inner">
            <span className="text-purple-400">{"> be me\n> accessing restricted archives\n\n"}</span>
            <ScrambleText text={content} />
        </div>

        <div className="mt-6 space-y-3">
            <div className="flex gap-2">
                <div className="w-6 h-6 bg-slate-700 rounded-full"></div>
                <div className="flex-1 bg-[#2a2b2e] rounded p-2 text-xs">
                    <span className="text-slate-400 font-bold block mb-1">Anon1337</span>
                    Big if true. The mainstream media won't touch this.
                </div>
            </div>
            <div className="flex gap-2">
                <div className="w-6 h-6 bg-slate-700 rounded-full"></div>
                <div className="flex-1 bg-[#2a2b2e] rounded p-2 text-xs">
                    <span className="text-slate-400 font-bold block mb-1">RedPillDispenser</span>
                    I've seen similar documents on the dark web. It's happening.
                </div>
            </div>
        </div>
    </div>
);

const TabloidArtifact: React.FC<{ title: string, content: string }> = ({ title, content }) => (
    <div className="relative bg-white text-black p-4 shadow-2xl min-h-[600px] font-serif overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-50 mix-blend-multiply pointer-events-none"></div>
        
        <div className="border-b-4 border-black mb-4 pb-2 text-center relative z-10">
            <h1 className="text-5xl font-black uppercase italic tracking-tighter text-red-600" style={{ textShadow: '2px 2px 0px black' }}>THE DAILY TRUTH</h1>
            <div className="flex justify-between text-xs font-bold border-t-2 border-black mt-2 pt-1 uppercase">
                <span>Vol. 666</span>
                <span>Final Edition</span>
                <span>Price: Your Sanity</span>
            </div>
        </div>

        <h2 className="text-4xl font-black leading-none mb-4 uppercase text-center relative z-10">
            <ScrambleText text={title} />
        </h2>

        <div className="columns-2 gap-4 text-xs text-justify font-sans relative z-10 leading-tight">
            <p className="first-letter:text-4xl first-letter:font-black first-letter:float-left first-letter:mr-1">
                <ScrambleText text={content} />
            </p>
        </div>

        <div className="mt-8 border-4 border-black p-4 text-center font-black uppercase text-xl transform -rotate-2 bg-yellow-300 relative z-10 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            EXCLUSIVE REPORT!
        </div>
    </div>
);

// --- 6. MAIN LAYOUT ---

const FabricationTerminal: React.FC = () => {
    const { isFabricating, fabricationStep, LOG_STEPS, t } = useSatire();

    if (!isFabricating) return null;

    return (
        <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex flex-col items-center justify-center font-mono">
            <div className="w-full max-w-md space-y-4">
                <div className="text-accent-cyan animate-pulse text-center text-4xl mb-8">
                    <Cpu size={64} className="mx-auto mb-4" />
                    {t.satire.ui.fabricatingReality}
                </div>
                
                <div className="bg-black border border-slate-800 rounded-lg p-4 h-48 overflow-hidden relative shadow-2xl">
                    <div className="absolute inset-0 bg-accent-cyan/5 pointer-events-none animate-scan"></div>
                    <div className="space-y-2 text-xs">
                        {LOG_STEPS.map((step, i) => (
                            <div key={i} className={`flex gap-2 ${i > fabricationStep ? 'opacity-0' : i === fabricationStep ? 'text-white font-bold' : 'text-slate-500'}`}>
                                <span className="text-slate-700">{`0${i+1}`}</span>
                                <span>{step}</span>
                                {i === fabricationStep && <span className="animate-pulse">_</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ConfigDeck: React.FC = () => {
    const { 
        subjects, archetypes, 
        subject, setSubject, 
        archetype, setArchetype,
        format, setFormat,
        entropyReady, setEntropyReady,
        handleGenerate, t
    } = useSatire();

    return (
        <div className="space-y-6">
            {/* 1. Entropy */}
            <div className="space-y-2">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Fingerprint size={12} className={entropyReady ? "text-green-500" : "text-slate-400"} />
                    {t.satire.ui.entropySource}
                </div>
                <EntropyCanvas active={!entropyReady} onEntropyFull={() => setEntropyReady(true)} />
            </div>

            {/* 2. Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ModuleSelector 
                    title={t.satire.params.subject} 
                    icon={Database} 
                    options={subjects} 
                    selected={subject} 
                    onChange={setSubject} 
                />
                <ModuleSelector 
                    title={t.satire.params.archetype} 
                    icon={Dna} 
                    options={archetypes} 
                    selected={archetype} 
                    onChange={setArchetype} 
                />
            </div>

            {/* 3. Fine Tuning */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ParanoiaSlider />
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                        <Newspaper size={12} /> {t.satire.ui.outputFormat}
                    </div>
                    <div className="flex gap-2">
                        {['LEAK', 'FORUM', 'ARTICLE'].map(fmt => (
                            <button
                                key={fmt}
                                onClick={() => setFormat(fmt)}
                                className={`
                                    flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded border transition-all
                                    ${format === fmt 
                                        ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' 
                                        : 'bg-slate-950 border-slate-700 text-slate-500 hover:text-slate-300'}
                                `}
                            >
                                {fmt === 'LEAK' ? t.satire.formats.leak : fmt === 'FORUM' ? t.satire.formats.forum : t.satire.formats.article}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. Action */}
            <Button 
                onClick={handleGenerate} 
                disabled={!entropyReady}
                variant="primary" 
                size="lg" 
                className={`w-full py-6 text-lg font-black tracking-[0.2em] shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all ${!entropyReady ? 'opacity-50 grayscale' : 'hover:scale-[1.01]'}`}
            >
                {entropyReady ? t.satire.ui.initiateFabrication : t.satire.ui.awaitingEntropy}
            </Button>
        </div>
    );
};

const ResultViewer: React.FC = () => {
    const { result, format, handleReset, handleSave, t } = useSatire();

    if (!result) return null;

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center bg-slate-900/80 backdrop-blur p-4 rounded-xl border border-slate-800 shadow-2xl">
                <div className="text-xs font-mono text-green-400 flex items-center gap-2">
                    <Check size={14} /> {t.satire.ui.fabricationComplete}
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={handleSave} icon={<Save size={14} />}>{t.satire.saveVault}</Button>
                    <Button variant="ghost" size="sm" onClick={handleReset} icon={<RefreshCw size={14} />}>{t.common.reset}</Button>
                </div>
            </div>

            <div className="shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                {format === 'LEAK' && <ClassifiedArtifact title={result.title} content={result.content} />}
                {format === 'FORUM' && <DarkNetArtifact title={result.title} content={result.content} />}
                {format === 'ARTICLE' && <TabloidArtifact title={result.title} content={result.content} />}
            </div>
        </div>
    );
};

export const SatireGenerator: React.FC = () => {
    const logic = useSatireLogic();

    return (
        <SatireContext.Provider value={logic}>
            <PageFrame>
                <PageHeader 
                    title={logic.t.satire.pageTitle}
                    subtitle={logic.t.satire.pageSubtitle}
                    icon={Globe}
                    status={logic.t.satire.pageStatus}
                    statusColor="bg-red-500"
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative min-h-[600px]">
                    <FabricationTerminal />
                    
                    <div className={`transition-all duration-500 ${logic.result ? 'opacity-50 blur-sm pointer-events-none lg:opacity-100 lg:blur-0 lg:pointer-events-auto' : ''}`}>
                        <ConfigDeck />
                    </div>

                    <div className="relative">
                        {!logic.result && !logic.isFabricating && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                                <ShieldAlert size={64} className="text-slate-700 mb-4" />
                                <h3 className="text-xl font-bold text-slate-500 uppercase tracking-widest mb-2">{logic.t.satire.ui.outputBufferEmpty}</h3>
                                <p className="text-slate-600 text-xs font-mono">{logic.t.satire.ui.outputBufferHint}</p>
                            </div>
                        )}
                        <ResultViewer />
                    </div>
                </div>
            </PageFrame>
        </SatireContext.Provider>
    );
};

export default SatireGenerator;
