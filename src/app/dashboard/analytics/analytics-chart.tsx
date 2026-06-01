'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, AreaChart, Area, CartesianGrid } from 'recharts'
import { memo } from 'react'
import { Card } from '@/components/ui/card'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#6366f1', '#ec4899', '#14b8a6', '#f97316', '#8b5cf6']

interface AnalyticsChartProps {
    type: 'bar' | 'pie' | 'area';
    data: any[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const val = payload[0].value;
        return (
            <Card className="p-3 bg-white/90 backdrop-blur-md border border-slate-200/50 shadow-xl rounded-xl">
                <p className="font-semibold text-slate-700 text-sm mb-1">{label || payload[0].name}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center justify-between gap-4 mt-1">
                        <span className="text-xs font-medium" style={{ color: entry.color }}>{entry.name || 'Valor'}</span>
                        <span className="text-sm font-bold text-slate-800">
                            {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(entry.value)}
                        </span>
                    </div>
                ))}
            </Card>
        );
    }
    return null;
}

export const AnalyticsChart = memo(function AnalyticsChart({ type, data }: AnalyticsChartProps) {
    if (!data || data.length === 0) {
        return <div className="h-full flex items-center justify-center text-muted-foreground text-sm">Sin datos para graficar</div>
    }

    if (type === 'area') {
        const dataKeys = data.length > 0 ? Object.keys(data[0]).filter(k => k !== 'name') : [];
        
        return (
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                        {dataKeys.map((key, index) => (
                            <linearGradient key={`color-${index}`} id={`color-${index}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0}/>
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    {dataKeys.map((key, index) => (
                        <Area 
                            key={key} 
                            type="monotone" 
                            dataKey={key} 
                            stackId="1" 
                            stroke={COLORS[index % COLORS.length]} 
                            strokeWidth={2} 
                            fillOpacity={1} 
                            fill={`url(#color-${index})`} 
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        )
    }

    if (type === 'bar') {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis 
                        stroke="#94a3b8" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `$${value/1000}k`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={50}>
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
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity stroke-white stroke-2" />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '13px', paddingTop: '20px' }} iconType="circle" />
            </PieChart>
        </ResponsiveContainer>
    )
})
