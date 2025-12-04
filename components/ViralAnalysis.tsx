
import React, { useMemo, useEffect, useRef, useCallback, createContext, useContext, useState } from 'react';
import { SimulationParams } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Radio, Globe, Smartphone, BarChart3, 
  History, BookOpen, Network, Gauge, ArrowLeft, RefreshCw, Undo, Redo,
  Flame, Zap, Shield, Users, Clock, Layers, Star
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, 
  ResponsiveContainer, CartesianGrid
} from 'recharts';
import { Card, Button, PageFrame, PageHeader } from './ui/Common';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setParams, resetParams } from '../store/slices/simulationSlice';
import { selectAllTheories } from '../store/slices/theoriesSlice';
import { ActionCreators } from 'redux-undo';
import { useNavigate } from 'react-router-dom';

// --- Types ---

interface Node {
    x: number;
    y: number;
    vx: number;
    vy: number;
    infected: boolean;
    infectionTime: number;
    resistance: number;
    group: number; // 0-3 for cluster logic
    type: 'NORMAL' | 'INFLUENCER' | 'BOT';
}

// --- 1. Logic Hook ---

const useViralAnalysisLogic = () => {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theories = useAppSelector(selectAllTheories);
  
  const params = useAppSelector(state => state.simulation.present.params);
  const rValue = useAppSelector(state => state.simulation.present.rValue);
  
  const [renderMode, setRenderMode] = useState<'NODES' | 'HEATMAP'>('NODES');
  const [interventionActive, setInterventionActive] = useState<string | null>(null);
  
  const past = useAppSelector(state => state.simulation.past);
  const future = useAppSelector(state => state.simulation.future);
  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const timelineData = useMemo(() => {
    const data: Record<string, number> = {};
    theories.forEach(t => {
      let year = 2000;
      const match = t.originYear?.match(/\d{4}/);
      if (match) year = parseInt(match[0], 10);
      
      const bucket = Math.floor(year / 5) * 5; 
      data[bucket] = (data[bucket] || 0) + 1;
    });

    return Object.entries(data)
      .map(([year, count]) => ({ year: parseInt(year, 10), count }))
      .sort((a, b) => a.year - b.year)
      .filter(d => d.year > 1950);
  }, [theories]);

  const topViralTheories = useMemo(() => {
      return [...theories].sort((a,b) => b.popularity - a.popularity).slice(0,6);
  }, [theories]);

  const handleParamChange = useCallback((key: keyof SimulationParams, val: number) => {
      dispatch(setParams({ ...params, [key]: val }));
  }, [dispatch, params]);

  const applyScenario = (type: 'ECHO' | 'BOTS' | 'ORGANIC' | 'LOCKDOWN') => {
      switch(type) {
          case 'ECHO':
              dispatch(setParams({ ...params, emotionalPayload: 80, novelty: 20, visualProof: 30, echoChamberDensity: 95 }));
              break;
          case 'BOTS':
              dispatch(setParams({ ...params, emotionalPayload: 30, novelty: 90, visualProof: 10, echoChamberDensity: 10 }));
              break;
          case 'ORGANIC':
              dispatch(setParams({ ...params, emotionalPayload: 60, novelty: 60, visualProof: 60, echoChamberDensity: 40 }));
              break;
          case 'LOCKDOWN':
              dispatch(setParams({ ...params, emotionalPayload: 10, novelty: 10, visualProof: 90, echoChamberDensity: 5 }));
              break;
      }
  };

  const triggerIntervention = (type: 'FACT_CHECK' | 'BAN' | 'ALGO_RESET') => {
      setInterventionActive(type);
      setTimeout(() => setInterventionActive(null), 2000);
  };

  const handleReset = useCallback(() => dispatch(resetParams()), [dispatch]);
  const handleUndo = useCallback(() => dispatch(ActionCreators.undo()), [dispatch]);
  const handleRedo = useCallback(() => dispatch(ActionCreators.redo()), [dispatch]);
  
  const handleJump = useCallback((step: number) => {
      const current = past.length;
      const delta = step - current;
      dispatch(ActionCreators.jump(delta));
  }, [dispatch, past.length]);

  const getRColor = useCallback((r: number) => {
        if (r < 1) return 'text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]';
        if (r < 2.5) return 'text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]';
        if (r < 5) return 'text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]';
        return 'text-red-600 animate-pulse drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]';
  }, []);

  const getStatus = useCallback((r: number) => {
        if (r < 1) return 'CONTAINED';
        if (r < 2.5) return 'SPREADING';
        if (r < 5) return 'VIRAL';
        return 'PANDEMIC';
  }, []);

  const onBack = () => navigate('/');
  const onNavigateTo = (id: string) => navigate(`/archive/${id}`);

  return {
    t,
    params,
    rValue,
    past,
    future,
    canUndo,
    canRedo,
    timelineData,
    topViralTheories,
    renderMode,
    setRenderMode,
    interventionActive,
    handleParamChange,
    handleReset,
    handleUndo,
    handleRedo,
    handleJump,
    applyScenario,
    triggerIntervention,
    onBack,
    onNavigateTo,
    getRColor,
    getStatus
  };
};

