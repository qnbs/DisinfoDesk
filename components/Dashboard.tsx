
import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  CartesianGrid, BarChart, Bar, Cell
} from 'recharts';
import { 
  Globe, Activity, ShieldAlert, Zap, Radio, 
  Terminal, Cpu, Map as MapIcon, ChevronRight, 
  AlertTriangle, Crosshair, ArrowUpRight, Signal, 
  Lock, Share2, Wifi, BookOpen, Film, Feather, MessageSquare, 
  Skull, Edit3, Database, Settings, HelpCircle, HardDrive, LayoutDashboard
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, PageFrame, PageHeader, Button, Badge, cn } from './ui/Common';
import { useAppSelector } from '../store/hooks';
import { selectAllTheories } from '../store/slices/theoriesSlice';
import { useNavigate } from 'react-router-dom';
import { DangerLevel } from '../types';

// --- 1. UTILITY COMPONENTS ---

// Scrambling Text Effect for "Decryption" visuals
const ScrambleText: React.FC<{ text: string, className?: string, delay?: number }> = React.memo(({ text, className, delay = 0 }) => {
    const [display, setDisplay] = useState(text.replace(/./g, '█')); // Start obscured
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        let interval: ReturnType<typeof setInterval>;

        timeout = setTimeout(() => {
            let iter = 0;
            interval = setInterval(() => {
                setDisplay(
                    text.split('').map((char, index) => {
                        if (index < iter) return char;
                        return chars[Math.floor(Math.random() * chars.length)];
                    }).join('')
                );
                if (iter >= text.length) clearInterval(interval);
                iter += 1/2; 
            }, 30);
        }, delay);

        return () => { clearTimeout(timeout); clearInterval(interval); };
    }, [text, delay]);

    return <span className={className}>{display}</span>;
});

