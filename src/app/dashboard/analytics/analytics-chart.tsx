'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts'
import { memo } from 'react'
import { Card } from '@/components/ui/card'

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

interface AnalyticsChartProps {
    type: 'bar' | 'pie';
    data: { name: string; value: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const val = payload[0].value;
        return (
            <Card className="p-3 bg-background/95 backdrop-blur-sm border-border shadow-2xl">
                <p className="font-semibold text-sm mb-1">{label || payload[0].name}</p>
                <p className="text-sm text-primary font-bold">
                    {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val)}
                </p>
            </Card>
        );
    }
    return null;
}

export const AnalyticsChart = memo(function AnalyticsChart({ type, data }: AnalyticsChartProps) {
    if (!data || data.length === 0) {
        return <div className="h-full flex items-center justify-center text-muted-foreground text-sm">Sin datos para graficar</div>
    }

    if (type === 'bar') {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: 20, bottom: 20 }}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} dx={-10} dy={10} width={100} />
                    <YAxis 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'var(--muted)'}} />
                    <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        )
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity" />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
        </ResponsiveContainer>
    )
})
