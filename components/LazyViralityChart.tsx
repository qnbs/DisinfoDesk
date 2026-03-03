import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

const LazyViralityChart: React.FC<{ history: any[], t: any }> = ({ history, t }) => (
    <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
                <linearGradient id="colorInf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCured" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#475569" fontSize={10} tickFormatter={(v) => `${v}s`} />
            <YAxis stroke="#475569" fontSize={10} />
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <RechartsTooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px' }}
                itemStyle={{ color: '#f8fafc' }}
            />
            <Area 
                type="monotone" 
                dataKey="infected"
                name={t.viralPage.chart.infected}
                stroke="#ef4444" 
                fillOpacity={1} 
                fill="url(#colorInf)" 
                isAnimationActive={false}
            />
            <Area 
                type="monotone" 
                dataKey="recovered"
                name={t.viralPage.chart.cured}
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorCured)" 
                isAnimationActive={false}
            />
            {history.length > 50 && (
                <ReferenceLine x={history[Math.floor(history.length/2)].time} stroke="#eab308" strokeDasharray="3 3" />
            )}
        </AreaChart>
    </ResponsiveContainer>
);

export default LazyViralityChart;
