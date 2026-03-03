import React from 'react';
import { AreaChart, Area, ResponsiveContainer, CartesianGrid } from 'recharts';

export const LazyTelemetryChart: React.FC<{ telemetry: any[] }> = ({ telemetry }) => (
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <AreaChart data={telemetry}>
            <defs>
                <linearGradient id="gradInf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <Area type="monotone" dataKey="infected" stroke="#ef4444" strokeWidth={2} fill="url(#gradInf)" isAnimationActive={false} />
            <Area type="monotone" dataKey="recovered" stroke="#10b981" strokeWidth={1} fill="transparent" isAnimationActive={false} />
        </AreaChart>
    </ResponsiveContainer>
);

export default LazyTelemetryChart;
