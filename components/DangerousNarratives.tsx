
import React, { useMemo, useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { Theory, DangerLevel, DangerLevelEn, Category, CategoryEn } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  ShieldAlert, Skull, Zap, 
  Activity, Target, AlertOctagon, 
  Microscope, Radar, BarChart2, ArrowLeft, Lock, AlertTriangle,
  Siren, Terminal, Radio, Brain, Crosshair, Wifi, Globe as GlobeIcon,
  ChevronsUp
} from 'lucide-react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, 
  Tooltip, ResponsiveContainer, Cell, ReferenceLine,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar,
  AreaChart, Area
} from 'recharts';
import { Card, Button, Badge, PageFrame, PageHeader } from './ui/Common';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectAllTheories } from '../store/slices/theoriesSlice';
import { injectChatContext } from '../store/slices/uiSlice';
import { MEDIA_ITEMS } from '../constants';
import { AUTHORS_FULL } from '../data/enriched';

// --- 0. HELPER: 3D MATH & UTILS ---

const getDangerScore = (level: string): number => {
  if (level.includes('Extreme') || level.includes('Demokratie')) return 4;
  if (level.includes('High') || level.includes('Gefährlich')) return 3;
  if (level.includes('Medium') || level.includes('Bedenklich')) return 2;
  return 1;
};

// --- 1. VISUALIZATION COMPONENTS ---

// TACTICAL GLOBE: A rotating wireframe globe rendered on Canvas
const TacticalGlobe: React.FC<{ activeNodes: number }> = ({ activeNodes }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>(0);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let rotation = 0;
        
        // Generate random "threat nodes"
        const dots: {lat: number, lon: number, size: number, color: string}[] = [];
        for(let i=0; i<activeNodes + 20; i++) {
            dots.push({
                lat: (Math.random() - 0.5) * Math.PI,
                lon: Math.random() * Math.PI * 2,
                size: Math.random() * 2 + 1,
                color: Math.random() > 0.8 ? '#ef4444' : '#06b6d4' // Red or Cyan
            });
        }

        const render = () => {
            if (!container || !canvas || !ctx) return;

            // Robust Resize Handling
            const { width, height } = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            
            // Only update width/height if dimensions changed to avoid excessive reflow
            if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
                canvas.width = width * dpr;
                canvas.height = height * dpr;
                // Important: CSS size must match display size
                canvas.style.width = `${width}px`;
                canvas.style.height = `${height}px`;
                ctx.scale(dpr, dpr);
            }

            ctx.clearRect(0, 0, width, height);
            
            const cx = width / 2;
            const cy = height / 2;
            const radius = Math.min(width, height) * 0.35;

            rotation += 0.005;

            // Draw Wireframe Sphere (Lat/Long lines)
            ctx.strokeStyle = 'rgba(30, 41, 59, 0.3)';
            ctx.lineWidth = 1;
            
            // Draw Dots
            dots.forEach(dot => {
                let x = Math.cos(dot.lat) * Math.cos(dot.lon + rotation) * radius;
                let z = Math.cos(dot.lat) * Math.sin(dot.lon + rotation) * radius;
                let y = Math.sin(dot.lat) * radius;

                // Simple 3D projection
                const scale = 300 / (300 + z);
                const x2d = x * scale + cx;
                const y2d = y * scale + cy;
                const alpha = (z + radius) / (2 * radius); // Fade back points

                if (z > -50) { // Only draw mostly front-facing
                    ctx.beginPath();
                    // Guard against negative radius from float precision errors or extreme projection
                    ctx.arc(x2d, y2d, Math.max(0, dot.size * scale), 0, Math.PI * 2);
                    ctx.fillStyle = dot.color;
                    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
                    ctx.fill();
                    
                    // Connection lines to center if high threat (red)
                    if (dot.color === '#ef4444' && Math.random() > 0.95) {
                        ctx.beginPath();
                        ctx.moveTo(cx, cy);
                        ctx.lineTo(x2d, y2d);
                        ctx.strokeStyle = 'rgba(239, 68, 68, 0.1)';
                        ctx.stroke();
                    }
                }
            });
            ctx.globalAlpha = 1;

            // Draw HUD Circle
            ctx.beginPath();
            ctx.arc(cx, cy, radius + 20, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
            ctx.setLineDash([5, 15]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Draw Scanner
            const scanAngle = (Date.now() / 1000) % (Math.PI * 2);
            const sx = Math.cos(scanAngle) * (radius + 30);
            const sy = Math.sin(scanAngle) * (radius + 30);
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + sx, cy + sy);
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
            ctx.stroke();

            requestRef.current = requestAnimationFrame(render);
        };

        // Initialize ResizeObserver to keep canvas sharp on layout changes
        const observer = new ResizeObserver(() => {
            // Re-trigger is implicit via rAF loop reading dimensions
        });
        observer.observe(container);

        requestRef.current = requestAnimationFrame(render);

        return () => {
            observer.disconnect();
            cancelAnimationFrame(requestRef.current);
        };
    }, [activeNodes]);

    return (
        <div ref={containerRef} className="w-full h-full relative min-h-[300px]">
            <canvas ref={canvasRef} className="block" role="img" aria-label="Tactical globe visualization showing global narrative threat vectors" />
        </div>
    );
};

