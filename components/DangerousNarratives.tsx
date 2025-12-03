
import React, { useMemo, useState, createContext, useContext } from 'react';
import { Theory, DangerLevel, DangerLevelEn } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  ShieldAlert, Skull, Zap, 
  Activity, Target, AlertOctagon, 
  Microscope, Radar, BarChart2, ArrowLeft, Lock, AlertTriangle
} from 'lucide-react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, 
  Tooltip, ResponsiveContainer, Cell, ReferenceLine,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar
} from 'recharts';
import { Card, Button, Badge, PageFrame, PageHeader } from './ui/Common';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectAllTheories } from '../store/slices/theoriesSlice';

// --- 1. Logic Hook ---

const getDangerScore = (level: string): number => {
  if (level.includes('Extreme') || level.includes('Demokratie')) return 4;
  if (level.includes('High') || level.includes('Gefährlich')) return 3;
  if (level.includes('Medium') || level.includes('Bedenklich')) return 2;
  return 1;
};

interface ThreatScatterData {
  id: string;
  title: string;
  popularity: number;
  severity: number;
  z: number;
}

const useDangerousNarrativesLogic = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const theories = useAppSelector(selectAllTheories);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const dangerousTheories = useMemo(() => {
    const criticalLevels: string[] = [DangerLevel.HIGH, DangerLevel.EXTREME, DangerLevelEn.HIGH, DangerLevelEn.EXTREME];
    return theories.filter(theory => 
      criticalLevels.includes(theory.dangerLevel)
    ).sort((a, b) => getDangerScore(b.dangerLevel) - getDangerScore(a.dangerLevel));
  }, [theories]);

  const chartData: ThreatScatterData[] = useMemo(() => {
    return dangerousTheories.map(t => ({
      id: t.id,
      title: t.title,
      popularity: t.popularity,
      severity: getDangerScore(t.dangerLevel),
      z: t.popularity * getDangerScore(t.dangerLevel)
    }));
  }, [dangerousTheories]);

  const onNavigateTo = (id: string) => navigate(`/archive/${id}`);
  const onBack = () => navigate('/');

  return {
    t,
    dangerousTheories,
    chartData,
    hoveredId,
    setHoveredId,
    onNavigateTo,
    onBack
  };
};

// --- 2. Context & Provider ---

type DangerousNarrativesContextType = ReturnType<typeof useDangerousNarrativesLogic>;
const DangerousNarrativesContext = createContext<DangerousNarrativesContextType | undefined>(undefined);

const useDangerousNarratives = () => {
  const context = useContext(DangerousNarrativesContext);
  if (!context) throw new Error('useDangerousNarratives must be used within a DangerousNarrativesProvider');
  return context;
};

const DangerousNarrativesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const logic = useDangerousNarrativesLogic();
  return <DangerousNarrativesContext.Provider value={logic}>{children}</DangerousNarrativesContext.Provider>;
};

// --- 3. Sub-Components ---

