
import React, { useEffect, useState, useMemo, useCallback, createContext, useContext } from 'react';
import { Theory, TheoryDetail as ITheoryDetail } from '../types';
import { analyzeTheoryWithGemini, generateTheoryImage } from '../services/geminiService';
import { 
    ArrowLeft, ShieldCheck, History, FileText, ExternalLink, Link, 
    Youtube, FileKey, GitBranch, Edit3, BookOpen, Quote, AlertTriangle, 
    CheckCircle2, Clock, RefreshCw
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSettings } from '../contexts/SettingsContext';
import { Button, Card, Badge, PageFrame, PageHeader } from './ui/Common';
import { GenerationHUD } from './ui/GenerationHUD';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectAllTheories } from '../store/slices/theoriesSlice';
import { setTheoryTab } from '../store/slices/uiSlice';

// --- 1. Logic Hook ---

const useTheoryDetailLogic = () => {
  const { theoryId } = useParams<{ theoryId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const allTheories = useAppSelector(selectAllTheories);
  const theory = allTheories.find(t => t.id === theoryId);

  // Retrieve persisted tab state from Redux
  const activeTab = useAppSelector(state => 
    theoryId ? (state.ui.theoryDetails[theoryId]?.activeTab || 'ANALYSIS') : 'ANALYSIS'
  );

  const [details, setDetails] = useState<ITheoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  const { t, language } = useLanguage();
  const { settings } = useSettings();

  const setActiveTab = (tab: 'ANALYSIS' | 'NETWORK' | 'TIMELINE') => {
    if (theoryId) {
      dispatch(setTheoryTab({ id: theoryId, tab }));
    }
  };

  // Memoize related theories
  const relatedTheories = useMemo(() => {
    return theory?.relatedIds 
      ? allTheories.filter(t => theory.relatedIds?.includes(t.id))
      : [];
  }, [theory?.relatedIds, allTheories]);

  // Construct Network Graph Data
  const networkData = useMemo(() => {
      if (!theory) return { nodes: [], links: [] };

      const centralNode = { id: theory.id, label: theory.title, type: 'MAIN', r: 40 };
      const relatedNodes = relatedTheories.map(t => ({ 
          id: t.id, 
          label: t.title, 
          type: 'RELATED', 
          r: 25,
          color: t.dangerLevel.includes('Extreme') ? '#ef4444' : '#06b6d4'
      }));
      
      const nodes = [centralNode, ...relatedNodes];
      
      // Calculate positions in a circle
      const radius = 180;
      const centerX = 400;
      const centerY = 300;
      const angleStep = (2 * Math.PI) / (relatedNodes.length || 1);
      
      const positionedNodes = nodes.map((node, i) => {
          if (node.type === 'MAIN') return { ...node, x: centerX, y: centerY };
          const angle = (i - 1) * angleStep;
          return {
              ...node,
              x: centerX + Math.cos(angle) * radius,
              y: centerY + Math.sin(angle) * radius
          };
      });

      const links = relatedNodes.map(target => ({
          source: { x: centerX, y: centerY },
          target: positionedNodes.find(n => n.id === target.id)!
      }));

      return { nodes: positionedNodes, links };
  }, [theory, relatedTheories]);

  const fetchDetails = useCallback(async (force = false) => {
      if (!theory) return;
      setLoading(true);
      if (force) setDetails(null); 
      
      const result = await analyzeTheoryWithGemini(theory, language, {
        model: settings.aiModelVersion,
        temperature: settings.aiTemperature,
        forceRefresh: force
      });
      
      setDetails(result);
      setLoading(false);
  }, [theory, language, settings.aiModelVersion, settings.aiTemperature]);

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
    const result = await generateTheoryImage(theory, language);
    setGeneratedImage(result);
    setImageLoading(false);
  }, [theory, language]);

  const onBack = useCallback(() => navigate('/archive'), [navigate]);
  const onNavigateTo = useCallback((id: string) => navigate(`/archive/${id}`), [navigate]);

  return {
    theory,
    details,
    loading,
    imageLoading,
    generatedImage,
    handleGenerateImage,
    handleRefreshAnalysis,
    relatedTheories,
    activeTab,
    setActiveTab,
    networkData,
    onBack,
    onNavigateTo,
    t
  };
};

// --- 2. Context ---

type TheoryDetailContextType = ReturnType<typeof useTheoryDetailLogic>;
const TheoryDetailContext = createContext<TheoryDetailContextType | undefined>(undefined);

