import React, {
  useEffect, useRef, useCallback, useState
} from 'react';
import { SimulationParams } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Network, RefreshCw, Undo, Redo, Flame, Zap, Shield, Users, Layers, Play, Pause, Activity, Lock, AlertTriangle, Microscope, BarChart3
} from 'lucide-react';
const LazyTelemetryChart = React.lazy(() => import('./LazyTelemetryChart'));
import {
  Card, Button, PageFrame, PageHeader
} from './ui/Common';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setParams, resetParams } from '../store/slices/simulationSlice';
import { ActionCreators } from 'redux-undo';
import { useNavigate } from 'react-router-dom';

// --- TYPES & PHYSICS CONSTANTS ---

type AgentType = 'NORMAL' | 'INFLUENCER' | 'BOT' | 'SKEPTIC';
type AgentState = 'SUSCEPTIBLE' | 'INCUBATING' | 'INFECTED' | 'RECOVERED';

interface Agent {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    type: AgentType;
    state: AgentState;
    infectionTimer: number; // Time until recovered
    incubationTimer: number; // Time until infectious
    resistance: number;
    affinity: number; // 0-1, used for clustering
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
    size: number;
}

// --- 1. LOGIC HOOK ---

const useViralAnalysisLogic = () => {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const params = useAppSelector(state => state.simulation.present.params);
  const rValue = useAppSelector(state => state.simulation.present.rValue);
  
  const [renderMode, setRenderMode] = useState<'NETWORK' | 'HEATMAP'>('NETWORK');
  const [activeTool, setActiveTool] = useState<'OBSERVE' | 'CURE' | 'INFECT'>('OBSERVE');
  const [isPaused, setIsPaused] = useState(false);
  
  const past = useAppSelector(state => state.simulation.past);
  const future = useAppSelector(state => state.simulation.future);
  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  // Real-time telemetry data buffer
  const [telemetry, setTelemetry] = useState<{time: number, infected: number, recovered: number}[]>([]);

  const handleParamChange = useCallback((key: keyof SimulationParams, val: number) => {
      dispatch(setParams({ ...params, [key]: val }));
  }, [dispatch, params]);

  const applyScenario = (type: 'ECHO' | 'BOTS' | 'ORGANIC' | 'LOCKDOWN') => {
      switch(type) {
          case 'ECHO':
              dispatch(setParams({ ...params, emotionalPayload: 80, novelty: 20, visualProof: 30, echoChamberDensity: 95 }));
              break;
          case 'BOTS':
              dispatch(setParams({ ...params, emotionalPayload: 90, novelty: 90, visualProof: 10, echoChamberDensity: 10 }));
              break;
          case 'ORGANIC':
              dispatch(setParams({ ...params, emotionalPayload: 40, novelty: 60, visualProof: 60, echoChamberDensity: 30 }));
              break;
          case 'LOCKDOWN':
              dispatch(setParams({ ...params, emotionalPayload: 10, novelty: 10, visualProof: 90, echoChamberDensity: 5 }));
              break;
      }
  };

  const handleReset = useCallback(() => {
      dispatch(resetParams());
      setTelemetry([]);
  }, [dispatch]);

  const handleUndo = useCallback(() => dispatch(ActionCreators.undo()), [dispatch]);
  const handleRedo = useCallback(() => dispatch(ActionCreators.redo()), [dispatch]);
  
  const onBack = () => navigate('/');

  return {
    t, params, rValue, past, future, canUndo, canRedo,
    renderMode, setRenderMode,
    activeTool, setActiveTool,
    isPaused, setIsPaused,
    telemetry, setTelemetry,
    handleParamChange, handleReset, handleUndo, handleRedo,
    applyScenario, onBack
  };
};

// --- 2. ADVANCED SIMULATION VISUALIZER ---

