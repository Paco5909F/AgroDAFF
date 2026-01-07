"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface OverviewChartProps {
    data: { name: string; total: number }[]
}

export function OverviewChart({ data }: OverviewChartProps) {

    return (
        <Card className="h-full min-h-[400px] border-none shadow-lg shadow-emerald-100/30 flex flex-col">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">Resumen de Ingresos</CardTitle>
            </CardHeader>
            <CardContent className="pl-2 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12} // Reduced font size for mobile safety
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                            width={60} // Fixed width to prevent overflow
                        />
                        <Tooltip
                            cursor={{ fill: '#ecfdf5' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0fdf4" />
                        <Bar
                            dataKey="total"
                            fill="#10b981" // emerald-500
                            radius={[4, 4, 0, 0]}
                            animationDuration={1500}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