const useTheoryDetail = () => {
  const context = useContext(TheoryDetailContext);
  if (!context) throw new Error('useTheoryDetail must be used within a TheoryDetailProvider');
  return context;
};

// --- 3. Provider ---

const TheoryDetailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useTheoryDetailLogic();
  return <TheoryDetailContext.Provider value={value}>{children}</TheoryDetailContext.Provider>;
};

// --- 4. Sub-components ---

const HeroSection: React.FC = () => {
  const { theory, generatedImage, imageLoading, handleGenerateImage, t } = useTheoryDetail();
  if (!theory) return null;
  
  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl mb-6 md:mb-8 group">
      <div className="h-64 md:h-96 relative bg-slate-900 transition-all">
        {/* HUD Overlay for Image Generation */}
        <GenerationHUD 
            mode="IMAGE" 
            isVisible={imageLoading} 
            variant="overlay"
            className="z-30" 
        />

        <img 
          src={generatedImage || theory.imageUrl} 
          alt="" 
          className={`w-full h-full object-cover transition-opacity duration-700 ${imageLoading ? 'opacity-20' : 'opacity-70'}`} 
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-900/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
        
        <div className="absolute top-4 right-4 z-20 flex flex-col md:flex-row gap-2">
           {theory.videoUrl && (
             <a 
               href={theory.videoUrl} 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold font-mono transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)]"
             >
                <Youtube size={16} />
                WATCH: DEEP DIVE
             </a>
           )}
           <Button 
             variant="secondary"
             size="sm"
             onClick={handleGenerateImage}
             disabled={imageLoading}
             isLoading={imageLoading}
             className="bg-slate-900/80 backdrop-blur-md border-slate-600 hover:border-accent-purple shadow-lg"
           >
             {imageLoading ? 'PROCESSING...' : t.detail.generateImage}
           </Button>
        </div>

        <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge label={theory.category} color="purple" />
            <Badge label={`Origin: ${theory.originYear}`} className="bg-slate-800/80 text-slate-300" />
            {theory.isUserCreated && (
                <Badge label="USER FILE" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50" />
            )}
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-2 drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)] leading-tight max-w-4xl tracking-tight">
            {theory.title}
          </h1>
          <p className="text-slate-300 text-sm md:text-lg max-w-2xl leading-relaxed opacity-90 font-medium drop-shadow-md">
            {theory.shortDescription}
          </p>
        </div>
      </div>
    </div>
  );
};

const TabNavigation: React.FC = () => {
    const { activeTab, setActiveTab, t } = useTheoryDetail();
    return (
        <div className="flex gap-2 mb-8 border-b border-slate-800 pb-0 overflow-x-auto scrollbar-hide">
            <button 
                onClick={() => setActiveTab('ANALYSIS')}
                className={`flex items-center gap-2 px-6 py-3 rounded-t-xl text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap border-t border-x ${activeTab === 'ANALYSIS' ? 'bg-slate-900 border-slate-700 text-accent-cyan shadow-[0_-5px_20px_rgba(6,182,212,0.05)]' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/30'}`}
            >
                <FileText size={16} /> {t.detail.theory}
            </button>
            <button 
                onClick={() => setActiveTab('NETWORK')}
                className={`flex items-center gap-2 px-6 py-3 rounded-t-xl text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap border-t border-x ${activeTab === 'NETWORK' ? 'bg-slate-900 border-slate-700 text-accent-purple shadow-[0_-5px_20px_rgba(139,92,246,0.05)]' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/30'}`}
            >
                <GitBranch size={16} /> Connections
            </button>
            <button 
                onClick={() => setActiveTab('TIMELINE')}
                className={`flex items-center gap-2 px-6 py-3 rounded-t-xl text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap border-t border-x ${activeTab === 'TIMELINE' ? 'bg-slate-900 border-slate-700 text-green-400 shadow-[0_-5px_20px_rgba(34,197,94,0.05)]' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/30'}`}
            >
                <History size={16} /> Timeline
            </button>
        </div>
    );
};