// --- 2. Context & Provider ---

type ViralAnalysisContextType = ReturnType<typeof useViralAnalysisLogic>;
const ViralAnalysisContext = createContext<ViralAnalysisContextType | undefined>(undefined);

const useViralAnalysis = () => {
  const context = useContext(ViralAnalysisContext);
  if (!context) throw new Error('useViralAnalysis must be used within a ViralAnalysisProvider');
  return context;
};

const ViralAnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const logic = useViralAnalysisLogic();
  return <ViralAnalysisContext.Provider value={logic}>{children}</ViralAnalysisContext.Provider>;
};

// --- 3. Sub-Components ---

const ViralitySimulator: React.FC = React.memo(() => {
    const { params, rValue, canUndo, canRedo, past, future, handleReset, handleUndo, handleRedo, handleJump, handleParamChange, getRColor, getStatus, applyScenario, t } = useViralAnalysis();

    const historyTotal = past.length + 1 + future.length;
    const currentStep = past.length;

    return (
        <Card className="bg-slate-950/50 border-slate-800 p-0 h-full flex flex-col relative overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-700 text-accent-cyan">
                        <Gauge size={16} />
                    </div>
                    <div>
                        <h3 className="font-bold font-mono text-xs uppercase tracking-widest text-white">{t.viralPage.sim.core}</h3>
                        <div className="text-[9px] text-slate-500">v3.5.0 (Influencer Logic)</div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleUndo} disabled={!canUndo} className="h-6 w-6 p-0 border border-slate-700 bg-slate-900/50 text-slate-400 hover:text-white" icon={<Undo size={12} />} />
                    <Button variant="ghost" size="sm" onClick={handleRedo} disabled={!canRedo} className="h-6 w-6 p-0 border border-slate-700 bg-slate-900/50 text-slate-400 hover:text-white" icon={<Redo size={12} />} />
                    <Button variant="ghost" size="sm" onClick={handleReset} className="h-6 text-[10px] uppercase tracking-wide border border-slate-700 bg-slate-900/50 text-slate-400 hover:text-white hover:border-slate-500 ml-2" icon={<RefreshCw size={10} />}>
                        {t.common.reset}
                    </Button>
                </div>
            </div>

            <div className="px-5 py-2 border-b border-slate-800/50 bg-slate-900/20">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mb-1">
                    <span className="flex items-center gap-1"><Clock size={10} /> TIMELINE</span>
                    <span>STEP {currentStep} / {historyTotal - 1}</span>
                </div>
                <div className="relative h-2 w-full bg-slate-900 rounded-full border border-slate-800">
                    <div 
                        className="absolute top-0 left-0 h-full bg-accent-purple/50 rounded-full"
                        style={{ width: `${(currentStep / (historyTotal - 1 || 1)) * 100}%` }}
                    ></div>
                    <input 
                        type="range" 
                        min="0" 
                        max={historyTotal - 1 || 0} 
                        value={currentStep}
                        onChange={(e) => handleJump(parseInt(e.target.value, 10))}
                        disabled={historyTotal <= 1}
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                </div>
            </div>

            <div className="p-4 grid grid-cols-2 gap-2 border-b border-slate-800/50 bg-slate-900/20">
                <button onClick={() => applyScenario('ECHO')} className="flex items-center gap-2 px-3 py-2 rounded bg-slate-900 border border-slate-800 hover:border-accent-purple text-[10px] font-bold uppercase text-slate-400 hover:text-white transition-all">
                    <Network size={12} className="text-accent-purple" /> {t.viralPage.sim.scenarios.echo}
                </button>
                <button onClick={() => applyScenario('BOTS')} className="flex items-center gap-2 px-3 py-2 rounded bg-slate-900 border border-slate-800 hover:border-red-500 text-[10px] font-bold uppercase text-slate-400 hover:text-white transition-all">
                    <Zap size={12} className="text-red-500" /> {t.viralPage.sim.scenarios.bot}
                </button>
                <button onClick={() => applyScenario('ORGANIC')} className="flex items-center gap-2 px-3 py-2 rounded bg-slate-900 border border-slate-800 hover:border-green-500 text-[10px] font-bold uppercase text-slate-400 hover:text-white transition-all">
                    <Users size={12} className="text-green-500" /> {t.viralPage.sim.scenarios.organic}
                </button>
                <button onClick={() => applyScenario('LOCKDOWN')} className="flex items-center gap-2 px-3 py-2 rounded bg-slate-900 border border-slate-800 hover:border-blue-500 text-[10px] font-bold uppercase text-slate-400 hover:text-white transition-all">
                    <Shield size={12} className="text-blue-500" /> {t.viralPage.sim.scenarios.lockdown}
                </button>
            </div>

            <div className="p-6 space-y-6 flex-1 relative z-10 overflow-y-auto custom-scrollbar">
                {[
                    { key: 'emotionalPayload', label: t.viralPage.sim.params.emotional, icon: '😡', desc: 'Anger/Fear multiplier' },
                    { key: 'novelty', label: t.viralPage.sim.params.novelty, icon: '⚡', desc: 'Information freshness' },
                    { key: 'visualProof', label: t.viralPage.sim.params.visual, icon: '📸', desc: 'Deepfake/Context credibility' },
                    { key: 'echoChamberDensity', label: t.viralPage.sim.params.echo, icon: '🕸️', desc: 'Network isolation factor' },
                ].map((item) => (
                    <div key={item.key} className="group">
                        <div className="flex justify-between items-end mb-3">
                            <span className="text-xs text-slate-300 font-bold flex items-center gap-2 font-mono uppercase tracking-wide">
                                <span className="text-base opacity-70 grayscale group-hover:grayscale-0 transition-all">{item.icon}</span> {item.label}
                            </span>
                            <span className="text-[10px] font-mono text-accent-cyan bg-accent-cyan/5 border border-accent-cyan/20 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                                {params[item.key as keyof SimulationParams]}%
                            </span>
                        </div>
                        <div className="relative h-2 w-full bg-slate-900 rounded-full border border-slate-800 group-hover:border-slate-700 transition-colors">
                            <div 
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-150"
                                style={{ width: `${params[item.key as keyof SimulationParams]}%` }}
                            ></div>
                            <input 
                                type="range" min="0" max="100" 
                                value={params[item.key as keyof SimulationParams]}
                                onChange={(e) => handleParamChange(item.key as keyof SimulationParams, parseInt(e.target.value, 10))}
                                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                aria-label={`Adjust ${item.label}`}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6 bg-slate-950/80 border-t border-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-accent-cyan/5 pointer-events-none"></div>
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <div className="text-[10px] uppercase text-slate-500 font-bold mb-1 tracking-widest font-mono">Viral Coefficient</div>
                        <div className={`text-xs font-bold font-mono ${getRColor(rValue)}`}>
                            STATUS: {getStatus(rValue)}
                        </div>
                    </div>
                    <div className={`text-5xl font-mono font-bold tracking-tighter ${getRColor(rValue)} transition-all duration-300`}>
                        {rValue}
                    </div>
                </div>
            </div>
        </Card>
    );
});

const PropagationNetwork: React.FC = React.memo(() => {
    const { params, renderMode, setRenderMode, interventionActive, triggerIntervention, t } = useViralAnalysis();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const nodesRef = useRef<Node[]>([]);
    const reqRef = useRef<number | null>(null);
    
    // Stats for HUD
    const [stats, setStats] = useState({ infected: 0, total: 120 });

    const spreadRadius = 80 + (params.echoChamberDensity * 1.2); 
    const infectionProb = 0.002 + (params.emotionalPayload * 0.0005) + (params.novelty * 0.0003); 
    const speed = 0.5 + (params.visualProof * 0.02);

    const createNodes = (width: number, height: number) => {
        const count = 120;
        const newNodes: Node[] = [];
        for(let i=0; i<count; i++) {
            const rand = Math.random();
            let type: Node['type'] = 'NORMAL';
            if (rand > 0.98) type = 'INFLUENCER'; // Top 2%
            else if (rand > 0.93) type = 'BOT'; // Top 5% bots

            newNodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: type === 'INFLUENCER' ? (Math.random() - 0.5) * 0.2 : (Math.random() - 0.5) * 1.5, // Influencers move slow
                vy: type === 'INFLUENCER' ? (Math.random() - 0.5) * 0.2 : (Math.random() - 0.5) * 1.5,
                infected: i < 3,
                infectionTime: i < 3 ? Date.now() : 0,
                resistance: type === 'INFLUENCER' ? 0.95 : Math.random(), // Influencers hard to change
                group: Math.floor(Math.random() * 4),
                type
            });
        }
        return newNodes;
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if(!canvas || !container) return;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const width = container.clientWidth;
            const height = container.clientHeight;
            
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            if (nodesRef.current.length === 0) {
                nodesRef.current = createNodes(width, height);
            } else {
                nodesRef.current.forEach(node => {
                    node.x = Math.min(Math.max(node.x, 0), width);
                    node.y = Math.min(Math.max(node.y, 0), height);
                });
            }
        };
        resize();
        window.addEventListener('resize', resize);

        const ctx = canvas.getContext('2d');
        if(!ctx) return;

        const render = () => {
            const width = canvas.width / (window.devicePixelRatio || 1);
            const height = canvas.height / (window.devicePixelRatio || 1);
            
            ctx.resetTransform();
            ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

            if (renderMode === 'HEATMAP') {
                ctx.fillStyle = 'rgba(2, 6, 23, 0.05)';
            } else {
                ctx.fillStyle = 'rgba(2, 6, 23, 0.2)'; 
            }
            ctx.fillRect(0, 0, width, height);

            const nodes = nodesRef.current;
            let currentInfected = 0;

            for(let i=0; i<nodes.length; i++) {
                const node = nodes[i];
                if (node.infected) currentInfected++;

                // Interventions
                if (interventionActive === 'FACT_CHECK') {
                    if (node.infected && Math.random() < 0.02) node.infected = false; 
                }
                if (interventionActive === 'BAN' && node.infected && Math.random() < 0.05) {
                    node.x = -1000;
                    node.vx = 0;
                }

                // Echo Chamber Logic (Bots ignore boundaries)
                if (params.echoChamberDensity > 60 && node.type !== 'BOT') {
                    const qW = width / 2;
                    const qH = height / 2;
                    const qX = (node.group % 2) * qW;
                    const qY = Math.floor(node.group / 2) * qH;
                    
                    if (node.x < qX) node.vx = Math.abs(node.vx);
                    if (node.x > qX + qW) node.vx = -Math.abs(node.vx);
                    if (node.y < qY) node.vy = Math.abs(node.vy);
                    if (node.y > qY + qH) node.vy = -Math.abs(node.vy);
                }

                // Velocity Boost for Bots
                const currentSpeed = node.type === 'BOT' ? speed * 2.5 : speed;
                node.x += node.vx * currentSpeed;
                node.y += node.vy * currentSpeed;

                // Bounce walls
                if(node.x < 0) { node.x = 0; node.vx = Math.abs(node.vx); }
                if(node.x > width) { node.x = width; node.vx = -Math.abs(node.vx); }
                if(node.y < 0) { node.y = 0; node.vy = Math.abs(node.vy); }
                if(node.y > height) { node.y = height; node.vy = -Math.abs(node.vy); }

                // Connections
                for(let j=i+1; j<nodes.length; j++) {
                    const other = nodes[j];
                    const dx = node.x - other.x;
                    const dy = node.y - other.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);

                    // Influencers have 2x reach
                    const reachMultiplier = (node.type === 'INFLUENCER' || other.type === 'INFLUENCER') ? 2 : 1;

                    if(dist < spreadRadius * reachMultiplier) {
                        if (node.infected !== other.infected) {
                            const source = node.infected ? node : other;
                            const target = node.infected ? other : node;
                            
                            // Bots infect aggressively
                            const botBoost = source.type === 'BOT' ? 3 : 1;
                            
                            if (Math.random() < infectionProb * botBoost && target.resistance < 0.9) {
                                target.infected = true;
                                target.infectionTime = Date.now();
                            }
                        }

                        if (renderMode === 'NODES') {
                            const alpha = 1 - (dist / (spreadRadius * reachMultiplier));
                            ctx.beginPath();
                            ctx.moveTo(node.x, node.y);
                            ctx.lineTo(other.x, other.y);
                            
                            if (node.infected && other.infected) {
                                ctx.strokeStyle = `rgba(239, 68, 68, ${alpha})`; 
                                ctx.lineWidth = 1.5;
                            } else if (node.infected || other.infected) {
                                ctx.strokeStyle = `rgba(234, 179, 8, ${alpha * 0.5})`; 
                                ctx.lineWidth = 1;
                            } else {
                                ctx.strokeStyle = `rgba(30, 41, 59, ${alpha * 0.3})`; 
                                ctx.lineWidth = 0.5;
                            }
                            ctx.stroke();
                        }
                    }
                }

                // Render Nodes
                if (renderMode === 'NODES') {
                    ctx.beginPath();
                    // Size: Influencer > Normal > Bot (Bot is fast but small)
                    const radius = node.type === 'INFLUENCER' ? 8 : node.type === 'BOT' ? 3 : (node.infected ? 4 : 2);
                    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
                    
                    if (node.type === 'INFLUENCER') {
                        // Purple for Influencer
                        ctx.fillStyle = node.infected ? '#d8b4fe' : '#8b5cf6';
                        ctx.shadowColor = '#8b5cf6';
                        ctx.shadowBlur = 15;
                    } else if (node.type === 'BOT') {
                        // Bright Red for Bots
                        ctx.fillStyle = '#ff0000';
                        ctx.shadowColor = '#ff0000';
                        ctx.shadowBlur = 5;
                    } else if (node.infected) {
                        ctx.fillStyle = '#ef4444';
                        ctx.shadowBlur = 10;
                        ctx.shadowColor = '#ef4444';
                    } else {
                        ctx.fillStyle = '#334155';
                        ctx.shadowBlur = 0;
                    }
                    
                    ctx.fill();
                    ctx.shadowBlur = 0;
                } else if (renderMode === 'HEATMAP') {
                    if (node.infected) {
                        const r = node.type === 'INFLUENCER' ? 120 : 60;
                        const grd = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r);
                        grd.addColorStop(0, "rgba(239, 68, 68, 0.4)");
                        grd.addColorStop(1, "transparent");
                        ctx.fillStyle = grd;
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
            
            setStats({ infected: currentInfected, total: nodes.length });
            reqRef.current = requestAnimationFrame(render);
        };

        reqRef.current = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', resize);
            if (reqRef.current !== null) cancelAnimationFrame(reqRef.current);
        };
    }, [spreadRadius, infectionProb, speed, renderMode, params.echoChamberDensity, interventionActive]);

    return (
        <Card className="h-[500px] lg:h-full relative overflow-hidden bg-slate-950 border-slate-800 p-0 shadow-inner group">
             <div ref={containerRef} className="absolute inset-0">
                 <canvas ref={canvasRef} className="block w-full h-full" />
             </div>
             
             {/* HUD Overlay */}
             <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pointer-events-none">
                 <div className="bg-slate-950/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_red]"></div>
                    <div className="font-mono text-[10px] text-slate-400 uppercase">
                        VECTOR_SIM_V4
                        <span className="block text-white font-bold">{renderMode === 'HEATMAP' ? 'DENSITY_MAP_ENABLED' : 'LIVE_NODE_PROPAGATION'}</span>
                    </div>
                 </div>
                 
                 <div className="bg-slate-950/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] font-mono text-right text-slate-500">
                    <div className="text-white font-bold">{((stats.infected / stats.total) * 100).toFixed(1)}% {t.viralPage.sim.infected.toUpperCase()}</div>
                    <div>{t.viralPage.sim.velocity.toUpperCase()}: {(infectionProb * 1000).toFixed(1)} m/s</div>
                 </div>
             </div>

             {/* Controls Overlay */}
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-auto">
                 <button onClick={() => setRenderMode('NODES')} className={`p-2 rounded-lg border text-xs font-bold transition-all ${renderMode === 'NODES' ? 'bg-accent-cyan text-slate-900 border-accent-cyan' : 'bg-slate-900 text-slate-400 border-slate-700'}`}>
                     <Network size={16} />
                 </button>
                 <button onClick={() => setRenderMode('HEATMAP')} className={`p-2 rounded-lg border text-xs font-bold transition-all ${renderMode === 'HEATMAP' ? 'bg-red-500 text-white border-red-500' : 'bg-slate-900 text-slate-400 border-slate-700'}`}>
                     <Flame size={16} />
                 </button>
                 <div className="w-px h-8 bg-slate-700 mx-2"></div>
                 <button onClick={() => triggerIntervention('FACT_CHECK')} className="px-3 py-2 rounded-lg bg-green-900/50 border border-green-700 text-green-400 text-xs font-bold hover:bg-green-800 transition-all flex items-center gap-1 active:scale-95">
                     <Shield size={14} /> {t.viralPage.sim.actions.factCheck.toUpperCase()}
                 </button>
                 <button onClick={() => triggerIntervention('BAN')} className="px-3 py-2 rounded-lg bg-red-900/50 border border-red-700 text-red-400 text-xs font-bold hover:bg-red-800 transition-all flex items-center gap-1 active:scale-95">
                     <Users size={14} /> {t.viralPage.sim.actions.ban.toUpperCase()}
                 </button>
             </div>
             
             {/* Legend */}
             <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur border border-slate-800 p-2 rounded-lg text-[9px] font-mono text-slate-400 pointer-events-none hidden md:block">
                <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-slate-700"></div> NORMAL</div>
                <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-full bg-accent-purple shadow-[0_0_5px_purple]"></div> INFLUENCER</div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> BOT</div>
             </div>
             
             {interventionActive && (
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-white/5 animate-pulse">
                     <div className="bg-black/80 text-white font-black text-2xl px-6 py-4 rounded-xl border-2 border-white uppercase tracking-widest">
                         {interventionActive} DEPLOYED
                     </div>
                 </div>
             )}
        </Card>
    );
});