const AdvancedPropagationNetwork: React.FC<{ 
    params: SimulationParams, 
    mode: 'NETWORK' | 'HEATMAP',
    tool: 'OBSERVE' | 'CURE' | 'INFECT',
    paused: boolean,
    onStatsUpdate: (inf: number, rec: number) => void
}> = React.memo(({ params, mode, tool, paused, onStatsUpdate }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const workerRef = useRef<Worker | null>(null);
    const useOffscreen = useRef(typeof OffscreenCanvas !== 'undefined');
    
    // Mutable Simulation State (Ref-based for performance — main-thread fallback only)
    const agentsRef = useRef<Agent[]>([]);
    const particlesRef = useRef<Particle[]>([]);
    const frameRef = useRef<number>(0);
    const lastUpdateRef = useRef<number>(0);

    // Visibility Check
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting);
        }, { threshold: 0.1 });
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // Initialize Agents
    const initAgents = (w: number, h: number) => {
        const count = 150;
        const newAgents: Agent[] = [];
        for(let i=0; i<count; i++) {
            const rand = Math.random();
            let type: AgentType = 'NORMAL';
            if (rand > 0.96) type = 'INFLUENCER'; // Super-spreaders
            else if (rand > 0.90) type = 'BOT'; // Aggressive vectors
            else if (rand > 0.80) type = 'SKEPTIC'; // Resistant

            newAgents.push({
                id: i,
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * (type === 'BOT' ? 2 : 0.5),
                vy: (Math.random() - 0.5) * (type === 'BOT' ? 2 : 0.5),
                type,
                state: i < 3 ? 'INFECTED' : 'SUSCEPTIBLE', // Patient Zero
                infectionTimer: type === 'INFLUENCER' ? 800 : 400,
                incubationTimer: 50,
                resistance: type === 'SKEPTIC' ? 0.9 : Math.random() * 0.5,
                affinity: Math.random() // For echo chamber clustering
            });
        }
        return newAgents;
    };

    // Spawn Particles
    const spawnShockwave = (x: number, y: number, color: string) => {
        for(let i=0; i<12; i++) {
            const angle = (Math.PI * 2 * i) / 12;
            particlesRef.current.push({
                x, y,
                vx: Math.cos(angle) * 3,
                vy: Math.sin(angle) * 3,
                life: 1.0,
                color,
                size: 2
            });
        }
    };

    // Interaction Handler
    const handleInteraction = (e: React.MouseEvent) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvasRef.current.width / rect.width);
        const y = (e.clientY - rect.top) * (canvasRef.current.height / rect.height);

        // Forward to worker if active
        if (workerRef.current) {
            workerRef.current.postMessage({ type: 'INTERACT', payload: { x, y, tool } });
            return;
        }

        const range = 100; // Interaction radius

        if (tool === 'CURE') {
            spawnShockwave(x, y, '#4ade80');
            agentsRef.current.forEach(a => {
                const dx = a.x - x;
                const dy = a.y - y;
                if (dx*dx + dy*dy < range*range) {
                    if (a.state === 'INFECTED' || a.state === 'INCUBATING') {
                        a.state = 'RECOVERED';
                        a.vx += dx * 0.05; // Push away effect
                        a.vy += dy * 0.05;
                    }
                }
            });
        } else if (tool === 'INFECT') {
            spawnShockwave(x, y, '#ef4444');
            agentsRef.current.forEach(a => {
                const dx = a.x - x;
                const dy = a.y - y;
                if (dx*dx + dy*dy < range*range) {
                    if (a.state === 'SUSCEPTIBLE') {
                        a.state = 'INFECTED';
                        a.infectionTimer = 500;
                    }
                }
            });
        }
    };

    // Forward params/pause to worker
    useEffect(() => {
        workerRef.current?.postMessage({ type: 'UPDATE_PARAMS', payload: params });
    }, [params]);

    useEffect(() => {
        workerRef.current?.postMessage({ type: 'PAUSE', payload: paused });
    }, [paused]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || !isVisible) {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
            return;
        }

        // ── OffscreenCanvas Worker Path ──
        if (useOffscreen.current && !workerRef.current) {
            try {
                const offscreen = canvas.transferControlToOffscreen();
                const worker = new Worker(
                    new URL('../workers/virality.worker.ts', import.meta.url),
                    { type: 'module' }
                );
                workerRef.current = worker;

                const parent = canvas.parentElement;
                const w = Math.max(parent?.clientWidth ?? 300, 100);
                const h = Math.max(parent?.clientHeight ?? 300, 100);

                worker.postMessage({
                    type: 'INIT',
                    payload: {
                        canvas: offscreen,
                        width: w * devicePixelRatio,
                        height: h * devicePixelRatio,
                        isMobileMode: window.innerWidth < 768
                    }
                }, [offscreen]);

                worker.postMessage({ type: 'UPDATE_PARAMS', payload: params });
                worker.postMessage({ type: 'PAUSE', payload: paused });

                worker.onmessage = (e) => {
                    if (e.data.type === 'STATS') {
                        onStatsUpdate(e.data.infected, e.data.recovered);
                    }
                };

                const handleResize = () => {
                    const pw = Math.max(container.clientWidth, 100);
                    const ph = Math.max(container.clientHeight, 100);
                    worker.postMessage({
                        type: 'RESIZE',
                        payload: { width: pw * devicePixelRatio, height: ph * devicePixelRatio }
                    });
                };
                window.addEventListener('resize', handleResize);

                return () => {
                    window.removeEventListener('resize', handleResize);
                    worker.terminate();
                    workerRef.current = null;
                };
            } catch {
                // transferControlToOffscreen may fail if canvas was already transferred
                useOffscreen.current = false;
            }
        }

        // ── Main-Thread Fallback ──
        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                // Ensure dimensions are valid (>0) to avoid processing errors
                const w = Math.max(parent.clientWidth, 100);
                const h = Math.max(parent.clientHeight, 100);
                
                canvas.width = w * window.devicePixelRatio;
                canvas.height = h * window.devicePixelRatio;
                canvas.style.width = `${w}px`;
                canvas.style.height = `${h}px`;
                
                if (agentsRef.current.length === 0) agentsRef.current = initAgents(canvas.width, canvas.height);
            }
        };
        resize();
        window.addEventListener('resize', resize);

        const ctx = canvas.getContext('2d', { alpha: false });
        
        const render = (time: number) => {
            if (!ctx) return;
            if (paused) {
                frameRef.current = requestAnimationFrame(render);
                return;
            }

            // Stats Update Throttling (every 500ms)
            if (time - lastUpdateRef.current > 500) {
                const inf = agentsRef.current.filter(a => a.state === 'INFECTED').length;
                const rec = agentsRef.current.filter(a => a.state === 'RECOVERED').length;
                onStatsUpdate(inf, rec);
                lastUpdateRef.current = time;
            }

            const w = canvas.width;
            const h = canvas.height;
            const _separationDist = 30;
            const infectionRadius = 40 + (params.echoChamberDensity * 0.5);
            
            // Clear & Fade
            ctx.fillStyle = '#020617';
            ctx.fillRect(0, 0, w, h);

            // Draw Grid
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for(let x=0; x<w; x+=100) { ctx.moveTo(x,0); ctx.lineTo(x,h); }
            for(let y=0; y<h; y+=100) { ctx.moveTo(0,y); ctx.lineTo(w,y); }
            ctx.stroke();

            // --- PHYSICS & LOGIC LOOP ---
            for (let i = 0; i < agentsRef.current.length; i++) {
                const a = agentsRef.current[i];

                // 1. Movement & Flocking
                if (a.type !== 'INFLUENCER') {
                    // Echo Chamber Logic: Agents stick to their affinity zones
                    if (params.echoChamberDensity > 50) {
                        const targetX = a.affinity * w;
                        a.vx += (targetX - a.x) * 0.0005 * (params.echoChamberDensity / 100);
                    }
                    
                    a.x += a.vx;
                    a.y += a.vy;

                    // Bounce
                    if (a.x < 0 || a.x > w) a.vx *= -1;
                    if (a.y < 0 || a.y > h) a.vy *= -1;
                }

                // 2. Interaction Loop
                for (let j = i + 1; j < agentsRef.current.length; j++) {
                    const b = agentsRef.current[j];
                    const dx = b.x - a.x;
                    const dy = b.y - a.y;
                    const distSq = dx*dx + dy*dy;

                    // Infection spread
                    if (distSq < infectionRadius * infectionRadius) {
                        const dist = Math.sqrt(distSq);
                        
                        // Draw Connection
                        if (mode === 'NETWORK' && dist < 100) {
                            ctx.beginPath();
                            const alpha = 1 - (dist / 100);
                            
                            if (a.state === 'INFECTED' && b.state === 'INFECTED') ctx.strokeStyle = `rgba(239, 68, 68, ${alpha * 0.8})`; // Red
                            else if (a.state === 'INFECTED' || b.state === 'INFECTED') ctx.strokeStyle = `rgba(234, 179, 8, ${alpha * 0.5})`; // Yellow (Transmission)
                            else ctx.strokeStyle = `rgba(30, 41, 59, ${alpha * 0.3})`; // Slate
                            
                            ctx.lineWidth = 1;
                            ctx.moveTo(a.x, a.y);
                            ctx.lineTo(b.x, b.y);
                            ctx.stroke();
                        }

                        // Transmission Logic
                        if (a.state === 'INFECTED' && b.state === 'SUSCEPTIBLE') {
                            const prob = (0.01 + (params.emotionalPayload/5000)) * (1 - b.resistance);
                            if (Math.random() < prob) { b.state = 'INCUBATING'; }
                        } else if (b.state === 'INFECTED' && a.state === 'SUSCEPTIBLE') {
                            const prob = (0.01 + (params.emotionalPayload/5000)) * (1 - a.resistance);
                            if (Math.random() < prob) { a.state = 'INCUBATING'; }
                        }
                    }
                }

                // 3. State Update
                if (a.state === 'INCUBATING') {
                    a.incubationTimer--;
                    if (a.incubationTimer <= 0) a.state = 'INFECTED';
                }
                if (a.state === 'INFECTED') {
                    a.infectionTimer--;
                    if (a.infectionTimer <= 0) a.state = 'RECOVERED';
                }

                // 4. Rendering
                ctx.beginPath();
                const radius = a.type === 'INFLUENCER' ? 12 : a.type === 'BOT' ? 4 : 6;
                
                // Color Logic
                let color = '#94a3b8'; // Susceptible
                let glow = false;
                if (a.state === 'INFECTED') { color = '#ef4444'; glow = true; } // Red
                else if (a.state === 'INCUBATING') { color = '#f59e0b'; } // Yellow
                else if (a.state === 'RECOVERED') { color = '#10b981'; } // Green
                
                if (a.type === 'SKEPTIC') {
                    ctx.strokeStyle = '#3b82f6';
                    ctx.lineWidth = 2;
                    ctx.arc(a.x, a.y, radius + 2, 0, Math.PI*2);
                    ctx.stroke();
                }

                if (mode === 'HEATMAP' && a.state === 'INFECTED') {
                    const grad = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, 60);
                    grad.addColorStop(0, 'rgba(239, 68, 68, 0.4)');
                    grad.addColorStop(1, 'rgba(239, 68, 68, 0)');
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.arc(a.x, a.y, 60, 0, Math.PI*2);
                    ctx.fill();
                }

                if (glow) {
                    ctx.shadowColor = color;
                    ctx.shadowBlur = 10;
                } else {
                    ctx.shadowBlur = 0;
                }

                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(a.x, a.y, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            // --- PARTICLE RENDER ---
            for (let i = particlesRef.current.length - 1; i >= 0; i--) {
                const p = particlesRef.current[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.02;
                if (p.life <= 0) {
                    particlesRef.current.splice(i, 1);
                    continue;
                }
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.life;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            frameRef.current = requestAnimationFrame(render);
        };

        frameRef.current = requestAnimationFrame(render);
        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(frameRef.current);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params, mode, paused, isVisible]);

    return (
        <div ref={containerRef} className="absolute inset-0 z-0">
            <canvas 
                ref={canvasRef} 
                role="img"
                aria-label="Network propagation simulation showing how narratives spread through nodes"
                onClick={handleInteraction}
                className={`w-full h-full block ${tool !== 'OBSERVE' ? 'cursor-crosshair' : 'cursor-default'}`}
            />
        </div>
    );
});

