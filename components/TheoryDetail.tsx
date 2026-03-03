import React, { useEffect, useState, useMemo, useCallback, createContext, useContext, useRef } from 'react';
import { Theory, TheoryDetail as ITheoryDetail } from '../types';
import { analyzeTheoryWithGemini, generateTheoryImage } from '../services/geminiService';
import { 
    ArrowLeft, ShieldCheck, History, FileText, ExternalLink, Link, 
    Youtube, FileKey, GitBranch, Edit3, BookOpen, Quote, AlertTriangle, 
    CheckCircle2, Clock, RefreshCw, MessageSquare, Download
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSettings } from '../contexts/SettingsContext';
import { useToast } from '../contexts/ToastContext';
import { Button, Card, Badge, PageFrame, PageHeader } from './ui/Common';
import { GenerationHUD } from './ui/GenerationHUD';
import { ReferencesModal } from './ui/ReferencesModal';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectAllTheories } from '../store/slices/theoriesSlice';
import { setTheoryTab, injectChatContext, setActiveFile } from '../store/slices/uiSlice';
import { addLog } from '../store/slices/settingsSlice';
import { downloadFactCheckReport } from '../utils/factCheckReport';

// --- INTERACTIVE FORCE GRAPH (Optimized) ---
const InteractiveForceGraph: React.FC<{ nodes: any[], links: any[], onNodeClick: (id: string) => void }> = ({ nodes: initialNodes, links: initialLinks, onNodeClick }) => {
    const { t } = useLanguage();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [draggingNode, setDraggingNode] = useState<any | null>(null);
    const [isInteractive, setIsInteractive] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Physics Simulation State
    const nodesRef = useRef(initialNodes.map(n => ({ ...n, x: Math.random() * 800, y: Math.random() * 600, vx: 0, vy: 0 })));
    const reqRef = useRef<number | null>(null);

    // Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting);
        }, { threshold: 0.1 });
        
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        // Reset nodes when data changes
        nodesRef.current = initialNodes.map(n => ({ ...n, x: Math.random() * 800, y: Math.random() * 600, vx: 0, vy: 0 }));
    }, [initialNodes]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || !isVisible) {
            if (reqRef.current) cancelAnimationFrame(reqRef.current);
            return;
        }

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                if (width && height) {
                    canvas.width = width;
                    canvas.height = height;
                }
            }
        });
        
        resizeObserver.observe(container);

        const render = () => {
            const width = canvas.width;
            const height = canvas.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Physics Update
            const nodes = nodesRef.current;
            
            // 1. Repulsion
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const distSq = dx * dx + dy * dy || 1;
                    const force = 5000 / distSq;
                    const fx = (dx / Math.sqrt(distSq)) * force;
                    const fy = (dy / Math.sqrt(distSq)) * force;
                    nodes[i].vx += fx; nodes[i].vy += fy;
                    nodes[j].vx -= fx; nodes[j].vy -= fy;
                }
            }

            // 2. Attraction (Center & Links)
            nodes.forEach(n => {
                const dx = (width / 2) - n.x;
                const dy = (height / 2) - n.y;
                n.vx += dx * 0.005;
                n.vy += dy * 0.005;
            });

            // 3. Update Position & Damping
            nodes.forEach(n => {
                if (n !== draggingNode) {
                    n.x += n.vx;
                    n.y += n.vy;
                    n.vx *= 0.9;
                    n.vy *= 0.9;
                }
            });

            // Render
            ctx.clearRect(0, 0, width, height);
            
            // Draw Links
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 1.5;
            // Simple Star Topology Render
            const center = nodes.find(n => n.type === 'MAIN');
            if (center) {
                nodes.forEach(n => {
                    if (n !== center) {
                        ctx.beginPath();
                        ctx.moveTo(center.x, center.y);
                        ctx.lineTo(n.x, n.y);
                        ctx.stroke();
                    }
                });
            }

            // Draw Nodes
            nodes.forEach(n => {
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.type === 'MAIN' ? 40 : 25, 0, Math.PI * 2);
                ctx.fillStyle = n.type === 'MAIN' ? '#0f172a' : '#1e293b';
                ctx.strokeStyle = n.type === 'MAIN' ? '#fff' : (n.color || '#64748b');
                ctx.lineWidth = n.type === 'MAIN' ? 4 : 2;
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#fff';
                ctx.font = n.type === 'MAIN' ? 'bold 14px monospace' : '10px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const label = n.label.length > 15 ? n.label.substring(0, 14) + '...' : n.label;
                ctx.fillText(label, n.x, n.y + (n.type === 'MAIN' ? 55 : 35));
            });

            reqRef.current = requestAnimationFrame(render);
        };
        render();

        return () => {
            resizeObserver.disconnect();
            if (reqRef.current) cancelAnimationFrame(reqRef.current);
        };
    }, [draggingNode, initialLinks, isVisible]);

    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isInteractive) return;
        const rect = canvasRef.current!.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        const hit = nodesRef.current.find(n => {
            const dx = n.x - x;
            const dy = n.y - y;
            return dx*dx + dy*dy < (n.type === 'MAIN' ? 40*40 : 25*25);
        });

        if (hit) {
            if (hit.type === 'RELATED') onNodeClick(hit.id);
            setDraggingNode(hit);
        }
    };

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (draggingNode && isInteractive) {
            const rect = canvasRef.current!.getBoundingClientRect();
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
            draggingNode.x = clientX - rect.left;
            draggingNode.y = clientY - rect.top;
            draggingNode.vx = 0; draggingNode.vy = 0;
        }
    };

    return (
        <div ref={containerRef} className="w-full h-full bg-slate-950 rounded-xl border border-white/10 relative overflow-hidden">
            <canvas 
                ref={canvasRef} 
                role="img"
                aria-label="Interactive force-directed network graph showing connections between conspiracy theories"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={() => setDraggingNode(null)}
                onMouseLeave={() => setDraggingNode(null)}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={() => setDraggingNode(null)}
                className={`block w-full h-full ${isInteractive ? 'cursor-grab active:cursor-grabbing pointer-events-auto' : 'pointer-events-none'}`}
            />
            {/* Mobile Interaction Overlay */}
            {!isInteractive && (
                <div 
                    className="absolute inset-0 bg-black/20 flex items-center justify-center cursor-pointer"
                    onClick={() => setIsInteractive(true)}
                >
                    <div className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-full text-xs font-bold text-white shadow-lg pointer-events-auto animate-pulse">
                        {t.detail.tapToInteract}
                    </div>
                </div>
            )}
            {isInteractive && (
                <button 
                    className="absolute top-4 right-4 p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    onClick={() => setIsInteractive(false)}
                >
                    {t.detail.releaseLock}
                </button>
            )}
            <div className="absolute bottom-4 right-4 text-[9px] text-slate-500 font-mono pointer-events-none">
                PHYSICS_ENGINE: ACTIVE // NODES
            </div>
        </div>
    );
};