// LIVE INTERCEPT TERMINAL
const LiveInterceptFeed: React.FC = () => {
    const { t } = useLanguage();
    const [lines, setLines] = useState<string[]>([]);
    const codes = ["X-99", "ALPHA", "OMEGA", "ZERO", "NEMESIS"];
    const regions = ["NORAM", "EMEA", "APAC", "LATAM"];

    useEffect(() => {
        const interval = setInterval(() => {
            const timestamp = new Date().toLocaleTimeString(undefined, {hour12: false}) + "." + Math.floor(Math.random()*999);
            const region = regions[Math.floor(Math.random() * regions.length)];
            const code = codes[Math.floor(Math.random() * codes.length)];
            const size = Math.floor(Math.random() * 5000) + "TB";
            
            const newLine = `[${timestamp}] SRC:${region} // PKT:${code} >> SIZE:${size} [${t.dangerPage.charts.intercepted}]`;
            
            setLines(prev => [newLine, ...prev].slice(0, 12));
        }, 800);
        return () => clearInterval(interval);
    }, [t]);

    return (
        <div className="h-full bg-black/80 font-mono text-[10px] p-4 overflow-hidden border border-slate-800 rounded-lg relative min-h-[160px]">
            <div className="absolute inset-0 bg-repeat opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(32, 255, 77, .1) 25%, rgba(32, 255, 77, .1) 26%, transparent 27%, transparent 74%, rgba(32, 255, 77, .1) 75%, rgba(32, 255, 77, .1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(32, 255, 77, .1) 25%, rgba(32, 255, 77, .1) 26%, transparent 27%, transparent 74%, rgba(32, 255, 77, .1) 75%, rgba(32, 255, 77, .1) 76%, transparent 77%, transparent)' }}></div>
            <div className="flex items-center justify-between mb-2 text-slate-500 border-b border-slate-800 pb-1 relative z-10">
                <span className="flex items-center gap-2"><Wifi size={10} className="animate-pulse text-green-500"/> {t.dangerPage.charts.feedTitle}</span>
                <span>{t.dangerPage.charts.encrypted}</span>
            </div>
            <div className="space-y-1 relative z-10">
                {lines.map((l, i) => (
                    <div key={i} className={`truncate ${i === 0 ? 'text-white font-bold' : 'text-slate-500 opacity-60'}`}>
                        {l}
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- 2. LOGIC ---

const useDangerousNarrativesLogic = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theories = useAppSelector(selectAllTheories);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  // Containment Logic
  const [deploying, setDeploying] = useState<string | null>(null);

  const dangerousTheories = useMemo(() => {
    const criticalLevels: string[] = [DangerLevel.HIGH, DangerLevel.EXTREME, DangerLevelEn.HIGH, DangerLevelEn.EXTREME];
    return theories.filter(theory => 
      criticalLevels.includes(theory.dangerLevel)
    ).sort((a, b) => (b.popularity * getDangerScore(b.dangerLevel)) - (a.popularity * getDangerScore(a.dangerLevel)));
  }, [theories]);

  // Dynamic Radar Data
  const radarData = useMemo(() => {
      const vectors = {
          [t.dangerPage.vectors.destabilization]: 0, 
          [t.dangerPage.vectors.biosecurity]: 0,    
          [t.dangerPage.vectors.revisionism]: 0,     
          [t.dangerPage.vectors.cognitive]: 0,       
          [t.dangerPage.vectors.social]: 0,          
      };

      // Map categories to these keys
      const mapCat = (cat: string): string => {
          if (cat.includes('Geo') || cat.includes('Polit')) return t.dangerPage.vectors.destabilization;
          if (cat.includes('Health') || cat.includes('Gesund')) return t.dangerPage.vectors.biosecurity;
          if (cat.includes('Hist')) return t.dangerPage.vectors.revisionism;
          if (cat.includes('Pseudo') || cat.includes('Esot')) return t.dangerPage.vectors.cognitive;
          return t.dangerPage.vectors.social;
      }

      dangerousTheories.forEach(t => {
          const score = t.popularity * getDangerScore(t.dangerLevel);
          const key = mapCat(t.category);
          if (vectors[key] !== undefined) vectors[key] += score;
      });

      const maxVal = Math.max(...Object.values(vectors), 100); 
      
      return Object.entries(vectors).map(([subject, val]) => ({
          subject,
          value: Math.min(100, (val / maxVal) * 100),
          fullMark: 100
      }));
  }, [dangerousTheories, t]);

  const chartData = useMemo(() => {
    return dangerousTheories.map(t => ({
      id: t.id,
      title: t.title,
      popularity: t.popularity,
      severity: getDangerScore(t.dangerLevel),
      z: t.popularity * getDangerScore(t.dangerLevel),
      category: t.category.split(' ')[0]
    }));
  }, [dangerousTheories]);

    const authorMediaHeatmap = useMemo(() => {
        const dangerTagSet = new Set(
            dangerousTheories.flatMap((theory) => [theory.title, ...theory.tags]).map((entry) => entry.toLowerCase())
        );

        const authorScores = new Map<string, number>();
        const authorMediaLinks = new Map<string, Set<string>>();

        MEDIA_ITEMS.forEach((media) => {
            const overlap = media.relatedTheoryTags.some((tag) => dangerTagSet.has(tag.toLowerCase()));
            if (!overlap) return;

            (media.linkedAuthorIds || []).forEach((authorId) => {
                authorScores.set(authorId, (authorScores.get(authorId) || 0) + 1);
                if (!authorMediaLinks.has(authorId)) {
                    authorMediaLinks.set(authorId, new Set<string>());
                }
                authorMediaLinks.get(authorId)?.add(media.id);
            });
        });

        return Array.from(authorScores.entries())
            .map(([authorId, score]) => {
                const author = AUTHORS_FULL.find((a) => a.id === authorId);
                const linkedMediaIds = Array.from(authorMediaLinks.get(authorId) || []).slice(0, 3);
                const linkedMedia = linkedMediaIds
                    .map((mediaId) => MEDIA_ITEMS.find((media) => media.id === mediaId))
                    .filter((media): media is (typeof MEDIA_ITEMS)[number] => Boolean(media))
                    .map((media) => ({ id: media.id, title: media.title }));

                return {
                    authorId,
                    name: author?.name || authorId,
                    score,
                    influence: author?.influenceLevel || 0,
                    intensity: Math.min(100, score * 12 + Math.round((author?.influenceLevel || 0) * 0.4)),
                    linkedMedia
                };
            })
            .sort((a, b) => b.intensity - a.intensity)
            .slice(0, 8);
    }, [dangerousTheories]);

  const activeDefcon = useMemo(() => {
      const count = dangerousTheories.length;
      if (count > 8) return 1;
      if (count > 5) return 2;
      if (count > 3) return 3;
      if (count > 0) return 4;
      return 5;
  }, [dangerousTheories]);

  const onNavigateTo = (id: string) => navigate(`/archive/${id}`);
    const onNavigateToAuthor = (id: string) => navigate(`/authors/${id}`);
    const onNavigateToMedia = (id: string) => navigate(`/media/${id}`);
  
  const onInitiateContainment = (theory: Theory) => {
      setDeploying(theory.id);
      
      // Simulate "deploying" sequence
      setTimeout(() => {
        const prompt = language === 'de' 
            ? `Das Narrativ "${theory.title}" wurde als gefährlich eingestuft (Level: ${theory.dangerLevel}). Bitte analysiere die rhetorischen Strategien und widerlege die Kernbehauptungen.`
            : `The narrative "${theory.title}" has been flagged as a threat (Level: ${theory.dangerLevel}). Please analyze its rhetorical strategies and debunk its core claims.`;
            
        dispatch(injectChatContext({ 
            contextId: theory.id, 
            initialMessage: prompt 
        }));
        navigate('/chat');
      }, 1500);
  };

  const onBack = () => navigate('/');

  return {
    t,
    dangerousTheories,
    chartData,
    radarData,
    hoveredId,
    setHoveredId,
    activeDefcon,
    authorMediaHeatmap,
    onNavigateTo,
        onNavigateToAuthor,
        onNavigateToMedia,
    onInitiateContainment,
    onBack,
    deploying
  };
};

const DangerousNarrativesContext = createContext<ReturnType<typeof useDangerousNarrativesLogic> | undefined>(undefined);
const useDangerousNarratives = () => {
  const ctx = useContext(DangerousNarrativesContext);
  if (!ctx) throw new Error('useDangerousNarratives must be used within a DangerousNarrativesProvider');
  return ctx;
};

// --- 3. SUB-COMPONENTS ---

const ThreatMatrixChart: React.FC = () => {
  const { chartData, setHoveredId, t } = useDangerousNarratives();
  return (
    <Card className="h-[300px] w-full bg-slate-900/50 border-red-900/30 p-4 relative overflow-hidden flex flex-col backdrop-blur-md">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-red-500 animate-pulse">
          <Crosshair size={120} />
      </div>
      <div className="flex justify-between items-center mb-2 border-b border-red-900/20 pb-2">
          <div className="text-[10px] font-mono text-red-400 uppercase tracking-widest flex items-center gap-2">
              <BarChart2 size={12} /> {t.dangerPage.charts.scatterTitle}
          </div>
          <div className="flex gap-2">
             <Badge label="Live Feed" className="bg-red-950/50 text-red-500 border-red-900 animate-pulse" />
          </div>
      </div>
      <div className="w-full flex-1">
        <ResponsiveContainer width="100%" height="100%" debounce={200} minWidth={0}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <XAxis 
                type="number" 
                dataKey="popularity" 
                name={t.dangerPage.charts.scatterX} 
                unit="%" 
                stroke="#64748b" 
                tick={{fontSize: 9, fontFamily: 'monospace', fill: '#64748b'}}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
            />
            <YAxis 
                type="number" 
                dataKey="severity" 
                name={t.dangerPage.charts.scatterY} 
                domain={[0, 5]} 
                stroke="#64748b"
                tick={{fontSize: 9, fontFamily: 'monospace', fill: '#64748b'}}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                tickFormatter={(val) => ['-', 'LOW', 'MED', 'HIGH', 'EXT'][val] || ''}
            />
            <ZAxis type="number" dataKey="z" range={[60, 500]} />
            <Tooltip 
                cursor={{ strokeDasharray: '3 3', stroke: '#ef4444' }}
                content={({ active, payload }) => {
                if (active && payload && payload.length && payload[0] && payload[0].payload) {
                    const d = payload[0].payload;
                    return (
                    <div className="bg-slate-950 border border-red-500/50 p-3 rounded shadow-xl backdrop-blur-md z-50">
                        <div className="text-white font-bold text-xs mb-1 uppercase tracking-wide">{d.title}</div>
                        <div className="w-full h-px bg-red-900/50 my-1"></div>
                        <div className="text-[10px] text-slate-400 font-mono">
                           <span className="text-accent-cyan">{t.dangerPage.charts.scatterX.toUpperCase()}:</span> {d.popularity}%<br/>
                           <span className="text-red-500">{t.dangerPage.charts.scatterY.toUpperCase()}:</span> {d.severity}/4
                        </div>
                    </div>
                    );
                }
                return null;
                }}
            />
            <ReferenceLine y={2.5} stroke="#ef4444" strokeDasharray="3 3" opacity={0.5} />
            <Scatter name="Threats" data={chartData} shape="circle" onMouseEnter={(data) => setHoveredId(data.payload.id)} onMouseLeave={() => setHoveredId(null)}>
                {chartData.map((entry, index) => (
                <Cell 
                    key={`cell-${index}`} 
                    fill={entry.severity >= 3 ? '#ef4444' : '#f59e0b'} 
                    fillOpacity={0.6}
                    stroke={entry.severity >= 3 ? '#ef4444' : '#f59e0b'}
                    className="hover:opacity-100 transition-opacity cursor-crosshair"
                />
                ))}
            </Scatter>
            </ScatterChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

const ImpactVectorRadar: React.FC = () => {
    const { radarData, t } = useDangerousNarratives();
    return (
        <Card className="h-full min-h-[300px] w-full bg-slate-900/50 border-red-900/30 p-4 relative overflow-hidden flex flex-col backdrop-blur-md">
            <div className="flex justify-between items-center mb-2 border-b border-red-900/20 pb-2">
                <div className="text-[10px] font-mono text-red-400 uppercase tracking-widest flex items-center gap-2">
                    <Radar size={12} /> {t.dangerPage.charts.radarTitle}
                </div>
            </div>
            <div className="w-full relative flex-1">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <RechartsRadar
                            name="Threat"
                            dataKey="value"
                            stroke="#ef4444"
                            strokeWidth={2}
                            fill="#ef4444"
                            fillOpacity={0.2}
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ef4444', fontSize: '10px' }}
                            itemStyle={{ color: '#fca5a5' }} 
                        />
                    </RadarChart>
                </ResponsiveContainer>
                {/* Decorative scanning circle */}
                <div className="absolute inset-0 pointer-events-none border border-red-500/10 rounded-full scale-75 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
            </div>
        </Card>
    )
};

const DefconStatus: React.FC = () => {
    const { activeDefcon, t } = useDangerousNarratives();
    
    const colors = {
        5: { text: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/30' },
        4: { text: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30' },
        3: { text: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
        2: { text: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
        1: { text: 'text-red-600', bg: 'bg-red-600/10', border: 'border-red-600/50' }
    };
    const style = colors[activeDefcon as keyof typeof colors];

    return (
        <Card className={`h-full flex flex-col items-center justify-center p-6 border-2 ${style.border} ${style.bg} relative overflow-hidden min-h-[160px]`}>
            {/* Blinking Background for DEFCON 1 */}
            {activeDefcon === 1 && <div className="absolute inset-0 bg-red-900/20 animate-pulse pointer-events-none"></div>}
            
            <div className={`text-[10px] uppercase font-bold tracking-[0.3em] mb-2 opacity-80 ${style.text}`}>{t.dangerPage.defcon}</div>
            <div className={`text-7xl font-black tracking-tighter font-display ${style.text} drop-shadow-2xl`}>
                {activeDefcon}
            </div>
            <div className={`text-xs mt-3 font-mono uppercase tracking-widest font-bold ${style.text}`}>
                {t.dangerPage.readiness[activeDefcon === 1 ? 'max' : activeDefcon <= 3 ? 'elevated' : 'normal']}
            </div>
            
            {/* Decorative Bars */}
            <div className="absolute bottom-4 left-4 right-4 flex gap-1 h-1">
                {[1,2,3,4,5].map(i => (
                    <div key={i} className={`flex-1 rounded-full ${i >= activeDefcon ? style.bg.replace('/10', '/50') : 'bg-slate-800'}`}></div>
                ))}
            </div>
        </Card>
    );
};

const TacticalDossierList: React.FC = () => {
    const { dangerousTheories, t, onNavigateTo, onInitiateContainment, deploying } = useDangerousNarratives();

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4 px-2">
                <Siren className="text-red-500 animate-pulse" size={18} />
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">{t.dangerPage.listHeader}</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-red-900/50 to-transparent"></div>
            </div>

            <div className="grid gap-3">
                {dangerousTheories.map((theory) => {
                    const isDeploying = deploying === theory.id;
                    return (
                        <div 
                            key={theory.id} 
                            className="group relative bg-slate-900/80 border border-slate-800 hover:border-red-500/50 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.1)] flex flex-col md:flex-row"
                        >
                            {/* Accent Bar */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${theory.dangerLevel.includes('Extreme') ? 'bg-red-600' : 'bg-orange-500'} transition-all group-hover:w-1.5`}></div>
                            
                            <div className="p-4 pl-6 flex-1 flex flex-col justify-center">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-slate-200 group-hover:text-white text-sm uppercase tracking-wide cursor-pointer" onClick={() => onNavigateTo(theory.id)}>
                                            {theory.title}
                                        </h4>
                                        {theory.dangerLevel.includes('Extreme') && <AlertTriangle size={12} className="text-red-500" />}
                                    </div>
                                    <span className="text-[9px] font-mono text-slate-500 border border-slate-800 px-1.5 rounded">{theory.id.toUpperCase()}</span>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500">
                                    <span className="flex items-center gap-1"><Radio size={10} className="text-accent-cyan"/> VIRAL: {theory.popularity}%</span>
                                    <span className="flex items-center gap-1"><Target size={10} className="text-red-400"/> IMPACT: {getDangerScore(theory.dangerLevel) * 25}</span>
                                </div>
                            </div>

                            {/* Action Area */}
                            <div className="bg-slate-900/50 border-l border-slate-800 p-3 flex items-center gap-2 justify-end min-w-[140px]">
                                {isDeploying ? (
                                    <div className="flex items-center gap-2 text-green-400 text-[10px] font-bold font-mono animate-pulse uppercase">
                                        <Terminal size={12} /> {t.dangerPage.actions.deploying}
                                    </div>
                                ) : (
                                    <>
                                        <button 
                                            onClick={() => onNavigateTo(theory.id)}
                                            className="p-2 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                                            title={t.dangerPage.actions.view}
                                        >
                                            <Microscope size={16} />
                                        </button>
                                        <button 
                                            onClick={() => onInitiateContainment(theory)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-red-900/20 hover:bg-red-600 border border-red-900/50 hover:border-red-500 text-red-400 hover:text-white rounded text-[10px] font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-900/10 hover:shadow-red-600/20"
                                        >
                                            <ShieldAlert size={12} /> {t.dangerPage.actions.counter}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const AuthorMediaHeatmapCard: React.FC = () => {
    const { authorMediaHeatmap, onNavigateToAuthor, onNavigateToMedia, t } = useDangerousNarratives();

    return (
        <Card className="p-4 bg-slate-900/50 border-red-900/30">
            <div className="text-[10px] font-mono text-red-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                <Brain size={12} /> {t.dangerPage.heatmap.title}
            </div>

            {authorMediaHeatmap.length === 0 ? (
                <div className="text-xs text-slate-500">{t.dangerPage.heatmap.empty}</div>
            ) : (
                <div className="space-y-2">
                    {authorMediaHeatmap.map((row) => (
                        <div key={row.authorId} className="space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                                <button
                                    onClick={() => onNavigateToAuthor(row.authorId)}
                                    className="text-slate-300 truncate pr-2 hover:text-accent-cyan transition-colors text-left"
                                    title={t.dangerPage.heatmap.openAuthor}
                                >
                                    {row.name}
                                </button>
                                <span className="font-mono text-slate-500">{row.intensity}</span>
                            </div>
                            <div className="h-1.5 rounded bg-slate-800 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-accent-cyan to-red-500" style={{ width: `${row.intensity}%` }} />
                            </div>
                            {row.linkedMedia.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-1">
                                    {row.linkedMedia.map((media) => (
                                        <button
                                            key={media.id}
                                            onClick={() => onNavigateToMedia(media.id)}
                                            className="px-1.5 py-0.5 rounded border border-slate-700 text-[9px] text-slate-400 hover:text-accent-purple hover:border-accent-purple/40 transition-colors"
                                            title={t.dangerPage.heatmap.openMedia}
                                        >
                                            {media.title}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

// --- 4. MAIN LAYOUT ---

export const DangerousNarratives: React.FC = () => {
  const logic = useDangerousNarrativesLogic();

  return (
      <DangerousNarrativesContext.Provider value={logic}>
        <PageFrame>
          <PageHeader 
            title={logic.t.dangerPage.title}
            subtitle={logic.t.dangerPage.subtitle}
            icon={Siren}
            status={logic.t.dangerPage.status}
            statusColor="bg-red-600"
            visualizerState="ALERT"
            actions={
                <Button variant="ghost" onClick={logic.onBack} size="sm" icon={<ArrowLeft size={16} />}>
                    {logic.t.detail.back}
                </Button>
            }
          />
          
          {/* Top Row: Visualizations - Robust Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
             {/* Defcon & Feed */}
             <div className="flex flex-col gap-6 h-full min-h-[340px]">
                <div className="flex-1 min-h-[160px]"><DefconStatus /></div>
                <div className="flex-1 min-h-[160px]"><LiveInterceptFeed /></div>
             </div>

             {/* 3D Globe */}
             <div className="md:col-span-2 relative min-h-[340px] h-full">
                <Card className="w-full h-full p-0 bg-slate-950 border-slate-800 relative overflow-hidden group">
                    <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur px-2 py-1 rounded border border-slate-700 text-[10px] font-mono text-accent-cyan flex items-center gap-2">
                        <GlobeIcon size={12} className="animate-spin-slow" /> {logic.t.dangerPage.charts.globeLabel}
                    </div>
                    <TacticalGlobe activeNodes={logic.dangerousTheories.length} />
                    {/* Decorative Grid Overlay */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
                </Card>
             </div>

             {/* Radar */}
             <div className="h-full min-h-[340px]">
                <ImpactVectorRadar />
             </div>
          </div>

          {/* Bottom Row: List & Scatter */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2">
                <TacticalDossierList />
             </div>
             <div className="lg:col-span-1 space-y-6">
                <ThreatMatrixChart />
                     <AuthorMediaHeatmapCard />
                
                {/* Alert Box */}
                <div className="p-4 rounded-lg bg-red-950/20 border border-red-900/50 flex gap-4 items-start">
                    <AlertOctagon className="text-red-500 shrink-0 mt-1" size={24} />
                    <div>
                        <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-1">{logic.t.dangerPage.advisory.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            {logic.t.dangerPage.advisory.text}
                        </p>
                    </div>
                </div>
             </div>
          </div>

        </PageFrame>
      </DangerousNarrativesContext.Provider>
  );
};

export default DangerousNarratives;
