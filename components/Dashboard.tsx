
import React, { useMemo, useState, useEffect, useCallback, createContext, useContext } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, 
  Tooltip, Cell, AreaChart, Area
} from 'recharts';
import { 
  DangerLevel, DangerLevelEn, Category, CategoryEn, 
  RadarDataPoint, ScatterDataPoint 
} from '../types';
import { 
  VIZ_COLORS, CATEGORY_COLORS 
} from '../constants';
import { 
  TrendingUp, ShieldAlert, BookOpen, Activity, 
  Radio, Globe, Cpu, AlertOctagon, Fingerprint, Eye, Zap, Map, MousePointer2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, PageFrame, PageHeader } from './ui/Common';
import { useAppSelector } from '../store/hooks';
import { selectAllTheories } from '../store/slices/theoriesSlice';
import { useNavigate } from 'react-router-dom';

// --- 1. Logic Hook ---

const parseYear = (yearStr?: string): number => {
  if (!yearStr) return 2000;
  const match = yearStr.match(/\d{4}/);
  if (match) return parseInt(match[0]);
  if (yearStr.includes('19. Jh') || yearStr.includes('19th')) return 1850;
  if (yearStr.includes('17. Jh') || yearStr.includes('17th')) return 1650;
  return 2000;
};

const useDashboardLogic = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const theories = useAppSelector(selectAllTheories);
  
  const [systemLoad, setSystemLoad] = useState(45);
  const [networkActivity, setNetworkActivity] = useState<number[]>(new Array(20).fill(20));

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemLoad(prev => Math.min(98, Math.max(12, prev + (Math.random() * 10 - 5))));
      setNetworkActivity(prev => {
        const next = [...prev.slice(1), Math.floor(Math.random() * 100)];
        return next;
      });
    }, 2500); 
    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => {
    const total = theories.length;
    const criticalLevels: string[] = [DangerLevel.HIGH, DangerLevel.EXTREME, DangerLevelEn.HIGH, DangerLevelEn.EXTREME];
    
    const high = theories.filter(t => 
      criticalLevels.includes(t.dangerLevel)
    ).length;
    const avgPop = Math.round(theories.reduce((acc, t) => acc + t.popularity, 0) / (total || 1));
    const integrity = Math.max(0, 100 - (high * 2)); 
    
    return { total, high, avgPop, integrity };
  }, [theories]);
  
  const radarData = useMemo(() => {
    const catEnum = language === 'de' ? Category : CategoryEn;
    return Object.values(catEnum).map(cat => ({
      subject: cat.split(' ')[0], 
      fullSubject: cat,
      count: theories.filter(t => t.category === cat).length,
      fullMark: theories.length
    }));
  }, [theories, language]);

  const scatterData = useMemo(() => {
    const criticalLevels: string[] = [DangerLevel.HIGH, DangerLevel.EXTREME, DangerLevelEn.HIGH, DangerLevelEn.EXTREME];
    return theories.map(t => ({
      id: t.id,
      title: t.title,
      x: parseYear(t.originYear),
      y: t.popularity,
      z: criticalLevels.includes(t.dangerLevel) ? 20 : 10,
      category: t.category,
      danger: t.dangerLevel
    }));
  }, [theories]);

  const activityData = useMemo(() => {
    return networkActivity.map((val, i) => ({ i, val }));
  }, [networkActivity]);

  const trendingTopics = useMemo(() => {
    return [...theories]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 3);
  }, [theories]);

  const handleNavList = useCallback(() => navigate('/archive'), [navigate]);
  const handleNavDangerous = useCallback(() => navigate('/dangerous'), [navigate]);
  const handleNavVirality = useCallback(() => navigate('/virality'), [navigate]);
  const handleNavDetail = useCallback((id: string) => navigate(`/archive/${id}`), [navigate]);

  return {
    t,
    stats,
    radarData,
    scatterData,
    activityData,
    trendingTopics,
    systemLoad,
    handleNavList,
    handleNavDangerous,
    handleNavVirality,
    handleNavDetail
  };
};

// --- 2. Context & Provider ---

type DashboardContextType = ReturnType<typeof useDashboardLogic>;
const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used within a DashboardProvider');
  return context;
};

const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const logic = useDashboardLogic();
  return <DashboardContext.Provider value={logic}>{children}</DashboardContext.Provider>;
};

// --- 3. Sub-Components ---