const ThreatMatrix: React.FC = () => {
  const { chartData } = useDangerousNarratives();
  return (
    <Card className="h-[350px] w-full bg-slate-900/50 border-red-900/30 p-4 relative overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Activity size={120} />
      </div>
      <div className="flex justify-between items-center mb-2 border-b border-red-900/20 pb-2">
          <div className="text-[10px] font-mono text-red-500/80 uppercase tracking-widest flex items-center gap-2">
              <BarChart2 size={12} /> Threat Matrix
          </div>
          <Badge label="Live Data" color="red" />
      </div>
      <div className="w-full flex-1" style={{ width: '100%', height: '100%', minHeight: '250px' }}>
        <ResponsiveContainer width="100%" height="100%" debounce={200} minWidth={0}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
            <XAxis 
                type="number" 
                dataKey="popularity" 
                name="Virality" 
                unit="%" 
                stroke="#64748b" 
                tick={{fontSize: 10, fontFamily: 'monospace', fill: '#64748b'}}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
            />
            <YAxis 
                type="number" 
                dataKey="severity" 
                name="Severity" 
                domain={[0, 5]} 
                stroke="#64748b"
                tick={{fontSize: 10, fontFamily: 'monospace', fill: '#64748b'}}
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
                    <div className="bg-slate-950 border border-red-500/50 p-3 rounded shadow-xl backdrop-blur-md">
                        <div className="text-white font-bold text-xs mb-1 uppercase tracking-wide">{d.title}</div>
                        <div className="w-full h-px bg-red-900/50 my-1"></div>
                        <div className="text-[10px] text-slate-400 font-mono">
                           <span className="text-accent-cyan">VIRALITY:</span> {d.popularity}%<br/>
                           <span className="text-red-500">SEVERITY:</span> {d.severity}/4
                        </div>
                    </div>
                    );
                }
                return null;
                }}
            />
            <ReferenceLine y={2.5} stroke="#ef4444" strokeDasharray="3 3" opacity={0.5} label={{ value: 'CRITICAL THRESHOLD', position: 'insideTopRight', fill: '#ef4444', fontSize: 10, fontFamily: 'monospace' }} />
            <Scatter name="Threats" data={chartData} shape="circle">
                {chartData.map((entry, index) => (
                <Cell 
                    key={`cell-${index}`} 
                    fill={entry.severity >= 3 ? '#ef4444' : '#f59e0b'} 
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth={1}
                />
                ))}
            </Scatter>
            </ScatterChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

const ThreatRadar: React.FC = () => {
    const data = [
        { subject: 'Erosion', A: 120, fullMark: 150 },
        { subject: 'Violence', A: 98, fullMark: 150 },
        { subject: 'Health', A: 86, fullMark: 150 },
        { subject: 'Science', A: 99, fullMark: 150 },
        { subject: 'Election', A: 85, fullMark: 150 },
        { subject: 'Social', A: 65, fullMark: 150 },
    ];
    return (
        <Card className="h-[350px] w-full bg-slate-900/50 border-red-900/30 p-4 relative overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-2 border-b border-red-900/20 pb-2">
                <div className="text-[10px] font-mono text-red-500/80 uppercase tracking-widest flex items-center gap-2">
                    <Radar size={12} /> Vector Analysis
                </div>
            </div>
            <div className="w-full relative flex-1" style={{ width: '100%', height: '100%', minHeight: '250px' }}>
                <ResponsiveContainer width="100%" height="100%" debounce={200} minWidth={0}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                        <RechartsRadar
                            name="Threat"
                            dataKey="A"
                            stroke="#ef4444"
                            strokeWidth={2}
                            fill="#ef4444"
                            fillOpacity={0.2}
                        />
                    </RadarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 pointer-events-none border border-red-500/10 rounded-full scale-75 animate-pulse"></div>
            </div>
        </Card>
    )
};

const DefconLevel: React.FC<{ activeThreats: number }> = React.memo(({ activeThreats }) => {
    let level = 5;
    if (activeThreats > 0) level = 4;
    if (activeThreats > 3) level = 3;
    if (activeThreats > 5) level = 2;
    if (activeThreats > 8) level = 1;
    const colors = {
        5: 'text-green-500 border-green-500',
        4: 'text-green-400 border-green-400',
        3: 'text-yellow-500 border-yellow-500',
        2: 'text-orange-500 border-orange-500',
        1: 'text-red-600 border-red-600 animate-pulse'
    };
    return (
        <div className={`
            flex flex-col items-center justify-center p-4 border-2 rounded-xl bg-slate-950 shadow-2xl
            ${colors[level as keyof typeof colors]}
        `}>
            <div className="text-[10px] uppercase font-bold tracking-[0.2em] mb-1 opacity-80">Threat Level</div>
            <div className="text-5xl font-black tracking-tighter">DEFCON {level}</div>
            <div className="text-[10px] mt-2 font-mono opacity-70">
                {level === 1 ? 'MAXIMUM READINESS' : level <= 3 ? 'ELEVATED ALERT' : 'NORMAL READINESS'}
            </div>
        </div>
    );
});