const AnalysisContent: React.FC = () => {
    const { details, t, loading } = useTheoryDetail();

    if (loading) {
        return (
            <div className="lg:col-span-2 min-h-[600px] flex items-center justify-center">
                <GenerationHUD mode="ANALYSIS" isVisible={true} className="w-full h-96" />
            </div>
        );
    }

    if (!details) return null;

    return (
        <div className="lg:col-span-2 space-y-8 animate-fade-in">
            {/* The Narrative */}
            <Card className="p-8 relative border-t-4 border-t-accent-cyan bg-slate-900/50 backdrop-blur-sm">
                <div className="absolute top-6 right-6 opacity-10 text-accent-cyan pointer-events-none">
                    <Quote size={64} />
                </div>
                <h3 className="flex items-center text-white text-lg font-bold mb-6 uppercase tracking-widest">
                    <BookOpen className="mr-3 text-accent-cyan" size={20} /> {t.detail.theory}
                </h3>
                <div className="prose prose-invert prose-lg max-w-none text-slate-300 font-serif leading-loose whitespace-pre-wrap">
                    {details.fullDescription}
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <Clock size={12} /> EST. READING TIME: {Math.ceil(details.fullDescription.length / 500)} MIN
                </div>
            </Card>

            {/* Origin Story */}
            <div className="relative p-8 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden group hover:border-slate-700 transition-colors">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
                <div className="relative z-10">
                    <h3 className="flex items-center text-accent-purple text-base font-bold mb-4 uppercase tracking-widest border-b border-slate-800 pb-2">
                        <History className="mr-3" size={18} /> {t.detail.origin}
                    </h3>
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                        {details.originStory}
                    </p>
                </div>
            </div>

            {/* Fact Check Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Consensus */}
                <Card className="p-6 bg-green-950/10 border-green-500/20 hover:border-green-500/40 transition-colors">
                    <h3 className="flex items-center text-green-400 font-bold mb-4 text-sm uppercase tracking-wider">
                        <CheckCircle2 size={18} className="mr-2" /> {t.detail.consensus}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {details.scientificConsensus}
                    </p>
                </Card>

                {/* Debunking */}
                <Card className="p-6 bg-red-950/10 border-red-500/20 hover:border-red-500/40 transition-colors">
                    <h3 className="flex items-center text-red-400 font-bold mb-4 text-sm uppercase tracking-wider">
                        <AlertTriangle size={18} className="mr-2" /> {t.detail.refutation}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {details.debunking}
                    </p>
                </Card>
            </div>
        </div>
    );
};

const NetworkGraph: React.FC = () => {
    const { networkData, onNavigateTo } = useTheoryDetail();
    
    return (
        <Card className="lg:col-span-2 h-[600px] flex flex-col p-0 relative overflow-hidden bg-slate-950 border-slate-800">
            <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur px-4 py-2 rounded-lg border border-slate-700 shadow-xl">
                <div className="text-xs font-bold text-white mb-1">NARRATIVE TOPOLOGY</div>
                <div className="text-[10px] font-mono text-slate-400">{networkData.nodes.length} NODES DETECTED</div>
            </div>
            <svg className="w-full h-full cursor-grab active:cursor-grabbing" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <radialGradient id="nodeGradient">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                    </radialGradient>
                    <marker id="arrow" viewBox="0 0 10 10" refX="25" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#334155" />
                    </marker>
                </defs>
                
                {/* Background Grid */}
                <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#smallGrid)" />

                {/* Links */}
                {networkData.links.map((link, i) => (
                    <line 
                        key={i}
                        x1={link.source.x} y1={link.source.y}
                        x2={link.target.x} y2={link.target.y}
                        stroke="#334155"
                        strokeWidth="1.5"
                        markerEnd="url(#arrow)"
                        className="animate-fade-in"
                        style={{ animationDelay: `${i * 100}ms` }}
                    />
                ))}
                
                {/* Nodes */}
                {networkData.nodes.map((node) => (
                    <g 
                        key={node.id} 
                        transform={`translate(${node.x},${node.y})`} 
                        onClick={() => node.type === 'RELATED' && onNavigateTo(node.id)}
                        className={`${node.type === 'RELATED' ? 'cursor-pointer hover:opacity-80' : ''} transition-all duration-300`}
                    >
                        {/* Outer Glow */}
                        <circle 
                            r={node.r * 1.5} 
                            fill="url(#nodeGradient)"
                        />
                        
                        {/* Main Circle */}
                        <circle 
                            r={node.r} 
                            fill={node.type === 'MAIN' ? '#0f172a' : '#1e293b'} 
                            stroke={node.type === 'MAIN' ? '#ffffff' : (node.color || '#64748b')}
                            strokeWidth={node.type === 'MAIN' ? 4 : 2}
                            className="drop-shadow-lg"
                        />
                        
                        {/* Pulse for Main */}
                        {node.type === 'MAIN' && (
                            <>
                                <circle r={node.r + 8} fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 4" className="animate-spin-slow opacity-50" />
                                <circle r={node.r} fill="#ffffff" className="animate-ping opacity-10" />
                            </>
                        )}

                        <text 
                            y={node.r + 20} 
                            textAnchor="middle" 
                            fill={node.type === 'MAIN' ? '#ffffff' : '#cbd5e1'} 
                            fontSize={node.type === 'MAIN' ? '14' : '11'}
                            fontWeight="bold"
                            fontFamily="monospace"
                            className="pointer-events-none select-none"
                        >
                            {node.label.length > 15 ? node.label.substring(0, 14) + '...' : node.label}
                        </text>
                    </g>
                ))}
            </svg>
        </Card>
    );
};