interface CustomTooltipRadarProps {
  active?: boolean;
  payload?: { value: number; payload: RadarDataPoint }[];
}
const CustomTooltipRadar: React.FC<CustomTooltipRadarProps> = ({ active, payload }) => {
  if (!active || !payload || !payload.length || !payload[0] || !payload[0].payload) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-lg shadow-2xl backdrop-blur-md">
      <p className="text-accent-cyan font-bold text-xs mb-1 font-mono uppercase tracking-wider">{data.fullSubject}</p>
      <div className="flex justify-between items-center gap-4">
          <span className="text-slate-400 text-xs">Total Files:</span>
          <span className="font-mono font-bold text-white text-sm">{payload[0].value}</span>
      </div>
    </div>
  );
};

interface CustomTooltipScatterProps {
  active?: boolean;
  payload?: { value: number | string; payload: ScatterDataPoint }[];
}
const CustomTooltipScatter: React.FC<CustomTooltipScatterProps> = ({ active, payload }) => {
  if (!active || !payload || !payload.length || !payload[0] || !payload[0].payload) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-slate-900/95 border-l-2 border-accent-purple p-3 rounded-r-lg shadow-2xl backdrop-blur-md min-w-[200px] z-50">
      <div className="flex justify-between items-start mb-1">
        <p className="text-[10px] text-slate-500 font-mono uppercase">{data.x}</p>
        <span className="text-[10px] uppercase bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">{data.danger}</span>
      </div>
      <p className="text-white font-bold text-sm mb-2">{data.title}</p>
      <div className="flex justify-between items-center border-t border-slate-700/50 pt-2">
          <span className="text-xs text-accent-cyan font-mono">{data.category.split(' ')[0]}</span>
          <span className="text-xs font-bold text-white">Virality: {data.y}%</span>
      </div>
      <div className="mt-2 text-[9px] text-accent-purple uppercase font-bold text-right tracking-wider">
          Click to Access
      </div>
    </div>
  );
};

const KPICard: React.FC<{ 
  title: string; 
  value: string | number; 
  sub: string; 
  icon: React.ReactNode; 
  trend?: 'up' | 'down' | 'neutral';
  color: string;
  onClick?: () => void;
}> = React.memo(({ title, value, sub, icon, trend, color, onClick }) => (
  <Card 
    onClick={onClick}
    className={`p-4 relative overflow-hidden group hover:border-${color} transition-all duration-300 ${onClick ? 'cursor-pointer active:scale-95' : ''}`}
  >
    <div className={`absolute -right-6 -top-6 opacity-5 text-${color} group-hover:scale-110 transition-transform duration-700 rotate-12`}>
      <Fingerprint size={120} />
    </div>
    
    <div className="flex justify-between items-start mb-3 relative z-10">
      <div className={`text-slate-400 text-[10px] font-bold uppercase tracking-widest font-mono`}>{title}</div>
      <div className={`p-1.5 rounded-md bg-${color}/10 text-${color} ring-1 ring-${color}/20 shadow-[0_0_10px_rgba(0,0,0,0.3)]`}>
        {icon}
      </div>
    </div>
    
    <div className="text-2xl md:text-4xl font-bold text-white mb-2 font-mono tracking-tighter relative z-10 drop-shadow-md">
      {value}
    </div>
    
    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono relative z-10">
       {trend === 'up' && <TrendingUp size={12} className="text-red-400" />}
       <span className="opacity-70">{sub}</span>
    </div>
    
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[50%] w-full animate-scan pointer-events-none opacity-0 group-hover:opacity-100"></div>
  </Card>
));

const DashboardHeader: React.FC = () => {
  const { t, systemLoad } = useDashboard();
  return (
    <PageHeader 
      title={t.dashboard.title}
      subtitle="SECURE CONNECTION ESTABLISHED"
      icon={Globe}
      actions={
         <div className="text-left md:text-right border-l-2 md:border-l-0 md:border-r-2 border-accent-cyan/30 pl-3 md:pl-0 md:pr-3">
            <div className="text-[10px] text-slate-500 font-mono uppercase">System Load</div>
            <div className="text-xs text-accent-cyan font-bold font-mono flex items-center justify-end gap-2">
                <span>{systemLoad.toFixed(1)}%</span>
                <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-cyan" style={{ width: `${systemLoad}%` }}></div>
                </div>
            </div>
         </div>
      }
    />
  );
};