// Mini Sparkline for Cards
const Sparkline: React.FC<{ data: number[], color: string }> = ({ data, color }) => {
    const chartData = data.map((val, i) => ({ i, val }));
    return (
        <div className="h-8 w-24">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.4}/>
                            <stop offset="100%" stopColor={color} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="val" stroke={color} strokeWidth={2} fill={`url(#grad-${color})`} isAnimationActive={false} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

// --- 2. COMPLEX WIDGETS ---

// Mission Control / Launchpad (New Component)
const MissionLaunchpad: React.FC = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    const sections = [
        {
            title: t.dashboard.launchpad.sections.intel,
            items: [
                { id: 'dang', icon: ShieldAlert, label: t.nav.dangerous, desc: t.dashboard.launchpad.desc.dangerous, path: '/dangerous', color: 'text-red-500' },
                { id: 'vir', icon: Activity, label: t.nav.virality, desc: t.dashboard.launchpad.desc.virality, path: '/virality', color: 'text-orange-400' },
                { id: 'chat', icon: MessageSquare, label: t.nav.chat, desc: t.dashboard.launchpad.desc.chat, path: '/chat', color: 'text-accent-purple' },
            ]
        },
        {
            title: t.dashboard.launchpad.sections.archives,
            items: [
                { id: 'arch', icon: BookOpen, label: t.nav.archive, desc: t.dashboard.launchpad.desc.archive, path: '/archive', color: 'text-blue-400' },
                { id: 'med', icon: Film, label: t.nav.media, desc: t.dashboard.launchpad.desc.media, path: '/media', color: 'text-cyan-400' },
                { id: 'auth', icon: Feather, label: t.nav.authors, desc: t.dashboard.launchpad.desc.authors, path: '/authors', color: 'text-yellow-400' },
            ]
        },
        {
            title: t.dashboard.launchpad.sections.system,
            items: [
                { id: 'edit', icon: Edit3, label: t.nav.editor, desc: t.dashboard.launchpad.desc.editor, path: '/editor', color: 'text-green-400' },
                { id: 'sat', icon: Skull, label: t.nav.generator, desc: t.dashboard.launchpad.desc.satire, path: '/satire', color: 'text-pink-400' },
                { id: 'vault', icon: HardDrive, label: t.nav.database, desc: t.dashboard.launchpad.desc.vault, path: '/database', color: 'text-slate-400' },
                { id: 'set', icon: Settings, label: t.nav.settings, desc: t.dashboard.launchpad.desc.settings, path: '/settings', color: 'text-slate-500' },
                { id: 'help', icon: HelpCircle, label: t.nav.help, desc: t.dashboard.launchpad.desc.help, path: '/help', color: 'text-slate-500' },
            ]
        }
    ];

    return (
        <div className="mb-8 space-y-6">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
                <LayoutDashboard className="text-accent-cyan" size={18} />
                <h2 className="text-sm font-bold text-white uppercase tracking-widest">{t.dashboard.launchpad.title}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section, idx) => (
                    <div key={idx} className="space-y-3">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">{section.title}</h3>
                        <div className="grid grid-cols-1 gap-2">
                            {section.items.map(item => (
                                <button 
                                    key={item.id}
                                    onClick={() => navigate(item.path)}
                                    className="group flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-800 hover:border-slate-600 rounded-lg text-left transition-all hover:bg-slate-900 active:scale-[0.99] relative overflow-hidden"
                                >
                                    <div className={`p-2 rounded-md bg-slate-950 border border-slate-800 group-hover:border-slate-700 transition-colors ${item.color}`}>
                                        <item.icon size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-bold text-slate-200 group-hover:text-white truncate">{item.label}</div>
                                        <div className="text-[10px] text-slate-500 font-mono truncate">{item.desc}</div>
                                    </div>
                                    <ChevronRight size={14} className="text-slate-700 group-hover:text-accent-cyan transition-colors" />
                                    
                                    {/* Hover Shine */}
                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// World Map Projection (SVG)
const GlobalIncidentMap: React.FC<{ data: any[], onSelect: (id: string) => void, label: string, liveLabel: string }> = ({ data, onSelect, label, liveLabel }) => {
    // Simulated coords for demo purposes since we don't have real LatLong in Theory model yet
    // In a real app, we'd map countries/cities to coords. Here we use deterministic random based on ID.
    const getCoords = (id: string) => {
        let hash = 0;
        for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
        const x = Math.abs(Math.sin(hash) * 800) + 50; // Map width approx
        const y = Math.abs(Math.cos(hash) * 400) + 50; // Map height approx
        return { x, y };
    };

    return (
        <div className="relative w-full h-full overflow-hidden bg-[#020617] rounded-xl border border-slate-800 group">
            {/* Map Background (Abstract Grid/Continents placeholder) */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-cover bg-center mix-blend-overlay grayscale invert"></div>
            <div className="absolute inset-0 bg-cyber-grid opacity-10"></div>
            
            {/* Radar Scan Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-cyan/10 to-transparent w-[50%] h-full animate-[marquee_4s_linear_infinite] pointer-events-none mix-blend-screen"></div>

            {/* Data Points */}
            <svg viewBox="0 0 1000 500" className="w-full h-full absolute inset-0 preserve-3d">
                {data.map((item) => {
                    const { x, y } = getCoords(item.id);
                    const isCritical = item.dangerLevel.includes('High') || item.dangerLevel.includes('Extreme');
                    return (
                        <g key={item.id} onClick={() => onSelect(item.id)} className="cursor-pointer hover:opacity-100 transition-opacity">
                            <circle cx={x} cy={y} r={isCritical ? 6 : 3} fill={isCritical ? '#ef4444' : '#06b6d4'} className="animate-pulse" opacity="0.6">
                                <animate attributeName="r" values={isCritical ? "6;10;6" : "3;6;3"} dur="3s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
                            </circle>
                            <circle cx={x} cy={y} r={2} fill="#fff" />
                        </g>
                    );
                })}
            </svg>

            {/* HUD Overlay */}
            <div className="absolute bottom-4 left-4 text-[9px] font-mono text-accent-cyan bg-slate-900/80 px-2 py-1 rounded border border-accent-cyan/30 backdrop-blur">
                <span className="animate-pulse">●</span> {liveLabel}: {data.length} {label}
            </div>
        </div>
    );
};

// Intelligence Feed (Scrolling Terminal)
const IntelFeed: React.FC = () => {
    const { t } = useLanguage();
    const [lines, setLines] = useState<string[]>([]);
    
    // Dynamic messages based on translation
    const msgs = [
        t.dashboard.feed.intercept,
        t.dashboard.feed.sentiment,
        t.dashboard.feed.ref,
        t.dashboard.feed.node,
        t.dashboard.feed.cluster,
        t.dashboard.feed.context,
        t.dashboard.feed.heuristic,
        t.dashboard.feed.botnet
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setLines(prev => {
                const next = [...prev, `[${new Date().toLocaleTimeString()}] ${msgs[Math.floor(Math.random() * msgs.length)]}...`];
                return next.slice(-8); // Keep last 8
            });
        }, 2500);
        return () => clearInterval(interval);
    }, [t]);

    return (
        <div className="h-full bg-black font-mono text-[10px] p-3 overflow-hidden flex flex-col justify-end border-l border-slate-800/50">
            <div className="mb-2 text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                <Terminal size={10} /> {t.dashboard.feed.title}
            </div>
            <div className="space-y-1">
                {lines.map((line, i) => (
                    <div key={i} className="text-green-500/80 truncate animate-fade-in-up">
                        {line}
                    </div>
                ))}
                <div className="w-2 h-3 bg-green-500 animate-pulse mt-1"></div>
            </div>
        </div>
    );
};

// --- 3. MAIN DASHBOARD COMPONENT ---

const useDashboardLogic = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const theories = useAppSelector(selectAllTheories);

    // --- Statistics Calculation ---
    const stats = useMemo(() => {
        const total = theories.length;
        const critical = theories.filter(t => t.dangerLevel.includes('High') || t.dangerLevel.includes('Extreme')).length;
        const avgViral = Math.round(theories.reduce((acc, t) => acc + t.popularity, 0) / (total || 1));
        
        // Mock historical data for sparklines
        const history = new Array(10).fill(0).map(() => Math.floor(Math.random() * 100));
        
        return { total, critical, avgViral, history };
    }, [theories]);

    // --- Radar Data ---
    const radarData = useMemo(() => {
        const categories = theories.reduce((acc, t) => {
            const cat = t.category.split(' ')[0]; // Shorten name
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        return Object.entries(categories).map(([subject, A]) => ({ subject, A, fullMark: theories.length })).slice(0, 6);
    }, [theories]);

    // --- Trend Data (Simulated Time Series) ---
    const trendData = useMemo(() => {
        return new Array(7).fill(0).map((_, i) => ({
            day: `Day ${i+1}`,
            scans: Math.floor(Math.random() * 500) + 200,
            threats: Math.floor(Math.random() * 50) + 10,
        }));
    }, []);

    return { stats, radarData, trendData, theories, navigate, t };
};

const MetricCard: React.FC<{ 
    title: string, value: string | number, sub: string, 
    icon: React.ElementType, color: string, sparklineData?: number[],
    onClick?: () => void
}> = ({ title, value, sub, icon: Icon, color, sparklineData, onClick }) => (
    <Card 
        onClick={onClick}
        className={cn(
            "p-5 flex flex-col justify-between relative overflow-hidden group cursor-pointer border-slate-800 bg-slate-950/50 hover:bg-slate-900 transition-all active:scale-[0.98]",
            "hover:border-l-4 hover:border-l-[color:var(--highlight)]" // Dynamic border handled via style or simpler class
        )}
        style={{ '--highlight': color } as React.CSSProperties}
    >
        <div className="flex justify-between items-start z-10 relative">
            <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                    <Icon size={12} className={cn(color.replace('text-', 'text-'))} /> {title}
                </div>
                <div className="text-3xl font-black text-white font-display tracking-tight mt-1">
                    <ScrambleText text={String(value)} />
                </div>
            </div>
            {sparklineData && <Sparkline data={sparklineData} color={color === 'text-red-500' ? '#ef4444' : color === 'text-accent-cyan' ? '#06b6d4' : '#8b5cf6'} />}
        </div>
        
        <div className="mt-4 pt-3 border-t border-slate-800/50 flex justify-between items-center z-10 relative">
            <span className="text-[10px] font-mono text-slate-400">{sub}</span>
            <ChevronRight size={14} className="text-slate-600 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
        </div>

        {/* Decor */}
        <div className={cn("absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-5 group-hover:opacity-10 transition-opacity blur-xl", color.replace('text-', 'bg-'))} />
    </Card>
);

export const Dashboard: React.FC = () => {
    const { stats, radarData, trendData, theories, navigate, t } = useDashboardLogic();

    return (
        <PageFrame>
            <PageHeader 
                title={t.dashboard.title}
                subtitle={t.dashboard.subtitle}
                icon={Activity}
                status={t.common.online}
                visualizerState="BUSY"
            >
                <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 mt-2">
                    <span className="flex items-center gap-1"><Cpu size={10} /> {t.dashboard.load}: 14%</span>
                    <span className="flex items-center gap-1"><Wifi size={10} /> {t.dashboard.latency}: 24ms</span>
                    <span className="flex items-center gap-1"><Lock size={10} /> {t.dashboard.vault}: {t.dashboard.secure}</span>
                </div>
            </PageHeader>

            {/* --- NEW MISSION CONTROL --- */}
            <MissionLaunchpad />

            {/* --- TOP ROW: KPI GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <MetricCard 
                    title={t.dashboard.total} 
                    value={stats.total} 
                    sub="TOTAL ARCHIVED FILES" 
                    icon={Terminal} 
                    color="text-slate-400" 
                    sparklineData={stats.history}
                    onClick={() => navigate('/archive')}
                />
                <MetricCard 
                    title={t.dashboard.critical}
                    value={stats.critical} 
                    sub="PROTOCOL OMEGA TARGETS" 
                    icon={ShieldAlert} 
                    color="text-red-500" 
                    sparklineData={stats.history.map(x => x * 0.4)}
                    onClick={() => navigate('/dangerous')}
                />
                <MetricCard 
                    title={t.dashboard.virality}
                    value={`${stats.avgViral}%`} 
                    sub="GLOBAL INFECTION RATE" 
                    icon={Radio} 
                    color="text-accent-cyan" 
                    sparklineData={stats.history.map(x => x + 20)}
                    onClick={() => navigate('/virality')}
                />
                <MetricCard 
                    title={t.dashboard.sources}
                    value="ONLINE" 
                    sub="AI SKEPTIC ACTIVE" 
                    icon={Zap} 
                    color="text-accent-purple" 
                    onClick={() => navigate('/chat')}
                />
            </div>

            {/* --- MIDDLE ROW: MAP & INTEL --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 min-h-[400px]">
                {/* Global Map */}
                <Card className="lg:col-span-2 p-0 flex flex-col bg-slate-950 border-slate-800 shadow-2xl relative">
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur">
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                            <Globe size={14} className="text-accent-cyan" /> {t.dashboard.mapLabel}
                        </div>
                        <div className="flex gap-2">
                            <Badge label="LIVE" className="bg-red-500/10 text-red-500 border-red-500/50 animate-pulse" />
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <GlobalIncidentMap 
                            data={theories} 
                            onSelect={(id) => navigate(`/archive/${id}`)} 
                            label={t.dashboard.signals}
                            liveLabel={t.dashboard.live}
                        />
                    </div>
                </Card>

                {/* Side Panel: Defcon & Feed */}
                <div className="flex flex-col gap-6 h-full">
                    {/* Defcon Gauge */}
                    <Card className="flex-1 p-0 bg-slate-900/50 border-red-900/30 overflow-hidden relative flex flex-col items-center justify-center text-center">
                        <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 to-transparent pointer-events-none"></div>
                        <AlertTriangle size={48} className="text-red-500 mb-2 animate-pulse" />
                        <div className="text-[10px] font-bold text-red-400 uppercase tracking-[0.2em] mb-1">{t.dashboard.status}</div>
                        <div className="text-5xl font-black text-white font-display tracking-tighter">{t.dashboard.defcon} 4</div>
                        <div className="mt-4 w-full px-8">
                            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500 w-[20%] animate-pulse"></div>
                            </div>
                        </div>
                    </Card>

                    {/* Intel Feed */}
                    <Card className="flex-[2] p-0 border-slate-800 overflow-hidden">
                        <IntelFeed />
                    </Card>
                </div>
            </div>

            {/* --- BOTTOM ROW: ANALYTICS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Temporal Activity */}
                <Card className="lg:col-span-2 p-0 bg-slate-950 border-slate-800">
                    <div className="p-4 border-b border-slate-800 flex items-center gap-2">
                        <Signal size={14} className="text-accent-purple" />
                        <span className="text-xs font-bold text-white uppercase tracking-widest">{t.dashboard.temporal}</span>
                    </div>
                    <div className="h-64 w-full p-4">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="scans" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorScans)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Threat Vector Radar */}
                <Card className="p-0 bg-slate-950 border-slate-800">
                    <div className="p-4 border-b border-slate-800 flex items-center gap-2">
                        <Crosshair size={14} className="text-accent-cyan" />
                        <span className="text-xs font-bold text-white uppercase tracking-widest">{t.dangerPage.vector}</span>
                    </div>
                    <div className="h-64 w-full relative">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke="#334155" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                                <Radar name="Threats" dataKey="A" stroke="#06b6d4" strokeWidth={2} fill="#06b6d4" fillOpacity={0.3} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#06b6d4', fontSize: '12px' }}
                                    itemStyle={{ color: '#06b6d4' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                        {/* Overlay Scan Effect */}
                        <div className="absolute inset-0 pointer-events-none rounded-full border border-accent-cyan/10 scale-75 animate-[ping_3s_linear_infinite]"></div>
                    </div>
                </Card>
            </div>
        </PageFrame>
    );
};

export default Dashboard;