// --- LOGIC HOOK ---
const useTheoryDetailLogic = () => {
  const { theoryId } = useParams<{ theoryId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const allTheories = useAppSelector(selectAllTheories);
  const theory = allTheories.find(t => t.id === theoryId);

  const activeTab = useAppSelector(state => 
    theoryId ? (state.ui.theoryDetails[theoryId]?.activeTab || 'ANALYSIS') : 'ANALYSIS'
  );

  const [details, setDetails] = useState<ITheoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isReferencesOpen, setIsReferencesOpen] = useState(false);
  
  const { t, language } = useLanguage();
  const { settings } = useSettings();
  const { showToast } = useToast();

  useEffect(() => {
      if (theoryId) {
          dispatch(setActiveFile(theoryId));
      }
  }, [theoryId, dispatch]);

  const setActiveTab = (tab: 'ANALYSIS' | 'NETWORK' | 'TIMELINE') => {
    if (theoryId) {
      dispatch(setTheoryTab({ id: theoryId, tab }));
    }
  };

  const relatedTheories = useMemo(() => {
    return theory?.relatedIds 
      ? allTheories.filter(t => theory.relatedIds?.includes(t.id))
      : [];
  }, [theory?.relatedIds, allTheories]);

  const networkNodes = useMemo(() => {
      if (!theory) return [];
      const centralNode = { id: theory.id, label: theory.title, type: 'MAIN' };
      const relatedNodes = relatedTheories.map(t => ({ 
          id: t.id, 
          label: t.title, 
          type: 'RELATED', 
          color: t.dangerLevel.includes('Extreme') ? '#ef4444' : '#06b6d4'
      }));
      return [centralNode, ...relatedNodes];
  }, [theory, relatedTheories]);

  const fetchDetails = useCallback(async (force = false) => {
      if (!theory) return;
      setLoading(true);
      if (force) setDetails(null); 
      
      try {
        const result = await analyzeTheoryWithGemini(theory, language, {
          model: settings.aiModelVersion,
          temperature: settings.aiTemperature,
          thinkingBudget: 2048, // Request deeper thought
          forceRefresh: force
        });
        
        setDetails(result);
        if (force) showToast('Analysis refreshed successfully', 'success');
      } catch (error) {
        showToast('Failed to analyze theory. AI service may be busy.', 'error');
        dispatch(addLog({ message: `Analysis Error: ${(error as Error).message}`, type: 'error' }));
        setDetails({
            ...theory,
            fullDescription: "Analysis unavailable due to network or service error.",
            originStory: "-",
            debunking: "-",
            scientificConsensus: "-",
            sources: []
        });
      } finally {
        setLoading(false);
      }
  }, [theory, language, settings.aiModelVersion, settings.aiTemperature, showToast, dispatch]);

  useEffect(() => {
    if (theory) {
        setGeneratedImage(null);
        fetchDetails(false);
    }
  }, [theory, fetchDetails]);

  const handleRefreshAnalysis = () => {
      fetchDetails(true);
  };

  const handleGenerateImage = useCallback(async () => {
    if (!theory) return;
    setImageLoading(true);
    try {
        const result = await generateTheoryImage(theory, language);
        if (result) {
            setGeneratedImage(result);
            showToast('Visual evidence generated successfully.', 'success');
        } else {
            showToast('Failed to generate image.', 'warning');
        }
    } catch (error) {
        showToast('Image generation error.', 'error');
        dispatch(addLog({ message: `Image Gen Error: ${(error as Error).message}`, type: 'error' }));
    } finally {
        setImageLoading(false);
    }
  }, [theory, language, showToast, dispatch]);

  const onBack = useCallback(() => navigate('/archive'), [navigate]);
  const onNavigateTo = useCallback((id: string) => navigate(`/archive/${id}`), [navigate]);

  const handleInterrogate = () => {
      if (!theory) return;
      const prompt = language === 'de' 
        ? `Analysiere die Akte "${theory.title}" auf logische Widersprüche.`
        : `Analyze file "${theory.title}" for logical inconsistencies.`;
        
      dispatch(injectChatContext({ 
          contextId: theory.id, 
          initialMessage: prompt 
      }));
      navigate('/chat');
  };

    const handleExportReport = () => {
        if (!theory || !details) return;

        const findings = [details.scientificConsensus, details.debunking].filter(Boolean);
        const disclaimer = language === 'de'
            ? 'Educational simulation tool only – not medical, legal or psychological advice. Always verify independently.'
            : 'Educational simulation tool only – not medical, legal or psychological advice. Always verify independently.';

        downloadFactCheckReport({
            generatedAt: new Date().toISOString(),
            reportType: 'THEORY',
            id: theory.id,
            title: theory.title,
            language,
            summary: details.fullDescription,
            findings,
            references: details.sources.map((source) => ({
                title: source.title,
                url: source.url,
                sourceType: source.sourceType,
            })),
            disclaimer,
            metadata: {
                dangerLevel: theory.dangerLevel,
                popularity: theory.popularity,
                category: theory.category,
                relatedTheoryCount: relatedTheories.length,
            },
        });

        showToast(language === 'de' ? 'Fact-Check-Report exportiert.' : 'Fact-check report exported.', 'success');
    };

  return {
    theory,
    details,
    loading,
    imageLoading,
    generatedImage,
    handleGenerateImage,
    handleRefreshAnalysis,
    handleInterrogate,
    handleExportReport,
    relatedTheories,
    isReferencesOpen,
    setIsReferencesOpen,
    activeTab,
    setActiveTab,
    networkNodes,
    onBack,
    onNavigateTo,
    t
  };
};