const DangerHeader: React.FC = () => {
  const { t, onBack } = useDangerousNarratives();
  return (
    <PageHeader 
      title={t.dangerPage.title}
      subtitle="PROTOCOL OMEGA ACTIVE"
      icon={ShieldAlert}
      status="CRITICAL ALERT"
      statusColor="bg-red-600"
      actions={
          <Button variant="ghost" onClick={onBack} size="sm" icon={<ArrowLeft size={16} />}>
              {t.detail.back}
          </Button>
      }
    />
  );
};

const ThreatOverview: React.FC = () => {
  const { t, dangerousTheories } = useDangerousNarratives();
  return (
    <div className="relative overflow-hidden rounded-2xl border border-red-900/50 bg-gradient-to-r from-slate-950 via-slate-900 to-red-950/20 p-6 md:p-10 mb-8 shadow-[0_0_40px_rgba(239,68,68,0.1)] group">
       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
       <div className="absolute -right-16 -top-16 text-red-600/5 animate-[spin_60s_linear_infinite]">
          <AlertOctagon size={400} />
       </div>
       <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
          <div className="flex-1">
              <p className="text-red-100/70 max-w-2xl text-lg leading-relaxed pl-1 border-l-2 border-red-500/50">
                 {t.dangerPage.subtitle}
              </p>
          </div>
          <div className="flex gap-4">
             <DefconLevel activeThreats={dangerousTheories.length} />
             <div className="hidden sm:flex flex-col gap-2">
                  <div className="bg-slate-950/80 border border-red-900/40 p-3 rounded-lg text-center backdrop-blur-sm shadow-lg min-w-[100px]">
                      <div className="text-2xl font-mono font-bold text-red-500">{dangerousTheories.length}</div>
                      <div className="text-[9px] uppercase tracking-widest text-slate-500">Active Threats</div>
                  </div>
                  <div className="bg-slate-950/80 border border-red-900/40 p-3 rounded-lg text-center backdrop-blur-sm shadow-lg min-w-[100px]">
                      <div className="text-2xl font-mono font-bold text-orange-400">
                          {Math.round(dangerousTheories.reduce((acc, t) => acc + t.popularity, 0) / (dangerousTheories.length || 1))}%
                      </div>
                      <div className="text-[9px] uppercase tracking-widest text-slate-500">Avg. Virality</div>
                  </div>
             </div>
          </div>
       </div>
    </div>
  );
};

const ThreatVisuals: React.FC = () => {
  const { dangerousTheories, onNavigateTo, hoveredId, setHoveredId, t } = useDangerousNarratives();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
       <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ThreatMatrix />
              <ThreatRadar />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                  { icon: <Skull size={20} />, title: t.dangerPage.cards.radicalization.title, desc: t.dangerPage.cards.radicalization.desc, color: 'text-red-400', border: 'border-red-900/40', bg: 'bg-red-950/20' },
                  { icon: <AlertTriangle size={20} />, title: t.dangerPage.cards.health.title, desc: t.dangerPage.cards.health.desc, color: 'text-orange-400', border: 'border-orange-900/40', bg: 'bg-orange-950/20' },
                  { icon: <Lock size={20} />, title: t.dangerPage.cards.erosion.title, desc: t.dangerPage.cards.erosion.desc, color: 'text-slate-300', border: 'border-slate-700/50', bg: 'bg-slate-900/50' }
              ].map((card, idx) => (
                  <Card key={idx} className={`${card.bg} ${card.border} p-4 transition-transform hover:scale-[1.02] shadow-lg`}>
                      <div className={`mb-3 ${card.color}`}>{card.icon}</div>
                      <h3 className={`font-bold text-xs uppercase tracking-wider mb-2 ${card.color}`}>{card.title}</h3>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{card.desc}</p>
                  </Card>
              ))}
          </div>
       </div>
       <div className="bg-slate-900/60 border border-red-900/20 rounded-xl overflow-hidden flex flex-col h-full max-h-[600px] shadow-2xl backdrop-blur-md">
          <div className="p-4 bg-red-950/40 border-b border-red-900/30 flex justify-between items-center">
              <h3 className="text-sm font-bold text-red-100 uppercase tracking-wider flex items-center gap-2">
                  <Zap size={14} className="text-red-500" /> Priority Targets
              </h3>
          </div>
          <div className="overflow-y-auto p-2 space-y-2 flex-1 scrollbar-thin scrollbar-thumb-red-900/50">
              {dangerousTheories.map((theory, idx) => (
                  <div 
                      key={theory.id}
                      onMouseEnter={() => setHoveredId(theory.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => onNavigateTo(theory.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigateTo(theory.id) }}
                      className={`
                          p-3 rounded-lg cursor-pointer transition-all border outline-none focus:ring-1 focus:ring-red-500
                          ${hoveredId === theory.id 
                              ? 'bg-red-900/30 border-red-500/50 translate-x-1' 
                              : 'bg-transparent border-transparent hover:bg-slate-800/50'}
                      `}
                      aria-label={`View threat details for ${theory.title}`}
                  >
                      <div className="flex justify-between items-start mb-1">
                          <span className={`text-xs font-bold line-clamp-1 ${hoveredId === theory.id ? 'text-white' : 'text-slate-300'}`}>{theory.title}</span>
                          <span className="font-mono text-[9px] bg-red-950 text-red-400 px-1.5 py-0.5 rounded border border-red-900">
                              {getDangerScore(theory.dangerLevel) >= 4 ? 'EXT' : 'HIGH'}
                          </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1.5">
                          <div className="h-full bg-red-500 shadow-[0_0_10px_red]" style={{ width: `${theory.popularity}%` }}></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                           <span>IMPACT SCORE</span>
                           <span className="text-red-400">{theory.popularity * getDangerScore(theory.dangerLevel)}</span>
                      </div>
                  </div>
              ))}
          </div>
       </div>
    </div>
  );
};

