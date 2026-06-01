import { Metadata } from 'next'
import { getCampaignAnalytics } from '@/server/analytics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightbulb, Info, TrendingUp, AlertTriangle, Cpu } from 'lucide-react'
import { AnalyticsChart } from './analytics-chart' // Client Component for Recharts

export const metadata: Metadata = {
    title: 'Analítica Inteligente | AgroDAFF'
}

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
    // Pass null to default to active campaign
    const stats = await getCampaignAnalytics(null)

    const formatCurrency = (val: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val);

    return (
        <div className="flex-1 space-y-6 container mx-auto p-4 md:p-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
                        Tablero de Control Operativo
                    </h2>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-emerald-500" />
                        Analítica financiera y operativa de campaña
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="hover:shadow-lg transition-all border-l-4 border-l-emerald-500 bg-white/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Gasto Total Campaña</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-800 truncate" title={formatCurrency(stats.gastoTotal)}>
                            {formatCurrency(stats.gastoTotal)}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Acumulado Labores e Insumos</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all border-l-4 border-l-blue-500 bg-white/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Costo Promedio / Ha</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-800 truncate" title={formatCurrency(stats.costoPorHectarea)}>
                            {formatCurrency(stats.costoPorHectarea)}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">En base a {stats.totalHectareas} ha. operativas</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all border-l-4 border-l-amber-500 bg-white/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Lote de Mayor Inversión</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        {Object.keys(stats.gastoPorLote).length > 0 ? (
                            <>
                                <div className="text-2xl font-bold text-slate-800 truncate mt-1">
                                    {Object.entries(stats.gastoPorLote).sort((a,b) => b[1]-a[1])[0]?.[0] || 'N/A'}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Mayor inyección de capital asignado</p>
                            </>
                        ) : (
                            <div className="text-sm text-slate-500">Sin registros este ciclo</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6">
                <Card className="shadow-lg bg-gradient-to-br from-emerald-50/50 to-white border-emerald-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2 text-emerald-800">
                            <Lightbulb className="h-4 w-4 text-emerald-600" />
                            Insights Operativos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {stats.sugerencias.length > 0 ? (
                            stats.sugerencias.map((s, i) => (
                                <div key={i} className="text-sm p-3 bg-white rounded-lg shadow-sm border border-emerald-100/50 text-slate-700 flex items-start gap-3">
                                    <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <span className="leading-relaxed">{s}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-slate-500 pt-2">No se encontraron anomalías en los registros operativos.</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                <Card className="shadow-xl bg-white/80 backdrop-blur-md min-h-[400px] lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-slate-800">Evolución de Inversión Operativa</CardTitle>
                        <CardDescription>Crecimiento acumulado de inyección de capital en el tiempo.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <AnalyticsChart 
                            type="area" 
                            data={[...stats.labores]
                                .sort((a,b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
                                .reduce((acc: any[], labor) => {
                                    const dateStr = new Date(labor.fecha).toLocaleDateString('es-AR', { month: 'short', day: 'numeric' });
                                    const existing = acc.find(item => item.name === dateStr);
                                    if (existing) {
                                        existing[labor.lote] = (existing[labor.lote] || 0) + labor.total;
                                    } else {
                                        const newEntry: any = { name: dateStr };
                                        newEntry[labor.lote] = labor.total;
                                        acc.push(newEntry);
                                    }
                                    return acc;
                                }, [])
                            } 
                        />
                    </CardContent>
                </Card>

                <Card className="shadow-xl bg-white/80 backdrop-blur-md min-h-[400px]">
                    <CardHeader>
                        <CardTitle className="text-slate-800">Composición del Gasto x Lote</CardTitle>
                        <CardDescription>Distribución porcentual de capital a lo largo del establecimiento.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <AnalyticsChart type="pie" data={Object.entries(stats.gastoPorLote).map(([name, value]) => ({ name, value }))} />
                    </CardContent>
                </Card>

                <Card className="shadow-xl bg-white/80 backdrop-blur-md min-h-[400px]">
                    <CardHeader>
                        <CardTitle className="text-slate-800">Inversión por Categoría de Insumo</CardTitle>
                        <CardDescription>Análisis de concentración de capital productivo.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <AnalyticsChart type="bar" data={Object.entries(stats.gastoPorInsumo).map(([name, value]) => ({ name, value }))} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