const DashboardTicker: React.FC = () => {
  const { t } = useDashboard();
  return (
    <div className="w-full bg-slate-900/80 border-y border-white/10 h-10 md:h-8 flex items-center overflow-hidden relative mb-6 backdrop-blur-sm shadow-md" aria-hidden="true">
      <div className="absolute left-0 bg-accent-cyan/20 text-accent-cyan px-3 text-[10px] font-bold h-full flex items-center z-20 border-r border-accent-cyan/30">
        LIVE
      </div>
      <div className="animate-marquee whitespace-nowrap flex gap-12 text-xs md:text-[10px] font-mono text-slate-400 items-center pl-16">
        <span>{t.dashboard.ticker.detected}</span>
        <span className="text-red-400 flex items-center gap-1"><ShieldAlert size={10} /> {t.dashboard.ticker.warning}</span>
        <span>{t.dashboard.ticker.analysis}</span>
        <span className="text-accent-cyan flex items-center gap-1"><Cpu size={10} /> {t.dashboard.ticker.system}</span>
        <span>{t.dashboard.ticker.archive}</span>
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-[#020617] to-transparent z-10 pointer-events-none"></div>
    </div>
  );
};

const DashboardKPIs: React.FC = () => {
  const { stats, t, handleNavList, handleNavDangerous, handleNavVirality } = useDashboard();
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6">
      <KPICard 
         title="ARCHIVED" 
         value={stats.total} 
         sub={t.dashboard.total} 
         icon={<BookOpen size={18} />} 
         trend="up"
         color="cyan"
         onClick={handleNavList}
      />
      <KPICard 
         title="THREATS" 
         value={stats.high} 
         sub={t.dashboard.critical} 
         icon={<AlertOctagon size={18} />} 
         trend="up"
         color="red"
         onClick={handleNavDangerous}
      />
       <KPICard 
         title="VIRALITY" 
         value={`${stats.avgPop}%`} 
         sub={t.dashboard.virality} 
         icon={<Radio size={18} />} 
         trend="neutral"
         color="purple"
         onClick={handleNavVirality}
      />
       <KPICard 
         title="INTEGRITY" 
         value={`${stats.integrity}%`} 
         sub="Reliability" 
         icon={<ShieldAlert size={18} />} 
         trend="down"
         color="green"
      />
    </div>
  );
};

