import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
    name: string;
    value: number;
}

interface StatsBarChartProps {
    data: DataPoint[];
    color?: string;
    height?: number;
}

export const StatsBarChart: React.FC<StatsBarChartProps> = ({
    data,
    color = '#6366f1',
    height = 300,
}) => {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                    cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                />
                <Bar dataKey="value" fill={color} radius={[8, 8, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};