// --- Context & Provider ---
const TheoryDetailContext = createContext<ReturnType<typeof useTheoryDetailLogic> | undefined>(undefined);
const useTheoryDetail = () => {
  const context = useContext(TheoryDetailContext);
  if (!context) throw new Error('useTheoryDetail must be used within a TheoryDetailProvider');
  return context;
};
const TheoryDetailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useTheoryDetailLogic();
  return <TheoryDetailContext.Provider value={value}>{children}</TheoryDetailContext.Provider>;
};

const HeroSection: React.FC = () => {
  const { theory, generatedImage, imageLoading, handleGenerateImage, t } = useTheoryDetail();
  if (!theory) return null;
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-8 group">
      <div className="h-64 md:h-96 relative bg-slate-900 transition-all">
        <GenerationHUD mode="IMAGE" isVisible={imageLoading} variant="overlay" className="z-30" />
        <img src={generatedImage || theory.imageUrl} alt={`Visualisierung zur Theorie: ${theory.title}`} className={`w-full h-full object-cover transition-opacity duration-700 ${imageLoading ? 'opacity-20' : 'opacity-70'}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/60 to-transparent"></div>
        <div className="absolute top-4 right-4 z-20 flex flex-col md:flex-row gap-2">
           {theory.videoUrl && <a href={theory.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold font-mono transition-all shadow-neon-red uppercase tracking-wider"><Youtube size={16} /> Deep Dive</a>}
           <Button variant="secondary" size="sm" onClick={handleGenerateImage} disabled={imageLoading} isLoading={imageLoading} className="bg-slate-900/80 backdrop-blur-md border-white/20 hover:border-accent-purple shadow-lg">{imageLoading ? t.detail.generating : t.detail.generateImage}</Button>
        </div>
        <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge label={theory.category} color="purple" />
            <Badge label={`${t.detail.origin}: ${theory.originYear}`} className="bg-slate-800/80 text-slate-300 border-slate-600" />
            {theory.isUserCreated && <Badge label="USER FILE" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50" />}
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-3 drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)] leading-none font-display uppercase tracking-tight break-words">{theory.title}</h1>
          <p className="text-slate-300 text-sm md:text-lg max-w-2xl leading-relaxed opacity-90 font-medium drop-shadow-md border-l-2 border-accent-cyan pl-4">{theory.shortDescription}</p>
        </div>
      </div>
    </div>
  );
};

const TabNavigation: React.FC = () => {
    const { activeTab, setActiveTab, t } = useTheoryDetail();
    return (
        <div className="flex gap-2 mb-8 border-b border-white/5 pb-0 overflow-x-auto scrollbar-hide">
            {['ANALYSIS', 'NETWORK', 'TIMELINE'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex items-center gap-2 px-6 py-3 rounded-t-xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap border-t border-x outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan ${activeTab === tab ? 'bg-[#0B0F19] border-white/10 text-accent-cyan border-b-[#0B0F19]' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
                    {tab === 'ANALYSIS' && <FileText size={16} />}
                    {tab === 'NETWORK' && <GitBranch size={16} />}
                    {tab === 'TIMELINE' && <History size={16} />}
                    {tab === 'ANALYSIS' ? t.detail.theory : tab === 'NETWORK' ? t.detail.connections : t.detail.timeline}
                </button>
            ))}
        </div>
    );
};

const AnalysisContent: React.FC = () => {
    const { details, t, loading } = useTheoryDetail();
    if (loading) return <div className="lg:col-span-2 min-h-[600px] flex items-center justify-center"><GenerationHUD mode="ANALYSIS" isVisible={true} className="w-full h-96" /></div>;
    if (!details) return null;
    return (
        <div className="lg:col-span-2 space-y-8 animate-fade-in">
            <Card variant="glass" className="p-6 md:p-8 relative border-t-4 border-t-accent-cyan bg-slate-900/40">
                <div className="absolute top-6 right-6 opacity-10 text-accent-cyan pointer-events-none"><Quote size={80} /></div>
                <h3 className="flex items-center text-white text-lg font-bold mb-6 uppercase tracking-widest font-display"><BookOpen className="mr-3 text-accent-cyan" size={20} /> {t.detail.theory}</h3>
                <div className="prose prose-invert prose-lg max-w-none text-slate-300 font-sans leading-loose whitespace-pre-wrap selection:bg-accent-cyan/30">{details.fullDescription}</div>
                <div className="mt-8 flex items-center gap-2 text-xs text-slate-500 font-mono border-t border-white/5 pt-4"><Clock size={12} /> {t.detail.readTime}: {Math.ceil(details.fullDescription.length / 500)} {t.detail.min}</div>
            </Card>
            <div className="relative p-6 md:p-8 rounded-xl bg-slate-950 border border-white/10 overflow-hidden group hover:border-white/20 transition-colors">
                <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none"></div>
                <div className="relative z-10">
                    <h3 className="flex items-center text-accent-purple text-base font-bold mb-4 uppercase tracking-widest border-b border-white/10 pb-2"><History className="mr-3" size={18} /> {t.detail.origin}</h3>
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed whitespace-pre-wrap">{details.originStory}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card variant="solid" className="p-6 bg-emerald-950/20 border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                    <h3 className="flex items-center text-emerald-400 font-bold mb-4 text-xs uppercase tracking-widest"><CheckCircle2 size={16} className="mr-2" /> {t.detail.consensus}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{details.scientificConsensus}</p>
                </Card>
                <Card variant="solid" className="p-6 bg-red-950/20 border-red-500/20 hover:border-red-500/40 transition-colors">
                    <h3 className="flex items-center text-red-400 font-bold mb-4 text-xs uppercase tracking-widest"><AlertTriangle size={16} className="mr-2" /> {t.detail.refutation}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{details.debunking}</p>
                </Card>
            </div>
        </div>
    );
};

const TimelineView: React.FC = () => {
    const { theory, t } = useTheoryDetail();
    if (!theory) return null;
    const events = [
        { year: theory.originYear || t.common.unknown, title: t.detail.timelineEvents.inception.title, desc: t.detail.timelineEvents.inception.desc },
        { year: parseInt(theory.originYear?.match(/\d{4}/)?.[0] || '2000') + 5, title: t.detail.timelineEvents.threshold.title, desc: t.detail.timelineEvents.threshold.desc },
        { year: parseInt(theory.originYear?.match(/\d{4}/)?.[0] || '2000') + 10, title: t.detail.timelineEvents.mainstream.title, desc: t.detail.timelineEvents.mainstream.desc },
        { year: t.detail.present, title: t.detail.timelineEvents.current.title, desc: `${t.detail.timelineEvents.current.desc} (${theory.popularity}%)` }
    ];
    return (
        <div className="lg:col-span-2 pl-4 md:pl-0">
            <div className="relative border-l-2 border-slate-800 ml-4 space-y-12 py-4">
                {events.map((event, i) => (
                    <div key={i} className="relative pl-12 group">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-600 group-hover:border-accent-cyan group-hover:bg-accent-cyan group-hover:scale-125 transition-all shadow-[0_0_0_4px_#0f172a]"></div>
                        <Card variant="cyber" className="p-6">
                            <div className="flex items-baseline justify-between mb-2"><h3 className="text-lg font-bold text-white group-hover:text-accent-cyan transition-colors">{event.title}</h3><span className="text-sm font-mono font-bold text-slate-500 bg-slate-950 px-3 py-1 rounded border border-slate-800">{event.year}</span></div>
                            <p className="text-slate-400 text-sm leading-relaxed">{event.desc}</p>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}

const StatsCard: React.FC = () => {
  const { theory, t, handleInterrogate } = useTheoryDetail();
  if (!theory) return null;
  return (
    <div className="space-y-4">
        <Card variant="cyber" className="p-6 border-t-4 border-t-orange-500">
        <div className="mb-8">
            <h4 className="text-slate-500 text-xs font-bold uppercase mb-3 flex items-center gap-2 tracking-widest font-display"><ShieldCheck size={14} /> {t.detail.danger}</h4>
            <div className="flex items-center justify-between mb-2"><div className="text-2xl font-black text-white uppercase tracking-tight font-display">{theory.dangerLevel}</div><div className={`w-3 h-3 rounded-full ${theory.dangerLevel.includes('High') || theory.dangerLevel.includes('Extreme') ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div></div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden"><div className={`h-full rounded-full ${theory.dangerLevel.includes('High') ? 'bg-red-500' : 'bg-yellow-500'}`} style={{ width: '75%' }}></div></div>
        </div>
        <div>
            <h4 className="text-slate-500 text-xs font-bold uppercase mb-3 flex items-center gap-2 tracking-widest font-display"><History size={14} /> {t.detail.popularity}</h4>
            <div className="flex items-end gap-2 mb-1"><div className="text-4xl font-mono font-bold text-white leading-none">{theory.popularity}</div><div className="text-sm font-bold text-slate-500 mb-1">/ 100</div></div>
            <p className="text-[10px] text-slate-600 font-mono mt-2 pt-2 border-t border-slate-800">{t.detail.popSub}</p>
        </div>
        </Card>
        <button onClick={handleInterrogate} className="w-full p-4 rounded-xl bg-gradient-to-r from-accent-purple/20 to-accent-cyan/20 border border-accent-purple/50 hover:border-accent-cyan hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all group relative overflow-hidden active:scale-98 touch-manipulation">
            <div className="absolute inset-0 bg-noise opacity-10"></div>
            <div className="relative z-10 flex items-center justify-between">
                <div className="text-left"><div className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2"><MessageSquare size={16} className="text-accent-cyan" /> {t.detail.discussTheory}</div><div className="text-[10px] text-slate-400 font-mono mt-1">{t.detail.initiateContextAnalysis}</div></div>
                <div className="p-2 bg-slate-900 rounded-lg group-hover:scale-110 transition-transform"><ArrowLeft className="rotate-180 text-white" size={16} /></div>
            </div>
        </button>
    </div>
  );
};

const SourcesCard: React.FC = () => {
    const { details, t, loading, setIsReferencesOpen } = useTheoryDetail();
  if (loading) return <Card className="p-6 space-y-4"><div className="h-4 bg-slate-800 rounded w-1/3 animate-pulse"></div><div className="h-10 bg-slate-800 rounded animate-pulse"></div><div className="h-10 bg-slate-800 rounded animate-pulse"></div></Card>;
  if (!details || details.sources.length === 0) return null;
  return (
    <Card variant="glass" className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 text-xs font-bold uppercase flex items-center tracking-widest font-display"><Link size={14} className="mr-2 text-accent-cyan" /> {t.detail.sources}</h3>
                <Button size="sm" variant="secondary" onClick={() => setIsReferencesOpen(true)}>
                    {t.detail.references}
                </Button>
            </div>
      <div className="flex flex-col gap-3">
        {details.sources.map((source, idx) => (
          <div key={idx} className="group flex items-start gap-3 p-3 rounded-lg bg-slate-950/50 border border-slate-800 hover:border-slate-600 transition-all">
            <div className="mt-1 flex-shrink-0 text-blue-500 bg-blue-500/10 p-1.5 rounded"><ExternalLink size={12} /></div>
            <div className="min-w-0">{source.url ? <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-slate-300 hover:text-white hover:underline truncate block transition-colors">{source.title}</a> : <span className="text-xs font-bold text-slate-400 truncate block">{source.title}</span>}<div className="text-[10px] text-slate-600 font-mono mt-0.5 truncate">SOURCE_ID_{idx + 2490}</div></div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const RelatedTheories: React.FC = () => {
  const { relatedTheories, onNavigateTo, t } = useTheoryDetail();
  if (relatedTheories.length === 0) return null;
  return (
    <Card variant="glass" className="p-6">
      <h3 className="flex items-center text-slate-400 text-xs font-bold uppercase mb-4 tracking-widest font-display"><GitBranch className="mr-2 text-accent-purple" size={14} /> {t.detail.seeAlso}</h3>
      <div className="space-y-3">
        {relatedTheories.map((related) => (
          <div key={related.id} onClick={() => onNavigateTo(related.id)} className="group relative h-20 rounded-lg overflow-hidden cursor-pointer border border-slate-800 hover:border-accent-cyan/50 transition-all shadow-sm active:scale-[0.98]" role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') onNavigateTo(related.id); }}>
             <div className="absolute inset-0 bg-slate-900"><img src={related.imageUrl} alt={`Verwandte Theorie: ${related.title}`} className="w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-all duration-500 grayscale group-hover:grayscale-0" /><div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" /></div>
             <div className="absolute inset-0 p-3 flex flex-col justify-center z-10 pl-4"><span className="text-[9px] text-accent-purple font-mono uppercase tracking-wider mb-0.5 truncate opacity-80">{related.category}</span><h4 className="text-xs font-bold text-white group-hover:text-accent-cyan leading-tight line-clamp-2">{related.title}</h4></div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const TheoryDetailLayout: React.FC = () => {
    const {
        theory,
        onBack,
        t,
        activeTab,
        handleRefreshAnalysis,
        loading,
        onNavigateTo,
        networkNodes,
        handleExportReport,
        details,
        isReferencesOpen,
        setIsReferencesOpen
    } = useTheoryDetail();
    const navigate = useNavigate();
    if (!theory) return <PageFrame><div className="text-center py-20"><h2 className="text-2xl font-bold text-white mb-4">{t.detail.theoryNotFound}</h2><Button onClick={onBack}>{t.detail.back}</Button></div></PageFrame>;
    const handleEdit = () => navigate(`/editor/${theory.id}`);

    return (
        <PageFrame>
            <PageHeader title={(t.detail as Record<string, unknown>).caseFile as string || "CASE FILE"} subtitle={`ID: ${theory.id.toUpperCase()}`} icon={FileKey} actions={<div className="flex gap-2"><Button variant="secondary" onClick={handleRefreshAnalysis} icon={<RefreshCw size={14} />} disabled={loading} className="text-xs font-bold border-white/10 hover:border-white">{t.detail.refresh}</Button><Button variant="secondary" onClick={handleExportReport} icon={<Download size={14} />} disabled={!details} className="text-xs font-bold border-white/10 hover:border-white">{t.detail.report}</Button><Button variant="ghost" onClick={onBack} icon={<ArrowLeft size={16} />} className="text-slate-400 hover:text-white text-xs uppercase font-bold">{t.detail.back}</Button>{theory.isUserCreated && <Button variant="primary" size="sm" onClick={handleEdit} icon={<Edit3 size={14} />} className="text-xs">{t.detail.edit}</Button>}</div>} />
            <HeroSection />
            <TabNavigation />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {activeTab === 'ANALYSIS' && <AnalysisContent />}
                {activeTab === 'NETWORK' && (
                    <Card className="lg:col-span-2 h-[400px] lg:h-[600px] bg-slate-950 p-0 border border-slate-800">
                        <InteractiveForceGraph nodes={networkNodes} links={[]} onNodeClick={onNavigateTo} />
                    </Card>
                )}
                {activeTab === 'TIMELINE' && <TimelineView />}
                <div className="space-y-6">
                    <StatsCard />
                    <SourcesCard />
                    <RelatedTheories />
                </div>
            </div>

            <ReferencesModal
                isOpen={isReferencesOpen}
                onClose={() => setIsReferencesOpen(false)}
                title={theory.title}
                references={(details?.sources || []).map((source) => ({
                    title: source.title,
                    url: source.url,
                    sourceType: source.sourceType,
                    snippet: source.snippet,
                }))}
            />
        </PageFrame>
    );
};

export const TheoryDetail: React.FC = () => (
    <TheoryDetailProvider>
        <TheoryDetailLayout />
    </TheoryDetailProvider>
);

export default TheoryDetail;