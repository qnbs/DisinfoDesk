
import React, {
  useMemo, useState, useEffect, useRef
} from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import {
  Globe, Activity, ShieldAlert, Radio, Terminal, Cpu, Lock, Wifi, MessageSquare, Skull, Database, Settings, HardDrive, LayoutGrid, Server, Brain, FileDown, User, Film
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, PageFrame, PageHeader } from './ui/Common';
import { exportElementPDF } from '../services/pdfExportService';
import { useAppSelector } from '../store/hooks';
import { selectAllTheories } from '../store/slices/theoriesSlice';
import { useNavigate } from 'react-router-dom';

// --- 1. SOPHISTICATED UTILS ---

const useLiveTelemetry = (initialData: number[]) => {
    const [data, setData] = useState(initialData);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setData(prev => {
                const next = [...prev.slice(1), Math.max(10, Math.min(100, prev[prev.length - 1] + (Math.random() - 0.5) * 20))];
                return next;
            });
        }, 800);
        return () => clearInterval(interval);
    }, []);
    
    return data;
};

// Decryption Text Effect
const CipherText: React.FC<{ text: string, className?: string, reveal?: boolean }> = React.memo(({ text, className, reveal = true }) => {
    const [display, setDisplay] = useState(text.replace(/./g, '0')); 
    const chars = '0123456789ABCDEF!@#$%^&*';
    
    useEffect(() => {
        if(!reveal) return;
        let iter = 0;
        const interval = setInterval(() => {
            setDisplay(
                text.split('').map((char, index) => {
                    if (index < iter) return char;
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('')
            );
            if (iter >= text.length) clearInterval(interval);
            iter += 1/2; 
        }, 30);
        return () => clearInterval(interval);
    }, [text, reveal]);

    return <span className={className}>{display}</span>;
});

// --- 2. HIGH-FIDELITY VISUALIZERS ---

// WebGL-Style Canvas Globe (Performance Optimized)
const HoloGlobe: React.FC<{ active: boolean, markers: {id: string, color: string}[] }> = ({ active, markers }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const parentRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);

    // Pause animation when off-screen
    useEffect(() => {
        const el = parentRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const parent = parentRef.current;
        if (!canvas || !parent || !isVisible) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0, height = 0, cx = 0, cy = 0;
        let rotation = 0;
        let animationFrameId: number;

        // Generate Pseudo-3D Points
        const spherePoints: {x: number, y: number, z: number}[] = [];
        for (let i = 0; i < 400; i++) {
            const phi = Math.acos(-1 + (2 * i) / 400);
            const theta = Math.sqrt(400 * Math.PI) * phi;
            spherePoints.push({
                x: Math.cos(theta) * Math.sin(phi),
                y: Math.sin(theta) * Math.sin(phi),
                z: Math.cos(phi)
            });
        }

        const resize = () => {
            const rect = parent.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr);
            cx = width / 2;
            cy = height / 2;
        };

        const render = () => {
            if (!active) return;
            ctx.clearRect(0, 0, width, height);
            
            const radius = Math.min(width, height) * 0.4;
            rotation += 0.003;

            // Draw Connection Arcs (Threat Vectors)
            if (Math.random() > 0.8) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(6, 182, 212, ${Math.random() * 0.2})`;
                ctx.lineWidth = 1;
                ctx.moveTo(cx, cy);
                const rVec = Math.random() * Math.PI * 2;
                ctx.lineTo(cx + Math.cos(rVec) * radius * 1.2, cy + Math.sin(rVec) * radius * 1.2);
                ctx.stroke();
            }

            // Draw Sphere
            spherePoints.forEach(p => {
                // Rotate Y
                const x1 = p.x * Math.cos(rotation) - p.z * Math.sin(rotation);
                const z1 = p.z * Math.cos(rotation) + p.x * Math.sin(rotation);
                
                // 3D Projection
                const scale = 300 / (300 - z1 * radius); // Perspective
                const x2D = x1 * radius + cx;
                const y2D = p.y * radius + cy;
                const alpha = (z1 + 1) / 2; // Fade back points

                if (alpha > 0) {
                    ctx.beginPath();
                    ctx.fillStyle = `rgba(100, 116, 139, ${alpha * 0.5})`;
                    ctx.arc(x2D, y2D, 1.5 * scale, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            // Draw "Markers" (Fake hot zones)
            markers.slice(0, 5).forEach((m, i) => {
                const offset = (i * Math.PI / 2);
                const mx = Math.cos(rotation * 1.5 + offset) * radius;
                const mz = Math.sin(rotation * 1.5 + offset) * radius;
                
                if (mz < 0) { // Only draw if on front
                    const mx2D = mx + cx;
                    const my2D = cy + Math.sin(rotation + offset) * (radius * 0.5);
                    
                    ctx.beginPath();
                    ctx.fillStyle = m.color === 'red' ? '#ef4444' : '#06b6d4';
                    ctx.shadowColor = m.color === 'red' ? '#ef4444' : '#06b6d4';
                    ctx.shadowBlur = 10;
                    ctx.arc(mx2D, my2D, 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    // Ping ring
                    ctx.beginPath();
                    ctx.strokeStyle = m.color === 'red' ? '#ef4444' : '#06b6d4';
                    ctx.globalAlpha = (Math.sin(Date.now() / 200) + 1) / 4;
                    ctx.arc(mx2D, my2D, 12, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            });

            // HUD Elements
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(cx, cy, radius + 20, 0, Math.PI * 2);
            ctx.setLineDash([2, 10]);
            ctx.stroke();
            ctx.setLineDash([]);

            animationFrameId = requestAnimationFrame(render);
        };

        window.addEventListener('resize', resize);
        resize();
        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [active, markers, isVisible]);

    return <div ref={parentRef} className="w-full h-full absolute inset-0"><canvas ref={canvasRef} className="block" role="img" aria-label="Interactive holographic globe showing disinformation threat vectors worldwide" /></div>;
};

// SVG Threat Gauge
const ThreatGauge: React.FC<{ value: number }> = ({ value }) => {
    // Value 1-5. 
    // 5 = Low Threat (Full bar green), 1 = Critical (Low bar red? Or inverse?)
    // Let's do: 1 = Critical (Red, Full), 5 = Safe (Green, Low)
    // Actually, usually Defcon 1 is Highest Threat.
    // Let's visualize intensity: 1 (Max) -> 5 (Low)
    
    // Map 5->1 to 20%->100% fill
    const percentage = (6 - value) * 20; 
    const color = value === 1 ? '#ef4444' : value <= 3 ? '#f59e0b' : '#10b981';
    
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="transform -rotate-90 w-full h-full">
                <circle cx="48" cy="48" r={radius} stroke="#1e293b" strokeWidth="8" fill="transparent" />
                <circle 
                    cx="48" cy="48" r={radius} 
                    stroke={color} 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={circumference} 
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-[10px] font-mono text-slate-500">LEVEL</span>
                <span className={`text-2xl font-black font-display ${value === 1 ? 'animate-pulse text-red-500' : 'text-white'}`}>{value}</span>
            </div>
        </div>
    );
};

// --- 3. WIDGETS ---

const MetricTile: React.FC<{ 
    title: string, 
    value: string | number, 
    trend?: 'up' | 'down' | 'stable',
    icon: React.ElementType, 
    color: string, 
    sparkData: number[],
    delay?: number 
}> = ({ title, value, trend, icon: Icon, color, sparkData, delay = 0 }) => {
    const chartData = useMemo(() => sparkData.map((val, i) => ({ i, val })), [sparkData]);
    
    return (
        <Card variant="solid" className="p-4 flex flex-col h-32 relative overflow-hidden group border-slate-800 bg-slate-900/40 hover:bg-slate-900 transition-all hover-lift animate-fade-in-up opacity-0" style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}>
            {/* Header */}
            <div className="flex justify-between items-start z-10">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded bg-slate-950 border border-slate-800 ${color}`}>
                        <Icon size={14} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{title}</span>
                </div>
                {trend && (
                    <div className={`text-[9px] font-mono px-1.5 rounded ${trend === 'up' ? 'text-red-400 bg-red-950/30' : 'text-green-400 bg-green-950/30'}`}>
                        {trend === 'up' ? '▲' : '▼'} {Math.floor(Math.random() * 10)}%
                    </div>
                )}
            </div>

            {/* Value */}
            <div className="mt-2 z-10">
                <div className="text-2xl font-black text-white font-display tracking-tight"><CipherText text={String(value)} /></div>
            </div>

            {/* Sparkline */}
            <div className="absolute bottom-0 left-0 right-0 h-12 opacity-30 group-hover:opacity-50 transition-opacity">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color === 'text-red-500' ? '#ef4444' : color === 'text-accent-cyan' ? '#06b6d4' : '#8b5cf6'} stopOpacity={0.5}/>
                                <stop offset="100%" stopColor={color === 'text-red-500' ? '#ef4444' : color === 'text-accent-cyan' ? '#06b6d4' : '#8b5cf6'} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area 
                            type="monotone" 
                            dataKey="val" 
                            stroke={color === 'text-red-500' ? '#ef4444' : color === 'text-accent-cyan' ? '#06b6d4' : '#8b5cf6'} 
                            strokeWidth={2} 
                            fill={`url(#grad-${title})`} 
                            isAnimationActive={false} 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

const CommandDeck: React.FC = () => {
    const navigate = useNavigate();

    const commands = [
        { id: 'scan', label: 'Threat Scan', sub: 'Protocol Omega', icon: ShieldAlert, path: '/dangerous', color: 'border-red-500/30 text-red-400 hover:bg-red-950/20' },
        { id: 'sim', label: 'Simulation', sub: 'Viral Vector', icon: Globe, path: '/virality', color: 'border-orange-500/30 text-orange-400 hover:bg-orange-950/20' },
        { id: 'uplink', label: 'AI Uplink', sub: 'Dr. Veritas', icon: MessageSquare, path: '/chat', color: 'border-purple-500/30 text-accent-purple hover:bg-purple-950/20' },
        { id: 'arch', label: 'Archives', sub: 'Main Database', icon: Database, path: '/archive', color: 'border-blue-500/30 text-blue-400 hover:bg-blue-950/20' },
        { id: 'authors', label: 'Authors', sub: 'Intel Profiles', icon: User, path: '/authors', color: 'border-cyan-500/30 text-accent-cyan hover:bg-cyan-950/20' },
        { id: 'media', label: 'Media Vault', sub: 'Pop Culture', icon: Film, path: '/media', color: 'border-green-500/30 text-green-400 hover:bg-green-950/20' },
        { id: 'fab', label: 'Fabricator', sub: 'Satire Engine', icon: Skull, path: '/satire', color: 'border-pink-500/30 text-pink-400 hover:bg-pink-950/20' },
        { id: 'sys', label: 'System', sub: 'Configuration', icon: Settings, path: '/settings', color: 'border-slate-500/30 text-slate-400 hover:bg-slate-800' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {commands.map(cmd => (
                <button
                    key={cmd.id}
                    onClick={() => navigate(cmd.path)}
                    className={`
                        relative flex flex-col items-center justify-center p-4 rounded-xl border bg-slate-900/40 backdrop-blur-sm transition-all duration-300 group
                        ${cmd.color} hover:border-opacity-100 hover:scale-[1.02] active:scale-[0.98]
                    `}
                >
                    <div className="mb-2 p-2 rounded-full bg-slate-950 shadow-inner group-hover:scale-110 transition-transform">
                        <cmd.icon size={18} />
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider">{cmd.label}</div>
                    <div className="text-[9px] opacity-60 font-mono mt-0.5">{cmd.sub}</div>
                    
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-current opacity-30 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current opacity-30 group-hover:opacity-100 transition-opacity"></div>
                </button>
            ))}
        </div>
    );
};

// --- 4. MAIN DASHBOARD ---

export const Dashboard: React.FC = () => {
    useLanguage();
    const theories = useAppSelector(selectAllTheories);
    
    // Derived Stats
    const totalFiles = theories.length;
    const criticalThreats = useMemo(() => theories.filter(t => t.dangerLevel.includes('High') || t.dangerLevel.includes('Extreme')).length, [theories]);
    const avgVirality = useMemo(() => Math.round(theories.reduce((acc, t) => acc + t.popularity, 0) / (totalFiles || 1)), [theories, totalFiles]);
    const sysLoad = useLiveTelemetry(Array(20).fill(20));
    
    // Map Markers
    const markers = useMemo(() => theories.map(t => ({
        id: t.id,
        color: t.dangerLevel.includes('High') ? 'red' : 'cyan'
    })), [theories]);

    return (
        <PageFrame>
            <PageHeader 
                title="SITUATION REPORT"
                subtitle="GLOBAL DISINFORMATION MONITORING GRID"
                icon={LayoutGrid}
                status="ONLINE"
                visualizerState="BUSY"
                actions={
                    <button 
                        onClick={() => { const el = document.getElementById('main-content'); if (el) exportElementPDF(el, 'Dashboard-Situation-Report'); }}
                        className="text-slate-400 hover:text-accent-cyan transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-slate-900 rounded-lg"
                        aria-label="Export Dashboard as PDF"
                    >
                        <FileDown size={18} />
                    </button>
                }
            >
                <div className="flex flex-wrap gap-4 text-[10px] font-mono text-slate-500 mt-2">
                    <span className="flex items-center gap-1"><Wifi size={10} className="text-green-500"/> UPLINK: STABLE</span>
                    <span className="flex items-center gap-1"><Lock size={10} className="text-accent-cyan"/> ENCRYPTION: AES-256</span>
                    <span className="flex items-center gap-1"><Server size={10} className="text-accent-purple"/> NODE: GEMINI-PRO</span>
                </div>
            </PageHeader>

            {/* --- BENTO GRID LAYOUT --- */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8 auto-rows-[minmax(140px,auto)]">
                
                {/* 1. Global Map (Large Hero) */}
                <Card className="col-span-1 md:col-span-2 lg:col-span-4 row-span-2 relative bg-slate-950 border-slate-800 p-0 overflow-hidden shadow-elevation-2 group animate-fade-in-up opacity-0" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                        <div className="px-2 py-1 bg-slate-900/80 backdrop-blur rounded border border-slate-700 text-xs font-mono text-accent-cyan flex items-center gap-2">
                            <Globe size={12} className="animate-spin-slow" /> LIVE TRACKING
                        </div>
                    </div>
                    <HoloGlobe active={true} markers={markers} />
                    {/* Overlay Grid */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
                    <div className="absolute bottom-4 left-4 z-10 text-[10px] font-mono text-slate-500">
                        <div>ACTIVE_NODES: {totalFiles}</div>
                        <div>LATENCY: 24ms</div>
                    </div>
                </Card>

                {/* 2. Defcon Status */}
                <Card className="col-span-1 md:col-span-2 lg:col-span-2 bg-slate-900/50 border-slate-800 flex items-center justify-between p-6 animate-fade-in-up opacity-0" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Global Status</div>
                        <div className="text-xl font-black text-white font-display tracking-tight">DEFCON 4</div>
                        <div className="text-[10px] text-green-400 mt-1 font-mono uppercase">Readiness: Normal</div>
                    </div>
                    <ThreatGauge value={4} />
                </Card>

                {/* 3. System Load (Live Chart) */}
                <Card className="col-span-1 md:col-span-2 lg:col-span-2 bg-slate-900/50 border-slate-800 p-4 flex flex-col animate-fade-in-up opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                    <div className="flex justify-between items-center mb-2">
                        <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                            <Cpu size={12} /> Sys Load
                        </div>
                        <div className="text-xs font-mono text-accent-purple">{sysLoad[sysLoad.length-1]}%</div>
                    </div>
                    <div className="flex-1 w-full min-h-[80px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={sysLoad.map((v, i) => ({ i, v }))}>
                                <defs>
                                    <linearGradient id="gradLoad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.5}/>
                                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="v" stroke="#8b5cf6" strokeWidth={2} fill="url(#gradLoad)" isAnimationActive={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 4. Metrics Row */}
                <div className="col-span-1 md:col-span-4 lg:col-span-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MetricTile 
                        title="Archived" 
                        value={totalFiles} 
                        icon={HardDrive} 
                        color="text-slate-400" 
                        sparkData={sysLoad.map(n => n * 0.5)}
                        delay={0}
                    />
                    <MetricTile 
                        title="Threats" 
                        value={criticalThreats} 
                        trend="up"
                        icon={ShieldAlert} 
                        color="text-red-500" 
                        sparkData={sysLoad.map(n => n * 1.2)}
                        delay={80}
                    />
                    <MetricTile 
                        title="Viral Vel." 
                        value={`${avgVirality}%`} 
                        icon={Radio} 
                        color="text-accent-cyan" 
                        sparkData={sysLoad.map(n => n * 0.8)}
                        delay={160}
                    />
                    <MetricTile 
                        title="Intel AI" 
                        value="ACTIVE" 
                        icon={Brain} 
                        color="text-accent-purple" 
                        sparkData={sysLoad}
                        delay={240}
                    />
                </div>

                {/* 5. Command Deck */}
                <div className="col-span-1 md:col-span-4 lg:col-span-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Terminal size={16} className="text-accent-cyan" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Command Interface</h3>
                        <div className="h-px bg-slate-800 flex-1 ml-4"></div>
                    </div>
                    <CommandDeck />
                </div>

            </div>
            
            {/* Live Feed Footer */}
            <Card className="mt-6 p-3 bg-black border-slate-800 flex items-center gap-4 font-mono text-xs overflow-hidden">
                <div className="text-green-500 font-bold whitespace-nowrap flex items-center gap-2">
                    <Activity size={12} className="animate-pulse" /> LIVE FEED
                </div>
                <div className="flex-1 overflow-hidden relative h-4">
                    <div className="absolute whitespace-nowrap animate-marquee text-slate-500">
                        Analyzing node 0x89A... Sector 7 clear... New narrative detected in vector [Q]... Intercepting packet stream... Decrypting [AES-256]... Uplink secure...
                    </div>
                </div>
            </Card>

        </PageFrame>
    );
};

export default Dashboard;