const TimelineView: React.FC = () => {
    const { theory } = useTheoryDetail();
    if (!theory) return null;

    const events = [
        { year: theory.originYear || 'Unknown', title: 'The Inception', desc: 'The narrative first appears in public discourse, often in fringe publications or isolated communities.' },
        { year: parseInt(theory.originYear?.match(/\d{4}/)?.[0] || '2000') + 5, title: 'Viral Threshold', desc: 'The theory bridges the gap from niche to subculture, gaining traction via forums or alternative media.' },
        { year: parseInt(theory.originYear?.match(/\d{4}/)?.[0] || '2000') + 10, title: 'Mainstream Exposure', desc: 'Mentioned in major media, films, or political discourse, cementing its place in the cultural zeitgeist.' },
        { year: 'Present', title: 'Current Status', desc: `Current virality index: ${theory.popularity}%. The narrative continues to evolve.` }
    ];

    return (
        <div className="lg:col-span-2 pl-4 md:pl-0">
            <div className="relative border-l-2 border-slate-800 ml-4 space-y-12 py-4">
                {events.map((event, i) => (
                    <div key={i} className="relative pl-12 group">
                        {/* Connector Dot */}
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-600 group-hover:border-accent-cyan group-hover:bg-accent-cyan group-hover:scale-125 transition-all shadow-[0_0_0_4px_#0f172a]"></div>
                        
                        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-accent-cyan/30 transition-all shadow-sm">
                            <div className="flex items-baseline justify-between mb-2">
                                <h3 className="text-lg font-bold text-white group-hover:text-accent-cyan transition-colors">{event.title}</h3>
                                <span className="text-sm font-mono font-bold text-slate-500 bg-slate-950 px-3 py-1 rounded border border-slate-800">{event.year}</span>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">{event.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const StatsCard: React.FC = () => {
  const { theory, t } = useTheoryDetail();
  if (!theory) return null;

  return (
    <Card className="p-6 border-t-4 border-t-orange-500 bg-slate-900 shadow-xl">
       <div className="mb-8">
           <h4 className="text-slate-500 text-xs font-bold uppercase mb-3 flex items-center gap-2 tracking-widest">
               <ShieldCheck size={14} /> {t.detail.danger}
           </h4>
           <div className="flex items-center justify-between mb-2">
               <div className="text-2xl font-black text-white uppercase tracking-tight">
                   {theory.dangerLevel}
               </div>
               <div className={`w-3 h-3 rounded-full ${theory.dangerLevel.includes('High') || theory.dangerLevel.includes('Extreme') ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
           </div>
           <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
               <div className={`h-full rounded-full ${theory.dangerLevel.includes('High') ? 'bg-red-500' : 'bg-yellow-500'}`} style={{ width: '75%' }}></div>
           </div>
       </div>

       <div>
           <h4 className="text-slate-500 text-xs font-bold uppercase mb-3 flex items-center gap-2 tracking-widest">
               <History size={14} /> {t.detail.popularity}
           </h4>
           <div className="flex items-end gap-2 mb-1">
               <div className="text-4xl font-mono font-bold text-white leading-none">{theory.popularity}</div>
               <div className="text-sm font-bold text-slate-500 mb-1">/ 100</div>
           </div>
           <p className="text-[10px] text-slate-600 font-mono mt-2 pt-2 border-t border-slate-800">{t.detail.popSub}</p>
       </div>
    </Card>
  );
};

const SourcesCard: React.FC = () => {
  const { details, t, loading } = useTheoryDetail();
  
  // Skeleton loading state
  if (loading) {
      return (
          <Card className="p-6 space-y-4">
              <div className="h-4 bg-slate-800 rounded w-1/3 animate-pulse"></div>
              <div className="h-10 bg-slate-800 rounded animate-pulse"></div>
              <div className="h-10 bg-slate-800 rounded animate-pulse"></div>
          </Card>
      )
  }

  if (!details || details.sources.length === 0) return null;

  return (
    <Card className="bg-slate-900/80 border-slate-800 p-6 shadow-lg">
      <h3 className="text-slate-400 text-xs font-bold uppercase mb-4 flex items-center tracking-widest">
          <Link size={14} className="mr-2 text-accent-cyan" /> {t.detail.sources}
      </h3>
      <div className="flex flex-col gap-3">
        {details.sources.map((source, idx) => (
          <div key={idx} className="group flex items-start gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-600 transition-all">
            <div className="mt-1 flex-shrink-0 text-blue-500 bg-blue-500/10 p-1.5 rounded">
                <ExternalLink size={12} />
            </div>
            <div className="min-w-0">
                {source.url ? (
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-slate-300 hover:text-white hover:underline truncate block transition-colors">
                    {source.title}
                </a>
                ) : (
                <span className="text-xs font-bold text-slate-400 truncate block">{source.title}</span>
                )}
                <div className="text-[10px] text-slate-600 font-mono mt-0.5 truncate">SOURCE_ID_{idx + 2490}</div>
            </div>
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
    <Card className="p-6">
      <h3 className="flex items-center text-slate-400 text-xs font-bold uppercase mb-4 tracking-widest">
        <GitBranch className="mr-2 text-accent-purple" size={14} /> {t.detail.seeAlso}
      </h3>
      <div className="space-y-3">
        {relatedTheories.map((related) => (
          <div 
            key={related.id} 
            onClick={() => onNavigateTo(related.id)}
            className="group relative h-20 rounded-lg overflow-hidden cursor-pointer border border-slate-800 hover:border-accent-cyan/50 transition-all shadow-sm active:scale-[0.98]"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onNavigateTo(related.id); }}
          >
             <div className="absolute inset-0 bg-slate-900">
               <img 
                 src={related.imageUrl} 
                 alt="" 
                 className="w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-all duration-500 grayscale group-hover:grayscale-0"
               />
               <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
             </div>
             
             <div className="absolute inset-0 p-3 flex flex-col justify-center z-10 pl-4">
               <span className="text-[9px] text-accent-purple font-mono uppercase tracking-wider mb-0.5 truncate opacity-80">{related.category}</span>
               <h4 className="text-xs font-bold text-white group-hover:text-accent-cyan leading-tight line-clamp-2">{related.title}</h4>
             </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// --- 5. Layout Component ---

const TheoryDetailLayout: React.FC = () => {
    const { theory, onBack, t, activeTab, handleRefreshAnalysis, loading } = useTheoryDetail();
    const navigate = useNavigate();
    
    if (!theory) {
        return (
            <PageFrame>
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-white mb-4">THEORY NOT FOUND</h2>
                    <Button onClick={onBack}>Return to Archive</Button>
                </div>
            </PageFrame>
        );
    }

    const handleEdit = () => {
        navigate(`/editor/${theory.id}`);
    };

    return (
        <PageFrame>
            <PageHeader 
                title="CASE FILE"
                subtitle={`ID: ${theory.id.toUpperCase()}`}
                icon={FileKey}
                actions={
                    <div className="flex gap-2">
                        <Button 
                            variant="secondary" 
                            onClick={handleRefreshAnalysis} 
                            icon={<RefreshCw size={14} />}
                            disabled={loading}
                            className="text-xs font-bold border-slate-600 hover:border-white"
                        >
                            Refresh Analysis
                        </Button>
                        <Button 
                            variant="ghost" 
                            onClick={onBack} 
                            icon={<ArrowLeft size={16} />}
                            className="text-slate-400 hover:text-white text-xs uppercase font-bold"
                        >
                            {t.detail.back}
                        </Button>
                        {theory.isUserCreated && (
                            <Button 
                                variant="primary" 
                                size="sm"
                                onClick={handleEdit} 
                                icon={<Edit3 size={14} />}
                                className="text-xs"
                            >
                                Edit File
                            </Button>
                        )}
                    </div>
                }
            />
            <HeroSection />
            <TabNavigation />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {activeTab === 'ANALYSIS' && <AnalysisContent />}
                {activeTab === 'NETWORK' && <NetworkGraph />}
                {activeTab === 'TIMELINE' && <TimelineView />}
                <div className="space-y-6">
                    <StatsCard />
                    <SourcesCard />
                    <RelatedTheories />
                </div>
            </div>
        </PageFrame>
    );
};

// --- 6. Main Component (Wrapper) ---

export const TheoryDetail: React.FC = () => {
  return (
    <TheoryDetailProvider>
        <TheoryDetailLayout />
    </TheoryDetailProvider>
  );
};

export default TheoryDetail;