const ViralHeader: React.FC = () => {
    const { t, onBack } = useViralAnalysis();
    return (
        <PageHeader
            title={t.viralPage.title}
            subtitle="ANALYTICS ENGINE"
            icon={Network}
            actions={
                <Button variant="ghost" onClick={onBack} size="sm" className="text-slate-400 hover:text-white">
                    <ArrowLeft size={16} className="mr-2" /> {t.detail.back}
                </Button>
            }
        />
    );
};

const ViralSimulationSection: React.FC = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12 h-auto lg:h-[600px]">
            <div className="lg:col-span-4 h-full flex flex-col gap-6">
                <ViralitySimulator />
            </div>
            <div className="lg:col-span-8 h-full">
                <PropagationNetwork />
            </div>
        </div>
    );
};

const ViralChartsSection: React.FC = () => {
    const { timelineData, topViralTheories, t, onNavigateTo } = useViralAnalysis();
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <Card className="lg:col-span-2 p-0 bg-slate-900 border-slate-800 overflow-hidden">
                <div className="p-5 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <History className="text-accent-cyan" size={16} />
                        {t.viralPage.timelineTitle}
                    </h3>
                </div>
                
                <div className="w-full p-4 flex-1" style={{ width: '100%', height: '100%', minHeight: '200px' }}>
                <ResponsiveContainer width="100%" height="100%" debounce={200} minWidth={0}>
                    <AreaChart data={timelineData}>
                        <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="year" stroke="#64748b" fontSize={10} tickMargin={10} axisLine={false} tickLine={false} fontFamily="monospace" />
                        <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} fontFamily="monospace" />
                        <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace' }}
                            itemStyle={{ color: '#c4b5fd' }}
                        />
                        <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorCount)" />
                    </AreaChart>
                </ResponsiveContainer>
                </div>
            </Card>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-lg backdrop-blur-md">
                <div className="p-5 bg-slate-950/50 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <BarChart3 className="text-yellow-500" size={16} /> Top Viral Narratives
                </h3>
                </div>
                <div className="divide-y divide-slate-800/50 overflow-y-auto flex-1 custom-scrollbar">
                {topViralTheories.map((item, idx) => (
                    <div 
                        key={item.id} 
                        onClick={() => onNavigateTo(item.id)}
                        role="button"
                        tabIndex={0}
                        className="p-4 flex items-center gap-4 hover:bg-slate-800/50 cursor-pointer transition-colors group"
                    >
                        <div className="font-mono text-xs text-slate-500 w-4">{idx + 1}.</div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-slate-300 group-hover:text-white truncate mb-1">{item.title}</div>
                            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-accent-cyan" style={{ width: `${item.popularity}%` }}></div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-mono text-xs font-bold text-accent-purple">{item.popularity}%</div>
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
};

const TimelineItem: React.FC<{ year: string, title: string, desc: string, icon: React.ReactNode, active?: boolean, isLast?: boolean }> = React.memo(({ year, title, desc, icon, active, isLast }) => (
    <div className="relative flex gap-6 group pl-2">
       {!isLast && (
           <div className="absolute left-[23px] top-12 bottom-0 w-[2px] bg-slate-800 group-hover:bg-accent-purple/30 transition-colors"></div>
       )}
       
       <div className={`
           relative z-10 w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 transition-all duration-500
           ${active 
             ? 'bg-accent-purple/10 text-accent-purple border-accent-purple shadow-[0_0_20px_rgba(139,92,246,0.3)]' 
             : 'bg-slate-900 border-slate-800 text-slate-600 group-hover:border-slate-600 group-hover:text-slate-400'}
       `}>
          {icon}
       </div>
 
       <div className="pb-12 pt-1">
          <div className="flex items-center gap-3 mb-1">
             <span className={`text-xs font-mono font-bold ${active ? 'text-accent-purple' : 'text-slate-500'}`}>{year}</span>
             {active && <span className="px-1.5 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 text-[9px] font-bold uppercase tracking-wider animate-pulse">Active Era</span>}
          </div>
          <h4 className={`text-base font-bold mb-2 transition-colors ${active ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
             {title}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed max-w-lg font-medium">
             {desc}
          </p>
       </div>
    </div>
 ));

const ViralHistorySection: React.FC = () => {
    const { t } = useViralAnalysis();
    return (
        <div className="border-t border-slate-800 pt-10">
            <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                <Layers className="text-slate-500" size={20} />
                {t.viralPage.mediaTitle}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ml-2">
                <TimelineItem 
                    year="1440 - 1900" 
                    title={t.viralPage.timeline.static.title}
                    desc={t.viralPage.timeline.static.desc}
                    icon={<BookOpen size={20} />}
                />
                <TimelineItem 
                    year="1920 - 1990" 
                    title={t.viralPage.timeline.broadcast.title}
                    desc={t.viralPage.timeline.broadcast.desc}
                    icon={<Radio size={20} />}
                />
                <TimelineItem 
                    year="1995 - 2010" 
                    title={t.viralPage.timeline.forum.title}
                    desc={t.viralPage.timeline.forum.desc}
                    icon={<Globe size={20} />}
                />
                <TimelineItem 
                    year="2010 - Present" 
                    title={t.viralPage.timeline.algo.title}
                    desc={t.viralPage.timeline.algo.desc}
                    icon={<Smartphone size={20} />}
                    active
                    isLast
                />
            </div>
        </div>
    );
};

// --- 4. Main Component ---

export const ViralAnalysis: React.FC = () => {
  return (
      <ViralAnalysisProvider>
        <PageFrame>
            <ViralHeader />
            <ViralSimulationSection />
            <ViralChartsSection />
            <ViralHistorySection />
        </PageFrame>
      </ViralAnalysisProvider>
  );
};

export default ViralAnalysis;
