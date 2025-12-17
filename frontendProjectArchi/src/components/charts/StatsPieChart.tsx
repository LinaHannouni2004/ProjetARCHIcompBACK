import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DataPoint {
    name: string;
    value: number;
}

interface StatsPieChartProps {
    data: DataPoint[];
    colors?: string[];
    height?: number;
}

const DEFAULT_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

export const StatsPieChart: React.FC<StatsPieChartProps> = ({
    data,
    colors = DEFAULT_COLORS,
    height = 300,
}) => {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                />
                <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px' }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};