// --- 3. CONTROL PANEL COMPONENT ---

const TacticalPanel: React.FC<{ 
    params: SimulationParams, 
    onChange: (key: keyof SimulationParams, val: number) => void 
}> = ({ params, onChange }) => {
    const { t } = useLanguage();
    return (
        <div className="grid grid-cols-2 gap-4 p-4 text-[10px] font-mono">
            {[
                { key: 'emotionalPayload', label: t.viralPage.sim.params.emotional, color: 'accent-red' },
                { key: 'novelty', label: t.viralPage.sim.params.novelty, color: 'accent-purple' },
                { key: 'visualProof', label: t.viralPage.sim.params.visual, color: 'accent-cyan' },
                { key: 'echoChamberDensity', label: t.viralPage.sim.params.echo, color: 'accent-yellow' },
            ].map((p) => (
                <div key={p.key} className="bg-slate-900 border border-slate-800 p-3 rounded-lg relative overflow-hidden group">
                    <div className="flex justify-between mb-2 z-10 relative">
                        <span className="text-slate-500 font-bold truncate max-w-[80%]">{p.label}</span>
                        <span className="text-white">{params[p.key as keyof SimulationParams]}%</span>
                    </div>
                    <input 
                        type="range" 
                        min="0" max="100" 
                        value={params[p.key as keyof SimulationParams]}
                        onChange={(e) => onChange(p.key as keyof SimulationParams, parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer z-10 relative [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                    />
                    {/* Background Bar */}
                    <div 
                        className={`absolute bottom-0 left-0 h-1 bg-${p.color === 'accent-red' ? 'red-500' : p.color === 'accent-purple' ? 'purple-500' : p.color === 'accent-cyan' ? 'cyan-500' : 'yellow-500'} opacity-50 transition-all duration-300`} 
                        style={{ width: `${params[p.key as keyof SimulationParams]}%` }}
                    ></div>
                </div>
            ))}
        </div>
    );
};

// --- 4. MAIN LAYOUT ---

export const ViralAnalysis: React.FC = () => {
    const { 
        t, params, rValue, telemetry, setTelemetry, 
        renderMode, setRenderMode, activeTool, setActiveTool, 
        isPaused, setIsPaused, handleParamChange, applyScenario, 
        handleReset, handleUndo, handleRedo, canUndo, canRedo 
    } = useViralAnalysisLogic();

    const updateStats = useCallback((infected: number, recovered: number) => {
        setTelemetry(prev => {
            const next = [...prev, { time: Date.now(), infected, recovered }];
            if (next.length > 50) next.shift();
            return next;
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Derived Status
    const status = rValue < 1 ? 'CONTAINED' : rValue < 3 ? 'SPREADING' : 'VIRAL';
    const statusColor = rValue < 1 ? 'text-green-500' : rValue < 3 ? 'text-yellow-500' : 'text-red-500';

    return (
        <PageFrame>
            <PageHeader
                title={t.viralPage.title}
                subtitle={t.viralPage.subtitle}
                icon={Network}
                status={status}
                statusColor={rValue < 1 ? 'bg-green-500' : rValue < 3 ? 'bg-yellow-500' : 'bg-red-500'}
                visualizerState="BUSY"
                actions={
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={handleUndo} disabled={!canUndo} icon={<Undo size={16}/>} />
                        <Button variant="ghost" onClick={handleRedo} disabled={!canRedo} icon={<Redo size={16}/>} />
                        <Button variant="secondary" onClick={handleReset} icon={<RefreshCw size={16}/>}>{t.common.reset}</Button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[calc(100vh-200px)] lg:min-h-[700px] overflow-y-auto lg:overflow-hidden pb-10 lg:pb-0">
                
                {/* RIGHT: Main Simulation Stage (Order First on Mobile) */}
                <div className="lg:col-span-9 order-first lg:order-last relative rounded-xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden group min-h-[400px]">
                    <AdvancedPropagationNetwork 
                        params={params} 
                        mode={renderMode}
                        tool={activeTool}
                        paused={isPaused}
                        onStatsUpdate={updateStats}
                    />

                    {/* HUD Overlay */}
                    <div className="absolute top-4 left-4 flex gap-4 pointer-events-none">
                        <div className="bg-slate-900/90 backdrop-blur px-3 py-2 rounded border border-slate-700 text-xs font-mono text-slate-400 shadow-lg">
                            <div className="flex items-center gap-2 mb-1"><span className="text-white font-bold">{t.viralPage.sim.hud.mode}:</span> {renderMode}</div>
                            <div className="flex items-center gap-2"><span className="text-white font-bold">{t.viralPage.sim.hud.tool}:</span> {activeTool}</div>
                        </div>
                    </div>

                    {/* Bottom Controls */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700 shadow-2xl z-10 w-max max-w-[90%] overflow-x-auto">
                        <button onClick={() => setIsPaused(!isPaused)} className={`p-3 rounded-lg border transition-all ${isPaused ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-slate-800 text-white border-slate-600'}`}>
                            {isPaused ? <Play size={18} fill="currentColor" /> : <Pause size={18} fill="currentColor" />}
                        </button>
                        
                        <div className="w-px h-10 bg-slate-700 mx-2"></div>

                        <button onClick={() => setRenderMode('NETWORK')} className={`p-3 rounded-lg border transition-all ${renderMode === 'NETWORK' ? 'bg-accent-cyan text-slate-900 border-accent-cyan' : 'bg-slate-800 text-slate-400 border-slate-600'}`} title="Network Graph" aria-label="Network Graph">
                            <Network size={18} />
                        </button>
                        <button onClick={() => setRenderMode('HEATMAP')} className={`p-3 rounded-lg border transition-all ${renderMode === 'HEATMAP' ? 'bg-red-500 text-white border-red-500' : 'bg-slate-800 text-slate-400 border-slate-600'}`} title="Heatmap" aria-label="Heatmap">
                            <Flame size={18} />
                        </button>

                        <div className="w-px h-10 bg-slate-700 mx-2"></div>

                        <button onClick={() => setActiveTool('OBSERVE')} className={`p-3 rounded-lg border transition-all ${activeTool === 'OBSERVE' ? 'bg-slate-700 text-white border-slate-500' : 'bg-slate-800 text-slate-400 border-slate-600'}`} title={t.viralPage.sim.actions.observe} aria-label={t.viralPage.sim.actions.observe}>
                            <Microscope size={18} />
                        </button>
                        <button onClick={() => setActiveTool('CURE')} className={`p-3 rounded-lg border transition-all ${activeTool === 'CURE' ? 'bg-green-500 text-slate-900 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-green-900/20 text-green-500 border-green-900'}`} title={t.viralPage.sim.actions.cure} aria-label={t.viralPage.sim.actions.cure}>
                            <Shield size={18} />
                        </button>
                        <button onClick={() => setActiveTool('INFECT')} className={`p-3 rounded-lg border transition-all ${activeTool === 'INFECT' ? 'bg-red-500 text-white border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-red-900/20 text-red-500 border-red-900'}`} title={t.viralPage.sim.actions.infect} aria-label={t.viralPage.sim.actions.infect}>
                            <AlertTriangle size={18} />
                        </button>
                    </div>
                </div>

                {/* LEFT: Controls & Telemetry (Order Last on Mobile) */}
                <div className="lg:col-span-3 order-last lg:order-first flex flex-col gap-4 h-full overflow-y-auto custom-scrollbar pr-1">
                    {/* R-Value Core */}
                    <Card className="p-6 bg-slate-950/80 border-slate-800 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Activity size={64} /></div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">{t.viralPage.sim.rValue}</div>
                        <div className={`text-5xl font-black font-display tracking-tighter ${statusColor} drop-shadow-glow`}>
                            {rValue.toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-400 mt-2 font-mono">
                            <span className="text-accent-cyan">{t.viralPage.sim.projected}:</span> {Math.pow(rValue, 5).toFixed(0)} NODES / 5 GEN
                        </div>
                        <div className="w-full h-1 bg-slate-900 mt-4 rounded-full overflow-hidden">
                            <div className={`h-full ${statusColor.replace('text-', 'bg-')}`} style={{ width: `${Math.min(100, (rValue/5)*100)}%` }}></div>
                        </div>
                    </Card>

                    {/* Scenarios */}
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="secondary" size="sm" onClick={() => applyScenario('ECHO')} className="text-[10px] justify-start bg-slate-900"><Layers size={12}/> {t.viralPage.sim.scenarios.echo}</Button>
                        <Button variant="secondary" size="sm" onClick={() => applyScenario('BOTS')} className="text-[10px] justify-start bg-slate-900"><Zap size={12}/> {t.viralPage.sim.scenarios.bot}</Button>
                        <Button variant="secondary" size="sm" onClick={() => applyScenario('ORGANIC')} className="text-[10px] justify-start bg-slate-900"><Users size={12}/> {t.viralPage.sim.scenarios.organic}</Button>
                        <Button variant="secondary" size="sm" onClick={() => applyScenario('LOCKDOWN')} className="text-[10px] justify-start bg-slate-900 text-blue-400 border-blue-900/50"><Lock size={12}/> {t.viralPage.sim.scenarios.lockdown}</Button>
                    </div>

                    {/* Sliders */}
                    <Card className="flex-1 border-slate-800 bg-slate-950/50 flex flex-col p-0">
                        <div className="p-3 border-b border-slate-800 bg-slate-900/50 text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {t.viralPage.sim.params.title}
                        </div>
                        <TacticalPanel params={params} onChange={handleParamChange} />
                    </Card>

                    {/* Live Telemetry Chart */}
                    <Card className="h-48 border-slate-800 bg-slate-950/80 p-0 flex flex-col">
                        <div className="p-3 border-b border-slate-800 flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2"><BarChart3 size={12}/> {t.viralPage.sim.charts.telemetry}</span>
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_red]"></span>
                        </div>
                        <div className="flex-1 w-full min-h-0">
                            <React.Suspense fallback={<div className="w-full h-full flex items-center justify-center"><div className="flex flex-col items-center gap-2 opacity-50"><div className="h-2 w-24 rounded shimmer-loading" /><div className="h-2 w-16 rounded shimmer-loading" style={{ animationDelay: '200ms' }} /></div></div>}>
    <LazyTelemetryChart telemetry={telemetry} />
</React.Suspense>
                        </div>
                    </Card>
                </div>
            </div>
        </PageFrame>
    );
};

export default ViralAnalysis;