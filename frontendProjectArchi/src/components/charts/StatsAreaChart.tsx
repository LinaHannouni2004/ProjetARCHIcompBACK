import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
    name: string;
    value: number;
}

interface StatsAreaChartProps {
    data: DataPoint[];
    color?: string;
    height?: number;
}

export const StatsAreaChart: React.FC<StatsAreaChartProps> = ({
    data,
    color = '#6366f1',
    height = 300,
}) => {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id={`color${color}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                    dataKey="name"
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                    tickLine={false}
                />
                <YAxis
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill={`url(#color${color})`}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};