const GeoThreatMap: React.FC = () => {
    const { activityData } = useDashboard();
    return (
        <Card className="col-span-1 min-h-[400px] flex flex-col relative overflow-hidden bg-slate-950 p-0">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"></div>
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <h3 className="text-xs font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
                    <Map size={14} className="text-accent-cyan" />
                    Global Incident Map
                </h3>
                <div className="flex gap-2">
                    <div className="flex items-center gap-1 text-[9px] text-red-400"><div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div> HIGH</div>
                    <div className="flex items-center gap-1 text-[9px] text-yellow-400"><div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div> MED</div>
                </div>
            </div>
            
            <div className="relative flex-1 bg-[#050b14]">
                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 800 400" preserveAspectRatio="none">
                    <path d="M50,100 Q150,50 250,120 T400,100 T600,80 T750,120" stroke="#1e293b" strokeWidth="2" fill="none" />
                    <path d="M80,300 Q200,350 300,320 T500,350 T700,320" stroke="#1e293b" strokeWidth="2" fill="none" />
                    <circle cx="200" cy="150" r="30" fill="#1e293b" opacity="0.5" />
                    <circle cx="550" cy="180" r="40" fill="#1e293b" opacity="0.5" />
                    <circle cx="350" cy="280" r="25" fill="#1e293b" opacity="0.5" />
                </svg>
                
                {[...Array(8)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-red-500 animate-ping"
                        style={{
                            top: `${20 + Math.random() * 60}%`,
                            left: `${10 + Math.random() * 80}%`,
                            animationDuration: `${1 + Math.random() * 2}s`,
                            animationDelay: `${Math.random()}s`
                        }}
                    ></div>
                ))}
                
                <div className="absolute bottom-0 left-0 w-full h-24 p-0 pointer-events-none">
                    <div className="w-full h-full p-2 opacity-80" style={{ height: '96px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%" debounce={200} minWidth={0}>
                            <AreaChart data={activityData}>
                                <defs>
                                    <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Area 
                                    type="monotone" 
                                    dataKey="val" 
                                    stroke="#06b6d4" 
                                    strokeWidth={1.5}
                                    fill="url(#colorActivity)" 
                                    isAnimationActive={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            
            <div className="p-2 border-t border-slate-800 bg-slate-900/30 text-[9px] font-mono text-slate-500 flex justify-between relative z-10">
                <span>LAT: 45.23 / LON: -12.44</span>
                <span className="flex items-center gap-1"><Activity size={8} /> LIVE TRAFFIC</span>
            </div>
        </Card>
    );
};

const DashboardCharts: React.FC = () => {
  const { scatterData, radarData, t, handleNavDetail } = useDashboard();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
       {/* Temporal Scatter */}
       <Card className="col-span-1 md:col-span-2 lg:col-span-2 flex flex-col min-h-[400px]">
          <div className="p-4 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2 font-mono uppercase tracking-wider">
              <Activity size={14} className="text-accent-purple" />
              TEMPORAL THREAT MATRIX
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-accent-purple animate-pulse flex items-center gap-1"><MousePointer2 size={10} /> INTERACTIVE</span>
              <div className="text-[9px] text-slate-500 font-mono border border-slate-700/50 px-2 py-0.5 rounded bg-slate-900/50 hidden sm:block">
                X: ORIGIN // Y: VIRALITY
              </div>
            </div>
          </div>
          <div className="w-full flex-1" style={{ minHeight: '300px', width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%" debounce={200} minWidth={0}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="Year" 
                  domain={[1940, 2025]} 
                  tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }} 
                  tickCount={5}
                  axisLine={{ stroke: '#334155' }}
                  tickLine={false}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Popularity" 
                  tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }} 
                  unit="%" 
                  axisLine={{ stroke: '#334155' }}
                  tickLine={false}
                />
                <ZAxis type="number" dataKey="z" range={[50, 400]} />
                <Tooltip cursor={{ strokeDasharray: '3 3', stroke: '#475569' }} content={<CustomTooltipScatter />} />
                <Scatter 
                    name="Theories" 
                    data={scatterData} 
                    onClick={(data) => handleNavDetail(data.payload.id)}
                    style={{ cursor: 'pointer' }}
                >
                  {scatterData.map((entry, index) => (
                    <Cell 
                        key={`cell-${index}`} 
                        fill={CATEGORY_COLORS[entry.category] || VIZ_COLORS.slate} 
                        fillOpacity={0.6} 
                        strokeWidth={1} 
                        className="hover:opacity-100 transition-opacity cursor-pointer"
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
       </Card>

       {/* Radar */}
       <Card className="col-span-1 md:col-span-2 lg:col-span-1 flex flex-col relative min-h-[400px]">
          <div className="p-4 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2 font-mono uppercase tracking-wider">
              <Eye size={14} className="text-accent-cyan" />
              {t.dashboard.distribution}
            </h3>
            <div className="flex gap-1.5">
              <div className="w-1 h-1 bg-accent-cyan rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-accent-purple rounded-full"></div>
            </div>
          </div>
          <div className="w-full relative flex-1" style={{ minHeight: '300px', width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%" debounce={200} minWidth={0}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                <Radar
                  name="Theories"
                  dataKey="count"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fill="#06b6d4"
                  fillOpacity={0.15}
                />
                <Tooltip content={<CustomTooltipRadar />} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="absolute top-2 left-2 text-[8px] text-slate-700 font-mono">RADAR_SEQ_09</div>
            <div className="absolute bottom-2 right-2 text-[8px] text-slate-700 font-mono">SCALE: LOG</div>
          </div>
       </Card>

       <GeoThreatMap />
    </div>
  );
};

const DashboardTrending: React.FC = () => {
  const { trendingTopics, t, handleNavDetail } = useDashboard();
  return (
    <div className="grid grid-cols-1">
        <Card className="col-span-1 md:col-span-2 lg:col-span-4 border-t-2 border-t-accent-purple">
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2 font-mono uppercase tracking-wider">
                    <Zap size={14} className="text-accent-purple" />
                    {t.dashboard.toplist}
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800">
                {trendingTopics.map((theory, idx) => (
                    <div 
                        key={theory.id} 
                        onClick={() => handleNavDetail(theory.id)}
                        className="p-4 hover:bg-slate-800/50 cursor-pointer transition-colors group flex items-start gap-3 active:bg-slate-800"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleNavDetail(theory.id); }}
                    >
                        <span className="text-2xl font-mono font-bold text-slate-600 group-hover:text-accent-purple transition-colors">0{idx + 1}</span>
                        <div>
                            <h4 className="text-sm font-bold text-white group-hover:text-accent-cyan transition-colors">{theory.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">{theory.category.split(' ')[0]}</span>
                                <span className="text-[10px] text-green-400 flex items-center gap-0.5"><TrendingUp size={10} /> +{Math.floor(Math.random() * 20)}%</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    </div>
  );
};

// --- 4. Main Component ---

export const Dashboard: React.FC = () => {
  return (
      <DashboardProvider>
        <PageFrame>
          <DashboardHeader />
          <DashboardTicker />
          <DashboardKPIs />
          <DashboardCharts />
          <DashboardTrending />
        </PageFrame>
      </DashboardProvider>
  );
};

export default Dashboard;