const ThreatListPanel: React.FC = () => {
  const { t, dangerousTheories, onNavigateTo } = useDangerousNarratives();
  return (
    <>
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 pl-4 border-l-4 border-red-600 bg-gradient-to-r from-red-950/20 to-transparent py-2">
         <Microscope className="text-red-500" />
         {t.dangerPage.listHeader}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {dangerousTheories.map((theory) => (
            <div 
               key={theory.id} 
               onClick={() => onNavigateTo(theory.id)}
               role="button"
               tabIndex={0}
               onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigateTo(theory.id) }}
               className="group relative bg-slate-900 border border-slate-800 hover:border-red-500/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] flex outline-none focus:ring-2 focus:ring-red-500"
               aria-label={`Examine ${theory.title}`}
            >
               <div className="w-1 bg-red-900 group-hover:bg-red-500 transition-colors"></div>
               <div className="w-24 h-full bg-black relative shrink-0 overflow-hidden">
                   <img src={theory.imageUrl} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity grayscale group-hover:scale-110 duration-700" alt="" />
                   <div className="absolute inset-0 bg-red-500/10 mix-blend-overlay"></div>
               </div>
               <div className="p-4 flex-1">
                   <div className="flex justify-between items-start mb-2">
                       <h3 className="font-bold text-white group-hover:text-red-400 transition-colors">{theory.title}</h3>
                       <Target size={14} className="text-slate-600 group-hover:text-red-500" />
                   </div>
                   <p className="text-xs text-slate-400 line-clamp-2 mb-3">{theory.shortDescription}</p>
                   <div className="flex gap-2">
                      <div className="px-2 py-0.5 rounded bg-red-950/40 border border-red-900/30 text-[10px] text-red-300 uppercase font-mono">
                         Radicalization: High
                      </div>
                      <div className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400 uppercase font-mono">
                         Growth: {theory.popularity}%
                      </div>
                   </div>
               </div>
            </div>
         ))}
      </div>
    </>
  );
};

// --- 4. Main Component ---

export const DangerousNarratives: React.FC = () => {
  return (
      <DangerousNarrativesProvider>
        <PageFrame>
          <DangerHeader />
          <ThreatOverview />
          <ThreatVisuals />
          <ThreatListPanel />
        </PageFrame>
      </DangerousNarrativesProvider>
  );
};

export default DangerousNarratives;
